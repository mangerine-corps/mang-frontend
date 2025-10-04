import {Box, Text, VStack} from '@chakra-ui/react';
import React from 'react'

type prop ={
    rules:any;
}

const Rules = ({rules}:prop) => {


    return (
      <VStack
       w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
      // maxW={{ base: "full", md: "340px" }} // don’t stretch too wide on large screens
        pb="12px"
        borderRadius="lg"
        // flex={1}
        boxShadow="sm"
        bg="bg_box"
        p="4"
        rounded={"15px"}
        // py="6"
        alignItems={"flex-start"}
      >
        <Text
          fontWeight="600"
          fontSize="1.2rem"
          font="outfit"
          lineHeight="24px"
          color="text_primary"
          mb={2}
          textAlign={"left"}
        >
          Our Rules and Regulations
        </Text>

        <VStack
          gap={2}
          align="start"
          fontWeight="400"
          fontSize="1rem"
          font="outfit"
          color="gray.600"
        >
          <Box
            dangerouslySetInnerHTML={{
              __html: rules || (
                <>
                  <Text>
                    <b>Rules not provided</b>
                  </Text>
                 
                </>
              ),
            }}
          />
        </VStack>
      </VStack>
    );
}

export default Rules