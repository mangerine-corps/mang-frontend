import { Box, Flex, HStack, Image, Spinner, Text, VStack } from "@chakra-ui/react";
import { useGetDashboardConsultationsQuery } from "mangarine/state/services/dashboard.service";

const ConsultationOverview = () => {
  const { data, isLoading } = useGetDashboardConsultationsQuery({ period: "monthly" });

  const months: string[]     = data?.data?.months     ?? data?.months     ?? [];
  const successful: number[] = data?.data?.successful ?? data?.successful ?? [];
  const canceled: number[]   = data?.data?.canceled   ?? data?.canceled   ?? [];

  const hasData = successful.some((v) => v > 0) || canceled.some((v) => v > 0);
  const maxValue = hasData ? Math.max(...successful, ...canceled, 1) : 1;

  return (
    <Box w="full" mx="auto" bg="bg_box" borderRadius="xl" boxShadow="md" p={6}>
      <VStack align="flex-start" gap={4}>
        <Text fontSize="sm" color="gray.400">Statistics</Text>
        <Text fontSize="xl" fontWeight="semibold" color="gray.800">Consultation Overview</Text>

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

        {isLoading ? (
          <HStack justify="center" w="full" py={8}><Spinner /></HStack>
        ) : hasData ? (
          <Flex height="150px" width="full" position="relative" align="flex-end">
            <Box position="absolute" width="full" height="full" zIndex={0}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Box key={i} position="absolute" bottom={`${i * 25}%`} width="full" height="1px" bg="gray.100" />
              ))}
            </Box>
            <Flex w="full" justify="space-around" align="flex-end" zIndex={1}>
              {months.map((month, index) => {
                const successHeight = (successful[index] / maxValue) * 100;
                const canceledHeight = (canceled[index] / maxValue) * 100;
                return (
                  <Flex key={month} direction="column" align="center" justify="flex-end" position="relative" px={2} pt={2} height="100%">
                    <Flex gap={3} align="end">
                      <Box w="20px" h={`${successHeight}%`} bg="green.500" borderTopRadius="md" transition="height 0.3s" />
                      <Box w="20px" h={`${canceledHeight}%`} bg="red.400" borderTopRadius="md" transition="height 0.3s" />
                    </Flex>
                    <Text fontSize="sm" mt={2}>{month}</Text>
                  </Flex>
                );
              })}
            </Flex>
          </Flex>
        ) : (
          <Flex
            direction="column" align="center" justify="center" w="full" h="150px"
            bg="gray.50" borderRadius="lg" borderWidth="1px" borderColor="gray.100" borderStyle="dashed"
          >
            <Image src="/icons/emptyct.svg" alt="no consultations" boxSize="32px" mb={1} opacity={0.5} />
            <Text fontSize="sm" fontWeight="600" color="gray.600" _dark={{ color: "gray.400" }}>No consultations yet</Text>
            <Text fontSize="xs" color="gray.400" mt={1}>Your session history will appear here.</Text>
          </Flex>
        )}
      </VStack>
    </Box>
  );
};

export default ConsultationOverview;
