import { useMemo } from 'react';
import { Box, HStack, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useGetUpcomingConsultationQuery } from 'mangarine/state/services/apointment.service';
import { useCountdown, resolveStartTime } from 'mangarine/hooks/useCountdown';

// Renders the actual banner for one imminent appointment — must be a real component so hooks are valid
const ImminentBanner = ({ appointment }: { appointment: any }) => {
  const router = useRouter();
  const startTime = resolveStartTime(appointment);
  const countdown = useCountdown(startTime);

  const name = appointment?.consultant?.fullName || appointment?.user?.fullName || 'your consultation';

  const isActive = countdown.isPast || countdown.urgency === 'now' || countdown.urgency === 'imminent';
  if (!isActive) return null;

  const isNow = countdown.isPast || countdown.urgency === 'now';
  const bgColor = isNow ? '#111D4A' : '#FF9800';

  return (
    <Box
      position="fixed"
      top={4}
      left="50%"
      transform="translateX(-50%)"
      zIndex={1400}
      bg={bgColor}
      color="white"
      borderRadius="full"
      px={6}
      py={2.5}
      boxShadow="0 4px 20px rgba(0,0,0,0.25)"
      style={isNow ? { animation: 'banner-pulse 2s ease-in-out infinite' } : undefined}
    >
      <style>{`
        @keyframes banner-pulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(17,29,74,0.3); }
          50% { box-shadow: 0 4px 30px rgba(17,29,74,0.6); }
        }
      `}</style>
      <HStack gap={4}>
        <Box w={2} h={2} bg="white" borderRadius="full" opacity={isNow ? 1 : 0.7} />
        <Text fontSize="0.875rem" fontWeight="600" whiteSpace="nowrap">
          {isNow
            ? `Your consultation with ${name} is starting now!`
            : `Consultation with ${name} starts ${countdown.label}`}
        </Text>
        <Button
          size="sm"
          bg="white"
          color={bgColor}
          borderRadius="full"
          fontWeight="700"
          px={4}
          h="28px"
          fontSize="0.8rem"
          _hover={{ opacity: 0.9 }}
          onClick={() =>
            router.push(`/message/videoconsultation?consultationId=${appointment.id}`)
          }
        >
          Join Now
        </Button>
      </HStack>
    </Box>
  );
};

const ConsultationReadyBanner = () => {
  const { data } = useGetUpcomingConsultationQuery({ page: 1, limit: 20, status: 'UPCOMING' });
  const appointments: any[] = (data as any)?.data?.consultations ?? [];

  // Find the earliest consultation starting within 15 minutes
  const imminentAppt = useMemo(() => {
    return (
      appointments
        .map((a) => ({ appt: a, startTime: resolveStartTime(a) }))
        .filter(({ startTime }) => {
          if (!startTime) return false;
          const diff = startTime.getTime() - Date.now();
          // Within -1 min (just started) to +15 min ahead
          return diff > -60_000 && diff < 15 * 60 * 1000;
        })
        .sort((a, b) => a.startTime!.getTime() - b.startTime!.getTime())[0]?.appt ?? null
    );
  }, [appointments]);

  if (!imminentAppt) return null;
  return <ImminentBanner appointment={imminentAppt} />;
};

export default ConsultationReadyBanner;
