import { useEffect, useState } from 'react';
import { Box, Text, Button, Flex, Spinner, Textarea } from '@chakra-ui/react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import BookingCalendarCard from "mangarine/components/custom/consultants/CalendarUi";
import {useRouter} from "next/router";
import {useAuth} from "mangarine/state/hooks/user.hook";
import {
    useIntiateTransactionMutation,
    useInitializePaystackPaymentMutation,
    useCreatePaypalOrderMutation,
} from "mangarine/state/services/apointment.service";
import { useGetConsultantPricingOnDemandMutation } from "mangarine/state/services/consultant.service";

type PaymentMethod = 'stripe' | 'paystack' | 'paypal';

const RequiredMark = () => (
    <Text as="span" color="red.500" ml="1">
        *
    </Text>
);

const CustomDatePicker = ({onClick}) => {
    const router = useRouter()
    const [date, setDate] = useState<any>();
    const [slots, setSlots] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [videoOption, setVideoOption] = useState<boolean>(false)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
    const {user} = useAuth()
    const [initiateTransaction, {isLoading: stripeLoading}] = useIntiateTransactionMutation()
    const [initializePaystack, {isLoading: paystackLoading}] = useInitializePaystackPaymentMutation()
    const [createPaypalOrder, {isLoading: paypalLoading}] = useCreatePaypalOrderMutation()
    const isLoading = stripeLoading || paystackLoading || paypalLoading;

    const {
        query: {consultantId},
    } = router;

    const [fetchPricing, { data: pricingData, isLoading: isPricingLoading, error: pricingError }] = useGetConsultantPricingOnDemandMutation();

    useEffect(() => {
        if (consultantId) {
            fetchPricing(consultantId as string);
        }
    }, [consultantId, fetchPricing]);

    useEffect(() => {
        console.log(date, "date")
    }, [date])

    const consultationDetails = {
        consultantId,
        userId: user.id,
        message,
        availabilityId: date?.id,
        timeslots: slots,
        videoOption,
    };

    const bookConsultation = async () => {
        if (paymentMethod === 'stripe') {
            const formData = {
                amount: pricingData?.data?.consultant?.pricing?.flatPrice || 75,
                currency: 'usd',
                consultationDetails,
            };
            initiateTransaction(formData).unwrap().then((payload) => {
                const {data} = payload;
                onClick(data);
            }).catch((error) => {
                console.log(error);
            });
            return;
        }

        if (paymentMethod === 'paystack') {
            try {
                // Store consultantId so the success page can redirect back
                if (typeof window !== 'undefined') {
                    localStorage.setItem('paymentConsultantId', consultantId as string);
                }
                const payload = await initializePaystack({
                    currency: 'NGN',
                    consultationDetails,
                }).unwrap();
                const authorizationUrl = payload?.data?.authorizationUrl ?? payload?.authorizationUrl;
                if (authorizationUrl) {
                    window.location.href = authorizationUrl;
                }
            } catch (error) {
                console.log(error);
            }
            return;
        }

        if (paymentMethod === 'paypal') {
            try {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('paymentConsultantId', consultantId as string);
                }
                const payload = await createPaypalOrder({
                    currency: 'USD',
                    consultationDetails,
                }).unwrap();
                const approveUrl = payload?.data?.approveUrl ?? payload?.approveUrl;
                if (approveUrl) {
                    window.location.href = approveUrl;
                }
            } catch (error) {
                console.log(error);
            }
            return;
        }
    };

    const paymentOptions: { value: PaymentMethod; label: string }[] = [
        { value: 'stripe', label: 'Card (Stripe)' },
        { value: 'paystack', label: 'Paystack' },
        { value: 'paypal', label: 'PayPal' },
    ];

    return (
        <>
            <Box
                bg="bg_box"
                p="6"
                borderRadius="20px"
                boxShadow="md"
                w="full"
            >
                <Flex alignItems="center" mb="5">
                    <Text
                        fontSize="1.25rem"
                        font="outfit"
                        fontWeight="600"
                        color="text_primary"
                    >
                        Book Consultation
                    </Text>
                </Flex>
                <Text
                    fontSize="1.05rem"
                    font="outfit"
                    fontWeight="600"
                    mb="2"
                    color="text_primary"
                >
                    Select Date
                    <RequiredMark />
                </Text>
                <Box mb={4}>
                    <BookingCalendarCard slots={slots} setSlots={setSlots} date={date} setDate={setDate}/>
                </Box>

                <Text
                    fontSize="1.25rem"
                    font="outfit"
                    fontWeight="600"
                    mb="2"
                    color="text_primary"
                >
                    Duration & Pricing{" "}
                </Text>
                <Box
                    bg="time_boxconsult"
                    mb={6}
                    border="none"
                    width="100%"
                    p={2}
                    borderRadius="md"
                    position="relative"
                >
                    {isPricingLoading ? (
                        <Flex align="center" justify="center" gap={2}>
                            <Spinner size="sm" color="blue.500" />
                            <Text color="text_primary" fontSize="sm">Loading pricing...</Text>
                        </Flex>
                    ) : pricingError ? (
                        <Text color="red.500" fontSize="sm">Failed to load pricing</Text>
                    ) : pricingData?.data?.consultant?.pricing ? (
                        <Text color="text_primary">
                            60 minutes (1hr) (${pricingData.data.consultant.pricing.flatPrice || 75})
                        </Text>
                    ) : (
                        <Text color="text_primary">60 minutes (1hr) ($75)</Text>
                    )}
                </Box>

                <Text
                    fontSize="1.25rem"
                    font="outfit"
                    fontWeight="600"
                    mb="2"
                    color="text_primary"
                >
                    Message to Consultant
                    <RequiredMark />
                </Text>
                <Textarea
                    placeholder="Enter your message to the consultant"
                    value={message}
                    onChange={(e: any) => setMessage(e.target.value)}
                    mb="4"
                    color="text_primary"
                    p={3}
                    minH="120px"
                    resize="vertical"
                />

                <Flex align="center" mb={6}>
                    <input
                        type="checkbox"
                        id="videoOption"
                        checked={videoOption}
                        onChange={(e) => setVideoOption(e.target.checked)}
                        style={{
                            marginRight: "8px",
                            width: "16px",
                            height: "16px",
                        }}
                    />
                    <Text
                        color="text_primary"
                        lineHeight="24px"
                        fontSize="1rem"
                        font="outfit"
                        fontWeight="400"
                    >
                        Send me a recorded video of the consultation at <span>$5</span>
                    </Text>
                </Flex>

                <Text
                    fontSize="1rem"
                    font="outfit"
                    fontWeight="600"
                    mb="3"
                    color="text_primary"
                >
                    Payment Method
                </Text>
                <Flex gap={4} mb={6} wrap="wrap">
                    {paymentOptions.map((opt) => (
                        <Box
                            as="label"
                            key={opt.value}
                            display="flex"
                            alignItems="center"
                            gap={2}
                            cursor="pointer"
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={opt.value}
                                checked={paymentMethod === opt.value}
                                onChange={() => setPaymentMethod(opt.value)}
                                style={{ accentColor: "#111D4A", width: 16, height: 16 }}
                            />
                            <Text fontSize="0.875rem" color="text_primary" font="outfit">
                                {opt.label}
                            </Text>
                        </Box>
                    ))}
                </Flex>

                <Button
                    bg="bt_schedule"
                    color="white"
                    flex={1}
                    disabled={isLoading || !message || !date || !slots.length}
                    _hover={{bg: "bt_schedule_hover"}}
                    w="100%"
                    loading={isLoading}
                    onClick={bookConsultation}
                >
                    Proceed to payment
                </Button>
            </Box>
        </>
    );
};

export default CustomDatePicker;
