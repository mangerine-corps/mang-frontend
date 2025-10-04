import { useEffect, useState } from 'react';
import { Box, Text, Button, Flex, Spinner, Input } from '@chakra-ui/react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import BookingCalendarCard from "mangarine/components/custom/consultants/CalendarUi";
import {useRouter} from "next/router";
import {useAuth} from "mangarine/state/hooks/user.hook";
import { useIntiateTransactionMutation } from "mangarine/state/services/apointment.service";
import { useGetConsultantPricingOnDemandMutation } from "mangarine/state/services/consultant.service";

const CustomDatePicker = ({onClick}) => {
    const router = useRouter()
    const [date, setDate] = useState<any>();
    const [slots, setSlots] = useState<string[]>([]);
    const [message, setMessage] = useState('');
    const [videoOption, setVideoOption] = useState<boolean>(false)
    const {user} = useAuth()
    // const [bookAppointment, {isLoading}] = useBookAppointmentMutation()
    const [initiateTransaction,{isLoading}] = useIntiateTransactionMutation()
    const {
        query: {consultantId},
    } = router;

    // Fetch consultant pricing (on-demand mutation)
    const [fetchPricing, { data: pricingData, isLoading: isPricingLoading, error: pricingError }] = useGetConsultantPricingOnDemandMutation();

    useEffect(() => {
        if (consultantId) {
            fetchPricing(consultantId as string);
        }
    }, [consultantId, fetchPricing]);


    useEffect(() => {
        console.log(date, "date")
    }, [date])

    const bookConsultation = () => {
        const appointmentDetails = {
            consultantId,
            userId: user.id,
            message: message,
            availabilityId: date.id,
            timeslots: slots,
            videoOption: videoOption,

        }
        const formData ={
            amount: pricingData?.data?.consultant?.pricing?.flatPrice || 75,
            currency: 'usd',
            consultationDetails: appointmentDetails
        }
        initiateTransaction(formData).unwrap().then((payload) => {
            const {data} = payload      
            onClick(data)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            {/* 🌍 Custom Global Calendar Styles */}


            <Box
                // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
                bg="bg_box"
                p="6"
                borderRadius="20px"
                boxShadow="md"
                w="full"
            >
                <Flex alignItems="center" mb="5">
                    {/* <Button
                        variant="ghost"
                        size="sm"
                        mr="2"
                        p="0"
                        minW="auto"
                        height="auto"
                    >
                        <Image src="/images/go-back.png" alt="Back" boxSize="24px"/>
                    </Button> */}
                    <Text
                        fontSize="1.25rem"
                        font="outfit"
                        fontWeight="600"
                        color="text_primary"
                    >
                        Book Consultation
                    </Text>
                </Flex>
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
                    Consultation Title
                </Text>
                <Input
                    placeholder="Enter consultation title/description"
                    // minH="100px"
                    value={message}
                    onChange={(e: any) => setMessage(e.target.value)}
                    mb="4"
                    color="text_primary"
                    p={3}
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

                <Button
                    bg="bt_schedule"
                    color="white"
                    flex={1}
                    disabled={isLoading|| !message || !date || !slots.length}
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
