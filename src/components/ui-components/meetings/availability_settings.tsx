import { Accordion, Box, Button, Flex, HStack, Image, Switch, Text, VStack, } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { outfit } from "mangarine/pages/_app";
import CustomSelect from "mangarine/components/customcomponents/select";
import { SelectOptions } from "mangarine/types";
import { generateTimeSlots } from "mangarine/utils/helper";
import { isEmpty, size } from "es-toolkit/compat";
import { DaySchedule, generateAvailability } from "mangarine/utils/availability";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import { useCreateAvailabilityMutation, useGetCurrentAvailabilitySettingsQuery } from "mangarine/state/services/availability.service";
import { toaster } from "mangarine/components/ui/toaster";

const timezonesCollection: SelectOptions[] = [
    {
        id: "1",
        label: "(UTC-8:00) Pacific Time",
        value: "(UTC-8:00) Pacific Time",
    },
    {
        id: "2",
        label: "(UTC+1:00) West Africa Time",
        value: "(UTC+1:00) West Africa Time",
    },
    { id: "3", label: "(UTC+0:00) GMT", value: "(UTC+0:00) GMT" },
];

const durationsCollection: SelectOptions[] = [
    { id: "3", label: "60 min", value: "60" },
    { id: "4", label: "Custom", value: "custom" },
];

const defaultSlots = [{ from: [""], to: [""] }];

const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const AvailabilitySettings = () => {
    const [timezone, setTimezone] = useState<string[]>([]);
    const [duration, setDuration] = useState<string[]>([]);
    const [slots, setSlots] = useState([]);
    const [createAvailability] = useCreateAvailabilityMutation();

    // Fetch current availability settings
    const { data: currentSettings, isLoading, error } = useGetCurrentAvailabilitySettingsQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const [availability, setAvailability] = useState<DaySchedule[]>(
        daysOfWeek.map((day) => ({
            day,
            enabled: day !== "Saturday" && day !== "Sunday",
            slots: [],
            duration: "",
        }))
    );

    // Load current settings when component mounts or data changes
    useEffect(() => {
        if (currentSettings?.data) {
            const { timezone: currentTimezone, availability: currentAvailability } = currentSettings.data;

            // Set timezone
            if (currentTimezone) {
                setTimezone([currentTimezone]);
            }

            // Set availability settings
            if (currentAvailability && currentAvailability.length > 0) {
                // Map the current availability to the component state
                const updatedAvailability = daysOfWeek.map((day) => {
                    const existingDay = currentAvailability.find((item: any) => item.day === day);
                    if (existingDay) {
                        return {
                            day,
                            enabled: existingDay.enabled !== false, // Default to true if not explicitly false
                            slots: existingDay.slots || [],
                            duration: existingDay.duration ? [existingDay.duration] : [],
                        };
                    }
                    return {
                        day,
                        enabled: day !== "Saturday" && day !== "Sunday",
                        slots: [],
                        duration: "",
                    };
                });
                setAvailability(updatedAvailability);
            }
        }
    }, [currentSettings]);

    const handleToggle = (index) => {
        setAvailability((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, enabled: !item.enabled } : item
            )
        );
    };


    const handleSlotChange = (index, slotIndex, field, value) => {
        const updated = [...availability];
        updated[index].slots[slotIndex][field] = value;
        setAvailability(updated);
    };
    const handleDurationChange = (index: number, value) => {
        const updated = [...availability];
        updated[index].duration = value;
        setAvailability(updated);
    };
    useEffect(() => {
        const genSlots = generateTimeSlots("07:00", "20:00", 60);
        setSlots(genSlots);
    }, []);

    const addSlot = (index) => {
        const updated = [...availability];
        updated[index].slots.push({ from: [""], to: [""] });
        setAvailability(updated);
    };

    const removeSlot = (index, slotIndex) => {
        const updated = [...availability];
        updated[index].slots.splice(slotIndex, 1);
        setAvailability(updated);
    };

    const handleTimeZone = (value: any) => {
        setTimezone(value);
    };
    const handleAvailabilityUpdate = () => {
        // Ensure timezone selected
        if (!timezone?.[0]) {
            toaster.create({
                title: "Select time zone",
                description: "Please select your time zone before saving.",
                type: "error",
                closable: true,
                duration: 4000,
            });
            return;
        }

        // Default missing durations to 60 minutes for enabled days
        let appliedDefaults = 0;
        const normalized = availability.map((day) => {
            if (day.enabled && (isEmpty(day.duration) || !day.duration?.[0])) {
                appliedDefaults += 1;
                return { ...day, duration: ["60"] };
            }
            return day;
        });

        if (appliedDefaults > 0) {
            toaster.create({
                title: "Default duration applied",
                description: `Set ${appliedDefaults} day(s) to 60 minutes by default.`,
                type: "info",
                closable: true,
                duration: 4000,
            });
        }

        const parsedAvailabilities = generateAvailability(normalized, new Date, 3);
        const formData = {
            timezone: timezone[0],
            availability_settings: normalized.filter((avail) => !isEmpty(avail.duration)),
            availabilities: parsedAvailabilities
        }
        createAvailability(formData).unwrap().then((payload: any) => {
            const { data } = payload;
            toaster.create({
                title: "Success",
                description: "You availabilities settings have been, created and setup successfully",
                type: "success",
                closable: true,
                duration: 6000,
            })
        }).catch((error) => {
            console.log(error)
        })
    };

    return (
        <VStack
            w="100%"
            mx="auto"
            minH={"full"}
            px={4}
            className={outfit.className}
            boxShadow="md"
            borderRadius="md"
            bg="main_background"
            py="5"
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
        >
            <Text
                fontWeight="600"
                lineHeight={{ base: "24px", md: "24px", lg: "36px" }}
                fontSize={{ base: "1.2rem", md: "1.2rem", lg: "1.5rem" }}
                color="text_primary"
                pb="4"
            >
                Schedule Timing
            </Text>

            {/* Loading State */}
            {isLoading && (
                <Box w="full" textAlign="center" py={8}>
                    <Text color="gray.500">Loading availability settings...</Text>
                </Box>
            )}

            {/* Error State */}
            {error && (
                <Box w="full" textAlign="center" py={8}>
                    <Text color="red.500">Error loading availability settings. Please try again.</Text>
                </Box>
            )}

            {/* Main Content - Only show when not loading and no errors */}
            {!isLoading && !error && (
                <>
                    <VStack
                        w="full"
                        justifyContent={"flex-start"}
                        alignItems={"flex-start"}
                        gap={"8px"}
                        pb="4"
                    >
                        <Text
                            fontSize={{ base: "1rem", md: "1.2rem", lg: "1.5rem" }}
                            fontWeight="600"
                            color="text_primary"
                            font="outfit"
                        >
                            Availability
                        </Text>
                        <Text
                            fontSize={{ base: "0.875rem", md: "1rem", lg: "1.25rem" }}
                            fontWeight="400"
                            color="gray.500"
                            font="outfit"
                        >
                            Please update your availability for consultation
                        </Text>
                    </VStack>

                    <VStack align="start" gap={"8px"} w="full">
                        {/* Time Zone Row */}
                        <HStack
                            w="full"
                            justify="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={"8px"}
                        >
                            <Box flex={2}>
                                <Text
                                    fontSize={{ base: "0.875rem", md: "1rem", lg: "1.25rem" }}
                                    fontWeight="600"
                                    color="text_primary"
                                    mb={1}
                                >
                                    Time Zone
                                </Text>
                                <Text fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }} fontWeight="400" color="gray.500">
                                    Set time zone
                                </Text>
                            </Box>
                            <Box flex={2.5}>
                                <CustomSelect
                                    id={"timezone"}
                                    defaultValue={[timezonesCollection[0].label]}
                                    placeholder="Please select your time zone"
                                    name={""}
                                    size={{ base: "sm", md: "md", lg: "lg" }}
                                    options={timezonesCollection}
                                    label=""
                                    isMulti={false}
                                    value={timezone}
                                    required={false}
                                    error={{}}
                                    onChange={handleTimeZone}
                                />
                            </Box>
                        </HStack>

                        {/* Appointment Duration Row */}
                        <Flex
                            w="full"
                            justify="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            gap={4}
                        >
                            <Box flex={2}>
                                <Text fontSize={{ base: "0.875rem", md: "1rem", lg: "1.25rem" }} fontWeight="600" color="text_primary">
                                    Preferred Appointment Duration
                                </Text>
                            </Box>

                            <Box flex={2.5}>
                                <CustomSelect
                                    id={"duration"}
                                    placeholder="Please select preffered duration time"
                                    name={""}
                                    size={{ base: "sm", md: "md", lg: "lg" }}
                                    options={durationsCollection}
                                    label=""
                                    isMulti={false}
                                    value={duration}
                                    required={false}
                                    error={{}}
                                    onChange={(value: any) => setDuration(value)}
                                />
                            </Box>
                        </Flex>
                    </VStack>

                    <Accordion.Root collapsible defaultValue={["Monday", "Tuesday"]}>
                        {availability.map((day, index) => (
                            <Accordion.Item key={day.day} value={day.day} pb={"3"}>
                                <Accordion.ItemTrigger>
                                    <Flex
                                        w="full"
                                        color="text_primary"
                                        fontSize="1.2rem"
                                        fontWeight="500"
                                        align="center"
                                        justify="space-between"
                                        py={3}
                                    >
                                        <HStack>
                                            <Switch.Root
                                                size={{ base: "sm", md: "md", lg: "lg" }}
                                                checked={day.enabled}
                                                onChange={() => handleToggle(index)}
                                            >
                                                <Switch.HiddenInput />
                                                <Switch.Control />
                                                <Switch.Label fontSize={{ base: "0.875rem", md: "1rem", lg: "1.25rem" }}>{day.day}</Switch.Label>
                                            </Switch.Root>
                                        </HStack>
                                        <Accordion.ItemIndicator />
                                    </Flex>
                                </Accordion.ItemTrigger>

                                <Accordion.ItemContent>
                                    <Accordion.ItemBody>
                                        {day.enabled ? (
                                            <VStack gap={4} mt={4} alignItems="center">
                                                {size(day.slots) > 0 ? day.slots.map((slot, slotIndex) => (
                                                    <HStack
                                                        alignSelf={"flex-end"}
                                                        justifyContent={"flex-end"}
                                                        alignItems={"center"}
                                                        key={slotIndex}
                                                        w="50%"
                                                        gap={"2"}
                                                    >
                                                        <CustomSelect
                                                            id={`${day.day}-${slotIndex}-from`}
                                                            placeholder="07:00 AM"
                                                            name={""}
                                                            size={{ base: "sm", md: "md", lg: "lg" }}
                                                            options={slots}
                                                            label=""
                                                            isMulti={false}
                                                            defaultValue={!isEmpty(slots) && [slots[0].label]}
                                                            value={slot.from}
                                                            required={false}
                                                            error={{}}
                                                            onChange={(val) =>
                                                                handleSlotChange(index, slotIndex, "from", val)
                                                            }
                                                        />
                                                        <CustomSelect
                                                            id={`${day.day}-${slotIndex}-to`}
                                                            placeholder="09:00 PM"
                                                            name={""}
                                                            size={{ base: "sm", md: "md", lg: "lg" }}
                                                            options={slots}
                                                            label=""
                                                            isMulti={false}
                                                            defaultValue={!isEmpty(slots) && [slots[0].value]}
                                                            value={slot.to}
                                                            required={false}
                                                            error={{}}
                                                            onChange={(val) =>
                                                                handleSlotChange(index, slotIndex, "to", val)
                                                            }
                                                        />

                                                        {/* Show plus icon only for first slot */}
                                                        {slotIndex === 0 && (
                                                            <Button
                                                                variant="ghost"
                                                                minW="auto"
                                                                px={2}
                                                                onClick={() => addSlot(index)}
                                                            >
                                                                <Image
                                                                    src="/icons/plus.svg"
                                                                    alt="Add Time"
                                                                // boxSize="20px"
                                                                />
                                                            </Button>
                                                        )}

                                                        {/* Show delete icon only for slots beyond the first */}
                                                        {slotIndex > 0 && (
                                                            <Image
                                                                src="/icons/delete2.svg"
                                                                alt="Remove"
                                                                cursor="pointer"
                                                                onClick={() => removeSlot(index, slotIndex)}
                                                            />
                                                        )}
                                                    </HStack>
                                                )) : (
                                                    <Button onClick={() => addSlot(index)} alignSelf={'flex-end'} px={2}>Add slot</Button>
                                                )}

                                                <HStack
                                                    justifyContent={"space-between"}
                                                    alignItems={"center"}
                                                    w={"full"}
                                                >
                                                    <Text
                                                        fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
                                                        color="gray.900"
                                                        // lineHeight={"150%"}
                                                        fontWeight="400"
                                                    >
                                                        Preferred Appointment Duration:
                                                    </Text>
                                                    <HStack flex={1} justifySelf={"flex-end"}>
                                                        {durationsCollection.map((opt) => (
                                                            <Button
                                                                key={opt.value}
                                                                variant={
                                                                    day.duration[0] === opt.value ? "solid" : "outline"
                                                                }
                                                                onClick={() => handleDurationChange(index, [opt.value])}
                                                                mb={2}
                                                                flex={"1"}
                                                                bg={
                                                                    day.duration[0] === opt.value
                                                                        ? "blue.900"
                                                                        : "gray.100"
                                                                }
                                                                color={
                                                                    day.duration[0] === opt.value ? "white" : "gray.600"
                                                                }
                                                                _hover={{
                                                                    bg:
                                                                        day.duration[0] === opt.value
                                                                            ? "blue.800"
                                                                            : "gray.200",
                                                                }}
                                                            >
                                                                {opt.label}
                                                            </Button>
                                                        ))}
                                                    </HStack>
                                                </HStack>
                                            </VStack>
                                        ) : (
                                            <Text mt={3} color="gray.500">
                                                Unavailable
                                            </Text>
                                        )}
                                    </Accordion.ItemBody>
                                </Accordion.ItemContent>
                            </Accordion.Item>
                        ))}
                    </Accordion.Root>

                    <HStack justifyContent="flex-end" mt={4}>
                        <Button
                            px={{ base: "4", md: "6", lg: "8" }}
                            borderRadius="8px"
                            border="1px solid"
                            variant="outline"
                        >
                            Cancel
                        </Button>
                        <Button
                            px={{ base: "4", md: "6", lg: "8" }}
                            borderRadius="8px"
                            onClick={handleAvailabilityUpdate}
                            bg="blue.900"
                            color="white"
                            _hover={{ bg: "blue.800" }}
                        >
                            Save & Post
                        </Button>
                    </HStack>
                </>
            )}
        </VStack>
    );
};

export default AvailabilitySettings;
