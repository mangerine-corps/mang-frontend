import {
  Box,
  Button,
  Text,
  Image,
  HStack,
} from "@chakra-ui/react";

const FollowupSchedule = () => {
  return (
    <Box
       w="500px"
      h="404px"
      p="32px"
      borderRadius="16px"
      bg="bg_box"
      boxShadow="md"
      position="relative"
    >

       <Box w="full" h="120px" display="flex" justifyContent="center" alignItems="center" mb={4}>
        <Image
          src="/icons/successful.svg"
          alt="Delete Icon"
        />
      </Box>
    

      <Text
        font="outfit"
        fontSize="1.5rem"
        fontWeight="500"
        color="text_primary"
        justifyContent="center"
        mb={6}
      >
        Follow-up Scheduled Successfully!
      </Text>

      <Text
      font="outfit"
        fontSize="1rem"
        fontWeight="500"
        color="text_primary"
        mb={8}
        >
            Your follow-up is scheduled for the next 3 days. The client can access your inbox and reply to your follow-up message.
      </Text>

    
   <HStack justifyContent="flex-end">
        <Button
          w="196px"
          h="48px"
          px="80px"
          py="24px"
          gap="10px"
          borderRadius="8px"
          border="1px solid"
          variant="outline"
        >
          Close
        </Button>
        <Button
          w="196px"
          h="48px"
          px="80px"
          py="24px"
          gap="10px"
          borderRadius="8px"
          bg="blue.900"
          color="white"
          _hover={{ bg: "blue.800" }}
        >
          View Inbox
        </Button>
      </HStack>
    </Box>
  );
};

export default FollowupSchedule;
