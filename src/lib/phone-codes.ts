export interface PhoneCode {
    code: string;   // ISO 2-letter e.g. "NG"
    name: string;   // e.g. "Nigeria"
    dial: string;   // numeric only, no + e.g. "234"
    flag: string;   // emoji
}

export const PHONE_CODES: PhoneCode[] = [
    { code: "NG", name: "Nigeria",            dial: "234", flag: "🇳🇬" },
    { code: "US", name: "United States",      dial: "1",   flag: "🇺🇸" },
    { code: "GB", name: "United Kingdom",     dial: "44",  flag: "🇬🇧" },
    { code: "GH", name: "Ghana",              dial: "233", flag: "🇬🇭" },
    { code: "KE", name: "Kenya",              dial: "254", flag: "🇰🇪" },
    { code: "ZA", name: "South Africa",       dial: "27",  flag: "🇿🇦" },
    { code: "EG", name: "Egypt",              dial: "20",  flag: "🇪🇬" },
    { code: "ET", name: "Ethiopia",           dial: "251", flag: "🇪🇹" },
    { code: "TZ", name: "Tanzania",           dial: "255", flag: "🇹🇿" },
    { code: "UG", name: "Uganda",             dial: "256", flag: "🇺🇬" },
    { code: "RW", name: "Rwanda",             dial: "250", flag: "🇷🇼" },
    { code: "SN", name: "Senegal",            dial: "221", flag: "🇸🇳" },
    { code: "CI", name: "Côte d'Ivoire",      dial: "225", flag: "🇨🇮" },
    { code: "CM", name: "Cameroon",           dial: "237", flag: "🇨🇲" },
    { code: "CA", name: "Canada",             dial: "1",   flag: "🇨🇦" },
    { code: "IN", name: "India",              dial: "91",  flag: "🇮🇳" },
    { code: "PK", name: "Pakistan",           dial: "92",  flag: "🇵🇰" },
    { code: "BD", name: "Bangladesh",         dial: "880", flag: "🇧🇩" },
    { code: "DE", name: "Germany",            dial: "49",  flag: "🇩🇪" },
    { code: "FR", name: "France",             dial: "33",  flag: "🇫🇷" },
    { code: "IT", name: "Italy",              dial: "39",  flag: "🇮🇹" },
    { code: "ES", name: "Spain",              dial: "34",  flag: "🇪🇸" },
    { code: "NL", name: "Netherlands",        dial: "31",  flag: "🇳🇱" },
    { code: "SE", name: "Sweden",             dial: "46",  flag: "🇸🇪" },
    { code: "NO", name: "Norway",             dial: "47",  flag: "🇳🇴" },
    { code: "AU", name: "Australia",          dial: "61",  flag: "🇦🇺" },
    { code: "NZ", name: "New Zealand",        dial: "64",  flag: "🇳🇿" },
    { code: "BR", name: "Brazil",             dial: "55",  flag: "🇧🇷" },
    { code: "MX", name: "Mexico",             dial: "52",  flag: "🇲🇽" },
    { code: "AR", name: "Argentina",          dial: "54",  flag: "🇦🇷" },
    { code: "CO", name: "Colombia",           dial: "57",  flag: "🇨🇴" },
    { code: "SA", name: "Saudi Arabia",       dial: "966", flag: "🇸🇦" },
    { code: "AE", name: "UAE",                dial: "971", flag: "🇦🇪" },
    { code: "QA", name: "Qatar",              dial: "974", flag: "🇶🇦" },
    { code: "SG", name: "Singapore",          dial: "65",  flag: "🇸🇬" },
    { code: "MY", name: "Malaysia",           dial: "60",  flag: "🇲🇾" },
    { code: "PH", name: "Philippines",        dial: "63",  flag: "🇵🇭" },
    { code: "CN", name: "China",              dial: "86",  flag: "🇨🇳" },
    { code: "JP", name: "Japan",              dial: "81",  flag: "🇯🇵" },
    { code: "KR", name: "South Korea",        dial: "82",  flag: "🇰🇷" },
    { code: "RU", name: "Russia",             dial: "7",   flag: "🇷🇺" },
    { code: "TR", name: "Turkey",             dial: "90",  flag: "🇹🇷" },
    { code: "ID", name: "Indonesia",          dial: "62",  flag: "🇮🇩" },
];

// Remove duplicate entries (keeping first occurrence)
const seen = new Set<string>();
export const PHONE_CODES_UNIQUE: PhoneCode[] = PHONE_CODES.filter((c) => {
    const key = `${c.code}-${c.dial}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
});

/**
 * Strips leading + or zeros and any non-digit characters, returns dial+number.
 * Backend expects no + sign: "2348012345678"
 */
export const formatPhoneForApi = (dial: string, localNumber: string): string => {
    const digits = localNumber.replace(/\D/g, "").replace(/^0+/, "");
    return `${dial}${digits}`;
};

/**
 * Given a stored full number (e.g. "2348012345678"), split into dial + local.
 * Returns null if no matching code found.
 */
export const parseStoredPhone = (full: string): { entry: PhoneCode; local: string } | null => {
    if (!full) return null;
    const digits = full.replace(/\D/g, "");
    const sorted = [...PHONE_CODES_UNIQUE].sort((a, b) => b.dial.length - a.dial.length);
    for (const entry of sorted) {
        if (digits.startsWith(entry.dial)) {
            return { entry, local: digits.slice(entry.dial.length) };
        }
    }
    return null;
};
