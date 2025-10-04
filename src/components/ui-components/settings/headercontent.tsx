import { Box, HStack, Stack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { FaBackward } from 'react-icons/fa'
import { IoChevronBackOutline } from 'react-icons/io5'
type props ={
    title:string,
    desc:string,
    extra:string,onClick?:any
}
const HeaderContent = ({title,desc,extra,onClick}:props) => {
  return (
    <HStack spaceX="6">
      <Stack
        rounded="md"
        borderWidth={"1px"}
        borderColor={"grey.300"}
        shadow="sm"
        py="2"
        px="2"
        alignItems={"center"}
        onClick={onClick}
      >
        <Text fontSize={"sm"} color="text_primary">
          <IoChevronBackOutline />
        </Text>
      </Stack>
      <VStack alignItems={"flex-start"}>
        <Text
          font="outfit"
           fontSize={{base:"1rem",md:"1.25rem",lg:"1.5rem"}}
          fontWeight="600"
          color="text_primary"
          lineHeight="36px"
        >
          {title}
        </Text>
        <HStack>
          <Text
            font="outfit"
                 fontSize={{base:"0.8rem",md:"0.875rem",lg:"1rem"}}
            fontWeight="500"
            color="text_primary"
          >
            {desc}
          </Text>
          <Text
            font="outfit"
                 fontSize={{base:"0.8rem",md:"0.875rem",lg:"1rem"}}
            fontWeight="400"
            color="text_primary"
          >
            {extra}
          </Text>
        </HStack>
      </VStack>
    </HStack>
  );
}

export default HeaderContent