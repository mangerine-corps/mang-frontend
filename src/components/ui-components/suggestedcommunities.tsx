import {
  Box,
  Text,
  HStack,
  VStack,
  Button,
  Image,
  Link,
} from "@chakra-ui/react";
import {
  useGetRecommendedCommunitiesMutation,
  useJoinOrLeaveCommunityMutation,
} from "mangarine/state/services/community.service";
import { useEffect, useState } from "react";
import JoinGroup from "./joingroup";
import { useDispatch } from "react-redux";
import { useCommunity } from "mangarine/state/hooks/communities.hook";
import { setAll, setrecommendedCommunities } from "mangarine/state/reducers/community.reducer";
import Communities from "./../../pages/communities";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { toaster } from "../ui/toaster";
// import SuggestedCommunities from './suggestedcommunities';

const SuggestedCommunities = () => {
  const [join, setJoin] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [seeMore, setSeeMore] = useState(false);
  const [suggestedCommunity, setSuggestedCommunity] = useState<any[]>([])
  const dispatch = useDispatch();
  const { all } = useCommunity();

  const [
    getRecommendedCommunities,
    { data, isLoading: recommendedIsLoading, error },
  ] = useGetRecommendedCommunitiesMutation({});
  const [joinOrLeaveCommunity, { isLoading }] =
    useJoinOrLeaveCommunityMutation();
  useEffect(() => {
    getRecommendedCommunities({})
      .unwrap()
      .then((payload) => {
        const items = payload?.data?.result ?? payload?.data ?? payload?.result ?? [];
        const normalized = Array.isArray(items) ? items : [];
        dispatch(setrecommendedCommunities(normalized));
        setSuggestedCommunity(normalized);
      })
      .catch(() => {
        setSuggestedCommunity([]);
      });
  }, [getRecommendedCommunities, dispatch]);
  const { user } = useAuth();
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
          updateGroups = all.map((group) => (group.id === data.id ? data : group));
        } else {
          updateGroups = [...all, data];
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
    console.log(item ,"item")
  };

  const joinedIds = (Array.isArray(all) ? all : []).map((g: any) => g?.id);
  const displayCommunities = seeMore
    ? suggestedCommunity
    : suggestedCommunity.slice(0, 5);

  return (
    <Box
       w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
      maxW={{ base: "full", md: "340px" ,lg:"400px" }} // don’t stretch too wide on large screens
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
        fontSize="1.25rem"
        lineHeight="30px"
        color="text_primary"
        mb={8}
      >
        Suggested Communities
      </Text>

      <VStack align="stretch" wordSpacing={6}>
        {recommendedIsLoading && (
          <Text color="grey.500" fontSize="sm">Loading suggested communities…</Text>
        )}
        {!recommendedIsLoading && Array.isArray(displayCommunities) && displayCommunities.length === 0 && (
          <Text color="grey.500" fontSize="sm">No suggested communities found</Text>
        )}
        {!recommendedIsLoading && displayCommunities?.map((community, index) => (
          <HStack key={index} justify="space-between">
            <HStack>
              <Image
                src={community?.image || "/images/group.png"}
                boxSize="32px"
                rounded="full"
                alt="user1"
              />

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
                  fontSize="0.875rem"
                  lineHeight="22px"
                >
                  {(community?.users?.length ?? community?.members ?? 0)} Members
                </Text>
              </Box>
            </HStack>
            <Button
              onClick={() => handleClick(community)}
              borderRadius="8px"
              border="1px"
              padding="8px"
              size="xs"
              bg={joinedIds.includes(community?.id) ? "gray.300" : "blue.900"}
              color={joinedIds.includes(community?.id) ? "gray.600" : "white"}
              _hover={{ bg: joinedIds.includes(community?.id) ? "gray.300" : "blue.700" }}
              //   {<Image src="/icons/plus-white.svg" alt="plus" />}
              px={3}
              py="3"
              disabled={joinedIds.includes(community?.id)}
            >
              {joinedIds.includes(community?.id) ? 'Joined' : 'Join +'}
            </Button>
            <JoinGroup
            onOpenChange={()=>{setJoin(false)}}
              action={() => {
                handleJoin();
              }}
              open={join}
              selected={selectedItem}
            />
          </HStack>
        ))}
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
        {seeMore ? "See Less" : (suggestedCommunity?.length ?? 0) > 3 ? "See All" : " "}
      </Button>
    </Box>
  );
};

export default SuggestedCommunities;
