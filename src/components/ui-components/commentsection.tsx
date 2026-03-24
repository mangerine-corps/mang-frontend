import {
  Box,
  Drawer,
  HStack,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { isEmpty, size } from "es-toolkit/compat";
import { useGetPostCommentsQuery } from "mangarine/state/services/posts.service";

import { useEffect, useState } from "react";

import CommentItem from "./commentitem";
import CommentList from "./commentdrawer";

// define types for post and comment
// interface Comment {
//   id: number;
//   author: {
//     fullName: string;
//     profilePics: string | null;
//     businessName: string | null;
//   };
//   comment: string;
//   likeCount: number;
//   replies?: Comment[];
// }

interface CommentSectionProps {
  post: any;
}

const CommentSection = ({ post }: CommentSectionProps) => {
  // const { user } = useAuth();

  const { data, isLoading } = useGetPostCommentsQuery({
    postId: post.id,
  });
  const [comments, setComments] = useState<any>([]);
  const [showMore, setShowMore] = useState<boolean>(false);
  const handleCommentDeleted = (id: string | number) => {
    setComments((prev) => (Array.isArray(prev) ? prev.filter((c: any) => c?.id !== id) : prev));
  };
  useEffect(() => {
    if (!isEmpty(data)) {
      const { data: comments } = data;
      setComments(comments);
    }
  }, [data]);

  const hasComments = Array.isArray(comments) && size(comments) > 0;
  const visibleComments =
    Array.isArray(comments) && size(comments) > 2
      ? comments.slice(0, 2)
      : comments;

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
              {size(comments) > 2 && (
                <Text
                  onClick={() => {
                    setShowMore(true);
                  }}
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
      <CommentList open={showMore} onOpenChange={()=>{setShowMore(false)}} data={comments} post={post}/>
    </VStack>
  );
};

export default CommentSection;
