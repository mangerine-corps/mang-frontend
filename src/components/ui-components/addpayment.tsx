"use client";
import {
  Box,
  Button,
  createListCollection,
  Dialog,

  HStack,
  Image,
  Input,
  Portal,
  Select,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";

import { FaTimes } from "react-icons/fa";

type prop = {
  open: boolean;
  onOpenChange: any;
};


const AddPayment = ({ open, onOpenChange }:prop) => {
    const paymentOptions = createListCollection({
      items: [
        { label: "Card", value: "card" },
        { label: "PayPal", value: "paypal" },
        { label: "Bank Transfer", value: "bank" },
        { label: "Payoneer", value: "Payoneer" },
      ],
    });
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      placement={"center"}
    >
      <Dialog.Backdrop />

      <Dialog.Positioner>
        <Dialog.Content
          px="2"
          py="8"
          bg="bg_box"
          borderRadius="xl"
          boxShadow="lg"
        >
          <Dialog.Header></Dialog.Header>
          <Dialog.Body p="6">
            <Box w="full">
              {/* Header */}
              <HStack justify="space-between" mb={4}>
                <Text
                  font="outfit"
                  fontSize="2.5rem"
                  fontWeight="700"
                  color="text_primary"
                >
                  Add Payment Method
                </Text>
                <Image src="/icons/close.svg" alt="Close" cursor="pointer" />
              </HStack>

              {/* Description */}
              <Text fontSize="sm" color="text_primary" mb={6}>
                Select your preferred payment type to add it to your existing
                options.
              </Text>

              {/* Chakra v3 Select */}

              {/* Buttons */}
              <HStack mt={200} gap={4} justify="flex-end" w="full">
                <Button
                  w="196px"
                  h="48px"
                  px={8}
                  gap="10px"
                  borderRadius="8px"
                  border="1px solid"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  w="196px"
                  h="48px"
                  px={8}
                  gap="10px"
                  borderRadius="8px"
                  bg="blue.900"
                  color="white"
                  _hover={{ bg: "blue.800" }}
                >
                  Save
                </Button>
              </HStack>
            </Box>
          </Dialog.Body>
          <Dialog.Footer />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default AddPayment;
