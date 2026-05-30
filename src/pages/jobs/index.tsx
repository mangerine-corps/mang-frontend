import { Box, Button, Flex, Image, Text, VStack, HStack, Badge, Skeleton, SkeletonText } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import { useGetMyJobsQuery } from "mangarine/state/services/jobs.service";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
};

const statusColor: Record<string, string> = {
  published: "green",
  draft: "gray",
  closed: "red",
};

const MyJobCard = ({ job, onView }: { job: any; onView: () => void }) => (
  <Box
    bg="bg_box"
    border="1px solid"
    borderColor="input_border"
    borderRadius="12px"
    p={4}
    w="full"
  >
    <HStack justify="space-between" mb={1}>
      <Text fontWeight="700" fontSize="1rem" color="text_primary">
        {job.title}
      </Text>
      <Badge colorPalette={statusColor[job.status] ?? "gray"} borderRadius="full" px={3} py={1} fontSize="0.75rem" textTransform="capitalize">
        {job.status}
      </Badge>
    </HStack>
    <Text fontSize="0.875rem" color="gray.500" mb={1}>
      {job.location?.city}{job.location?.country ? `, ${job.location.country}` : ""} • {job.workplaceType} • {job.jobType}
    </Text>
    <Text fontSize="0.875rem" color="gray.500" mb={3} lineClamp={2}>
      {job.description}
    </Text>
    <HStack gap={2}>
      <Button
        size="sm"
        bg="#111D4A"
        color="white"
        borderRadius="8px"
        px={5}
        _hover={{ bg: "#0D173B" }}
        onClick={onView}
      >
        View Job
      </Button>
    </HStack>
  </Box>
);

const MyJobCardSkeleton = () => (
  <Box bg="bg_box" border="1px solid" borderColor="input_border" borderRadius="12px" p={4} w="full">
    <HStack justify="space-between" mb={2}>
      <Skeleton h="16px" w="40%" />
      <Skeleton h="20px" w="70px" borderRadius="full" />
    </HStack>
    <Skeleton h="14px" w="50%" mb={3} />
    <SkeletonText noOfLines={2} mb={3} />
    <Skeleton h="32px" w="80px" borderRadius="8px" />
  </Box>
);

const JobsPage = () => {
  const router = useRouter();
  const { data, isLoading } = useGetMyJobsQuery();
  const jobs: any[] = (data as any)?.data?.jobs ?? [];

  return (
          <Box
        display="flex"
        flexDir={{ base: "column", md: "row" }}
        gap={4}
        w="full"
        h="full"
        minH={0}
        overflow="hidden"
        p={4}
        css={noScrollbar}
      >
        {/* Left sidebar */}
        <VStack
          display={{ base: "none", md: "flex" }}
          alignItems="stretch"
          spaceY={2}
          w={{ md: "25%" }}
          flexShrink={0}
          h="full"
          overflowY="auto"
          css={noScrollbar}
        >
          <Biocard />
          <DashboardCard />
        </VStack>

        {/* Main content */}
        <Box flex={1} h="full" minH={0} overflowY="auto" css={noScrollbar}>

          {/* Header */}
          <HStack justify="space-between" mb={4}>
            <Text fontFamily="Outfit" fontWeight="700" fontSize="1.25rem" color="text_primary">
              My Jobs
            </Text>
            <HStack gap={2}>
              <Button
                variant="outline"
                borderColor="#111D4A"
                color="#111D4A"
                borderRadius="8px"
                fontFamily="Outfit"
                fontWeight="600"
                size="sm"
                px={5}
                _hover={{ bg: "rgba(17,29,74,0.04)" }}
                onClick={() => router.push("/jobs/search")}
              >
                Search Job
              </Button>
              <Button
                bg="#111D4A"
                color="white"
                borderRadius="8px"
                fontFamily="Outfit"
                fontWeight="600"
                size="sm"
                px={5}
                _hover={{ bg: "#0D173B" }}
                onClick={() => router.push("/jobs/create")}
              >
                + Create Job
              </Button>
            </HStack>
          </HStack>

          {/* Job list */}
          {isLoading ? (
            <VStack gap={3} align="stretch">
              {[1, 2, 3].map((i) => <MyJobCardSkeleton key={i} />)}
            </VStack>
          ) : jobs.length > 0 ? (
            <VStack gap={3} align="stretch">
              {jobs.map((job: any) => (
                <MyJobCard key={job.id} job={job} onView={() => router.push(`/jobs/${job.id}`)} />
              ))}
            </VStack>
          ) : (
            <Flex direction="column" align="center" justify="center" minH="60vh" gap={6}>
              <Image src="/jobssss.png" alt="No jobs" maxW={{ base: "160px", md: "200px" }} />
              <VStack gap={2} textAlign="center">
                <Text fontSize={{ base: "1.25rem", md: "1.5rem" }} fontWeight="700" fontFamily="Outfit" color="text_primary">
                  No Jobs Yet
                </Text>
                <Text fontSize={{ base: "0.875rem", md: "1rem" }} color="gray.500" fontFamily="Outfit" lineHeight="1.7">
                  You haven&apos;t created any jobs yet. Start by posting one.
                </Text>
              </VStack>
              <VStack gap={3} w="full" maxW="320px">
                <Button
                  bg="#111D4A"
                  color="white"
                  w="full"
                  borderRadius="8px"
                  fontFamily="Outfit"
                  fontWeight="600"
                  py={6}
                  _hover={{ bg: "#0D173B" }}
                  onClick={() => router.push("/jobs/search")}
                >
                  Search Job
                </Button>
                <Button
                  variant="outline"
                  borderColor="#111D4A"
                  color="#111D4A"
                  w="full"
                  borderRadius="8px"
                  fontFamily="Outfit"
                  fontWeight="600"
                  py={6}
                  _hover={{ bg: "rgba(17,29,74,0.04)" }}
                  onClick={() => router.push("/jobs/create")}
                >
                  Create Job
                </Button>
              </VStack>
            </Flex>
          )}
        </Box>
      </Box>
      );
};

export default JobsPage;
