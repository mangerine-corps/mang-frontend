import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import { Box, Flex, HStack, Skeleton, Spinner, Text, VStack } from "@chakra-ui/react";
import { Button } from "../ui/button";
// Payment success is now a dedicated page: /payment-success
import { useRouter } from "next/router";

const ElementLoader = () => {
  return (
    <VStack w='full' gap={5}>
      <Skeleton height="50px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </VStack>
  )
}
interface PaymentDetails {
  basePrice: number
  price: number,
  penaltyInfo: string,
  slotsPurchased: number,
  discountAmount: number,
  penaltyAmount: number,
  hasRecording: boolean;
}

export default function PaymentForm({ paymentDetails }: { paymentDetails: PaymentDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [elementLoading, setElementLoading] = useState(false);
  // Deprecated: success modal is replaced by /payment-success page
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [isClient, setIsClient] = useState(false);

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
        localStorage.setItem('paymentAmount', paymentDetails.price.toString());
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
          return_url: isClient ? successUrl : (consultantId ? `/payment-success?consultantId=${consultantId}` : "/payment-success"),
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
    layout: "accordion",
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <VStack w='full' gap={0} spaceY={3} p={3}>
          <Box w='full'>

            <PaymentElement
              onReady={() => setElementLoading(false)}
              onLoaderStart={() => setElementLoading(true)}
              id="payment-element"
              options={paymentElementOptions}
            />
          </Box>
          {
            elementLoading && (
              <ElementLoader />
            )
          }

          <Box w='full' id="button-text">

            <Box
              maxW="360px"
              w="100%"
              bg="bg_box"
              p="16px"
              borderRadius="8px"
              boxShadow="md"
              mx="auto"
            >
              <Text
                fontSize="lg"
                fontWeight="bold"
                font="outfit"
                color={"text_primary"}
              >
                Payment Information
              </Text>

              <Flex flexDirection="column" gap="8px" width="100%">
                <Flex justify="space-between" width="100%">
                  <Text fontSize="0.875rem" color={"text_primary"}>
                    Consultation Fee
                  </Text>
                  <Text
                    fontWeight={"bold"}
                    fontSize="0.875rem"
                    color="text_primary"
                  >
                    ${paymentDetails.basePrice.toFixed(2)}
                  </Text>
                </Flex>
              </Flex>
              {
                paymentDetails.penaltyAmount > 0 && (
                  <Flex flexDirection="column" gap="8px" width="100%">
                    <Flex justify="space-between" width="100%">
                      <Text fontSize="0.875rem" color={"text_primary"}>
                        Penalty Fee
                      </Text>
                      <Text
                        fontWeight={"bold"}
                        fontSize="0.875rem"
                        color="text_primary"
                      >
                        ${paymentDetails.penaltyAmount.toFixed(2)}
                      </Text>
                    </Flex>
                  </Flex>
                )
              }
              {
                paymentDetails.discountAmount && (
                  <Flex flexDirection="column" gap="8px" width="100%">
                    <Flex justify="space-between" width="100%">
                      <Text fontSize="0.875rem" color={"text_primary"}>
                        Discount Fee
                      </Text>
                      <Text
                        fontWeight={"bold"}
                        fontSize="0.875rem"
                        color="text_primary"
                      >
                        ${paymentDetails.discountAmount.toFixed(2)}
                      </Text>
                    </Flex>
                  </Flex>
                )
              }
              {
                paymentDetails.hasRecording && (

                  <Flex flexDirection="column" gap="8px" width="100%">
                    <Flex justify="space-between" width="100%">
                      <Text fontSize="0.875rem" color={"text_primary"}>
                        Recording Fee
                      </Text>
                      <Text
                        fontWeight={"bold"}
                        fontSize="0.875rem"
                        color="text_primary"
                      >
                        {'$5.00'}
                      </Text>
                    </Flex>
                  </Flex>
                )
              }
              <Button
                bg="bt_schedule"
                color="white"
                flex={1}
                type="submit"
                borderRadius="6px"
                disabled={isLoading || !stripe || !elements}
                id="submit"
                p="10px"
                _hover={{ bg: "bt_schedule_hover" }}
                width="100%"
                mt={6}
              >
                Pay | ${paymentDetails.price.toFixed(2)}
              </Button>
            </Box>

          </Box>
          {/* Show any error or success messages */}
          {message && <div id="payment-message">{message}</div>}
        </VStack>
      </form>
      
      {/* Success modal removed in favor of /payment-success page */}
    </>
  );
}
