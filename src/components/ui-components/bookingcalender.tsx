import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import { useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  LuCircleAlert,
  LuCalendarDays,
  LuChevronLeft,
  LuChevronRight,
  LuExternalLink,
} from "react-icons/lu";

type AppointmentParty = {
  fullName?: string;
  profilePics?: string;
};

type AppointmentLike = {
  consultant?: AppointmentParty;
  dateDisplay?: string;
  id?: string;
  user?: AppointmentParty;
};

type CalendarDay = {
  date: Date;
  items: AppointmentLike[];
  key: string;
};

const formatDayLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    weekday: "short",
  })
    .format(date)
    .replace(",", "");

const formatShortDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(date);

const buildRangeLabel = (days: CalendarDay[]) => {
  if (!days.length) {
    return "Bookings";
  }

  const first = days[0].date;
  const last = days[days.length - 1].date;

  if (!first || !last) {
    return "Bookings";
  }

  return `${formatShortDate(first)} - ${formatShortDate(last)} ${last.getFullYear()}`;
};

const createPlaceholderDay = (baseDate: Date, offset = 0): CalendarDay => {
  const nextDate = new Date(baseDate);
  nextDate.setDate(baseDate.getDate() + offset);

  return {
    date: nextDate,
    items: [],
    key: nextDate.toISOString().slice(0, 10),
  };
};

const getCounterpart = (appointment: AppointmentLike, isConsultant?: boolean) =>
  isConsultant ? appointment?.user : appointment?.consultant;

const DayRow = ({
  appointments,
  icon,
  tone,
  userIsConsultant,
}: {
  appointments: AppointmentLike[];
  icon: typeof LuCalendarDays;
  tone: "high" | "normal";
  userIsConsultant?: boolean;
}) => {
  const visiblePeople = appointments
    .map((appointment) => getCounterpart(appointment, userIsConsultant))
    .filter(Boolean)
    .slice(0, 2);
  const extraCount = Math.max(appointments.length - visiblePeople.length, 0);

  return (
    <HStack justifyContent="space-between" alignItems="center" w="full">
      <HStack gap={2} alignItems="center">
        <Box
          boxSize="7"
          rounded="full"
          bg={tone === "high" ? "red.500" : "primary.600"}
          color="white"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Icon as={icon} boxSize={3.5} />
        </Box>
        <HStack gap={-2}>
          {visiblePeople.map((person, index) => (
            <Avatar.Root
              key={`${person?.fullName ?? "person"}-${index}`}
              boxSize="6"
              borderWidth="2px"
              borderColor="bg_box"
              bg="gray.100"
            >
              <Avatar.Fallback name={person?.fullName} />
              <Avatar.Image src={person?.profilePics} />
            </Avatar.Root>
          ))}
          {extraCount > 0 && (
            <Text color="grey.600" fontSize="xs" fontWeight="500" pl="1">
              +{extraCount}
            </Text>
          )}
        </HStack>
      </HStack>
    </HStack>
  );
};

const BookingCalendar = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { upcomingConsultation } = useConsultants();
  const { data: upcomingData, currentData } = useGetUpcomingConsultationQuery({});
  const [windowStart, setWindowStart] = useState(0);

  const consultations = useMemo(() => {
    if (Array.isArray(upcomingConsultation) && upcomingConsultation.length > 0) {
      return upcomingConsultation as AppointmentLike[];
    }

    return (
      ((upcomingData as any)?.data?.consultations as AppointmentLike[]) ||
      ((currentData as any)?.data?.consultations as AppointmentLike[]) ||
      []
    );
  }, [currentData, upcomingConsultation, upcomingData]);

  const groupedDays = useMemo(() => {
    const groups = new Map<string, CalendarDay>();

    consultations.forEach((appointment, index) => {
      const parsedDate = appointment?.dateDisplay
        ? new Date(appointment.dateDisplay)
        : new Date(NaN);

      if (Number.isNaN(parsedDate.getTime())) {
        return;
      }

      const key = parsedDate.toISOString().slice(0, 10);

      if (!groups.has(key)) {
        groups.set(key, {
          date: parsedDate,
          items: [],
          key,
        });
      }

      groups.get(key)?.items.push({ ...appointment, id: appointment?.id ?? String(index) });
    });

    return Array.from(groups.values()).sort(
      (first, second) => first.date.getTime() - second.date.getTime()
    );
  }, [consultations]);

  const calendarDays = useMemo(() => {
    if (groupedDays.length === 0) {
      const today = new Date();
      return [createPlaceholderDay(today), createPlaceholderDay(today, 1)];
    }

    return groupedDays;
  }, [groupedDays]);

  useEffect(() => {
    setWindowStart((current) => {
      const maxStart = Math.max(calendarDays.length - 2, 0);
      return Math.min(current, maxStart);
    });
  }, [calendarDays.length]);

  const visibleDaysBase = calendarDays.slice(windowStart, windowStart + 2);
  const visibleDays =
    visibleDaysBase.length === 1
      ? [
          visibleDaysBase[0],
          createPlaceholderDay(visibleDaysBase[0].date, 1),
        ]
      : visibleDaysBase;

  const canGoBack = windowStart > 0;
  const canGoForward = windowStart + 2 < calendarDays.length;

  return (
    <Box
      bg="bg_box"
      rounded="xl"
      borderWidth="1px"
      borderColor="#E8E8E9"
      p={4}
      display={{ base: "none", md: "block", lg: "block" }}
    >
      <Stack gap={4}>
        <Text
          fontFamily="Outfit"
          fontWeight="600"
          fontSize="1rem"
          color="text_primary"
        >
          Bookings Calendar
        </Text>

        <Flex justify="space-between" align="center" gap={3}>
          <HStack
            bg="badge_background"
            rounded="full"
            px={2}
            py={1}
            gap={1}
          >
            <IconButton
              aria-label="Previous days"
              variant="ghost"
              size="xs"
              onClick={() => setWindowStart((current) => Math.max(current - 1, 0))}
              disabled={!canGoBack}
            >
              <LuChevronLeft />
            </IconButton>
            <Text
              fontFamily="Outfit"
              fontWeight="500"
              fontSize="0.875rem"
              color="text_primary"
              minW="132px"
              textAlign="center"
            >
              {buildRangeLabel(visibleDays)}
            </Text>
            <IconButton
              aria-label="Next days"
              variant="ghost"
              size="xs"
              onClick={() =>
                setWindowStart((current) =>
                  Math.min(current + 1, Math.max(calendarDays.length - 2, 0))
                )
              }
              disabled={!canGoForward}
            >
              <LuChevronRight />
            </IconButton>
          </HStack>

          <Box w="1px" h="8" bg="#E8E8E9" />

          <IconButton
            aria-label="Open bookings"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/consultation")}
          >
            <LuExternalLink />
          </IconButton>
        </Flex>

        <Flex
          borderWidth="1px"
          borderColor="#E8E8E9"
          rounded="xl"
          overflow="hidden"
          minH="116px"
        >
          {visibleDays.map((day, index) => {
            const normalAppointments = day.items.slice(0, 4);
            const highAppointments = day.items.slice(4);

            return (
              <Box
                key={day.key}
                flex="1"
                borderLeftWidth={index === 0 ? "0" : "1px"}
                borderColor="#E8E8E9"
              >
                <Box
                  py={3}
                  px={3}
                  borderBottomWidth="1px"
                  borderColor="#E8E8E9"
                  textAlign="center"
                >
                  <Text
                    fontFamily="Outfit"
                    fontWeight="500"
                    fontSize="0.875rem"
                    color="text_primary"
                  >
                    {formatDayLabel(day.date)}
                  </Text>
                </Box>

                <VStack align="stretch" gap={3} px={4} py={4} minH="74px">
                  {normalAppointments.length > 0 && (
                    <DayRow
                      appointments={normalAppointments}
                      icon={LuCalendarDays}
                      tone="normal"
                      userIsConsultant={user?.isConsultant}
                    />
                  )}
                  {highAppointments.length > 0 && (
                    <DayRow
                      appointments={highAppointments}
                      icon={LuCircleAlert}
                      tone="high"
                      userIsConsultant={user?.isConsultant}
                    />
                  )}
                </VStack>
              </Box>
            );
          })}
        </Flex>

        <HStack gap={6} alignItems="center">
          <HStack gap={2}>
            <Box
              boxSize="7"
              rounded="full"
              bg="primary.600"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={LuCalendarDays} boxSize={3.5} />
            </Box>
            <Text fontFamily="Outfit" fontSize="0.875rem" color="text_primary">
              Normal
            </Text>
          </HStack>

          <HStack gap={2}>
            <Box
              boxSize="7"
              rounded="full"
              bg="red.500"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={LuCircleAlert} boxSize={3.5} />
            </Box>
            <Text fontFamily="Outfit" fontSize="0.875rem" color="text_primary">
              High
            </Text>
          </HStack>
        </HStack>
      </Stack>
    </Box>
  );
};

export default BookingCalendar;
