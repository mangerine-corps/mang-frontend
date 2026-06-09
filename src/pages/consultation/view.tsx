import { useEffect, useMemo, useState } from 'react';
import { Box, Button, HStack, Text, VStack, Spinner, Flex } from '@chakra-ui/react';
import { useCountdown, resolveStartTime } from 'mangarine/hooks/useCountdown';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useGetAppointmentByIdQuery, useCancelAppointmentMutation } from 'mangarine/state/services/apointment.service';
import CustomButton from 'mangarine/components/customcomponents/button';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { outfit } from '../_app';

const urgencyConfig = {
  future:   { bg: 'transparent',  border: 'transparent', labelColor: '#5f6368', joinBg: '#111D4A', joinLabel: 'Join Call' },
  soon:     { bg: '#FFF3E0',      border: '#FFB74D',      labelColor: '#E65100', joinBg: '#111D4A', joinLabel: 'Join Call' },
  imminent: { bg: '#FFF3E0',      border: '#FF9800',      labelColor: '#E65100', joinBg: '#FF9800', joinLabel: 'Join Now' },
  now:      { bg: '#E8F5E9',      border: '#66BB6A',      labelColor: '#2E7D32', joinBg: '#2E7D32', joinLabel: 'Join Now — Starting!' },
};

const ConsultationJoinSection = ({
  appointment, isCancelling, onCancel, onReschedule, onJoin,
}: {
  appointment: any;
  isCancelling: boolean;
  onCancel: () => void;
  onReschedule: () => void;
  onJoin: () => void;
}) => {
  const startTime = resolveStartTime(appointment);
  const countdown = useCountdown(startTime);
  const cfg = urgencyConfig[countdown.urgency] ?? urgencyConfig.future;
  const isUrgent = countdown.urgency === 'imminent' || countdown.urgency === 'now' || countdown.isPast;

  return (
    <VStack w="full" gap={3} pt={2}>
      {/* Countdown banner — only shown when time info is available */}
      {startTime && (
        <Box
          w="full"
          px={4}
          py={3}
          borderRadius="12px"
          bg={cfg.bg}
          borderWidth={isUrgent ? '1.5px' : '0'}
          borderColor={cfg.border}
        >
          <HStack justify="space-between" align="center">
            <VStack align="start" gap={0}>
              <Text fontSize="0.78rem" color="#888" fontFamily="Outfit">Starts</Text>
              <HStack gap={2} align="center">
                {(countdown.urgency === 'now' || countdown.isPast) && (
                  <Box
                    w="8px" h="8px" borderRadius="full" bg="#2E7D32"
                    style={{ animation: 'dot-blink 1.2s ease-in-out infinite' }}
                  />
                )}
                <style>{`@keyframes dot-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
                <Text fontSize="1rem" fontWeight="700" color={cfg.labelColor} fontFamily="Outfit">
                  {countdown.isPast ? 'Right now' : countdown.label}
                </Text>
              </HStack>
            </VStack>
            {isUrgent && (
              <Text fontSize="0.75rem" color={cfg.labelColor} fontWeight="600" fontFamily="Outfit">
                {countdown.urgency === 'now' || countdown.isPast ? 'Live' : `${countdown.minutes}m left`}
              </Text>
            )}
          </HStack>
        </Box>
      )}

      {/* Join button */}
      <Button
        w="full"
        bg={cfg.joinBg}
        color="white"
        borderRadius="10px"
        h="52px"
        fontSize="1rem"
        fontWeight="700"
        _hover={{ opacity: 0.88 }}
        onClick={onJoin}
        style={isUrgent ? { boxShadow: `0 0 0 4px ${cfg.border}40` } : undefined}
      >
        {cfg.joinLabel}
      </Button>

      {/* Secondary actions */}
      <HStack w="full" gap={3}>
        <CustomButton customStyle={{ flex: 1 }} variant="outline" disabled={isCancelling} onClick={onCancel}>
          <Text fontWeight="600" fontSize="0.9rem">Cancel</Text>
        </CustomButton>
        <CustomButton customStyle={{ flex: 1 }} onClick={onReschedule}>
          <Text color="button_text" fontWeight="600" fontSize="0.9rem">Reschedule</Text>
        </CustomButton>
      </HStack>
    </VStack>
  );
};

export default function ConsultationViewPage() {
    const router = useRouter();
    const [client, setClient] = useState(false);
    const { resolvedTheme } = useTheme();
    const { user: authUser } = useAuth();

    const { consultation_id } = router.query as Record<string, string>;
    const { data: apptResp, isLoading: isApptLoading, error: apptError, refetch } = useGetAppointmentByIdQuery(consultation_id as string, { skip: !consultation_id });
    const appointment: any = (apptResp as any)?.data ?? apptResp ?? null;
    const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();

    const isConsultantViewer = !!authUser?.isConsultant;
    const counterpart = useMemo(() => {
        if (!appointment) return null;
        const maybeConsultant = appointment?.consultant || appointment?.consultantInfo || appointment?.creator || appointment?.provider;
        return isConsultantViewer ? appointment?.user : maybeConsultant;
    }, [appointment, isConsultantViewer]);

    useEffect(() => {
        setClient(true);
    }, []);

    const isDark = resolvedTheme === 'dark';
    const panelBg = isDark ? 'gray.800' : 'white';

    // Loading state
    if (isApptLoading) {
        return (
            <Flex w="full" h="full" justify="center" align="center" py={16}>
                <Spinner size="lg" />
            </Flex>
        );
    }

    // Error state
    if (apptError) {
        return (
            <Flex w="full" h="full" justify="center" align="center" py={16}>
                <VStack gap={3} textAlign="center">
                    <Text fontSize="1rem" fontWeight="600" color="text_primary">
                        Failed to load appointment
                    </Text>
                    <Text fontSize="0.875rem" color="gray.500">
                        The appointment could not be found or you don't have access.
                    </Text>
                    <Button
                        bg="#111D4A" color="white" borderRadius="8px" px={6}
                        onClick={() => router.push('/consultation')}
                    >
                        Back to Consultations
                    </Button>
                </VStack>
            </Flex>
        );
    }

    // Empty state — no consultation_id in URL or no data returned
    if (!consultation_id || !appointment) {
        return (
            <Flex w="full" h="full" justify="center" align="center" py={16}>
                <VStack gap={3} textAlign="center">
                    <Text fontSize="1rem" fontWeight="600" color="text_primary">
                        No appointment found
                    </Text>
                    <Text fontSize="0.875rem" color="gray.500">
                        This consultation doesn't exist or may have been removed.
                    </Text>
                    <Button
                        bg="#111D4A" color="white" borderRadius="8px" px={6}
                        onClick={() => router.push('/consultation')}
                    >
                        View My Consultations
                    </Button>
                </VStack>
            </Flex>
        );
    }

    return (
        <VStack
            bg='bg_box'
            mx={{ base: "0", md: 4, lg: 4, xl: 4 }}
            flex={1}
            h="fit-content"
            p={8}
            css={{
                "&::-webkit-scrollbar": { width: "0px", height: "0px" },
                "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
                "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", maxHeight: "0px", height: "0px", width: 0 },
            }}
            rounded={"xl"}
        >
            <VStack w="full" py="2" alignItems="flex-start">
                <Text fontSize="1.25rem" fontWeight="600" mb="2" textAlign="left" lineHeight="30px" color="text_primary">
                    Appointment Details
                </Text>

                <VStack w="full" rounded="xl" p="4" shadow="xs">
                    <HStack justifyContent={"space-between"} alignItems={"center"} w="full">
                        <Text color="grey.500" fontSize="1.25rem" lineHeight="30px" fontWeight="400">
                            {isConsultantViewer ? 'Client Name:' : 'Consultant:'}
                        </Text>
                        <Text color="text_primary" fontSize="1.25rem" lineHeight="30px" fontWeight="400" textTransform="capitalize">
                            {/* Fix: consultant viewers see the client name, not their own */}
                            {isConsultantViewer ? appointment?.user?.fullName : appointment?.consultant?.fullName || '-'}
                        </Text>
                    </HStack>
                    <HStack justifyContent={"space-between"} alignItems={"center"} w="full">
                        <Text color="grey.500" fontSize="1.25rem" lineHeight="30px" fontWeight="400">
                            Consultation Topic:
                        </Text>
                        <Text color="text_primary" fontSize="1.25rem" lineHeight="30px" fontWeight="400">
                            {appointment?.topic || appointment?.title || appointment?.message || '-'}
                        </Text>
                    </HStack>
                    <HStack justifyContent={"space-between"} alignItems={"center"} w="full">
                        <Text color="grey.500" fontSize="1.25rem" lineHeight="30px" fontWeight="400">
                            Consultation time:
                        </Text>
                        <Text color="text_primary" fontSize="1.25rem" lineHeight="30px" fontWeight="400">
                            {(() => {
                                const ts = appointment?.timeslots?.[0] || {};
                                const rawStart = ts?.startTime || appointment?.startTime;
                                const rawEnd = ts?.endTime || appointment?.endTime;
                                const rawDate = appointment?.availability?.date || appointment?.date || ts?.date;

                                const to12h = (t: any) => {
                                    if (!t) return null;
                                    const d = new Date(t);
                                    if (!isNaN(d.getTime())) {
                                        return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                                    }
                                    const m = String(t).match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
                                    if (m) {
                                        let h = parseInt(m[1], 10);
                                        const min = m[2];
                                        const ampm = h >= 12 ? 'PM' : 'AM';
                                        h = h % 12 || 12;
                                        return `${h}:${min} ${ampm}`;
                                    }
                                    return String(t);
                                };

                                const fmtDate = (d: any) => {
                                    if (!d) return null;
                                    const dt = new Date(d);
                                    if (!isNaN(dt.getTime())) {
                                        return dt.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
                                    }
                                    return String(d);
                                };

                                const s = to12h(rawStart);
                                const e = to12h(rawEnd);
                                const ds = fmtDate(rawDate);

                                if (s || e || ds) {
                                    const timeRange = [s, e].filter(Boolean).join(' - ');
                                    return [ds, timeRange].filter(Boolean).join(' | ');
                                }
                                return '-';
                            })()}
                        </Text>
                    </HStack>
                    <HStack justifyContent={"space-between"} alignItems={"center"} w="full">
                        <Text color="grey.500" fontSize="1.25rem" lineHeight="30px" fontWeight="400">
                            Duration:
                        </Text>
                        <Text color="text_primary" fontSize="1.25rem" lineHeight="30px" fontWeight="400">
                            {(() => {
                                const minutes = appointment?.timeslots?.[0]?.duration;
                                if (!minutes && minutes !== 0) return '-';
                                const h = Math.floor(minutes / 60);
                                const m = minutes % 60;
                                const hStr = h > 0 ? `${h}hr${h > 1 ? 's' : ''}` : '';
                                const mStr = m > 0 ? `${m}mins` : (h === 0 ? '0mins' : '');
                                return [hStr, mStr].filter(Boolean).join(':');
                            })()}
                        </Text>
                    </HStack>
                    <HStack justifyContent={"space-between"} alignItems={"center"} w="full">
                        <Text color="grey.500" fontSize="1.25rem" lineHeight="30px" fontWeight="400">
                            Status:
                        </Text>
                        <Text color="#FF9800" fontSize="1.25rem" lineHeight="30px" fontWeight="400">
                            {appointment?.status || 'Scheduled'}
                        </Text>
                    </HStack>
                </VStack>
            </VStack>

            {/* Counterpart Details */}
            {counterpart && (
                <VStack w="full" py="2" rounded="xl" p="4" shadow="xs" mt={2} mb={4} alignItems="stretch">
                    <Text color="text_primary" fontSize="1.25rem" lineHeight="30px" fontWeight="600" mb={2}>
                        {isConsultantViewer ? 'Client Details' : 'Consultant Details'}
                    </Text>
                    <HStack justifyContent="space-between" alignItems="center" w="full">
                        <Text color="grey.500" fontSize="1.0rem" lineHeight="26px" fontWeight="400">Name:</Text>
                        <Text textTransform="capitalize" color="text_primary" fontSize="1.0rem" lineHeight="26px" fontWeight="500">
                            {counterpart?.fullName || counterpart?.name || counterpart?.userName || '-'}
                        </Text>
                    </HStack>
                    <HStack justifyContent="space-between" alignItems="center" w="full">
                        <Text color="grey.500" fontSize="1.0rem" lineHeight="26px" fontWeight="400">Email:</Text>
                        <Text color="text_primary" fontSize="1.0rem" lineHeight="26px" fontWeight="400">
                            {counterpart?.email || counterpart?.contactEmail || '-'}
                        </Text>
                    </HStack>
                    <HStack justifyContent="space-between" alignItems="center" w="full">
                        <Text color="grey.500" fontSize="1.0rem" lineHeight="26px" fontWeight="400">Role/Title:</Text>
                        <Text color="text_primary" fontSize="1.0rem" lineHeight="26px" fontWeight="400">
                            {counterpart?.role || counterpart?.title || counterpart?.occupation || '-'}
                        </Text>
                    </HStack>
                    <HStack justifyContent="space-between" alignItems="center" w="full">
                        <Text color="grey.500" fontSize="1.0rem" lineHeight="26px" fontWeight="400">Phone:</Text>
                        <Text color="text_primary" fontSize="1.0rem" lineHeight="26px" fontWeight="400">
                            {counterpart?.mobileNumber || counterpart?.phone || counterpart?.phoneNumber || '-'}
                        </Text>
                    </HStack>
                </VStack>
            )}

            {['UPCOMING', 'RESCHEDULED', 'CONFIRMED', 'PENDING'].includes((appointment?.status || '').toUpperCase()) && (
                <ConsultationJoinSection
                    appointment={appointment}
                    isCancelling={isCancelling}
                    onCancel={() => router.push(`/consultation/cancel?consultation_id=${consultation_id}`)}
                    onReschedule={() => router.push(`/consultation/reschedule?consultation_id=${consultation_id}`)}
                    onJoin={() => router.push(`/message/videoconsultation?consultationId=${consultation_id}`)}
                />
            )}
        </VStack>
    );
}
