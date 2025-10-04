import React, { useState } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
);

// Generate fake earnings data
const generateEarnings = (length: number) =>
  Array.from({ length }, () => Math.floor(Math.random() * 5000 + 1000));

// Generate day labels for the full year (e.g., "Jan 1", ..., "Dec 31")
const generateLabels = () => {
  const labels: string[] = [];
  const start = new Date(new Date().getFullYear(), 0, 1);
  for (let i = 0; i < 365; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    labels.push(`${date.toLocaleString("default", { month: "short" })} ${date.getDate()}`);
  }
  return labels;
};

const fullYearLabels = generateLabels();
const fullYearData = generateEarnings(365);

const getFilteredData = (period: string) => {
  switch (period) {
    case "Day":
      return {
        labels: fullYearLabels.slice(-1),
        data: fullYearData.slice(-1),
      };
    case "Week":
      return {
        labels: fullYearLabels.slice(-7),
        data: fullYearData.slice(-7),
      };
    case "Month":
      return {
        labels: fullYearLabels.slice(-30),
        data: fullYearData.slice(-30),
      };
    default:
      return {
        labels: fullYearLabels,
        data: fullYearData,
      };
  }
};

const EarningDashboard: React.FC = () => {
  const [period, setPeriod] = useState("Month");

  const { labels, data } = getFilteredData(period);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Earnings",
        data,
        borderColor: "#3182CE",
        backgroundColor: "rgba(49, 130, 206, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        min: 1000,
        max: 6000,
        ticks: {
          callback: (value: number) => `$${value}`,
          color: "#4A5568",
        },
        grid: {
          color: "#EDF2F7",
        },
      },
      x: {
        ticks: {
          maxTicksLimit: 12,
          color: "#4A5568",
        },
        grid: {
          color: "#F7FAFC",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) => `$${ctx.parsed.y}`,
        },
      },
    },
  };

  return (
    <Box
          w="full"
          my="3"
          // maxW="600px"
          mx="auto"
          bg="bg_box"
          borderRadius="xl"
          boxShadow="lg"
          p={6}
        >
      <VStack align="flex-start" gap={4}>
        <Text fontSize="lg" fontWeight="bold" color="gray.700">
          Earnings Overview
        </Text>

        <HStack gap={2}>
          {["Day", "Week", "Month", "Year"].map((p) => (
            <Button
              key={p}
              size="sm"
              variant={period === p ? "solid" : "ghost"}
              colorScheme="blue"
              onClick={() => setPeriod(p)}
            >
              {p}
            </Button>
          ))}
        </HStack>

        <Box w="full" h="400px">
          <Line data={chartData} options={options} />
        </Box>
      </VStack>
    </Box>
  );
};

export default EarningDashboard;
