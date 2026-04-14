import { Box, Flex, Text, HStack, Button, Image, Spinner, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { format } from "date-fns";
import { useRouter } from "next/router";
import AreyouCancellingModal from "./modals/areyoucancelling";
import RescheduleConsultation from "./modals/rescheduleconsultation";

const ScheduledConsultation = () => {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const router = useRouter();

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
                    src={consultant.profilePics || "/images/dp.png"}
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
