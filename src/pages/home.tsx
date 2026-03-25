import { Box, SkeletonCircle, SkeletonText, Stack, VStack } from "@chakra-ui/react";
import AppLayout from "mangarine/layouts/AppLayout";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import ActivityBox from "mangarine/components/ui-components/activitybox";
import BookingCalendar from "mangarine/components/ui-components/bookingcalender";
import FeedInput from "mangarine/components/ui-components/feedinput";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetPostsCursorQuery } from "mangarine/state/services/posts.service";
import { isEmpty, size } from "es-toolkit/compat";
import { usePosts } from "mangarine/state/hooks/post.hook";
import NewsItem from "mangarine/components/ui-components/newsitem";
import { Post, setPosts } from "mangarine/state/reducers/post.reducer";
import PostEmptyState from "mangarine/components/ui-components/postemptyState";
import { useDispatch } from "react-redux";
import ActivityEmptyState from "mangarine/components/ui-components/emptystate";
import BecomeAConsultantModal from "mangarine/components/ui-components/modals/becomeaconsultant";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import { BiMenuAltRight } from "react-icons/bi";
import MenuList from "mangarine/components/ui-components/mybusiness/modals/homerightmenu";
import { usePostsPolling } from "mangarine/hooks/usePostsPolling";
import TrendingCommunities from "mangarine/components/ui-components/trendingcommunities";
import { useCommunity } from "mangarine/state/hooks/communities.hook";
import TrendingEmptyState from "mangarine/components/ui-components/emptytrendingstate";
import WhoToFollow from "mangarine/components/ui-components/whotofollow";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
};

const SkeletonPost = () => (
  <Box padding="6" rounded="lg" bg="main_background" w="full">
    <SkeletonCircle size="10" />
    <SkeletonText mt="4" noOfLines={4} spaceY="4" py="2" />
  </Box>
);

function Home() {
  const [openConsultant, setOpenConsultant] = useState(false);
  const [showMenuList, setShowMenuList] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [initialLoading, setInitialLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { posts } = usePosts();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { upcomingConsultation } = useConsultants();
  const { trending } = useCommunity();
  const isConsultant = user?.isConsultant;

  const { data: pageData, currentData: pageCurrentData, isFetching: isFetchingPage, isError } =
    useGetPostsCursorQuery({ cursor, limit: 10 });

  const { items: polledItems } = usePostsPolling({ pageSize: 10, pollingInterval: 15000 });

  const combinedPosts = useMemo(() => {
    const existingIds = new Set((posts || []).map((p: any) => p?.id));
    const fresh = (polledItems || []).filter((p: any) => p && !existingIds.has(p.id));
    return [...fresh, ...(posts || [])];
  }, [polledItems, posts]);

  useEffect(() => {
    if (!user) return;
    if (!isConsultant && !sessionStorage.getItem("consultantModalShown")) {
      setOpenConsultant(true);
      sessionStorage.setItem("consultantModalShown", "true");
    }
  }, [isConsultant, user]);

  useEffect(() => {
    const payload = (pageData || pageCurrentData)?.data;
    if (!payload) return;
    const { items, nextCursor: nc, hasMore: hm } = payload;
    if (Array.isArray(items)) {
      if (!cursor) {
        dispatch(setPosts({ posts: items }));
      } else if (items.length > 0) {
        dispatch(setPosts({ posts: [...posts, ...items] }));
      }
    }
    setNextCursor(nc || undefined);
    setHasMore(!!hm);
    setInitialLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData, pageCurrentData]);

  useEffect(() => {
    if (isError) setInitialLoading(false);
  }, [isError]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingPage && nextCursor) {
          setCursor(nextCursor);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isFetchingPage, nextCursor]);

  return (
    <AppLayout>
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "1fr 2fr", lg: "1fr 2fr 1fr" }}
        gap={4}
        w="full"
        h="full"
        css={noScrollbar}
      >
        {/* Left sidebar */}
        <VStack
          display={{ base: "none", md: "flex" }}
          alignItems="stretch"
          spaceY={2}
          h="full"
          overflowY="auto"
          css={noScrollbar}
        >
          <Biocard />
          <DashboardCard />
        </VStack>

        {/* Center feed */}
        <Stack bg="bg_box" rounded="xl" px={4} pb={4} h="full" w="full" overflowY="auto" css={noScrollbar}>
          <FeedInput />
          {initialLoading ? (
            <VStack css={noScrollbar}>
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
            </VStack>
          ) : isError ? (
            <PostEmptyState />
          ) : (
            <Stack css={noScrollbar}>
              {!isEmpty(combinedPosts) && size(combinedPosts) > 0 ? (
                <>
                  {combinedPosts.map((post: Post) => post && <NewsItem key={post?.id} post={post} />)}
                  {!hasMore && (
                    <VStack py={6} opacity={0.7}>
                      <Box fontSize="sm" color="gray.400">You're all caught up</Box>
                    </VStack>
                  )}
                </>
              ) : (
                <PostEmptyState />
              )}
              <div ref={sentinelRef} />
              {isFetchingPage && (
                <VStack>
                  <SkeletonPost />
                </VStack>
              )}
            </Stack>
          )}
        </Stack>

        {/* Right sidebar */}
        <VStack
          display={{ base: "none", md: "flex" }}
          alignItems="stretch"
          spaceY={2}
          h="full"
          overflowY="auto"
          css={noScrollbar}
        >
          <Box w="full" cursor="pointer">
            {!isEmpty(upcomingConsultation) ? <ActivityBox /> : <ActivityEmptyState />}
          </Box>
          <BookingCalendar />
          <Stack display={{ base: "none", lg: "flex" }} w="full">
            {!isEmpty(trending) ? <TrendingCommunities /> : <TrendingEmptyState />}
          </Stack>
          <WhoToFollow />
        </VStack>

        {/* Mobile right menu trigger */}
        <Stack
          as="button"
          cursor="pointer"
          onClick={() => setShowMenuList(true)}
          display={{ base: "flex", md: "flex", lg: "none" }}
          pos="absolute"
          right={0}
          top="80"
          bg="main_background"
          p="2"
          zIndex={1000}
          roundedLeft="100%"
          color="text_primary"
          h="10"
          w="8"
          alignItems="center"
          justifyContent="center"
          borderWidth="2px"
          borderColor="button_border"
        >
          <BiMenuAltRight />
        </Stack>
      </Box>

      <MenuList
        action={() => setShowMenuList(false)}
        open={showMenuList}
        onOpenChange={() => setShowMenuList(false)}
      />
      <BecomeAConsultantModal
        isOpen={openConsultant}
        onOpenChange={() => setOpenConsultant(false)}
      />
    </AppLayout>
  );
}

export default Home;
