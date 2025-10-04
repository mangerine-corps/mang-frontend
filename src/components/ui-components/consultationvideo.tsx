import {
  Box,
  Text,
  HStack,
  VStack,
  Flex,
  Image,
} from "@chakra-ui/react";
import React, {useState} from 'react';


const ConsultationVideo = () => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <Box 
    w="full"
    h="full"
    gap="24px">
      {/* Header */}
      <HStack align="center">
        <Image src="/images/vector1.svg" alt="Back" boxSize="24px" cursor="pointer" />
        <Text  font="outfit" color="text_primary" fontSize="1.25rem" fontWeight="600">Joseph Brenda’s Consultation</Text>
      </HStack>

      {/* Video Player */}
      <Box
        borderRadius="lg"
        overflow="hidden"
        bg="bg_box"
        position="relative"
        
      >
        <Image mb={4} src="/images/recordings.png" alt="Consultation video" h="full" w="full" />

        {/* <Flex
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          align="center"
          justify="center"
          bg=""
        >
          <HStack gap={8}>
            <Image src="/icons/back10.svg" alt="Back 10s"  />
            <Image src="/icons/play.svg" alt="Play"  />
            <Image src="/icons/forward10.svg" alt="Forward 10s"  />
          </HStack>
        </Flex>

        <Text
          position="absolute"
          bottom="50px"
          w="full"
          textAlign="center"
          color="white"
          fontWeight="600"
        >
          What do you feel you have accomplished since you started
        </Text> */}

        {/* Progress Bar */}
        {/* <Flex
          align="center"
          justify="space-between"
          px={4}
          pb={4}
          position="absolute"
          bottom={0}
          w="full"
          color="white"
        >
          <Box w="100%" mr={2} bg="whiteAlpha.400" h="6px" borderRadius="md" overflow="hidden">
            <Box w="50%" h="full" bg="blue.400" />
          </Box>
          <Text fontSize="xs">5:04 / 10:00</Text>
        </Flex> */}
      </Box>

      {/* Author Info */}
      <Flex justify="space-between" align="center" mb={4}>
        <HStack gap={3}>
          <Image src="/images/recordimage.png" alt="Esther Howard" boxSize="40px" borderRadius="full" />
          <Box>
            <Text font="outfit" color="text_primary" fontSize="0.875rem" fontWeight="400">Esther Howard</Text>
            <Text font="outfit" fontSize="sm" color="gray.500">July 7, 2025</Text>
          </Box>
        </HStack>
        <HStack gap={1} cursor="pointer">
        <Text fontSize="sm" color="gray.600">English</Text>
        <Image src="/icons/arrowdown.svg" alt="Dropdown" boxSize="16px" />
      </HStack>

      </Flex>

      {/* Transcript */}
      <VStack align="stretch" gap={2}>
  <HStack align="start" >
    <Text fontWeight="400" color="gray.500" fontSize="sm" >
      0:00
    </Text>
    <Text w="910px" h="150px" fontSize={{ base: "md", md: "1.25rem" }} color="text_primary" font="outfit" mb={8}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, 
      sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Text>
  </HStack>

  <HStack align="start">
    <Text fontWeight="400" color="gray.500" fontSize="sm">
      0:30
    </Text>
    <Text w="910px" h="150px" fontSize="1.25rem" color="text_primary" font="outfit">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Text>
  </HStack>
</VStack>

    </Box>
  );
};

export default ConsultationVideo;
