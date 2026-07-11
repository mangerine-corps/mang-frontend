import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";
import CommentItem from "./commentitem";
import CommentInputWrapper from "./commentinputwrapper";
import TopRightDrawer from "../ui/top-right-drawer";
import { safeProfilePic, imgErrorFallback } from "mangarine/lib/constants";

const CommentList = ({ open, onOpenChange, data, post }) => {
  const author = post?.creator;

  const title = (
    <HStack gap={3}>
      <Avatar.Root boxSize="36px" flexShrink={0}>
        <Avatar.Fallback name={author?.fullName ?? author?.businessName} />
        <Avatar.Image
          src={safeProfilePic(author?.profilePics)}
          onError={imgErrorFallback}
          alt={author?.fullName}
        />
      </Avatar.Root>
      <Text fontWeight="600" fontSize="md" color="text_primary">
        {author?.fullName ?? author?.businessName ?? "Comments"}
      </Text>
    </HStack>
  );

  return (
    <TopRightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      drawerWidth={{ base: "100vw", md: "420px" }}
      drawerMaxW={{ base: "100vw", md: "420px" }}
      drawerMaxH="80dvh"
      bodyProps={{ px: 0, pb: 0, display: "flex", flexDirection: "column", minH: "0" } as any}
    >
      {/* Scrollable comment list */}
      <Box
        flex={1}
        overflowY="auto"
        px={5}
        py={3}
        minH="0"
        css={{
          "&::-webkit-scrollbar": { width: "0px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "transparent" },
        }}
      >
        <VStack w="full" alignItems="flex-start" gap={3}>
          {data?.length > 0 ? (
            data.map((comment: any) => (
              <CommentItem key={comment.id} comment={comment} post={post} />
            ))
          ) : (
            <Box w="full" py={10} textAlign="center">
              <Text color="gray.400" fontSize="sm">No comments yet. Be the first!</Text>
            </Box>
          )}
        </VStack>
      </Box>

      {/* Pinned comment input */}
      <Box borderTopWidth="1px" borderColor="border_background" px={4} py={3} flexShrink={0}>
        <CommentInputWrapper postId={post?.id} />
      </Box>
    </TopRightDrawer>
  );
};

export default CommentList;
