import {
  Box,
  Text,
  HStack,
  Image,
  Textarea,
} from "@chakra-ui/react";

const YourNote = () => {
  return (
    <Box
      w="full"
      h="full"
      p="24px"
      bg="bg_box"
      borderRadius="16px"
      borderWidth={2}
      position="relative"
    >
    
      <HStack justify="space-between" align="center" mb={4}>
        <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1.5rem">
          Your Note
        </Text>
        <HStack gap={2}>
          <Image src="/icons/save.svg" alt="Close" boxSize="24px" cursor="pointer" />
          <Image src="/icons/delete1.svg" alt="Delete" boxSize="24px" cursor="pointer" />
        </HStack>
      </HStack>

      
      <Textarea

        placeholder="Feel free to note anything important here"
        fontSize="sm"
        bg="bg_box"
        w="302px"
        h="100px"
        borderRadius="6px"
        border="1px solid"
        _focus={{ borderColor: "blue.300", boxShadow: "none" }}
      />
    </Box>
  );
};

export default YourNote;