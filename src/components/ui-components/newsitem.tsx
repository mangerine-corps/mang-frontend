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
  useMarkNotInterestedMutation,
} from "mangarine/state/services/posts.service";
import { useAddPostToCollectionMutation } from "mangarine/state/services/bookmark.service";
import { Post, updateSinglePost, deletePost as removeFromFeed } from "mangarine/state/reducers/post.reducer";
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
          <Avatar.Root w={10} h={10} flexShrink={0} alignSelf="flex-start">
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
                  router.push(`/profile?profileId=${creatorId}`);
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
                      <HStack gap={2}>
                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.75 16.8615C0.75 14.4484 2.44732 12.393 4.75404 12.0127L4.96182 11.9784C6.80892 11.6739 8.69108 11.6739 10.5382 11.9784L10.746 12.0127C13.0527 12.393 14.75 14.4484 14.75 16.8615C14.75 17.9045 13.9315 18.75 12.9219 18.75H2.57813C1.56848 18.75 0.75 17.9045 0.75 16.8615Z" stroke="#6D6D6D" strokeWidth="1.5"/>
                          <path d="M11.8334 4.6875C11.8334 6.86212 10.0052 8.625 7.75002 8.625C5.49486 8.625 3.66669 6.86212 3.66669 4.6875C3.66669 2.51288 5.49486 0.75 7.75002 0.75C10.0052 0.75 11.8334 2.51288 11.8334 4.6875Z" stroke="#6D6D6D" strokeWidth="1.5"/>
                        </svg>
                        <Text>{isFollowing ? "Unfollow" : `Follow ${post?.creator?.fullName}`}</Text>
                      </HStack>
                    </Menu.Item>

                    <Menu.Item
                      cursor={"pointer"}
                      onClick={() => setReport(true)}
                      p={2}
                      value="report"
                    >
                      <HStack gap={2}>
                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13.342 7.46269C13.202 7.1821 13.202 6.84738 13.342 6.56579L15.895 1.45007C16.05 1.13941 16.033 0.770617 15.851 0.474996C15.669 0.180378 15.347 0 15 0H5C2.243 0 0 2.24772 0 5.01052V18.9979C0 19.5521 0.448 20 1 20C1.552 20 2 19.5521 2 18.9979V14.0295H15C15.347 14.0295 15.668 13.8491 15.851 13.5535C16.034 13.2579 16.05 12.8891 15.895 12.5784L13.342 7.46269ZM2 12.0252V5.01052C2 3.35304 3.346 2.00421 5 2.00421H13.382L11.553 5.66986C11.133 6.51163 11.133 7.51783 11.553 8.35959L13.382 12.0252H2Z" fill="#6D6D6D"/>
                        </svg>
                        <Text>Report this post</Text>
                      </HStack>
                    </Menu.Item>

                    <Menu.Item
                      p={2}
                      value="not-interested"
                      cursor="pointer"
                      onClick={() => {
                        markNotInterested(post?.id)
                          .unwrap()
                          .then(() => {
                            dispatch(removeFromFeed(post?.id));
                            toaster.create({
                              title: "Post hidden",
                              description: "You won't see this post in your feed anymore.",
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
                      <HStack gap={2}>
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="15" height="15" rx="7.5" stroke="#6D6D6D" strokeWidth="2"/>
                          <line x1="3.29289" y1="14.2929" x2="14.2929" y2="3.29289" stroke="#6D6D6D" strokeWidth="2"/>
                        </svg>
                        <Text>Not interested</Text>
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

        {!isDetailPage && post?.content.length > 100 ? (
          <Text fontSize={"12px"} color="#FC731A" cursor={"pointer"} mt={1}>
            Read more
          </Text>
        ) : null}

        {size(post?.images) > 0 && (() => {
          const imgs = post.images;
          const total = imgs.length;
          const remaining = total - 3;

          if (total === 1) {
            return (
              <Box
                mt={5} cursor="pointer" rounded="6px" overflow="hidden"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(0); }}
              >
                <Image h={{ base: "220px", md: "300px" }} w="full" objectFit="cover" objectPosition="center" src={imgs[0]} alt="Post image" />
              </Box>
            );
          }

          if (total === 2) {
            return (
              <Grid mt={5} templateColumns="1fr 1fr" gap={1}>
                {imgs.map((url, i) => (
                  <Box key={i} cursor="pointer" rounded="6px" overflow="hidden"
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  >
                    <Image h={{ base: "160px", md: "220px" }} w="full" objectFit="cover" objectPosition="center" src={url} alt={`Post image ${i + 1}`} />
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
                flex={1} cursor="pointer" rounded="6px" overflow="hidden" h="full"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(0); }}
              >
                <Image h="full" w="full" objectFit="cover" objectPosition="center" src={imgs[0]} alt="Post image 1" />
              </Box>
              {/* Right: two stacked */}
              <VStack flex={1} gap={1} h="full">
                <Box
                  flex={1} w="full" cursor="pointer" rounded="6px" overflow="hidden"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(1); }}
                >
                  <Image h="full" w="full" objectFit="cover" objectPosition="center" src={imgs[1]} alt="Post image 2" />
                </Box>
                <Box
                  flex={1} w="full" position="relative" cursor="pointer" rounded="6px" overflow="hidden"
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(2); }}
                >
                  <Image h="full" w="full" objectFit="cover" objectPosition="center" src={imgs[2]} alt="Post image 3" />
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

        <ImageLightbox
          images={post?.images ?? []}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />

        {post?.video && (
          <Box mt={5}>
            <video controls style={{ width: "100%", borderRadius: "6px" }}>
              <source src={post.video} />
              Your browser does not support the video tag.
            </video>
          </Box>
        )}
      </Box>

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
          action={handleLikeClick}
          isDisabled={isLikeLoading}
        />

        {/* Unlike Button */}
        <NewsAction
          icon={
            <Icon
              size={"md"}
              color={isUnliked ? "red.500" : "gray.400"}
              transition="all 0.2s ease-in-out"
              _hover={{
                transform: "scale(1.1)",
                color: isUnliked ? "red.600" : "gray.400",
              }}
              opacity={isLikeLoading ? 0.6 : 1}
            >
              <FiThumbsDown />
            </Icon>
          }
          count={unlikeCount || 0}
          desc="Dislikes"
          action={handleUnlikeClick}
          isDisabled={isLikeLoading}
        />

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

        <NewsAction
          icon={
            <Icon size={"md"} color={"gray.400"}>
              <FiEye />
            </Icon>
          }
          count={views?.data?.viewCount ?? post?.views ?? 0}
          desc="Views"
          action={() => {}}
        />

        <Menu.Root>
          <Menu.Trigger asChild>
            <Button bg="transparent" border={"none"} size="sm">
              <NewsAction
                icon={
                  <Icon size={"lg"} color={"gray.400"}>
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
