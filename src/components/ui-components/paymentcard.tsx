import { useState, useEffect } from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
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
  clientSecret,
  onBack,
}: {
  paymentDetails: PaymentDetails;
  clientSecret: string;
  onBack?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");
  const [isCardReady, setIsCardReady] = useState(false);
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

  useEffect(() => {
    setMessage(null);
    if (paymentMethod !== "card") {
      setIsCardReady(false);
    }
  }, [paymentMethod, clientSecret]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    if (paymentMethod !== "card") return;

    setIsLoading(true);

    if (isClient) {
      try {
        localStorage.setItem("paymentAmount", paymentDetails.price.toString());
      } catch {}
    }

    const consultantId = router?.query?.consultantId as string | undefined;
    const baseOrigin = isClient ? window.location.origin : "";
    const successUrl = consultantId
      ? `${baseOrigin}/payment-success?consultantId=${consultantId}`
      : `${baseOrigin}/payment-success`;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement || !isCardReady) {
      setMessage("Card details are still loading. Please wait a moment and try again.");
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
      setIsLoading(false);
    } else {
      // Extract payment intent ID from the client secret (pi_xxx_secret_xxx → pi_xxx)
      const intentId = paymentIntent?.id ?? clientSecret.split("_secret_")[0];
      const sep = successUrl.includes("?") ? "&" : "?";
      router.push(`${successUrl}${sep}payment_intent=${intentId}`);
    }
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
                  bg="bg_box"
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
              bg="bg_box"
              backgroundImage="linear-gradient(rgba(255, 255, 255, 0.99), rgba(255, 255, 255, 0.99)), url('/paymentbg.webp')"
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

              {/* Payment method radio selectors */}
              <HStack gap={6}>
                <Box as="label" display="flex" alignItems="center" gap={2} cursor="pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    style={{ accentColor: "#111D4A", width: 16, height: 16 }}
                  />
                  <Text fontSize="0.875rem" color="text_primary" fontFamily="Outfit">
                    Card (Powered by Stripe)
                  </Text>
                </Box>

                <Box as="label" display="flex" alignItems="center" gap={2} cursor="pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    style={{ accentColor: "#111D4A", width: 16, height: 16 }}
                  />
                  <Text fontSize="0.875rem" color="text_primary" fontFamily="Outfit">
                    PayPal
                  </Text>
                </Box>
              </HStack>

              {/* Card — Stripe CardElement (card only) */}
              {paymentMethod === "card" && (
                <Box
                  w="full"
                  borderRadius="16px"
                  borderWidth="1px"
                  borderColor="rgba(17, 29, 74, 0.08)"
                  bg="bg_box"
                  p={{ base: 4, lg: 5 }}
                >
                  <CardElement
                    onReady={() => setIsCardReady(true)}
                    onChange={(event) => {
                      if (event.error?.message) {
                        setMessage(event.error.message);
                        return;
                      }

                      setMessage(null);
                    }}
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#111D4A",
                          "::placeholder": { color: "#aab7c4" },
                        },
                      },
                    }}
                  />
                </Box>
              )}

              {/* PayPal */}
              {paymentMethod === "paypal" && (
                <Box
                  w="full"
                  borderRadius="16px"
                  borderWidth="1px"
                  borderColor="rgba(17, 29, 74, 0.08)"
                  bg="bg_box"
                  p={{ base: 4, lg: 5 }}
                  textAlign="center"
                >
                  <Text fontSize="0.875rem" color="gray.400" fontFamily="Outfit">
                    PayPal integration coming soon.
                  </Text>
                </Box>
              )}
            </VStack>

            <Button
              bg="button_bg"
              color="button_text"
              type="submit"
              borderRadius="8px"
              disabled={
                isLoading ||
                paymentMethod === "paypal" ||
                !stripe ||
                !elements ||
                !isCardReady
              }
              id="submit"
              py="12px"
              _hover={{ opacity: 0.85 }}
              width="100%"
              loading={isLoading}
            >
              Pay ${paymentDetails.price.toFixed(2)}
            </Button>

            <Text
              fontSize="0.8rem"
              lineHeight="1.45"
              color="text_muted"
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
