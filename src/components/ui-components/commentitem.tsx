import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  Portal,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { isEmpty, size } from "es-toolkit/compat";

import { useAuth } from "mangarine/state/hooks/user.hook";
import {
  deleteCommentOnPost,
  followCreator,
  likeComment,
  Post,
  replyToComment,
  unfollowCreator,
  unlikeComment,
} from "mangarine/state/reducers/post.reducer";
import {
  useGetCommentRepliesQuery,
  useLikeCommentMutation,
  useReplyToCommentMutation,
  useUnlikeCommentMutation,
  useDeleteCommentMutation,
} from "mangarine/state/services/posts.service";
import { useEffect, useRef, useState } from "react";
import { FiThumbsUp } from "react-icons/fi";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { useFollowUserMutation } from "mangarine/state/services/posts.service";
import { toaster } from "mangarine/components/ui/toaster";

import { useDispatch } from "react-redux";
import { useClickAway } from "react-use";
import ReportComment from "./modals/reportcomment";

const smily = "/icons/smily.svg";

const CommentItem = ({
  comment,
  post,
  onDeleted,
}: {
  comment: any;
  post: Post;
  onDeleted?: (id: string | number) => void;
}) => {
  const [addReplyToComment] = useReplyToCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const { user } = useAuth();
  const [likeCommentApi] = useLikeCommentMutation();
  const [replies, setReplies] = useState<any[]>([]);
  const [report, setReport] = useState<boolean>(false);
  // Determine if current user is an admin (group/community creator)
  const isAdmin =
    user?.id === (post as any)?.group?.creator?.id ||
    user?.id === (post as any)?.community?.creator?.id;

  const {
    data,
    refetch,
    isLoading: replyLoading,
  } = useGetCommentRepliesQuery({
    commentId: comment.id,
  });

  useEffect(() => {
    if (!isEmpty(data)) {
      const { data: replies } = data;
      setReplies(replies);
    }
  }, [data]);

  const [unlikeCommentApi] = useUnlikeCommentMutation();
  const [likedComments, setLikedComments] = useState<Record<number, boolean>>(
    {}
  ); // track liked comments
  const dispatch = useDispatch();
  const [, setCurrentPost] = useState<Post>(post);
  const [reply, setReply] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [addFollower] = useFollowUserMutation();
  const emojiRef = useRef(null);

  useClickAway(emojiRef, () => {
    setShowPicker(false);
  });

  const [showPicker, setShowPicker] = useState(false);
  const [follow, setFollow] = useState(false);
  const { id: creatorId } = post?.creator || {};
  const onEmojiClick = (emojiObject) => {
    setReplyText(`${replyText} ${emojiObject.emoji}`);
  };

  // start likecount from 0
  // const [likes, setLikes] = useState<Record<number, number>>();

  const handleReplySubmit = (commentId: number) => {
    if (!replyText.trim()) {
      setErrorMessage("Reply content cannot be empty.");
      return;
    }

    if (!user || !user.id) {
      setErrorMessage("User is not authenticated.");
      console.log(errorMessage, "error");
      return;
    }

    addReplyToComment({
      commentId: String(commentId),
      userId: user.id,
      reply: replyText,
    })
      .unwrap()
      .then((response: any) => {
        dispatch(
          replyToComment({
            commentId: commentId.toString(),
            reply: response,
            postId: "",
          })
        );
        // update the replies in the local state
        // const updatedComments = comments.map((comment) => {
        //   if (comment.id === commentId) {
        //     return {
        //       ...comment,
        //       replies: [...(comment.replies || []), response], // append the new reply
        //     };
        //   }
        //   return comment;
        // });

        // update the post comments with new replies
        setCurrentPost((prevPost) => ({
          ...prevPost,
          comments: {},
        }));
        refetch();
        setReplyText("");
        setReply(null);
      })
      .catch((error: any) => {
        setErrorMessage(error.message || "Failed to reply to comment");
      });
  };

  //   const handleDeleteComment = async (commentId: number) => {
  //     try {
  //       await deleteComment(commentId).unwrap().then((res)=>{console.log(res)
  //      toaster.create({
  //         title: "Success",
  //         description: "Comment deleted successfully",
  //         type: "success",
  //       })
  //       }).catch (error: any) {
  //       console.error("Failed to delete comment:", error);
  //       toaster.create({
  //         title: "Error",
  //         description: error.message || "Failed to delete comment",
  //         type: "error",
  //       });
  //     }
  //   }
  // }

  const handleDeleteComment = (commentId, post) => {
    const postId = post.id;
    deleteComment(commentId)
      .unwrap()
      .then((res) => {
        console.log(res);
        dispatch(deleteCommentOnPost({ commentId, postId }));
        toaster.create({
          description: "Comment deleted",
          type: "success",
          closable: true,
        });
        try {
          if (typeof onDeleted === "function") onDeleted(commentId);
        } catch {}
      })
      .catch((err) => console.log(err));
  };
  const handleLikeComment = async (commentId: number) => {
    const userId = user?.id;

    if (!userId) {
      return;
    }

    if (likedComments[commentId]) {
      // unlike the comment
      unlikeCommentApi({ commentId, userId })
        .unwrap()
        .then((response: any) => {
          dispatch(unlikeComment(response.data));
          // setLikes((prevLikes) => ({
          //   ...prevLikes,
          //   [commentId]: Math.max((prevLikes[commentId] || 0) - 1, 0),
          // }));
          setLikedComments((prev) => ({ ...prev, [commentId]: false }));
        })
        .catch((error: any) => {
          console.error("Failed to like comment:", error);
        });
    } else {
      // like the comment
      likeCommentApi({ commentId, userId })
        .unwrap()
        .then((response: any) => {
          dispatch(likeComment(response.data));
          // setLikes((prevLikes) => ({
          //   ...prevLikes,
          //   [commentId]: (prevLikes[commentId] || 0) + 1,
          // }));
          setLikedComments((prev) => ({ ...prev, [commentId]: true })); // mark as liked
        })
        .catch((error: any) => {
          console.error("Failed to like comment:", error);
        });
    }
  };
  const handleFollow = () => {
    const { id: creatorId } = post?.creator || {};

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    if (!creatorId) {
      console.error("No creator to follow/unfollow");
      return;
    }

    if (user?.id === creatorId) {
      toaster.create({
        description: "You cannot follow yourself",
        type: "error",
        closable: true,
      });
      return;
    }

    addFollower({ targetUserId: creatorId })
      .unwrap()
      .then((result) => {
        const isFollowing = Boolean(result?.isFollowing);

        setFollow(isFollowing);
        toaster.create({
          description: isFollowing
            ? "User followed successfully"
            : "User unfollowed successfully",
          type: isFollowing ? "success" : "info",
          closable: true,
        });

        const postId = (post as any)?.id;
        if (postId) {
          if (isFollowing) {
            dispatch(followCreator({ postId, creatorId }));
          } else {
            dispatch(unfollowCreator({ postId, creatorId }));
          }
        }
      })
      .catch((error) => {
        console.error("Error following/unfollowing creator:", error);
      });
  };
  return (
    <Box
      pos={"relative"}
      // shadow="sm"
      // borderWidth={0.3}
      // borderColor={"gray.50"}
      w="full"
      mb="4px"
    >
      <HStack justifyContent={"space-between"} alignItems={"flex-start"}>
        <HStack alignItems={"flex-start"}>
          <Flex alignItems="center">
            {/* <Image
              src={
                comment.author?.profilePics || "/assets/images/postmodal.svg"
              }
              alt="profile pictures"
              boxSize="40px"
              borderRadius="full"
              //   name={comment.author?.fullName}
            /> */}
            <Avatar.Root shadow={"lg"} mx="4" w={10} h={10}>
              <Avatar.Fallback name={`${comment.author?.fullName}`} />
              <Avatar.Image src={comment.author?.profilePics} />
            </Avatar.Root>
          </Flex>

          <VStack alignItems={"flex-start"}>
            <VStack>
              <Text
                fontSize="sm"
                color="text_primary"
                fontWeight="semibold"
                mr="4px"
              >
                {comment.author?.fullName}
              </Text>
              <Text fontSize="sm" color="grey.500">
                {new Date(comment.createdAt).toLocaleString()}
              </Text>
            </VStack>

            <Text mt="8px" color="text_primary">
              {comment.comment}
            </Text>

            <Flex mt="4px" alignItems="center">
              {/* <Text fontSize="sm">{likes[comment.id]}</Text> */}

              <IconButton
                bg="transparent"
                cursor="pointer"
                onClick={() => handleLikeComment(comment.id)}
              >
                <Icon size={"lg"} color={"gray.400"} mr={"4"}>
                  <FiThumbsUp />
                </Icon>
              </IconButton>
              {/* <Image
                src={thumbsup}
                alt="like icon"
                boxSize={4}
                cursor="pointer"
                onClick={() => handleLikeComment(comment.id)}
              /> */}
              <Text
                ml="12px"
                fontSize="sm"
                color="text_primary"
                cursor="pointer"
                onClick={() => setReply(comment.id)}
              >
                Reply
              </Text>
            </Flex>
          </VStack>
        </HStack>

        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="outline" size="sm">
              <Stack
                justifyContent={"center"}
                alignItems={"center"}
                rounded={"md"}
                h={10}
                w={8}
                borderWidth={0.5}
                // shadow={"sm"}
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
                p="2"
                bg="main_background"
                rounded="md"
                color="text_primary"
                spaceY={"2"}
              >
                {user?.id !== creatorId ||
                  (comment.author?.id && (
                    <Menu.Item value="new-txt-a" onClick={handleFollow}>
                      Follow
                    </Menu.Item>
                  ))}

                <Menu.Item
                  value="new-file-a"
                  onClick={() => {
                    setReport(true);
                  }}
                >
                  Report Comment
                </Menu.Item>
                {(user?.id === comment.author?.id || isAdmin) && (
                  <Menu.Item
                    value="delete-comment"
                    onClick={() => handleDeleteComment(comment.id, post)}
                    color="red.500"
                  >
                    Delete Comment
                  </Menu.Item>
                )}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      {/* comment content */}

      {/* like and reply section */}

      {reply === comment.id && (
        <Flex mt="8px">
          <Flex w="full" position="relative">
            <Textarea
              placeholder="Write a reply..."
              value={replyText}
              w="full"
              p={1}
              pl="3"
              color="text_primary"
              onChange={(e) => setReplyText(e.target.value)}
              resize="none"
              pr="40px" // padding to prevent overlap with icons
            />
            <IconButton
              onClick={() => setShowPicker(!showPicker)}
              pos={"absolute"}
              aria-label="Emoji"
              variant="ghost"
              size="sm"
              right="0"
            >
              {<Image src={smily} alt="Add emoji" />}
              <Box
                ref={emojiRef}
                display="flex"
                gap={2}
                position="absolute"
                right={4}
              >
                {showPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
              </Box>
            </IconButton>
          </Flex>
          <Text
            mt="2px"
            ml={2}
            color="orange.500"
            cursor="pointer"
            onClick={() => handleReplySubmit(comment.id)}
            textAlign="right"
          >
            Reply
          </Text>
        </Flex>
      )}

      {/* display replies if any */}
      {replyLoading && size(replies) > 0 ? (
        <HStack gap="5">
          <SkeletonCircle size="12" />
          <Stack flex="1">
            <Skeleton height="3" width="50%" />
            <Skeleton height="3" width="30%" />
          </Stack>
        </HStack>
      ) : (
        <Box mt="12px" pl="40px">
          {replies.slice(0, 3).map((reply: any, index: number) => (
            <Box key={`${comment.id}-${index}`} mb="8px">
              <Flex alignItems="center">
                <Image
                  src={reply.author?.profilePics || "/assets/postmodal.svg"}
                  boxSize="30px"
                  borderRadius="full"
                  alt="author_profile-pictures"
                  //   name={reply.author?.fullName || "Anonymous"}
                />
                <Box ml="8px">
                  <Text
                    fontWeight="md"
                    fontSize={"0.875rem"}
                    color="text_primary"
                  >
                    {reply.author?.fullName || "Anonymous"}
                  </Text>
                  <Text fontSize="sm" fontWeight={"xs"} color="grey.600">
                    {reply.comment || "No comment content available"}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
          {size(replies) > 3 && (
            <Link textAlign={"right"} fontSize={"14px"} color="text_primary">
              {"See all"}
            </Link>
          )}
        </Box>
      )}
      <ReportComment
        userId={user?.id}
        isOpen={report}
        data={comment}
        onOpenChange={() => {
          setReport(false);
        }}
      />
    </Box>
  );
};

export default CommentItem;
