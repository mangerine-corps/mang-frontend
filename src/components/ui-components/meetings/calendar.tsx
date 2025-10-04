import { Box, Text } from "@chakra-ui/react";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Calendar } from "react-date-range";
import * as locales from "react-date-range/dist/locale";
import React, { useState } from "react";

const nameMapper = {
  ar: "Arabic",
  bg: "Bulgarian",
  ca: "Catalan",
  cs: "Czech",
  cy: "Welsh",
  da: "Danish",
  de: "German",
  el: "Greek",
  enGB: "English (United Kingdom)",
  enUS: "English (United States)",
  eo: "Esperanto",
  es: "Spanish",
  et: "Estonian",
  faIR: "Persian",
  fi: "Finnish",
  fil: "Filipino",
  fr: "French",
  hi: "Hindi",
  hr: "Croatian",
  hu: "Hungarian",
  hy: "Armenian",
  id: "Indonesian",
  is: "Icelandic",
  it: "Italian",
  ja: "Japanese",
  ka: "Georgian",
  ko: "Korean",
  lt: "Lithuanian",
  lv: "Latvian",
  mk: "Macedonian",
  nb: "Norwegian Bokmål",
  nl: "Dutch",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  sk: "Slovak",
  sl: "Slovenian",
  sr: "Serbian",
  sv: "Swedish",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  vi: "Vietnamese",
  zhCN: "Chinese Simplified",
  zhTW: "Chinese Traditional",
};

const CalendarView = () => {
  const localeOptions = Object.keys(locales)
    .map((key) => ({
      value: key,
      label: `${key} - ${nameMapper[key] || ""}`,
    }))
    .filter((item) => nameMapper[item.value]);

  const [locale, setLocale] = React.useState("ja");
  const [date, setDate] = useState(null);

  return (
    <Box
      w="100%"
      mx="auto"
      p={4}
      boxShadow="md"
      borderRadius="md"
      bg="main_background"
      py="5"
    >
      <Calendar
        onChange={(item) => setDate(item)}
        locale={locales[locale]}
        date={date}
      />
    </Box>
  );
};
export default CalendarView;
