import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Center, Container, Flex, Heading, HStack, Icon, Stack, Text, Textarea, VStack, Spinner } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { AiFillEye, AiOutlineInfoCircle } from 'react-icons/ai';
import AppLayout from 'mangarine/layouts/AppLayout';
import Biocard from 'mangarine/components/ui-components/biocard';
import DashboardCard from 'mangarine/components/ui-components/dashboardcard';
import ActivityEmptyState from 'mangarine/components/ui-components/emptystate';
import { Controller } from 'react-hook-form';
import { useGetAppointmentByIdQuery, useCancelAppointmentMutation } from 'mangarine/state/services/apointment.service';
import CustomButton from 'mangarine/components/customcomponents/button';
import AreyouCancellingModal from 'mangarine/components/ui-components/modals/areyoucancelling';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { outfit } from '../_app';

export default function ConsultationViewPage() {
    const router = useRouter();
    const [client, setClient] = useState(false);
    const { resolvedTheme } = useTheme();
    const { user: authUser } = useAuth();


    const { consultation_id } = router.query as Record<string, string>;
    const { data: apptResp, isLoading: isApptLoading, error: apptError, refetch } = useGetAppointmentByIdQuery(consultation_id as string, { skip: !consultation_id });
    const appointment: any = (apptResp as any)?.data ?? apptResp ?? null;
    const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();
    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    const isConsultantViewer = !!authUser?.isConsultant;
    const counterpart = useMemo(() => {
        if (!appointment) return null;
        // If viewer is consultant, show the client/user details; otherwise show the consultant's details
        const maybeConsultant = appointment?.consultant || appointment?.consultantInfo || appointment?.creator || appointment?.provider;
        return isConsultantViewer ? appointment?.user : maybeConsultant;
    }, [appointment, isConsultantViewer]);


    useEffect(() => {
        setClient(true);
    }, []);

 
    const isDark = resolvedTheme === 'dark';
    const infoBg = isDark ? 'blue.900' : 'blue.50';
    const infoBorder = isDark ? 'blue.700' : 'blue.200';
    const infoColor = isDark ? 'blue.200' : 'blue.700';

    const panelBg = isDark ? 'gray.800' : 'white';

    const goToConsultations = () => {
        router.push('/consultation');
    };

    const rescheduleConsultation = () => {
        router.push(`/consultation/reschedule?consultation_id=${consultation_id}`);
    };

    const cancelConsultation = () => {
        router.push(`/consultation/cancel?consultation_id=${consultation_id}`);
    };

    return (
        <AppLayout>
            <Box
                display={"flex"}
                flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
                my={{ base: "0", md: "12px" }}
                className={outfit.className}
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
                    bg={{ base: "bg_box", md: "transparent" }}
                    display={{ base: "none", md: "none", lg: "none", xl: "flex" }}
                >
                    <Biocard />
                    <DashboardCard />
                </VStack>


                {appointment ? (
                    <VStack bg='bg_box' mx={{ base: "0", md: 4, lg: 4, xl: 4 }}
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


                        <VStack w="full" py="2" alignItems="flex-start">
                            <Text fontSize="1.25rem" fontWeight="600" mb="2" textAlign="left" lineHeight="30px" color="text_primary">Appointment Details</Text>

                            <VStack
                                w="full"

                                rounded="xl"
                                p="4"
                                shadow="xs"
                            >
                                <HStack
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    w="full"
                                >
                                    <Text
                                        color="grey.500"
                                        fontSize="1.25rem"
                                        lineHeight="30px"
                                        fontWeight="400"
                                    >
                                        Client Name:
                                    </Text>
                                    <Text
                                        color="text_primary"
                                        fontSize="1.25rem"
                                        lineHeight="30px"
                                        fontWeight="400"
                                        textTransform="capitalize"
                                    >
                                        {isConsultantViewer ? appointment?.consultant?.fullName : appointment?.user?.fullName}
                                    </Text>
                                </HStack>
                                <HStack
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    w="full"
                                >
                                    <Text
                                        color="grey.500"
                                        fontSize="1.25rem"
                                        lineHeight="30px"
                                        fontWeight="400"
                                    >
                                        Consultation Topic:
                                    </Text>
                                    <Text
                                        color="text_primary"
                                        fontSize="1.25rem"
                                        lineHeight="30px"
                                        fontWeight="400"
                                    >
                                        {appointment?.topic || appointment?.title || appointment?.message || '-'}
                                    </Text>
                                </HStack>
                                <HStack
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    w="full"
                                >
                                    <Text
                                        color="grey.500"
                                        fontSize="1.25rem"
                                        lineHeight="30px"
                                        fontWeight="400"
                                    >
                                        Consultation time:
                                    </Text>
                                    <Text
                                        color="text_primary"
                                        fontSize="1.25rem"
                                        lineHeight="30px"
                                        fontWeight="400"
                                    >
                                        {(() => {
                                            const ts = appointment?.timeslots?.[0] || {};
                                            const rawStart = ts?.startTime || appointment?.startTime;
                                            const rawEnd = ts?.endTime || appointment?.endTime;
                                            const rawDate = appointment?.availability?.date || appointment?.date || ts?.date;

                                            const to12h = (t: any) => {
                                                if (!t) return null;
                                                // If it's a full ISO/date string
                                                const d = new Date(t);
                                                if (!isNaN(d.getTime())) {
                                                    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                                                }
                                                // If it's likely HH:mm or HH:mm:ss
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

                                            const fmtDate = (d: any) => {
                                                if (!d) return null;
                                                const dt = new Date(d);
                                                if (!isNaN(dt.getTime())) {
                                                    return dt.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
                                                }
                                                return String(d);
                                            };

                                            const s = to12h(rawStart);
                                            const e = to12h(rawEnd);
                                            const ds = fmtDate(rawDate);

                                            if (s || e || ds) {
                                                const timeRange = [s, e].filter(Boolean).join(' - ');
                                                return [ds, timeRange].filter(Boolean).join(' | ');
                                            }
                                            return '-';
                                        })()}
                                    </Text>
                                </HStack>
                                <HStack
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    w="full"
                                >
                                    <Text
                                        color="grey.500"
                                        fontSize="1.25rem"
                                        lineHeight="30px"
                                        fontWeight="400"
                                    >
                                        Duration:
                                    </Text>
                                    <Text
                                        color="text_primary"
                                        fontSize="1.25rem"
                                        lineHeight="30px"
                                        fontWeight="400"
                                    >
                                        {(() => {
                                            const minutes = appointment?.timeslots?.[0]?.duration;
                                            if (!minutes && minutes !== 0) return '-';
                                            const h = Math.floor(minutes / 60);
                                            const m = minutes % 60;
                                            const hStr = h > 0 ? `${h}hr${h > 1 ? 's' : ''}` : '';
                                            const mStr = m > 0 ? `${m}mins` : (h === 0 ? '0mins' : '');
                                            return [hStr, mStr].filter(Boolean).join(':');
                                        })()}
                                    </Text>
                                </HStack>
                                <HStack
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    w="full"
                                >
                                    <Text
                                        color="grey.500"
                                        fontSize="1.25rem"
                                        lineHeight="30px"
                                        fontWeight="400"
                                    >
                                        Status:
                                    </Text>
                                    <Text
                                        color="#FF9800"
                                        fontSize="1.25rem"
                                        lineHeight="30px"
                                        fontWeight="400"
                                    >
                                        {appointment?.status || 'Scheduled'}
                                    </Text>
                                </HStack>
                            </VStack>

                        </VStack>
                        {/* Counterpart Details: Consultant for users, Client for consultants */}
                        {counterpart && (
                            <VStack
                                w="full"
                                py="2"
                                rounded="xl"
                                p="4"
                                shadow="xs"
                                mt={2}
                                mb={4}
                                alignItems="stretch"
                            >
                                <Text
                                    color="text_primary"
                                    fontSize="1.25rem"
                                    lineHeight="30px"
                                    fontWeight="600"
                                    mb={2}
                                >
                                    {isConsultantViewer ? 'Client Details' : 'Consultant Details'}
                                </Text>

                                <HStack justifyContent="space-between" alignItems="center" w="full">
                                    <Text color="grey.500" fontSize="1.0rem" lineHeight="26px" fontWeight="400">
                                        Name:
                                    </Text>
                                    <Text textTransform="capitalize" color="text_primary" fontSize="1.0rem" lineHeight="26px" fontWeight="500">
                                        {counterpart?.fullName || counterpart?.name || counterpart?.userName || '-'}
                                    </Text>
                                </HStack>

                                <HStack justifyContent="space-between" alignItems="center" w="full">
                                    <Text color="grey.500" fontSize="1.0rem" lineHeight="26px" fontWeight="400">
                                        Email:
                                    </Text>
                                    <Text color="text_primary" fontSize="1.0rem" lineHeight="26px" fontWeight="400">
                                        {counterpart?.email || counterpart?.contactEmail || '-'}
                                    </Text>
                                </HStack>

                                <HStack justifyContent="space-between" alignItems="center" w="full">
                                    <Text color="grey.500" fontSize="1.0rem" lineHeight="26px" fontWeight="400">
                                        Role/Title:
                                    </Text>
                                    <Text color="text_primary" fontSize="1.0rem" lineHeight="26px" fontWeight="400">
                                        {counterpart?.role || counterpart?.title || counterpart?.occupation || '-'}
                                    </Text>
                                </HStack>

                                <HStack justifyContent="space-between" alignItems="center" w="full">
                                    <Text color="grey.500" fontSize="1.0rem" lineHeight="26px" fontWeight="400">
                                        Phone:
                                    </Text>
                                    <Text color="text_primary" fontSize="1.0rem" lineHeight="26px" fontWeight="400">
                                        {counterpart?.mobileNumber || counterpart?.phone || counterpart?.phoneNumber || '-'}
                                    </Text>
                                </HStack>
                            </VStack>
                        )}
                        {['UPCOMING', 'RESCHEDULED'].includes((appointment?.status || '').toUpperCase()) && (
                            <VStack
                                w="full"
                                py="2"
                                rounded="xl"
                                p="4"
                            // shadow="xs"
                            >
                                <HStack
                                    w="full"
                                    display={"flex"}
                                    alignItems={"center"}
                                    justifyContent={"space-between"}
                                    flexDir={"row"}
                                // mx="auto"
                                >
                                    <CustomButton customStyle={{ flex: 1 }} variant="outline" disabled={isCancelling}
                                       onClick={() => router.push(`/consultation/cancel?consultation_id=${consultation_id}`)}
                                    >
                                        <Text
                                            color={""}
                                            fontWeight={"600"}
                                            fontSize={"1rem"}
                                            lineHeight={"100%"}
                                        >
                                            Cancel Consultation
                                        </Text>

                                    </CustomButton>

                                    <CustomButton
                                        customStyle={{
                                            flex: 1
                                        }}
                                        onClick={() =>router.push(`/consultation/reschedule?consultation_id=${consultation_id}`)}
                                    // loading={isLoading}
                                    // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                                    >
                                        <Text
                                            color={"button_text"}
                                            fontWeight={"600"}
                                            fontSize={"1rem"}
                                            lineHeight={"100%"}
                                        >
                                            Reschedule
                                        </Text>
                                    </CustomButton>
                                </HStack>
                            </VStack>
                        )}
                        
                    </VStack>
                ) : (
                    <VStack>
                        {isApptLoading && (
                            <Flex w="full" justify="center" align="center" py={12}>
                                <Spinner size="lg" />
                            </Flex>
                        )}
                        {apptError && (
                            <Box bg={panelBg} borderRadius="md" boxShadow="md" p={6} w={{ base: "100%", md: "60%" }}>
                                <Text color="red.500">Failed to load appointment.</Text>
                            </Box>
                        )}
                    </VStack>
                )
                }
                <VStack>
                    <ActivityEmptyState />
                </VStack>
            </Box>
        </AppLayout>
    );
}
