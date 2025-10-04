import {
  Box,
  Text,
} from "@chakra-ui/react";

const SessionRecap = () => {
  return (
    <Box
      w="full"
      h="full"
      gap="16px"
      p="24px"
      bg="bg_box"
      borderRadius="16px"
       borderWidth={2}
      position="relative"
    >
        <Text textAlign="start" font="outfit" color="text_primary" fontWeight="600" fontSize="1.5rem" mb={2}>
        Session Recap
      </Text>
      <Text textAlign="start" font="outfit" color="text_primary" fontWeight="400" fontSize="1rem" mb={6}>
       {` Today’s consultation focused on boosting user engagement through personalized content and targeted outreach.
         We discussed implementing strategies like A/B testing and user feedback integration to enhance your product's user experience.`}
      </Text>

    </Box>
     );
};

export default SessionRecap;