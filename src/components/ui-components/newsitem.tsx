import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Menu,
  Portal,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useFollow } from "mangarine/hooks/useFollow";

import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { usePathname, useRouter, useParams } from "next/navigation";

import { useDispatch } from "react-redux";
import { size } from "lodash";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { usePosts } from "mangarine/state/hooks/post.hook";
import {
  useDeletePostMutation,
  useFollowUserMutation,
  useIncrementPostViewsQuery,
  useUnfollowUserMutation,
  useToggleAllowCommentsMutation,
} from "mangarine/state/services/posts.service";
import { useAddPostToCollectionMutation } from "mangarine/state/services/bookmark.service";
import { Post, updateSinglePost } from "mangarine/state/reducers/post.reducer";
import NewsAction from "./newsaction";
import AddToCollection from "./addtocollection";
import { BiShareAlt } from "react-icons/bi";
import { FiEye, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";
import { toaster } from "../ui/toaster";
import { usePostLikes } from "mangarine/hooks/usePostLikes";
import ReportPost from "./modals/reportpost";
import { MessageSquareText } from "lucide-react";
import DeletePost from "./deletepost";
import { useReportCommentMutation } from "../../state/services/posts.service";
interface NewsItemProps {
  post: Post;
  isDetailPage?: boolean;
}

const NewsItem: React.FC<NewsItemProps> = ({ post, isDetailPage = false }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { posts } = usePosts();
  const dispatch = useDispatch();
  const [addFollower] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  // Only increment views on the dedicated post detail route (/posts/[id]) and when the route id matches this post
  const pathname = usePathname();
  const params = useParams();
  const routePostId = (params as any)?.id as string | undefined;
  // Fallback to the explicit flag passed by Post detail page
  const isPostDetailRoute = isDetailPage || (pathname?.startsWith('/posts') && !!routePostId && routePostId === post?.id);
  const {
    data: views,
    isLoading: viewsloading,
    error,
  } = useIncrementPostViewsQuery(post?.id, {
    skip: !isPostDetailRoute,
    refetchOnMountOrArgChange: true,
  });

  // When we get a fresh view count from the detail page, persist it to the store
  useEffect(() => {
    if (views?.data?.viewCount && post?.id) {
      dispatch(updateSinglePost({ postId: post.id, updates: { views: views.data.viewCount } }));
    }
  }, [views?.data?.viewCount, post?.id, dispatch]);
  // Remove unused like/unlike mutations since we're using the custom hook
  // const [likePost] = useLikePostMutation();
  // const [unlikePost] = useUnlikePostMutation();
  //   const toast = useToast();

  const [addToCollection] = useAddPostToCollectionMutation();

  const [removePost] = useDeletePostMutation();
  const [toggleAllowComments] = useToggleAllowCommentsMutation();

  // const [, { isLoading }] = useAddToBookmarkMutation();

  // const [addFollower] = useFollowUserMutation();
  // const [unfollowUser] = useUnfollowUserMutation();
  const [view, setView] = useState<boolean>(false);

  const [showCollections, setShowCollections] = useState(false);
  // Hook manages isFollowing state and label consistently across app
  const { isFollowing, label, toggleFollow } = useFollow({
    targetUserId: post?.creator?.id,
    initialIsFollowing: false,
    postIdContext: post?.id,
  });
  const [report, setReport] = useState(false);
  const [reportComment, { isLoading, data, error: reportError }] = useReportCommentMutation()
  const [comment, setComment] = useState(false);
    const [toggle, setToggle] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  // pathname already defined above
  const handleAddToCollection = (collectionId: string) => {
    const formData = {
      post: post?.id,
      collection: collectionId,
    };
    addToCollection(formData)
      .unwrap()
      .then(() => {
        setShowCollections(false);
        // Toast({
        //   title: "Added to Collection",
        //   description: "Post has been added to your collection",
        //   status: "success",
        //   duration: 3000,
        // });
        alert("add to collection");
      })
      .catch(() => { });
  };

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  // Use the custom hook for like operations
  const {
    handleLikeClick,
    isLoading: isLikeLoading,
    error: likeError,
    isLiked,
    likeCount,
    unlikeCount,
    isUnliked,
    handleUnlikeClick,
  } = usePostLikes({ post, userId: user?.id, posts });

  const handleReportComment = () => {
    const formData = {

    }
    reportComment(formData).unwrap().then((res) => { console.log(res) }).catch((err) => { console.log(err) })
  }


  const handleFollow = () => toggleFollow();
  const toggleComment = () => {
    if (pathname.startsWith("/posts/")) {
      console.log(post, "path", "cliking");
      setComment(true);
    } else if (pathname.startsWith("/home")) {
      router.push(`/posts/${post?.id}`);
      setComment(true);
    }
  };

  useEffect(() => { }, [posts]);

  const isManagePage = pathname?.startsWith('/groups/manage'); // no longer required for gating creator actions

  const handleToggleComments = async () => {
    try {
      const desired = !(post?.allowComments ?? true);
      await toggleAllowComments({ postId: post.id, allow: desired }).unwrap();
      console.log(desired, "desired")
      dispatch(updateSinglePost({ postId: post.id, updates: { allowComments: desired } }));
      toaster.create({ description: desired ? 'Comments enabled' : 'Comments disabled', type: 'success', closable: true });
    } catch (e) {
      toaster.create({ description: 'Failed to update comments setting', type: 'error', closable: true });
    }
  };

  return (
    <Box
      key={post?.id}
      boxShadow={"xs"}
      pos={"relative"}
      zIndex={"base"}
      borderWidth={0.5}
      bg="bg_box"
      alignItems={"flex-start"}
      borderColor={"gray.50"}
      p={4}
      _selected={{
        bg: "transparent",
      }}
      rounded={"13px"}
    >
      {showCollections && (
        <AddToCollection
          isOpen={showCollections}
          handleSelection={handleAddToCollection}
          onClose={() => setShowCollections(false)}
        />
      )}
      <HStack alignItems={"flex-start"} justifyContent={"space-between"}>
        <HStack alignItems={"flex-start"}>
          <Avatar.Root shadow={"lg"} mx="4" w={10} h={10}>
            <Avatar.Fallback name={`${post?.creator?.fullName}`} />
            <Avatar.Image src={post?.creator?.profilePics} />
          </Avatar.Root>

          <VStack
            onClick={() => router.replace("/profile")}
            mb={1}
            align={"left"}
            gap={0}
            alignItems={"flex-start"}
          >
            <HStack>
              <Text
                fontSize={"1rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"600"}
              >
                {post?.creator?.fullName}
              </Text>
              <Text
                fontSize={"0.875rem"}
                fontFamily={"Outfit"}
                color={"grey.500"}
                fontWeight={"400"}
              >
                {post?.creator?.businessName}
              </Text>
            </HStack>
            {/* <Text
              fontSize={"12px"}
              fontFamily={"Outfit"}
              color={"grey.500"}
              fontWeight={"400"}
            >
              {post?.creator?.businessName}
            </Text> */}
            <Text
              fontSize={"12px"}
              pt="1"
              fontFamily={"Outfit"}
              color={"grey.500"}
              fontWeight={"400"}
            >
              {new Date(post?.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
          </VStack>
        </HStack>

        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="ghost" size="sm">
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                rounded={"md"}
                h={9}
                w={8}
                borderWidth={0.5}
                shadow={"xs"}
                borderColor={"grey.50"}
                aria-label="Options"
              >
                <IoEllipsisVerticalOutline size={12} color={"grey.500"} />
              </Stack>
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content bg="bg_box" rounded={"md"} shadow={"lg"}>
                {post?.creator?.id === user?.id ? (
                  <>
                    <Menu.Item
                      p={2}
                      value="toggle-comments"
                      onClick={handleToggleComments}
                    >
                      {(post?.allowComments ?? true)
                        ? "Disable comments"
                        : "Enable comments"}
                    </Menu.Item>
                    <Menu.Item
                      p={2}
                      value="delete"
                      onClick={() => {
                        setDeletePost(true);
                      }}
                    >
                      Delete Post
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item
                      onClick={handleFollow}
                      p={2}
                      value={isFollowing ? "unfollow" : "follow"}
                    >
                      {post?.isFollowingCreator ? "Unfollow" : label}
                    </Menu.Item>

                    <Menu.Item
                      cursor={"pointer"}
                      onClick={() => {
                        setReport(true);
                      }}
                      p={2}
                      value="report"
                    >
                      Report Post
                    </Menu.Item>
                  </>
                )}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      {/* conditionally truncate content */}
      <Box onClick={() => handlePostClick(post?.id)} cursor="pointer">
        <Text
          fontSize={"0.875rem"}
          fontFamily={"Outfit"}
          fontWeight={"500"}
          color={"text_primary"}
          style={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: isDetailPage ? "none" : "3",
          }}
        >
          {post?.content}
        </Text>

        {!isDetailPage && post?.content.length > 100 ? (
          <Text fontSize={"12px"} color="#FC731A" cursor={"pointer"} mt={1}>
            Read more
          </Text>
        ) : null}

        {size(post?.images) > 0 && (
          <HStack mt={5} alignItems={"stretch"} spaceX={4}>
            {post?.images.map((url, index) => (
              <Box flex={1} key={index}>
                <Image
                  h="200px"
                  w="full"
                  alt={`Post Image ${index}`}
                  objectFit={"cover"}
                  objectPosition={"center"}
                  rounded="6px"
                  src={url}
                />
              </Box>
            ))}
          </HStack>
        )}

        {/* Render video if present */}
        {post?.video && (
          <Box mt={5}>
            <video controls style={{ width: "100%", borderRadius: "6px" }}>
              <source src={post.video} />
              Your browser does not support the video tag.
            </video>
          </Box>
        )}
      </Box>

      <HStack mt={4} justifyContent={"space-between"}>
        {/* Error display for like operations */}
        {likeError && (
          <Box
            w="full"
            p={2}
            mb={2}
            bg="red.50"
            border="1px"
            borderColor="red.200"
            borderRadius="md"
            color="red.600"
            fontSize="sm"
          >
            {likeError}
          </Box>
        )}

        {/* Like Button */}
        <NewsAction
          icon={
            <Icon
              size={"md"}
              color={isLiked ? "blue.500" : "gray.400"}
              mr={"4"}
              transition="all 0.2s ease-in-out"
              _hover={{
                transform: "scale(1.1)",
                color: isLiked ? "blue.600" : "gray.500",
              }}
              // Show loading state
              opacity={isLikeLoading ? 0.6 : 1}
            >
              <FiThumbsUp />
            </Icon>
          }
          count={likeCount || 0}
          desc=""
          action={handleLikeClick}
          isDisabled={isLikeLoading}
        />

        {/* Unlike Button */}
        <NewsAction
          icon={
            <Icon
              size={"md"}
              color={isUnliked ? "red.500" : "gray.400"}
              mr={"4"}
              transition="all 0.2s ease-in-out"
              _hover={{
                transform: "scale(1.1)",
                color: isUnliked ? "red.600" : "gray.400",
              }}
              // Show loading state
              opacity={isLikeLoading ? 0.6 : 1}
            >
              <FiThumbsDown />
            </Icon>
          }
          count={unlikeCount || 0}
          desc=""
          action={handleUnlikeClick}
          isDisabled={isLikeLoading}
        />

        <NewsAction
          icon={
            <Icon
              size={"md"}
              mr={"4"}
              color={"gray.400"}
              transition="all 0.2s ease-in-out"
              _hover={{
                transform: "scale(1.1)",
                color: (post?.allowComments ?? true) ? "gray.500" : "gray.400",
              }}
              // Show loading state
              opacity={isLikeLoading ? 0.6 : 1}
            >
              <MessageSquareText size={10} />
            </Icon>
          }
          count={post?.commentCount}
          desc=""
          action={toggleComment}
          isDisabled={!(post?.allowComments ?? true)}
        />
        <NewsAction
          icon={
            <Icon size={"md"} color={"gray.400"} mr={"4"}>
              <FiEye />
            </Icon>
          }
          count={
            // Prefer the incremented value when on detail page; otherwise show the value from the post payload
            views?.data?.viewCount ?? post?.views ?? 0
          }
          desc=""
          action={() => {}}
        />

        <Menu.Root>
          <Menu.Trigger asChild>
            <Button bg="transparent" border={"none"} size="sm">
              <NewsAction
                icon={
                  <Icon size={"lg"} color={"gray.400"} mr={"4"}>
                    <BiShareAlt />
                  </Icon>
                }
                count={post?.shareCount}
                desc=""
              />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item p={2} value="new-txt">
                  <FacebookShareButton
                    url={"https://google.com"}
                    className="Demo__some-network__share-button"
                  >
                    <HStack>
                      <FacebookIcon size={24} round />
                      <Text>Facebook</Text>
                    </HStack>
                  </FacebookShareButton>
                </Menu.Item>
                <Menu.Item p={2} value="new-file">
                  <WhatsappShareButton
                    url={"https://gmail.com"}
                    title={"test title"}
                    separator=":: "
                    className="Demo__some-network__share-button"
                  >
                    <HStack>
                      <WhatsappIcon size={24} round />
                      <Text>Whatsapp</Text>
                    </HStack>
                  </WhatsappShareButton>
                </Menu.Item>
                <Menu.Item p={2} value="new-win">
                  <TwitterShareButton
                    url={"https://gmail.com"}
                    title={"test title"}
                    className="Demo__some-network__share-button"
                  >
                    <HStack>
                      <TwitterIcon size={24} round />
                      <Text>Twitter</Text>
                    </HStack>
                  </TwitterShareButton>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
        <ReportPost
          postId={post?.id}
          userId={user?.id}
          isOpen={report}
          onOpenChange={() => {
            setReport(false);
          }}
        />
        <DeletePost
          postId={post?.id}
          open={deletePost}
          onOpenChange={() => {
            setDeletePost(false);
          }}
        />
      </HStack>
    </Box>
  );
};

export default NewsItem;
