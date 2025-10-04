import {
  Box,
  Text,
  Image,
  HStack,
  VStack,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Stack,
} from "@chakra-ui/react";

const GroupEmpty = () => {
  return (
    <Stack
      px="24px"
      py="20px"
      bg="bg_box"
      //display="flex"
      borderRadius="md"
      boxShadow="md"
      h="full"
      alignItems={"center"}
      justifyContent={"center"}
    >
      {/* Group Preview Title */}
      <VStack justify="space-between" mb={4}>
        <Image
          src="/icons/emptyImg.svg"
          alt="Group Banner"
        //   w="660px"
        //   h="202px"
          borderRadius="lg"
          mb={4}
        />
        <Text
          fontWeight="600"
          fontSize="1.5rem"
          font="outfit"
          color="text_primary"
          lineHeight="36px"
        >
        No group information yet
        </Text>
      </VStack>

      {/* Banner Image */}
    </Stack>
  );
};

export default GroupEmpty;
