"use client";
import { Avatar, Box, Drawer, HStack, IconButton, Portal, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { LuX, LuChevronLeft } from "react-icons/lu";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./paymentcard";
import CustomDatePicker from "./bookingcalendarcard";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? process.env.STRIPE_PUBLIC_KEY ?? ""
);

type Step = "booking" | "payment";

interface PaymentState {
  clientSecret: string;
  paymentDetails: any;
}

interface BookConsultationDrawerProps {
  open: boolean;
  onClose: () => void;
  consultant: {
    id: string;
    fullName?: string;
    profilePics?: string;
    title?: string;
  };
}

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: "transparent" },
};

export default function BookConsultationDrawer({
  open,
  onClose,
  consultant,
}: BookConsultationDrawerProps) {
  const [step, setStep] = useState<Step>("booking");
  const [paymentState, setPaymentState] = useState<PaymentState | null>(null);

  const handleBookingComplete = (data: any) => {
    const clientSecret = data?.secret ?? data?.clientSecret ?? data?.client_secret;
    const paymentDetails = data?.paymentDetails ?? data?.payment_details ?? data;
    if (clientSecret) {
      setPaymentState({ clientSecret, paymentDetails });
      setStep("payment");
    }
  };

  const handleBack = () => {
    setStep("booking");
    setPaymentState(null);
  };

  const handleClose = () => {
    setStep("booking");
    setPaymentState(null);
    onClose();
  };

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => { if (!e.open) handleClose(); }}
      placement="end"
    >
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content
            bg="bg_box"
            w={{ base: "100vw", md: "440px" }}
            maxW="100vw"
            h="100dvh"
            display="flex"
            flexDir="column"
          >
            {/* Header */}
            <Box
              px={5}
              py={4}
              borderBottomWidth="1px"
              borderColor="input_border"
              flexShrink={0}
            >
              <HStack justify="space-between" align="center">
                <HStack gap={3} flex={1} minW={0}>
                  {step === "payment" ? (
                    <IconButton
                      aria-label="Back"
                      variant="ghost"
                      size="sm"
                      flexShrink={0}
                      onClick={handleBack}
                    >
                      <LuChevronLeft />
                    </IconButton>
                  ) : (
                    <Avatar.Root w={10} h={10} flexShrink={0}>
                      <Avatar.Fallback name={consultant.fullName ?? "C"} />
                      <Avatar.Image src={consultant.profilePics} />
                    </Avatar.Root>
                  )}

                  <VStack align="flex-start" gap={0} minW={0}>
                    <Text
                      fontWeight="700"
                      fontSize="0.9375rem"
                      color="text_primary"
                      fontFamily="Outfit"
                      truncate
                    >
                      {step === "booking" ? "Book Consultation" : "Complete Payment"}
                    </Text>
                    {consultant.fullName && (
                      <Text fontSize="0.75rem" color="grey.500" fontFamily="Outfit" truncate>
                        {step === "booking" ? `with ${consultant.fullName}` : consultant.fullName}
                      </Text>
                    )}
                  </VStack>
                </HStack>

                <IconButton
                  aria-label="Close"
                  variant="ghost"
                  size="sm"
                  flexShrink={0}
                  onClick={handleClose}
                >
                  <LuX />
                </IconButton>
              </HStack>
            </Box>

            {/* Body */}
            <Box flex={1} overflowY="auto" css={noScrollbar} p={5}>
              {step === "booking" && (
                <CustomDatePicker
                  consultantId={consultant.id}
                  onClick={handleBookingComplete}
                />
              )}

              {step === "payment" && paymentState && (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret: paymentState.clientSecret }}
                >
                  <PaymentForm
                    clientSecret={paymentState.clientSecret}
                    paymentDetails={paymentState.paymentDetails}
                    onBack={handleBack}
                  />
                </Elements>
              )}
            </Box>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
