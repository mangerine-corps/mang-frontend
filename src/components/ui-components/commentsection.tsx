import {
  Box,
  HStack,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useGetPostCommentsQuery } from "mangarine/state/services/posts.service";

import { useMemo, useState } from "react";

import CommentItem from "./commentitem";
import CommentList from "./commentdrawer";

interface CommentSectionProps {
  post: any;
}

const CommentSection = ({ post }: CommentSectionProps) => {
  const { data, isLoading } = useGetPostCommentsQuery({ postId: post.id });
  const [deletedIds, setDeletedIds] = useState<Set<any>>(new Set());
  const [showMore, setShowMore] = useState(false);

  const handleCommentDeleted = (id: string | number) => {
    setDeletedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  // Derive the comment list directly from RTK Query data — no local copy that can go stale.
  // Handles both flat ({ data: [...] }) and nested ({ data: { data: [...] } }) API shapes.
  const allComments: any[] = useMemo(() => {
    if (!data) return [];
    const raw = data?.data;
    const list: any[] = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
      ? raw.data
      : [];
    return deletedIds.size > 0 ? list.filter((c: any) => !deletedIds.has(c?.id)) : list;
  }, [data, deletedIds]);

  const hasComments = allComments.length > 0;
  const visibleComments = allComments.length > 2 ? allComments.slice(0, 2) : allComments;

  return (
    <VStack alignItems={"flex-start"} w="full" px="6">
      {isLoading ? (
        <>
          <HStack
            w="100%"
            alignItems={"flex-start"}
            justifyContent={"Flex-start"}
          >
            <SkeletonCircle size="10" />
            <VStack w="full" alignItems={"flex-start"} spaceY="2">
              <Skeleton height="3" width="40%" />
              <Skeleton height="3" width="30%" />
              <Skeleton height="3" width="50%" />
            </VStack>
          </HStack>
          <HStack
            w="100%"
            py="4"
            alignItems={"flex-start"}
            justifyContent={"Flex-start"}
          >
            <SkeletonCircle size="10" />
            <VStack w="full" alignItems={"flex-start"} spaceY="2">
              <Skeleton height="3" width="40%" />
              <Skeleton height="3" width="30%" />
              <Skeleton height="3" width="50%" />
            </VStack>
          </HStack>
          <HStack
            w="100%"
            py="4"
            alignItems={"flex-start"}
            justifyContent={"Flex-start"}
          >
            <SkeletonCircle size="10" />
            <VStack w="full" alignItems={"flex-start"} spaceY="2">
              <Skeleton height="3" width="40%" />
              <Skeleton height="3" width="30%" />
              <Skeleton height="3" width="50%" />
            </VStack>
          </HStack>
        </>
      ) : (
        <VStack w="full" gap="2">
          {hasComments ? (
            <VStack w="full" alignItems={"flex-start"}>
              {visibleComments.map((comment: any) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  post={post}
                  onDeleted={handleCommentDeleted}
                />
              ))}
              {allComments.length > 2 && (
                <Text
                  onClick={() => setShowMore(true)}
                  cursor="pointer"
                  fontFamily="Outfit"
                  fontSize="0.875rem"
                  fontWeight="500"
                  color="text_primary"
                >
                  See More
                </Text>
              )}
            </VStack>
          ) : (
            <VStack w="full" py="6" gap="3">
              <Box
                w="101px"
                h="80px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src="/message.png"
                  alt="No comments"
                  w="101px"
                  h="80px"
                />
              </Box>
              <Text
                fontFamily="Outfit"
                fontSize="1rem"
                fontWeight="600"
                color="text_primary"
              >
                No comment yet !
              </Text>
              <Text
                fontFamily="Outfit"
                fontSize="0.875rem"
                fontWeight="400"
                color="grey.500"
              >
                Be the first to comment
              </Text>
            </VStack>
          )}
        </VStack>
      )}
      <CommentList open={showMore} onOpenChange={() => setShowMore(false)} data={allComments} post={post} />
    </VStack>
  );
};

export default CommentSection;
