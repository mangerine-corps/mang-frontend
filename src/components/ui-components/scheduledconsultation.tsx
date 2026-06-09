import { Box, Flex, Text, HStack, Button, Image, Spinner, VStack, Icon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { format, isAfter, subMinutes, isBefore, addMinutes } from "date-fns";
import { useRouter } from "next/router";
import AreyouCancellingModal from "./modals/areyoucancelling";
import { safeProfilePic, imgErrorFallback } from "mangarine/lib/constants";
import RescheduleConsultation from "./modals/rescheduleconsultation";
import { LuMail, LuVideo, LuCalendar, LuClock } from "react-icons/lu";

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

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(timer);
  }, []);

  const { data, isLoading } = useGetUpcomingConsultationQuery({});
  const appointments: any[] = (data as any)?.data?.consultations ?? [];

  const fmtTime = (val: string) => {
    if (!val) return "";
    try { return format(new Date(val), "HH:mm"); }
    catch { return val; }
  };

  const fmtDate = (val: string) => {
    if (!val) return "";
    try { return format(new Date(val), "MMM d, yyyy"); }
    catch { return val; }
  };

  return (
    <Box
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      bg="bg_box"
      borderRadius="xl"
      boxShadow="sm"
      overflow="hidden"
    >
      {/* Header */}
      <Box px={4} pt={4} pb={2}>
        <Text fontSize="0.95rem" fontWeight="700" color="text_primary" fontFamily="Outfit">
          Scheduled Consultation
        </Text>
      </Box>

      {isLoading ? (
        <HStack justify="center" py={6} px={4}>
          <Spinner size="sm" color="gray.400" />
          <Text fontSize="0.8rem" color="gray.400" fontFamily="Outfit">Loading…</Text>
        </HStack>
      ) : appointments.length === 0 ? (
        <Box py={6} px={4} textAlign="center">
          <Text fontSize="0.8rem" color="gray.400" fontFamily="Outfit">
            No upcoming consultations
          </Text>
        </Box>
      ) : (
        <VStack gap={0} align="stretch" pb={3}>
          {appointments.map((item: any, idx: number) => {
            const consultant = item.consultant ?? {};
            const dateLabel = item.dateDisplay ?? fmtDate(item.scheduledDateTimeStart ?? item.scheduledDate ?? "");
            const timeStart = fmtTime(item.scheduledDateTimeStart ?? "");
            const timeEnd = fmtTime(item.scheduledDateTimeEnd ?? "");
            const timeLabel = item.timeRangeDisplay ?? (timeStart ? `${timeStart}${timeEnd ? ` - ${timeEnd}` : ""}` : "");
            const joinable = isJoinable(item);

            return (
              <Box key={item.id}>
                {idx > 0 && <Box mx={4} h="1px" bg="gray.100" my={1} />}
                <Box px={4} py={3}>

                  {/* Consultant row */}
                  <Flex justify="space-between" align="center" mb={3} gap={2}>
                    <HStack gap={2} minW={0} flex={1}>
                      <Image
                        src={safeProfilePic(consultant.profilePics)}
                        onError={imgErrorFallback}
                        alt={consultant.fullName || "Consultant"}
                        boxSize="34px"
                        borderRadius="full"
                        objectFit="cover"
                        flexShrink={0}
                      />
                      <VStack align="flex-start" gap={0} minW={0} flex={1}>
                        <Text
                          fontWeight="600" color="text_primary" fontSize="0.8rem"
                          fontFamily="Outfit" lineHeight="1.3"
                          whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis"
                          w="full"
                        >
                          {consultant.fullName || "Consultant"}
                        </Text>
                        {(consultant.title || consultant.location) && (
                          <Text
                            fontSize="0.7rem" color="gray.400" fontFamily="Outfit" lineHeight="1.3"
                            whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis"
                            w="full"
                          >
                            {consultant.title || consultant.location}
                          </Text>
                        )}
                      </VStack>
                    </HStack>

                    {/* Action icons */}
                    <HStack gap={1} flexShrink={0}>
                      <Box
                        w="28px" h="28px"
                        display="flex" alignItems="center" justifyContent="center"
                        bg="gray.100" borderRadius="7px"
                        cursor="pointer" _hover={{ bg: "gray.200" }}
                        flexShrink={0}
                        onClick={() => item.conversation?.id && router.push(`/message?conversationId=${item.conversation.id}`)}
                      >
                        <Icon color="gray.500" fontSize="13px"><LuMail /></Icon>
                      </Box>
                      <Box
                        w="28px" h="28px"
                        display="flex" alignItems="center" justifyContent="center"
                        bg="#111D4A" borderRadius="7px"
                        cursor="pointer" _hover={{ opacity: 0.85 }}
                        flexShrink={0}
                        onClick={() => router.push(`/message/videoconsultation?consultationId=${item.id}`)}
                      >
                        <Icon color="white" fontSize="13px"><LuVideo /></Icon>
                      </Box>
                    </HStack>
                  </Flex>

                  {/* Date & Time — stacked vertically to fit narrow sidebar */}
                  <VStack
                    align="stretch" gap={0}
                    bg="time_boxcon"
                    borderRadius="8px"
                    px={3} py={2}
                    mb={3}
                  >
                    {dateLabel && (
                      <HStack gap={1.5}>
                        <Icon color="gray.400" fontSize="12px" flexShrink={0}><LuCalendar /></Icon>
                        <Text fontSize="0.75rem" color="text_primary" fontFamily="Outfit">
                          {dateLabel}
                        </Text>
                      </HStack>
                    )}
                    {timeLabel && (
                      <HStack gap={1.5}>
                        <Icon color="gray.400" fontSize="12px" flexShrink={0}><LuClock /></Icon>
                        <Text fontSize="0.75rem" color="text_primary" fontFamily="Outfit">
                          {timeLabel}
                        </Text>
                      </HStack>
                    )}
                  </VStack>

                  {/* Actions */}
                  {joinable ? (
                    <Button
                      bg="#111D4A" color="white" w="full" h="36px"
                      borderRadius="8px" fontSize="0.8rem" fontFamily="Outfit"
                      fontWeight="600" _hover={{ opacity: 0.85 }}
                      onClick={() => router.push(`/message/videoconsultation?consultationId=${item.id}`)}
                    >
                      ● Join Now
                    </Button>
                  ) : (
                    <HStack gap={2}>
                      <Button
                        variant="outline" borderColor="gray.200" color="text_primary"
                        flex={1} h="36px" borderRadius="8px"
                        fontSize="0.78rem" fontFamily="Outfit" fontWeight="500"
                        _hover={{ bg: "gray.50" }}
                        onClick={() => setCancelId(item.id)}
                      >
                        Cancel
                      </Button>
                      <Button
                        bg="#111D4A" color="white" flex={1} h="36px"
                        borderRadius="8px" fontSize="0.78rem" fontFamily="Outfit"
                        fontWeight="600" _hover={{ opacity: 0.85 }}
                        onClick={() => setRescheduleId(item.id)}
                      >
                        Reschedule
                      </Button>
                    </HStack>
                  )}
                </Box>
              </Box>
            );
          })}
        </VStack>
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
