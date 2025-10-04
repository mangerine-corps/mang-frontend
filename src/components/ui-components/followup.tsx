import {
  Box,
  Button,
  CloseButton,
  Text,
  Textarea,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { Portal, Select, createListCollection } from "@chakra-ui/react"

const frameworks = createListCollection({
  items: [
    { label: "24 Hours", value: "24 Hours" },
    { label: "1 Day", value: "1 Day" },
    { label: "2 Days", value: "2 Days" },
    { label: "3 Days", value: "3 Days" },
    { label: "4 Days", value: "4 Days" },
    { label: "5 Days", value: "5 Days" },
  ],
})

const FollowUp = () => {
  return (
    <Box
      w="full"
      h="full"
      borderRadius="md"
      bg="bg_box"
      boxShadow="lg"
      p={6}
      position="relative"
    >
      {/* Close Icon */}
      <CloseButton
        position="absolute"
        top={4}
        right={4}
        w="48px"
        h="48px"
        p="10px"
      />

      {/* Title */}
      <Text
        color="text_primary"
        font="outfit"
        fontSize="2.5rem"
        lineHeight="30px"
        fontWeight="700"
        mb={8}
      >
        Set Follow-up Duration
      </Text>

      <Text
        color="text_primary"
        font="outfit"
        fontSize="0.875rem"
        fontWeight="400"
        mb={8}
      >
        How many days would you like to follow up with the Shawn Bred?
      </Text>

         <Select.Root collection={frameworks} size="sm" width="full" mb={8}>
      <Select.HiddenSelect />
      <Select.Label></Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText p={2} color="text_primary" placeholder="Follow-up period" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content >
            {frameworks.items.map((framework) => (
              <Select.Item color="text_primary" m={4} item={framework} key={framework.value}>
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>

      {/* Internal Notes */}
      <Box mb={6}>
        <Text
          font="outfit"
          fontSize="1.25rem"
          fontWeight="400"
          color="gray.500"
          mb={1}
        >
          Follow-up Message (optional)
        </Text>
        <Textarea
          placeholder="Write a follow up mesage to your client"
          minH="120px"
          p={4}
        />
      </Box>

      {/* Action Buttons */}
      <HStack justifyContent="flex-end">
        <Button
          w="196px"
          h="48px"
          px="80px"
          py="24px"
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
          px="80px"
          py="24px"
          gap="10px"
          borderRadius="8px"
          bg="blue.900"
          color="white"
          _hover={{ bg: "blue.800" }}
        >
          Submit
        </Button>
      </HStack>
    </Box>
  );
};

export default FollowUp;
