import { Box, Flex, Text, HStack, Button, Image, Spinner, VStack, Icon } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { useDispatch } from "react-redux";
import { setUpcomingConsultation } from "mangarine/state/reducers/consultant.reducer";
import { isEmpty } from "es-toolkit/compat";
import { format } from "date-fns";
import AreyouCancellingModal from "./modals/areyoucancelling";
import CancelConsultation from "./modals/cancelconsultationmodal";
import { safeProfilePic, imgErrorFallback } from "mangarine/lib/constants";
import RescheduleConsultation from "./modals/rescheduleconsultation";
import { LuMail, LuVideo, LuCalendar, LuClock } from "react-icons/lu";

// Join window: 10 min before start → 10 min after end (or 65 min after start if no end)
const isJoinableNow = (item: any): boolean => {
  const startRaw = item?.scheduledDateTimeStart ?? item?.scheduledDate;
  if (!startRaw) return false;
  const now = Date.now();
  const start = new Date(startRaw).getTime();
  const endRaw = item?.scheduledDateTimeEnd;
  const end = endRaw ? new Date(endRaw).getTime() : start + 65 * 60 * 1000;
  return now >= start - 10 * 60 * 1000 && now <= end + 10 * 60 * 1000;
};

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

const ActivitiesBox = () => {
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [showCancelSuccess, setShowCancelSuccess] = useState(false);
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
    <Box w="full" bg="bg_box" borderRadius="xl" overflow="hidden">
      {/* Header */}
      <Box px={4} pt={4} pb={2}>
        <Text fontSize="0.95rem" fontWeight="700" color="text_primary" fontFamily="Outfit">
          Activities
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

            return (
              <Box key={item.id}>
                {idx > 0 && <Box mx={4} h="1px" bg="gray.100" my={1} />}
                <Box
                  px={4} py={3}
                  mx={4} mb={idx < appointments.length - 1 ? 0 : 1}
                  borderWidth="1.5px"
                  borderColor="input_border"
                  borderRadius="12px"
                  mt={idx === 0 ? 1 : 0}
                >
                  {/* Consultant row */}
                  <Flex justify="space-between" align="center" mb={3} gap={2}>
                    <HStack gap={2} minW={0} flex={1}>
                      <Image
                        src={safeProfilePic(consultant.profilePics)}
                        onError={imgErrorFallback}
                        alt={consultant.fullName || "Consultant"}
                        boxSize="36px"
                        borderRadius="8px"
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
                        {(consultant.title || consultant.location || item.role) && (
                          <Text
                            fontSize="0.7rem" color="gray.400" fontFamily="Outfit" lineHeight="1.3"
                            whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis"
                            w="full"
                          >
                            {consultant.title || consultant.location || item.role}
                          </Text>
                        )}
                      </VStack>
                    </HStack>

                    <HStack gap={1} flexShrink={0}>
                      <Box
                        w="28px" h="28px"
                        display="flex" alignItems="center" justifyContent="center"
                        bg="gray.100" borderRadius="7px"
                        cursor="pointer" _hover={{ bg: "gray.200" }}
                        onClick={() => item.conversation?.id && router.push(`/message?conversationId=${item.conversation.id}`)}
                      >
                        <Icon color="gray.500" fontSize="13px"><LuMail /></Icon>
                      </Box>
                      {(() => {
                        const joinable = isJoinableNow(item);
                        return (
                          <Box
                            w="28px" h="28px"
                            display="flex" alignItems="center" justifyContent="center"
                            bg={joinable ? "button_bg" : "gray.200"} borderRadius="7px"
                            cursor={joinable ? "pointer" : "not-allowed"}
                            _hover={{ opacity: joinable ? 0.85 : 1 }}
                            onClick={() => joinable && router.push(`/message/videoconsultation?consultationId=${item.id}`)}
                            title={joinable ? 'Join video call' : 'Not within join window'}
                          >
                            <Icon color={joinable ? "button_text" : "gray.400"} fontSize="13px"><LuVideo /></Icon>
                          </Box>
                        );
                      })()}
                    </HStack>
                  </Flex>

                  {/* Date & Time — stacked to avoid wrapping in narrow sidebars */}
                  <VStack
                    align="stretch" gap={0.5}
                    bg="badge_background"
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

                  {/* Buttons */}
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
                      bg="bt_schedule" color="white" flex={1} h="36px"
                      borderRadius="8px" fontSize="0.78rem" fontFamily="Outfit"
                      fontWeight="600" _hover={{ bg: "bt_schedule_hover" }}
                      onClick={() => setRescheduleId(item.id)}
                    >
                      Reschedule
                    </Button>
                  </HStack>
                </Box>
              </Box>
            );
          })}
        </VStack>
      )}

      {appointments.length > 0 && (
        <Text
          textAlign="center" fontWeight="500" color="act_text"
          pb={3} cursor="pointer" fontSize="0.8rem" fontFamily="Outfit"
          onClick={() => router.push("/consultation")}
        >
          View All
        </Text>
      )}

      <AreyouCancellingModal
        isOpen={!!cancelId}
        onOpenChange={() => setCancelId(null)}
        consultationId={cancelId}
        onSuccess={() => setShowCancelSuccess(true)}
      />
      <CancelConsultation
        isOpen={showCancelSuccess}
        onOpenChange={() => setShowCancelSuccess(false)}
      />
      <RescheduleConsultation
        isOpen={!!rescheduleId}
        onOpenChange={() => setRescheduleId(null)}
      />
    </Box>
  );
};

export default ActivitiesBox;
