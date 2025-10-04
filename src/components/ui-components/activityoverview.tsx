import {
  Box,
  HStack,
  Image,
  Text,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react";

const overviewData = [
  {
    title: "Total Earnings",
    value: "$1,000,000.00",
    icon: "/icons/money.svg",
    bg: "green.50",
  },
  {
    title: "Success Rate",
    value: "85%",
    icon: "/icons/check.svg",
    bg: "purple.50",
  },
  {
    title: "Cancellation",
    value: "3 ($200 loss)",
    icon: "/icons/warning.svg",
    bg: "yellow.50",
  },
  {
    title: "Returning Client’s Rate",
    value: "60%",
    icon: "/icons/user.svg",
    bg: "gray.50",
  },
];



const ActivityOverview = () => {
  return (
    <Box
      w="full"
      mt={{base: "4", md: "4", lg: "0", xl: "0"}}
      // maxW="600px"
      mx="auto"
      bg="bg_box"
      borderRadius="xl"
      boxShadow="lg"
      p={6}
    >
   <Text font="outfit" fontSize="1.5rem" fontWeight="600" color="text_primary" mb={4}>
          Activity Overview
        </Text>

         <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={4}
      >
        {overviewData.map((item, index) => (
          <GridItem
            key={index}
            p={4}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.100"
          >
            <HStack justify="space-between">
              <VStack align="start" gap={1}>
                <Text fontSize="sm" color="gray.500">
                  {item.title}
                </Text>
                <Text fontWeight="bold" color="text_primary" fontSize="lg">
                  {item.value}
                </Text>
              </VStack>
              <Box
                bg={item.bg}
                p={2}
                borderRadius="md"
              >
                <Image src={item.icon} alt={item.title}  />
              </Box>
            </HStack>
          </GridItem>
        ))}
      </Grid>

    </Box>
  );
};

export default ActivityOverview;
