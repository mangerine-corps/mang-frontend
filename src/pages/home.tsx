import { Box, HStack, Icon, SkeletonCircle, SkeletonText, Stack, Text, VStack } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { PiSparkle } from "react-icons/pi";
import { BsArrowUp } from "react-icons/bs";
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
import BecomeAConsultantModal from "mangarine/components/ui-components/modals/becomeaconsultant";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { BiMenuAltRight } from "react-icons/bi";
import MenuList from "mangarine/components/ui-components/mybusiness/modals/homerightmenu";
import { usePostsPolling } from "mangarine/hooks/usePostsPolling";
import WhoToFollow from "mangarine/components/ui-components/whotofollow";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
};

const SkeletonPost = () => (
  <Box padding="6" rounded="lg" bg="bg_box" w="full">
    <SkeletonCircle size="10" />
    <SkeletonText mt="4" noOfLines={4} spaceY="4" py="2" />
  </Box>
);

function Home() {
  const [openConsultant, setOpenConsultant] = useState(false);
  const [showConsultantBanner, setShowConsultantBanner] = useState(true);
  const [showMenuList, setShowMenuList] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [pendingNew, setPendingNew] = useState<Post[]>([]);

  const feedTopRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const { posts } = usePosts();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isConsultant = user?.isConsultant;

  const { data: pageData, currentData: pageCurrentData, isFetching: isFetchingPage, isError, refetch } =
    useGetPostsCursorQuery({ cursor, limit: 10 });

  // Show skeleton only when there's truly no data — not on every remount.
  // RTK Query returns cached data immediately, so isInitialLoad is false on revisit.
  const isInitialLoad = !pageData && !pageCurrentData && isFetchingPage;

  const { items: polledItems } = usePostsPolling({ pageSize: 10, pollingInterval: 15000 });

  // Hold new polled posts in pending instead of silently prepending
  useEffect(() => {
    if (!polledItems?.length || isInitialLoad) return;
    const existingIds = new Set((posts || []).map((p: any) => p?.id));
    const fresh = polledItems.filter((p: any) => p && !existingIds.has(p.id));
    if (fresh.length > 0) {
      setPendingNew((prev) => {
        const prevIds = new Set(prev.map((p: any) => p.id));
        return [...prev, ...fresh.filter((p: any) => !prevIds.has(p.id))];
      });
    }
  }, [polledItems]);

  const showPending = () => {
    if (!pendingNew.length) return;
    dispatch(setPosts({ posts: [...pendingNew, ...(posts || [])] }));
    setPendingNew([]);
    feedTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData, pageCurrentData]);

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
          <>
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "1fr 2fr", lg: "1fr 2fr 1fr" }}
        gap={4}
        w="full"
        h={{ base: "auto", md: "full" }}
        alignItems="start"
        css={noScrollbar}
      >
        {/* Left sidebar */}
        <VStack
          display={{ base: "none", md: "flex" }}
          alignItems="stretch"
          w="full"
          spaceY={2}
          h="full"
          overflowY="auto"
          css={noScrollbar}
        >
          <Biocard />
          <DashboardCard />
        </VStack>

        {/* Center feed */}
        <Stack bg="bg_box" rounded="xl" px={4} pb={4} h={{ base: "auto", md: "full" }} w="full" overflowY={{ base: "auto", md: "auto" }} css={noScrollbar} position="relative">
          {/* Scroll anchor */}
          <div ref={feedTopRef} />

          {/* New posts pill */}
          {pendingNew.length > 0 && (
            <Box
              position="sticky"
              top={2}
              zIndex={10}
              display="flex"
              justifyContent="center"
              pointerEvents="none"
            >
              <HStack
                bg="#111D4A"
                color="white"
                px={4}
                py={2}
                rounded="full"
                gap={2}
                cursor="pointer"
                pointerEvents="auto"
                boxShadow="md"
                onClick={showPending}
                _hover={{ bg: "#1a2a6c" }}
                transition="background 0.15s"
              >
                <Icon fontSize="0.85rem"><BsArrowUp /></Icon>
                <Text fontSize="0.8rem" fontWeight="600" fontFamily="Outfit">
                  {pendingNew.length} new post{pendingNew.length > 1 ? "s" : ""}
                </Text>
              </HStack>
            </Box>
          )}

          {/* Consultant banner */}
          {showConsultantBanner && !isConsultant && (
            <Box
              style={{ background: "linear-gradient(90deg, #D6DCF5 0%, #F7F8FD 100%)" }}
              rounded="xl"
              px={4}
              py={3}
              mt={3}
            >
              <HStack alignItems="flex-start" justify="space-between">
                <HStack alignItems="flex-start" gap={2}>
                  <Icon color="#111D4A" mt={0.5}>
                    <PiSparkle />
                  </Icon>
                  <VStack alignItems="flex-start" gap={0.5}>
                    <Text fontWeight="600" fontSize="0.875rem" color="#111D4A">
                      Become a consultant?
                    </Text>
                    <Text fontSize="0.8rem" color="#111D4A">
                      Share your expertise and earn from sessions.
                    </Text>
                  </VStack>
                </HStack>
                <Icon
                  as={IoClose}
                  cursor="pointer"
                  color="#111D4A"
                  onClick={() => setShowConsultantBanner(false)}
                />
              </HStack>
              <HStack justify="flex-end" mt={2}>
                <Text
                  fontSize="0.875rem"
                  fontWeight="600"
                  color="#111D4A"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => setOpenConsultant(true)}
                >
                  Learn more →
                </Text>
              </HStack>
            </Box>
          )}

          <FeedInput onCreated={(post) => {
            dispatch(setPosts({ posts: [post, ...(posts || [])] }));
          }} />

          {isInitialLoad ? (
            <VStack css={noScrollbar}>
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
            </VStack>
          ) : isError ? (
            <VStack py={6} gap={3}>
              <PostEmptyState />
              <Text
                fontSize="0.875rem"
                fontWeight="600"
                color="#111D4A"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
                onClick={() => refetch()}
              >
                Try again
              </Text>
            </VStack>
          ) : (
            <Stack css={noScrollbar}>
              {!isEmpty(posts) && size(posts) > 0 ? (
                <>
                  {(posts as Post[]).map((post: Post) => post && <NewsItem key={post?.id} post={post} />)}
                  {!hasMore && (
                    <VStack py={6} opacity={0.7} gap={2}>
                      <Text fontSize="sm" color="gray.400">You&apos;re all caught up</Text>
                      <Text
                        fontSize="0.8rem"
                        color="#111D4A"
                        fontWeight="600"
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => feedTopRef.current?.scrollIntoView({ behavior: "smooth" })}
                      >
                        Back to top ↑
                      </Text>
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
          w="full"
          spaceY={2}
          h="full"
          overflowY="auto"
          css={noScrollbar}
        >
          <Box w="full" cursor="pointer">
            <ActivityBox />
          </Box>
          <Box w="full">
            <BookingCalendar />
          </Box>
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
      </>
      );
}

export default Home;
