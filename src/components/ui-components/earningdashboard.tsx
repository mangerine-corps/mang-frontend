import React, { useState } from "react";
import { Box, Button, HStack, Image, Spinner, Text, VStack } from "@chakra-ui/react";
import {
  Chart as ChartJS, LineElement, CategoryScale,
  LinearScale, PointElement, Tooltip, Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useGetDashboardEarningsQuery } from "mangarine/state/services/dashboard.service";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler);

type Period = "day" | "week" | "month" | "year";

const EarningDashboard: React.FC = () => {
  const [period, setPeriod] = useState<Period>("month");

  const { data, isLoading } = useGetDashboardEarningsQuery({ period });

  const labels: string[] = data?.data?.labels ?? data?.labels ?? [];
  const earnings: number[] = data?.data?.data   ?? data?.data   ?? [];
  const hasData = earnings.some((v) => v > 0);

  const chartData = {
    labels,
    datasets: [{
      label: "Earnings",
      data: earnings,
      borderColor: "#3182CE",
      backgroundColor: "rgba(49, 130, 206, 0.2)",
      fill: true,
      tension: 0.4,
      pointRadius: 2,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        ticks: { callback: (value: number) => `$${value}`, color: "#4A5568" },
        grid: { color: "#EDF2F7" },
      },
      x: {
        ticks: { maxTicksLimit: 12, color: "#4A5568" },
        grid: { color: "#F7FAFC" },
      },
    },
    plugins: {
      tooltip: { callbacks: { label: (ctx: any) => `$${ctx.parsed.y}` } },
    },
  };

  return (
    <Box w="full" my="3" mx="auto" bg="bg_box" borderRadius="xl" boxShadow="lg" p={{ base: 4, md: 6 }}>
      <VStack align="flex-start" gap={4}>
        <Text fontSize="lg" fontWeight="bold" color="gray.700">Earnings Overview</Text>

        <HStack gap={2} w="full" px={{ base: 0, md: 0 }} flexWrap="wrap">
          {(["day", "week", "month", "year"] as Period[]).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? "solid" : "ghost"}
              bg={period === p ? "#0B1441" : "transparent"}
              color={period === p ? "white" : "gray.600"}
              _hover={{ bg: period === p ? "#0B1441" : "gray.100" }}
              onClick={() => setPeriod(p)}
              textTransform="capitalize"
              px={4}
              borderRadius="md"
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Button>
          ))}
        </HStack>

        <Box w="full" h="400px" position="relative">
          {isLoading ? (
            <HStack justify="center" align="center" h="full"><Spinner /></HStack>
          ) : (
            <>
              <Line data={chartData} options={options} />
              {!hasData && (
                <Box
                  position="absolute" top="0" left="0" right="0" bottom="0"
                  display="flex" flexDir="column" alignItems="center" justifyContent="center"
                  bg="rgba(255,255,255,0.85)" _dark={{ bg: "rgba(21,20,20,0.85)" }} borderRadius="md"
                >
                  <Image src="/icons/money.svg" alt="no earnings" boxSize="32px" mb={2} opacity={0.4} />
                  <Text fontWeight="600" color="gray.700" _dark={{ color: "gray.300" }} fontSize="md">No earnings yet</Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center" maxW="260px" mt={1}>
                    Complete your first consultation to start tracking your income here.
                  </Text>
                </Box>
              )}
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default EarningDashboard;
