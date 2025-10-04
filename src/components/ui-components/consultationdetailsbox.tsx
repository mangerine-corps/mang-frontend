import { Box, Button, Text, Flex } from "@chakra-ui/react";

const ConsultationDetailsBox = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="24px"
      padding="24px"
      borderRadius="12px"
      background="bg_box"
      boxShadow="bg_box"
      w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
    >
      {/* Section 1: Consultation Info */}
      <Box>
        <Text
          fontSize="1.25rem"
          font="outfit"
          fontWeight="600"
          mb={2}
          color={"text_primary"}
        >
          Consultation Details
        </Text>
        <Flex flexDirection="column" gap="8px" width="100%">
          {["Consultant", "Date", "Time", "Amount"].map((item, index) => (
            <Flex key={index} justify="space-between" width="100%">
              <Text fontSize="0.875rem" color={"text_primary"}>
                {item}
              </Text>
              <Text
                fontWeight={item === "Amount" ? "bold" : "normal"}
                fontSize="0.875rem"
                color={"text_primary"}
              >
                {item === "Consultant"
                  ? "Sharon Grace"
                  : item === "Date"
                    ? "3rd July, 2024"
                    : item === "Time"
                      ? "8:00am - 8:30am"
                      : "$65.00"}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* Section 2: Success Message */}
      <Box>
        <Text
          fontSize="1.25rem"
          font="outfit"
          fontWeight="600"
          color={"text_primary"}
        >
          Consultation Booking Successful!
        </Text>
        <Text fontSize="0.75rem" color={"text_primary"} mb={4}>
          Your consultation booking with Sharon Grace was successful
        </Text>

        <Button
          bg="bt_schedule"
          color="white"
          flex={1}
          _hover={{ bg: "bt_schedule_hover" }}
          width="100%"
          mt={12}
        >
          Done
        </Button>

        <Box mt={4}>
          <Text color={"text_primary"} fontSize="xs" whiteSpace="pre-line">
            {`An email has been sent to graceshawn@gmail.com
Please check your inbox for consultation details.
We look forward to assisting you!`}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ConsultationDetailsBox;
