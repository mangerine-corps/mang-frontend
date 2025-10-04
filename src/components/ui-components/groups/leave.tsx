import { Box, Button, CloseButton, HStack, Text, Image } from "@chakra-ui/react";

const Leave = () => {
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
        fontWeight="600"
        lineHeight="1.5"
        color="text_primary"
        textAlign="center"
        mb={4}
        mt={2}
      >
        Are you sure you want to leave Virtual Assistant Network?
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
        Once you leave, you won’t be able to participate in discussions, view posts, or receive updates from this group.
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
          No, Cancel
        </Button>
        <Button
          w="160px"
          h="44px"
          borderRadius="8px"
          bg="blue.900"
          color="white"
          _hover={{ bg: "blue.800" }}
        >
          Yes, Leave
        </Button>
      </HStack>
    </Box>
  );
};

export default Leave;
