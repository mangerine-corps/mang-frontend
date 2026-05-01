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
import AppLayout from "mangarine/layouts/AppLayout";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import { useRouter } from "next/router";
import { IoArrowBack } from "react-icons/io5";
import { useGetJobByIdQuery } from "mangarine/state/services/jobs.service";

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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box mb={6}>
    <Text fontWeight="700" fontSize="1rem" color="text_primary" mb={2}>
      {title}
    </Text>
    {children}
  </Box>
);

const BulletList = ({ items }: { items: string[] }) => (
  <VStack align="stretch" gap={1}>
    {items.map((item, i) => (
      <HStack key={i} align="flex-start" gap={2}>
        <Text color="gray.400" mt="2px" flexShrink={0}>•</Text>
        <Text fontSize="0.9375rem" color="text_primary" lineHeight="1.6">{item}</Text>
      </HStack>
    ))}
  </VStack>
);

const JobDetailPage = () => {
  const router = useRouter();
  const { jobId } = router.query;

  const { data, isLoading, isError } = useGetJobByIdQuery(jobId as string, {
    skip: !jobId,
  });

  const job: any = (data as any)?.data ?? data;

  const formatSalary = () => {
    if (!job?.salaryFrom && !job?.salaryTo) return null;
    const currency = job?.currency ?? "USD";
    const from = job?.salaryFrom ? `${currency} ${Number(job.salaryFrom).toLocaleString()}` : null;
    const to = job?.salaryTo ? `${currency} ${Number(job.salaryTo).toLocaleString()}` : null;
    if (from && to) return `${from} – ${to}`;
    return from ?? to;
  };

  const salary = formatSalary();

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
          <Button
            variant="ghost"
            size="sm"
            mb={4}
            px={2}
            color="text_primary"
            onClick={() => router.back()}
            _hover={{ bg: "gray.100" }}
          >
            <HStack gap={1.5}>
              <IoArrowBack />
              <Text fontSize="0.875rem">Back</Text>
            </HStack>
          </Button>

          {isLoading ? (
            <Box bg="bg_box" borderRadius="12px" p={{ base: 5, md: 8 }} border="1px solid" borderColor="input_border">
              <Skeleton h="28px" w="50%" mb={3} />
              <Skeleton h="20px" w="30%" mb={6} />
              <SkeletonText noOfLines={4} mb={6} />
              <SkeletonText noOfLines={3} mb={6} />
              <SkeletonText noOfLines={3} />
            </Box>
          ) : isError || !job ? (
            <Flex direction="column" align="center" justify="center" minH="40vh" gap={3}>
              <Text fontWeight="700" fontSize="1.25rem" color="text_primary">Job not found</Text>
              <Text fontSize="0.875rem" color="gray.500">This job may have been removed or is no longer available.</Text>
              <Button
                bg="#111D4A"
                color="white"
                borderRadius="8px"
                size="sm"
                px={6}
                mt={2}
                onClick={() => router.push("/jobs")}
              >
                Back to Jobs
              </Button>
            </Flex>
          ) : (
            <Box bg="bg_box" borderRadius="12px" p={{ base: 5, md: 8 }} border="1px solid" borderColor="input_border">
              {/* Header */}
              <HStack justify="space-between" align="flex-start" mb={1} flexWrap="wrap" gap={2}>
                <Text fontWeight="700" fontSize={{ base: "1.25rem", md: "1.5rem" }} color="text_primary">
                  {job.title}
                </Text>
                {job.status && (
                  <Badge
                    colorPalette={statusColor[job.status] ?? "gray"}
                    borderRadius="full"
                    px={3}
                    py={1}
                    fontSize="0.75rem"
                    textTransform="capitalize"
                  >
                    {job.status}
                  </Badge>
                )}
              </HStack>

              {job.companyName && (
                <Text fontSize="0.9375rem" color="gray.500" mb={1}>{job.companyName}</Text>
              )}

              {/* Meta tags */}
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

              {salary && (
                <Box bg="gray.50" borderRadius="8px" px={4} py={3} mb={6} display="inline-block">
                  <Text fontSize="0.875rem" color="gray.500">Annual Salary</Text>
                  <Text fontWeight="700" fontSize="1rem" color="text_primary">{salary}</Text>
                </Box>
              )}

              {/* Description */}
              {job.description && (
                <Section title="About the role">
                  <Text fontSize="0.9375rem" color="text_primary" lineHeight="1.7" whiteSpace="pre-wrap">
                    {job.description}
                  </Text>
                </Section>
              )}

              {/* Responsibilities */}
              {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                <Section title="Responsibilities">
                  <BulletList items={job.responsibilities} />
                </Section>
              )}

              {/* Requirements */}
              {Array.isArray(job.requirements) && job.requirements.length > 0 && (
                <Section title="Requirements">
                  <BulletList items={job.requirements} />
                </Section>
              )}

              {/* Benefits */}
              {Array.isArray(job.benefits) && job.benefits.length > 0 && (
                <Section title="Benefits">
                  <BulletList items={job.benefits} />
                </Section>
              )}

              {/* Keywords */}
              {Array.isArray(job.keywords) && job.keywords.length > 0 && (
                <Section title="Keywords">
                  <HStack gap={2} flexWrap="wrap">
                    {job.keywords.map((kw: string) => (
                      <Badge key={kw} variant="subtle" colorPalette="gray" borderRadius="full" px={3} fontSize="0.8rem">
                        {kw}
                      </Badge>
                    ))}
                  </HStack>
                </Section>
              )}

              {/* Education */}
              {job.educationLevel && (
                <Section title="Education">
                  <Text fontSize="0.9375rem" color="text_primary" textTransform="capitalize">
                    {job.educationLevel.replace(/-/g, " ")}
                  </Text>
                </Section>
              )}

              {/* Apply */}
              {job.applicationValue && (
                <Box mt={6} pt={6} borderTopWidth="1px" borderColor="input_border">
                  <Text fontWeight="700" fontSize="1rem" color="text_primary" mb={3}>
                    How to Apply
                  </Text>
                  <a
                    href={job.applicationType === "email" ? `mailto:${job.applicationValue}` : job.applicationValue}
                    target={job.applicationType === "email" ? undefined : "_blank"}
                    rel="noopener noreferrer"
                  >
                    <Button
                      bg="#111D4A"
                      color="white"
                      borderRadius="8px"
                      fontFamily="Outfit"
                      fontWeight="600"
                      px={8}
                      py={5}
                      _hover={{ bg: "#0D173B" }}
                    >
                      {job.applicationType === "email" ? "Apply via Email" : "Apply Now"}
                    </Button>
                  </a>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </AppLayout>
  );
};

export default JobDetailPage;
