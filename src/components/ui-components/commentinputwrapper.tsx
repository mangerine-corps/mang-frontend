import { Box, Flex, HStack, Avatar, Text, Textarea, VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false, loading: () => null });
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useAddCommentMutation } from "mangarine/state/services/posts.service";
import { useMemo, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { incrementCommentCount } from "mangarine/state/reducers/post.reducer";
import FeedAction from "./feedaction";
import { useRouter } from "next/router";

const smily = "/icons/smily.svg";

interface CommentInputWrapperProps {
  postId: string | string[];
}

const CommentInputWrapper: React.FC<CommentInputWrapperProps> = ({ postId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [addComment, { isLoading }] = useAddCommentMutation();
  const [, setErrorMessage] = useState("");
  const emojiRef = useRef(null);
  const dispatch = useDispatch();
  useClickAway(emojiRef, () => setShowPicker(false));
  const [showPicker, setShowPicker] = useState(false);

  const numericPostId = useMemo(() => {
    return Array.isArray(postId) ? postId[0] : postId;
  }, [postId]);

  if (!numericPostId) return null;

  if (!user) {
    return (
      <Flex
        alignItems="center" gap={3} my={6} alignSelf="stretch"
        px={4} py={3} borderWidth={1} borderColor="border_background"
        borderRadius="lg" cursor="pointer"
        onClick={() => router.push("/auth/login")}
        _hover={{ bg: "bg_box" }}
      >
        <Avatar.Root w={8} h={8}>
          <Avatar.Fallback />
        </Avatar.Root>
        <Text fontSize="sm" color="text_muted">
          Sign in to leave a comment…
        </Text>
        <Button size="sm" ml="auto" bg="button_bg" color="button_text" borderRadius="lg" px={4} onClick={() => router.push("/auth/login")}>
          Sign in
        </Button>
      </Flex>
    );
  }

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
              borderWidth={0}
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
