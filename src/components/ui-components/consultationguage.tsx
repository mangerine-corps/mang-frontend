import { Box, Flex, HStack, Image, Spinner, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGetDashboardGaugeQuery } from "mangarine/state/services/dashboard.service";

const ConsultationGauge = () => {
  const router = useRouter();
  const { data, isLoading } = useGetDashboardGaugeQuery();

  const scheduled: number = data?.data?.scheduled ?? data?.scheduled ?? 0;
  const completed: number = data?.data?.completed ?? data?.completed ?? 0;
  const remaining = scheduled - completed;
  const percent   = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;
  const isEmpty   = !isLoading && scheduled === 0;

  const radius       = 90;
  const circumference = Math.PI * radius;
  const progress     = (percent / 100) * circumference;

  return (
    <Box bg="bg_box" borderRadius="xl" boxShadow="md" p={6} w="full" mx="auto">
      <Flex justify="space-between" mb={4}>
        <VStack gap={0} align="flex-start">
          <Text fontSize="sm" color="gray.400">Scheduled Consultation</Text>
          <Text fontWeight="bold" fontSize="lg" color={isEmpty ? "gray.300" : "text_primary"}>
            {isLoading ? "—" : scheduled}
          </Text>
        </VStack>
        <VStack gap={0} align="flex-end">
          <Text fontSize="sm" color="red.400">Consultations Left</Text>
          <Text color={isEmpty ? "gray.300" : "text_primary"} fontWeight="bold" fontSize="lg">
            {isLoading ? "—" : remaining}
          </Text>
        </VStack>
      </Flex>

      <Box mt={4} position="relative" height="150px">
        {isLoading ? (
          <HStack justify="center" align="center" h="full"><Spinner /></HStack>
        ) : (
          <>
            <svg width="100%" height="100%" viewBox="0 0 200 100">
              <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#CBD5E0" strokeWidth="14" strokeLinecap="round" />
              {!isEmpty && (
                <path
                  d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#0B1441" strokeWidth="14"
                  strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference - progress}
                />
              )}
              <circle
                r="10" fill={isEmpty ? "#CBD5E0" : "#0B1441"} stroke="#CBD5E0" strokeWidth="3"
                cx={isEmpty ? 10 : 100 + radius * Math.cos(Math.PI * (1 - percent / 100))}
                cy={isEmpty ? 100 : 100 - radius * Math.sin(Math.PI * (1 - percent / 100))}
              />
            </svg>

            <Flex direction="column" align="center" justify="center" position="absolute" top="45%" left="50%" transform="translate(-50%, -50%)">
              {isEmpty ? (
                <VStack gap={1} align="center">
                  <Text fontSize="2xl" fontWeight="bold" color="gray.300">0%</Text>
                  <Image src="/icons/emptyct.svg" alt="no sessions" boxSize="20px" opacity={0.4} />
                  <Text fontSize="xs" color="gray.400" textAlign="center">No sessions yet</Text>
                  <Text
                    fontSize="xs" color="blue.500" fontWeight="600" cursor="pointer" textDecoration="underline"
                    onClick={() => router.push("/my-business/dashboard?tab=meetings")}
                  >
                    Get started →
                  </Text>
                </VStack>
              ) : (
                <>
                  <Text fontSize="3xl" fontWeight="bold">{percent}%</Text>
                  <Text fontSize="sm" color="gray.500">
                    Completed: <Text as="span" fontWeight="semibold" color="gray.800">{completed}</Text>
                  </Text>
                </>
              )}
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ConsultationGauge;
