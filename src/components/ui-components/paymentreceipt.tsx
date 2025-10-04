"use client";

import {
  Box,
  Button,
  CloseButton,
  Flex,
  Portal,
  Text,
  Dialog,
  Image,
  VStack,
  HStack,
} from "@chakra-ui/react";

const paymentsuccess = "/icons/payment.svg";

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  data:any
}

const PaymentSuccessIcon = () => (
  <Box position="absolute" top="-40px" left="50%" transform="translateX(-50%)">
    <Image
      src={paymentsuccess}
      // boxSize="90px"
      alt="Payment Successful"
    />
  </Box>
);


const PaymentModal = ({ isOpen, onOpenChange , data}: PaymentModalProps) => {
  console.log(data, "data")
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => !open && onOpenChange()}
      placement={"center"}
      size={"xs"}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            // display="flex"
            // flexDirection="column"
            alignItems="center"
            p="26px"
            borderRadius="16px"
            // bg="white"
            // position="relative"
            // overflow="visible"
            // maxW="400px"
            w="full"
          >
            <Dialog.CloseTrigger asChild>
              <CloseButton
              onClick={onOpenChange}
                position="absolute"
                top="16px"
                right="16px"
                size="sm"
              />
            </Dialog.CloseTrigger>

            {/* <PaymentSuccessIcon /> */}

            <Dialog.Body mt="10px" textAlign="center" w="full">

              <Box bg="bg_box" borderRadius="16px" border={2}>
                <Flex justify="center" mb={8}>
                  <Image
                    src="/icons/successful.svg"
                    alt="Success"
                    boxSize="48px"
                  />
                </Flex>

                <Text
                  textAlign="center"
                  font="outfit"
                  color="text_primary"
                  fontWeight="600"
                  fontSize="1.5rem"
                  mb={2}
                >
                  Payment Successful!
                </Text>
                <Text
                  textAlign="center"
                  font="outfit"
                  color="gray.500"
                  fontWeight="600"
                  fontSize="1rem"
                  mb={6}
                >
                  Your payment has been successfully made
                </Text>

                <VStack align="start" gap={2} mb={6}>
                  <Text
                    font="outfit"
                    color="text_primary"
                    fontWeight="600"
                    fontSize="1rem"
                  >
                    Payment Receipt
                  </Text>
                  <Flex justify="space-between" w="full">
                    <Text
                      font="outfit"
                      color="gray.500"
                      fontWeight="400"
                      fontSize="0.875rem"
                    >
                      Receipt Number:
                    </Text>
                    <Text
                      font="outfit"
                      color="text_primary"
                      fontWeight="600"
                      fontSize="1rem"
                    >
                      987654321
                    </Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text
                      font="outfit"
                      color="gray.500"
                      fontWeight="400"
                      fontSize="0.875rem"
                    >
                      Date of issue:
                    </Text>
                    <Text
                      font="outfit"
                      color="text_primary"
                      fontWeight="600"
                      fontSize="1rem"
                    >
                      {new Date(data?.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Text>
                  </Flex>
                </VStack>

                <VStack align="start" gap={2} mb={6}>
                  <Text
                    font="outfit"
                    color="text_primary"
                    fontWeight="600"
                    fontSize="1rem"
                  >
                    Consultation Details
                  </Text>
                  <Flex justify="space-between" w="full">
                    <Text
                      font="outfit"
                      color="gray.500"
                      fontWeight="400"
                      fontSize="0.875rem"
                    >
                      Consultant’s Name:
                    </Text>
                    <Text
                      font="outfit"
                      color="text_primary"
                      fontWeight="600"
                      fontSize="1rem"
                    >
                      Leslie Alexander
                    </Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text
                      font="outfit"
                      color="gray.500"
                      fontWeight="400"
                      fontSize="0.875rem"
                    >
                      Client’s Name:
                    </Text>
                    <Text
                      font="outfit"
                      color="text_primary"
                      fontWeight="600"
                      fontSize="1rem"
                    >
                      {data?.topic}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text
                      font="outfit"
                      color="gray.500"
                      fontWeight="400"
                      fontSize="0.875rem"
                    >
                      Duration:
                    </Text>
                    <Text
                      font="outfit"
                      color="text_primary"
                      fontWeight="600"
                      fontSize="1rem"
                    >
                      2hrs
                    </Text>
                  </Flex>
                </VStack>

                <VStack align="start" gap={2} mb={6}>
                  <Text
                    font="outfit"
                    color="text_primary"
                    fontWeight="600"
                    fontSize="1rem"
                  >
                    Payment Details
                  </Text>
                  <Flex justify="space-between" w="full">
                    <Text
                      font="outfit"
                      color="gray.500"
                      fontWeight="400"
                      fontSize="0.875rem"
                    >
                      Service Description:
                    </Text>
                    <Text
                      font="outfit"
                      color="text_primary"
                      fontWeight="600"
                      fontSize="1rem"
                    >
                      987654321
                    </Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text
                      font="outfit"
                      color="gray.500"
                      fontWeight="400"
                      fontSize="0.875rem"
                    >
                      Date of Service:
                    </Text>
                    <Text
                      font="outfit"
                      color="text_primary"
                      fontWeight="600"
                      fontSize="1rem"
                    >
                      {new Date(data?.date).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text
                      font="outfit"
                      color="gray.500"
                      fontWeight="400"
                      fontSize="0.875rem"
                    >
                      Amount Paid:
                    </Text>
                    <Text
                      font="outfit"
                      color="text_primary"
                      fontWeight="600"
                      fontSize="1rem"
                    >
                      $150.00
                    </Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text
                      font="outfit"
                      color="gray.500"
                      fontWeight="400"
                      fontSize="0.875rem"
                    >
                      Payment Method:
                    </Text>
                    <Text
                      font="outfit"
                      color="text_primary"
                      fontWeight="600"
                      fontSize="1rem"
                    >
                      Credit Card (***1234)
                    </Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text
                      font="outfit"
                      color="gray.500"
                      fontWeight="400"
                      fontSize="0.875rem"
                    >
                      Transaction ID:
                    </Text>
                    <Text
                      font="outfit"
                      color="text_primary"
                      fontWeight="600"
                      fontSize="1rem"
                    >
                      TXN123456789
                    </Text>
                  </Flex>
                </VStack>

                <Flex justify="space-between" mb={6}>
                  <Text
                    font="outfit"
                    color="text_primary"
                    fontWeight="600"
                    fontSize="1rem"
                  >
                    Total Paid
                  </Text>
                  <Text
                    font="outfit"
                    color="text_primary"
                    fontWeight="600"
                    fontSize="1rem"
                  >
                    ${data.amount}
                  </Text>
                </Flex>

                <HStack justify="center" gap={4} mt={10}>
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    px={4}
                    py={2}
                    onClick={onOpenChange}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Image
                      src="/icons/cancel.svg"
                      alt="Cancel"
                      boxSize="16px"
                    />
                    Cancel
                  </Button>

                  <Button
                    bg="bg_button"
                    // colorScheme="blue"
                    px={4}
                    py={2}
                    display="flex"
                    alignItems="center"
                    gap={2}
                  >
                    <Image
                      src="/icons/download.svg"
                      alt="Download"
                      boxSize="16px"
                    />
                    Download
                  </Button>
                </HStack>
              </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PaymentModal;
