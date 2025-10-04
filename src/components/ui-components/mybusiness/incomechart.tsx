import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, Heading, HStack, Text } from "@chakra-ui/react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type IncomeDataset = {
  label: string;
  data: number[]; // length should match labels length
  backgroundColor: string;
  stack?: string;
};

type IncomeChartProps = {
  labels?: string[];
  datasets?: IncomeDataset[];
  totalEarned?: number;
  year?: number;
};

const IncomeChart: React.FC<IncomeChartProps> = ({ labels, datasets, totalEarned = 0, year = new Date().getFullYear() }) => {
  const months = labels ?? [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const defaultDatasets: IncomeDataset[] = [
    { label: 'Earned', data: Array(months.length).fill(0), backgroundColor: 'active_chat', stack: 'income' },
    { label: 'Missed', data: Array(months.length).fill(0), backgroundColor: '#808080', stack: 'income' },
    { label: 'Upcoming', data: Array(months.length).fill(0), backgroundColor: 'grey.300', stack: 'income' },
  ];

  const chartData: ChartData<"bar", number[], string> = {
    labels: months,
    datasets: (datasets && datasets.length ? datasets : defaultDatasets) as any,
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        min: 1000,
        max: 5000,
        ticks: {
          callback: (value: number | string) => `$${value}`,
        },
      },
    },
  };

  return (
    <Box w="100%" mx="auto" p={4} boxShadow="md" borderRadius="md">
      <Heading size="md" mb={4}>
        <HStack
          w="full"
          py="6"
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <HStack>
            <Text
              color="text_primary"
              fontSize="1.5rem"
              fontWeight="600"
              lineHeight={"36px"}
            >
              {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(totalEarned || 0)}
            </Text>
            <Text
              color="grey.500"
              fontSize="0.875rem"
              fontWeight="400"
              lineHeight={"36px"}
            >
              earned in {year}
            </Text>
          </HStack>{" "}
          <Text
            color="text_primary"
            fontSize="1rem"
            fontWeight="600"
            lineHeight={"36px"}
          >
            View
          </Text>
        </HStack>
      </Heading>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

export default IncomeChart;
