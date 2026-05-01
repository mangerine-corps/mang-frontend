import { Box, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FaCalendar } from "react-icons/fa6";
import AppointmentTable from "../appointmenttable";

const statusOptions = ["Pending", "Ongoing", "Completed", "Cancelled", "Rescheduled"];

const ConsultationHistory = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [nameSearch, setNameSearch] = useState("");

  return (
    <Box w="100%" mx="auto" boxShadow="md" borderRadius="md">
      {/* ── Filter bar ── */}
      <HStack
        w="full"
        bg="bg_box"
        mb={4}
        p={4}
        rounded="lg"
        gap={4}
        flexWrap="wrap"
        alignItems="flex-end"
      >
        {/* From */}
        <VStack alignItems="flex-start" flex={1} minW="140px" gap={1}>
          <Text fontSize="0.8rem" color="gray.500" fontWeight="400">From</Text>
          <HStack
            w="full"
            borderWidth="1.5px"
            rounded="lg"
            py="2.5"
            px="3"
            borderColor="gray.200"
            bg="main_background"
            justify="space-between"
          >
            <Input
              type="date"
              border="none"
              focusRing="none"
              outline="none"
              p={0}
              h="auto"
              fontSize="0.875rem"
              color="text_primary"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <FaCalendar color="#9CA3AF" size={14} />
          </HStack>
        </VStack>

        {/* To */}
        <VStack alignItems="flex-start" flex={1} minW="140px" gap={1}>
          <Text fontSize="0.8rem" color="gray.500" fontWeight="400">To</Text>
          <HStack
            w="full"
            borderWidth="1.5px"
            rounded="lg"
            py="2.5"
            px="3"
            borderColor="gray.200"
            bg="main_background"
            justify="space-between"
          >
            <Input
              type="date"
              border="none"
              focusRing="none"
              outline="none"
              p={0}
              h="auto"
              fontSize="0.875rem"
              color="text_primary"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <FaCalendar color="#9CA3AF" size={14} />
          </HStack>
        </VStack>

        {/* Status */}
        <VStack alignItems="flex-start" flex={1} minW="140px" gap={1}>
          <Text fontSize="0.8rem" color="gray.500" fontWeight="400">Status</Text>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              width: "100%",
              border: "1.5px solid #E5E7EB",
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "0.875rem",
              background: "transparent",
              outline: "none",
              cursor: "pointer",
              appearance: "none",
            }}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </VStack>

        {/* Name */}
        <VStack alignItems="flex-start" flex={1} minW="140px" gap={1}>
          <Text fontSize="0.8rem" color="gray.500" fontWeight="400">Name</Text>
          <Input
            borderWidth="1.5px"
            rounded="lg"
            py="2.5"
            px="3"
            borderColor="gray.200"
            bg="main_background"
            fontSize="0.875rem"
            placeholder="Search by name"
            focusRing="none"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </VStack>
      </HStack>

      {/* ── Table ── */}
      <AppointmentTable filters={{ fromDate, toDate, status, nameSearch }} />
    </Box>
  );
};

export default ConsultationHistory;
