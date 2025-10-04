import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { isBoolean, size } from "es-toolkit/compat";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import JoinGroup from "../joingroup";
import { useJoinOrLeaveCommunityMutation } from "mangarine/state/services/community.service";
import { useDispatch } from "react-redux";
import { useCommunity } from "mangarine/state/hooks/communities.hook";
import { setAll } from "mangarine/state/reducers/community.reducer";
import { toaster } from "mangarine/components/ui/toaster";

const GroupItem = ({ group }) => {
  const [join, setJoin] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);
  const { user } = useAuth();

  const [joinOrLeaveCommunity, { isLoading }] =
    useJoinOrLeaveCommunityMutation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { all } = useCommunity();
  const [membersData, setMembersDatas] = useState([]);
  const handleClick = (item) => {
    setJoin(true);
    setSelectedItem(item);
    // console.log(group, "all");
  };

  useEffect(() => {
    const isCreator = group?.creator?.id === user?.id;

    setIsCreator(isCreator);
    const isJoined = group.users.find((iter) => iter?.id === user?.id);
    if (size(isJoined) > 0) {
      setIsMember(isJoined);
    }
  }, [user, group]);
  const handleJoin = () => {
    joinOrLeaveCommunity(selectedItem?.id)
      .unwrap()
      .then((result) => {
        const { data } = result;
        console.log(data, "joiner");
        toaster.create({
          title: "Success",
          description: "Group joined successfully",
          type: "success",
          closable: true,
        });
        let updateGroups = all.map((group) => {
          if (group.id === data.id) {
            const { users } = data;
            // console.log(users, "members", group, "group");
            return data;
          }
          return group;
        });
        // setCanView(true)
        dispatch(setAll(updateGroups));
        setJoin(false);
        // Optionally update UI or state here
      })
      .catch((error) => {
        console.error("Error joining/leaving community:", error);
        toaster.create({
          title: "",
          description: error?.data?.message || "Failed to join group.",
          type: "warning",
          closable: true,
        });
        setJoin(false);
        // Optionally show an error message here
      });
  };

  return (
    <>
      <Flex
        key={group?.id}
        borderWidth="1px"
        borderColor="gray.100"
        borderRadius="md"
        p={4}
        // bg="red.600"
        bg="bg_box"
        w="full"
        justifyContent="space-between"
        alignItems={{ base: "flex-start", md: "center", lg: "center" }}
      >
        <HStack
          w="full"
          alignItems={{
            base: "flex-start",
            md: "flex-start",
            lg: "flex-start",
          }}
          flex="3"
        >
          <Image
            src={group.image || "/placeholder.svg"}
            alt={group.name}
            minW="80px"
            maxW={"80px"}
            minH="80px"
            maxH={"80px"}
            // h="80px"
            bg="grey.500"
            borderRadius="md"
            objectFit="cover"
            mr={2}
            //mb={6}
          />

          <Box>
            <Text
              font="outfit"
              fontWeight="600"
              fontSize={{ base: "1rem", md: "1rem", lg: "1.2rem" }}
              color="text_primary"
              // mb={1}
            >
              {group.name}
            </Text>
            <HStack>
              <Text
                fontSize={{
                  base: "0.75rem",
                  md: "0.875rem",
                  lg: "0.875rem",
                }}
                color="gray.500"
                mb={1}
              >
                {group?.users?.length}
              </Text>{" "}
              {group?.users?.length > 1 ? (
                <Text
                  fontSize={{
                    base: "0.75rem",
                    md: "0.875rem",
                    lg: "0.875rem",
                  }}
                  color="gray.500"
                  mb={1}
                >
                  members
                </Text>
              ) : (
                <Text
                  fontSize={{
                    base: "0.75rem",
                    md: "0.875rem",
                    lg: "0.875rem",
                  }}
                  color="gray.500"
                  mb={1}
                >
                  member
                </Text>
              )}
            </HStack>
            <Text
              font="outfit"
              fontWeight="400"
              fontSize={{
                base: "0.75rem",
                md: "0.875rem",
                lg: "0.875rem",
              }}
              color="text_primary"
              // lineHeight="24px"
              textWrap="wrap"
              // p={2}
            >
              {group?.description}
            </Text>
          </Box>
        </HStack>
        <Stack>
          {isCreator || isMember ? (
            <Button
              variant={"outline"}
              colorScheme={"gray"}
              size="lg"
              onClick={() => router.push(`/groups/${group?.id}`)}
              py="4"
              px="8"
              borderRadius="6px"
              border="1px solid blue.900"
            >
              {/* {`${console.log(group.creator.id, "creator")}`} */}
              View
            </Button>
          ) : (
            <Button
              variant={"solid"}
              colorScheme={"blue"}
              size="lg"
              onClick={() => {
                handleClick(group);
              }}
              py="4"
              // px="6"
              px="8"
              borderRadius="6px"
              border="1px solid blue.900"
            >
              Join
            </Button>
          )}
        </Stack>
      </Flex>
      <JoinGroup
        onOpenChange={() => {
          setJoin(false);
        }}
        open={join}
        action={handleJoin}
        selected={group}
      />
    </>
  );
};

export default GroupItem;
