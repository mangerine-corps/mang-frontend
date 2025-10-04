import { Box, Flex, Text, Image, HStack, VStack, IconButton, Stack } from "@chakra-ui/react";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";

const BookingCalendar = () => {
  const { upcomingConsultation } = useConsultants()
  const { user } = useAuth()
  return (
    <Box
      bg="bg_box"
      rounded="lg"
      shadow="sm"
      p={6}
      display={{ base: "none", md: "block", lg: "block" }}
      // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
    >
      <Flex justify="space-between" align="center">
        <Text fontWeight="bold" fontSize="xl" color="text_primary">
          Bookings Calendar
        </Text>
        <IconButton aria-label="external" variant="ghost" />
      </Flex>
      {upcomingConsultation.slice(0, 2)?.map((item, idx) => (
        <Stack key={idx}>
          <HStack
            w="full"
            justifyContent={"space-between"}
            alignItems={"center"}
            pb="4"
            pt="2"
          >
            <Flex
              bg="badge_background"
              p={1.5}
              // flex={1}
              rounded="xl"
              px="4"
              justifyContent="space-between"
              alignItems="center"
              // mb={4}
              // fontWeight="medium"
              // fontSize="sm"
            >
              <Image

                src="/images/Vector1.svg"
                alt="Previous"
                // boxSize="20px"
                cursor="pointer"
                // w="16px"
                // h="16px"
              />
              <Text
                px="3"
                color="text_primary"
                fontWeight="normal"
                fontSize="0.875rem"
              >
                {item?.dateDisplay} {item?.timeRangeDisplay}
              </Text>
              <Image

                //  as="button"
                //  onClick={()=>{}}
                src="/images/Vector2.svg"
                alt="Previous"
                // boxSize="20px"
                cursor="pointer"
                // w="16px"
                // h="16px"
              />
            </Flex>
            <Box w="0.5" h="8" bg="grey.100">
              {/* <Text>h</Text> */}
            </Box>

            <Image
              src="/images/Vector3.svg"
              alt="Open External"
              // h=""
              boxSize="12px"
              cursor="pointer"
            />
          </HStack>

          <Flex borderWidth={1} rounded="lg" overflow="hidden">
            <Box
              flex={1}
              //  borderLeftWidth={ "Mon 9" ? 1 : 0}
            >
              <Box bg="act_box" py={2} textAlign="center" fontWeight="semibold">
                <Text
                  color="text_primary"
                  fontSize={"0.875REM"}
                  fontWeight={"500"}
                >
                  {new Date(item?.dateDisplay)
                    .toLocaleDateString("en-US", {
                      weekday: "short",
                      day: "numeric",
                    })
                    .replace(/,\s*/, " ")}
                  {/* {day.date}{" "} */}
                </Text>
              </Box>
              <VStack wordSpacing={4} py={4}>
                <HStack wordSpacing={3} w="full" px={4}>
                  <HStack>
                    <Box
                      w="1"
                      h="8"
                      //  bg={event.type === "high" ? "red.500" : "text_primary"}
                    >
                      {/* <Text>h</Text> */}
                    </Box>
                    <Box
                      //  bg={event.type === "high" ? "red.500" : "blue.900"}
                      // p={2}
                      rounded="full"
                      display="flex"
                      color="white"
                      w="8"
                      h="8"
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      <Image
                        // src="/images/Vector4.png"
                        src="/icons/bed.svg"
                        alt="Previous"
                        // boxSize="20px"
                        cursor="pointer"
                        // w="16px"
                        // h="16px"
                      />
                    </Box>
                  </HStack>

                  <Box
                    border="1px solid"
                    borderColor="gray.300"
                    rounded="full"
                    px={2}
                    fontSize="xs"
                    fontWeight="medium"
                  >
                    {/* {event.extra} */}
                  </Box>
                </HStack>
              </VStack>
            </Box>
          </Flex>

          {/* Legend */}
          <HStack wordSpacing={6} mt={6} justify="start">
            <HStack>
              <Box
                bg="text_primary"
                // p={2}
                rounded="full"
                display="flex"
                color="white"
                w="8"
                h="8"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image
                  src="/icons/bed.svg"
                  alt="Previous"
                  // boxSize="20px"
                  cursor="pointer"
                  // w="16px"
                  // h="16px"
                />
              </Box>
              <Text pr="6" color="text_primary" fontSize="sm">
                Normal
              </Text>
            </HStack>
            <HStack>
              <Box
                bg="red.500"
                // p={2}
                rounded="full"
                display="flex"
                color="white"
                w="8"
                h="8"
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image
                  src="/icons/candle.svg"
                  alt="Previous"
                  // boxSize="20px"
                  cursor="pointer"
                  // w="16px"
                  // h="16px"
                />
              </Box>
              <Text color="text_primary" fontSize="sm">
                High
              </Text>
            </HStack>
          </HStack>
        </Stack>
      ))}
    </Box>
  );
};

export default BookingCalendar;
