import { Box, Button, HStack, Switch, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { outfit } from "mangarine/pages/_app";
import CustomSelect from "mangarine/components/customcomponents/select";
import { SelectOptions } from "mangarine/types";
import { generateTimeSlots } from "mangarine/utils/helper";
import { useCreateAvailabilityMutation, useDeleteAvailabilityMutation, useGetCurrentAvailabilitySettingsQuery } from "mangarine/state/services/availability.service";
import { toaster } from "mangarine/components/ui/toaster";
import { TIME_ZONE_OPTIONS } from "mangarine/lib/timezone-options";
import { LuPlus, LuTrash2, LuX } from "react-icons/lu";

const timezoneSelectOptions: SelectOptions[] = TIME_ZONE_OPTIONS.map((tz) => ({
    id: tz.id,
    label: tz.label,
    value: tz.value,
}));

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface SlotRow {
    from: string; // 12-hr display, e.g. "9:00 AM"
    to: string;   // 12-hr display, e.g. "5:00 PM"
}

interface DayState {
    day: string;
    enabled: boolean;
    slotRows: SlotRow[];
}

const defaultSlotRow = (): SlotRow => ({ from: "", to: "" });

// "9:00 AM" → "09:00"
const to24hr = (t: string): string => {
    if (!t) return "";
    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return t;
    let h = parseInt(match[1]);
    const m = match[2];
    const period = match[3].toUpperCase();
    if (period === "AM") { if (h === 12) h = 0; }
    else { if (h !== 12) h += 12; }
    return `${String(h).padStart(2, "0")}:${m}`;
};

// "09:00" → "9:00 AM"
const to12hr = (t: string): string => {
    if (!t) return "";
    const [hStr, mStr] = t.split(":");
    const h = parseInt(hStr);
    const m = mStr ?? "00";
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${period}`;
};

const displayTimeToMinutes = (t: string): number => {
    if (!t) return -1;
    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return -1;
    const h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const period = match[3].toUpperCase();
    return ((h % 12) + (period === "PM" ? 12 : 0)) * 60 + m;
};

const timeStrToMinutes = (t: string): number => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + (m || 0);
};

const minutesToTimeStr = (mins: number): string => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

// Expands the recurring weekly template into concrete date entries for the next `totalDays` days.
// Each from→to window becomes one bookable timeslot; duration is derived from the window length.
function buildAvailabilities(days: DayState[], startDate: Date, totalDays: number): any[] {
    const result: any[] = [];
    for (let i = 0; i < totalDays; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        const daySetting = days.find((d) => d.day === dayName && d.enabled);
        if (!daySetting) continue;

        const timeslots: any[] = [];
        for (const slot of daySetting.slotRows) {
            const start24 = to24hr(slot.from);
            const end24   = to24hr(slot.to);
            if (!start24 || !end24) continue;
            const startMins = timeStrToMinutes(start24);
            const endMins   = timeStrToMinutes(end24);
            if (endMins <= startMins) continue;
            timeslots.push({
                startTime:   minutesToTimeStr(startMins),
                endTime:     minutesToTimeStr(endMins),
                duration:    endMins - startMins,
                isAvailable: true,
            });
        }

        if (timeslots.length > 0) {
            result.push({
                date:      date.toISOString().split("T")[0],
                timeslots,
            });
        }
    }
    return result;
}

const AvailabilitySettings = ({ onSaveSuccess }: { onSaveSuccess?: () => void }) => {
    const [timezone, setTimezone] = useState<string[]>([]);
    const [timeSlotOptions, setTimeSlotOptions] = useState<SelectOptions[]>([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [createAvailability] = useCreateAvailabilityMutation();
    const [deleteAvailability, { isLoading: isDeleting }] = useDeleteAvailabilityMutation();

    const { data: currentSettings, isLoading, error } = useGetCurrentAvailabilitySettingsQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    const [availability, setAvailability] = useState<DayState[]>(
        daysOfWeek.map((day) => ({
            day,
            enabled:  day !== "Saturday" && day !== "Sunday",
            slotRows: [defaultSlotRow()],
        }))
    );

    useEffect(() => {
        if (currentSettings?.data) {
            const { timezone: tz, availability: saved } = currentSettings.data;
            if (tz) setTimezone([tz]);
            if (saved?.length > 0) {
                const updated = daysOfWeek.map((day) => {
                    const existing = saved.find((item: any) => item.day === day);
                    if (existing) {
                        const fromArr: string[] = existing.slots?.[0]?.from ?? [];
                        const toArr:   string[] = existing.slots?.[0]?.to   ?? [];
                        const reconstituted: SlotRow[] = fromArr.map((f: string, idx: number) => ({
                            from: to12hr(f),
                            to:   to12hr(toArr[idx] ?? ""),
                        }));
                        return {
                            day,
                            enabled:  existing.enabled !== false,
                            slotRows: reconstituted.length > 0 ? reconstituted : [defaultSlotRow()],
                        };
                    }
                    return {
                        day,
                        enabled:  day !== "Saturday" && day !== "Sunday",
                        slotRows: [defaultSlotRow()],
                    };
                });
                setAvailability(updated);
            }
        }
    }, [currentSettings]);

    useEffect(() => {
        setTimeSlotOptions(generateTimeSlots("06:00", "23:00", 15));
    }, []);

    const handleToggle = (index: number) => {
        setAvailability((prev) =>
            prev.map((item, i) => {
                if (i !== index) return item;
                return {
                    ...item,
                    enabled:  !item.enabled,
                    slotRows: item.slotRows.length === 0 ? [defaultSlotRow()] : item.slotRows,
                };
            })
        );
    };

    const handleSlotChange = (dayIndex: number, slotIndex: number, field: keyof SlotRow, value: string) => {
        setAvailability((prev) =>
            prev.map((item, i) => {
                if (i !== dayIndex) return item;
                const updatedRows = item.slotRows.map((s, si) => {
                    if (si !== slotIndex) return s;
                    const updated = { ...s, [field]: value };
                    // Clear "To" if it's now at or before the new "From"
                    if (field === "from" && updated.to) {
                        if (displayTimeToMinutes(value) >= displayTimeToMinutes(updated.to)) {
                            updated.to = "";
                        }
                    }
                    return updated;
                });
                return { ...item, slotRows: updatedRows };
            })
        );
    };

    const addSlot = (dayIndex: number) => {
        setAvailability((prev) =>
            prev.map((item, i) =>
                i !== dayIndex ? item : { ...item, slotRows: [...item.slotRows, defaultSlotRow()] }
            )
        );
    };

    const removeSlot = (dayIndex: number, slotIndex: number) => {
        setAvailability((prev) =>
            prev.map((item, i) => {
                if (i !== dayIndex) return item;
                const updated = item.slotRows.filter((_, si) => si !== slotIndex);
                return { ...item, slotRows: updated.length > 0 ? updated : [defaultSlotRow()] };
            })
        );
    };

    const validateSlots = (): string | null => {
        for (const day of availability) {
            if (!day.enabled) continue;
            for (let i = 0; i < day.slotRows.length; i++) {
                const { from, to } = day.slotRows[i];
                if (!from || !to) continue;
                const fromMins = displayTimeToMinutes(from);
                const toMins   = displayTimeToMinutes(to);
                if (fromMins >= 0 && toMins >= 0 && toMins <= fromMins) {
                    return `${day.day}: end time must be after start time (slot ${i + 1}).`;
                }
                // Overlap check against all later slots
                for (let j = i + 1; j < day.slotRows.length; j++) {
                    const other = day.slotRows[j];
                    if (!other.from || !other.to) continue;
                    const otherFrom = displayTimeToMinutes(other.from);
                    const otherTo   = displayTimeToMinutes(other.to);
                    if (fromMins < otherTo && toMins > otherFrom) {
                        return `${day.day}: slot ${i + 1} and slot ${j + 1} overlap.`;
                    }
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

        // duration is derived from each slot's time window (to - from), not user input
        const availability_settings = availability.map((d) => ({
            day:     d.day,
            enabled: d.enabled,
            slots: d.enabled
                ? [{
                    from: d.slotRows.map((s) => to24hr(s.from)).filter(Boolean),
                    to:   d.slotRows.map((s) => to24hr(s.to)).filter(Boolean),
                  }]
                : [],
            duration: d.enabled
                ? d.slotRows
                    .map((s) => {
                        const f = timeStrToMinutes(to24hr(s.from));
                        const t = timeStrToMinutes(to24hr(s.to));
                        return t > f ? String(t - f) : null;
                    })
                    .filter(Boolean)
                : [],
        }));

        const today = new Date();
        const threeMonthsLater = new Date(today);
        threeMonthsLater.setMonth(today.getMonth() + 3);
        const totalDays = Math.ceil((threeMonthsLater.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const availabilities = buildAvailabilities(availability, today, totalDays);

        createAvailability({ timezone: timezone[0], availability_settings, availabilities })
            .unwrap()
            .then(() => {
                toaster.create({ description: "Availability saved! Now set up your pricing.", type: "success", closable: true, duration: 5000 });
                onSaveSuccess?.();
            })
            .catch(console.error);
    };

    const handleDelete = () => {
        const availabilityId = currentSettings?.data?.id ?? currentSettings?.data?.availabilityId;
        if (!availabilityId) {
            toaster.create({ description: "No saved availability to delete.", type: "error", closable: true, duration: 4000 });
            setConfirmDelete(false);
            return;
        }
        deleteAvailability({ availabilityId })
            .unwrap()
            .then(() => {
                toaster.create({ description: "Availability deleted successfully.", type: "success", closable: true, duration: 6000 });
                setConfirmDelete(false);
            })
            .catch(() => {
                toaster.create({ description: "Failed to delete availability. Please try again.", type: "error", closable: true, duration: 4000 });
                setConfirmDelete(false);
            });
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
                    {/* Timezone */}
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

                    {/* Per-day rows */}
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
                            <HStack w="full" justify="space-between" alignItems="center">
                                <Switch.Root
                                    checked={day.enabled}
                                    onCheckedChange={() => handleToggle(dayIndex)}
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

                            {day.enabled && (
                                <VStack w="full" alignItems="flex-start" gap={2} pl={{ base: 0, md: "48px" }}>
                                    {day.slotRows.map((slot, slotIndex) => {
                                        // "From" must start at or after the previous slot's "To"
                                        const prevTo = slotIndex > 0 ? day.slotRows[slotIndex - 1].to : "";
                                        const fromOptions = prevTo
                                            ? timeSlotOptions.filter(
                                                (o) => displayTimeToMinutes(o.value as string) >= displayTimeToMinutes(prevTo)
                                              )
                                            : timeSlotOptions;

                                        // "To" must be strictly after the selected "From"
                                        const toOptions = slot.from
                                            ? timeSlotOptions.filter(
                                                (o) => displayTimeToMinutes(o.value as string) > displayTimeToMinutes(slot.from)
                                              )
                                            : timeSlotOptions;

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
                                                                options={fromOptions}
                                                                label=""
                                                                isMulti={false}
                                                                value={slot.from ? [slot.from] : []}
                                                                required={false}
                                                                error={{}}
                                                                onChange={(val: string[]) =>
                                                                    handleSlotChange(dayIndex, slotIndex, "from", val[0] ?? "")
                                                                }
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
                                                                options={toOptions}
                                                                label=""
                                                                isMulti={false}
                                                                value={slot.to ? [slot.to] : []}
                                                                required={false}
                                                                error={{}}
                                                                onChange={(val: string[]) =>
                                                                    handleSlotChange(dayIndex, slotIndex, "to", val[0] ?? "")
                                                                }
                                                            />
                                                        </Box>
                                                    </HStack>
                                                    {day.slotRows.length > 1 && (
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
                                            </VStack>
                                        );
                                    })}

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
                                </VStack>
                            )}
                        </VStack>
                    ))}

                    {confirmDelete ? (
                        <HStack
                            w="full"
                            mt={6}
                            gap={3}
                            p={4}
                            borderRadius="8px"
                            bg="red.50"
                            border="1px solid"
                            borderColor="red.200"
                            justify="space-between"
                            flexWrap="wrap"
                        >
                            <Text fontSize="0.9rem" color="red.700" fontWeight="500">
                                Delete all your availability settings? This cannot be undone.
                            </Text>
                            <HStack gap={2}>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    borderColor="gray.300"
                                    color="text_primary"
                                    onClick={() => setConfirmDelete(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    bg="red.500"
                                    color="white"
                                    _hover={{ opacity: 0.85 }}
                                    loading={isDeleting}
                                    onClick={handleDelete}
                                >
                                    Yes, delete
                                </Button>
                            </HStack>
                        </HStack>
                    ) : (
                        <HStack justify="space-between" w="full" mt={6} gap={3} flexWrap="wrap">
                            <Button
                                variant="ghost"
                                color="red.500"
                                gap={1.5}
                                px={0}
                                onClick={() => setConfirmDelete(true)}
                                display={currentSettings?.data ? "flex" : "none"}
                            >
                                <LuTrash2 size={15} />
                                Delete availability
                            </Button>
                            <HStack gap={3} ml="auto">
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
                        </HStack>
                    )}
                </>
            )}
        </VStack>
    );
};

export default AvailabilitySettings;
