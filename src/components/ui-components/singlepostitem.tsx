"use client";;
import {
  Spinner,
  Text,
  Stack,
  Flex,
  Box,
  Image,

} from "@chakra-ui/react";
import { useGetPostByIdQuery } from "mangarine/state/services/posts.service";


import { useRouter } from "next/navigation";
import FollowingLists from "./follow-list";
import CommunityLists from "./communitylists";
import CommentInputWrapper from "./commentinputwrapper";
import CommentSection from "./commentsection";
import NewsItem from "./newsitem";

const back = "/assets/images/go-back.png";

interface PostPageProps {
  params: {
    postId: string;
  };
}

const PostPage = ({ params }: PostPageProps) => {
  // const { user } = useAuth();
  const { postId } = params;
  const router = useRouter();
  const parsedPostId = parseInt(postId, 10);
  // const backgroundColor = useColorModeValue("white", "background.100");

  const {
    data: post,
    isLoading,
    isError,
  } = useGetPostByIdQuery(parsedPostId, {
    skip: !parsedPostId,
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (isError || !post) {
    return <Text color="red.500">Error loading the post.</Text>;
  }

  const handleGoBack = () => {
    router.push("/home");
  };

  return (
    <Flex>
      <Flex
        bg={"main_background"}
        h="full"
        p={6}
        flexDir={"column"}
        columnGap={"6"}
        mt={{ base: "4rem" }}
        position="relative"
      >
        {/* go-back icon with text */}
        <Flex align="center" cursor="pointer" onClick={handleGoBack}>
          <Image src={back} alt="Go Back" boxSize="50px" />
          <Text ml={2} fontSize="lg" fontWeight="bold">
            Post
          </Text>
        </Flex>
        <Stack mt={4} flexDir={{ base: "column", lg: "row" }}>
          <Stack spaceY={4} flex={3}>
            {isLoading ? (
              <Spinner size="lg" />
            ) : isError ? (
              <Text color="red.500">Failed to load post</Text>
            ) : (
              <NewsItem post={post.data} />
            )}

            <Box mt="2rem">
              <CommentInputWrapper
                postId={postId}
              />
            </Box>
            <Box>
              <CommentSection post={post.data} />
            </Box>
          </Stack>

          <Stack flex={1.5} flexDir={{ lg: "column" }} spaceY={"6"}>
            <FollowingLists title="Prospective Following" />
            <CommunityLists title="Communities" type={"all"} url={""} />
            <CommunityLists
              title="Consultants you may know"
              type={"all"}
              url={""}
            />
          </Stack>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default PostPage;
