import {
  Avatar,
  Box,
  Button,
  Grid,
  HStack,
  Icon,
  Image,
  Menu,
  Portal,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { memo, useEffect, useState } from "react";
import NextImage from "next/image";
import { useFollow } from "mangarine/hooks/useFollow";

import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { BsCollectionFill } from "react-icons/bs";
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
  useMarkNotInterestedMutation,
} from "mangarine/state/services/posts.service";
import { useAddToBookmarkMutation, useRemoveFromBookmarkMutation, useAddPostToCollectionMutation } from "mangarine/state/services/bookmark.service";
import { Post, updateSinglePost, deletePost as removeFromFeed } from "mangarine/state/reducers/post.reducer";
import NewsAction from "./newsaction";
import AddToCollection from "./addtocollection";
import { BiShareAlt } from "react-icons/bi";
import { FiThumbsUp, FiBookmark } from "react-icons/fi";
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
import { useReportCommentMutation, useGetPostCommentsQuery } from "../../state/services/posts.service";
import CommentList from "./commentdrawer";
import ImageLightbox from "./imagelightbox";
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
    skip: !isPostDetailRoute || !user,
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

  const [addToBookmark] = useAddToBookmarkMutation();
  const [removeBookmark] = useRemoveFromBookmarkMutation();
  const [addPostToCollection] = useAddPostToCollectionMutation();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(Boolean((post as any)?.isBookmarked));

  const handleBookmark = async () => {
    if (!user) { router.push("/auth/login"); return; }
    const prev = isBookmarked;
    setIsBookmarked(!prev);
    try {
      if (prev) {
        await removeBookmark({ postId: post.id }).unwrap();
        toaster.create({ description: "Removed from saved", type: "info", closable: true });
      } else {
        await addToBookmark({ postId: post.id }).unwrap();
        toaster.create({ description: "Post saved", type: "success", closable: true });
      }
    } catch {
      setIsBookmarked(prev);
      toaster.create({ description: "Failed to update saved post", type: "error", closable: true });
    }
  };

  const [removePost] = useDeletePostMutation();
  const [toggleAllowComments] = useToggleAllowCommentsMutation();
  const [markNotInterested] = useMarkNotInterestedMutation();

  // const [, { isLoading }] = useAddToBookmarkMutation();

  // const [addFollower] = useFollowUserMutation();
  // const [unfollowUser] = useUnfollowUserMutation();
  const [view, setView] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [showCollections, setShowCollections] = useState(false);
  // Hook manages isFollowing state and label consistently across app
  const { isFollowing, label, toggleFollow } = useFollow({
    targetUserId: post?.creator?.id,
    // Use followStatus from the post object if present; otherwise useFollow falls back to API check
    initialIsFollowing: post?.isFollowingCreator,
  });
  const [report, setReport] = useState(false);
  const [reportComment, { isLoading, data, error: reportError }] = useReportCommentMutation()
  const [comment, setComment] = useState(false);
    const [toggle, setToggle] = useState(false);
  const [deletePost, setDeletePost] = useState(false);
  // pathname already defined above
  const handleAddToCollection = (collectionId: string) => {
    if (!collectionId) return;
    addPostToCollection({ post: post?.id, collection: collectionId })
      .unwrap()
      .then(() => {
        setShowCollections(false);
        toaster.create({ description: "Post added to collection", type: "success", closable: true });
      })
      .catch(() => {
        toaster.create({ description: "Failed to add to collection", type: "error", closable: true });
      });
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
    reportComment(formData).unwrap().catch(() => {})
  }


  const requireAuth = (fn: () => void) => {
    if (!user) { router.push("/auth/login"); return; }
    fn();
  };

  const { data: commentsData } = useGetPostCommentsQuery(
    { postId: post?.id },
    { skip: !comment || !post?.id }
  );
  const commentsList: any[] = (commentsData as any)?.data ?? [];

  const handleFollow = () => requireAuth(() => toggleFollow());
  const toggleComment = () => requireAuth(() => setComment(true));

  useEffect(() => { }, [posts]);

  const isManagePage = pathname?.startsWith('/groups/manage'); // no longer required for gating creator actions

  const handleToggleComments = async () => {
    try {
      const desired = !(post?.allowComments ?? true);
      await toggleAllowComments({ postId: post.id, allow: desired }).unwrap();
      dispatch(updateSinglePost({ postId: post.id, updates: { allowComments: desired } }));
      toaster.create({ description: desired ? 'Comments enabled' : 'Comments disabled', type: 'success', closable: true });
    } catch (e) {
      toaster.create({ description: 'Failed to update comments setting', type: 'error', closable: true });
    }
  };

  return (
    <Box
      key={post?.id}
      boxShadow="none"
      pos={"relative"}
      zIndex={"base"}
      borderWidth={1}
      bg="bg_box"
      alignItems={"flex-start"}
      borderColor={"#E8E8E9"}
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
        <HStack alignItems={"flex-start"} flex={1}>
          <Avatar.Root
            w={10} h={10} flexShrink={0} alignSelf="flex-start"
            cursor="pointer"
            onClick={(e) => {
              e.stopPropagation();
              const creatorId = post?.creator?.id;
              if (!creatorId || creatorId === user?.id) {
                router.push("/profile");
              } else {
                router.push(`/profile/${creatorId}`);
              }
            }}
          >
            <Avatar.Fallback name={`${post?.creator?.fullName}`} />
            <Avatar.Image src={post?.creator?.profilePics} />
          </Avatar.Root>

          <VStack align={"left"} gap={0} alignItems={"flex-start"} flex={1}>
            <HStack
              onClick={() => {
                const creatorId = post?.creator?.id;
                if (!creatorId || creatorId === user?.id) {
                  router.push("/profile");
                } else {
                  router.push(`/profile/${creatorId}`);
                }
              }}
              mb={1}
              cursor="pointer"
            >
              <Text fontSize={"1rem"} fontFamily={"Outfit"} color={"text_primary"} fontWeight={"600"}>
                {post?.creator?.fullName}
              </Text>
              <Text fontSize={"0.875rem"} fontFamily={"Outfit"} color={"grey.500"} fontWeight={"400"}>
                {post?.creator?.businessName}
              </Text>
            </HStack>
            <Text fontSize={"12px"} fontFamily={"Outfit"} color={"grey.500"} fontWeight={"400"}>
              {(() => {
                const d = new Date(post?.createdAt);
                const now = new Date();
                const isToday =
                  d.getFullYear() === now.getFullYear() &&
                  d.getMonth() === now.getMonth() &&
                  d.getDate() === now.getDate();
                const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
                if (isToday) return time;
                const day = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                const yr = String(d.getFullYear()).slice(-2);
                return `${day} '${yr}, ${time}`;
              })()}
            </Text>
          </VStack>
        </HStack>

        <Menu.Root positioning={{ placement: "bottom-end" }}>
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
              <Menu.Content
                bg="bg_box"
                rounded="xl"
                shadow="lg"
                minW="220px"
                py={2}
                borderWidth="1px"
                borderColor="gray.100"
                overflow="hidden"
              >
                {post?.creator?.id === user?.id ? (
                  <>
                    <Menu.Item
                      px={4}
                      py={3}
                      value="save"
                      onClick={handleBookmark}
                      cursor="pointer"
                      _hover={{ bg: "bg_hover" }}
                    >
                      <HStack gap={3}>
                        <Icon size="sm" color={isBookmarked ? "#111D4A" : "gray.500"}>
                          <FiBookmark />
                        </Icon>
                        <Text fontSize="0.875rem" fontWeight="500" color="text_primary">
                          {isBookmarked ? "Unsave post" : "Save post"}
                        </Text>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item
                      px={4}
                      py={3}
                      value="add-to-collection"
                      onClick={() => setShowCollections(true)}
                      cursor="pointer"
                      _hover={{ bg: "bg_hover" }}
                    >
                      <HStack gap={3}>
                        <Icon size="sm" color="gray.500">
                          <BsCollectionFill />
                        </Icon>
                        <Text fontSize="0.875rem" fontWeight="500" color="text_primary">
                          Add to collection
                        </Text>
                      </HStack>
                    </Menu.Item>
                    <Box px={4}><Box h="1px" bg="gray.100" /></Box>
                    <Menu.Item
                      px={4}
                      py={3}
                      value="toggle-comments"
                      onClick={handleToggleComments}
                      cursor="pointer"
                      _hover={{ bg: "bg_hover" }}
                    >
                      <Text fontSize="0.875rem" fontWeight="500" color="text_primary">
                        {(post?.allowComments ?? true) ? "Disable comments" : "Enable comments"}
                      </Text>
                    </Menu.Item>
                    <Menu.Item
                      px={4}
                      py={3}
                      value="delete"
                      cursor="pointer"
                      _hover={{ bg: "red.50" }}
                      onClick={() => setDeletePost(true)}
                    >
                      <Text fontSize="0.875rem" fontWeight="500" color="red.500">
                        Delete Post
                      </Text>
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Item
                      onClick={handleFollow}
                      px={4}
                      py={3}
                      value={isFollowing ? "unfollow" : "follow"}
                      cursor="pointer"
                      _hover={{ bg: "bg_hover" }}
                    >
                      <HStack gap={3}>
                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.75 16.8615C0.75 14.4484 2.44732 12.393 4.75404 12.0127L4.96182 11.9784C6.80892 11.6739 8.69108 11.6739 10.5382 11.9784L10.746 12.0127C13.0527 12.393 14.75 14.4484 14.75 16.8615C14.75 17.9045 13.9315 18.75 12.9219 18.75H2.57813C1.56848 18.75 0.75 17.9045 0.75 16.8615Z" stroke="#6D6D6D" strokeWidth="1.5"/>
                          <path d="M11.8334 4.6875C11.8334 6.86212 10.0052 8.625 7.75002 8.625C5.49486 8.625 3.66669 6.86212 3.66669 4.6875C3.66669 2.51288 5.49486 0.75 7.75002 0.75C10.0052 0.75 11.8334 2.51288 11.8334 4.6875Z" stroke="#6D6D6D" strokeWidth="1.5"/>
                        </svg>
                        <Text fontSize="0.875rem" fontWeight="500" color="text_primary">
                          {isFollowing ? "Unfollow" : `Follow ${post?.creator?.fullName}`}
                        </Text>
                      </HStack>
                    </Menu.Item>

                    <Box px={4}><Box h="1px" bg="gray.100" /></Box>

                    <Menu.Item
                      px={4}
                      py={3}
                      value="save"
                      onClick={handleBookmark}
                      cursor="pointer"
                      _hover={{ bg: "bg_hover" }}
                    >
                      <HStack gap={3}>
                        <Icon size="sm" color={isBookmarked ? "#111D4A" : "gray.500"}>
                          <FiBookmark />
                        </Icon>
                        <Text fontSize="0.875rem" fontWeight="500" color="text_primary">
                          {isBookmarked ? "Unsave post" : "Save post"}
                        </Text>
                      </HStack>
                    </Menu.Item>
                    <Menu.Item
                      px={4}
                      py={3}
                      value="add-to-collection"
                      onClick={() => setShowCollections(true)}
                      cursor="pointer"
                      _hover={{ bg: "bg_hover" }}
                    >
                      <HStack gap={3}>
                        <Icon size="sm" color="gray.500">
                          <BsCollectionFill />
                        </Icon>
                        <Text fontSize="0.875rem" fontWeight="500" color="text_primary">
                          Add to collection
                        </Text>
                      </HStack>
                    </Menu.Item>

                    <Box px={4}><Box h="1px" bg="gray.100" /></Box>

                    <Menu.Item
                      cursor="pointer"
                      onClick={() => setReport(true)}
                      px={4}
                      py={3}
                      value="report"
                      _hover={{ bg: "bg_hover" }}
                    >
                      <HStack gap={3}>
                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.342 7.46269C13.202 7.1821 13.202 6.84738 13.342 6.56579L15.895 1.45007C16.05 1.13941 16.033 0.770617 15.851 0.474996C15.669 0.180378 15.347 0 15 0H5C2.243 0 0 2.24772 0 5.01052V18.9979C0 19.5521 0.448 20 1 20C1.552 20 2 19.5521 2 18.9979V14.0295H15C15.347 14.0295 15.668 13.8491 15.851 13.5535C16.034 13.2579 16.05 12.8891 15.895 12.5784L13.342 7.46269ZM2 12.0252V5.01052C2 3.35304 3.346 2.00421 5 2.00421H13.382L11.553 5.66986C11.133 6.51163 11.133 7.51783 11.553 8.35959L13.382 12.0252H2Z" fill="#6D6D6D"/>
                        </svg>
                        <Text fontSize="0.875rem" fontWeight="500" color="text_primary">
                          Report this post
                        </Text>
                      </HStack>
                    </Menu.Item>

                    <Menu.Item
                      px={4}
                      py={3}
                      value="not-interested"
                      cursor="pointer"
                      _hover={{ bg: "bg_hover" }}
                      onClick={() => {
                        markNotInterested(post?.id)
                          .unwrap()
                          .then(() => {
                            dispatch(removeFromFeed(post?.id));
                            toaster.create({
                              description: "This post won't be on your feed again.",
                              type: "success",
                              duration: 3000,
                              closable: true,
                            });
                          })
                          .catch(() => {
                            toaster.create({
                              title: "Something went wrong",
                              description: "Could not hide this post. Please try again.",
                              type: "error",
                              duration: 3000,
                              closable: true,
                            });
                          });
                      }}
                    >
                      <HStack gap={3}>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="15" height="15" rx="7.5" stroke="#6D6D6D" strokeWidth="2"/>
                          <line x1="3.29289" y1="14.2929" x2="14.2929" y2="3.29289" stroke="#6D6D6D" strokeWidth="2"/>
                        </svg>
                        <Text fontSize="0.875rem" fontWeight="500" color="text_primary">
                          Not interested
                        </Text>
                      </HStack>
                    </Menu.Item>
                  </>
                )}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      <Box onClick={() => handlePostClick(post?.id)} cursor="pointer" mt={3}>
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


        {size(post?.images) > 0 && (() => {
          const imgs = post.images;
          const total = imgs.length;
          const remaining = total - 3;

          if (total === 1) {
            return (
              <Box
                mt={5} cursor="pointer" rounded="6px" overflow="hidden" position="relative"
                h={{ base: "220px", md: "300px" }}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(0); }}
              >
                <NextImage src={imgs[0]} alt="Post image" fill sizes="(max-width: 768px) 100vw, 680px" style={{ objectFit: "cover", objectPosition: "center" }} />
              </Box>
            );
          }

          if (total === 2) {
            return (
              <Grid mt={5} templateColumns="1fr 1fr" gap={1}>
                {imgs.map((url, i) => (
                  <Box key={i} cursor="pointer" rounded="6px" overflow="hidden" position="relative"
                    h={{ base: "160px", md: "220px" }}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  >
                    <NextImage src={url} alt={`Post image ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 340px" style={{ objectFit: "cover", objectPosition: "center" }} />
                  </Box>
                ))}
              </Grid>
            );
          }

          // 3+ images: left large, right two stacked
          return (
            <HStack mt={5} gap={1} alignItems="stretch" h={{ base: "200px", md: "260px" }}>
              {/* Left: first image full height */}
              <Box
                flex={1} cursor="pointer" rounded="6px" overflow="hidden" h="full" position="relative"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(0); }}
              >
                <NextImage src={imgs[0]} alt="Post image 1" fill sizes="(max-width: 768px) 50vw, 340px" style={{ objectFit: "cover", objectPosition: "center" }} />
              </Box>
              {/* Right: two stacked */}
              <VStack flex={1} gap={1} h="full">
                <Box
                  flex={1} w="full" cursor="pointer" rounded="6px" overflow="hidden" position="relative"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(1); }}
                >
                  <NextImage src={imgs[1]} alt="Post image 2" fill sizes="(max-width: 768px) 50vw, 340px" style={{ objectFit: "cover", objectPosition: "center" }} />
                </Box>
                <Box
                  flex={1} w="full" position="relative" cursor="pointer" rounded="6px" overflow="hidden"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(2); }}
                >
                  <NextImage src={imgs[2]} alt="Post image 3" fill sizes="(max-width: 768px) 50vw, 340px" style={{ objectFit: "cover", objectPosition: "center" }} />
                  {remaining > 0 && (
                    <Box
                      position="absolute" inset={0} bg="rgba(0,0,0,0.55)"
                      display="flex" alignItems="center" justifyContent="center"
                    >
                      <Text color="white" fontWeight="700" fontSize={{ base: "1.25rem", md: "1.5rem" }}>
                        +{remaining}
                      </Text>
                    </Box>
                  )}
                </Box>
              </VStack>
            </HStack>
          );
        })()}

        {post?.video && (
          <Box mt={5}>
            <video controls style={{ width: "100%", borderRadius: "6px" }}>
              <source src={post.video} />
              Your browser does not support the video tag.
            </video>
          </Box>
        )}
      </Box>

      <ImageLightbox
        images={post?.images ?? []}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />

      {likeError && (
        <Box
          w="full"
          p={2}
          mt={2}
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

      <HStack mt={4} w="full" justifyContent="space-between" alignItems="center" px={1} py={2} borderTopWidth="1px" borderColor="border_background">
        {/* Like Button */}
        <NewsAction
          icon={
            <Icon
              size={"md"}
              color={isLiked ? "blue.500" : "gray.400"}
              transition="all 0.2s ease-in-out"
              _hover={{
                transform: "scale(1.1)",
                color: isLiked ? "blue.600" : "gray.500",
              }}
              opacity={isLikeLoading ? 0.6 : 1}
            >
              <FiThumbsUp />
            </Icon>
          }
          count={likeCount || 0}
          desc="Likes"
          action={() => requireAuth(handleLikeClick)}
          isDisabled={isLikeLoading}
        />

        {/* Dislike removed */}

        <NewsAction
          icon={
            <Icon
              size={"md"}
              color={"gray.400"}
              transition="all 0.2s ease-in-out"
              _hover={{
                transform: "scale(1.1)",
                color: (post?.allowComments ?? true) ? "gray.500" : "gray.400",
              }}
              opacity={isLikeLoading ? 0.6 : 1}
            >
              <MessageSquareText size={10} />
            </Icon>
          }
          count={post?.commentCount}
          desc="Comments"
          action={toggleComment}
          isDisabled={!(post?.allowComments ?? true)}
        />

<Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger asChild>
            <Button bg="transparent" border="none" size="sm" p={0}>
              <NewsAction
                icon={
                  <Icon size="md" color="gray.400">
                    <BiShareAlt />
                  </Icon>
                }
                count={post?.shareCount}
                desc="Shares"
              />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                bg="bg_box"
                borderWidth="1px"
                borderColor="border_background"
                rounded="2xl"
                boxShadow="0 8px 32px rgba(0,0,0,0.12)"
                p={4}
                minW="260px"
              >
                {/* Header */}
                <Text
                  fontFamily="Outfit"
                  fontWeight="600"
                  fontSize="0.95rem"
                  color="text_primary"
                  mb={4}
                  textAlign="center"
                >
                  Share post
                </Text>

                {/* Platform icons */}
                <HStack justify="center" gap={6} mb={5}>
                  <FacebookShareButton url={`${typeof window !== "undefined" ? window.location.origin : ""}/posts/${post?.id}`}>
                    <VStack gap={1} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.15s">
                      <FacebookIcon size={44} round />
                      <Text fontFamily="Outfit" fontSize="0.68rem" color="text_primary" fontWeight="500">Facebook</Text>
                    </VStack>
                  </FacebookShareButton>

                  <WhatsappShareButton url={`${typeof window !== "undefined" ? window.location.origin : ""}/posts/${post?.id}`} title={post?.content?.slice(0, 80) ?? ""}>
                    <VStack gap={1} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.15s">
                      <WhatsappIcon size={44} round />
                      <Text fontFamily="Outfit" fontSize="0.68rem" color="text_primary" fontWeight="500">WhatsApp</Text>
                    </VStack>
                  </WhatsappShareButton>

                  <TwitterShareButton url={`${typeof window !== "undefined" ? window.location.origin : ""}/posts/${post?.id}`} title={post?.content?.slice(0, 80) ?? ""}>
                    <VStack gap={1} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.15s">
                      <TwitterIcon size={44} round />
                      <Text fontFamily="Outfit" fontSize="0.68rem" color="text_primary" fontWeight="500">Twitter</Text>
                    </VStack>
                  </TwitterShareButton>
                </HStack>

                {/* Copy link row */}
                <Box
                  borderWidth="1px"
                  borderColor="border_background"
                  rounded="xl"
                  px={3}
                  py={2}
                  bg="main_background"
                >
                  <HStack gap={2}>
                    <Text
                      flex={1}
                      fontFamily="Outfit"
                      fontSize="0.78rem"
                      color="text_primary"
                      truncate
                      opacity={0.7}
                    >
                      {typeof window !== "undefined" ? `${window.location.origin}/posts/${post?.id}` : `/posts/${post?.id}`}
                    </Text>
                    <Button
                      size="xs"
                      bg="button_bg"
                      color="button_text"
                      borderRadius="8px"
                      fontFamily="Outfit"
                      fontWeight="600"
                      fontSize="0.75rem"
                      px={3}
                      flexShrink={0}
                      _hover={{ bg: "#0D173B" }}
                      onClick={() => {
                        const url = `${window.location.origin}/posts/${post?.id}`;
                        navigator.clipboard.writeText(url).then(() => {
                          toaster.create({ description: "Link copied!", type: "success", duration: 2000 });
                        }).catch(() => {});
                      }}
                    >
                      Copy
                    </Button>
                  </HStack>
                </Box>
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

      <CommentList
        open={comment}
        onOpenChange={() => setComment(false)}
        data={commentsList}
        post={post}
      />
    </Box>
  );
};

export default memo(NewsItem);
