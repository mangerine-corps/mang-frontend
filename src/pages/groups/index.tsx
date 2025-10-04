import {
  Box,
  Button,
  HStack,
  Image,
  Link,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import GroupComponent from "mangarine/components/ui-components/groupcontent";
import GroupsTabs from "mangarine/components/ui-components/groupstabs";
import Rules from "mangarine/components/ui-components/rules";
import SuggestedCommunities from "mangarine/components/ui-components/suggestedcommunities";
import TrendingCommunities from "mangarine/components/ui-components/trendingcommunities";
import AppLayout from "mangarine/layouts/AppLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useDispatch } from "react-redux";
import {
  setCreated,
  setJoined,
} from "mangarine/state/reducers/community.reducer";
import { useCommunity } from "mangarine/state/hooks/communities.hook";
import { isEmpty } from "es-toolkit/compat";
import {
  useGetCreatedCommunitiesMutation,
  useGetJoinedCommunitiesMutation,
} from "mangarine/state/services/community.service";
import { BiMenuAltRight } from "react-icons/bi";
import MenuList from "mangarine/components/ui-components/mybusiness/modals/groupmenulist";
import TrendingEmptyState from "mangarine/components/ui-components/emptytrendingstate";

const Index = () => {
  const [showPost, setShowPost] = useState<boolean>(false);
  const [showMenuList, setShowMenuList] = useState<boolean>(false);
  const router = useRouter();

  //   const dispatch = useDispatch();
  const { all, recommended , trending} = useCommunity();
  // const [isMdOrBelow] = useMediaQuery(["(max-width: 48em)"]);
  const handleMobileTabChange = () => {
    // setActiveTab(activeTab.id);

    setShowMenuList(false);
  };

  return (
    <AppLayout>
      <Box
        display="flex"
        flexDir={{ base: "column", md: "row" }}
        w="full"
        h="full"
        overflow="hidden" // prevent parent from scrolling
      >
        {/* LEFT COLUMN */}
        <VStack
          w={{ base: "100%", md: "25%" }}
          h={{ base: "auto", md: "full" }}
          overflowY="auto"
          // py={4}
          display={{ base: "none", md: "flex" }}
          spaceY={2}
        >
          <Biocard />
          <DashboardCard />
        </VStack>

        {/* CENTER COLUMN */}
        <VStack
          mx={{ base: "0", md: 4, lg: 4, xl: 4 }}
          flex={1}
          h="full"
          // bg="main_background"
          overflowY={{ base: "scroll", md: "scroll" }}
          css={{
            "&::-webkit-scrollbar": {
              width: "0px",

              height: "0px",
            },
            "&::-webkit-scrollbar-track": {
              width: "0px",
              background: "transparent",

              height: "0px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
              borderRadius: "0px",
              maxHeight: "0px",
              height: "0px",
              width: 0,
            },
          }}
          rounded={"xl"}
          overflowX="hidden"
        >
          <GroupsTabs
            Groups={
              <GroupComponent
                onClickPost={() => {
                  setShowPost(true);
                }}
              />
            }
            specified={
              <VStack align="start" w="full" mt="4">
                <Text fontSize="1rem" fontWeight="600">
                  Groups Created
                </Text>
                <CreatedGroup />
                {/* CreatedGroup goes here */}
                <Text
                  fontSize={"1rem"}
                  color="text_primary"
                  pt="6"
                  pb="1"
                  fontWeight={"600"}
                >
                  {" "}
                  Groups Joined{" "}
                </Text>{" "}
                <JoinedGroup />
              </VStack>
            }
          />
        </VStack>
        <Stack
          as="button"
          cursor={"pointer"}
          onClick={() => {
            setShowMenuList(true);
          }}
          display={{
            base: "flex",
            md: "flex",
            lg: "none",
            xl: "none",
          }}
          pos="absolute"
          right="0"
          top={"80"}
          bg="main_background"
          p="2"
          zIndex={1000}
          roundedLeft="100%"
          color="text_primary"
          h="10"
          alignItems={"center"}
          justifyContent="center"
          w="8"
          borderWidth="2px"
          borderColor="button_border"
        >
          <BiMenuAltRight />
        </Stack>
        {/* RIGHT COLUMN */}
        <VStack
          w={{ base: "100%", md: "25%" }}
          h={{ base: "auto", md: "100vh" }}
          overflowY={{ base: "visible", md: "auto" }}
          display={{ base: "none", md: "flex" }}
          spaceY={2}
          pos={{ base: "relative", md: "sticky" }}
          top={{ base: "unset", md: 0 }}
          alignSelf="flex-start"
          css={{
            "&::-webkit-scrollbar": {
              width: "0px",

              height: "0px",
            },
            "&::-webkit-scrollbar-track": {
              width: "0px",
              background: "transparent",

              height: "0px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
              borderRadius: "0px",
              maxHeight: "0px",
              height: "0px",
              width: 0,
            },
          }}
        >
          <Button
            w="full"
            bg="button_bg"
            onClick={() => router.push("/groups/create")}
          >
            <Text color="button_text" fontWeight="600">
              Create Group
            </Text>
          </Button>

          {!isEmpty(recommended) && !showPost ? (
            <SuggestedCommunities />
          ) : (
            showPost && <Rules rules="" />
          )}
          {!isEmpty(trending) ? (
            <TrendingCommunities />
          ) : (
            <TrendingEmptyState />
          )}
        </VStack>
        <MenuList
          showPost={showPost}
          action={handleMobileTabChange}
          open={showMenuList}
          onOpenChange={() => {
            setShowMenuList(false);
          }}
        />
      </Box>
    </AppLayout>
  );
};

export default Index;

const JoinedGroup = () => {
  const { joined } = useCommunity();
  const dispatch = useDispatch();
  const router = useRouter();
  const [selected, setSelected] = useState();
  const handleClick = (item: any) => {
    setSelected(item);
    router.push(`/groups/${item.id}`);
  };
  const [getJoinedCommunities, { data, error, isLoading }] =
    useGetJoinedCommunitiesMutation();
  //  useEffect(() => {
  //    console.log(all, user, "all");
  //  }, [all]);
  useEffect(() => {
    getJoinedCommunities({})
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        dispatch(setJoined(data));
        console.log(data, "payload");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, [getJoinedCommunities, dispatch]);
  return (
    <HStack
      overflowX={"scroll"}
      w={{ base: "100%", lg: "700px" }}
      mx={{ base: "", md: "-0.5", lg: "-0.5", xl: "-0.5  " }}
      css={{
        "&::-webkit-scrollbar": {
          width: "0px",

          height: "0px",
        },
        "&::-webkit-scrollbar-track": {
          width: "0px",
          background: "transparent",

          height: "0px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "transparent",
          borderRadius: "0px",
          maxHeight: "0px",
          height: "0px",
          width: 0,
        },
      }}
    >
      {isLoading ? (
        <HStack>
          <Stack
            gap="6"
            maxW="xs"
            minW={"240px"}
            // w="240px"
            h={{ base: "100px", md: "200px", lg: "230px" }}
          >
            <VStack width="full"></VStack>
            <Skeleton height="200px" bg="bg_box" />
          </Stack>
          <Stack
            gap="6"
            maxW="xs"
            minW={"240px"}
            // w="240px"
            h={{ base: "100px", md: "200px", lg: "230px" }}
          >
            <VStack width="full"></VStack>
            <Skeleton height="200px" bg="bg_box" />
          </Stack>
          <Stack
            gap="6"
            maxW="xs"
            minW={"240px"}
            // w="240px"
            h={{ base: "100px", md: "200px", lg: "230px" }}
          >
            <VStack width="full"></VStack>
            <Skeleton height="200px" bg="bg_box" />
          </Stack>
        </HStack>
      ) : (
        <>
          {!isEmpty(joined) ? (
            joined.map((item, index) => (
              <Stack
                key={index}
                minW={"240px"}
                h="230px"
                mx="0.5"
                bg="main_background"
                rounded="6px"
                px="3"
                pt="3"
                pb="4"
                onClick={() => handleClick(item)}
              >
                <Box w="full" bg="grey.500" h="166px">
                  <Image w="full" h="full" src={item.image} alt="my-groups" />
                </Box>
                <Text fontSize={"1rem"} color="text_primary" fontWeight={"600"}>
                  {item.name}
                </Text>
              </Stack>
            ))
          ) : (
            <Stack
              w="400px"
              h="full"
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontSize={"1rem"}
                color="text_primary"
                fontWeight={"600"}
                textAlign="center"
              >
                No Joined Groups
              </Text>
            </Stack>
          )}
        </>
      )}
    </HStack>
  );
};

const CreatedGroup = ({}) => {
  const { created } = useCommunity();
  const router = useRouter();
  const dispatch = useDispatch();
  const [
    getCreatedCommunities,
    { data: allGroups, error: allGroupsError, isLoading: allGroupsIsLoading },
  ] = useGetCreatedCommunitiesMutation();
  //  useEffect(() => {
  //    console.log(all, user, "all");
  //  }, [all]);
  const [selected, setSelected] = useState();
  const handleClick = (item: any) => {
    setSelected(item);
    router.push(`/groups/${item.id}`);
  };
  console.log(selected, "item");
  useEffect(() => {
    getCreatedCommunities({})
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        dispatch(setCreated(data));
        console.log(data, "payload");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, [getCreatedCommunities, dispatch]);
  return (
    <HStack
      overflowX={"scroll"}
      w="700px"
      css={{
        "&::-webkit-scrollbar": {
          width: "0px",

          height: "0px",
        },
        "&::-webkit-scrollbar-track": {
          width: "0px",
          background: "transparent",

          height: "0px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "transparent",
          borderRadius: "0px",
          maxHeight: "0px",
          height: "0px",
          width: 0,
        },
      }}
    >
      {" "}
      {allGroupsIsLoading ? (
        <HStack>
          <Stack
            gap="6"
            maxW="xs"
            minW={"240px"}
            // w="240px"
            h={{ base: "100px", md: "200px", lg: "230px" }}
          >
            <VStack width="full"></VStack>
            <Skeleton height="200px" bg="bg_box" />
          </Stack>
          <Stack
            gap="6"
            maxW="xs"
            minW={"240px"}
            // w="240px"
            h={{ base: "100px", md: "200px", lg: "230px" }}
          >
            <VStack width="full"></VStack>
            <Skeleton height="200px" bg="bg_box" />
          </Stack>
          <Stack
            gap="6"
            maxW="xs"
            minW={"240px"}
            // w="240px"
            h={{ base: "100px", md: "200px", lg: "230px" }}
          >
            <VStack width="full"></VStack>
            <Skeleton height="200px" bg="bg_box" />
          </Stack>
        </HStack>
      ) : (
        <>
          {!isEmpty(created) ? (
            created.map((item, index) => (
              <Stack
                key={index}
                minW={"240px"}
                h="230px"
                mx="0.5"
                bg="main_background"
                rounded="6px"
                px="3"
                pt="3"
                pb="4"
                onClick={() => {
                  handleClick(item);
                }}
              >
                <Box w="full" bg="grey.500" h="166px">
                  <Image w="full" h="full" src={item.image} alt="my-groups" />
                </Box>
                <Text fontSize={"1rem"} color="text_primary" fontWeight={"600"}>
                  {item.name}
                </Text>
              </Stack>
            ))
          ) : (
            <Stack
              w="400px"
              h="full"
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontSize={"1rem"}
                color="text_primary"
                fontWeight={"600"}
                textAlign="center"
              >
                No Created Groups
              </Text>
            </Stack>
          )}
        </>
      )}
    </HStack>
  );
};
