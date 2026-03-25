import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Button } from "../ui/button";
// Payment success is now a dedicated page: /payment-success
import { useRouter } from "next/router";
import { LuChevronLeft } from "react-icons/lu";

const ElementLoader = () => {
  return (
    <VStack w="full" gap={5}>
      <Skeleton height="50px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </VStack>
  );
};
interface PaymentDetails {
  basePrice: number;
  price: number;
  penaltyInfo: string;
  slotsPurchased: number;
  discountAmount: number;
  penaltyAmount: number;
  hasRecording: boolean;
}

export default function PaymentForm({
  paymentDetails,
  onBack,
}: {
  paymentDetails: PaymentDetails;
  onBack?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [elementLoading, setElementLoading] = useState(false);
  // Deprecated: success modal is replaced by /payment-success page
  const [isClient, setIsClient] = useState(false);
  const recordingFee = paymentDetails.hasRecording ? 5 : 0;
  const mangerineFee = Math.max(
    paymentDetails.price -
      paymentDetails.basePrice -
      paymentDetails.penaltyAmount -
      recordingFee +
      (paymentDetails.discountAmount || 0),
    0
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    // Persist amount before redirect so it's available after return_url navigation
    if (isClient) {
      try {
        localStorage.setItem("paymentAmount", paymentDetails.price.toString());
      } catch (err) {
        // ignore storage errors
      }
    }

    const consultantId = router?.query?.consultantId as string | undefined;
    const baseOrigin = isClient ? window.location.origin : "";
    const successUrl = consultantId
      ? `${baseOrigin}/payment-success?consultantId=${consultantId}`
      : `${baseOrigin}/payment-success`;

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          // Redirect to payment success page where we show status and toast
          return_url: isClient
            ? successUrl
            : consultantId
              ? `/payment-success?consultantId=${consultantId}`
              : "/payment-success",
        },
      })
      .then((result) => {
        if (result.error) {
          const { error } = result;
          // redirected to the `return_url`.
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            setMessage(error.message);
          } else {
            setMessage("An unexpected error occurred.");
          }

          setIsLoading(false);
        } else {
          // In cases where Stripe does NOT redirect (e.g. some cards), navigate to success page
          if (isClient) {
            router.push(successUrl);
          }
          setIsLoading(false);
        }
      });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <Box
          w="full"
          bg="bg_box"
          borderRadius="24px"
          borderWidth="1px"
          borderColor="rgba(17, 29, 74, 0.08)"
          boxShadow="0px 10px 30px rgba(15, 23, 42, 0.06)"
          p={{ base: 4, lg: 6 }}
        >
          <VStack w="full" align="stretch" gap={6}>
            <HStack justify="space-between" align="center">
              <HStack gap={3} align="center">
                <IconButton
                  aria-label="Back to booking"
                  variant="ghost"
                  borderRadius="full"
                  borderWidth="1px"
                  borderColor="rgba(17, 29, 74, 0.08)"
                  bg="white"
                  color="text_primary"
                  size="sm"
                  onClick={() => {
                    onBack?.();
                  }}
                >
                  <LuChevronLeft />
                </IconButton>
                <Text
                  fontSize={{ base: "1.25rem", lg: "1.5rem" }}
                  fontWeight="700"
                  fontFamily="Outfit"
                  color="text_primary"
                >
                  Payment
                </Text>
              </HStack>
            </HStack>

            <Box
              w="full"
              borderRadius="18px"
              borderWidth="1px"
              borderColor="rgba(17, 29, 74, 0.08)"
              bg="white"
              backgroundImage="linear-gradient(rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.98)), url('/paymentbg.png')"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              backgroundSize="cover"
              p={{ base: 4, lg: 5 }}
            >
              <Text
                fontSize={{ base: "1.125rem", lg: "1.5rem" }}
                fontWeight="700"
                fontFamily="Outfit"
                color="text_primary"
                mb={4}
              >
                Payment Information
              </Text>

              <VStack w="full" gap={3} align="stretch">
                <Flex justify="space-between" width="100%">
                  <Text fontSize="0.95rem" color="text_primary">
                    Consultation Fee
                  </Text>
                  <Text fontSize="0.95rem" color="text_primary">
                    ${paymentDetails.basePrice.toFixed(2)}
                  </Text>
                </Flex>
                {mangerineFee > 0 && (
                  <Flex justify="space-between" width="100%">
                    <Text fontSize="0.95rem" color="text_primary">
                      Mangerine Fee
                    </Text>
                    <Text fontSize="0.95rem" color="text_primary">
                      ${mangerineFee.toFixed(2)}
                    </Text>
                  </Flex>
                )}
                {paymentDetails.penaltyAmount > 0 && (
                  <Flex justify="space-between" width="100%">
                    <Text fontSize="0.95rem" color="text_primary">
                      Penalty Fee
                    </Text>
                    <Text fontSize="0.95rem" color="text_primary">
                      ${paymentDetails.penaltyAmount.toFixed(2)}
                    </Text>
                  </Flex>
                )}
                {paymentDetails.discountAmount > 0 && (
                  <Flex justify="space-between" width="100%">
                    <Text fontSize="0.95rem" color="text_primary">
                      Discount
                    </Text>
                    <Text fontSize="0.95rem" color="text_primary">
                      -${paymentDetails.discountAmount.toFixed(2)}
                    </Text>
                  </Flex>
                )}
                {paymentDetails.hasRecording && (
                  <Flex justify="space-between" width="100%">
                    <Text fontSize="0.95rem" color="text_primary">
                      Recording Fee
                    </Text>
                    <Text fontSize="0.95rem" color="text_primary">
                      ${recordingFee.toFixed(2)}
                    </Text>
                  </Flex>
                )}
                <Flex justify="space-between" width="100%" pt={2}>
                  <Text
                    fontSize={{ base: "1rem", lg: "1.05rem" }}
                    fontWeight="700"
                    color="text_primary"
                  >
                    Total Fee
                  </Text>
                  <Text
                    fontSize={{ base: "1rem", lg: "1.05rem" }}
                    fontWeight="700"
                    color="text_primary"
                  >
                    ${paymentDetails.price.toFixed(2)}
                  </Text>
                </Flex>
              </VStack>
            </Box>

            <VStack w="full" align="stretch" gap={4}>
              <Text
                fontSize={{ base: "1rem", lg: "1.125rem" }}
                fontWeight="700"
                fontFamily="Outfit"
                color="text_primary"
              >
                Pay with
              </Text>
              <Box
                w="full"
                borderRadius="16px"
                borderWidth="1px"
                borderColor="rgba(17, 29, 74, 0.08)"
                bg="white"
                p={{ base: 4, lg: 5 }}
              >
                <PaymentElement
                  onReady={() => setElementLoading(false)}
                  onLoaderStart={() => setElementLoading(true)}
                  id="payment-element"
                  options={paymentElementOptions}
                />
                {elementLoading && <ElementLoader />}
              </Box>
            </VStack>

            <Button
              bg="#111D4A"
              color="white"
              type="submit"
              borderRadius="8px"
              disabled={isLoading || !stripe || !elements}
              id="submit"
              py="12px"
              _hover={{ bg: "#111D4A" }}
              width="100%"
              loading={isLoading}
            >
              Pay ${paymentDetails.price.toFixed(2)}
            </Button>

            <Text
              fontSize="0.8rem"
              lineHeight="1.45"
              color="#999999"
            >
              Your payment information is safeguarded with advanced encryption
              technology.
            </Text>

            {message && (
              <Text
                id="payment-message"
                fontSize="0.875rem"
                color="red.500"
              >
                {message}
              </Text>
            )}
          </VStack>
        </Box>
      </form>

      {/* Success modal removed in favor of /payment-success page */}
    </>
  );
}
