import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

import {IoChevronForwardOutline } from "react-icons/io5";
type props = {
  title: string;
  onClick: any;
};
const LegalContent = ({ title, onClick }: props) => {
  return (
    <HStack     _hover={{ backgroundColor: "bg_box" }} spaceX="6" onClick={onClick}   cursor={"pointer"} w="full" py="1.5">
      <VStack alignItems={"flex-start"} justifyContent={"space-between"} w="full" pl="8">
        <Text
          font="outfit"
             fontSize={{base:"1rem",md:"1.2rem",lg:"1.25rem"}}
          fontWeight="400"
          color="text_primary"
          lineHeight="36px"
        >
          {title}
        </Text>
      </VStack>

      <Text fontSize={"sm"} color="text_primary"  pr="8">
        <IoChevronForwardOutline fontSize={"sm"} color="text_primary" />
      </Text>
    </HStack>
  );
};

export default LegalContent;
