import {
  Box,
  Text,
  VStack,
  HStack,
  Flex,
  Image,
} from "@chakra-ui/react";

const participants = [
  { name: "Me", image: "/images/dp.png", mic: "/icons/mic.svg", video: "/icons/video.svg" },
  { name: "Jenny Wilson", image: "/images/dp.png", mic: "/icons/mic.svg", video: "/icons/video.svg" },
  { name: "Jacob Jones", image: "/images/dp.png", mic: "/icons/mic.svg", video: "/icons/video.svg" },
  { name: "Robert Fox", image: "/images/dp.png", mic: "/icons/mic.svg", video: "/icons/video-.svg" },
];

const ParticipantBox = () => {
  return (
    <Box
      w="418px"
      h="464px"
      bg="bg_box"
      borderRadius="24px"
      boxShadow="md"
      p="24px"
      gap="24px"
    >
      <Flex justify="space-between" align="center" mb={10}>
        <Text
          fontSize="1.5rem"
          fontWeight="600"
          color="text_primary"
          font="outfit"
        >
          Participants ({17})
        </Text>

        <Box
          w="32px"
          h="32px"
          bg="bg_box"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            src="/icons/arrow.svg"
            alt="arrow up"
            boxSize="16px"
            cursor="pointer"
          />
        </Box>
      </Flex>


      <VStack gap={4} maxH="280px" overflowY="auto" pr={1}>
        {participants.map((p, idx) => (
          <Box
            key={idx}
            w="full"
            p={3}
            borderRadius="xl"
            bg="bg_box"
            _hover={{ bg: "gray.50" }}
          >
            <HStack justify="space-between">
              <HStack gap={3}>
                <Image
                  src={p.image}
                  alt={p.name}
                  boxSize="40px"
                  borderRadius="full"
                  objectFit="cover"
                />
                <Text font="outfit" fontSize="1rem" color="text_primary" fontWeight="600">{p.name}</Text>
              </HStack>
              <HStack gap={2}>
                <Image src={p.mic} alt="mic status" boxSize="20px" />
                <Image src={p.video} alt="video status" boxSize="20px" />
              </HStack>
            </HStack>
          </Box>
        ))}
      </VStack>

      <Box mt={4}>
        <Text
          font="outfit"
          fontSize="1.25rem"
          textAlign="center"
          fontWeight="400"
          color="blue.900"
          cursor="pointer"
        >
          See all
        </Text>
      </Box>
    </Box>
  );
};

export default ParticipantBox;
