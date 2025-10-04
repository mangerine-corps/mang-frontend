import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { AiFillCheckCircle, AiOutlineInfoCircle } from "react-icons/ai";
import AppLayout from "mangarine/layouts/AppLayout";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import ActivityEmptyState from "mangarine/components/ui-components/emptystate";
import { useGetAppointmentByPaymentIntentQuery } from "mangarine/state/services/apointment.service";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [client, setClient] = useState(false);
  const [amount, setAmount] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();

  const { redirect_status, payment_intent, consultantId } =
    router.query as Record<string, string>;
  const { data: apptByIntent, isLoading: isLoadingAppt } = useGetAppointmentByPaymentIntentQuery(payment_intent as string, { skip: !payment_intent });
  const appointment: any = (apptByIntent as any)?.data ?? apptByIntent ?? null;

  useEffect(() => {
    setClient(true);
  }, []);

  useEffect(() => {
    if (!client) return;
    // Retrieve saved amount (best effort)
    try {
      const saved = localStorage.getItem("paymentAmount");
      if (saved) setAmount(saved);
    } catch (e) {}
  }, [client]);

  const succeeded = useMemo(() => {
    return redirect_status === "succeeded" || !!payment_intent;
  }, [redirect_status, payment_intent]);

  // Manually designed info card colors (Chakra v3: compute via next-themes)
  const isDark = resolvedTheme === "dark";
  const infoBg = isDark ? "blue.900" : "blue.50";
  const infoBorder = isDark ? "blue.700" : "blue.200";
  const infoColor = isDark ? "blue.200" : "blue.700";

  const panelBg = isDark ? "gray.800" : "white";
  const subText = succeeded
    ? "Your payment was received. We are finalizing your consultation booking."
    : "We are processing your payment. You will receive an email soon.";

  const amountText = amount ? `$${Number(amount).toFixed(2)}` : undefined;

  const goToConsultant = () => {
    if (consultantId) {
      router.push(`/consultant/${consultantId}`);
    } else {
      router.push("/home");
    }
  };

  const { consultantName, userEmail, dateText, timeText, amountDisplay } = useMemo(() => {
    // Consultant Name
    const cName = appointment?.consultant?.fullName || "-";
    const userEmail = appointment?.user?.email || "-";
    // Date
    const rawDate = appointment?.availability?.date || appointment?.date;
    const dt = rawDate ? new Date(rawDate) : null;
    const dateStr = dt && !isNaN(dt.getTime())
      ? dt.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })
      : "-";
    // Time Range
    const ts = Array.isArray(appointment?.timeslots) ? appointment.timeslots : [];
    let s: string | null = null; let e: string | null = null;
    if (ts.length > 0) {
      const starts = ts.map((t: any) => t.startTime).filter(Boolean).sort();
      const ends = ts.map((t: any) => t.endTime).filter(Boolean).sort();
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
      s = to12h(starts[0]);
      e = to12h(ends[ends.length - 1]);
    }
    const timeStr = [s, e].filter(Boolean).join(' - ') || "-";
    // Amount
    const amountStr = amountText || (appointment?.amount ? `$${Number(appointment.amount).toFixed(2)}` : undefined);
    return { consultantName: cName,userEmail: userEmail, dateText: dateStr, timeText: timeStr, amountDisplay: amountStr };
  }, [appointment, amountText]);

  return (
    <AppLayout>
      <Box
        display={"flex"}
        // bg="red.900"
        flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
        // alignItems={"center"}
        my={{ base: "0", md: "12px" }}
        justifyContent={"space-between"}
        w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
        mx="auto"
        pos="relative"
        overflowY={"scroll"}
        // spaceY={{ base: "4", md: "0" }}
        css={{
          "&::-webkit-scrollbar": {
            width: "0px",

            height: "0px",
          },
          "&::-webkit-scrollbar-track": {
            width: "0px",
            background: "transparent",

            height: "0px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "0px",
            maxHeight: "0px",
            height: "0px",
            width: 0,
          },
        }}
      >
        <VStack
          w={{ base: "100%", md: "25%" }}
          h={{ base: "auto", md: "100vh" }}
          overflowY="auto"
          // py={4}
          display={{ base: "none", md: "flex" }}
          spaceY={2}
        >
          <Biocard />

          <DashboardCard />

          {/* <ConsultationDetailsBox /> */}
          {/* <PaymentBox /> */}
          {/* <PaymentCard /> */}
        </VStack>

        {/* Replaced success panel with Consultation Details JSX */}
        <Box
          mx={{ base: "0", md: 4, lg: 4, xl: 4 }}
          flex={1}
          h="fit-content"
          p="6"
          bg="main_background"
          overflowY={{ base: "scroll", md: "scroll" }}
          css={{
            "&::-webkit-scrollbar": {
              width: "0px",

              height: "0px",
            },
            "&::-webkit-scrollbar-track": {
              width: "0px",
              background: "transparent",

              height: "0px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
              borderRadius: "0px",
              maxHeight: "0px",
              height: "0px",
              width: 0,
            },
          }}
          rounded={"xl"}
          overflowX="hidden"

          // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
        >
          {/* Section 1: Consultation Info */}
          <Box >
            <Text
              fontSize="1.25rem"
              font="outfit"
              fontWeight="600"
              mb={2}
              color={"text_primary"}
            >
              Consultation Details
            </Text>
            <Flex flexDirection="column" gap="8px" width="100%">
              {["Consultant", "Date", "Time", "Amount"].map((item, index) => (
                <Flex key={index} justify="space-between" width="100%">
                  <Text  fontSize="0.875rem" color={"text_primary"}>
                    {item}
                  </Text>
                  <Text
                    fontWeight={item === "Amount" ? "bold" : "normal"}
                    fontSize="0.875rem"
                    textTransform="capitalize"
                    color={"text_primary"}
                  >
                    {isLoadingAppt && !appointment ? "..." : (
                      item === "Consultant"
                        ? consultantName
                        : item === "Date"
                          ? dateText
                          : item === "Time"
                            ? timeText
                            : amountDisplay || "-"
                    )}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </Box>

          {/* Section 2: Success Message */}
          <Box>
            <Text
              fontSize="1.25rem"
              font="outfit"
              fontWeight="600"
              color={"text_primary"}
            >
              Consultation Booking Successful!
            </Text>
            <Text fontSize="0.75rem" color={"text_primary"} mb={4}>
              {`Your consultation booking with ${consultantName} was successful`}
            </Text>

            <Button
              bg="bt_schedule"
              color="white"
              flex={1}
              _hover={{ bg: "bt_schedule_hover" }}
              width="100%"
              mt={12}
              onClick={goToConsultant}
            >
              {consultantId ? "Back to Consultant" : "Go to Home"}
            </Button>

            <Box mt={4}>
              <Text color={"text_primary"} fontSize="xs" whiteSpace="pre-line">
                {`An email has been sent to ${userEmail}
                Please check your inbox for consultation details.
                  We look forward to assisting you!`}
              </Text>
            </Box>
          </Box>
        </Box>
        <VStack
          w={{ base: "100%", md: "25%" }}
          h={{ base: "auto", md: "100vh" }}
          overflowY={{ base: "visible", md: "auto" }}
          display={{ base: "none", md: "flex" }}
          spaceY={2}
          pos={{ base: "relative", md: "sticky" }}
          top={{ base: "unset", md: 0 }}
          alignSelf="flex-start"
        >
          <ActivityEmptyState />
        </VStack>
      </Box>
    </AppLayout>
  );
}
