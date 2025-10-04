import {
  Box,
  Text,
} from "@chakra-ui/react";

const ConsultantNote = () => {
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
        {`Consultant's Note`}
      </Text>
      <Text textAlign="start" font="outfit" color="text_primary" fontWeight="400" fontSize="1rem" mb={6}>
       {` Focus on user feedback for new features—it’s essential for refining and guiding the next development phase. 
        Personalize experiences and use insights to enhance engagement and make informed improvements.`}
      </Text>

    </Box>
     );
};

export default ConsultantNote;