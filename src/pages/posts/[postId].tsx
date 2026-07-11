import { Stack, Box, VStack, Text, Icon, Flex } from "@chakra-ui/react";
import Head from "next/head";
import NewsItem from "mangarine/components/ui-components/newsitem";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ActivityBox from "mangarine/components/ui-components/activitybox";
import BookingCalendar from "mangarine/components/ui-components/bookingcalender";
import ActivityEmptyState from "mangarine/components/ui-components/emptystate";
import { usePosts } from "mangarine/state/hooks/post.hook";
import { Post } from "mangarine/state/reducers/post.reducer";
import { isEmpty } from "es-toolkit/compat";
import { BiChevronLeft } from "react-icons/bi";
import CommentInputWrapper from "mangarine/components/ui-components/commentinputwrapper";
import CommentSection from "mangarine/components/ui-components/commentsection";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useDispatch } from "react-redux";
import { useGetPostByIdQuery } from "mangarine/state/services/posts.service";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import type { GetServerSideProps } from "next";

interface PostPageProps {
  initialPost: Post | null;
}

const PostPage = ({ initialPost }: PostPageProps) => {
  const router = useRouter();
  const { query: { postId } } = router;

  const [showContent, setShowContent] = useState<boolean>(false);
  const { posts } = usePosts();
  const [post, setPost] = useState<Post | null>(initialPost);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { data: fetchedPost } = useGetPostByIdQuery(postId as string, {
    skip: !postId || (!user && !!initialPost),
  });
  const { upcomingConsultation } = useConsultants();

  useEffect(() => {
    const currentPost = posts.find((p) => p.id === postId);
    if (currentPost) {
      setPost(currentPost);
    } else if (fetchedPost?.data) {
      setPost(fetchedPost.data);
    }
  }, [postId, posts, fetchedPost]);

  const isConsultant = user?.isConsultant;

  // Build SEO values from whichever post data we have
  const seoTitle = post?.content
    ? `${post.content.slice(0, 60)}${post.content.length > 60 ? "…" : ""} | Mangerine`
    : "Post | Mangerine";
  const seoDescription = post?.content?.slice(0, 155) ?? "View this post on Mangerine.";
  const seoImage = post?.images?.[0] ?? post?.creator?.profilePics ?? "";
  const seoUrl = `${process.env.APP_URL ?? ""}/posts/${postId}`;

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={seoUrl} />
        {seoImage && <meta property="og:image" content={seoImage} />}

        {/* Twitter */}
        <meta name="twitter:card" content={seoImage ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {seoImage && <meta name="twitter:image" content={seoImage} />}

        <link rel="canonical" href={seoUrl} />
      </Head>

      <VStack
        mx={{ base: "0", md: 4 }}
        flex={1}
        h="full"
        p={4}
        bg="bg_box"
        overflowY={{ base: "scroll", md: "scroll" }}
        css={{
          "&::-webkit-scrollbar": { width: "0px", height: "0px" },
          "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent", borderRadius: "0px",
            maxHeight: "0px", height: "0px", width: 0,
          },
        }}
        rounded={"xl"}
      >
        <Flex mb={5} spaceX={3} w="full" pl="4" alignItems={"center"} justifyContent={"flex-start"}>
          <Icon onClick={() => router.back()} p={0.5} size={"xl"} shadow={"lg"} rounded="full" color="text_primary">
            <BiChevronLeft size={12} />
          </Icon>
          <Text color="text_primary">Post</Text>
        </Flex>

        <Stack spaceY={4} bg="bg_box" w="full" mx={"auto"}>
          {!isEmpty(post) && <NewsItem key={post?.id} post={post} isDetailPage />}
        </Stack>

        {!isEmpty(post) && <CommentInputWrapper postId={post?.id} />}
        {!isEmpty(post) && <CommentSection post={post} />}
      </VStack>

      <VStack
        w={{ base: "100%", md: "25%" }}
        h={{ base: "auto", md: "full" }}
        overflowY={{ base: "visible", md: "scroll" }}
        css={{
          "&::-webkit-scrollbar": { width: "0px", height: "0px" },
          "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent", borderRadius: "0px",
            maxHeight: "0px", height: "0px", width: 0,
          },
        }}
        overscrollX={"hidden"}
        spaceY={1}
        pos={{ base: "relative", md: "sticky" }}
        top={{ base: "unset", md: 0 }}
        alignSelf="flex-start"
        display={{ base: "none", md: "flex" }}
      >
        <Box
          w={{ base: "95%", md: "99%", lg: "full", xl: "full" }}
          mx={"auto"}
          onClick={() => setShowContent(false)}
          cursor={"pointer"}
        >
          {!isEmpty(upcomingConsultation) ? <ActivityBox /> : <ActivityEmptyState />}
        </Box>

        <Stack w="full">
          {isConsultant && !isEmpty(upcomingConsultation) && <BookingCalendar />}
        </Stack>
      </VStack>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { postId } = context.params as { postId: string };
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/posts/${postId}`);
    if (!res.ok) return { props: { initialPost: null } };
    const json = await res.json();
    return { props: { initialPost: json?.data ?? null } };
  } catch {
    return { props: { initialPost: null } };
  }
};

export default PostPage;
