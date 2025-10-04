import { Box, Flex, Text, HStack, Button, Image } from "@chakra-ui/react";
import { useState } from "react";
import CancelConsultation from "./modals/cancelconsultationmodal";
import AreyouCancellingModal from "./modals/areyoucancelling";
import RescheduleConsultation from "./modals/rescheduleconsultation";

const ScheduledConsultation = () => {
  const activities = [
    {
      name: "Jacob Jones",
      role: "Crane Operator",
      image: "/person.png",
      date: "July 5, 2024",
      time: "5:20PM - 5:50PM",
    },
    {
      name: "Cody Fisher",
      role: "Pile Driver",
      image: "/person.png",
      date: "July 5, 2024",
      time: "5:20PM - 5:50PM",
    },
  ];
  const [schedule, setSchedule]= useState<boolean>(false)
    const [reschedule, setReschedule] = useState<boolean>(false);

  return (
    <Box
      flex="flex-end"
        w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
      maxW={{ base: "full", md: "340px" ,lg:"400px" }} // don’t stretch too wide on large screens
      mx="auto"
      display={{ base: "none", md: "flex", lg: "flex" }}

      p={6}
      bg="bg_box"
      borderRadius="lg"
      boxShadow="sm"
      flexDirection="column"
    >
      {/* Title */}
      <Text fontSize="xl" fontWeight="bold" mb={4} color="text_primary">
        Scheduled Consultation
      </Text>

      {/* Activity Cards */}
      {activities.map((item, idx) => (
        <Box key={idx} bg="bg_box" borderRadius="lg" mb={2}>
          <Flex justify="space-between" align="center">
            <HStack>
              <Image src={item.image} alt="profile-img" />
              <Box>
                <Text fontWeight="bold" color="text_primary">
                  {item.name}
                </Text>
                <Text fontSize="sm" color="grey.500">
                  {item.role}
                </Text>
              </Box>
            </HStack>

            <HStack>
              <Box
                p={2}
                bg="gray.100"
                borderRadius="md"
                _hover={{ bg: "gray.200", cursor: "pointer" }}
              >
                <Image src="/icons/greyMail.svg" alt="mail-icon" />
              </Box>
              <Box
                p={2}
                bg="gray.100"
                borderRadius="md"
                _hover={{ bg: "gray.200", cursor: "pointer" }}
              >
                <Image src="/icons/greyCamera.svg" alt="camera" />
              </Box>
            </HStack>
          </Flex>

          {/* Date & Time */}
          <Flex
            align="center"
            justify="space-between"
            bg="time_boxcon"
            p={2}
            borderRadius="md"
            mt={4}
          >
            <HStack color="text_primary" fontSize="sm">
              <Image src="/icons/cal.svg" alt="calendar" />
              <Text color="text_primary" fontSize="0.875rem">
                {item.date}
              </Text>
            </HStack>
            <HStack ml="2" color="text_primary" fontSize="sm">
              <Image alt="clock" src="/icons/clock.svg" />
              <Text color="text_primary" fontSize="0.875rem">
                {item.time}
              </Text>
            </HStack>
          </Flex>

          {/* Buttons */}
          <Flex mt={4} gap={3}>
            <Button
              variant="outline"
              colorScheme="gray"
              borderColor="gray.300"
              color="button_bg"
              flex={1}
              borderRadius={8}
              onClick={() => {
                setSchedule(true);
              }}
            >
              Cancel
            </Button>
            <Button
              bg="bt_schedule"
              color="white"
              flex={1}
              onClick={() => {
                setReschedule(true);
              }}
              borderRadius={8}
              _hover={{ bg: "bt_schedule_hover" }}
            >
              Reschedule
            </Button>
          </Flex>
        </Box>
      ))}
      <AreyouCancellingModal
        isOpen={schedule}
        onOpenChange={() => {
          setSchedule(false);
        }}
      />
      <RescheduleConsultation
        isOpen={reschedule}
        onOpenChange={() => {
          setReschedule(false);
        }}
      />
    </Box>
  );
};

export default ScheduledConsultation;
