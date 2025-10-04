import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";

// const FollowImage = "/assets/images/fprofile.png";
import CustomButton from "../customcomponents/button";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useEffect, useState } from "react";

type Community = {
  image: string;
  name: string;
  users: any[];
};

const CommunityItem = ({ community }: { community: Community }) => {
  // const Community = [];
  const { user } = useAuth();
  const [ableToJoin, setAbleToJoin] = useState(false);

  useEffect(() => {
    const userArray = community?.users || [];
    const isMmber = userArray.filter((u: any) => u.id === user?.id);

    const ableToJoin = !isMmber

    setAbleToJoin(ableToJoin);

  }, [community])

  const handleJoin = () => {
    // Handle join community logic here

    // console.log(joinCheck, "Join community clicked");
  };

  return (
    <HStack
      //  w={{ lg: "85%",  }}
      w="95%"
      justifyContent={"space-between"}
      mb="1rem"
    >
      <HStack
        alignItems={"center"}
        justifyContent={"flex-start"}
      // bg="main_background"
      >
        <Image
          src={community.image}
          alt={community.name}
          w="45px"
          h="45px"
          borderRadius={"50%"}
        />
        <VStack align={"left"} spaceY={0}>
          <Text
            textOverflow={"ellipsis"}
            whiteSpace={"nowrap"}
            maxW={"80%"}
            // overflow={"hidden"}
            fontSize={"1rem"}
            color="text_primary"
            fontFamily={"Outfit"}
            // color={"background.400"}
            fontWeight={"600"}
          >
            {community.name}
          </Text>
          <Text
            fontSize={"0.875rem"}
            fontFamily={"Outfit"}
            color={"gray.200"}
            fontWeight={"400"}
          >
            {/* {formatMembers(community.followers.length)} */}
          </Text>
        </VStack>
      </HStack>
      {
        ableToJoin && (
          <Button
            px={4}
            py={2}
            bg={"primary.600"}
            size="sm"
            onClick={handleJoin}
          >
            Join
          </Button>
        )
      }
      {/* <CustomButton
        customStyle={{
          w: "35%",
          bg: "main_background",
          borderWidth: "2px",
        }}
        onClick={() => {}}
      }
      <Button px={4} py={2} bg={"primary.600"} size="sm" onClick={handleJoin}>
        Join
      </Button>
      {/* <CustomButton
        // display="flex"
        // w="full"
        // size={{ lg: "sm", "2xl": "md" }}
        customStyle={{
          // justifyContent: "center",
          // alignItems: "center",
          // alignSelf: "stretch",
          color: "button_text",
          // width: "100%",
          border: "none",
        }}
        // borderRadius={"lg"}
        // bg={"primary.300"}

        // Responsive width
        onClick={() => {}}

        // rightIcon={<FiPlus />}
      >
        {" "}
        Join{" "}
      </CustomButton> */}
    </HStack>
  );
};

export default CommunityItem;
