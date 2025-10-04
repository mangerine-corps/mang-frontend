export function generateTimeSlots(startTime: string, endTime: string, diff: number = 15) {
    const slots = [];
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    while (start <= end) {
        const hours = start.getHours();
        const minutes = start.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes.toString().padStart(2, '0');

        slots.push({
            id: `${formattedHours}:${formattedMinutes} ${period}`,
            label: `${formattedHours}:${formattedMinutes} ${period}`,
            value: `${formattedHours}:${formattedMinutes} ${period}`
        });
        start.setMinutes(start.getMinutes() + diff);
    }

    return slots;
}
export interface PricingDetails {
  currency: "USD"; // Or string if other currencies are possible
  dayBookPercentage: number;
  flatPrice: string; // Consider if this should be number if used in calculations
  fourHoursDiscount: number;
  midDayBookPercentage: number;
  otherHoursDiscount: number;
  threeHoursDiscount: number;
  twoHoursDiscount: number;
}
