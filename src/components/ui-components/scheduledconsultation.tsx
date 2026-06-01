import { Box, Flex, Text, HStack, Button, Image, Spinner, VStack, Badge } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { format, isAfter, subMinutes, isBefore, addMinutes } from "date-fns";
import { useRouter } from "next/router";
import AreyouCancellingModal from "./modals/areyoucancelling";
import { safeProfilePic, imgErrorFallback } from "mangarine/lib/constants";
import RescheduleConsultation from "./modals/rescheduleconsultation";

// Returns true when we are within 10 min before start or before end
const isJoinable = (item: any): boolean => {
  const startRaw = item.scheduledDateTimeStart ?? item.scheduledDate;
  const endRaw = item.scheduledDateTimeEnd;
  if (!startRaw) return false;
  const now = new Date();
  const start = new Date(startRaw);
  const canJoinFrom = subMinutes(start, 10);
  const canJoinUntil = endRaw ? addMinutes(new Date(endRaw), 5) : addMinutes(start, 65);
  return isAfter(now, canJoinFrom) && isBefore(now, canJoinUntil);
};

const ScheduledConsultation = () => {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const router = useRouter();

  // Re-render every 30 s so joinable state updates automatically
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading } = useGetUpcomingConsultationQuery({});

  const appointments: any[] = (data as any)?.data?.consultations ?? [];

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

  return (
    <Box
      w={{ base: "100%", md: "100%" }}
      display={{ base: "none", md: "flex" }}
      p={6}
      bg="bg_box"
      borderRadius="lg"
      boxShadow="sm"
      flexDirection="column"
    >
      <Text fontSize="xl" fontWeight="700" mb={4} color="text_primary" fontFamily="Outfit">
        Scheduled Consultation
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
            <Box key={item.id} bg="bg_box" borderRadius="lg" mb={4}>
              <Flex justify="space-between" align="center">
                <HStack gap={3}>
                  <Image
                    src={safeProfilePic(consultant.profilePics)}
                    onError={imgErrorFallback}
                    alt={consultant.fullName || "Consultant"}
                    boxSize="40px"
                    borderRadius="full"
                    objectFit="cover"
                  />
                  <Box>
                    <Text fontWeight="700" color="text_primary" fontSize="0.875rem" fontFamily="Outfit">
                      {consultant.fullName || "Consultant"}
                    </Text>
                    <Text fontSize="xs" color="grey.500" fontFamily="Outfit">
                      {consultant.title || consultant.location || ""}
                    </Text>
                  </Box>
                </HStack>

                <HStack gap={2}>
                  <Box
                    p={2}
                    bg="gray.100"
                    borderRadius="md"
                    _hover={{ bg: "gray.200", cursor: "pointer" }}
                  >
                    <Image src="/icons/greyMail.svg" alt="mail-icon" boxSize="16px" />
                  </Box>
                  <Box
                    p={2}
                    bg="primary.950"
                    borderRadius="md"
                    cursor="pointer"
                    _hover={{ opacity: 0.85 }}
                    onClick={() => router.push(`/message/videoconsultation?consultationId=${item.id}`)}
                    title="Join Call"
                  >
                    <Image src="/icons/greyCamera.svg" alt="Join Call" boxSize="16px" style={{ filter: "brightness(10)" }} />
                  </Box>
                </HStack>
              </Flex>

              {/* Date & Time */}
              <Flex
                align="center"
                justify="space-between"
                bg="time_boxcon"
                p={2}
                borderRadius="md"
                mt={3}
              >
                <HStack gap={1} color="text_primary">
                  <Image src="/icons/cal.svg" alt="calendar" boxSize="14px" />
                  <Text color="text_primary" fontSize="0.8rem" fontFamily="Outfit">
                    {dateLabel}
                  </Text>
                </HStack>
                {timeLabel && (
                  <HStack gap={1} color="text_primary">
                    <Image alt="clock" src="/icons/clock.svg" boxSize="14px" />
                    <Text color="text_primary" fontSize="0.8rem" fontFamily="Outfit">
                      {timeLabel}
                    </Text>
                  </HStack>
                )}
              </Flex>

              {/* Buttons */}
              {isJoinable(item) ? (
                <Flex mt={3} gap={3} direction="column">
                  <Badge
                    colorPalette="green"
                    variant="subtle"
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="0.75rem"
                    w="fit-content"
                  >
                    ● Live now
                  </Badge>
                  <Button
                    bg="#111D4A"
                    color="white"
                    w="full"
                    borderRadius={8}
                    fontSize="0.875rem"
                    fontFamily="Outfit"
                    _hover={{ opacity: 0.85 }}
                    onClick={() => router.push(`/message/videoconsultation?consultationId=${item.id}`)}
                  >
                    Join Consultation
                  </Button>
                </Flex>
              ) : (
                <Flex mt={3} gap={3}>
                  <Button
                    variant="outline"
                    borderColor="gray.300"
                    color="button_bg"
                    flex={1}
                    borderRadius={8}
                    fontSize="0.875rem"
                    fontFamily="Outfit"
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
                    fontFamily="Outfit"
                    _hover={{ bg: "bt_schedule_hover" }}
                    onClick={() => setRescheduleId(item.id)}
                  >
                    Reschedule
                  </Button>
                </Flex>
              )}
            </Box>
          );
        })
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

export default ScheduledConsultation;
