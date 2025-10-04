import { Box, Button, HStack, Image, Stack, Text } from "@chakra-ui/react";
// import CustomButton from "../custombutton";
const FollowImage = "/person.png";

const FollowItem = () => {
  return (
    <HStack
      w={{ md: "full", lg: "full" }}
      py={"0.5rem"}
      justifyContent={"space-between"}
    >
      <Stack flexDir={{ base: "column", lg: "row" }} alignItems={"flex-start"}>
        <Image
          alt="follow icon"
          src={FollowImage}
          h={10}
          w={10}
          rounded={"full"}
        />
        <Box>
          <Text
            fontSize={"1rem"}
            fontFamily={"Outfit"}
            color={"text_primary"}
            fontWeight={"600"}
          >
            Darrell Steward
          </Text>
          <Text
            fontSize={"0.875rem"}
            fontFamily={"Outfit"}
            color={"grey.300"}
            pt={1}
            fontWeight={"400"}
          >
            UI/UX Designer
          </Text>
        </Box>
      </Stack>
      <HStack>
        <Button
          display="flex"
          w="full"
          size={{ lg: "sm", "2xl": "md" }}
          borderRadius={"lg"}
          bg={"transparent"}
          justifyContent="center"
          alignItems="center"
          alignSelf="stretch"
borderWidth={"0.5px"}
          borderColor={"grey.300"}
          width={{ base: "100%", md: "auto" }} // Responsive width
          onClick={() => {}}
          px="6"
          py="2"
          //   rightIcon={<FiPlus />}
        >
          {" "}
          <Text fontSize={"0.875rem"} color="grey.500" display={{ base: "none", xl: "block" }}>
            Join
          </Text>{" "}
        </Button>
      </HStack>
    </HStack>
  );
};

export default FollowItem;
