import {
  Box,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import AppLayout from "mangarine/layouts/AppLayout";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import ActivityBox from "mangarine/components/ui-components/activitybox";
import BookingCalendar from "mangarine/components/ui-components/bookingcalender";
import WhoToFollow from "mangarine/components/ui-components/whotofollow";
import FollowingLists from "mangarine/components/ui-components/follow-list";
import CommunityLists from "mangarine/components/ui-components/communitylists";
import FeedInput from "mangarine/components/ui-components/feedinput";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetPostsCursorQuery } from "mangarine/state/services/posts.service";
import { isEmpty, size } from "es-toolkit/compat";
import { usePosts } from "mangarine/state/hooks/post.hook";
import NewsItem from "mangarine/components/ui-components/newsitem";
import { Post, setPosts } from "mangarine/state/reducers/post.reducer";
import PostEmptyState from "mangarine/components/ui-components/postemptyState";
import {
  setBookmarks,
  setCollections,
} from "mangarine/state/reducers/bookmark.reducer";
import {
  useGetBookmarksQuery,
  useGetCollectionQuery,
} from "mangarine/state/services/bookmark.service";
import { useDispatch } from "react-redux";
import NetworkingCard from "mangarine/components/ui-components/networking";
import ActivityEmptyState from "mangarine/components/ui-components/emptystate";
import { FaArrowUp } from "react-icons/fa6";
import BecomeAConsultantModal from "mangarine/components/ui-components/modals/becomeaconsultant";
import { useBecomeConsultantMutation } from "mangarine/state/services/user.service";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import { BiMenuAltRight } from "react-icons/bi";
import MenuList from "mangarine/components/ui-components/mybusiness/modals/homerightmenu";
import { usePostsPolling } from "mangarine/hooks/usePostsPolling";
import TrendingCommunities from "mangarine/components/ui-components/trendingcommunities";
import { useCommunity } from "mangarine/state/hooks/communities.hook";
import TrendingEmptyState from "mangarine/components/ui-components/emptytrendingstate";

function Home() {
  const [activity] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [openConsultant, setOpenConsultant] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data: pageData, currentData: pageCurrentData, isFetching: isFetchingPage, isError, refetch } = useGetPostsCursorQuery({ cursor, limit: 10 });
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { consultants } = useConsultants();
  const [showMenuList, setShowMenuList] = useState<boolean>(false);
  const { posts } = usePosts();
  const dispatch = useDispatch();
    const { upcomingConsultation } = useConsultants();
const {trending} = useCommunity()
  // Poll for newest posts and prepend them to the feed
  const { items: polledItems } = usePostsPolling({ pageSize: 10, pollingInterval: 15000 });
  const combinedPosts = useMemo(() => {
    const existingIds = new Set((posts || []).map((p: any) => p?.id));
    const fresh = (polledItems || []).filter((p: any) => p && !existingIds.has(p.id));
    return [...fresh, ...(posts || [])];
  }, [polledItems, posts]);


  const scrollToTop = () => {
    // Both window and documentElement just in case
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const { user } = useAuth();

  useEffect(() => {
  }, [user]);


  useEffect(() => { }, [posts]);
  const isConsultant = user?.isConsultant;
  useEffect(() => {
    if (!isConsultant) {
      setOpenConsultant(true);
    } else {
      setOpenConsultant(false);
    }
  }, [isConsultant]);

  // respond to page data changes (uses cached currentData on reload)
  useEffect(() => {
    const payload = (pageData || pageCurrentData)?.data;
    if (!payload) return;
    const { items, nextCursor: nc, hasMore: hm } = payload;
    if (Array.isArray(items)) {
      if (!cursor) {
        // first page (replace)
        dispatch(setPosts({ posts: items }));
      } else if (items.length > 0) {
        // next pages (append only if we actually have new items)
        dispatch(setPosts({ posts: [...posts, ...items] }));
      } // if items is empty on next pages, keep existing posts
    }
    setNextCursor(nc || undefined);
    setHasMore(!!hm);
    setInitialLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData, pageCurrentData]);

  // clear loading if request errors
  useEffect(() => {
    if (isError) setInitialLoading(false);
  }, [isError]);

  // intersection observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(async (entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !isFetchingPage && nextCursor) {
        // advance cursor to trigger next page
        setCursor(nextCursor);
      }
    }, { root: null, rootMargin: '200px', threshold: 0 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isFetchingPage, nextCursor]);


  const handleMobileTabChange = () => {
    // setActiveTab(activeTab.id);

    setShowMenuList(false);
  };
  return (
    <AppLayout>
      <Box
        display={"flex"}
        // bg="red.900"
        flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
        // alignItems={"center"}
        // my={{ base: "0", md: "12px" }}
        justifyContent={"space-between"}
        w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
        mx="auto"
        pos="relative"
        // overflowY={"scroll"}
        // spaceY={{ base: "4", md: "0" }}
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
        <VStack
          w={{ base: "100%", md: "25%" }}
          h={{ base: "auto", md: "full" }}
          overflowY="auto"
          // py={4}
          display={{ base: "none", md: "flex" }}
          spaceY={1}
        >
          <Biocard />
          {/* <Box w="full"> {showContent && <NetworkingCard />}</Box> */}
          <DashboardCard />
        </VStack>
        <VStack
          mx={{ base: "0", md: 4, lg: 4, xl: 4 }}
          flex={1}
          h="full"
          // bg="main_background"
          // overflowY={{ base: "scroll", md: "scroll" }}
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
          // overflowX="hidden"
        >
          <Stack
            flex={3}
            bg="bg_box"
            h="full"
            w="full"
            mx={4}
            px={4}
            pb="3"
            rounded="xl"
          >
            <FeedInput />
            {initialLoading ? (
              <VStack
                h="full"
                overflowY={"scroll"}
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
                <Box padding="6" rounded="lg" bg="main_background" w="full">
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    mt="4"
                    noOfLines={4}
                    spaceY="4"
                    py="2"
                    // skeletonHeight="2"
                  />
                </Box>
                <Box padding="6" rounded="lg" bg="main_background" w="full">
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    mt="4"
                    noOfLines={4}
                    spaceY="4"
                    py="2"
                    // skeletonHeight="2"
                  />
                </Box>
                <Box padding="6" rounded="lg" bg="main_background" w="full">
                  <SkeletonCircle size="10" />
                  <SkeletonText
                    mt="4"
                    noOfLines={4}
                    spaceY="4"
                    py="2"
                    // skeletonHeight="2"
                  />
                </Box>
              </VStack>
            ) : isError ? (
              <>
                <PostEmptyState />
              </>
            ) : (
              <Stack
                h="full"
                overflowY={"scroll"}
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
                {!isEmpty(combinedPosts) && size(combinedPosts) > 0 ? (
                  <>
                    {combinedPosts.map(
                      (post: Post) =>
                        post && <NewsItem key={post?.id} post={post} />
                    )}
                    {!hasMore && (
                      <VStack py={6} opacity={0.7}>
                        <Box fontSize="sm" color="gray.400">
                          You’re all caught up
                        </Box>
                      </VStack>
                    )}
                  </>
                ) : initialLoading ? null : (
                  <PostEmptyState />
                )}
                {/* sentinel for infinite scroll */}
                <div ref={sentinelRef} />
                {isFetchingPage && (
                  <VStack>
                    <Box padding="6" rounded="lg" bg="main_background" w="full">
                      <SkeletonCircle size="10" />
                      <SkeletonText mt="4" noOfLines={3} spaceY="4" py="2" />
                    </Box>
                  </VStack>
                )}
              </Stack>
            )}
          </Stack>

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
        <VStack
          w={{ base: "100%", md: "25%" }}
          h={{ base: "auto", md: "full" }}
          overflowY={{ base: "visible", md: "scroll" }}
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
          overscrollX={"hidden"}
          // p={4}
          spaceY={1}
          pos={{ base: "relative", md: "sticky" }}
          top={{ base: "unset", md: 0 }}
          alignSelf="flex-start"
          display={{ base: "none", md: "flex" }}
        >
          <Box
            w={{ base: "95%", md: "99%", lg: "full", xl: "full" }}
            mx={"auto"}
            // bg="red.600"
            onClick={() => {
              setShowContent(false);
            }}
            cursor={"pointer"}
          >
            {!isEmpty(upcomingConsultation) ? (
              <ActivityBox />
            ) : (
              <ActivityEmptyState />
            )}
          </Box>

          <Stack w="full">
            {isConsultant && !isEmpty(upcomingConsultation) && (
              <BookingCalendar />
            )}

            {/* <WhoToFollow /> */}
            <Stack
              flex={1.5}
              display={{ base: "none", lg: "flex" }}
              flexDir={{ lg: "column" }}
              spaceY={"6"}
              w="full"
            >
              {
                (!isEmpty(trending))?  <TrendingCommunities/>: <TrendingEmptyState/>
              }

              {/* <FollowingLists title="Prospective Following" /> */}
              {/* <CommunityLists
                type="trending"
                url={"/trending"}
                title={"Communities"}
                width="100%"
                filterJoined={false}
              /> */}
            </Stack>
          </Stack>
        </VStack>
        <MenuList
          action={handleMobileTabChange}
          open={showMenuList}
          onOpenChange={() => {
            setShowMenuList(false);
          }}
        />
        {/* <Tooltip label="Jump to the top"> */}
        {/* <Stack
          as="button" // make it accessible
          bg="text_primary"
          color="bg_box"
          p={2}
          rounded="full"
          position="fixed"
          bottom={4}
          right={10}
          zIndex={1000}
          onClick={() => {
            scrollToTop;
          }}
          cursor="pointer"
        >
          <FaArrowUp />
        </Stack> */}
        {/* </Tooltip> */}
      </Box>
    </AppLayout>
  );
}

export default Home;
