import { Badge, Box, Button, Flex, Image, Input, Text, VStack, HStack, Skeleton, SkeletonText } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useGetJobsQuery, useSaveJobMutation, useUnsaveJobMutation } from "mangarine/state/services/jobs.service";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { FiBookmark } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import { toaster } from "mangarine/components/ui/toaster";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
};

const JobCard = ({ job, onView }: { job: any; onView: () => void }) => {
  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();
  const [unsaveJob, { isLoading: isUnsaving }] = useUnsaveJobMutation();
  const [saved, setSaved] = useState<boolean>(job?.isSaved ?? false);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (saved) {
        await unsaveJob(job.id).unwrap();
        setSaved(false);
        toaster.create({ description: "Job removed from saved.", type: "info" });
      } else {
        await saveJob(job.id).unwrap();
        setSaved(true);
        toaster.create({ description: "Job saved.", type: "success" });
      }
    } catch {
      toaster.create({ description: "Something went wrong.", type: "error" });
    }
  };

  const tags = [job.workplaceType, job.jobType, job.experienceLevel].filter(Boolean);

  return (
    <Box
      bg="bg_box"
      border="1px solid"
      borderColor="input_border"
      borderRadius="12px"
      p={4}
      w="full"
      cursor="pointer"
      onClick={onView}
      _hover={{ borderColor: "gray.300" }}
      transition="border-color 0.15s"
    >
      <HStack justify="space-between" align="flex-start" mb={2}>
        <VStack align="flex-start" gap={0} flex={1} minW={0}>
          <Text fontWeight="700" fontSize="1rem" color="text_primary" lineClamp={1}>
            {job.title}
          </Text>
          <Text fontSize="0.8rem" color="gray.500">
            {job.companyName || null}{job.companyName ? " • " : ""}{[job.location?.city, job.location?.country].filter(Boolean).join(", ")}
          </Text>
        </VStack>
        <Button
          size="sm"
          variant="ghost"
          color={saved ? "button_bg" : "gray.400"}
          loading={isSaving || isUnsaving}
          onClick={handleSaveToggle}
          px={2}
          flexShrink={0}
        >
          {saved ? <FaBookmark /> : <FiBookmark />}
        </Button>
      </HStack>

      <Text fontSize="0.875rem" color="gray.500" mb={3} lineClamp={2}>
        {job.description}
      </Text>

      <HStack justify="space-between" align="center" flexWrap="wrap" gap={2}>
        <HStack gap={2} flexWrap="wrap">
          {tags.map((tag: string) => (
            <Badge key={tag} variant="subtle" colorPalette="gray" borderRadius="full" px={2} fontSize="0.75rem" textTransform="capitalize">
              {tag.replace(/-/g, " ")}
            </Badge>
          ))}
          {job.salaryRange?.from && (
            <Badge variant="subtle" colorPalette="green" borderRadius="full" px={2} fontSize="0.75rem">
              {job.salaryRange.currency} {Number(job.salaryRange.from).toLocaleString()}
              {job.salaryRange.to ? ` – ${Number(job.salaryRange.to).toLocaleString()}` : "+"}
            </Badge>
          )}
        </HStack>
        <Button
          variant="outline"
          borderColor="input_border"
          color="text_primary"
          borderRadius="8px"
          size="sm"
          px={5}
          flexShrink={0}
          _hover={{ bg: "gray.50" }}
          onClick={(e) => { e.stopPropagation(); onView(); }}
        >
          View Job
        </Button>
      </HStack>
    </Box>
  );
};

const JobCardSkeleton = () => (
  <Box bg="bg_box" border="1px solid" borderColor="input_border" borderRadius="12px" p={4} w="full">
    <Skeleton h="16px" w="40%" mb={1} />
    <Skeleton h="13px" w="30%" mb={3} />
    <SkeletonText noOfLines={2} mb={3} />
    <HStack justify="space-between">
      <HStack gap={2}>
        <Skeleton h="22px" w="60px" borderRadius="full" />
        <Skeleton h="22px" w="70px" borderRadius="full" />
      </HStack>
      <Skeleton h="32px" w="80px" borderRadius="8px" />
    </HStack>
  </Box>
);

const JobSearchPage = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  const { currentData, isLoading, isFetching } = useGetJobsQuery(searchQuery !== null ? { search: searchQuery || undefined } : undefined);
  const jobs: any[] = (currentData as any)?.data?.jobs ?? (currentData as any)?.data?.items ?? [];
  const total: number = (currentData as any)?.data?.pagination?.total ?? (currentData as any)?.data?.total ?? jobs.length;
  const isSearching = isLoading || isFetching;

  const handleSearch = () => setSearchQuery(searchInput.trim());

  return (
        <Box flex={1} h={{ base: "auto", md: "full" }} minH={0} overflowY={{ base: "visible", md: "auto" }} css={noScrollbar}>
          {/* Search banner */}
          <Box bg="orange.50" _dark={{ bg: "orange.900" }} borderRadius="16px" p={{ base: 5, md: 8 }} mb={4}>
            <Text fontFamily="Outfit" fontWeight="700" fontSize={{ base: "1.25rem", md: "1.5rem" }} color="text_primary" mb={1}>
              Find Your Next Career Move
            </Text>
            <Text fontSize="0.875rem" color="gray.500" mb={4}>
              Explore opportunities tailored to your interests and take the next step toward the career you deserve.
            </Text>
            <HStack bg="bg_box" borderRadius="10px" border="1px solid" borderColor="input_border" px={3} py={2} gap={2}>
              <Box color="gray.400" flexShrink={0} cursor="pointer" onClick={handleSearch}>
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
              <Button
                size="sm"
                bg="button_bg"
                color="button_text"
                borderRadius="6px"
                px={4}
                flexShrink={0}
                _hover={{ bg: "button_bg", opacity: 0.9 }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </HStack>
          </Box>

          {/* Results */}
          {isSearching ? (
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
      );
};

export default JobSearchPage;
