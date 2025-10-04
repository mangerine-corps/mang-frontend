import { Box, Flex, Text, Image, Stack, Button } from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";

const RatingEmptyState = () => {
  return (
    <Stack
      //   flex="flex-end"
      w={{ base: "100%", sm: "90%", md: "95%" }} // full width on mobile, tighter on small screens
      //   maxW={{ base: "full", md: "340px", lg: "400px" }}
      // maxW="340px"
      mx="auto"
      justifyContent={"center"}
      alignItems="center"
      // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
      //   display={{ base: "none", md: "block", lg: "block" }}
      p={6}
      bg="bg_box"
      borderRadius="lg"
      // border="1px solid"
      // borderColor="grey.300"
      // boxShadow="sm"
    >
      {/* <Text
        className={outfit.className}
        fontWeight="600"
        color="text_primary"
        fontSize="1.2rem"
        mb={4}
      >
        Activities
      </Text> */}

      <Flex direction="column" pb="6" align="center" justify="center" py="4">
        <Image src="/icons/ratngempty.svg" alt="Empty state" />
      </Flex>
      <Text
        className={outfit.className}
        fontWeight="500"
        color="text_primary"
        fontSize="1.2rem"
        // mb={4}
        textAlign={"left"}
      >
        No Reviews Yet
      </Text>

      <Text
        className={outfit.className}
        color="grey.600"
        font-family="Outfit"
        font-weight="25rem"
        font-size="0.875rem"
        line-height="1.25rem"
        wordSpacing={2} pb="8"
        // mb={6}
        // pr={11}
        // py={3}
        // pl={2}
      >
        This consultant is new! Be the first to book a session and share your
        experience.
      </Text>
      <Button bg="button_bg" color="button_text" mt="6" px="8" py="3" rounded="lg">
        Book Consultation
      </Button>
    </Stack>
  );
};

export default RatingEmptyState;
