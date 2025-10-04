import { Text, VStack } from "@chakra-ui/react";
import FollowItem from "./follow-item";


const FollowingLists = ({ title }: { title: string }) => {
  return (
    <VStack
      borderWidth={0.5}
      borderColor={"#0000001A"}
      bg="main_background"
      rounded={"15px"}
      p="6"
      shadow={"sm"}
      px="auto"
      spaceY={"3"}
      // w="340px"
      alignItems={{ base: "flex-start", md: "center" }}
    >
      <Text
        textAlign={"left"}
        w="full"
        fontSize={"1.25rem"}
        fontFamily={"Outfit"}
        color={"text_primary"}
        fontWeight={"600"}
      >
        {title}
      </Text>
      {Array(6)
        .fill(0)
        .map((item, index) => (
          <FollowItem key={index} />
        ))}
    </VStack>
  );
};

export default FollowingLists;
