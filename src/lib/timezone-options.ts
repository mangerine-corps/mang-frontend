export const TIME_ZONE_OPTIONS = [
  { id: "1", label: "(UTC-8:00) Pacific Time", value: "(UTC-8:00) Pacific Time" },
  { id: "2", label: "(UTC+1:00) West Africa Time", value: "(UTC+1:00) West Africa Time" },
  { id: "3", label: "(UTC+0:00) GMT", value: "(UTC+0:00) GMT" },
] as const;

const LEGACY_TIME_ZONE_MAP: Record<string, string> = {
  "Africa/Lagos": "(UTC+1:00) West Africa Time",
  "Africa/Accra": "(UTC+0:00) GMT",
  UTC: "(UTC+0:00) GMT",
  GMT: "(UTC+0:00) GMT",
  "Europe/London": "(UTC+0:00) GMT",
  "America/Los_Angeles": "(UTC-8:00) Pacific Time",
};

export const normalizeTimeZoneValue = (value?: string | null): string => {
  const normalized = value?.trim();

  if (!normalized) {
    return "";
  }

  if (TIME_ZONE_OPTIONS.some((option) => option.value === normalized)) {
    return normalized;
  }

  return LEGACY_TIME_ZONE_MAP[normalized] ?? normalized;
};
