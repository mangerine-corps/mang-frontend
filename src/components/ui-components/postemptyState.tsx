import { Box, Flex, Text, Image } from "@chakra-ui/react";
import CustomButton from "../customcomponents/button";

const PostEmptyState = () => {
  return (
    <Box
      //   flex="flex-end"
      //   maxW="md"
      mx="auto"
      p={6}
      //   bg="bg_box"
      //   borderRadius="lg"
      //   border="1px solid"
      //   borderColor="gray.200"
      //   boxShadow="sm"
    >
      <Flex direction="column" align="center" justify="center" mx="auto" w="80%">
        <Image src="/images/emptyPost.svg" alt="Empty state" />
        <Text fontWeight="600" fontSize="2.5rem" mb="2" color="text_primary" >
          It’s a bit quiet here!
        </Text>
        <Text fontWeight="400" textAlign={"center"} fontSize="1.25rem" mb={8} color="grey.500">
          Looks like {"it's"} quiet around here! Why not be the first to share
          something?
        </Text>
        <CustomButton
          customStyle={{
            w: "full",
            // mx:"auto"
          }}
          onClick={() => {}}
        >
          <Text
            color={"button_text"}
            fontWeight={"600"}
            fontSize={"1rem"}
            lineHeight={"100%"}
          >
            Share Your First Post
          </Text>
        </CustomButton>
      </Flex>
    </Box>
  );
};

export default PostEmptyState;
