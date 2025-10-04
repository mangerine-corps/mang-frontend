import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Tooltip,
} from "@chakra-ui/react";

const chartData = {
  months: ["Jan", "Feb", "March", "April"],
  successful: [28, 30, 40, 19],
  canceled: [22, 22, 34, 7],
  highlight: "Feb",
  annotations: {
    Feb: {
      successful: 30,
      canceled: 22,
    },
  },
};

const maxValue = Math.max(...chartData.successful, ...chartData.canceled, 40);

const ConsultationOverview = () => {
  return (
    <Box
      w="full"
      // maxW="700px"
      mx="auto"
      bg="bg_box"
      borderRadius="xl"
      boxShadow="md"
      p={6}
    >
      <VStack align="flex-start" gap={4}>
        <Text fontSize="sm" color="gray.400">
          Statistics
        </Text>
        <Text fontSize="xl" fontWeight="semibold" color="gray.800">
          Consultation Overview
        </Text>

        {/* Legend */}
        <Flex justify="flex-end" w="full" gap={4}>
          <HStack gap={2}>
            <Box w="10px" h="10px" bg="green.500" borderRadius="full" />
            <Text fontSize="sm">Successful</Text>
          </HStack>
          <HStack gap={2}>
            <Box w="10px" h="10px" bg="red.400" borderRadius="full" />
            <Text fontSize="sm">Canceled</Text>
          </HStack>
        </Flex>

        {/* Chart */}
        <Flex height="150px" width="full" position="relative" align="flex-end">
          {/* Grid Lines */}
          <Box position="absolute" width="full" height="full" zIndex={0}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                position="absolute"
                bottom={`${i * 25}%`}
                width="full"
                height="1px"
                bg="gray.100"
              />
            ))}
          </Box>

          {/* Bars */}
          <Flex w="full" justify="space-around" align="flex-end" zIndex={1}>
            {chartData.months.map((month, index) => {
              const successHeight =
                (chartData.successful[index] / maxValue) * 100;
              const canceledHeight =
                (chartData.canceled[index] / maxValue) * 100;
              const highlight = month === chartData.highlight;
              const annotation = chartData.annotations[month];

              return (
                <Flex
                  key={month}
                  direction="column"
                  align="center"
                  justify="flex-end"
                  position="relative"
                  borderRadius="md"
                  bg={highlight ? "purple.50" : "transparent"}
                  px={2}
                  pt={2}
                  height="100%"
                >
                  {/* Annotation Bubble */}
                  {annotation && (
                    <Box
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      px={2}
                      py={1}
                      fontSize="xs"
                      boxShadow="sm"
                      position="absolute"
                      top="-30px"
                      zIndex={10}
                    >
                      <VStack gap={0}>
                        <HStack gap={1}>
                          <Box w="6px" h="6px" borderRadius="full" bg="green.500" />
                          <Text fontSize="xs">{annotation.successful}</Text>
                        </HStack>
                        <HStack gap={1}>
                          <Box w="6px" h="6px" borderRadius="full" bg="red.400" />
                          <Text fontSize="xs">{annotation.canceled}</Text>
                        </HStack>
                      </VStack>
                    </Box>
                  )}

                  <Flex gap={3} align="end">
                    <Box
                      w="20px"
                      h={`${successHeight}%`}
                      bg="green.500"
                      borderTopRadius="md"
                      transition="height 0.3s"
                    />
                    <Box
                      w="20px"
                      h={`${canceledHeight}%`}
                      bg="red.400"
                      borderTopRadius="md"
                      transition="height 0.3s"
                    />
                  </Flex>
                  <Text fontSize="sm" mt={2}>
                    {month}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </VStack>
    </Box>
  );
};

export default ConsultationOverview;
