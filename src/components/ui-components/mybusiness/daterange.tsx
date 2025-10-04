// components/DateRangePicker.tsx
import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import { addDays, format } from "date-fns";
import "react-date-range/dist/styles.css"; // main css
import "react-date-range/dist/theme/default.css"; // theme css

type Range = {
  startDate?: Date;
  endDate?: Date;
  key: string;
};

export const DateRangePicker = () => {
  const [state, setState] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

//   const handleSelect = (ranges: RangeKeyDict) => {
//     setState([ranges.selection]);
//   };

  const { startDate, endDate } = state[0];

  return (
    <Box width="80vw" maxW="100%" p={4}>
      <Text mb={4} fontSize="lg" fontWeight="bold">
        Selected Range:
      </Text>
      <Text mb={6}>
        {format(startDate, "MMM dd, yyyy")} → {format(endDate, "MMM dd, yyyy")}
      </Text>
      <DateRange
        editableDateInputs={true}
        // onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        ranges={state}
        rangeColors={["#3182ce"]} // Chakra blue.500
      />
    </Box>
  );
};
