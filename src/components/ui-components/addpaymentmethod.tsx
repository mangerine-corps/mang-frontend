import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  Portal,
  Select,
  createListCollection,
} from "@chakra-ui/react";

const paymentOptions = createListCollection({
  items: [
    { label: "Card", value: "card" },
    { label: "PayPal", value: "paypal" },
    { label: "Bank Transfer", value: "bank" },
    { label: "Payoneer", value: "Payoneer" }
  ],
});

const AddPaymentMethod = () => {
  return (
    <Box
      w="full"
      maxW="600px"
      mx="auto"
      bg="bg_box"
      borderRadius="xl"
      boxShadow="lg"
      p={6}
    >
      {/* Header */}
      <HStack justify="space-between" mb={4}>
        <Text font="outfit" fontSize="2.5rem" fontWeight="700" color="text_primary">
          Add Payment Method
        </Text>
        <Image src="/icons/close.svg" alt="Close" cursor="pointer" />
      </HStack>

      {/* Description */}
      <Text fontSize="sm" color="text_primary" mb={6}>
        Select your preferred payment type to add it to your existing options.
      </Text>

      {/* Chakra v3 Select */}
      <Select.Root collection={paymentOptions} size="md" width="full">
        <Select.HiddenSelect />
        <Select.Label srOnly>Payment method</Select.Label>
        <Select.Control>
          <Select.Trigger
            borderRadius="md"
            fontSize="sm"
            bg="bg_box"
            color="text_primary"
            _focus={{ borderColor: "bg_box", bg: "bg_box" }}
            h="48px"
            p={4}
          >
            <Select.ValueText placeholder="Payment method type" />
            <Select.IndicatorGroup>
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Trigger>
        </Select.Control>

        <Portal>
          <Select.Positioner zIndex="dropdown">
            <Select.Content>
              {paymentOptions.items.map((option) => (
                <Select.Item mt={2} p={2} color="text_primary" item={option} key={option.value}>
                  {option.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

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
  );
};

export default AddPaymentMethod;
