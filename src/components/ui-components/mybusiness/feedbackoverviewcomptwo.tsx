import { Box, HStack, Image, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";
import ReviewChart from "./reviewchart";
import ReviewDetails from "./reviewdetails";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useGetReviewSummaryQuery } from "mangarine/state/services/ratings.service";

const FeedbackOverviewcompTwo = () => {
  const { user } = useAuth();
  const consultantId = user?.consultantProfile?.id ?? user?.id ?? "";

  const { data, isLoading } = useGetReviewSummaryQuery({ consultantId }, { skip: !consultantId });

  const summary   = data?.data ?? data ?? null;
  const totalReviews  = summary?.totalReviews  ?? 0;
  const averageRating = summary?.averageRating ?? 0;

  return (
    <VStack>
      <HStack
        w="100%"
        mx="auto"
        p={4}
        flexDir={{ base: "column", md: "column", lg: "row", xl: "row" }}
        boxShadow="md"
        borderRadius="md"
        bg="main_background"
        alignItems="center"
        mb="4"
      >
        <Box w={{ base: "100%", md: "100%", lg: "50%" }}>
          <ReviewChart />
        </Box>

        <VStack w={{ base: "100%", md: "100%", lg: "50%" }} justifyContent="space-between" spaceY="2">
          {/* Total Reviews */}
          <Box w="100%" mx="auto" p={4} h="auto" boxShadow="sm" borderRadius="md" bg="main_background" py="6">
            <HStack w="full" justifyContent="space-between" alignItems="center">
              <VStack align="start">
                <Text color="grey.500" fontSize="1rem" fontWeight="400">Total Reviews</Text>
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <Text color="text_primary" fontSize="1.5rem" fontWeight="600">{totalReviews}</Text>
                )}
              </VStack>
              <Stack bg="#EEFBF3" justifyContent="center" alignItems="center" py="4" px="4" rounded="md">
                <Image src="/icons/tr.svg" alt="review-img" />
              </Stack>
            </HStack>
          </Box>

          {/* Average Ratings */}
          <Box w="100%" mx="auto" h="auto" p={4} boxShadow="sm" borderRadius="md" bg="main_background" py="6">
            <HStack w="full" justifyContent="space-between" alignItems="center">
              <VStack align="start">
                <Text color="grey.500" fontSize="1rem" fontWeight="400">Average Ratings</Text>
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <Text color="text_primary" fontSize="1.5rem" fontWeight="600">
                    {averageRating > 0 ? averageRating.toFixed(1) : "—"}
                  </Text>
                )}
              </VStack>
              <Stack bg="#F5F3FF" justifyContent="center" alignItems="center" py="4" px="4" rounded="md">
                <Image src="/icons/ar.svg" alt="rating-img" />
              </Stack>
            </HStack>
          </Box>
        </VStack>
      </HStack>

      <ReviewDetails />
    </VStack>
  );
};

export default FeedbackOverviewcompTwo;
