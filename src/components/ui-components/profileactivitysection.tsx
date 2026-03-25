import { Box, Button, Flex, Grid, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import CreatePost from "./createpost";
import NewsItem from "./newsitem";

type ProfileActivitySectionProps = {
  isOwnProfile?: boolean;
};

const ProfileActivitySection = ({
  isOwnProfile = false,
}: ProfileActivitySectionProps) => {
  const [activeTab, setActiveTab] = useState<"activity" | "images">("activity");
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [createdPosts, setCreatedPosts] = useState<any[]>([]);

  const imagePosts = createdPosts.flatMap((post) =>
    (post?.images || []).map((src: string, index: number) => ({
      id: `${post?.id || "post"}-${index}`,
      src,
    }))
  );

  const activityCopy = isOwnProfile
    ? "Your activity feed is currently empty. Once you start engaging, your recent actions and updates will appear here."
    : "This activity feed is currently empty. Once they start engaging, their recent actions and updates will appear here.";

  const imageCopy = isOwnProfile
    ? "Your image gallery is currently empty. Once you start sharing posts with images, they will appear here."
    : "This image gallery is currently empty. Once they start sharing posts with images, they will appear here.";

  const showEmptyState =
    (activeTab === "activity" && createdPosts.length === 0) ||
    (activeTab === "images" && imagePosts.length === 0);

  return (
    <>
      <Box
        w="full"
        mt={4}
        borderRadius="16px"
        bg="bg_box"
        boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
        px={{ base: 4, lg: 5 }}
        py={{ base: 4, lg: 5 }}
      >
        <HStack gap={8} alignItems="center" mb={6}>
          <Box
            cursor="pointer"
            borderBottom={activeTab === "activity" ? "2px solid #111D4A" : "2px solid transparent"}
            pb={2}
            onClick={() => setActiveTab("activity")}
          >
            <Text
              fontSize="0.95rem"
              fontWeight={activeTab === "activity" ? "600" : "400"}
              color={activeTab === "activity" ? "#111D4A" : "#8C8C8C"}
            >
              Activity Feed
            </Text>
          </Box>

          <Box
            cursor="pointer"
            borderBottom={activeTab === "images" ? "2px solid #111D4A" : "2px solid transparent"}
            pb={2}
            onClick={() => setActiveTab("images")}
          >
            <Text
              fontSize="0.95rem"
              fontWeight={activeTab === "images" ? "600" : "400"}
              color={activeTab === "images" ? "#111D4A" : "#8C8C8C"}
            >
              Images
            </Text>
          </Box>
        </HStack>

        {showEmptyState ? (
          <Flex
            minH={{ base: "280px", lg: "340px" }}
            alignItems="center"
            justifyContent="center"
            px={4}
          >
            <VStack gap={5} maxW="460px" textAlign="center">
              <Image
                src="/ghost.png"
                alt="Empty activity"
                maxW={{ base: "96px", lg: "128px" }}
                h="auto"
              />

              <Text
                color="#8C8C8C"
                fontSize={{ base: "0.95rem", lg: "1.05rem" }}
                lineHeight="1.8"
              >
                {activeTab === "activity" ? activityCopy : imageCopy}
              </Text>

              {isOwnProfile && (
                <Button
                  bg="#111D4A"
                  color="white"
                  px={6}
                  rounded="md"
                  onClick={() => setOpenCreatePost(true)}
                  _hover={{ bg: "#0D173B" }}
                >
                  Create First Post
                </Button>
              )}
            </VStack>
          </Flex>
        ) : activeTab === "activity" ? (
          <VStack gap={4} align="stretch">
            {createdPosts.map((post) => (
              <NewsItem key={post.id} post={post} />
            ))}
          </VStack>
        ) : (
          <Grid
            templateColumns={{ base: "repeat(2, minmax(0, 1fr))", lg: "repeat(3, minmax(0, 1fr))" }}
            gap={4}
          >
            {imagePosts.map((image) => (
              <Box
                key={image.id}
                overflow="hidden"
                rounded="12px"
                bg="#F6F7FB"
                aspectRatio={1}
              >
                <Image
                  src={image.src}
                  alt="Profile activity"
                  h="full"
                  w="full"
                  objectFit="cover"
                />
              </Box>
            ))}
          </Grid>
        )}
      </Box>

      <CreatePost
        open={openCreatePost}
        onOpenChange={() => setOpenCreatePost(false)}
        onCreated={(post) => {
          setCreatedPosts((prev) => [post, ...prev]);
          setOpenCreatePost(false);
          setActiveTab("activity");
        }}
      />
    </>
  );
};

export default ProfileActivitySection;
