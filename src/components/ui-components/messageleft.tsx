import { Box, Button, CloseButton, HStack, Text, Image } from "@chakra-ui/react";

const MessageLeft = () => {
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

      {/* Title */}
      <Text
        font="outfit"
        fontSize="1.25rem"
        fontWeight="500"
        lineHeight="1.5"
        color="text_primary"
        textAlign="center"
        mb={8}
      >
        You left the meeting
      </Text>

      {/* Action Buttons */}
      <HStack gap={4} justify="center" mb={8}>
        <Button
          w="160px"
          h="44px"
          borderRadius="8px"
          border="1px solid"
          variant="outline"
        >
          Rejoin
        </Button>
        <Button
          w="160px"
          h="44px"
          borderRadius="8px"
          bg="blue.900"
          color="white"
          _hover={{ bg: "blue.800" }}
        >
          Return to Homepage
        </Button>
      </HStack>

     <Box
  w="full"
  h="auto"
  bg="gray.100"
  borderRadius="md"
  px={4}
  py={6}
  mb={4}
  display="flex"
  flexDirection="column"
  justifyContent="center"
  alignItems="center"
>
  <Text
    fontFamily="outfit"
    fontSize="1rem"
    fontWeight="400"
    color="gray.600"
    textAlign="center"
    mb={4}
  >
    How was the audio and video?
  </Text>

  {/* Image Row */}
  <HStack gap={4}>
    <Image src="/icons/delete.svg" alt="Delete Icon" boxSize="40px" />
    <Image src="/icons/delete.svg" alt="Delete Icon" boxSize="40px" />
    <Image src="/icons/delete.svg" alt="Delete Icon" boxSize="40px" />
    <Image src="/icons/delete.svg" alt="Delete Icon" boxSize="40px" />
  </HStack>
</Box>
    </Box>
  );
};

export default MessageLeft;

