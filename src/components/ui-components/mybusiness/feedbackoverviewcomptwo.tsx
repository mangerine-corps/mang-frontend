import { Box, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import ReviewChart from "./reviewchart";
import ReviewDetails from "./reviewdetails";

const FeedbackOverviewcompTwo = () => {
  return (
    <VStack>
      <HStack
        w="100%"
        mx="auto"
        p={4}
        flexDir={{ base: "column", md: "column",lg:"row", xl: "row" }}
        boxShadow="md"
        borderRadius="md"
        bg="main_background"
        alignItems={"center"} mb="4"
      >
        <Box w={{base:"100%",md:"100%",lg:"50%"}}>
          <ReviewChart />
        </Box>

        <VStack w={{base:"100%",md:"100%",lg:"50%"}} justifyContent={"space-between"} spaceY="2">
          <Box
            w="100%"
            mx="auto"
            p={4}
            h="auto"
            boxShadow="sm"
            borderRadius="md"
            bg="main_background"
            py="6"
          >
            <HStack
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack align="start">
                <Text color="grey.500" fontSize="1rem" fontWeight={"400"}>
                  Total Reviews
                </Text>
                <Text color="text_primary" fontSize="1.5rem" fontWeight={"600"}>
                  521
                </Text>
              </VStack>
              <Stack
                bg="#EEFBF3"
                justifyContent={"center"}
                objectFit={"contain"}
                alignItems={"center"}
                py="4"
                px="4"
                rounded="md"
              >
                {" "}
                <Image src="/icons/tr.svg" alt="review-img" />
              </Stack>{" "}
            </HStack>
          </Box>
          <Box
            w="100%"
            mx="auto"
            h="auto"
            p={4}
            boxShadow="sm"
            borderRadius="md"
            bg="main_background"
            py="6"
          >
            <HStack
              w="full"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <VStack align="start">
                <Text color="grey.500" fontSize="1rem" fontWeight={"400"}>
                  Average Ratings
                </Text>
                <Text color="text_primary" fontSize="1.5rem" fontWeight={"600"}>
                  4.0
                </Text>
              </VStack>
              <Stack
                bg="#F5F3FF"
                justifyContent={"center"}
                objectFit={"contain"}
                alignItems={"center"}
                py="4"
                px="4"
                rounded="md"
              >
                {" "}
                <Image src="/icons/ar.svg" alt="rating-img" />
              </Stack>{" "}
            </HStack>
          </Box>
        </VStack>
      </HStack>
      <ReviewDetails/>
    </VStack>
  );
};

export default FeedbackOverviewcompTwo;
