import { Box, Button, Flex, Grid, HStack, Image, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import CreatePost from "./createpost";
import NewsItem from "./newsitem";
import { useGetUserPostsQuery } from "mangarine/state/services/posts.service";

type ProfileActivitySectionProps = {
  isOwnProfile?: boolean;
  profileId?: string;
  userId?: string;
};

const ProfileActivitySection = ({
  isOwnProfile = false,
  profileId,
  userId,
}: ProfileActivitySectionProps) => {
  const [activeTab, setActiveTab] = useState<"activity" | "images">("activity");
  const [openCreatePost, setOpenCreatePost] = useState(false);
  const [newlyCreated, setNewlyCreated] = useState<any[]>([]);

  const targetId = profileId ?? userId ?? "";

  const { data: userPostsData, isLoading: postsLoading } = useGetUserPostsQuery(
    { userId: targetId },
    { skip: !targetId, refetchOnMountOrArgChange: true }
  );

  const fetchedPosts: any[] = useMemo(() => {
    const raw = userPostsData?.data ?? userPostsData ?? [];
    return Array.isArray(raw) ? raw : (raw?.items ?? raw?.posts ?? []);
  }, [userPostsData]);

  // Merge newly created (not yet in API response) with fetched
  const allPosts = useMemo(() => {
    const fetchedIds = new Set(fetchedPosts.map((p: any) => p?.id));
    const fresh = newlyCreated.filter((p) => !fetchedIds.has(p?.id));
    return [...fresh, ...fetchedPosts];
  }, [newlyCreated, fetchedPosts]);

  const imagePosts = allPosts.flatMap((post) =>
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
    (activeTab === "activity" && allPosts.length === 0) ||
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

        {postsLoading ? (
          <VStack gap={4} align="stretch">
            {[1, 2, 3].map((i) => (
              <Box key={i} p={4} borderWidth="1px" borderColor="input_border" borderRadius="12px">
                <HStack gap={3} mb={3}>
                  <SkeletonCircle size="10" />
                  <VStack align="flex-start" gap={2} flex={1}>
                    <Skeleton h="3" w="40%" rounded="md" />
                    <Skeleton h="3" w="25%" rounded="md" />
                  </VStack>
                </HStack>
                <Skeleton h="3" w="full" rounded="md" mb={2} />
                <Skeleton h="3" w="80%" rounded="md" mb={2} />
                <Skeleton h="3" w="60%" rounded="md" />
              </Box>
            ))}
          </VStack>
        ) : showEmptyState ? (
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
                color="text_muted"
                fontSize={{ base: "0.95rem", lg: "1.05rem" }}
                lineHeight="1.8"
              >
                {activeTab === "activity" ? activityCopy : imageCopy}
              </Text>

              {isOwnProfile && (
                <Button
                  bg="button_bg"
                  color="button_text"
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
            {allPosts.map((post) => (
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
                bg="bd_background"
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
          setNewlyCreated((prev) => [post, ...prev]);
          setOpenCreatePost(false);
          setActiveTab("activity");
        }}
      />
    </>
  );
};

export default ProfileActivitySection;
