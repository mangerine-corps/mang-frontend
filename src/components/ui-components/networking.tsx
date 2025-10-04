import { Avatar, AvatarGroup, Box, Flex, HStack, Image, Spacer, Text, VStack } from "@chakra-ui/react";

const eventInfo = {
  category: "Networking",
  title: "Leadership Training 101",
  date: "Tue, 03/12/2025",
  time: "09:00 - 09:45 AM",
  attendees: ["Uchiha Sasuke", "Baki Ani", "Uchiha Chan", "+3"],
  extraAttendees: "+6",
};

// const menuItems = [
//   { icon: "/icons/saved.svg", label: "Saved Items" },
//   { icon: "/icons/payment.svg", label: "Payments" },
//   { icon: "/icons/payment.svg", label: "Transaction History" },
//   { icon: "/icons/payment.svg", label: "Earning Reports" },
// ];

const NetworkingCard = () => {
  return (
    <VStack
      // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
      display={{ base: "none", md: "flex", lg: "flex" }}
    >
      <Box
        w="full"
        p={4}
        borderRadius="lg"
        bg="networking_box"
        border="1px solid"
        borderColor="border_background"
        boxShadow="sm"
      >
        <Text
          // colorScheme="Secondary:800"
          // color="#8C7254"
          borderRadius="full"
          px={2}
          py={1}
          my="2"
          fontSize={"0.75rem"}
          fontWeight="600"
          bg="badge_background"
          textAlign={"center"}
          w="28"
          // bg="act_box"
          color="#8C7254"
        >
          {eventInfo.category}
        </Text>

        <Text fontWeight="600" color="text_primary" fontSize="1.125rem" mb={1}>
          {eventInfo.title}
        </Text>

        <HStack fontSize="sm" color="text_primary" wordSpacing={3} mb={2}>
          {/* <Image alt='calendar image' src="/images/calender.svg" /> */}
          <HStack fontSize="0.875rem" color="grey.500" wordSpacing={3} mb={2}>
            <Image alt='calendar icon' src="/images/calender.svg" />
            <Text>{eventInfo.date}</Text>
            <Text>•</Text>
            <Text>{eventInfo.time}</Text>
          </HStack>
        </HStack>

        <Flex align="center" color="text_primary" justify="space-between">
          <AvatarGroup gap="2" pt="2" spaceX="-6" size="sm">
            {eventInfo.attendees.map((name, index) => (
              <Avatar.Root key={index}>
                <Avatar.Fallback name={name}>
                  {name.startsWith("+") ? name : null}
                </Avatar.Fallback>
              </Avatar.Root>
            ))}
          </AvatarGroup>

          <Spacer />

          <Image src="/icons/right.svg" alt="forward-button" pr="4" />
        </Flex>
      </Box>
    </VStack>
  );
};

export default NetworkingCard;
