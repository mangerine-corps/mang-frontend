import React from "react";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Tooltip, ChartOptions, ChartData,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { Box, HStack, Spinner, Text } from "@chakra-ui/react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useGetRatingBreakdownQuery } from "mangarine/state/services/ratings.service";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, ChartDataLabels);

const barColors = ["#E53E3E", "#DD6B20", "#ECC94B", "#38A169", "#3182CE"];

const ReviewChart: React.FC = () => {
  const { user } = useAuth();
  const consultantId = user?.consultantProfile?.id ?? user?.id ?? "";

  const { data, isLoading } = useGetRatingBreakdownQuery({ consultantId }, { skip: !consultantId });

  const breakdown = data?.data ?? data ?? null;

  const reviewCounts = breakdown
    ? [1, 2, 3, 4, 5].map((star) => breakdown[String(star)] ?? 0)
    : [0, 0, 0, 0, 0];

  const chartData: ChartData<"bar", number[], string> = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [{
      label: "Customer Count",
      data: reviewCounts,
      backgroundColor: barColors,
      borderRadius: 50,
    }],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: "end",
        align: "right",
        formatter: (value: number) => `${value}`,
        color: "#2D3748",
        font: { weight: "bold" },
      },
    },
    scales: {
      x: { beginAtZero: true, grid: { display: false }, ticks: { display: false } },
      y: { grid: { display: false }, ticks: { font: { size: 14 } } },
    },
  };

  return (
    <Box w="100%" mx="auto" p={2} boxShadow="sm" borderRadius="md">
      <Text fontSize={{ base: "1rem", md: "1.2rem", lg: "1.5rem" }} color="text_primary" fontWeight="600" my={2}>
        Overview
      </Text>
      {isLoading ? (
        <HStack justify="center" py={8}><Spinner /></HStack>
      ) : (
        <Box w="85%">
          <Bar data={chartData} options={options} />
        </Box>
      )}
    </Box>
  );
};

export default ReviewChart;
