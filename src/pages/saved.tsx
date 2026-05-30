import {
  Avatar,
  Box,
  Button,
  Dialog,
  HStack,
  Icon,
  Image,
  Input,
  Portal,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import NewsItem from "mangarine/components/ui-components/newsitem";
import {
  useGetBookmarksQuery,
  useGetCollectionQuery,
  useGetCollectionPostQuery,
  useCreateCollectionMutation,
} from "mangarine/state/services/bookmark.service";
import { useState } from "react";
import { useRouter } from "next/router";
import { BsBookmark, BsBookmarkFill, BsCollectionFill, BsPlus } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";

const SkeletonPost = () => (
  <Box bg="bg_box" rounded="xl" p={4}>
    <HStack gap={3} mb={3}>
      <SkeletonCircle size="10" />
      <VStack align="start" flex={1} gap={1}>
        <Skeleton h="3" w="35%" />
        <Skeleton h="2.5" w="20%" />
      </VStack>
    </HStack>
    <SkeletonText noOfLines={3} spaceY="3" />
  </Box>
);

const EmptyState = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <Box bg="bg_box" rounded="xl" p={12} textAlign="center">
    <Box display="flex" justifyContent="center" mb={4} color="grey.300" fontSize="3rem">
      {icon}
    </Box>
    <Text fontWeight="600" fontSize="1rem" color="text_primary" fontFamily="Outfit" mb={1}>
      {title}
    </Text>
    <Text fontSize="0.875rem" color="grey.400" fontFamily="Outfit">
      {subtitle}
    </Text>
  </Box>
);

function SavedPage() {
  const router = useRouter();
  const collectionId = router.query.collection as string | undefined;

  const { data: bookmarksData, isFetching: bookmarksLoading } = useGetBookmarksQuery(undefined);
  const { data: collectionsData, isFetching: collectionsLoading } = useGetCollectionQuery(undefined);
  const { data: collectionPostsData, isFetching: collectionPostsLoading } = useGetCollectionPostQuery(
    collectionId,
    { skip: !collectionId }
  );
  const [createCollection, { isLoading: creating }] = useCreateCollectionMutation();

  const bookmarks: any[] = bookmarksData?.data?.items ?? bookmarksData?.data ?? [];
  const collections: any[] = collectionsData?.data?.items ?? collectionsData?.data ?? [];
  const collectionPosts: any[] = collectionPostsData?.data?.items ?? collectionPostsData?.data ?? [];
  const activeCollection = collections.find((c) => c.id === collectionId);

  const [newCollectionName, setNewCollectionName] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCollectionClick = (id: string) => {
    router.push(`/saved?collection=${id}`, undefined, { shallow: true });
  };

  const handleBack = () => {
    router.push("/saved", undefined, { shallow: true });
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      await createCollection({ name: newCollectionName.trim() }).unwrap();
      setNewCollectionName("");
      setShowCreateDialog(false);
    } catch (_) {}
  };

  return (
    <>
      {/* Create Collection Dialog */}
      <Dialog.Root
        open={showCreateDialog}
        onOpenChange={(e) => setShowCreateDialog(Boolean((e as any).open))}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content borderRadius="16px" p={6} maxW="400px">
              <Dialog.Header pb={2}>
                <Text fontWeight="700" fontSize="1.1rem" color="text_primary" fontFamily="Outfit">
                  New Collection
                </Text>
              </Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body pt={3} pb={5}>
                <Input
                  placeholder="Collection name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleCreateCollection(); }}
                  borderRadius="8px"
                  fontFamily="Outfit"
                  autoFocus
                />
              </Dialog.Body>
              <Dialog.Footer gap={3}>
                <Button
                  variant="outline"
                  borderRadius="8px"
                  fontFamily="Outfit"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  bg="#111D4A"
                  color="white"
                  borderRadius="8px"
                  fontFamily="Outfit"
                  loading={creating}
                  disabled={!newCollectionName.trim()}
                  onClick={handleCreateCollection}
                >
                  Create
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", lg: "260px 1fr" }}
        gap={4}
        w="full"
        alignItems="flex-start"
      >
        {/* ── Left sidebar ── */}
        <Box display={{ base: "none", lg: "block" }}>
          <Box bg="bg_box" rounded="xl" overflow="hidden" position="sticky" top="100px">
            {/* Sidebar header */}
            <HStack px={4} pt={5} pb={3} justify="space-between">
              <Text fontWeight="700" fontSize="0.95rem" color="text_primary" fontFamily="Outfit">
                My Saves
              </Text>
              <Button
                size="xs"
                variant="ghost"
                color="#111D4A"
                fontFamily="Outfit"
                fontWeight="600"
                fontSize="0.75rem"
                px={2}
                gap={1}
                onClick={() => setShowCreateDialog(true)}
              >
                <Icon><BsPlus /></Icon>
                New
              </Button>
            </HStack>

            <VStack align="stretch" gap={0} pb={3}>
              {/* All Saved row */}
              <HStack
                px={4}
                py={3}
                cursor="pointer"
                bg={!collectionId ? "main_background" : "transparent"}
                _hover={{ bg: "main_background" }}
                onClick={handleBack}
                gap={3}
                borderLeftWidth="3px"
                borderLeftColor={!collectionId ? "#111D4A" : "transparent"}
                transition="all 0.15s"
              >
                <Box
                  w="36px"
                  h="36px"
                  rounded="lg"
                  bg={!collectionId ? "#111D4A" : "gray.100"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  transition="background 0.15s"
                >
                  <Icon color={!collectionId ? "white" : "grey.500"} fontSize="0.9rem">
                    <BsBookmarkFill />
                  </Icon>
                </Box>
                <VStack align="flex-start" gap={0} flex={1} minW={0}>
                  <Text
                    fontSize="0.875rem"
                    fontWeight={!collectionId ? "600" : "500"}
                    color="text_primary"
                    fontFamily="Outfit"
                  >
                    All Saved
                  </Text>
                  <Text fontSize="0.72rem" color="grey.400" fontFamily="Outfit">
                    {bookmarks.length} item{bookmarks.length !== 1 ? "s" : ""}
                  </Text>
                </VStack>
              </HStack>

              {/* Divider */}
              {collections.length > 0 && (
                <Box px={4} py={2}>
                  <Text fontSize="0.7rem" fontWeight="600" color="grey.400" fontFamily="Outfit" textTransform="uppercase" letterSpacing="0.06em">
                    Collections
                  </Text>
                </Box>
              )}

              {/* Collection rows */}
              {collectionsLoading ? (
                <VStack align="stretch" gap={2} px={4}>
                  {[1, 2, 3].map((i) => (
                    <HStack key={i} gap={3}>
                      <Skeleton w="36px" h="36px" rounded="lg" flexShrink={0} />
                      <VStack align="flex-start" gap={1} flex={1}>
                        <Skeleton h="3" w="60%" />
                        <Skeleton h="2.5" w="40%" />
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              ) : (
                collections.map((col) => {
                  const isActive = collectionId === col.id;
                  const firstThumb = col.coverImage ?? col.thumbnailUrl ?? null;
                  return (
                    <HStack
                      key={col.id}
                      px={4}
                      py={3}
                      cursor="pointer"
                      bg={isActive ? "main_background" : "transparent"}
                      _hover={{ bg: "main_background" }}
                      onClick={() => handleCollectionClick(col.id)}
                      gap={3}
                      borderLeftWidth="3px"
                      borderLeftColor={isActive ? "#111D4A" : "transparent"}
                      transition="all 0.15s"
                    >
                      <Box
                        w="36px"
                        h="36px"
                        rounded="lg"
                        overflow="hidden"
                        bg="gray.100"
                        flexShrink={0}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {firstThumb ? (
                          <Image src={firstThumb} alt="" w="full" h="full" objectFit="cover" />
                        ) : (
                          <Icon color="grey.400" fontSize="0.9rem"><BsCollectionFill /></Icon>
                        )}
                      </Box>
                      <VStack align="flex-start" gap={0} flex={1} minW={0}>
                        <Text
                          fontSize="0.875rem"
                          fontWeight={isActive ? "600" : "500"}
                          color="text_primary"
                          fontFamily="Outfit"
                          truncate
                        >
                          {col.name ?? col.title ?? "Untitled"}
                        </Text>
                        <Text fontSize="0.72rem" color="grey.400" fontFamily="Outfit">
                          {col.postCount ?? col.count ?? 0} post{(col.postCount ?? col.count ?? 0) !== 1 ? "s" : ""}
                        </Text>
                      </VStack>
                    </HStack>
                  );
                })
              )}
            </VStack>
          </Box>
        </Box>

        {/* ── Main content ── */}
        <VStack align="stretch" gap={4}>
          {/* Page header */}
          <Box bg="bg_box" rounded="xl" px={5} py={4}>
            <HStack gap={3} align="center">
              {collectionId && (
                <Box
                  as="button"
                  onClick={handleBack}
                  p={1.5}
                  rounded="full"
                  _hover={{ bg: "main_background" }}
                  color="text_primary"
                  cursor="pointer"
                  display={{ base: "flex", lg: "none" }}
                  alignItems="center"
                >
                  <Icon><IoChevronBack /></Icon>
                </Box>
              )}

              <Box
                w="40px"
                h="40px"
                rounded="xl"
                bg="#111D4A"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexShrink={0}
              >
                <Icon color="white" fontSize="1rem">
                  {collectionId ? <BsCollectionFill /> : <BsBookmarkFill />}
                </Icon>
              </Box>

              <VStack align="flex-start" gap={0} flex={1}>
                <Text fontWeight="700" fontSize="1.1rem" color="text_primary" fontFamily="Outfit">
                  {activeCollection ? (activeCollection.name ?? "Collection") : "All Saved Items"}
                </Text>
                <Text fontSize="0.8rem" color="grey.400" fontFamily="Outfit">
                  {collectionId
                    ? `${collectionPosts.length} post${collectionPosts.length !== 1 ? "s" : ""}`
                    : `${bookmarks.length} saved item${bookmarks.length !== 1 ? "s" : ""}`}
                </Text>
              </VStack>

              {/* Mobile: create + collection pills */}
              <Button
                size="sm"
                bg="#111D4A"
                color="white"
                borderRadius="8px"
                fontFamily="Outfit"
                fontWeight="600"
                fontSize="0.8rem"
                gap={1}
                display={{ base: "flex", lg: "none" }}
                onClick={() => setShowCreateDialog(true)}
              >
                <Icon><BsPlus /></Icon>
                New
              </Button>
            </HStack>

            {/* Mobile collection pills */}
            <Box display={{ base: "block", lg: "none" }} mt={3}>
              <HStack gap={2} flexWrap="wrap">
                <Box
                  px={3}
                  py={1}
                  rounded="full"
                  cursor="pointer"
                  fontSize="0.8rem"
                  fontFamily="Outfit"
                  fontWeight={!collectionId ? "600" : "400"}
                  bg={!collectionId ? "#111D4A" : "main_background"}
                  color={!collectionId ? "white" : "text_primary"}
                  transition="all 0.15s"
                  onClick={handleBack}
                >
                  All
                </Box>
                {collections.map((col) => (
                  <Box
                    key={col.id}
                    px={3}
                    py={1}
                    rounded="full"
                    cursor="pointer"
                    fontSize="0.8rem"
                    fontFamily="Outfit"
                    fontWeight={collectionId === col.id ? "600" : "400"}
                    bg={collectionId === col.id ? "#111D4A" : "main_background"}
                    color={collectionId === col.id ? "white" : "text_primary"}
                    transition="all 0.15s"
                    onClick={() => handleCollectionClick(col.id)}
                  >
                    {col.name ?? col.title ?? "Untitled"}
                  </Box>
                ))}
              </HStack>
            </Box>
          </Box>

          {/* Posts */}
          {collectionId ? (
            collectionPostsLoading ? (
              [...Array(3)].map((_, i) => <SkeletonPost key={i} />)
            ) : collectionPosts.length === 0 ? (
              <EmptyState
                icon={<BsCollectionFill />}
                title="This collection is empty"
                subtitle="Save posts to this collection and they'll appear here."
              />
            ) : (
              collectionPosts.map((post: any) => (
                <NewsItem key={post.id} post={post} />
              ))
            )
          ) : (
            bookmarksLoading ? (
              [...Array(3)].map((_, i) => <SkeletonPost key={i} />)
            ) : bookmarks.length === 0 ? (
              <EmptyState
                icon={<BsBookmark />}
                title="Nothing saved yet"
                subtitle="Tap the bookmark icon on any post to save it here."
              />
            ) : (
              bookmarks.map((item: any) => {
                const post = item.post ?? item;
                return <NewsItem key={post.id} post={post} />;
              })
            )
          )}
        </VStack>
      </Box>
    </>
  );
}

export default SavedPage;
