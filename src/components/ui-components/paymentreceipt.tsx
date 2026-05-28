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

  const shortReceiptNumber =
    receiptNumber.length > 20
      ? `#${receiptNumber.slice(-8).toUpperCase()}`
      : `#${receiptNumber}`;

  const handleDownload = () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Payment Receipt ${shortReceiptNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; padding: 48px; max-width: 560px; margin: 0 auto; color: #1a202c; }
    .center { text-align: center; }
    .check { width: 56px; height: 56px; background: #22c55e; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
    .check svg { width: 28px; height: 28px; fill: white; }
    h1 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
    .subtitle { color: #718096; font-size: 14px; margin-bottom: 28px; }
    .section-title { font-size: 15px; font-weight: 700; margin-bottom: 14px; }
    .row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; gap: 16px; }
    .row .label { color: #718096; font-size: 14px; white-space: nowrap; }
    .row .value { font-weight: 600; font-size: 14px; text-align: right; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 18px 0; }
    .total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 16px; margin-top: 6px; }
    @media print { body { padding: 24px; } }
  </style>
</head>
<body>
  <div class="center">
    <div class="check">
      <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    </div>
    <h1>Payment Successful!</h1>
    <p class="subtitle">Your payment has been successfully made</p>
  </div>
  <p class="section-title">Payment Receipt</p>
  <div class="row"><span class="label">Receipt Number:</span><span class="value">${shortReceiptNumber}</span></div>
  <div class="row"><span class="label">Date of issue:</span><span class="value">${dateOfIssue}</span></div>
  <hr class="divider" />
  <p class="section-title">Payment Details</p>
  <div class="row"><span class="label">Consultant:</span><span class="value">${consultantName}</span></div>
  <div class="row"><span class="label">Amount Paid:</span><span class="value">${amountPaid}</span></div>
  <div class="row"><span class="label">Date of Service:</span><span class="value">${dateOfService}</span></div>
  <div class="row"><span class="label">Discount Applied:</span><span class="value">${discount}</span></div>
  <div class="row"><span class="label">Payment Method:</span><span class="value">${paymentMethod}</span></div>
  <div class="row"><span class="label">Transaction ID:</span><span class="value">${transactionId}</span></div>
  <hr class="divider" />
  <div class="total-row"><span>Total Paid</span><span>${amountPaid}</span></div>
</body>
</html>`;

    const win = window.open("", "_blank", "width=700,height=900");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => {
        win.print();
        win.close();
      }, 400);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(o) => !o && onOpenChange()} placement="center" size="sm">
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
                  <Row label="Receipt Number:" value={shortReceiptNumber} />
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

                <HStack w="full" gap={3} mt={4}>
                  <Button
                    flex={1}
                    variant="outline"
                    borderColor="gray.300"
                    color="text_primary"
                    h="44px"
                    borderRadius="8px"
                    fontFamily="Outfit"
                    fontWeight="500"
                    fontSize="0.9rem"
                    onClick={onOpenChange}
                    gap={2}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.35288 8.95043C4.00437 6.17301 6.17301 4.00437 8.95043 3.35288C10.9563 2.88237 13.0437 2.88237 15.0496 3.35288C17.827 4.00437 19.9956 6.17301 20.6471 8.95044C21.1176 10.9563 21.1176 13.0437 20.6471 15.0496C19.9956 17.827 17.827 19.9956 15.0496 20.6471C13.0437 21.1176 10.9563 21.1176 8.95044 20.6471C6.17301 19.9956 4.00437 17.827 3.35288 15.0496C2.88237 13.0437 2.88237 10.9563 3.35288 8.95043Z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M13.768 10.2305L10.2324 13.766M13.768 13.766L10.2324 10.2305" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Cancel
                  </Button>

                  <Button
                    flex={1}
                    bg="#1B2B65"
                    color="white"
                    h="44px"
                    borderRadius="8px"
                    fontFamily="Outfit"
                    fontWeight="500"
                    fontSize="0.9rem"
                    gap={2}
                    _hover={{ bg: "#162255" }}
                    onClick={handleDownload}
                  >
                    <Image src="/icons/download.svg" alt="" boxSize="18px" />
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
