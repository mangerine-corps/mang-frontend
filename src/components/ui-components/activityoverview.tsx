import { Box, Flex, Grid, GridItem, HStack, Image, Spinner, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGetDashboardStatsQuery } from "mangarine/state/services/dashboard.service";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n ?? 0);

const ActivityOverview = () => {
  const router = useRouter();
  const { data, isLoading } = useGetDashboardStatsQuery();

  const stats = data?.data ?? data ?? null;

  const totalEarnings      = stats?.totalEarnings      ?? 0;
  const successRate        = stats?.successRate        ?? 0;
  const cancellations      = stats?.cancellations      ?? { count: 0, loss: 0 };
  const returningClientRate = stats?.returningClientRate ?? 0;

  const isEmpty = !isLoading && !stats;
  const hasData = !isEmpty && (totalEarnings > 0 || successRate > 0 || cancellations.count > 0 || returningClientRate > 0);

  const overviewData = [
    { title: "Total Earnings",          value: formatCurrency(totalEarnings),                          icon: "/icons/money.svg",   bg: "green.50" },
    { title: "Success Rate",            value: `${successRate}%`,                                       icon: "/icons/check.svg",   bg: "purple.50" },
    { title: "Cancellation",            value: cancellations.count > 0 ? `${cancellations.count} ($${cancellations.loss} loss)` : "0", icon: "/icons/warning.svg", bg: "yellow.50" },
    { title: "Returning Client's Rate", value: `${returningClientRate}%`,                               icon: "/icons/user.svg",    bg: "gray.50" },
  ];

  return (
    <Box w="full" mt={{ base: "4", md: "4", lg: "0", xl: "0" }} mx="auto" bg="bg_box" borderRadius="xl" boxShadow="lg" p={6}>
      <Text font="outfit" fontSize="1.5rem" fontWeight="600" color="text_primary" mb={4}>
        Activity Overview
      </Text>

      {isLoading ? (
        <HStack justify="center" py={8}><Spinner /></HStack>
      ) : (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          {overviewData.map((item, index) => (
            <GridItem key={index} p={4} borderRadius="md" border="1px solid" borderColor="gray.100">
              <HStack justify="space-between">
                <VStack align="start" gap={1}>
                  <Text fontSize="sm" color="gray.500">{item.title}</Text>
                  <Text fontWeight="bold" color={!hasData ? "gray.300" : "text_primary"} fontSize="lg">
                    {item.value}
                  </Text>
                </VStack>
                <Box bg={item.bg} p={2} borderRadius="md">
                  <Image src={item.icon} alt={item.title} opacity={!hasData ? 0.4 : 1} />
                </Box>
              </HStack>
            </GridItem>
          ))}
        </Grid>
      )}

      {!isLoading && !hasData && (
        <Box mt={5} p={4} borderRadius="lg" bg="blue.50" borderWidth="1px" borderColor="blue.100">
          <Flex align="center" gap={2} mb={1}>
            <Image src="/icons/emptyImg.svg" alt="no data" boxSize="18px" opacity={0.6} />
            <Text fontSize="sm" color="blue.700" fontWeight="500">
              Your stats will appear here once you start receiving bookings.
            </Text>
          </Flex>
          <Text
            fontSize="sm" color="blue.500" fontWeight="600" cursor="pointer" textDecoration="underline"
            onClick={() => router.push("/my-business/dashboard?tab=meetings")}
          >
            Set up your availability to get started →
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default ActivityOverview;
