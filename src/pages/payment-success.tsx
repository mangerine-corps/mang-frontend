import { useEffect, useMemo, useState } from "react";
import { Box, Flex, Icon, Text, VStack, HStack, Avatar } from "@chakra-ui/react";
import { Button } from "mangarine/components/ui/button";
import { useRouter } from "next/router";
import { BsCheckCircleFill } from "react-icons/bs";
import { FiCalendar, FiClock, FiDollarSign } from "react-icons/fi";
import {
  useGetAppointmentByPaymentIntentQuery,
  useCapturePaypalOrderMutation,
} from "mangarine/state/services/apointment.service";

const to12h = (t: any): string => {
  if (!t) return "";
  const d = new Date(t);
  if (!isNaN(d.getTime())) return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const m = String(t).match(/^([0-9]{1,2}):([0-9]{2})/);
  if (m) {
    let h = parseInt(m[1], 10);
    const min = m[2];
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${min} ${ampm}`;
  }
  return String(t);
};

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [client, setClient] = useState(false);
  const [amount, setAmount] = useState<string | null>(null);
  const [captureStatus, setCaptureStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const { payment_intent, consultantId, token, reference } =
    router.query as Record<string, string>;

  const [capturePaypalOrder] = useCapturePaypalOrderMutation();
  const { data: apptByIntent, isLoading } = useGetAppointmentByPaymentIntentQuery(
    payment_intent as string,
    { skip: !payment_intent }
  );
  const appointment: any = (apptByIntent as any)?.data ?? apptByIntent ?? null;
  if (apptByIntent) console.log("[payment-success] raw API response:", apptByIntent);

  useEffect(() => { setClient(true); }, []);

  useEffect(() => {
    if (!client) return;
    try {
      const saved = localStorage.getItem("paymentAmount");
      if (saved) setAmount(saved);
    } catch {}
  }, [client]);

  useEffect(() => {
    if (!token || captureStatus !== "idle") return;
    setCaptureStatus("loading");
    capturePaypalOrder(token)
      .unwrap()
      .then(() => setCaptureStatus("done"))
      .catch(() => setCaptureStatus("error"));
  }, [token, captureStatus, capturePaypalOrder]);

  const resolvedConsultantId =
    consultantId || (client ? localStorage.getItem("paymentConsultantId") ?? undefined : undefined);

  const details = useMemo(() => {
    const name = appointment?.consultant?.fullName || null;
    const profilePic = appointment?.consultant?.profilePics || null;
    const email = appointment?.user?.email || null;

    const rawDate = appointment?.availability?.date || appointment?.date;
    const dt = rawDate ? new Date(rawDate) : null;
    const date =
      dt && !isNaN(dt.getTime())
        ? dt.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })
        : null;

    const ts = Array.isArray(appointment?.timeslots) ? appointment.timeslots : [];
    let time: string | null = null;
    if (ts.length > 0) {
      const starts = ts.map((t: any) => t.startTime).filter(Boolean).sort();
      const ends = ts.map((t: any) => t.endTime).filter(Boolean).sort();
      const s = to12h(starts[0]);
      const e = to12h(ends[ends.length - 1]);
      time = [s, e].filter(Boolean).join(" – ") || null;
    }

    const rawAmount = amount || appointment?.amount;
    const amountStr = rawAmount ? `$${Number(rawAmount).toFixed(2)}` : null;

    return { name, profilePic, email, date, time, amountStr };
  }, [appointment, amount]);

  const loading = (isLoading && !appointment) || captureStatus === "loading";

  const handleDone = () => {
    if (client) localStorage.removeItem("paymentConsultantId");
    if (resolvedConsultantId) {
      router.push(`/profile/${resolvedConsultantId}`);
    } else {
      router.push("/home");
    }
  };

  return (
    <Box
      w="full"
      h="full"
      overflowY="auto"
      css={{ "&::-webkit-scrollbar": { width: 0 } }}
    >
      <VStack gap={6} w="full" maxW="500px" mx="auto" py={8} px={{ base: 4, md: 0 }}>

          {/* Success icon + heading */}
          <VStack gap={3} textAlign="center">
            <Icon color="#22c55e" boxSize={16}>
              <BsCheckCircleFill />
            </Icon>
            <Text fontSize="1.5rem" fontWeight="700" color="text_primary" fontFamily="Outfit">
              Booking Confirmed!
            </Text>
            <Text fontSize="0.875rem" color="gray.500" fontFamily="Outfit">
              Your consultation has been booked successfully.
            </Text>
          </VStack>

          {/* Receipt card */}
          <Box
            w="full"
            borderWidth="1px"
            borderColor="border_background"
            rounded="2xl"
            overflow="hidden"
            bg="bg_box"
            boxShadow="sm"
          >
            {/* Consultant header */}
            <Box px={5} py={4} borderBottomWidth="1px" borderColor="border_background">
              {loading ? (
                <HStack gap={3}>
                  <Box w={10} h={10} rounded="full" bg="gray.200" />
                  <Box>
                    <Box h="14px" w="120px" bg="gray.200" rounded="md" mb={1} />
                    <Box h="12px" w="80px" bg="gray.100" rounded="md" />
                  </Box>
                </HStack>
              ) : (
                <HStack gap={3}>
                  <Avatar.Root w={10} h={10}>
                    <Avatar.Fallback name={details.name ?? "Consultant"} />
                    <Avatar.Image src={details.profilePic} />
                  </Avatar.Root>
                  <Box>
                    <Text fontWeight="600" fontSize="0.9375rem" color="text_primary" fontFamily="Outfit">
                      {details.name ?? "—"}
                    </Text>
                    <Text fontSize="0.75rem" color="gray.500" fontFamily="Outfit">
                      Consultant
                    </Text>
                  </Box>
                </HStack>
              )}
            </Box>

            {/* Detail rows */}
            <VStack gap={0} divideY="1px" px={5}>
              <DetailRow
                icon={<FiCalendar />}
                label="Date"
                value={loading ? "…" : (details.date ?? "—")}
              />
              <DetailRow
                icon={<FiClock />}
                label="Time"
                value={loading ? "…" : (details.time ?? "—")}
              />
              <DetailRow
                icon={<FiDollarSign />}
                label="Amount Paid"
                value={loading ? "…" : (details.amountStr ?? "—")}
                valueWeight="700"
                valueColor="#22c55e"
              />
            </VStack>
          </Box>

          {/* Email note */}
          {details.email && (
            <Box
              w="full"
              bg="blue.50"
              borderWidth="1px"
              borderColor="blue.200"
              rounded="xl"
              px={4}
              py={3}
            >
              <Text fontSize="0.8rem" color="blue.700" fontFamily="Outfit" lineHeight="1.5">
                A confirmation email has been sent to{" "}
                <Text as="span" fontWeight="600">{details.email}</Text>.
              </Text>
            </Box>
          )}

          {/* Action button */}
          <Button
            w="full"
            bg="button_bg"
            color="button_text"
            borderRadius="12px"
            py={6}
            fontFamily="Outfit"
            fontWeight="600"
            fontSize="0.9375rem"
            _hover={{ bg: "#0D173B" }}
            onClick={handleDone}
          >
            {resolvedConsultantId ? "Back to Consultant" : "Go to Home"}
          </Button>

      </VStack>
    </Box>
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueWeight = "500",
  valueColor = "text_primary",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueWeight?: string;
  valueColor?: string;
}) {
  return (
    <Flex w="full" justify="space-between" align="center" py={4}>
      <HStack gap={2} color="gray.500">
        <Icon boxSize={4}>{icon}</Icon>
        <Text fontSize="0.875rem" color="gray.500" fontFamily="Outfit">
          {label}
        </Text>
      </HStack>
      <Text
        fontSize="0.875rem"
        fontWeight={valueWeight}
        color={valueColor}
        fontFamily="Outfit"
        textAlign="right"
        maxW="60%"
      >
        {value}
      </Text>
    </Flex>
  );
}
