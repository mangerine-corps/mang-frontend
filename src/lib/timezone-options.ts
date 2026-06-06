export const TIME_ZONE_OPTIONS = [
  { id: "1",  label: "(UTC-8:00) Pacific Time",           value: "America/Los_Angeles" },
  { id: "2",  label: "(UTC-7:00) Mountain Time",          value: "America/Denver" },
  { id: "3",  label: "(UTC-6:00) Central Time",           value: "America/Chicago" },
  { id: "4",  label: "(UTC-5:00) Eastern Time",           value: "America/New_York" },
  { id: "5",  label: "(UTC-4:00) Atlantic Time",          value: "America/Halifax" },
  { id: "6",  label: "(UTC-3:00) Brazil",                 value: "America/Sao_Paulo" },
  { id: "7",  label: "(UTC+0:00) GMT / London",           value: "Europe/London" },
  { id: "8",  label: "(UTC+1:00) West Africa / Lagos",    value: "Africa/Lagos" },
  { id: "9",  label: "(UTC+1:00) Central Europe",         value: "Europe/Paris" },
  { id: "10", label: "(UTC+2:00) Cairo / East Europe",    value: "Africa/Cairo" },
  { id: "11", label: "(UTC+2:00) South Africa",           value: "Africa/Johannesburg" },
  { id: "12", label: "(UTC+3:00) East Africa / Nairobi",  value: "Africa/Nairobi" },
  { id: "13", label: "(UTC+3:00) Moscow",                 value: "Europe/Moscow" },
  { id: "14", label: "(UTC+3:00) Saudi Arabia / Riyadh",  value: "Asia/Riyadh" },
  { id: "15", label: "(UTC+4:00) Gulf / Dubai",           value: "Asia/Dubai" },
  { id: "16", label: "(UTC+5:00) Pakistan",               value: "Asia/Karachi" },
  { id: "17", label: "(UTC+5:30) India",                  value: "Asia/Kolkata" },
  { id: "18", label: "(UTC+6:00) Bangladesh / Dhaka",     value: "Asia/Dhaka" },
  { id: "19", label: "(UTC+7:00) Indochina / Bangkok",    value: "Asia/Bangkok" },
  { id: "20", label: "(UTC+8:00) China / Singapore",      value: "Asia/Shanghai" },
  { id: "21", label: "(UTC+8:00) Malaysia",               value: "Asia/Kuala_Lumpur" },
  { id: "22", label: "(UTC+9:00) Japan / Korea",          value: "Asia/Tokyo" },
  { id: "23", label: "(UTC+10:00) Sydney / AEST",         value: "Australia/Sydney" },
  { id: "24", label: "(UTC+11:00) Solomon Islands",       value: "Pacific/Guadalcanal" },
  { id: "25", label: "(UTC+12:00) New Zealand",           value: "Pacific/Auckland" },
] as const;

// Maps previously stored values (display labels or old IDs) → current IANA IDs
const LEGACY_TIME_ZONE_MAP: Record<string, string> = {
  // Old display-label values
  "(UTC-8:00) Pacific Time":      "America/Los_Angeles",
  "(UTC+1:00) West Africa Time":  "Africa/Lagos",
  "(UTC+0:00) GMT":               "Europe/London",
  // Pass-through IANA IDs
  "Africa/Lagos":                 "Africa/Lagos",
  "Africa/Accra":                 "Europe/London",
  "Africa/Cairo":                 "Africa/Cairo",
  "Africa/Johannesburg":          "Africa/Johannesburg",
  "Africa/Nairobi":               "Africa/Nairobi",
  "America/Los_Angeles":          "America/Los_Angeles",
  "America/Denver":               "America/Denver",
  "America/Chicago":              "America/Chicago",
  "America/New_York":             "America/New_York",
  "America/Halifax":              "America/Halifax",
  "America/Sao_Paulo":            "America/Sao_Paulo",
  "Europe/London":                "Europe/London",
  "Europe/Paris":                 "Europe/Paris",
  "Europe/Moscow":                "Europe/Moscow",
  "Asia/Riyadh":                  "Asia/Riyadh",
  "Asia/Dubai":                   "Asia/Dubai",
  "Asia/Karachi":                 "Asia/Karachi",
  "Asia/Kolkata":                 "Asia/Kolkata",
  "Asia/Dhaka":                   "Asia/Dhaka",
  "Asia/Bangkok":                 "Asia/Bangkok",
  "Asia/Shanghai":                "Asia/Shanghai",
  "Asia/Kuala_Lumpur":            "Asia/Kuala_Lumpur",
  "Asia/Tokyo":                   "Asia/Tokyo",
  "Australia/Sydney":             "Australia/Sydney",
  "Pacific/Guadalcanal":          "Pacific/Guadalcanal",
  "Pacific/Auckland":             "Pacific/Auckland",
  UTC:                            "Europe/London",
  GMT:                            "Europe/London",
  // Mobile abbreviations
  wat:                            "Africa/Lagos",
  gmt:                            "Europe/London",
  pst:                            "America/Los_Angeles",
  est:                            "America/New_York",
  cst:                            "America/Chicago",
  mst:                            "America/Denver",
  ist:                            "Asia/Kolkata",
  jst:                            "Asia/Tokyo",
};

export const normalizeTimeZoneValue = (value?: string | null): string => {
  const normalized = value?.trim();
  if (!normalized) return "";
  if (TIME_ZONE_OPTIONS.some((opt) => opt.value === normalized)) return normalized;
  return LEGACY_TIME_ZONE_MAP[normalized] ?? "";
};
