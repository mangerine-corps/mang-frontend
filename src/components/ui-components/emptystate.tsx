import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";

const ActivityEmptyState = () => {
  return (
    <Box
      flex="flex-end"
      w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
      maxW={{ base: "full", md: "340px", lg: "400px" }}
      // maxW="340px"
      mx="auto"
      // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
      display={{ base: "none", md: "block", lg: "block" }}
      p={6}
      bg="bg_box"
      borderRadius="lg"
      // border="1px solid"
      // borderColor="grey.300"
      // boxShadow="sm"
    >
      <Text
        className={outfit.className}
        fontWeight="600"
        color="text_primary"
        fontSize="1.2rem"
        mb={4}
      >
        Activities
      </Text>

      <Flex direction="column" pb="6" align="center" justify="center">
        <Image src="/icons/emptyct.svg" alt="Empty state" />
      </Flex>
      <Text
        className={outfit.className}
        fontWeight="600"
        color="text_primary"
        fontSize="1.2rem"
        // mb={4}
        textAlign={"left"}
      >
        No activities yet!
      </Text>

      <Text
        className={outfit.className}
        color="grey.500"
        font-family="Outfit"
        font-weight="25rem"
        font-size="0.875rem"
        line-height="1.25rem"
        wordSpacing={2}
        // mb={6}
        pr={11}
        pt={1}
        // pl={2}
      >
        All your recent activities will be highlighted here for you to see.
      </Text>
    </Box>
  );
};

export default ActivityEmptyState;
