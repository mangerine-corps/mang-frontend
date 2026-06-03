import { Box, Button, Flex, Image, Text, VStack, HStack, Badge, Skeleton, SkeletonText } from "@chakra-ui/react";

import React from "react";
import { useRouter } from "next/router";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import { useGetMyJobsQuery, useGetMyApplicationsQuery } from "mangarine/state/services/jobs.service";

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

const MyJobCard = ({ job, onView }: { job: any; onView: () => void }) => {
  const [navigating, setNavigating] = React.useState(false);
  return (
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
        bg="button_bg"
        color="button_text"
        borderRadius="8px"
        px={5}
        _hover={{ bg: "button_bg", opacity: 0.9 }}
        loading={navigating}
        onClick={() => { setNavigating(true); onView(); }}
      >
        View Job
      </Button>
    </HStack>
  </Box>
  );
};

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
  const [tab, setTab] = React.useState<"posted" | "applications">("posted");
  const { data, isLoading } = useGetMyJobsQuery();
  const { data: applicationsData, isLoading: isLoadingApplications } = useGetMyApplicationsQuery();
  const jobs: any[] = (data as any)?.data?.jobs ?? [];
  const applications: any[] = (applicationsData as any)?.data?.jobs ?? [];
  const [navigatingCreate, setNavigatingCreate] = React.useState(false);
  const [navigatingSearch, setNavigatingSearch] = React.useState(false);

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }}
      gap={4}
      w="full"
      h={{ base: "auto", md: "full" }}
      alignItems="start"
      css={noScrollbar}
    >
      {/* Left sidebar */}
      <VStack
        display={{ base: "none", md: "flex" }}
        alignItems="stretch"
        spaceY={2}
        w="full"
        h="full"
        overflowY="auto"
        css={noScrollbar}
      >
        <Biocard />
        <DashboardCard />
      </VStack>

      {/* Main content */}
      <Box h={{ base: "auto", md: "full" }} w="full" overflowY="auto" css={noScrollbar}>

          {/* Header */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            align={{ base: "stretch", sm: "center" }}
            gap={3}
            mb={4}
          >
            <HStack gap={0} bg="input_border" borderRadius="10px" p="3px" w={{ base: "full", sm: "auto" }}>
              {(["posted", "applications"] as const).map((t) => (
                <Button
                  key={t}
                  size="sm"
                  borderRadius="8px"
                  fontFamily="Outfit"
                  fontWeight="600"
                  px={{ base: 3, sm: 5 }}
                  flex={{ base: 1, sm: "none" }}
                  fontSize={{ base: "0.8rem", sm: "0.875rem" }}
                  bg={tab === t ? "bg_box" : "transparent"}
                  color="text_primary"
                  boxShadow={tab === t ? "sm" : "none"}
                  onClick={() => setTab(t)}
                  _hover={{ bg: tab === t ? "bg_box" : "rgba(0,0,0,0.04)" }}
                >
                  {t === "posted" ? "Posted Jobs" : "Applications"}
                </Button>
              ))}
            </HStack>
            <HStack gap={2} justifyContent={{ base: "stretch", sm: "flex-end" }}>
              <Button
                variant="outline"
                borderColor="button_bg"
                color="button_bg"
                borderRadius="8px"
                fontFamily="Outfit"
                fontWeight="600"
                size="sm"
                flex={{ base: 1, sm: "none" }}
                px={4}
                _hover={{ bg: "bd_background" }}
                loading={navigatingSearch}
                onClick={() => { setNavigatingSearch(true); router.push("/jobs/search"); }}
              >
                Search
              </Button>
              <Button
                bg="button_bg"
                color="button_text"
                borderRadius="8px"
                fontFamily="Outfit"
                fontWeight="600"
                size="sm"
                flex={{ base: 1, sm: "none" }}
                px={4}
                _hover={{ bg: "button_bg", opacity: 0.9 }}
                loading={navigatingCreate}
                onClick={() => { setNavigatingCreate(true); router.push("/jobs/create"); }}
              >
                + Create
              </Button>
            </HStack>
          </Flex>

          {/* Posted jobs tab */}
          {tab === "posted" && (
            isLoading ? (
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
                    bg="button_bg"
                    color="button_text"
                    w="full"
                    borderRadius="8px"
                    fontFamily="Outfit"
                    fontWeight="600"
                    py={6}
                    _hover={{ bg: "button_bg", opacity: 0.9 }}
                    loading={navigatingSearch}
                    onClick={() => { setNavigatingSearch(true); router.push("/jobs/search"); }}
                  >
                    Search Job
                  </Button>
                  <Button
                    variant="outline"
                    borderColor="button_bg"
                    color="button_bg"
                    w="full"
                    borderRadius="8px"
                    fontFamily="Outfit"
                    fontWeight="600"
                    py={6}
                    _hover={{ bg: "bd_background" }}
                    loading={navigatingCreate}
                    onClick={() => { setNavigatingCreate(true); router.push("/jobs/create"); }}
                  >
                    Create Job
                  </Button>
                </VStack>
              </Flex>
            )
          )}

          {/* My applications tab */}
          {tab === "applications" && (
            isLoadingApplications ? (
              <VStack gap={3} align="stretch">
                {[1, 2, 3].map((i) => <MyJobCardSkeleton key={i} />)}
              </VStack>
            ) : applications.length > 0 ? (
              <VStack gap={3} align="stretch">
                {applications.map((job: any) => (
                  <MyJobCard key={job.id} job={job} onView={() => router.push(`/jobs/${job.id}`)} />
                ))}
              </VStack>
            ) : (
              <Flex direction="column" align="center" justify="center" minH="60vh" gap={4}>
                <Image src="/jobssss.png" alt="No applications" maxW={{ base: "160px", md: "200px" }} />
                <VStack gap={2} textAlign="center">
                  <Text fontSize={{ base: "1.25rem", md: "1.5rem" }} fontWeight="700" fontFamily="Outfit" color="text_primary">
                    No Applications Yet
                  </Text>
                  <Text fontSize={{ base: "0.875rem", md: "1rem" }} color="gray.500" fontFamily="Outfit" lineHeight="1.7">
                    Jobs you&apos;ve applied to will appear here.
                  </Text>
                </VStack>
                <Button
                  bg="button_bg"
                  color="button_text"
                  borderRadius="8px"
                  fontFamily="Outfit"
                  fontWeight="600"
                  px={8}
                  py={5}
                  _hover={{ bg: "button_bg", opacity: 0.9 }}
                  loading={navigatingSearch}
                  onClick={() => { setNavigatingSearch(true); router.push("/jobs/search"); }}
                >
                  Find Jobs to Apply
                </Button>
              </Flex>
            )
          )}
      </Box>
    </Box>
  );
};

export default JobsPage;
