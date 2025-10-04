import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  Image,
  Link,
  Stack,
} from "@chakra-ui/react";
import {
  useGetTrendingCommunitiesMutation,
  useJoinOrLeaveCommunityMutation,
} from "mangarine/state/services/community.service";
import { useEffect, useState } from "react";
import { toaster } from "../ui/toaster";
import { setAll, setTrending } from "mangarine/state/reducers/community.reducer";
import { useCommunity } from "mangarine/state/hooks/communities.hook";
import { useDispatch } from "react-redux";
import JoinGroup from "./joingroup";
import { useAuth } from "mangarine/state/hooks/user.hook";

const TrendingCommunities = () => {
  const [getTrendingCommunities, { data, error, isLoading: trending }] =
    useGetTrendingCommunitiesMutation();
  const [communities, setCommunities] = useState<any[]>([]);
  const [join, setJoin] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [seeMore, setSeeMore] = useState(false);
  const dispatch = useDispatch();
  const { all } = useCommunity();
  const { user } = useAuth();
  const [joinOrLeaveCommunity, { isLoading: joinloading }] =
    useJoinOrLeaveCommunityMutation();
  useEffect(() => {
    getTrendingCommunities({})
      .unwrap()
      .then((res) => {
        // Be defensive about API shape
        const items = res?.data?.result ?? res?.data ?? res?.result ?? [];
        dispatch(setTrending(items));
        setCommunities(Array.isArray(items) ? items : []);
      })
      .catch((err) => {
        console.log(err, "err from trending communities");
        setCommunities([]);
      });
  }, [getTrendingCommunities]);
  const handleJoin = () => {
    joinOrLeaveCommunity(selectedItem?.id)
      .unwrap()
      .then((result) => {
        toaster.create({
          title: "Success",
          description: result.message,
          closable: true,
          type: "success",
        });
        const { data } = result;

        let updateGroups;
        if (all.some((group) => group.id === data.id)) {
          updateGroups = all.map((group) =>
            group.id === data.id ? data : group
          );
        } else {
          updateGroups = [...all, data]; // add newly joined community
        }
        dispatch(setAll(updateGroups));
        setJoin(false);
        // Optionally update UI or state here
      })
      .catch((error) => {
        console.error("Error joining/leaving community:", error);
        toaster.create({
          title: "Error",
          description: error.message,
          closable: true,
          type: "error",
        });
        setJoin(false);

        // Optionally show an error message here
      });
  };
  const handleClick = (item) => {
    setJoin(true);
    setSelectedItem(item);
  };
  const joinedIds = (Array.isArray(all) ? all : []).map((g: any) => g?.id);
  const displayCommunities = (Array.isArray(communities) ? communities : []);
  const list = seeMore ? displayCommunities : displayCommunities.slice(0, 5);

  return (
    <Box
      w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
      maxW={{ base: "full", md: "340px", lg: "400px" }} // don’t stretch too wide on large screens
      pb="12px"
      borderRadius="lg"
      // flex={1}
      boxShadow="sm"
      bg="bg_box"
      p="4"
      rounded={"15px"}
      // py="6"
      alignItems={"flex-start"}
    >
      <Text
        fontWeight="600"
        fontSize={{ base: "1rem", lg: "1.25rem" }}
        lineHeight="30px"
        color="text_primary"
        mb={8}
      >
        Trending Communities
      </Text>

      <VStack>
        {trending && (
          <Text color="grey.500" fontSize="sm">Loading trending communities…</Text>
        )}
        {!trending && Array.isArray(list) && list.length === 0 && (
          <Text color="grey.500" fontSize="sm">No trending communities found</Text>
        )}
        {trending && Array.isArray(list) &&
          list.map((community, index) => (
            <HStack key={index} justify="space-between" w="full">
              <HStack>
                <Stack
                  h="8"
                  w="8"
                  rounded="full"
                  bg="grey.400"
                  alignItems="center"
                  justifyContent="center"
                  mr={2}
                >
                  <Image
                    src={community?.image || "/images/group.png"}
                    boxSize="32px"
                    rounded="full"
                    alt="user1"
                  />
                </Stack>
                <Box>
                  <Text
                    font="outfit"
                    fontWeight="600"
                    fontSize={{ base: "0.8rem", md: "0.75rem", lg: "0.85rem" }}
                    color="text_primary"
                    lineHeight="20px"
                  >
                    {community?.name}
                  </Text>
                  <Text
                    font="outfit"
                    fontWeight="500"
                    color="gray.500"
                    fontSize={{ base: "0.8rem", md: "0.75rem", lg: "0.75rem" }}
                    lineHeight="22px"
                  >
                    {(community?.users?.length ?? 0)} Members
                  </Text>
                </Box>
              </HStack>
              <Button
                p="4"
                onClick={() => {
                  handleClick(community);
                }}
                borderRadius="8px"
                border="1px"
                padding="8px"
                size={{ base: "xs", md: "xs" }}
                bg={joinedIds.includes(community?.id) ? "gray.300" : "blue.900"}
                color={joinedIds.includes(community?.id) ? "gray.600" : "white"}
                _hover={{ bg: joinedIds.includes(community?.id) ? "gray.300" : "blue.700" }}
                px={3}
                disabled={joinedIds.includes(community?.id)}
              >
                {joinedIds.includes(community?.id) ? 'Joined' : 'Join +'}
              </Button>
            </HStack>
          ))}
        <JoinGroup
          onOpenChange={() => {
            setJoin(false);
          }}
          action={() => {
            handleJoin();
          }}
          open={join}
          selected={selectedItem}
        />
      </VStack>

      <Button
        justifySelf={"center"}
        mt={5}
        size="sm"
        px="3"
        variant={"ghost"}
        textAlign="center"
        fontWeight="medium"
        color="blue.900"
        display="block"
        onClick={() => setSeeMore(!seeMore)}
        _hover={{ textDecoration: "underline" }}
      >
        {seeMore ? "See Less" : (communities?.length ?? 0) > 3 ? "See All" : " "}
      </Button>
    </Box>
  );
};

export default TrendingCommunities;
