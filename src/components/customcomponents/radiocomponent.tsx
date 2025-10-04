import { RadioGroup, VStack } from "@chakra-ui/react";
import React from "react";

type radioOptions = {
  Items: {
   
    value: string;
    label: string;
  }[];
};
export const RadioComponent = ({ Items }: radioOptions) => {
  return (
    <RadioGroup.Root defaultValue="1">
      <VStack
        spaceY="6"
        w="full"
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
      >
        {Items.map((item) => (
          <RadioGroup.Item key={item.value} value={item.value}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText
              fontSize={{ base: "0.875rem", md: "1rem" }}
              color="text_primary"
            >
              {item.label}
            </RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </VStack>
    </RadioGroup.Root>
  );
};
