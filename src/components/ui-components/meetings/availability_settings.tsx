import { Box, Button, HStack, Switch, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { outfit } from "mangarine/pages/_app";
import CustomSelect from "mangarine/components/customcomponents/select";
import { SelectOptions } from "mangarine/types";
import { generateTimeSlots } from "mangarine/utils/helper";
import { DaySchedule, generateAvailability } from "mangarine/utils/availability";
import { useCreateAvailabilityMutation, useGetCurrentAvailabilitySettingsQuery } from "mangarine/state/services/availability.service";
import { toaster } from "mangarine/components/ui/toaster";

const timezonesCollection: SelectOptions[] = [
    { id: "1", label: "(UTC-8:00) Pacific Time", value: "(UTC-8:00) Pacific Time" },
    { id: "2", label: "(UTC+1:00) West Africa Time", value: "(UTC+1:00) West Africa Time" },
    { id: "3", label: "(UTC+0:00) GMT", value: "(UTC+0:00) GMT" },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AvailabilitySettings = () => {
    const [timezone, setTimezone] = useState<string[]>([]);
    const [slots, setSlots] = useState<SelectOptions[]>([]);
    const [createAvailability] = useCreateAvailabilityMutation();

    const { data: currentSettings, isLoading, error } = useGetCurrentAvailabilitySettingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [availability, setAvailability] = useState<DaySchedule[]>(
        daysOfWeek.map((day) => ({
            day,
            enabled: day !== "Saturday" && day !== "Sunday",
            slots: [{ from: [""], to: [""] }],
            duration: ["60"],
        }))
    );

    useEffect(() => {
        if (currentSettings?.data) {
            const { timezone: currentTimezone, availability: currentAvailability } = currentSettings.data;
            if (currentTimezone) setTimezone([currentTimezone]);
            if (currentAvailability?.length > 0) {
                const updated = daysOfWeek.map((day) => {
                    const existing = currentAvailability.find((item: any) => item.day === day);
                    if (existing) {
                        return {
                            day,
                            enabled: existing.enabled !== false,
                            slots: existing.slots?.length > 0 ? existing.slots : [{ from: [""], to: [""] }],
                            duration: existing.duration ? [existing.duration] : ["60"],
                        };
                    }
                    return {
                        day,
                        enabled: day !== "Saturday" && day !== "Sunday",
                        slots: [{ from: [""], to: [""] }],
                        duration: ["60"],
                    };
                });
                setAvailability(updated);
            }
        }
    }, [currentSettings]);

    useEffect(() => {
        const genSlots = generateTimeSlots("07:00", "20:00", 60);
        setSlots(genSlots);
    }, []);

    const handleToggle = (index: number) => {
        setAvailability((prev) =>
            prev.map((item, i) => {
                if (i !== index) return item;
                const nowEnabled = !item.enabled;
                return {
                    ...item,
                    enabled: nowEnabled,
                    slots: item.slots.length === 0 ? [{ from: [""], to: [""] }] : item.slots,
                };
            })
        );
    };

    const handleSlotChange = (index: number, field: "from" | "to", value: string[]) => {
        setAvailability((prev) =>
            prev.map((item, i) => {
                if (i !== index) return item;
                const updatedSlots = item.slots.length > 0
                    ? [{ ...item.slots[0], [field]: value }, ...item.slots.slice(1)]
                    : [{ from: [], to: [], [field]: value }];
                return { ...item, slots: updatedSlots };
            })
        );
    };

    const handleAvailabilityUpdate = () => {
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

        const normalized = availability.map((day) => ({
            ...day,
            duration: Array.isArray(day.duration) && day.duration[0] ? day.duration : ["60"],
        }));

        const parsedAvailabilities = generateAvailability(normalized, new Date(), 3);
        const formData = {
            timezone: timezone[0],
            availability_settings: normalized.filter((avail) => avail.enabled),
            availabilities: parsedAvailabilities,
        };

        createAvailability(formData)
            .unwrap()
            .then(() => {
                toaster.create({
                    title: "Success",
                    description: "Your availability settings have been saved successfully",
                    type: "success",
                    closable: true,
                    duration: 6000,
                });
            })
            .catch(console.error);
    };

    return (
        <VStack
            w="100%"
            mx="auto"
            minH="full"
            px={6}
            className={outfit.className}
            boxShadow="md"
            borderRadius="md"
            bg="main_background"
            py={6}
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            <VStack w="full" alignItems="flex-start" gap={1} pb={4}>
                <Text fontWeight="600" fontSize={{ base: "1.25rem", lg: "1.5rem" }} color="text_primary">
                    Availability
                </Text>
                <Text fontSize={{ base: "0.875rem", lg: "1rem" }} color="gray.500">
                    Please update your availability for consultation
                </Text>
            </VStack>

            {isLoading && (
                <Box w="full" textAlign="center" py={8}>
                    <Text color="gray.500">Loading availability settings...</Text>
                </Box>
            )}

            {error && (
                <Box w="full" textAlign="center" py={8}>
                    <Text color="red.500">Error loading availability settings. Please try again.</Text>
                </Box>
            )}

            {!isLoading && !error && (
                <>
                    {/* Time Zone */}
                    <HStack
                        w="full"
                        justify="space-between"
                        alignItems="center"
                        py={3}
                        borderBottom="1px"
                        borderColor="gray.100"
                        flexWrap={{ base: "wrap", md: "nowrap" }}
                        gap={3}
                    >
                        <Box flex={1}>
                            <Text fontWeight="600" fontSize="0.9375rem" color="text_primary">Time Zone</Text>
                            <Text fontSize="0.8125rem" color="gray.500">Set your time zone</Text>
                        </Box>
                        <Box minW="200px" flex={1.5}>
                            <CustomSelect
                                id="timezone"
                                defaultValue={[timezonesCollection[0].label]}
                                placeholder="Please select your time zone"
                                name=""
                                size="md"
                                options={timezonesCollection}
                                label=""
                                isMulti={false}
                                value={timezone}
                                required={false}
                                error={{}}
                                onChange={(v: any) => setTimezone(v)}
                            />
                        </Box>
                    </HStack>

                    {/* Day rows */}
                    {availability.map((day, index) => (
                        <HStack
                            key={day.day}
                            w="full"
                            justify="space-between"
                            alignItems="center"
                            py={3}
                            borderBottom="1px"
                            borderColor="gray.100"
                            flexWrap={{ base: "wrap", md: "nowrap" }}
                            gap={3}
                        >
                            <HStack flex={1} minW="140px">
                                <Switch.Root
                                    checked={day.enabled}
                                    onChange={() => handleToggle(index)}
                                    size="lg"
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                    <Switch.Label fontWeight="500" fontSize="0.9375rem" color="text_primary">
                                        {day.day}
                                    </Switch.Label>
                                </Switch.Root>
                            </HStack>

                            {day.enabled ? (
                                <HStack gap={3} flex={2} justifyContent="flex-end">
                                    <HStack gap={1} alignItems="center">
                                        <Text fontSize="0.8125rem" color="gray.500" whiteSpace="nowrap">From:</Text>
                                        <Box minW="110px">
                                            <CustomSelect
                                                id={`${day.day}-from`}
                                                placeholder="9:00AM"
                                                name=""
                                                size="sm"
                                                options={slots}
                                                label=""
                                                isMulti={false}
                                                value={day.slots[0]?.from ?? []}
                                                required={false}
                                                error={{}}
                                                onChange={(val: string[]) => handleSlotChange(index, "from", val)}
                                            />
                                        </Box>
                                    </HStack>
                                    <HStack gap={1} alignItems="center">
                                        <Text fontSize="0.8125rem" color="gray.500" whiteSpace="nowrap">To:</Text>
                                        <Box minW="110px">
                                            <CustomSelect
                                                id={`${day.day}-to`}
                                                placeholder="8:00PM"
                                                name=""
                                                size="sm"
                                                options={slots}
                                                label=""
                                                isMulti={false}
                                                value={day.slots[0]?.to ?? []}
                                                required={false}
                                                error={{}}
                                                onChange={(val: string[]) => handleSlotChange(index, "to", val)}
                                            />
                                        </Box>
                                    </HStack>
                                </HStack>
                            ) : (
                                <Box bg="gray.100" px={4} py={3} borderRadius="md" flex={2}>
                                    <Text color="gray.400" fontSize="0.9375rem">Unavailable</Text>
                                </Box>
                            )}
                        </HStack>
                    ))}

                    <HStack justify="flex-end" w="full" mt={6} gap={3}>
                        <Button
                            px={8}
                            borderRadius="8px"
                            border="1px solid"
                            borderColor="gray.300"
                            variant="outline"
                            color="text_primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            px={8}
                            borderRadius="8px"
                            onClick={handleAvailabilityUpdate}
                            bg="primary.950"
                            color="white"
                            _hover={{ opacity: 0.9 }}
                        >
                            Save
                        </Button>
                    </HStack>
                </>
            )}
        </VStack>
    );
};

export default AvailabilitySettings;
