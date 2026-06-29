import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { Button } from "mangarine/components/ui/button";
import { useRouter } from "next/router";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <Flex w="full" h="100vh" align="center" justify="center" bg="main_background" px={6}>
      <VStack gap={6} textAlign="center" maxW="420px">
        <Text
          fontSize={{ base: "5rem", md: "7rem" }}
          fontWeight="800"
          color="button_bg"
          lineHeight="1"
          fontFamily="Outfit"
          opacity={0.12}
          userSelect="none"
        >
          404
        </Text>

        <Box mt={-8}>
          <Text fontSize="1.375rem" fontWeight="700" color="text_primary" fontFamily="Outfit" mb={2}>
            Page not found
          </Text>
          <Text fontSize="0.9rem" color="gray.500" fontFamily="Outfit" lineHeight="1.6">
            The page you're looking for doesn't exist or has been moved.
          </Text>
        </Box>

        <Flex gap={3} wrap="wrap" justify="center">
          <Button
            bg="button_bg"
            color="button_text"
            borderRadius="10px"
            px={6}
            fontFamily="Outfit"
            fontWeight="600"
            _hover={{ bg: "#0D173B" }}
            onClick={() => router.push("/home")}
          >
            Go to Home
          </Button>
          <Button
            variant="outline"
            borderRadius="10px"
            px={6}
            fontFamily="Outfit"
            fontWeight="600"
            color="text_primary"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </Flex>
      </VStack>
    </Flex>
  );
}
