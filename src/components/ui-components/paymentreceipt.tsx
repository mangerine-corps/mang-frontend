"use client";

import {
  Box,
  Button,
  CloseButton,
  Flex,
  Portal,
  Text,
  Dialog,
  Image,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { format } from "date-fns";

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  data: any;
}

const formatDate = (val: string) => {
  if (!val) return "—";
  try { return format(new Date(val), "MMMM d, yyyy"); } catch { return val; }
};

const formatAmount = (data: any) => {
  const cents = data?.raw?.paymentData?.amount ?? data?.raw?.amount;
  if (typeof cents === "number") return `$${(cents / 100).toFixed(2)}`;
  if (data?.amount && data.amount !== "—") return data.amount.startsWith("$") ? data.amount : `$${data.amount}`;
  return "—";
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <Flex justify="space-between" w="full">
    <Text fontFamily="Outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">{label}</Text>
    <Text fontFamily="Outfit" color="text_primary" fontWeight="600" fontSize="0.875rem" textAlign="right" maxW="60%">{value}</Text>
  </Flex>
);

const PaymentModal = ({ isOpen, onOpenChange, data }: PaymentModalProps) => {
  const raw = data?.raw ?? data ?? {};

  const receiptNumber = raw?.id ?? data?.id ?? "—";
  const dateOfIssue = formatDate(raw?.createdAt ?? raw?.created_at ?? data?.date ?? "");
  const dateOfService = formatDate(
    raw?.appointmentData?.availabilityDate ??
    raw?.appointmentData?.date ??
    raw?.scheduledDateTimeStart ??
    raw?.scheduledAt ??
    ""
  );
  const consultantName = raw?.consultant?.fullName ?? data?.topic ?? "—";
  const amountPaid = formatAmount(data);
  const discount = raw?.paymentData?.discount
    ? `$${(raw.paymentData.discount / 100).toFixed(2)}`
    : "—";
  const paymentMethod =
    raw?.paymentData?.methodSummary?.type ??
    raw?.paymentData?.method ??
    data?.method ??
    "—";
  const transactionId =
    raw?.paymentData?.id ??
    raw?.paymentData?.transactionId ??
    raw?.transactionId ??
    raw?.stripePaymentIntentId ??
    "—";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && onOpenChange()} placement={"center"} size={"sm"}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content alignItems="center" p="26px" borderRadius="16px" w="full">
            <Dialog.CloseTrigger asChild>
              <CloseButton onClick={onOpenChange} position="absolute" top="16px" right="16px" size="sm" />
            </Dialog.CloseTrigger>

            <Dialog.Body mt="10px" textAlign="center" w="full">
              <Box bg="bg_box" borderRadius="16px">
                <Flex justify="center" mb={4}>
                  <Image src="/icons/successful.svg" alt="Success" boxSize="56px" />
                </Flex>

                <Text fontFamily="Outfit" color="text_primary" fontWeight="700" fontSize="1.5rem" mb={1}>
                  Payment Successful!
                </Text>
                <Text fontFamily="Outfit" color="gray.500" fontSize="0.875rem" mb={6}>
                  Your payment has been successfully made
                </Text>

                {/* Payment Receipt */}
                <VStack align="start" gap={3} mb={4}>
                  <Text fontFamily="Outfit" color="text_primary" fontWeight="700" fontSize="0.9375rem">
                    Payment Receipt
                  </Text>
                  <Row label="Receipt Number:" value={receiptNumber.length > 20 ? `#${receiptNumber.slice(-8).toUpperCase()}` : `#${receiptNumber}`} />
                  <Row label="Date of issue:" value={dateOfIssue} />
                </VStack>

                <Box w="full" h="1px" bg="gray.100" my={3} />

                {/* Payment Details */}
                <VStack align="start" gap={3} mb={4}>
                  <Text fontFamily="Outfit" color="text_primary" fontWeight="700" fontSize="0.9375rem">
                    Payment Details
                  </Text>
                  <Row label="Consultant:" value={consultantName} />
                  <Row label="Amount Paid:" value={amountPaid} />
                  <Row label="Date of Service:" value={dateOfService} />
                  <Row label="Discount Applied:" value={discount} />
                  <Row label="Payment Method:" value={paymentMethod} />
                  <Row label="Transaction ID:" value={transactionId} />
                </VStack>

                <Box w="full" h="1px" bg="gray.100" my={3} />

                {/* Total */}
                <Flex justify="space-between" w="full" mb={6}>
                  <Text fontFamily="Outfit" color="text_primary" fontWeight="700" fontSize="1rem">Total Paid</Text>
                  <Text fontFamily="Outfit" color="text_primary" fontWeight="700" fontSize="1rem">{amountPaid}</Text>
                </Flex>

                <HStack justify="center" gap={4} mt={4}>
                  <Button
                    variant="outline"
                    borderColor="gray.300"
                    color="text_primary"
                    px={5}
                    py={2}
                    borderRadius="8px"
                    fontFamily="Outfit"
                    onClick={onOpenChange}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Image src="/icons/cancel.svg" alt="Cancel" boxSize="16px" />
                    Cancel
                  </Button>

                  <Button
                    bg="bg_button"
                    color="white"
                    px={5}
                    py={2}
                    borderRadius="8px"
                    fontFamily="Outfit"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    _hover={{ bg: "bg_button" }}
                  >
                    <Image src="/icons/download.svg" alt="Download" boxSize="16px" />
                    Download
                  </Button>
                </HStack>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PaymentModal;
