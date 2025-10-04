"use client";
import { Stack, Box, VStack, Text, Icon, Flex } from "@chakra-ui/react";
import Biocard from "mangarine/components/ui-components/biocard";
import CommunityLists from "mangarine/components/ui-components/communitylists";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import FollowingLists from "mangarine/components/ui-components/follow-list";
import NetworkingCard from "mangarine/components/ui-components/networking";
import NewsItem from "mangarine/components/ui-components/newsitem";
import AppLayout from "mangarine/layouts/AppLayout";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ActivityBox from "mangarine/components/ui-components/activitybox";
import BookingCalendar from "mangarine/components/ui-components/bookingcalender";
import WhoToFollow from "mangarine/components/ui-components/whotofollow";
import ActivityEmptyState from "mangarine/components/ui-components/emptystate";
import { usePosts } from "mangarine/state/hooks/post.hook";
import { followCreator, Post, unfollowCreator } from "mangarine/state/reducers/post.reducer";
import { isEmpty } from "es-toolkit/compat";
import { BiChevronLeft } from "react-icons/bi";
import CommentInputWrapper from "mangarine/components/ui-components/commentinputwrapper";
import CommentSection from "mangarine/components/ui-components/commentsection";
import { useFollowUserMutation } from "mangarine/state/services/posts.service";
import { toaster } from "mangarine/components/ui/toaster";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useDispatch } from "react-redux";
import { useGetPostByIdQuery } from "mangarine/state/services/posts.service";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import TrendingCommunities from "mangarine/components/ui-components/trendingcommunities";

const PostPage = () => {
  const router = useRouter();
  const {
    query: { postId },
  } = router;

  // const parsedPostId = parseInt(postId, 10);
  // const backgroundColor = useColorModeValue("white", "background.100");
  const [showContent, setShowContent] = useState<boolean>(false);
  const { posts } = usePosts();
  const [post, setPost] = useState<Post>(null);
  const [addFollower] = useFollowUserMutation();
  const {user} = useAuth();
  const [follow, setFollow] = useState(false);
  const [activity] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { data: fetchedPost, isLoading: isPostLoading } = useGetPostByIdQuery(postId as string, {
    skip: !postId,
  });
  const { upcomingConsultation } = useConsultants();
  useEffect(() => {
    const currentPost = posts.find((p) => p.id === postId);
    if (currentPost) {
      setPost(currentPost);
    } else if (fetchedPost && fetchedPost.data) {
      setPost(fetchedPost.data);
    }
  }, [postId, posts, fetchedPost]);
    const isConsultant = user?.isConsultant;

  return (
    <AppLayout>
      <Box
        display={"flex"}
        // bg="bg_box"

        flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
        // alignItems={"center"}
        my={{ base: "2", md: "12px" }}
        justifyContent={"space-between"}
        w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
        mx="auto"
        overflowY={"auto"}
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
          bg={{ base: "bg_box", md: "transparent" }}
          display={{ base: "none", md: "none", lg: "none", xl: "flex" }}
        >
          <Biocard />
          <Box> {showContent && <NetworkingCard />}</Box>
          <DashboardCard />
        </VStack>
        <VStack
          mx={{ base: "0", md: 4 }}
          flex={1}
          h="full"
          p={4}
          bg="bg_box"
          // bg="main_background"
          overflowY={{ base: "scroll", md: "scroll" }}
          // overflowY={"auto"}
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
          <Flex
            mb={5}
            spaceX={3}
            w="full"
            pl="4"
            alignItems={"center"}
            justifyContent={"flex-start"}
          >
            <Icon
              onClick={() => router.back()}
              p={0.5}
              size={"xl"}
              shadow={"lg"}
              rounded="full"
              color="text_primary"
            >
              <BiChevronLeft size={12} />
            </Icon>
            <Text color="text_primary">Post</Text>
          </Flex>

          <Stack spaceY={4} bg="bg_box" w="full" mx={"auto"}>
            {!isEmpty(post) && (
              <NewsItem key={post?.id} post={post} isDetailPage />
            )}
          </Stack>
          <CommentInputWrapper postId={post?.id} />

          {!isEmpty(post) && <CommentSection post={post} />}
        </VStack>
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
              <TrendingCommunities />
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
      </Box>
    </AppLayout>
  );
};

export default PostPage;
