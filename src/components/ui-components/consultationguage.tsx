import {
  Box,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
// import { motion } from "framer-motion";

const ConsultationGauge = () => {
  const scheduled = 100;
  const completed = 72;
  const remaining = scheduled - completed;
  const percent = Math.round((completed / scheduled) * 100);

  const radius = 90;
  const circumference = Math.PI * radius;
  const progress = (percent / 100) * circumference;

  return (
    <Box
      bg="bg_box"
      borderRadius="xl"
      boxShadow="md"
      p={6}
      w="full"
      // maxW="500px"
      mx="auto"
    >
      {/* Top Summary */}
      <Flex justify="space-between" mb={4}>
        <VStack gap={0} align="flex-start">
          <Text fontSize="sm" color="gray.400">
            Scheduled Consultation
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            {scheduled}
          </Text>
        </VStack>
        <VStack gap={0} align="flex-end">
          <Text fontSize="sm" color="red.400">
            Consultations Left
          </Text>
          <Text color="text_primary" fontWeight="bold" fontSize="lg">
            {remaining}
          </Text>
        </VStack>
      </Flex>

      {/* Gauge */}
      <Box mt={4} position="relative" height="150px">
        <svg width="100%" height="100%" viewBox="0 0 200 100">
          {/* Track Arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="#CBD5E0"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Filled Arc */}
          {/* <motion.path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="#0B1441"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
          /> */}

          {/* Dot Indicator */}
          <circle
            r="10"
            fill="#0B1441"
            stroke="#CBD5E0"
            strokeWidth="3"
            cx={100 + radius * Math.cos(Math.PI * (1 - percent / 100))}
            cy={100 - radius * Math.sin(Math.PI * (1 - percent / 100))}
          />
        </svg>

        {/* Center Text */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          position="absolute"
          top="45%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Text fontSize="3xl" fontWeight="bold">
            {percent}%
          </Text>
          <Text fontSize="sm" color="gray.500">
            Completed:{" "}
            <Text as="span" fontWeight="semibold" color="gray.800">
              {completed}
            </Text>
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default ConsultationGauge;
