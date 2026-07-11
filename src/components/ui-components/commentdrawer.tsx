import { Avatar, Box, CloseButton, Drawer, Flex, Text, VStack } from "@chakra-ui/react";
import CommentItem from "./commentitem";
import CommentInputWrapper from "./commentinputwrapper";
import { safeProfilePic, imgErrorFallback } from "mangarine/lib/constants";

const CommentList = ({ open, onOpenChange, data, post }) => {
  const author = post?.creator;

  return (
    <Drawer.Root size="md" open={open} onOpenChange={onOpenChange} placement="end">
      <Drawer.Backdrop />
      <Drawer.Positioner zIndex="max">
        <Drawer.Content display="flex" flexDirection="column">
          {/* Header */}
          <Drawer.Header borderBottomWidth="1px" py={4} px={5}>
            <Flex align="center" justify="space-between" w="full">
              <Flex align="center" gap={3}>
                <Avatar.Root boxSize="36px">
                  <Avatar.Fallback name={author?.fullName ?? author?.businessName} />
                  <Avatar.Image
                    src={safeProfilePic(author?.profilePics)}
                    onError={imgErrorFallback}
                    alt={author?.fullName}
                  />
                </Avatar.Root>
                <Text fontWeight="600" fontSize="md" color="text_primary">
                  {author?.fullName ?? author?.businessName ?? "View comment tread"}
                </Text>
              </Flex>
              <CloseButton onClick={() => onOpenChange({ open: false })} color="text_primary" />
            </Flex>
          </Drawer.Header>

          {/* Scrollable comment list */}
          <Drawer.Body
            flex={1}
            overflowY="auto"
            px={5}
            py={4}
            css={{
              "&::-webkit-scrollbar": { width: "0px" },
              "&::-webkit-scrollbar-track": { background: "transparent" },
              "&::-webkit-scrollbar-thumb": { background: "transparent" },
            }}
          >
            <VStack w="full" alignItems="flex-start" gap={4}>
              {data?.length > 0 ? (
                data.map((comment: any) => (
                  <CommentItem key={comment.id} comment={comment} post={post} />
                ))
              ) : (
                <Box w="full" py={10} textAlign="center">
                  <Text color="gray.400" fontSize="sm">No comments yet. Be the first to comment!</Text>
                </Box>
              )}
            </VStack>
          </Drawer.Body>

          {/* Comment input pinned at bottom */}
          <Drawer.Footer borderTopWidth="1px" py={3} px={4}>
            <CommentInputWrapper postId={post?.id} />
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default CommentList;
