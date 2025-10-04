import { Box, Flex, Text, Image, Button } from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";

const IntroductionEmptyState = ({onClick}) => {
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
        Introduction Video
      </Text>

      <Flex direction="column" pb="6" align="center" justify="center">
        <Image src="/icons/emptyvid.svg" alt="Empty state" />
      </Flex>
      <Text
        className={outfit.className}
        fontWeight="600"
        color="text_primary"
        fontSize="1.2rem"
        // mb={4}
        textAlign={"left"}
      >
        No Introductory Video Yet
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
        Add an introductory video to showcase your expertise and connect better
        with clients.
      </Text>
      <Button
        bg="primary.300"
        borderWidth={1}
        color={"white"}
        borderColor={"gray.50"}
        py={2}
        w="45%"
        px={4}
        _hover={{
          textDecor: "none",
        }}
        // loading={isLoading}
        // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
        rounded={"6px"}
        onClick={onClick}
      >
        <Text
          ml={2}
          className="text5"
          color={"white"}
          fontSize={"0.875rem"}
          fontWeight={"500"}
        >
         Upload Video
        </Text>
      </Button>
    </Box>
  );
};

export default IntroductionEmptyState;
