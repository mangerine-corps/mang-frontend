"use client";

import { Box, HStack, Portal, Select, Text, createListCollection } from "@chakra-ui/react";
type props ={
    labels:string,
required:boolean
}

const CustomSelect = ({labels, required}:props) => {
  return (
    <Select.Root collection={frameworks} size="sm" width="full">
      <Select.HiddenSelect />
      <HStack>
        <Select.Label color="grey.500">{labels}</Select.Label>
        {required && <Text color="red.600">*</Text>}
      </HStack>
      <Select.Control>
        <Box w="full" rounded={"full"}>
          <Select.Trigger>
            <Select.ValueText py="3" px="3" placeholder="Select framework" />
          </Select.Trigger>
        </Box>
        <Select.IndicatorGroup pr="4">
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content px="4" py="4">
            {frameworks.items.map((framework) => (
              <Select.Item px="4" py="4" item={framework} key={framework.value}>
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};
export default CustomSelect

const frameworks = createListCollection({
  items: [
    { label: "React.js", value: "react" },
    { label: "Vue.js", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ],
});
