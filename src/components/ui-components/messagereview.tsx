import { Box, Button, HStack, Text, Image, Textarea } from "@chakra-ui/react";

const MessageReview = () => {
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

         {/* Image */}
      <Box w="full" h="120px" display="flex" justifyContent="center" alignItems="center" mb={8}>
        <Image
          src="/images/dp.png"
          alt="consultant image"
          boxSize="80px"
        />
      </Box>
      
           <Box
            w="full"
            h="auto"
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
                fontSize="1.5rem"
                fontWeight="600"
                color="text_primary"
                textAlign="center"
                mb={4}
            >
                How was your experience with Joseph Brenda?
            </Text>

            {/* Image Row */}
            <HStack gap={4}>
                <Image src="/icons/delete.svg" alt="Delete Icon" boxSize="40px" />
                <Image src="/icons/delete.svg" alt="Delete Icon" boxSize="40px" />
                <Image src="/icons/delete.svg" alt="Delete Icon" boxSize="40px" />
                <Image src="/icons/delete.svg" alt="Delete Icon" boxSize="40px" />
            </HStack>
            </Box>

         <Box w="full" maxW="600px" mx="auto" mt={6}>
            <Text
                fontFamily="outfit"
                fontSize="1rem"
                fontWeight="400"
                lineHeight="1.5"
                color="gray.300"
                textAlign="left"
                mb={4}
                
            >
                Write a review
            </Text>

            <Textarea
                placeholder="Leave a comment"
                minH="6rem"
                borderRadius="md"
                borderColor="gray.300"
                //focusBorderColor="primary.500"
                fontFamily="outfit"
                fontSize="1rem"
                color="gray.300"
                p={4}
            />
            </Box>


       {/* Action Buttons */}
      <HStack gap={8} justify="center"mt={4}>
        <Button
          w="238px"
          h="48px"
          borderRadius="8px"
          border="1px solid"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          w="238px"
          h="48px"
          borderRadius="8px"
          bg="blue.900"
          color="white"
          _hover={{ bg: "blue.800" }}
        >
          Submit Review
        </Button>
      </HStack>
    </Box>
  );
};

export default MessageReview;

