import { Box, Button, Image, Text, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

type Props = {
  onClick: () => void;
  children?: ReactNode;
};

const MessageEmpty = ({ onClick, children }: Props) => {
  return (
    <VStack
      h="full"
      w="full"
      justify={children ? "flex-start" : "center"}
      align="center"
      bg="bg_box"
      borderRadius="24px"
      px={{ base: 6, md: 12 }}
      py={{ base: 10, md: 16 }}
      textAlign="center"
      gap={6}
      overflowY="auto"
    >
      <Box
        boxSize={{ base: "88px", md: "108px" }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          src="/icons/messageicon.svg"
          alt="Messages"
          w={{ base: "68px", md: "84px" }}
          h={{ base: "68px", md: "84px" }}
        />
      </Box>

      <VStack gap={2} maxW="560px">
        <Text
          fontFamily="Outfit"
          fontSize={{ base: "1.75rem", md: "2.5rem" }}
          fontWeight="700"
          lineHeight="1.1"
          color="text_primary"
        >
          Welcome to your Messages!
        </Text>

        <Text
          fontFamily="Outfit"
          fontSize={{ base: "0.95rem", md: "1.05rem" }}
          fontWeight="400"
          lineHeight="1.65"
          color="#5F6473"
        >
          Here you can start new conversations, manage your messages, and stay
          connected. Tap the &apos;New Message&apos; button to begin.
        </Text>
      </VStack>

      <Button
        w="full"
        maxW="520px"
        h="52px"
        borderRadius="8px"
        bg="#1C275D"
        color="white"
        fontWeight="600"
        onClick={onClick}
        _hover={{ bg: "#16214F" }}
      >
        New Message
      </Button>

      {children ? (
        <VStack w="full" maxW="640px" align="stretch" gap={4} textAlign="left">
          {children}
        </VStack>
      ) : null}
    </VStack>
  );
};

export default MessageEmpty;
