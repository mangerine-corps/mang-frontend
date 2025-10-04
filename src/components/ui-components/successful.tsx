import { Box, Button, CloseButton, HStack, Text, Image } from "@chakra-ui/react";

const Successful = () => {
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
      

      {/* Image */}
      <Box w="full" h="120px" display="flex" justifyContent="center" alignItems="center" mb={4}>
        <Image
          src="/icons/successful.svg"
          alt="Delete Icon"
          boxSize="40px"
        />
      </Box>

      {/* Title */}
      <Text
        font="outfit"
        fontSize="1.25rem"
        fontWeight="600"
        lineHeight="1.5"
        color="text_primary"
        textAlign="center"
        mb={2}
      >
        Successfully!
      </Text>

      {/* Subtitle */}
      <Text
        font="outfit"
        fontSize="1rem"
        fontWeight="400"
        color="gray.600"
        textAlign="center"
        mb={6}
      >
        You have successfully left the group. You no longer have access to this group’s content.
      </Text>

      {/* Action Buttons */}
      <HStack gap={4} justify="center">
        <Button
          w="160px"
          h="44px"
          borderRadius="8px"
          border="1px solid"
          variant="outline"
        >
          Close
        </Button>
        <Button
          w="160px"
          h="44px"
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

export default Successful;

