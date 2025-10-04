import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

const PaymentSuccessModal = () => {
  return (
    <Box
      w="409px"
      h="796px"
      top="186px"
      left="515px"
      gap="16px"
      p="56px"
      bg="bg_box"
      borderRadius="16px"
      border={2}
    >
    
      <Flex justify="center" mb={8}>
        <Image src="/icons/successful.svg" alt="Success" boxSize="48px" />
      </Flex>

      
      <Text textAlign="center" font="outfit" color="text_primary" fontWeight="600" fontSize="1.5rem" mb={2}>
        Payment Successful!
      </Text>
      <Text textAlign="center" font="outfit" color="gray.500" fontWeight="600" fontSize="1rem" mb={6}>
        Your payment has been successfully made
      </Text>

      
      <VStack align="start" gap={2} mb={6}>
        <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">Payment Receipt</Text>
        <Flex justify="space-between" w="full">
          <Text font="outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">Receipt Number:</Text>
          <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">987654321</Text>
        </Flex>
        <Flex justify="space-between" w="full">
          <Text font="outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">Date of issue:</Text>
          <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">August 25, 2024</Text>
        </Flex>
      </VStack>

      
      <VStack align="start" gap={2} mb={6}>
        <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">Consultation Details</Text>
        <Flex justify="space-between" w="full">
          <Text font="outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">Consultant’s Name:</Text>
          <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">Leslie Alexander</Text>
        </Flex>
        <Flex justify="space-between" w="full">
          <Text font="outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">Client’s Name:</Text>
          <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">Theresa Webb</Text>
        </Flex>
        <Flex justify="space-between" w="full">
          <Text font="outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">Duration:</Text>
          <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">2hrs</Text>
        </Flex>
      </VStack>

      
      <VStack align="start" gap={2} mb={6}>
        <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">Payment Details</Text>
        <Flex justify="space-between" w="full">
          <Text font="outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">Service Description:</Text>
          <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">987654321</Text>
        </Flex>
        <Flex justify="space-between" w="full">
          <Text font="outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">Date of Service:</Text>
          <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">October 24, 2018</Text>
        </Flex>
        <Flex justify="space-between" w="full">
          <Text font="outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">Amount Paid:</Text>
          <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">$150.00</Text>
        </Flex>
        <Flex justify="space-between" w="full">
          <Text font="outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">Payment Method:</Text>
          <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">Credit Card (***1234)</Text>
        </Flex>
        <Flex justify="space-between" w="full">
          <Text font="outfit" color="gray.500" fontWeight="400" fontSize="0.875rem">Transaction ID:</Text>
          <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">TXN123456789</Text>
        </Flex>
      </VStack>

    
      <Flex justify="space-between" mb={6}>
        <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">Total Paid</Text>
        <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1rem">$150.00</Text>
      </Flex>

      
                  <HStack justify="center" gap={4} mt={10}>

          <Button
            variant="outline"
            colorScheme="gray"
            px={4}
            py={2}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Image src="/icons/cancel.svg" alt="Cancel" boxSize="16px" />
            Cancel
          </Button>

        
          <Button
            colorScheme="blue"
            px={4}
            py={2}
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Image src="/icons/download.svg" alt="Download" boxSize="16px" />
            Download
          </Button>
        </HStack>
    </Box>
  );
};

export default PaymentSuccessModal;
