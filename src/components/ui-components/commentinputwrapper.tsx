import { Box, Flex, HStack, Image, Avatar, Textarea, VStack } from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useAddCommentMutation } from "mangarine/state/services/posts.service";
import { useMemo, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { incrementCommentCount } from "mangarine/state/reducers/post.reducer";
import { MdInsertPhoto } from "react-icons/md";
import FeedAction from "./feedaction";

const smily = "/icons/smily.svg";
const tag = "/icons/tag.svg";

interface CommentInputWrapperProps {
  postId: string | string[];
}

const CommentInputWrapper: React.FC<CommentInputWrapperProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [addComment, { isLoading }] = useAddCommentMutation();
  const [, setErrorMessage] = useState("");
  const emojiRef = useRef(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useClickAway(emojiRef, () => setShowPicker(false));
  const [showPicker, setShowPicker] = useState(false);

  const numericPostId = useMemo(() => {
    return Array.isArray(postId) ? postId[0] : postId;
  }, [postId]);

  if (!numericPostId) return <div>Invalid post ID</div>;

  const onEmojiClick = (emojiObject) => {
    setComment(`${comment} ${emojiObject.emoji}`);
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() === "") return;
    try {
      await addComment({ postId: numericPostId, userId: user.id, comment }).unwrap();
      setComment("");
      setIsActive(false);
      if (numericPostId) dispatch(incrementCommentCount({ postId: numericPostId as string }));
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to add the comment.");
    }
  };

  return (
    <Flex alignItems="flex-start" gap={4} my={6} alignSelf="stretch">
      <Avatar.Root w={8} h={8} mt={1}>
        <Avatar.Fallback name={`${user?.fullName}`} />
        <Avatar.Image src={user?.profilePics} />
      </Avatar.Root>

      <VStack flex={1} gap={0} rounded="lg" borderWidth={1} borderColor="gray.200" overflow="hidden" p={2}>
        <Textarea
          variant="subtle"
          placeholder="Add a comment..."
          resize="none"
          bg="transparent"
          focusRing="none"
          focusRingColor="transparent"
          _focus={{ outline: "none", boxShadow: "none" }}
          color="text_primary"
          shadow="none"
          border="none"
          minH={isActive ? "80px" : "40px"}
          transition="min-height 0.2s"
          value={comment}
          onFocus={() => setIsActive(true)}
          onChange={(e) => setComment(e.target.value)}
        />

        {isActive && (
          <HStack w="full" px={3} pb={2} justifyContent="space-between" borderTopWidth={1} borderColor="gray.100" pt={2}>
            <HStack spaceX={1}>
              <Box>
                <FeedAction icon="/icons/img.svg" action={() => fileInputRef.current?.click()} />
                <input type="file" ref={fileInputRef} accept="image/*" style={{ display: "none" }} />
              </Box>
              <Box pos="relative">
                <FeedAction icon={smily} action={() => setShowPicker(!showPicker)} />
                <Box ref={emojiRef} pos="absolute" bottom="100%" left={0} zIndex="max">
                  {showPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
                </Box>
              </Box>
            </HStack>

            <Button
              size="sm"
              borderRadius="lg"
              px={5}
              onClick={handleCommentSubmit}
              bg={comment ? "#111D4A" : "transparent"}
              borderWidth={comment ? "2px" : "1px"}
              borderColor={comment ? "#FC731AF7" : "gray.300"}
              color={comment ? "white" : "gray.400"}
              loading={isLoading}
              disabled={!comment.trim()}
              transition="all 0.2s"
            >
              Send
            </Button>
          </HStack>
        )}
      </VStack>
    </Flex>
  );
};

export default CommentInputWrapper;
