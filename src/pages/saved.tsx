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
import { useGetSavedJobsQuery } from "mangarine/state/services/jobs.service";
import {
  useGetFavoriteConsultantsQuery,
  useUnfavoriteConsultantMutation,
} from "mangarine/state/services/consultant.service";
import { useState } from "react";
import { useRouter } from "next/router";
import { BsBookmark, BsBookmarkFill, BsCollectionFill, BsPlus, BsBriefcase } from "react-icons/bs";
import { IoChevronBack } from "react-icons/io5";
import { LuHeart, LuHeartOff, LuStar } from "react-icons/lu";
import { safeProfilePic, imgErrorFallback } from "mangarine/lib/constants";
import { useAuth } from "mangarine/state/hooks/user.hook";

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

const SkeletonConsultantCard = () => (
  <Box bg="bg_box" rounded="xl" p={4}>
    <HStack gap={4}>
      <SkeletonCircle size="14" flexShrink={0} />
      <VStack align="flex-start" flex={1} gap={2}>
        <Skeleton h="3.5" w="45%" rounded="md" />
        <Skeleton h="3" w="30%" rounded="md" />
        <Skeleton h="2.5" w="60%" rounded="md" />
      </VStack>
      <SkeletonCircle size="8" flexShrink={0} />
    </HStack>
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
  const { user } = useAuth();

  const { data: bookmarksData, isFetching: bookmarksLoading, isError: bookmarksError } = useGetBookmarksQuery(undefined);
  const { data: collectionsData, isFetching: collectionsLoading } = useGetCollectionQuery(undefined);
  const { data: collectionPostsData, isFetching: collectionPostsLoading } = useGetCollectionPostQuery(
    collectionId,
    { skip: !collectionId }
  );
  const [createCollection, { isLoading: creating }] = useCreateCollectionMutation();
  const { data: savedJobsData, isFetching: savedJobsLoading } = useGetSavedJobsQuery({ page: 1, limit: 20 });
  const { data: favConsultantsData, isFetching: favLoading, refetch: refetchFavs } = useGetFavoriteConsultantsQuery({});
  const [unfavoriteConsultant] = useUnfavoriteConsultantMutation();

  const savedJobs: any[] = savedJobsData?.data?.jobs ?? [];

  const isJobsTab = router.query.tab === "jobs";
  const isConsultantsTab = router.query.tab === "consultants";

  const bookmarks: any[] = (() => {
    const d = bookmarksData?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.items)) return d.items;
    if (Array.isArray(d?.bookmarks)) return d.bookmarks;
    if (Array.isArray(d?.data)) return d.data;
    return [];
  })();
  const collections: any[] = (() => {
    const d = collectionsData?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.items)) return d.items;
    return [];
  })();
  const collectionPosts: any[] = (() => {
    const d = collectionPostsData?.data;
    if (Array.isArray(d?.posts)) return d.posts;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.items)) return d.items;
    return [];
  })();
  const activeCollection = collections.find((c) => c.id === collectionId);

  const rawFavList: any[] = Array.isArray(favConsultantsData?.data)
    ? favConsultantsData.data
    : (favConsultantsData?.data?.favoriteConsultants ?? []);

  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const favConsultants = rawFavList.filter((item: any) => !removedIds.has(item?.consultant?.id ?? item?.id));

  const [newCollectionName, setNewCollectionName] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCollectionClick = (id: string) => {
    router.push(`/saved?collection=${id}`, undefined, { shallow: true });
  };

  const handleBack = () => {
    router.push("/saved", undefined, { shallow: true });
  };

  const handleJobsTab = () => {
    router.push("/saved?tab=jobs", undefined, { shallow: true });
  };

  const handleConsultantsTab = () => {
    router.push("/saved?tab=consultants", undefined, { shallow: true });
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;
    try {
      await createCollection({ name: newCollectionName.trim() }).unwrap();
      setNewCollectionName("");
      setShowCreateDialog(false);
    } catch (_) {}
  };

  const handleUnfavourite = async (e: React.MouseEvent, consultantId: string) => {
    e.stopPropagation();
    setRemovedIds((prev) => new Set(prev).add(consultantId));
    try {
      await unfavoriteConsultant({ consultantId, userId: user?.id }).unwrap();
      refetchFavs();
    } catch {
      setRemovedIds((prev) => { const s = new Set(prev); s.delete(consultantId); return s; });
    }
  };

  // Derived active state helpers
  const isDefaultTab = !collectionId && !isJobsTab && !isConsultantsTab;

  // Header icon & title
  const headerIcon = isJobsTab
    ? <BsBriefcase />
    : isConsultantsTab
    ? <LuHeart />
    : collectionId
    ? <BsCollectionFill />
    : <BsBookmarkFill />;

  const headerTitle = isJobsTab
    ? "Saved Jobs"
    : isConsultantsTab
    ? "Favourite Consultants"
    : activeCollection
    ? (activeCollection.name ?? "Collection")
    : "Saved Posts";

  const headerSubtitle = isJobsTab
    ? `${savedJobs.length} job${savedJobs.length !== 1 ? "s" : ""}`
    : isConsultantsTab
    ? `${favConsultants.length} consultant${favConsultants.length !== 1 ? "s" : ""}`
    : collectionId
    ? `${collectionPostsLoading ? "…" : collectionPosts.length} post${collectionPosts.length !== 1 ? "s" : ""}`
    : "All bookmarked posts";

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
                  px={4}
                  h="44px"
                  autoFocus
                />
              </Dialog.Body>
              <Dialog.Footer gap={3}>
                <Button
                  variant="outline"
                  borderRadius="8px"
                  fontFamily="Outfit"
                  px={6}
                  py={5}
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  bg="button_bg"
                  color="button_text"
                  borderRadius="8px"
                  fontFamily="Outfit"
                  px={6}
                  py={5}
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
            <HStack px={4} pt={5} pb={3} justify="space-between">
              <Text fontWeight="700" fontSize="0.95rem" color="text_primary" fontFamily="Outfit">
                My Saves
              </Text>
              <Button
                size="xs"
                variant="ghost"
                color="button_bg"
                fontFamily="Outfit"
                fontWeight="600"
                fontSize="0.75rem"
                px={3}
                py={4}
                gap={1}
                onClick={() => setShowCreateDialog(true)}
              >
                <Icon><BsPlus /></Icon>
                New
              </Button>
            </HStack>

            <VStack align="stretch" gap={0} pb={3}>
              {/* All Saved */}
              <SidebarRow
                icon={<BsBookmarkFill />}
                label="Saved Posts"
                sublabel="All bookmarked posts"
                isActive={isDefaultTab}
                onClick={handleBack}
              />

              {/* Jobs */}
              <SidebarRow
                icon={<BsBriefcase />}
                label="Saved Jobs"
                sublabel={`${savedJobs.length} job${savedJobs.length !== 1 ? "s" : ""}`}
                isActive={isJobsTab}
                onClick={handleJobsTab}
              />

              {/* Favourite Consultants */}
              <SidebarRow
                icon={<LuHeart />}
                label="Favourite Consultants"
                sublabel={`${favConsultants.length} consultant${favConsultants.length !== 1 ? "s" : ""}`}
                isActive={isConsultantsTab}
                onClick={handleConsultantsTab}
              />

              {collections.length > 0 && (
                <Box px={4} py={2}>
                  <Text fontSize="0.7rem" fontWeight="600" color="grey.400" fontFamily="Outfit" textTransform="uppercase" letterSpacing="0.06em">
                    Collections
                  </Text>
                </Box>
              )}

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
                      px={4} py={3}
                      cursor="pointer"
                      bg={isActive ? "main_background" : "transparent"}
                      _hover={{ bg: "main_background" }}
                      onClick={() => handleCollectionClick(col.id)}
                      gap={3}
                      borderLeftWidth="3px"
                      borderLeftColor={isActive ? "button_bg" : "transparent"}
                      transition="all 0.15s"
                    >
                      <Box
                        w="36px" h="36px" rounded="lg" overflow="hidden"
                        bg="gray.100" flexShrink={0}
                        display="flex" alignItems="center" justifyContent="center"
                      >
                        {firstThumb ? (
                          <Image src={firstThumb} alt="" w="full" h="full" objectFit="cover" />
                        ) : (
                          <Icon color="grey.400" fontSize="0.9rem"><BsCollectionFill /></Icon>
                        )}
                      </Box>
                      <VStack align="flex-start" gap={0} flex={1} minW={0}>
                        <Text fontSize="0.875rem" fontWeight={isActive ? "600" : "500"} color="text_primary" fontFamily="Outfit" truncate>
                          {col.name ?? col.title ?? "Untitled"}
                        </Text>
                        <Text fontSize="0.72rem" color="grey.400" fontFamily="Outfit">
                          {(() => {
                            const count = col.id === collectionId
                              ? collectionPosts.length
                              : (col.postCount ?? col.count ?? 0);
                            return `${count} post${count !== 1 ? "s" : ""}`;
                          })()}
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
                w="40px" h="40px" rounded="xl" bg="button_bg"
                display="flex" alignItems="center" justifyContent="center" flexShrink={0}
              >
                <Icon color="button_text" fontSize="1rem">{headerIcon}</Icon>
              </Box>

              <VStack align="flex-start" gap={0} flex={1}>
                <Text fontWeight="700" fontSize="1.1rem" color="text_primary" fontFamily="Outfit">
                  {headerTitle}
                </Text>
                <Text fontSize="0.8rem" color="grey.400" fontFamily="Outfit">
                  {headerSubtitle}
                </Text>
              </VStack>

              <Button
                size="sm"
                bg="button_bg"
                color="button_text"
                borderRadius="8px"
                fontFamily="Outfit"
                fontWeight="600"
                fontSize="0.8rem"
                px={4}
                py={5}
                gap={1}
                display={{ base: "flex", lg: "none" }}
                onClick={() => setShowCreateDialog(true)}
              >
                <Icon><BsPlus /></Icon>
                New
              </Button>
            </HStack>

            {/* Mobile pills */}
            <Box display={{ base: "block", lg: "none" }} mt={3}>
              <HStack gap={2} flexWrap="wrap">
                {[
                  { label: "Saved Posts", active: isDefaultTab, onClick: handleBack },
                  { label: "Jobs", active: isJobsTab, onClick: handleJobsTab },
                  { label: "Consultants", active: isConsultantsTab, onClick: handleConsultantsTab },
                  ...collections.map((col) => ({
                    label: col.name ?? "Untitled",
                    active: collectionId === col.id,
                    onClick: () => handleCollectionClick(col.id),
                  })),
                ].map((pill) => (
                  <Box
                    key={pill.label}
                    px={3} py={1} rounded="full" cursor="pointer"
                    fontSize="0.8rem" fontFamily="Outfit"
                    fontWeight={pill.active ? "600" : "400"}
                    bg={pill.active ? "button_bg" : "main_background"}
                    color={pill.active ? "button_text" : "text_primary"}
                    transition="all 0.15s"
                    onClick={pill.onClick}
                  >
                    {pill.label}
                  </Box>
                ))}
              </HStack>
            </Box>
          </Box>

          {/* ── Tab content ── */}
          {isConsultantsTab ? (
            favLoading ? (
              [...Array(4)].map((_, i) => <SkeletonConsultantCard key={i} />)
            ) : favConsultants.length === 0 ? (
              <EmptyState
                icon={<LuHeart />}
                title="No favourite consultants yet"
                subtitle="Tap the ♥ icon on a consultant's profile to save them here."
              />
            ) : (
              favConsultants.map((item: any, index: number) => {
                const c = item?.consultant ?? item;
                const consultantId = c?.id;
                const rating = c?.averageRating ?? c?.rating ?? null;
                return (
                  <Box
                    key={consultantId ?? index}
                    bg="bg_box"
                    rounded="xl"
                    p={4}
                    cursor="pointer"
                    _hover={{ opacity: 0.95 }}
                    transition="opacity 0.15s"
                    onClick={() => consultantId && router.push(`/consultant/${consultantId}`)}
                  >
                    <HStack gap={4} align="center">
                      <Avatar.Root size="lg" flexShrink={0}>
                        <Avatar.Fallback name={c?.fullName} />
                        <Avatar.Image
                          src={safeProfilePic(c?.profilePics)}
                          onError={imgErrorFallback}
                        />
                      </Avatar.Root>

                      <VStack align="flex-start" gap={0.5} flex={1} minW={0}>
                        <Text fontWeight="700" fontSize="1rem" color="text_primary" fontFamily="Outfit" truncate>
                          {c?.fullName ?? "Consultant"}
                        </Text>
                        {c?.businessName && (
                          <Text fontSize="0.82rem" color="grey.500" fontFamily="Outfit" truncate>
                            {c.businessName}
                          </Text>
                        )}
                        {c?.title && (
                          <Text fontSize="0.78rem" color="grey.400" fontFamily="Outfit" truncate>
                            {c.title}
                          </Text>
                        )}
                        {rating !== null && (
                          <HStack gap={1} mt={0.5}>
                            <Icon color="#F59E0B" fontSize="0.82rem"><LuStar /></Icon>
                            <Text fontSize="0.78rem" color="grey.500" fontFamily="Outfit">
                              {Number(rating).toFixed(1)}
                            </Text>
                          </HStack>
                        )}
                      </VStack>

                      <Button
                        size="sm"
                        variant="ghost"
                        color="red.400"
                        borderRadius="10px"
                        px={3}
                        py={5}
                        flexShrink={0}
                        onClick={(e) => handleUnfavourite(e, consultantId)}
                        _hover={{ bg: "red.50", color: "red.500" }}
                        aria-label="Remove from favourites"
                      >
                        <LuHeartOff size={18} />
                      </Button>
                    </HStack>
                  </Box>
                );
              })
            )
          ) : isJobsTab ? (
            savedJobsLoading ? (
              [...Array(3)].map((_, i) => <SkeletonPost key={i} />)
            ) : savedJobs.length === 0 ? (
              <EmptyState
                icon={<BsBriefcase />}
                title="No saved jobs yet"
                subtitle="Save jobs you're interested in and they'll appear here."
              />
            ) : (
              savedJobs.map((job: any) => (
                <Box key={job.id} bg="bg_box" rounded="xl" p={4} cursor="pointer"
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  _hover={{ opacity: 0.9 }}
                >
                  <HStack gap={3} align="flex-start">
                    <Box w="44px" h="44px" rounded="lg" bg="gray.100" flexShrink={0}
                      display="flex" alignItems="center" justifyContent="center"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9C3 7.34315 4.34315 6 6 6H18C19.6569 6 21 7.34315 21 9V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V9Z" stroke="#9CA3AF" strokeWidth="1.5"/>
                        <path d="M8 6V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V6" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M3 12H21" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M10 12V13C10 13.5523 10.4477 14 11 14H13C13.5523 14 14 13.5523 14 13V12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </Box>
                    <VStack align="flex-start" gap={0.5} flex={1} minW={0}>
                      <Text fontWeight="600" fontSize="0.95rem" color="text_primary" fontFamily="Outfit" truncate>
                        {job.title ?? "Job"}
                      </Text>
                      <Text fontSize="0.8rem" color="grey.500" fontFamily="Outfit" truncate>
                        {job.companyName || ""}
                      </Text>
                      {job.location && (
                        <Text fontSize="0.75rem" color="grey.400" fontFamily="Outfit">
                          {job.location?.city && job.location?.country
                            ? `${job.location.city}, ${job.location.country}`
                            : job.location?.officeLocation ?? ""}
                        </Text>
                      )}
                      {job.workplaceType && (
                        <Text fontSize="0.7rem" color="primary.950" fontFamily="Outfit" fontWeight="600" textTransform="capitalize">
                          {job.workplaceType} · {job.jobType}
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                </Box>
              ))
            )
          ) : collectionId ? (
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
            ) : bookmarksError ? (
              <EmptyState
                icon={<BsBookmark />}
                title="Couldn't load saved items"
                subtitle="Please try refreshing the page."
              />
            ) : bookmarks.length === 0 ? (
              <EmptyState
                icon={<BsBookmark />}
                title="Nothing saved yet"
                subtitle="Tap the bookmark icon on any post to save it here."
              />
            ) : (
              bookmarks.map((item: any, i: number) => {
                const post = item?.post ?? item;
                return <NewsItem key={post?.id ?? i} post={post} />;
              })
            )
          )}
        </VStack>
      </Box>
    </>
  );
}

// Reusable sidebar row
const SidebarRow = ({
  icon,
  label,
  sublabel,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <HStack
    px={4} py={3}
    cursor="pointer"
    bg={isActive ? "main_background" : "transparent"}
    _hover={{ bg: "main_background" }}
    onClick={onClick}
    gap={3}
    borderLeftWidth="3px"
    borderLeftColor={isActive ? "button_bg" : "transparent"}
    transition="all 0.15s"
  >
    <Box
      w="36px" h="36px" rounded="lg"
      bg={isActive ? "button_bg" : "gray.100"}
      display="flex" alignItems="center" justifyContent="center"
      flexShrink={0} transition="background 0.15s"
    >
      <Icon color={isActive ? "button_text" : "grey.500"} fontSize="0.9rem">
        {icon}
      </Icon>
    </Box>
    <VStack align="flex-start" gap={0} flex={1} minW={0}>
      <Text fontSize="0.875rem" fontWeight={isActive ? "600" : "500"} color="text_primary" fontFamily="Outfit">
        {label}
      </Text>
      <Text fontSize="0.72rem" color="grey.400" fontFamily="Outfit">
        {sublabel}
      </Text>
    </VStack>
  </HStack>
);

export default SavedPage;
