import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartOptions,
  ChartData,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { Box, Heading, Text } from "@chakra-ui/react";

// Register components and plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  ChartDataLabels
);

const ReviewChart: React.FC = () => {
  const reviewLevels = ["1", "2", "3", "4", "5"]; // Y-axis labels
  const reviewCounts = [20, 15, 10, 5, 3]; // X-axis values
  const barColors = [
    "#E53E3E", // red (level 1)
    "#DD6B20", // orange (level 2)
    "#ECC94B", // yellow (level 3)
    "#38A169", // green (level 4)
    "#3182CE", // blue (level 5)
  ];
  const data: ChartData<"bar", number[], string> = {
    labels: reviewLevels,
    datasets: [
      {
        label: "Customer Count",
        data: reviewCounts,
        backgroundColor: barColors, // Chakra blue
        borderRadius: 50,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        anchor: "end",
        align: "right",
        formatter: (value: number) => `${value}`,
        color: "#2D3748", // dark gray text
        font: {
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        beginAtZero: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false, // hide x-axis tick labels
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <Box w="100%" mx="auto" p={2} boxShadow="sm" borderRadius="md">
      <Text fontSize={{base:"1rem",md:"1.2rem",lg:"1.5rem"}} color={"text_primary"} fontWeight={"600"} my={2}>
        Overview
      </Text>
      <Box w="85%">
        <Bar data={data} options={options} />
      </Box>
    </Box>
  );
};

export default ReviewChart;
