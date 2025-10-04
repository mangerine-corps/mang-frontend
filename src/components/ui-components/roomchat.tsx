import {
  Box,
  Flex,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

const messages = [
  {
    id: 1,
    avatar: "/images/dp.png",
    text: "I’m in a noisy environment sir so I can’t talk.\nThank you for understanding sir",
    bg: "gray.50",
  },
  {
    id: 2,
    avatar: "/images/dp.png",
    text: "I’m in a noisy environment sir so I can’t talk.\nThank you for understanding sir",
    bg: "gray.50",
  },
  {
    id: 3,
    avatar: "/images/dp.png",
    text: "I will drop a link in this comment section so you all can access the file",
    bg: "orange.50",
  },
  {
    id: 4,
    avatar: "/images/dp.png",
    text: "I’m in a noisy environment sir so I can’t talk.\nThank you for understanding sir",
    bg: "gray.50",
  },
];

const RoomChat = () => {
  return (
    <Box
      w="400px"
      h="650px"
      p={4}
      borderRadius="16px"
      bg="bg_box"
      boxShadow="md"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Text font="outfit" color="text_primary" fontWeight="600" fontSize="1.5rem" mb={40}>
        Room Chat
      </Text>

      <VStack align="stretch" gap={4} flex="1" overflowY="auto">
        {messages.map((msg) => (
          <Flex key={msg.id} align="start" gap={2}>
            <Image
              src={msg.avatar}
              alt="avatar"
              boxSize="32px"
              borderRadius="full"
            />
            <Box
              bg={"bg_box"}
              px={2}
              py={2}
              borderRadius="md"
              whiteSpace="pre-line"
            >
              <Text font="outfit" fontWeight="400" fontSize="1rem" color="text_primary">
                {msg.text}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>

      <Flex
        mt={4}
        align="center"
        bg="gray.50"
        p={2}
        borderRadius="16px"
        border="1px"
      >
        <Input
          placeholder="Write a message"
          border="1px"
          px={4}
          fontSize="sm"
          _focus={{ outline: "none" }}
        />
        <Image
          src="/icons/emoji.svg"
          alt="emoji"
          boxSize="20px"
          mr={2}
          cursor="pointer"
        />
        <Image
          src="/icons/send.svg"
          alt="send"
          boxSize="24px"
          cursor="pointer"
        />
      </Flex>
    </Box>
  );
};

export default RoomChat;
