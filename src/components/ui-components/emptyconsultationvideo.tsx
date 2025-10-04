import { Box, Button, Text } from "@chakra-ui/react";

const EmptyConsultationVideo = ({ onUnlock }) => {
  return (
    <Box
      w="full"
      h="full"
      p={{ base: 6, md: 10, lg: 20 }}
      gap={{ base: 6, md: 10 }}
      bg="bg_box"
      borderRadius="16px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
    >
      <Text
        font="outfit"
        color="text_primary"
        fontWeight="600"
        fontSize={{ base: "1rem", md: "1.25rem", lg: "1.5rem" }}
        mb={{ base: 4, md: 6 }}
      >
        You have recorded consultation sessions available. Purchase access to view your videos.
      </Text>

      <Button
        w={{ base: "100%", md: "360px", lg: "501px" }}
        h="48px"
        colorScheme="bg_button"
        p="10px"
        display="flex"
        alignItems="center"
        gap="8px"
        onClick={onUnlock}
      >
        Unlock Videos
      </Button>
    </Box>
  );
};

export default EmptyConsultationVideo;
