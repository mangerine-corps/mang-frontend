import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

import { IoChevronDownOutline, IoChevronForwardOutline, IoChevronUpOutline } from "react-icons/io5";
type props = {
  title: string;
  onClick: any;
  open:any
};
const ArrowUpContent = ({ title, onClick, open }: props) => {

  return (
    <HStack
      _hover={{ bg: "bg_box" }}
      spaceX="6"
      onClick={onClick}
      // bg="main_background"
      cursor={"pointer"}
      w="full"
      py="1" borderBottomWidth={"2px"} borderBottomColor={"grey.50"}
      mb="2"
    >
      <VStack
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        w="full"
        // bg="red.900"
      >
        <Text
          font="outfit"
          fontSize={{base:"1rem",md:"1.2rem",lg:"1.25rem"}}
          fontWeight="400"
          color="text_primary"
          lineHeight={{base:"24px",md:"24px",lg:"36px"}}
        >
          {title}
        </Text>
      </VStack>

      <Text fontSize={"sm"} color="text_primary">
        { open ? <IoChevronDownOutline fontSize={"sm"} color="text_primary" />:
        <IoChevronUpOutline fontSize={"sm"} color="text_primary" />}
      </Text>
    </HStack>
  );
};

export default ArrowUpContent;
