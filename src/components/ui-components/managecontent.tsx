import {
  Box,
  Text,
  Image,
  HStack,
  VStack,
 
  Stack,
} from "@chakra-ui/react";
import CustomButton from "../customcomponents/button";

const ManageContent = ({onClick}) => {
  return (
    <Stack
      px="24px"
      py="20px"
      //   bg="bg_box"
      //display="flex"

      h="full"
      alignItems={"center"}
      justifyContent={"center"}
    >
      {/* Group Preview Title */}
      <VStack justify="space-between" mb={4}>
        <Stack bg="main_background" p="8">
          <Image
            src="/icons/emp.svg"
            alt="Group Banner"
            //   w="660px"
            //   h="202px"
            // borderRadius="lg"
            mb={4}
          />
        </Stack>
        <Text
          fontWeight="600"
          fontSize="1.5rem"
          font="outfit"
          color="text_primary"
          lineHeight="36px"
        >
          {"You haven't shared anything with the Group yet"}
        </Text>
        <Text
          fontWeight="400"
          fontSize="1rem"
          font="outfit"
          color="grey.300"
          lineHeight="30px"
          pb="8"
        >
          Start engaging with the community by sharing your first post,
          question, or idea.
        </Text>
        <CustomButton
          customStyle={{
            w: "full",
            // mx:"auto"
          }}
          onClick={onClick}
        >
          <Text
            color={"button_text"}
            fontWeight={"600"}
            fontSize={"1rem"}
            // lineHeight={"100%"}
          >
            Create Your First Post
          </Text>
        </CustomButton>
        <CustomButton
          customStyle={{
            w: "full",
            bg: "transparent",
            border: "none",
            // _hover:{{backgroud:"transparent"}}
            // mx:"auto"
          }}
          onClick={() => {}}
        >
          <Text
            color={"text_primary"}
            fontWeight={"600"}
            fontSize={"1rem"}
            // lineHeight={"100%"}
          >
            Browse Group Posts
          </Text>
        </CustomButton>
      </VStack>

      {/* Banner Image */}
    </Stack>
  );
};

export default ManageContent;
