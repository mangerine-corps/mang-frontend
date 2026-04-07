import { Box, Button, Flex, Image, Input, Text, VStack, HStack, Skeleton, SkeletonText } from "@chakra-ui/react";
import AppLayout from "mangarine/layouts/AppLayout";
import { useRouter } from "next/router";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import { useGetJobsQuery } from "mangarine/state/services/jobs.service";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
};

const JobCard = ({ job, onView }: { job: any; onView: () => void }) => (
  <Box
    bg="bg_box"
    border="1px solid"
    borderColor="input_border"
    borderRadius="12px"
    p={4}
    w="full"
  >
    <Text fontWeight="700" fontSize="1rem" color="text_primary" mb={0.5}>
      {job.title}
    </Text>
    <Text fontSize="0.875rem" color="gray.500" mb={2}>
      {job.companyName ?? "Company"} • {job.location?.city}{job.location?.country ? `, ${job.location.country}` : ""}
    </Text>
    <Text fontSize="0.875rem" color="gray.500" mb={3} lineClamp={2}>
      {job.description}
    </Text>
    <Button
      variant="outline"
      borderColor="input_border"
      color="text_primary"
      borderRadius="8px"
      size="sm"
      px={5}
      _hover={{ bg: "gray.50" }}
      onClick={onView}
    >
      View Job
    </Button>
  </Box>
);

const JobCardSkeleton = () => (
  <Box bg="bg_box" border="1px solid" borderColor="input_border" borderRadius="12px" p={4} w="full">
    <Skeleton h="16px" w="40%" mb={2} />
    <Skeleton h="14px" w="30%" mb={3} />
    <SkeletonText noOfLines={2} mb={3} />
    <Skeleton h="32px" w="80px" borderRadius="8px" />
  </Box>
);

const JobSearchPage = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading } = useGetJobsQuery(searchQuery ? { search: searchQuery } : {});
  const jobs: any[] = (data as any)?.data?.jobs ?? (data as any)?.data?.items ?? [];
  const total: number = (data as any)?.data?.pagination?.total ?? (data as any)?.data?.total ?? jobs.length;

  const handleSearch = () => setSearchQuery(searchInput.trim());

  return (
    <AppLayout>
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
          {/* Search banner */}
          <Box bg="#FFF4EC" borderRadius="16px" p={{ base: 5, md: 8 }} mb={4}>
            <Text fontFamily="Outfit" fontWeight="700" fontSize={{ base: "1.25rem", md: "1.5rem" }} color="text_primary" mb={1}>
              Find Your Next Career Move
            </Text>
            <Text fontSize="0.875rem" color="gray.500" mb={4}>
              Explore opportunities tailored to your interests and take the next step toward the career you deserve.
            </Text>
            <HStack bg="white" borderRadius="10px" border="1px solid" borderColor="input_border" px={3} py={2} gap={2}>
              <Box color="gray.400" flexShrink={0}>
                <BiSearch size={18} />
              </Box>
              <Input
                border="none"
                _focus={{ outline: "none", boxShadow: "none" }}
                placeholder="Search jobs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                fontSize="0.9375rem"
                color="text_primary"
                bg="transparent"
                flex={1}
                p={0}
                h="auto"
              />
            </HStack>
          </Box>

          {/* Results */}
          {isLoading ? (
            <VStack gap={3} align="stretch">
              {[1, 2, 3, 4].map((i) => <JobCardSkeleton key={i} />)}
            </VStack>
          ) : jobs.length > 0 ? (
            <>
              <Text fontWeight="700" fontSize="1rem" color="text_primary" mb={3}>
                {total} Job{total !== 1 ? "s" : ""} Results
              </Text>
              <VStack gap={3} align="stretch">
                {jobs.map((job: any) => (
                  <JobCard key={job.id} job={job} onView={() => router.push(`/jobs/${job.id}`)} />
                ))}
              </VStack>
            </>
          ) : (
            <Flex direction="column" align="center" justify="center" minH="300px" gap={4}>
              <Image src="/jobssss.png" alt="No jobs" maxW="160px" />
              <Text fontWeight="700" fontSize="1.125rem" fontFamily="Outfit" color="text_primary">
                No jobs found
              </Text>
              <Text fontSize="0.875rem" color="gray.500" textAlign="center">
                Try a different search term or check back later.
              </Text>
            </Flex>
          )}
        </Box>
      </Box>
    </AppLayout>
  );
};

export default JobSearchPage;
