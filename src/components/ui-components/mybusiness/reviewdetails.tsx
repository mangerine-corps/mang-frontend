import {
  Box,
  HStack,
  Image,
  RatingGroup,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
  Button,
} from "@chakra-ui/react";
import { DEFAULT_AVATAR } from "mangarine/lib/constants";
import CustomButton from "mangarine/components/customcomponents/button";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import ShareReview from "../sharereview";
import { useGetConsultantReviewsQuery, useReplyToReviewMutation } from "mangarine/state/services/ratings.service";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { format } from "date-fns";

type ReviewCardProps = {
  review: any;
};

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [showReply, setShowReply] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyToReview, { isLoading: isReplying }] = useReplyToReviewMutation();

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await replyToReview({ reviewId: review.id, reply: replyText }).unwrap();
      setReplyText("");
      setShowReply(false);
    } catch {}
  };

  return (
    <Box
      w="100%"
      mx="auto"
      p={4}
      boxShadow="md"
      borderRadius="md"
      bg="main_background"
      py="5"
    >
      <HStack w="full" justifyContent="flex-start" alignItems="flex-start">
        <HStack w="40">
          <Stack
            bg="grey.100"
            justifyContent="center"
            alignItems="center"
            h="12"
            w="12"
            rounded="full"
          >
            <Image
              h="full"
              w="full"
              rounded="full"
              src={review.user?.profilePics || DEFAULT_AVATAR}
              alt="reviewer"
            />
          </Stack>
          <VStack align="start">
            <Text color="grey.500" textWrap="nowrap" fontSize="0.875rem" fontWeight="400">
              {review.user?.fullName || "Anonymous"}
            </Text>
            <Text color="text_primary" textWrap="nowrap" fontSize="0.625rem" fontWeight="600">
              {review.createdAt ? format(new Date(review.createdAt), "MMMM dd, yyyy") : ""}
            </Text>
          </VStack>
        </HStack>

        <VStack px="4" pb="4" justifyContent="flex-start" alignItems="flex-start">
          <RatingGroup.Root count={5} value={review.score ?? 0} readOnly colorScheme="yellow">
            <RatingGroup.HiddenInput />
            <RatingGroup.Control />
          </RatingGroup.Root>
          <Text color="text_primary" fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }} fontWeight="400">
            {review.comment || ""}
          </Text>
          {review.reply && (
            <Box mt={2} pl={4} borderLeftWidth="2px" borderColor="blue.200" w="full">
              <Text fontSize="0.8rem" color="grey.500" fontWeight="600">Your reply:</Text>
              <Text fontSize="0.8rem" color="text_primary">{review.reply}</Text>
            </Box>
          )}
        </VStack>
      </HStack>

      {showReply && (
        <Stack w="full" alignItems={{ base: "center", lg: "flex-end" }}>
          <Stack w="80%">
            <Text color="grey.500" fontSize="1rem" fontWeight="400">
              Reply to this review
            </Text>
            <Stack w="100%" borderWidth="1.5px" borderColor="grey.300" rounded="lg">
              <Textarea
                border="none"
                focusRing="none"
                outline="none"
                h="150px"
                w="full"
                p="4"
                resize="none"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <HStack alignItems="center" justifyContent="space-between" px="3">
                <HStack>
                  <Image src="/icons/smily.svg" alt="emoji" />
                  <Image pl="2" src="/icons/photos.svg" alt="photos" />
                </HStack>
                <Button variant="ghost" onClick={handleReply} loading={isReplying} disabled={!replyText.trim()}>
                  <Text color="text_primary" fontSize="1rem" fontWeight="600">
                    Reply
                  </Text>
                </Button>
              </HStack>
            </Stack>
          </Stack>
        </Stack>
      )}

      <HStack
        w="full"
        alignItems={{ base: "center", lg: "flex-end" }}
        justifyContent={{ base: "center", lg: "flex-end" }}
        flexDir="row"
        py="6"
      >
        <CustomButton
          customStyle={{ w: "25%", bg: "main_background", borderWidth: "2px" }}
          onClick={() => setShowShare(true)}
        >
          <Text color="text_primary" fontWeight="600" fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }} lineHeight="100%">
            Share Review
          </Text>
        </CustomButton>
        {!review.reply && (
          <CustomButton
            customStyle={{ w: "25%" }}
            onClick={() => setShowReply((v) => !v)}
          >
            <Text color="button_text" fontWeight="600" fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }} lineHeight="100%">
              Reply Review
            </Text>
          </CustomButton>
        )}
        <Box cursor="pointer" ml="0" bg="bg_box" py="2.5" px="2.5" shadow="sm" rounded="md">
          <Text fontSize="xl" fontWeight="600" color="text_primary">
            <FaHeart />
          </Text>
        </Box>
      </HStack>

      <ShareReview open={showShare} onOpenChange={() => setShowShare(false)} />
    </Box>
  );
};

const ReviewDetails = () => {
  const { user } = useAuth();
  const consultantId = user?.consultantProfile?.id || user?.id;

  const { data, isLoading } = useGetConsultantReviewsQuery(
    { consultantId },
    { skip: !consultantId }
  );

  const reviews: any[] = data?.data?.ratings ?? data?.data ?? [];

  return (
    <Box w="100%" mx="auto" p={4} boxShadow="md" borderRadius="md" bg="main_background" py="5">
      <Text fontSize={{ base: "1rem", md: "1.2rem", lg: "1.5rem" }} color="text_primary" fontWeight="600" py={2}>
        Recent Reviews
      </Text>

      {isLoading ? (
        <HStack justify="center" py={8}>
          <Spinner />
        </HStack>
      ) : reviews.length === 0 ? (
        <Text color="grey.500" fontSize="0.9rem" py={4}>No reviews yet.</Text>
      ) : (
        <VStack gap={4} w="full">
          {reviews.map((review: any) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default ReviewDetails;
