import { format, addMinutes, getDaysInMonth, startOfMonth, addMonths, setDate } from 'date-fns';

// Define the types for your schedule data
export interface TimeSlotDefinition {
    from: string[];
    to: string[];
}

export interface DaySchedule {
    day: string;
    enabled: boolean;
    slots: TimeSlotDefinition[];
    duration: string[] | string;
}

// Updated interface for the generated time slot
export interface DetailedTimeSlot {
    startTime: string;
    endTime: string;
    duration: number; // Duration in minutes
    isAvailable: boolean; // Based on the enabled status of the day and slot generation
}

export interface DailyAvailability {
    date: string;
    timeslots: DetailedTimeSlot[];
}

/**
 * Parses a time string (e.g., '10:00 AM') into minutes from midnight.
 * @param timeStr The time string to parse.
 * @returns The total minutes from midnight.
 */
export const parseTimeIntoMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period && period.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period && period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0; // Midnight (12 AM)
    }
    return hours * 60 + minutes;
}

/**
 * Converts minutes from midnight into a 12-hour formatted time string (e.g., '10:00 AM').
 * @param totalMinutes The total minutes from midnight.
 * @returns The formatted time string.
 */
export const formatMinutesToTime = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const dt = new Date();
    dt.setHours(hours, minutes, 0, 0); // Set hours and minutes to a dummy date for formatting

    return format(dt, 'hh:mm aa');
}

/**
 * Generates an array of availability for a given number of months based on a schedule.
 * @param schedule A list of objects defining daily availability.
 * @param startDate The starting date for availability generation.
 * @param numMonths The number of consecutive months to generate availability for (minimum 1).
 * @returns An array of availability objects, each containing a date and detailed time slots.
 */
export const generateAvailability = (
    schedule: DaySchedule[],
    startDate: Date,
    numMonths: number = 3
): DailyAvailability[] => {
    const availability: DailyAvailability[] = [];
    const scheduleMap = new Map<string, DaySchedule>();
    schedule.forEach(dayData => scheduleMap.set(dayData.day, dayData));

    let currentMonthStart = startOfMonth(startDate);

    for (let i = 0; i < numMonths; i++) {
        const daysInMonth = getDaysInMonth(currentMonthStart);

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = setDate(currentMonthStart, day);
            const dayName = format(currentDate, 'EEEE'); // e.g., "Monday"
            const daySchedule = scheduleMap.get(dayName);

            if (daySchedule) { // Check if schedule exists for the day
                const dayAvailability: DailyAvailability = {
                    date: format(currentDate, 'yyyy-MM-dd'),
                    timeslots: []
                };

                // Determine duration
                let duration: number = 0;
                if (Array.isArray(daySchedule.duration) && daySchedule.duration.length > 0 && !isNaN(parseInt(daySchedule.duration[0]))) {
                    duration = parseInt(daySchedule.duration[0]);
                } else if (typeof daySchedule.duration === 'string' && !isNaN(parseInt(daySchedule.duration))) {
                    duration = parseInt(daySchedule.duration);
                }

                if (daySchedule.enabled && duration > 0) {
                    for (const slot of daySchedule.slots) {
                        const fromMinutes = parseTimeIntoMinutes(slot.from[0]);
                        const toMinutes = parseTimeIntoMinutes(slot.to[0]);

                        let currentSlotStartMinutes = fromMinutes;
                        while (currentSlotStartMinutes + duration <= toMinutes) {
                            dayAvailability.timeslots.push({
                                startTime: formatMinutesToTime(currentSlotStartMinutes),
                                endTime: formatMinutesToTime(currentSlotStartMinutes + duration),
                                duration: duration,
                                isAvailable: true // If the day is enabled and slot generated, it's available
                            });
                            currentSlotStartMinutes += duration;
                        }
                    }
                } else if (daySchedule.enabled && duration <= 0) {
                    // If enabled but duration is not valid/zero, represent the main slots with isAvailable: true
                    for (const slot of daySchedule.slots) {
                        dayAvailability.timeslots.push({
                            startTime: slot.from[0],
                            endTime: slot.to[0],
                            duration: parseTimeIntoMinutes(slot.to[0]) - parseTimeIntoMinutes(slot.from[0]), // Calculate duration
                            isAvailable: true
                        });
                    }
                }
                // If daySchedule.enabled is false, no slots are added, which means no availability.
                // You could explicitly add "unavailable" slots if needed, but current logic filters them out.

                // Only add the day to availability if it has actual timeslots generated (i.e., it's enabled and has valid slots)
                if (dayAvailability.timeslots.length > 0) {
                    availability.push(dayAvailability);
                }
            }
        }
        // Move to the next month for the next iteration
        currentMonthStart = addMonths(currentMonthStart, 1);
    }

    return availability;
}

