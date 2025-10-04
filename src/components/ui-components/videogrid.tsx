import {
  Box,
  Image,
  Text,
  Grid,
  GridItem,
  HStack,
} from "@chakra-ui/react";

const videos = [
  {
    name: "Joseph Brenda",
    topic: "Interview Prompt",
    date: "23 Jan, 2024",
    image: "/images/consultation1.png",
  },
  {
    name: "Jerome Bell",
    topic: "Digital Marketing",
    date: "23 Jan, 2024",
    image: "/images/consultation2.png",
  },
  {
    name: "Esther Howard",
    topic: "Resume Building",
    date: "23 Jan, 2024",
    image: "/images/consultation3.png",
  },
  {
    name: "Jane Cooper",
    topic: "System Integration",
    date: "23 Jan, 2024",
    image: "/images/consultation4.png",
  },
  {
    name: "Guy Hawkins",
    topic: "Tech Support",
    date: "23 Jan, 2024",
    image: "/images/consultation5.png",
  },
  {
    name: "Eleanor Pena",
    topic: "Goal Setting",
    date: "23 Jan, 2024",
    image: "/images/consultation6.png",
  },
];

const VideoGrid = () => {
  return (
    <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(3, 1fr)",      }}
        gap={6}
      >
      {videos.map((video, index) => (
        <GridItem key={index}>
          <Box
          w={{ base: "100%", md: "100%", lg: "100%" }}
          h="full"
            borderRadius="16px"
            overflow="hidden"
            bg="bg_box"
            boxShadow="sm"
          >
            {/* Video Thumbnail */}
            <Box position="relative">
              <Image
                src={video.image}
                alt={video.name}
                objectFit="cover"
                w="100%"
                h="200px"
                cursor="pointer"
              />
              {/* Play Button */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                borderRadius="full"
                p={3}
              >
                <Image
                    src="/icons/play.svg"  
                    alt="Play Icon"
                    boxSize={10}

                    />
              </Box>
              {/* Duration Tag */}
              <Box
                position="absolute"
                bottom={2}
                right={2}
                px={2}
                py={1}
                fontSize="xs"
                bg="bg_box"
                color="text_primary"
                borderRadius="md"
              >
                1:35:43
              </Box>
            </Box>

            {/* Info Section */}
            <Box p={4}>
              <Text font="outfit" color="gray.500" fontWeight="600" fontSize="0.875rem">
                {video.name}
              </Text>
              <HStack justify="space-between" mt={1}>
                <Text font="outfit" color="text_primary" fontWeight="600" fontSize="0.875rem">
                  {video.topic}
                </Text>
                <Text fontSize="0.875rem" color="gray.500">
                  {video.date}
                </Text>
              </HStack>
            </Box>
          </Box>
        </GridItem>
      ))}
    </Grid>
  );
};

export default VideoGrid;
