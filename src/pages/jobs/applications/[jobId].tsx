import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { IoArrowBack } from "react-icons/io5";
import {
  useGetMyApplicationsQuery,
  useWithdrawApplicationMutation,
} from "mangarine/state/services/jobs.service";
import { toaster } from "mangarine/components/ui/toaster";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: "transparent" },
};

const ApplicationDetailPage = () => {
  const router = useRouter();
  const { jobId } = router.query;

  const { data: myApplicationsData, isLoading } = useGetMyApplicationsQuery(undefined, {
    skip: !router.isReady,
  });

  const [withdrawApplication, { isLoading: isWithdrawing }] = useWithdrawApplicationMutation();

  // Response: { data: { jobs: [ { id, title, ..., application: { coverLetter, appliedAt, ... } } ] } }
  const allJobs: any[] = (myApplicationsData as any)?.data?.jobs ?? [];
  const job = allJobs.find((j: any) => j.id === jobId) ?? null;
  const application = job?.application ?? null;

  const handleWithdraw = async () => {
    try {
      await withdrawApplication(jobId as string).unwrap();
      toaster.create({ description: "Application withdrawn.", type: "info", closable: true });
      router.push("/jobs?tab=applications");
    } catch (e: any) {
      toaster.create({
        description: e?.data?.message ?? "Failed to withdraw application.",
        type: "error",
        closable: true,
      });
    }
  };

  const isPageLoading = !router.isReady || isLoading;

  return (
    <Box
      flex={1}
      h={{ base: "auto", md: "full" }}
      minH={0}
      overflowY={{ base: "visible", md: "auto" }}
      css={noScrollbar}
    >
      <Button
        variant="ghost"
        size="sm"
        mb={4}
        px={2}
        color="text_primary"
        onClick={() => router.push("/jobs?tab=applications")}
        _hover={{ bg: "gray.100" }}
      >
        <HStack gap={1.5}>
          <IoArrowBack />
          <Text fontSize="0.875rem">My Applications</Text>
        </HStack>
      </Button>

      {isPageLoading ? (
        <Box bg="bg_box" borderRadius="12px" p={{ base: 5, md: 8 }} border="1px solid" borderColor="input_border">
          <Skeleton h="24px" w="40%" mb={3} />
          <Skeleton h="16px" w="25%" mb={6} />
          <SkeletonText noOfLines={4} mb={6} />
        </Box>
      ) : !job ? (
        <Flex direction="column" align="center" justify="center" minH="40vh" gap={3}>
          <Text fontWeight="700" fontSize="1.25rem" color="text_primary">Application not found</Text>
          <Button size="sm" bg="button_bg" color="button_text" borderRadius="8px" px={6} mt={2}
            onClick={() => router.push("/jobs?tab=applications")}>
            Back to Applications
          </Button>
        </Flex>
      ) : (
        <VStack gap={4} align="stretch">
          {/* Application card */}
          <Box bg="bg_box" borderRadius="12px" p={{ base: 5, md: 6 }} border="1px solid" borderColor="input_border">
            <HStack justify="space-between" mb={4} flexWrap="wrap" gap={2}>
              <Text fontWeight="700" fontSize="1.125rem" color="text_primary">
                Your Application
              </Text>
              {application?.appliedAt && (
                <Text fontSize="0.8rem" color="gray.400">
                  Applied {new Date(application.appliedAt).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </Text>
              )}
            </HStack>

            <Box mb={4}>
              <Text fontSize="0.75rem" color="gray.400" fontWeight="600" mb={1} textTransform="uppercase" letterSpacing="0.05em">
                Cover Letter
              </Text>
              {application?.coverLetter ? (
                <Text fontSize="0.9375rem" color="text_primary" lineHeight="1.7" whiteSpace="pre-wrap">
                  {application.coverLetter}
                </Text>
              ) : (
                <Text fontSize="0.9rem" color="gray.400" fontStyle="italic">
                  No cover letter submitted.
                </Text>
              )}
            </Box>

            <Box pt={4} borderTopWidth="1px" borderColor="input_border">
              <Button
                variant="outline"
                borderColor="red.300"
                color="red.500"
                borderRadius="8px"
                fontWeight="600"
                size="sm"
                px={6}
                loading={isWithdrawing}
                onClick={handleWithdraw}
                _hover={{ bg: "red.50" }}
              >
                Withdraw Application
              </Button>
            </Box>
          </Box>

          {/* Job details card */}
          <Box bg="bg_box" borderRadius="12px" p={{ base: 5, md: 6 }} border="1px solid" borderColor="input_border">
            <Text fontWeight="600" fontSize="0.75rem" color="gray.400" textTransform="uppercase" letterSpacing="0.05em" mb={3}>
              Job Details
            </Text>
            <Text fontWeight="700" fontSize={{ base: "1.125rem", md: "1.375rem" }} color="text_primary" mb={1}>
              {job.title}
            </Text>
            {job.companyName && (
              <Text fontSize="0.9375rem" color="gray.500" mb={2}>{job.companyName}</Text>
            )}
            <HStack gap={2} flexWrap="wrap" mb={4}>
              {(job.location?.city || job.location?.country) && (
                <Badge variant="outline" borderRadius="full" px={3} fontSize="0.8rem" colorPalette="gray">
                  {[job.location.city, job.location.state, job.location.country].filter(Boolean).join(", ")}
                </Badge>
              )}
              {job.workplaceType && (
                <Badge variant="outline" borderRadius="full" px={3} fontSize="0.8rem" colorPalette="blue" textTransform="capitalize">
                  {job.workplaceType}
                </Badge>
              )}
              {job.jobType && (
                <Badge variant="outline" borderRadius="full" px={3} fontSize="0.8rem" colorPalette="purple" textTransform="capitalize">
                  {job.jobType}
                </Badge>
              )}
              {job.experienceLevel && (
                <Badge variant="outline" borderRadius="full" px={3} fontSize="0.8rem" colorPalette="teal" textTransform="capitalize">
                  {job.experienceLevel}
                </Badge>
              )}
            </HStack>
            {job.description && (
              <Text fontSize="0.9375rem" color="text_primary" lineHeight="1.7" whiteSpace="pre-wrap" mb={4}>
                {job.description}
              </Text>
            )}
            <Button
              variant="ghost"
              size="sm"
              color="button_bg"
              px={0}
              onClick={() => router.push(`/jobs/${jobId}`)}
              _hover={{ bg: "transparent", opacity: 0.7 }}
            >
              View full job posting →
            </Button>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default ApplicationDetailPage;
