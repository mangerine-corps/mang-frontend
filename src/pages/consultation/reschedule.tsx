import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Center, Container, Flex, Grid, Heading, HStack, Icon, Stack, Text, Textarea, VStack } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import AppLayout from 'mangarine/layouts/AppLayout';
import Biocard from 'mangarine/components/ui-components/biocard';
import DashboardCard from 'mangarine/components/ui-components/dashboardcard';
import ActivityEmptyState from 'mangarine/components/ui-components/emptystate';
import CustomButton from 'mangarine/components/customcomponents/button';
import BookingCalendarCard from 'mangarine/components/custom/consultants/CalendarUi';
import { useGetAppointmentByIdQuery, useRescheduleAppointmentMutation } from 'mangarine/state/services/apointment.service';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import moment from 'moment';
import ConfirmActionModal from 'mangarine/components/ui-components/modals/confirmaction';
import { isEmpty, size } from 'es-toolkit/compat';

export default function ConsultationReschedulePage() {
    const router = useRouter();
    const [client, setClient] = useState(false);
    const [date, setDate] = useState<any>();
    const [slots, setSlots] = useState<string[]>([]);
    const { resolvedTheme } = useTheme();
    const [selectedTime, setSelectedTime] = useState("08:00 am");
    const [open, setopen] = useState(false);
    const [cancel, setcancel] = useState(false);

    const { user: authUser } = useAuth();



    const { consultation_id } = router.query as Record<string, string>;
    const { data: apptResp, isLoading: isApptLoading, error: apptError, refetch } = useGetAppointmentByIdQuery(consultation_id as string, { skip: !consultation_id });
    const appointment: any = (apptResp as any)?.data ?? apptResp ?? null;
    console.log(appointment)
    const isConsultantViewer = !!authUser?.isConsultant;
    const { cId, isConsultant, appointmentDate, startTime, consultant, user, slotCount } = useMemo(() => {
        const cName = appointment?.consultant?.fullName || "-";
        const uName = appointment?.user?.fullName || "-";
        const cId = appointment?.consultant?.id;
        // If viewer is consultant, show the client/user details; otherwise show the consultant's details
        const maybeConsultant = appointment?.consultant || appointment?.consultantInfo || appointment?.creator || appointment?.provider;
        const isConsultant = isConsultantViewer ? appointment?.user : maybeConsultant;
        const availability = appointment?.availability;
        const timeslot = appointment?.timeslots
        const appointmentDate = availability?.date;
        const startTime = timeslot && timeslot[0]?.startTime;
        const slotCount = size(timeslot)
        return { cId, isConsultant, appointmentDate, startTime, consultant: cName, user: uName, slotCount };
    }, [appointment, isConsultantViewer,]);
    useEffect(() => {

    }, [date]);
    const openModal = () => {
        // onOpenChange()
        setopen(true);
    };


    useEffect(() => {
        setClient(true);
    }, []);

    // Manually designed info card colors (Chakra v3: compute via next-themes)
    const isDark = resolvedTheme === 'dark';
    const infoBg = isDark ? 'green.900' : 'green.50';
    const infoBorder = isDark ? 'green.700' : 'green.200';
    const infoColor = isDark ? 'green.200' : 'green.700';

    const panelBg = isDark ? 'gray.800' : 'white';

    const goToConsultations = () => {
        router.push('/consultation');
    };


    const viewConsultation = () => {
        router.push(`/consultation/view?consultation_id=${consultation_id}`);
    };

    const [reschedule, { isLoading: isRescheduling }] = useRescheduleAppointmentMutation();

    const handleReschedule = async () => {
        if (size(slots) > slotCount) {
            return;
        }
        if (!date?.id || !cId || !consultation_id || !slots?.length) {
            return;
        }
        const appointmentDetails = {
            consultationId: consultation_id,
            consultantId: cId,
            availabilityId: date.id,
            timeslots: slots,
        } as const;
        try {
            await reschedule(appointmentDetails).unwrap();
            setopen(false);
            router.push(`/consultation/view?consultation_id=${consultation_id}`);
        } catch (e) {
            console.log('Failed to reschedule', e);
        }
    };

    return (
        <AppLayout>
            <Box
                display={"flex"}
                flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
                my={{ base: "0", md: "12px" }}
                justifyContent={"space-between"}
                w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
                mx="auto"
                pos="relative"
                overflowY={"scroll"}
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
                    bg={{ base: "bg_box", md: "transparent" }}
                    display={{ base: "none", md: "none", lg: "none", xl: "flex" }}
                >
                    <Biocard />
                    <DashboardCard />
                </VStack>

                <Stack bg='white' mx={{ base: "0", md: 4, lg: 4, xl: 4 }}
                    flex={1}
                    h="fit-content"
                    p={8}
                    // bg="main_background"
                    // overflowY={{ base: "scroll", md: "scroll" }}
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
                    rounded={"xl"}>


                    <Text
                        textAlign={"left"}
                        w="full"
                        // px={"6"}
                        fontSize={"1.5rem"}
                        fontFamily={"Outfit"}
                        color={"text_primary"}
                        fontWeight={"600"}
                    >
                         Reschedule Consultation
                    </Text>



                    <VStack alignItems={"flex-start"} py="2" pt="8">
                        <HStack w='full' alignItems={"center"}>

                            <Text
                                // px={"6"}
                                fontSize={"1rem"}
                                fontFamily={"Outfit"}
                                color={"grey.300"}
                                fontWeight={"400"}
                            >
                                {isConsultant ? "Client" : "Consultant"}:
                            </Text>
                            <Text
                                // px={"6"}
                                fontSize={"1.25rem"}
                                fontFamily={"Outfit"}
                                color={"grey.300"}
                                textTransform={'capitalize'}
                                fontWeight={"400"}
                            >
                                {isConsultant ? user : consultant}
                            </Text>
                        </HStack>
                        <HStack w='full' alignItems={"center"}>

                            <Text

                                // px={"6"}
                                fontSize={"1rem"}
                                fontFamily={"Outfit"}
                                color={"grey.300"}
                                fontWeight={"400"}
                            >
                                Current Date:
                            </Text>
                            <Text

                                // px={"6"}
                                fontSize={"1.25rem"}
                                fontFamily={"Outfit"}
                                color={"grey.300"}
                                fontWeight={"400"}
                            >
                                {` ${appointmentDate && moment(appointmentDate).format('Do MMM YYYY')}`}
                            </Text>
                        </HStack>
                        <HStack alignItems={"flex-start"}>

                            <Text
                                textAlign={"left"}

                                // px={"6"}
                                fontSize={"1rem"}
                                fontFamily={"Outfit"}
                                color={"grey.300"}
                                fontWeight={"400"}
                            >
                                Current Time:
                            </Text>

                            <Text
                                textAlign={"left"}
                                // px={"6"}
                                fontSize={"1rem"}
                                fontFamily={"Outfit"}
                                color={"grey.300"}
                                fontWeight={"400"}
                            >
                                {` ${startTime && moment(`${appointmentDate} ${startTime}`).format('hh:mm A')}`}
                            </Text>
                        </HStack>
                    </VStack>
                    <Text
                        textAlign={"left"}
                        w="full"
                        // px={"6"}
                        fontSize={"1.25rem"}
                        fontFamily={"Outfit"}
                        color={"text_primary"}
                        fontWeight={"600"}
                        py="6"
                    >
                        Choose a new date and time
                    </Text>

                    <HStack
                        spaceX={8}
                        pb="8"
                    // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
                    >
                        {/* Centering the image */}

                        <VStack alignItems={"center"}>
                            <Box mb={4}>
                                {
                                    cId && (

                                        <BookingCalendarCard userId={cId} slots={slots} setSlots={setSlots} date={date} setDate={setDate} />
                                    )
                                }

                            </Box>
                        </VStack>

                    </HStack>
                    <Box mx="auto" w="100%" pb={6}>
                        <HStack
                            w="full"
                            display={"flex"}
                            justifyContent={"center"}
                            flexDir={"row"}
                        // mx="auto"
                        >
                            <CustomButton
                                customStyle={{
                                    w: "35%",
                                    bg: "main_background",
                                    borderWidth: "2px",
                                }}
                                onClick={() => { }}
                            // loading={isLoading}
                            // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                            >
                                <Text
                                    color={"text_primary"}
                                    fontWeight={"600"}
                                    fontSize={"1rem"}
                                    lineHeight={"100%"}
                                >
                                    Cancel
                                </Text>
                            </CustomButton>
                            <CustomButton
                                customStyle={{
                                    w: "35%",
                                }}
                                onClick={() => setopen(true)}
                                disabled={isEmpty(slots)}
                            // loading={isLoading}
                            // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                            >
                                <Text
                                    color={"button_text"}
                                    fontWeight={"600"}
                                    fontSize={"1rem"}
                                    lineHeight={"100%"}
                                >
                                    Confirm Reschedule
                                </Text>
                            </CustomButton>
                        </HStack>
                    </Box>
                    {/* Confirmation Modal - match app design */}
                    <ConfirmActionModal
                        isOpen={open}
                        onOpenChange={() => setopen(false)}
                        title={'Are you sure you want to reschedule?'}
                        description={`New Date: ${date?.date ? moment(date.date).format('Do MMM YYYY') : '—'}  •  Selected Slots: ${slots?.length || 0}${appointmentDate ? `  •  Current Date: ${moment(appointmentDate).format('Do MMM YYYY')}` : ''}`}
                        iconSrc={'/icons/cancel.svg'}
                        confirmLabel={'Yes, confirm'}
                        cancelLabel={'No Keep'}
                        onConfirm={handleReschedule}
                        isLoading={isRescheduling}
                        size={'xs'}
                    />

                </Stack>
                <VStack>
                    <ActivityEmptyState />
                </VStack>
            </Box>
        </AppLayout>
    );
}
