import React from 'react';
import { Box, Flex, Image, RatingGroup, Text } from '@chakra-ui/react';
import { isEmpty } from 'es-toolkit/compat';
import RatingEmptyState from './ratingempty';
// import { StarIcon } from '@chakra-ui/icons';

interface ReviewItemProps{
  profilePic?: string;
  name?: string;
  rating?: number;
  review?: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  profilePic,
  name,
  review,
}) => (
  <Box mb={6}>
    <Flex alignItems="center" mb={3}>
      <Image
        src={profilePic}
        alt="user photo"
        boxSize="50px"
        borderRadius="full"
        mr={3}
      />
      <Box>
        <Text fontWeight="bold" color="text_primary">
          {name}
        </Text>
        <Flex alignItems="center" mb={2}>

          <RatingGroup.Root>
            <RatingGroup.Control>
              {Array.from({ length: 5 }).map((_, index) => (
                <RatingGroup.Item key={index} index={index + 1}>
                  <RatingGroup.ItemIndicator
                  color="yellow.50"
                    // color={index < rating ? "yellow.400" : "red.300"}
                    mr={1}
                  />
                </RatingGroup.Item>
              ))}
            </RatingGroup.Control>
          </RatingGroup.Root>
        </Flex>
        <Text color="text_primary">{review}</Text>
      </Box>
    </Flex>
  </Box>
);

interface RatingAndReviewComponentProps {
  reviews: ReviewItemProps[];
}

const RatingAndReviewComponent: React.FC<RatingAndReviewComponentProps> = ({ reviews }) => (
  <Box maxW={{ base: '100%', md: '800px', lg: '900px' }} >
    {
      !isEmpty(reviews) ?(<RatingEmptyState/>):    reviews.map((review, index) => (
      <ReviewItem key={index}  />
    ))}


  </Box>
);

export default RatingAndReviewComponent;