import { Box, Button, HStack, Switch, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { outfit } from "mangarine/pages/_app";
import CustomSelect from "mangarine/components/customcomponents/select";
import { SelectOptions } from "mangarine/types";
import { generateTimeSlots } from "mangarine/utils/helper";
import { DaySchedule, generateAvailability } from "mangarine/utils/availability";
import { useCreateAvailabilityMutation, useGetCurrentAvailabilitySettingsQuery } from "mangarine/state/services/availability.service";
import { toaster } from "mangarine/components/ui/toaster";
import { TIME_ZONE_OPTIONS } from "mangarine/lib/timezone-options";
import { LuPlus, LuX } from "react-icons/lu";

const timezoneSelectOptions: SelectOptions[] = TIME_ZONE_OPTIONS.map((tz) => ({
    id: tz.id,
    label: tz.label,
    value: tz.value,
}));

const DURATION_OPTIONS = [15, 30, 45, 60, 90, 120];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeToMinutes = (t: string): number => {
    if (!t) return -1;
    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return -1;
    const h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const period = match[3].toUpperCase();
    return ((h % 12) + (period === "PM" ? 12 : 0)) * 60 + m;
};

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
                            duration: existing.duration ? [String(existing.duration)] : ["60"],
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
        const genSlots = generateTimeSlots("06:00", "23:00", 15);
        setSlots(genSlots);
    }, []);

    const handleToggle = (index: number) => {
        setAvailability((prev) =>
            prev.map((item, i) => {
                if (i !== index) return item;
                return {
                    ...item,
                    enabled: !item.enabled,
                    slots: !item.enabled && item.slots.length === 0 ? [{ from: [""], to: [""] }] : item.slots,
                };
            })
        );
    };

    const handleSlotChange = (dayIndex: number, slotIndex: number, field: "from" | "to", value: string[]) => {
        setAvailability((prev) =>
            prev.map((item, i) => {
                if (i !== dayIndex) return item;
                const updatedSlots = item.slots.map((s, si) =>
                    si === slotIndex ? { ...s, [field]: value } : s
                );
                return { ...item, slots: updatedSlots };
            })
        );
    };

    const addSlot = (dayIndex: number) => {
        setAvailability((prev) =>
            prev.map((item, i) => {
                if (i !== dayIndex) return item;
                return { ...item, slots: [...item.slots, { from: [""], to: [""] }] };
            })
        );
    };

    const removeSlot = (dayIndex: number, slotIndex: number) => {
        setAvailability((prev) =>
            prev.map((item, i) => {
                if (i !== dayIndex) return item;
                const updated = item.slots.filter((_, si) => si !== slotIndex);
                return { ...item, slots: updated.length > 0 ? updated : [{ from: [""], to: [""] }] };
            })
        );
    };

    const handleDurationChange = (dayIndex: number, mins: number) => {
        setAvailability((prev) =>
            prev.map((item, i) =>
                i === dayIndex ? { ...item, duration: [String(mins)] } : item
            )
        );
    };

    const validateSlots = (): string | null => {
        for (const day of availability) {
            if (!day.enabled) continue;
            for (let i = 0; i < day.slots.length; i++) {
                const { from, to } = day.slots[i];
                const fromVal = from[0] ?? "";
                const toVal = to[0] ?? "";
                if (!fromVal || !toVal) continue;
                const fromMins = timeToMinutes(fromVal);
                const toMins = timeToMinutes(toVal);
                if (fromMins >= 0 && toMins >= 0 && toMins <= fromMins) {
                    return `${day.day}: end time must be after start time (slot ${i + 1}).`;
                }
            }
        }
        return null;
    };

    const handleAvailabilityUpdate = () => {
        if (!timezone?.[0]) {
            toaster.create({ description: "Please select your time zone before saving.", type: "error", closable: true, duration: 4000 });
            return;
        }

        const validationError = validateSlots();
        if (validationError) {
            toaster.create({ description: validationError, type: "error", closable: true, duration: 4000 });
            return;
        }

        const normalized = availability.map((day) => ({
            ...day,
            duration: Array.isArray(day.duration) && day.duration[0] ? day.duration : ["60"],
        }));

        const parsedAvailabilities = generateAvailability(normalized, new Date(), 3);
        const formData = {
            timezone: timezone[0],
            availability_settings: normalized.filter((d) => d.enabled),
            availabilities: parsedAvailabilities,
        };

        createAvailability(formData)
            .unwrap()
            .then(() => {
                toaster.create({ description: "Availability settings saved successfully", type: "success", closable: true, duration: 6000 });
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
            {/* Header */}
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
                        <Box minW="220px" flex={1.5}>
                            <CustomSelect
                                id="timezone"
                                placeholder="Please select your time zone"
                                name=""
                                size="md"
                                options={timezoneSelectOptions}
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
                    {availability.map((day, dayIndex) => (
                        <VStack
                            key={day.day}
                            w="full"
                            alignItems="flex-start"
                            gap={2}
                            py={3}
                            borderBottom="1px"
                            borderColor="gray.100"
                        >
                            {/* Toggle + name */}
                            <HStack w="full" justify="space-between" alignItems="center">
                                <Switch.Root
                                    checked={day.enabled}
                                    onChange={() => handleToggle(dayIndex)}
                                    size="lg"
                                >
                                    <Switch.HiddenInput />
                                    <Switch.Control />
                                    <Switch.Label fontWeight="500" fontSize="0.9375rem" color="text_primary">
                                        {day.day}
                                    </Switch.Label>
                                </Switch.Root>

                                {!day.enabled && (
                                    <Box bg="gray.100" px={4} py={2} borderRadius="md" flex={2} ml={4}>
                                        <Text color="gray.400" fontSize="0.9375rem">Unavailable</Text>
                                    </Box>
                                )}
                            </HStack>

                            {/* Slots + duration when enabled */}
                            {day.enabled && (
                                <VStack w="full" alignItems="flex-start" gap={2} pl={{ base: 0, md: "48px" }}>
                                    {/* Slot rows */}
                                    {day.slots.map((slot, slotIndex) => {
                                        const fromVal = slot.from[0] ?? "";
                                        const toVal = slot.to[0] ?? "";
                                        const fromMins = timeToMinutes(fromVal);
                                        const toMins = timeToMinutes(toVal);
                                        const invalidTime = fromVal && toVal && fromMins >= 0 && toMins >= 0 && toMins <= fromMins;

                                        return (
                                            <VStack key={slotIndex} w="full" alignItems="flex-start" gap={1}>
                                                <HStack gap={2} alignItems="center" flexWrap={{ base: "wrap", md: "nowrap" }}>
                                                    <HStack gap={1} alignItems="center">
                                                        <Text fontSize="0.8125rem" color="gray.500" whiteSpace="nowrap">From:</Text>
                                                        <Box minW="120px">
                                                            <CustomSelect
                                                                id={`${day.day}-${slotIndex}-from`}
                                                                placeholder="9:00 AM"
                                                                name=""
                                                                size="sm"
                                                                options={slots}
                                                                label=""
                                                                isMulti={false}
                                                                value={slot.from}
                                                                required={false}
                                                                error={{}}
                                                                onChange={(val: string[]) => handleSlotChange(dayIndex, slotIndex, "from", val)}
                                                            />
                                                        </Box>
                                                    </HStack>
                                                    <HStack gap={1} alignItems="center">
                                                        <Text fontSize="0.8125rem" color="gray.500" whiteSpace="nowrap">To:</Text>
                                                        <Box minW="120px">
                                                            <CustomSelect
                                                                id={`${day.day}-${slotIndex}-to`}
                                                                placeholder="5:00 PM"
                                                                name=""
                                                                size="sm"
                                                                options={slots}
                                                                label=""
                                                                isMulti={false}
                                                                value={slot.to}
                                                                required={false}
                                                                error={{}}
                                                                onChange={(val: string[]) => handleSlotChange(dayIndex, slotIndex, "to", val)}
                                                            />
                                                        </Box>
                                                    </HStack>
                                                    {day.slots.length > 1 && (
                                                        <Button
                                                            size="xs"
                                                            variant="ghost"
                                                            color="red.400"
                                                            p={1}
                                                            onClick={() => removeSlot(dayIndex, slotIndex)}
                                                        >
                                                            <LuX size={14} />
                                                        </Button>
                                                    )}
                                                </HStack>
                                                {invalidTime && (
                                                    <Text fontSize="0.75rem" color="red.500">
                                                        End time must be after start time
                                                    </Text>
                                                )}
                                            </VStack>
                                        );
                                    })}

                                    {/* Add slot */}
                                    <Button
                                        size="xs"
                                        variant="ghost"
                                        color="primary.950"
                                        px={0}
                                        gap={1}
                                        onClick={() => addSlot(dayIndex)}
                                    >
                                        <LuPlus size={13} />
                                        <Text fontSize="0.8125rem">Add time slot</Text>
                                    </Button>

                                    {/* Duration picker */}
                                    <HStack gap={1} flexWrap="wrap" alignItems="center" pt={1}>
                                        <Text fontSize="0.8rem" color="gray.500" whiteSpace="nowrap" mr={1}>
                                            Duration:
                                        </Text>
                                        {DURATION_OPTIONS.map((mins) => {
                                            const selected = (day.duration as string[])?.[0] === String(mins);
                                            return (
                                                <Button
                                                    key={mins}
                                                    size="xs"
                                                    variant={selected ? "solid" : "outline"}
                                                    bg={selected ? "primary.950" : "transparent"}
                                                    color={selected ? "white" : "gray.600"}
                                                    borderColor={selected ? "primary.950" : "gray.300"}
                                                    borderWidth="1px"
                                                    borderRadius="6px"
                                                    px={2}
                                                    onClick={() => handleDurationChange(dayIndex, mins)}
                                                >
                                                    {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                                                </Button>
                                            );
                                        })}
                                    </HStack>
                                </VStack>
                            )}
                        </VStack>
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
