import { Box, Flex, Text, HStack, Button, Image, Spinner, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUpcomingConsultation } from "mangarine/state/reducers/consultant.reducer";
import { isEmpty } from "es-toolkit/compat";
import { format } from "date-fns";
import AreyouCancellingModal from "./modals/areyoucancelling";
import RescheduleConsultation from "./modals/rescheduleconsultation";

const formatTime = (val: string) => {
  if (!val) return "";
  try {
    return format(new Date(val), "h:mmaa");
  } catch {
    return val;
  }
};

const formatDateLabel = (val: string) => {
  if (!val) return "";
  try {
    return format(new Date(val), "MMMM d, yyyy");
  } catch {
    return val;
  }
};

const ActivitiesBox = () => {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const router = useRouter();

  const { data: upcomingData, currentData, isLoading } = useGetUpcomingConsultationQuery({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isEmpty(upcomingData)) {
      const { data } = upcomingData as any;
      dispatch(setUpcomingConsultation(data?.consultations));
    } else if (!isEmpty(currentData)) {
      const { data } = currentData as any;
      dispatch(setUpcomingConsultation(data?.consultations));
    }
  }, [upcomingData, currentData, dispatch]);

  const appointments: any[] = (upcomingData as any)?.data?.consultations ?? [];

  return (
    <Box
      w="full"
      bg="bg_box"
      p="4"
      rounded="15px"
      alignItems="flex-start"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4} color="text_primary">
        Activities
      </Text>

      {isLoading ? (
        <HStack justify="center" py={6}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.500" fontFamily="Outfit">Loading...</Text>
        </HStack>
      ) : appointments.length === 0 ? (
        <VStack py={6} gap={2}>
          <Text fontSize="sm" color="gray.400" fontFamily="Outfit" textAlign="center">
            No upcoming consultations.
          </Text>
        </VStack>
      ) : (
        appointments.map((item: any) => {
          const consultant = item.consultant ?? {};
          const dateLabel: string = item.dateDisplay ?? formatDateLabel(item.scheduledDateTimeStart ?? item.scheduledDate ?? "");
          const timeLabel: string = item.timeRangeDisplay ?? (
            item.scheduledDateTimeStart
              ? `${formatTime(item.scheduledDateTimeStart)}${item.scheduledDateTimeEnd ? ` - ${formatTime(item.scheduledDateTimeEnd)}` : ""}`
              : ""
          );

          return (
            <Box
              key={item.id}
              mb={4}
              borderWidth="1.5px"
              borderColor="input_border"
              borderRadius="12px"
              p={3}
            >
              <Flex justify="space-between" align="center">
                <HStack gap={3}>
                  <Image
                    src={consultant.profilePics || "/images/dp.png"}
                    alt={consultant.fullName || "Consultant"}
                    boxSize="44px"
                    borderRadius="8px"
                    objectFit="cover"
                  />
                  <Box>
                    <Text fontWeight="bold" color="text_primary" fontSize="0.875rem">
                      {consultant.fullName || "Consultant"}
                    </Text>
                    <Text fontSize="sm" color="grey.500">
                      {consultant.title || consultant.location || item.role || ""}
                    </Text>
                  </Box>
                </HStack>

                <HStack gap={2}>
                  <Box
                    p={2}
                    bg="gray.100"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: "gray.200" }}
                  >
                    <Image src="/icons/greyMail.svg" alt="mail-icon" boxSize="16px" />
                  </Box>
                  <Box
                    p={2}
                    bg="gray.100"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ bg: "gray.200" }}
                  >
                    <Image src="/icons/greyCamera.svg" alt="camera" boxSize="16px" />
                  </Box>
                </HStack>
              </Flex>

              {/* Date & Time */}
              <Flex
                align="center"
                justify="space-between"
                bg="badge_background"
                p={2}
                borderRadius="md"
                mt={3}
              >
                <HStack gap={1} color="text_primary">
                  <Image src="/icons/cal.svg" alt="calendar" boxSize="14px" />
                  <Text color="text_primary" fontSize="0.8rem">
                    {dateLabel}
                  </Text>
                </HStack>
                {timeLabel && (
                  <HStack gap={1} color="text_primary">
                    <Image alt="clock" src="/icons/clock.svg" boxSize="14px" />
                    <Text color="text_primary" fontSize="0.8rem">
                      {timeLabel}
                    </Text>
                  </HStack>
                )}
              </Flex>

              {/* Buttons */}
              <Flex mt={3} gap={3}>
                <Button
                  variant="outline"
                  borderColor="primary.500"
                  color="primary.500"
                  bg="transparent"
                  flex={1}
                  borderRadius={8}
                  fontSize="0.875rem"
                  _hover={{ bg: "transparent" }}
                  onClick={() => setCancelId(item.id)}
                >
                  Cancel
                </Button>
                <Button
                  bg="bt_schedule"
                  color="white"
                  flex={1}
                  borderRadius={8}
                  fontSize="0.875rem"
                  _hover={{ bg: "bt_schedule_hover" }}
                  onClick={() => setRescheduleId(item.id)}
                >
                  Reschedule
                </Button>
              </Flex>
            </Box>
          );
        })
      )}

      {appointments.length > 0 && (
        <Text
          textAlign="center"
          fontWeight="500"
          color="act_text"
          mt={2}
          cursor="pointer"
          fontSize="0.875rem"
          onClick={() => router.push("/consultation")}
        >
          View All
        </Text>
      )}

      <AreyouCancellingModal
        isOpen={!!cancelId}
        onOpenChange={() => setCancelId(null)}
      />
      <RescheduleConsultation
        isOpen={!!rescheduleId}
        onOpenChange={() => setRescheduleId(null)}
      />
    </Box>
  );
};

export default ActivitiesBox;
