import { Box, Button, HStack, Text, Image } from "@chakra-ui/react";

const MessageSession = () => {
  return (
     <Box
      w="700px"
      h="600px"
      top="212px"
      left="370px"
      p="32px"
      borderRadius="16px"
      bg="bg_box"
      boxShadow="md"
      position="relative"
    >
      
      {/* Title */}
      <HStack justify="center" align="center" mb={8} gap={2}>
            <Image
                src="/icons/clock.svg"
                alt="Clock Icon"
                boxSize="20px"
            />
            <Text
                fontFamily="outfit"
                fontSize="1.25rem"
                fontWeight="600"
                lineHeight="1.5"
                color="text_primary"
                textAlign="center"
            >
                Your consultation session has ended.
            </Text>
            </HStack>

      {/* Image */}
      <Box w="full" h="120px" display="flex" justifyContent="center" alignItems="center" mb={8}>
        <Image
          src="/images/dp.png"
          alt="consultant image"
          boxSize="80px"
        />
      </Box>

      

      {/* Subtitle */}
      <Text
        font="outfit"
        fontSize="1.2rem"
        fontWeight="400"
        color="gray.600"
        textAlign="center"
        mb={8}
      >
        We hope your session was helpful! Please take a moment to rate your experience with <b>Joseph Brenda.</b>
      </Text>

       {/* Action Buttons */}
      <HStack gap={8} justify="center"mt={40}>
        <Button
          w="238px"
          h="48px"
          borderRadius="8px"
          border="1px solid"
          variant="outline"
        >
          Rate Later
        </Button>
        <Button
          w="238px"
          h="48px"
          borderRadius="8px"
          bg="blue.900"
          color="white"
          _hover={{ bg: "blue.800" }}
        >
          Rate Now
        </Button>
      </HStack>
    </Box>
  );
};

export default MessageSession;

