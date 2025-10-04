import { Box, Flex, IconButton, Image, Avatar, Textarea } from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useAddCommentMutation } from "mangarine/state/services/posts.service";
import { useMemo, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Button } from "../ui/button";
import { GoArrowUp } from "react-icons/go";
import { useDispatch } from "react-redux";
import { incrementCommentCount } from "mangarine/state/reducers/post.reducer";

const smily = "/icons/smily.svg";

interface CommentInputWrapperProps {
  postId: string | string[];

}

const CommentInputWrapper: React.FC<CommentInputWrapperProps> = ({
  postId,
}) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [addComment, { isLoading }] = useAddCommentMutation();
  const [, setErrorMessage] = useState("");
  const emojiRef = useRef(null);
  const [, setShowCommentButton] = useState(false)
  const dispatch = useDispatch();

  useClickAway(emojiRef, () => {
    setShowPicker(false);
  });

  const [showPicker, setShowPicker] = useState(false);
  // const dispatch = useDispatch();

  const numericPostId = useMemo(() => {
    return Array.isArray(postId) ? postId[0] : postId;
  }, [postId]);

  if (!numericPostId) {
    console.error("Invalid postId:", postId);
    return <div>Invalid post ID</div>;
  }

  const onEmojiClick = (emojiObject) => {
    setComment(`${comment} ${emojiObject.emoji}`);
  };

  console.log(user);

  const handleCommentSubmit = async () => {
    if (comment.trim() === "") return;
    try {
      const newComment = {
        postId: numericPostId,
        userId: user.id,
        comment,
      };
      const response = await addComment(newComment).unwrap();
      console.log(response, "response");
      setComment("");
      // Optimistically bump the comment count for this post so UI reflects immediately
      if (numericPostId) {
        dispatch(incrementCommentCount({ postId: numericPostId as string }));
      }
    } catch (error: any) {
      console.error("What happened:", error);
      setErrorMessage(error.message || "Failed to add the comment.");
    }

  };

  return (
    <Flex alignItems="center" gap={4} my={6} alignSelf="stretch" rounded={"xs"}>
      <Avatar.Root>
        <Avatar.Fallback name={`${user?.fullName}`} />
        <Avatar.Image src={user?.profilePics} />
      </Avatar.Root>

      <Flex
        flex="1 0 0"
        alignItems="center"
        rounded={"lg"}
        borderWidth={1}
        borderColor={"gray.50"}
        shadow={"sm"}
        p={2}
        position="relative"
      >
        <Textarea
          variant="subtle"
          placeholder="Add a comment..."
          flex="1"
          as="textarea"
          resize="none"
          bg="transparent"
          focusRing={'none'}
          focusRingColor={'transparent'}
          ring={'none'}
          color="text_primary"
          shadow={'none'}
          ringColor={'transparent'}

          //   rows={1}
          //   isDisabled={isLoading}
          _focus={{ outline: "none", focusRing: 'none', focusRingColor: 'transparent' }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <IconButton
          onClick={() => setShowPicker(!showPicker)}
          pos={"relative"}
          aria-label="Emoji"
          variant="ghost"
          size="sm"
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

        {/* Icons */}
      </Flex>
      {
        setShowCommentButton &&
        <Box>
          <Button
            display="flex"
            size={"md"}
            onClick={handleCommentSubmit}
            bg={"primary.300"}
            justifyContent="center"
            alignItems="center"
            loading={isLoading}
            rounded={'full'}
            alignSelf="flex-end"
            color={"white"}
            width={{ base: "100%", md: "auto" }}
          >
            <GoArrowUp />
          </Button>
        </Box>
      }
    </Flex>
  );
};

export default CommentInputWrapper;
