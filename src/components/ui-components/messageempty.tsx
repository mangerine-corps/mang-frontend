import { Box, Button, HStack, Text, Image, VStack } from "@chakra-ui/react";


type prop ={
  onClick:any
}

const MessageEmpty = ({onClick}:prop) => {
  return (
    <VStack
      h="full"
      borderRadius="16"
      bg="bg_box"
      w="full"
      boxShadow="md"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {/* Image */}
      <Box
        w="full"
        h="120px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={4}
      >
        <Image src="/icons/messageicon.svg" alt="chat Icon"  />
      </Box>

      {/* Title */}
      <Text
        font="outfit"
        fontSize={{base:"1.2rem",md:"1.5rem",lg:"2.5rem"}}
        fontWeight="600"
        lineHeight="1.5"
        color="text_primary"
        textAlign="center"
        mb={2}
      >
        Welcome to your Messages!
      </Text>

      {/* Subtitle */}
      <Text
        font="outfit"
        fontSize={{base:"0.875rem",md:"1rem",lg:"1.2rem"}}
        fontWeight="400"
        color="gray.600"
        textAlign="center"
        w="50%"
        mx="auto"
        mb={6}
      >
        {`Here you can start new conversations, manage your messages, and stay
        connected. Tap the 'New Message' button to begin.`}
      </Text>

      {/* Action Buttons */}
      <HStack gap={4} justify="center" w="50%" mx="auto">
        <Button
   w="full"
          borderRadius="6px"
          p="10px"
          gap="8px"
          bg="blue.900"
          color="white"
          onClick={onClick}
          _hover={{ bg: "blue.800" }}
        >
          New message
        </Button>
      </HStack>
    </VStack>
  );
};

export default MessageEmpty;

