import React, { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Text,
    Button,
    Textarea,
    Grid,
    Flex,
    Image, Heading,
    SimpleGrid,
    IconButton, Icon,
    Spinner,
    Stack,
} from '@chakra-ui/react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useGetAvailabilityMutation } from "mangarine/state/services/availability.service"; // theme css file
import { format } from 'date-fns';
import { endOfMonth } from 'date-fns';
import { useRouter } from "next/router";
import { first, isEmpty } from "lodash";

interface Props {
    doctorAvailabilities: any[]; // Key:YYYY-MM-DD, Value: Array of time strings
    onDateSelect: (date: Date | null) => void;
    gotoNext: () => void;
    gotoPrev: () => void;
    setSelectedDay: any;
    selectedDay: any;
    calendarDays: any;
    currentMonth: any;
    months: string[];
    daysOfWeek: string[];
    currentYear: any;
    setSelectedDate: any
}


const AvailabilityCalendar: React.FC<Props> = ({
    doctorAvailabilities,
    onDateSelect,
    gotoNext,
    gotoPrev,
    setSelectedDay,
    selectedDay,
    calendarDays,
    currentMonth,
    months,
    daysOfWeek,
    currentYear,
    setSelectedDate
}) => {
    // Handle day click
    const handleDayClick = (date) => {
        if (!date) return; // Do nothing if it's an empty cell

        const formattedDate = formatDateToYYYYMMDD(date);
        if (!isEmpty(doctorAvailabilities.filter(availability => availability.date === formattedDate))) {
            const currentDay = doctorAvailabilities.filter(availability => availability.date === formattedDate)
            setSelectedDate(currentDay[0])
            setSelectedDay(date);
            onDateSelect(date);
        } else {
            setSelectedDay(null); // Deselect if no availability
            onDateSelect(null);
        }
    };

    return (
        <Box bg="bg_box" p={4}
            borderRadius="lg">
            {/* Calendar Header */}
            <Flex justify="space-between" align="center" mb={6}>
                <Icon

                    onClick={gotoPrev}
                    aria-label="Previous Month"
                    bg="ghost"
                    colorScheme="blue"
                    size="lg"
                    borderRadius="full"
                ><BiChevronLeft /></Icon>
                <Heading as="h2" size="lg" fontWeight="semibold" color={"text_primary"}>
                    {months[currentMonth]} {currentYear}
                </Heading>
                <Icon

                    onClick={gotoNext}
                    aria-label="Next Month"
                    bg="ghost"
                    colorScheme="blue"
                    size="lg"
                    borderRadius="full"
                ><BiChevronRight /></Icon>
            </Flex>

            {/*Days of the Week */}
            <SimpleGrid columns={7} gap={2} textAlign="center" fontWeight="medium" color={"text_primary"} mb={4}>
                {daysOfWeek.map((day) => (
                    <Box key={day} py={2}>
                        {day}
                    </Box>
                ))}
            </SimpleGrid>

            {/* Calendar Grid */}
            <SimpleGrid columns={7} gap={2}>
                {calendarDays.map((day, index) => {
                    const isCurrentMonthDay = day !== null;
                    const formattedDate = isCurrentMonthDay ? formatDateToYYYYMMDD(day) : '';
                    const hasAvailability = isCurrentMonthDay && !isEmpty(doctorAvailabilities.filter(availability => availability.date === formattedDate));
                    const isSelected = selectedDay && isCurrentMonthDay && formatDateToYYYYMMDD(selectedDay) === formattedDate;
                    const isToday = isCurrentMonthDay && formatDateToYYYYMMDD(day) === formatDateToYYYYMMDD(new Date());

                    return (
                        <Flex
                            key={index}
                            position="relative"
                            p={2}
                            // h="24" // Chakra equivalent for h-24
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="flex-start"
                            borderRadius="lg"
                            transition="all 0.2s"
                            bg={isCurrentMonthDay ? (isSelected ? 'green.100' : (hasAvailability ? 'time_boxconsult' : 'gray.100')) : 'gray.200'}
                            opacity={isCurrentMonthDay ? 1 : 0.5}
                            cursor={isCurrentMonthDay ? 'pointer' : 'not-allowed'}
                            _hover={{
                                bg: isCurrentMonthDay ? (hasAvailability ? 'green.100' : 'gray.100') : 'gray.200',
                                color: hasAvailability ? 'black' : 'gray.100'
                            }}
                            border={isToday && !isSelected ? '2px solid' : 'none'}
                            borderColor={isToday && !isSelected ? 'blue.400' : 'transparent'}
                            boxShadow={isSelected ? '0 0 0 2px var(--chakra-colors-blue-500)' : 'none'} // Ring effect
                            onClick={() => handleDayClick(day)}
                        >
                            <Text fontSize="lg" fontWeight="semibold"
                                color={isCurrentMonthDay ? (hasAvailability ? 'text-primary' : 'black') : 'gray.500'}>
                                {isCurrentMonthDay ? day.getDate() : ''}
                            </Text>


                        </Flex>
                    );
                })}
            </SimpleGrid>
        </Box>
    );
};

const formatDateToYYYYMMDD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
type BookingProps = {
    date: any;
    setDate: any;
    slots: string[];
    setSlots: any;
    userId?: string;
}
const BookingCalendarCard = ({ date, setDate, slots, setSlots, userId }: BookingProps) => {
    const router = useRouter()
    const {
        query: { consultantId },
    } = router;
    const [availabilities, setAvailabilities] = useState<any>()

    const [getAvailability, { isLoading }] = useGetAvailabilityMutation()
    const [selectedDate, setSelectedDate] = useState(null);



    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState<string[]>([])


    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Function to get the number of days in a month
    const getDaysInMonth = useCallback((year, month) => {
        return new Date(year, month + 1, 0).getDate();
    }, []);

    // Function to get the first day of the month (0 for Sunday, 1 for Monday, etc.)
    const getFirstDayOfMonth = useCallback((year, month) => {
        return new Date(year, month, 1).getDay();
    }, []);

    // Generate all days for the calendar grid
    const generateCalendarDays = useCallback(() => {
        const numDays = getDaysInMonth(currentYear, currentMonth);
        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

        const days = [];

        // Add leading empty cells for alignment
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let i = 1; i <= numDays; i++) {
            days.push(new Date(currentYear, currentMonth, i));
        }

        return days;
    }, [currentYear, currentMonth, getDaysInMonth, getFirstDayOfMonth]);

    const calendarDays = generateCalendarDays();




    // Handle month navigation
    const goToPreviousMonth = () => {
        setCurrentMonth((prevMonth) => {
            if (prevMonth === 0) {
                setCurrentYear((prevYear) => prevYear - 1);
                return 11; // December
            }
            return prevMonth - 1;
        });
        setSelectedDay(null); // Clear selection on month change
        // onDateSelect(null);
    };

    const goToNextMonth = () => {
        setCurrentMonth((prevMonth) => {
            if (prevMonth === 11) {
                setCurrentYear((prevYear) => prevYear + 1);
                return 0; // January
            }
            return prevMonth + 1;
        });
        setSelectedDay(null); // Clear selection on month change
        // onDateSelect(null);
    };

    useEffect(() => {
        setSlots([])
    }, [date, setSlots])


    const fetchAvailability = useCallback(
        (currentMonth: number) => {
            const formData = {
                userId: consultantId ?? userId,
                startDate: format(new Date(new Date(currentYear, currentMonth)), 'yyyy/MM/dd'),
                endDate: format(endOfMonth(new Date(currentYear, currentMonth)), 'yyyy/MM/dd')
            }
            getAvailability(formData).unwrap().then((payload) => {
                const { data } = payload;
                setAvailabilities(data)
            }).catch((error) => {
                console.log(error)
            })
        },
        [],
    )

    useEffect(() => {
        if (currentMonth) {
            setSelectedSlots([])
            fetchAvailability(currentMonth);
        }
    }, [currentMonth, fetchAvailability]);

    const handleSlotSelection = (selectedSlot: any) => {
        if (slots.includes(selectedSlot)) {
            const newSlots = slots.filter(slot => slot !== selectedSlot)
            setSlots(newSlots);
        } else {
            setSlots([...slots, selectedSlot])
        }
    }


    return (
        <Stack flexDir={"column"}>


            {/* 🌍 Custom Global Calendar Styles */}
            <Box
                bg="bg_box"
                p={3}
                borderRadius="lg"
                shadow="sm"
                maxWidth="2xl"
                width="full"
                borderWidth="1px"
                borderColor="gray.50"
                color={"text_primary"}
                position="relative"
            >

                {isLoading && (
                    <Box
                        position="absolute"
                        top="0"
                        left="0"
                        right="0"
                        bottom="0"
                        bg="rgba(255, 255, 255, 0.8)"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        borderRadius="lg"
                        zIndex={10}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            gap={3}
                        >
                            <Spinner
                                size="lg"
                                color="blue.500"
                            />
                            <Text
                                fontSize="sm"
                                color="gray.600"
                                fontWeight="medium"
                            >
                                Fetching availability...
                            </Text>
                        </Box>
                    </Box>
                )}

                <Text textAlign="center" mb={2}>
                    View available slots and select a date for an appointment.
                </Text>

                <AvailabilityCalendar
                    doctorAvailabilities={availabilities ?? []}
                    onDateSelect={setSelectedDate}
                    gotoNext={goToNextMonth}
                    gotoPrev={goToPreviousMonth}
                    setSelectedDay={setSelectedDay}
                    setSelectedDate={setDate}
                    selectedDay={selectedDay}
                    calendarDays={calendarDays}
                    currentMonth={currentMonth}
                    months={months}
                    daysOfWeek={daysOfWeek}
                    currentYear={currentYear}
                />
            </Box>

            {selectedDate && (
                <Box mt={4} p={1} borderRadius="md" borderColor="blue.200">
                    <Heading
                        fontSize="1.25rem"
                        font="outfit"
                        fontWeight="600"
                        mt="3"
                        mb="4"
                        color="text_primary"
                    >
                        Selected Date: {!isEmpty(selectedDay) && selectedDay.toDateString()}
                    </Heading>
                    {!isEmpty(availabilities.filter((availability: any) => availability.date === formatDateToYYYYMMDD(selectedDate))) ? (
                        <Flex wrap="wrap" gap={2}>
                            {availabilities.filter((availability: any) => availability.date === formatDateToYYYYMMDD(selectedDate)).map((availability, index) => (
                                <Grid w={'full'} key={availability.id} templateColumns="repeat(3, 1fr)" gap="2" mb="6">
                                    {availability.timeslots.map((slot) => (
                                        <Button
                                            key={slot.id}
                                            size="sm"
                                            variant="outline"
                                            borderColor="bt_schedule"
                                            bg={slots.includes(slot.id) ? "bt_schedule" : "transparent"}
                                            color={slots.includes(slot.id) ? "white" : "bt_schedule"}
                                            _hover={{
                                                bg: slots.includes(slot.id) ? "bt_schedule" : "bt_schedule",
                                                color: "white",
                                            }}
                                            onClick={() => handleSlotSelection(slot.id)}
                                        >
                                            {slot.startTime}
                                        </Button>
                                    ))}
                                </Grid>

                            ))}
                        </Flex>
                    ) : (
                        <Text color="gray.600">No available slots for this date.</Text>
                    )}
                </Box>
            )}
        </Stack>
    );
};

export default BookingCalendarCard;
