import { useEffect, useMemo, useState } from 'react';
import {
  Box, Button, HStack, Image, Text, VStack,
  Skeleton, SkeletonCircle, Flex, Icon,
} from '@chakra-ui/react';
import { useCountdown, resolveStartTime } from 'mangarine/hooks/useCountdown';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import {
  useGetAppointmentByIdQuery,
  useCancelAppointmentMutation,
} from 'mangarine/state/services/apointment.service';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { outfit } from '../_app';
import { format } from 'date-fns';
import { LuArrowLeft, LuCalendar, LuClock, LuUser, LuVideo } from 'react-icons/lu';
import { safeProfilePic, imgErrorFallback } from 'mangarine/lib/constants';

// ── Status badge ──────────────────────────────────────────────────────────────

const statusColorMap: Record<string, { color: string; bg: string }> = {
  COMPLETED:   { color: '#16A34A', bg: '#DCFCE7' },
  CANCELLED:   { color: '#DC2626', bg: '#FEE2E2' },
  RESCHEDULED: { color: '#111D4A', bg: '#B5B9C7' },
  PENDING:     { color: '#111D4A', bg: '#E7E8ED' },
  UPCOMING:    { color: '#111D4A', bg: '#E7E8ED' },
  CONFIRMED:   { color: '#16A34A', bg: '#DCFCE7' },
  NO_SHOW:     { color: '#6B7280', bg: '#F3F4F6' },
  EXPIRED:     { color: '#9CA3AF', bg: '#F9FAFB' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const key = (status ?? '').toUpperCase();
  const { color, bg } = statusColorMap[key] ?? { color: '#6B7280', bg: '#F3F4F6' };
  const label = key === 'NO_SHOW' ? 'No Show'
    : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return (
    <Box display="inline-flex" alignItems="center" px={2.5} py={0.5} borderRadius="full" bg={bg}>
      <Text fontSize="0.72rem" fontWeight="600" color={color} fontFamily="Outfit">{label}</Text>
    </Box>
  );
};

// ── Detail row ────────────────────────────────────────────────────────────────

const DetailRow = ({ label, value }: { label: string; value?: string | null }) => (
  <HStack justify="space-between" align="flex-start" w="full" gap={4} py={2.5}
    borderBottomWidth="1px" borderColor="gray.100" _last={{ borderBottom: 'none' }}
  >
    <Text fontSize="0.78rem" color="gray.500" fontFamily="Outfit" flexShrink={0}>{label}</Text>
    <Text fontSize="0.82rem" fontWeight="500" color="text_primary" fontFamily="Outfit" textAlign="right">
      {value || '—'}
    </Text>
  </HStack>
);

// ── Skeleton loader ───────────────────────────────────────────────────────────

const ViewSkeleton = () => (
  <VStack gap={4} w="full" maxW="600px" mx="auto" px={{ base: 3, md: 0 }} py={4}>
    {/* Back button */}
    <Skeleton h="32px" w="80px" borderRadius="8px" alignSelf="flex-start" />

    {/* Profile card */}
    <Box w="full" bg="bg_box" borderRadius="16px" borderWidth="1px" borderColor="gray.100" p={4}>
      <HStack gap={3}>
        <SkeletonCircle size="14" />
        <VStack align="flex-start" gap={1.5} flex={1}>
          <Skeleton h="3.5" w="50%" borderRadius="6px" />
          <Skeleton h="2.5" w="35%" borderRadius="6px" />
          <Skeleton h="5" w="20%" borderRadius="full" />
        </VStack>
      </HStack>
    </Box>

    {/* Appointment details */}
    <Box w="full" bg="bg_box" borderRadius="16px" borderWidth="1px" borderColor="gray.100" p={4}>
      <Skeleton h="3.5" w="40%" borderRadius="6px" mb={4} />
      {[1, 2, 3, 4].map((i) => (
        <HStack key={i} justify="space-between" py={2.5} borderBottomWidth="1px" borderColor="gray.100">
          <Skeleton h="3" w="30%" borderRadius="4px" />
          <Skeleton h="3" w="45%" borderRadius="4px" />
        </HStack>
      ))}
    </Box>

    {/* Action buttons */}
    <Box w="full" bg="bg_box" borderRadius="16px" borderWidth="1px" borderColor="gray.100" p={4}>
      <Skeleton h="10" w="full" borderRadius="10px" mb={3} />
      <HStack gap={3}>
        <Skeleton h="9" flex={1} borderRadius="10px" />
        <Skeleton h="9" flex={1} borderRadius="10px" />
      </HStack>
    </Box>
  </VStack>
);

// ── Countdown join section ────────────────────────────────────────────────────

const urgencyConfig = {
  future:   { joinBg: '#111D4A', joinLabel: 'Join Call',          urgentBorder: '' },
  soon:     { joinBg: '#111D4A', joinLabel: 'Join Call',          urgentBorder: '#FFB74D' },
  imminent: { joinBg: '#FF9800', joinLabel: 'Join Now',           urgentBorder: '#FF9800' },
  now:      { joinBg: '#2E7D32', joinLabel: 'Join Now — Live!',   urgentBorder: '#66BB6A' },
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
  const isUrgent = ['imminent', 'now'].includes(countdown.urgency) || countdown.isPast;

  return (
    <Box w="full" bg="bg_box" borderRadius="16px" borderWidth="1px" borderColor="gray.100" p={4}>
      {startTime && countdown.label && (
        <HStack
          mb={3} px={3} py={2} borderRadius="10px"
          bg={isUrgent ? (countdown.urgency === 'now' || countdown.isPast ? '#E8F5E9' : '#FFF3E0') : 'badge_background'}
          justify="space-between"
        >
          <HStack gap={2}>
            {(countdown.urgency === 'now' || countdown.isPast) && (
              <Box w="7px" h="7px" borderRadius="full" bg="#2E7D32"
                style={{ animation: 'dot-blink 1.2s ease-in-out infinite' }} />
            )}
            <style>{`@keyframes dot-blink { 0%,100%{opacity:1} 50%{opacity:0.2} }`}</style>
            <Text fontSize="0.78rem" color="gray.500" fontFamily="Outfit">Starts in</Text>
            <Text fontSize="0.82rem" fontWeight="700"
              color={isUrgent ? (countdown.urgency === 'now' || countdown.isPast ? '#2E7D32' : '#E65100') : 'text_primary'}
              fontFamily="Outfit"
            >
              {countdown.isPast ? 'Right now' : countdown.label}
            </Text>
          </HStack>
          {isUrgent && (
            <Text fontSize="0.72rem" fontWeight="600"
              color={countdown.urgency === 'now' || countdown.isPast ? '#2E7D32' : '#E65100'}
              fontFamily="Outfit"
            >
              {countdown.urgency === 'now' || countdown.isPast ? 'Live' : `${countdown.minutes}m`}
            </Text>
          )}
        </HStack>
      )}

      <Button
        w="full" bg={cfg.joinBg} color="white" borderRadius="10px" h="42px"
        fontSize="0.875rem" fontWeight="700" fontFamily="Outfit" mb={3}
        _hover={{ opacity: 0.88 }}
        onClick={onJoin}
        style={isUrgent ? { boxShadow: `0 0 0 3px ${cfg.urgentBorder}40` } : undefined}
      >
        <Icon mr={2}><LuVideo /></Icon>
        {cfg.joinLabel}
      </Button>

      <HStack gap={2.5}>
        <Button
          variant="outline" borderColor="gray.200" color="text_primary"
          flex={1} h="36px" borderRadius="8px" fontSize="0.78rem"
          fontFamily="Outfit" fontWeight="500" _hover={{ bg: 'gray.50' }}
          disabled={isCancelling}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          bg="button_bg" color="button_text" flex={1} h="36px" borderRadius="8px"
          fontSize="0.78rem" fontFamily="Outfit" fontWeight="600"
          _hover={{ opacity: 0.85 }}
          onClick={onReschedule}
        >
          Reschedule
        </Button>
      </HStack>
    </Box>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ConsultationViewPage() {
  const router = useRouter();
  const [client, setClient] = useState(false);
  const { user: authUser } = useAuth();

  const { consultation_id } = router.query as Record<string, string>;
  const {
    data: apptResp,
    isLoading,
    error: apptError,
  } = useGetAppointmentByIdQuery(consultation_id as string, { skip: !consultation_id });
  const appointment: any = (apptResp as any)?.data ?? apptResp ?? null;
  const [, { isLoading: isCancelling }] = useCancelAppointmentMutation();

  const isConsultantViewer = !!authUser?.isConsultant;
  const counterpart = useMemo(() => {
    if (!appointment) return null;
    return isConsultantViewer
      ? appointment?.user
      : (appointment?.consultant || appointment?.consultantInfo || appointment?.provider);
  }, [appointment, isConsultantViewer]);

  useEffect(() => { setClient(true); }, []);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading || !client) {
    return (
      <Box w="full" className={outfit.className}>
        <ViewSkeleton />
      </Box>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (apptError) {
    return (
      <Flex w="full" justify="center" align="center" py={12}>
        <VStack gap={3} textAlign="center">
          <Text fontSize="0.9rem" fontWeight="600" color="text_primary" fontFamily="Outfit">
            Failed to load appointment
          </Text>
          <Text fontSize="0.8rem" color="gray.500" fontFamily="Outfit">
            This appointment could not be found or you don't have access.
          </Text>
          <Button bg="button_bg" color="button_text" borderRadius="8px" px={5} h="36px"
            fontSize="0.82rem" fontFamily="Outfit" onClick={() => router.push('/consultation')}>
            Back to Consultations
          </Button>
        </VStack>
      </Flex>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (!consultation_id || !appointment) {
    return (
      <Flex w="full" justify="center" align="center" py={12}>
        <VStack gap={3} textAlign="center">
          <Text fontSize="0.9rem" fontWeight="600" color="text_primary" fontFamily="Outfit">
            Appointment not found
          </Text>
          <Button bg="button_bg" color="button_text" borderRadius="8px" px={5} h="36px"
            fontSize="0.82rem" fontFamily="Outfit" onClick={() => router.push('/consultation')}>
            View My Consultations
          </Button>
        </VStack>
      </Flex>
    );
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const fmtTime = (t: any) => {
    if (!t) return null;
    const d = new Date(t);
    if (!isNaN(d.getTime())) return format(d, 'h:mm aa');
    const m = String(t).match(/^([0-9]{1,2}):([0-9]{2})/);
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
    if (!isNaN(dt.getTime())) return format(dt, 'MMM d, yyyy');
    return String(d);
  };

  const ts = appointment?.timeslots?.[0] ?? {};
  const timeStart = fmtTime(ts?.startTime || appointment?.scheduledDateTimeStart);
  const timeEnd   = fmtTime(ts?.endTime   || appointment?.scheduledDateTimeEnd);
  const dateStr   = fmtDate(appointment?.availability?.date || appointment?.scheduledDateTimeStart || ts?.date);
  const timeStr   = [timeStart, timeEnd].filter(Boolean).join(' – ');

  const minutes = ts?.duration ?? appointment?.duration;
  const durationStr = minutes != null
    ? (() => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return [h > 0 ? `${h}h` : '', m > 0 ? `${m}m` : ''].filter(Boolean).join(' ') || '0m';
      })()
    : null;

  const isJoinable = ['UPCOMING', 'RESCHEDULED', 'CONFIRMED', 'PENDING']
    .includes((appointment?.status || '').toUpperCase());

  return (
    <Box w="full" className={outfit.className}>
      <VStack gap={4} w="full" maxW="600px" mx="auto" px={{ base: 3, md: 0 }} py={4} align="stretch">

        {/* Back button */}
        <Button
          variant="ghost" alignSelf="flex-start" h="32px" px={2} gap={1.5}
          borderRadius="8px" fontSize="0.8rem" color="gray.500" fontFamily="Outfit"
          _hover={{ bg: 'gray.100', color: 'text_primary' }}
          onClick={() => router.back()}
        >
          <LuArrowLeft size={14} />
          Back
        </Button>

        {/* Profile card */}
        <Box bg="bg_box" borderRadius="16px" borderWidth="1px" borderColor="gray.100" p={4}>
          <HStack gap={3} align="flex-start">
            <Image
              src={safeProfilePic(counterpart?.profilePics)}
              onError={imgErrorFallback}
              alt={counterpart?.fullName || 'User'}
              boxSize="52px"
              borderRadius="12px"
              objectFit="cover"
              flexShrink={0}
            />
            <VStack align="flex-start" gap={0.5} flex={1} minW={0}>
              <Text fontSize="0.95rem" fontWeight="700" color="text_primary" fontFamily="Outfit" lineClamp={1}>
                {counterpart?.fullName || '—'}
              </Text>
              {(counterpart?.title || counterpart?.occupation || counterpart?.businessName) && (
                <Text fontSize="0.75rem" color="gray.400" fontFamily="Outfit" lineClamp={1}>
                  {counterpart?.title || counterpart?.occupation || counterpart?.businessName}
                </Text>
              )}
              <Box mt={1}>
                <StatusBadge status={appointment?.status || 'Scheduled'} />
              </Box>
            </VStack>
            <Text fontSize="0.72rem" color="gray.400" fontFamily="Outfit" flexShrink={0}>
              #{(appointment?.uniqueId ?? appointment?.id ?? '').toString().slice(0, 8)}
            </Text>
          </HStack>
        </Box>

        {/* Appointment details */}
        <Box bg="bg_box" borderRadius="16px" borderWidth="1px" borderColor="gray.100" px={4} pt={4} pb={1}>
          <HStack mb={3} gap={1.5}>
            <Icon color="gray.400" fontSize="13px"><LuCalendar /></Icon>
            <Text fontSize="0.82rem" fontWeight="600" color="text_primary" fontFamily="Outfit">
              Appointment Details
            </Text>
          </HStack>
          <DetailRow
            label={isConsultantViewer ? 'Client' : 'Consultant'}
            value={isConsultantViewer ? appointment?.user?.fullName : appointment?.consultant?.fullName}
          />
          <DetailRow
            label="Topic"
            value={appointment?.topic || appointment?.title || appointment?.message}
          />
          {dateStr && <DetailRow label="Date" value={dateStr} />}
          {timeStr && (
            <DetailRow label="Time" value={timeStr} />
          )}
          {durationStr && <DetailRow label="Duration" value={durationStr} />}
          {appointment?.videoOption != null && (
            <DetailRow label="Format" value={appointment?.videoOption ? 'Video call' : 'Text only'} />
          )}
        </Box>

        {/* Contact details */}
        {counterpart && (counterpart?.email || counterpart?.mobileNumber || counterpart?.phone) && (
          <Box bg="bg_box" borderRadius="16px" borderWidth="1px" borderColor="gray.100" px={4} pt={4} pb={1}>
            <HStack mb={3} gap={1.5}>
              <Icon color="gray.400" fontSize="13px"><LuUser /></Icon>
              <Text fontSize="0.82rem" fontWeight="600" color="text_primary" fontFamily="Outfit">
                {isConsultantViewer ? 'Client Details' : 'Consultant Details'}
              </Text>
            </HStack>
            {counterpart?.email && (
              <DetailRow label="Email" value={counterpart.email} />
            )}
            {(counterpart?.mobileNumber || counterpart?.phone) && (
              <DetailRow label="Phone" value={counterpart?.mobileNumber || counterpart?.phone} />
            )}
            {(counterpart?.businessName) && (
              <DetailRow label="Business" value={counterpart.businessName} />
            )}
          </Box>
        )}

        {/* Join / action section */}
        {isJoinable && (
          <ConsultationJoinSection
            appointment={appointment}
            isCancelling={isCancelling}
            onCancel={() => router.push(`/consultation/cancel?consultation_id=${consultation_id}`)}
            onReschedule={() => router.push(`/consultation/reschedule?consultation_id=${consultation_id}`)}
            onJoin={() => router.push(`/message/videoconsultation?consultationId=${consultation_id}`)}
          />
        )}

      </VStack>
    </Box>
  );
}
