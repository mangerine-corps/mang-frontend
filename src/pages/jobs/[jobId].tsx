import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
  Text,
  Textarea,
  VStack,
  Dialog,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { FiBookmark, FiUsers } from "react-icons/fi";
import { FaBookmark } from "react-icons/fa";
import {
  useGetJobByIdQuery,
  useSaveJobMutation,
  useUnsaveJobMutation,
  useApplyToJobMutation,
  useWithdrawApplicationMutation,
  useGetJobApplicantsQuery,
} from "mangarine/state/services/jobs.service";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { toaster } from "mangarine/components/ui/toaster";

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
  const { user } = useAuth();

  const [applyOpen, setApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplicants, setShowApplicants] = useState(false);

  const { data, isLoading, isError } = useGetJobByIdQuery(jobId as string, {
    skip: !router.isReady || !jobId,
  });

  const { data: applicantsData } = useGetJobApplicantsQuery(
    { id: jobId as string },
    { skip: !router.isReady || !jobId || !showApplicants }
  );

  const [saveJob, { isLoading: isSaving }] = useSaveJobMutation();
  const [unsaveJob, { isLoading: isUnsaving }] = useUnsaveJobMutation();
  const [applyToJob, { isLoading: isApplying }] = useApplyToJobMutation();
  const [withdrawApplication, { isLoading: isWithdrawing }] = useWithdrawApplicationMutation();

  const isPageLoading = !router.isReady || isLoading;
  const job: any = (data as any)?.data?.job ?? (data as any)?.data ?? data;

  const isOwner = job?.createdById === user?.id;
  const isSaved: boolean = job?.isSaved ?? false;
  const hasApplied: boolean = job?.hasApplied ?? false;

  const applicants: any[] = (applicantsData as any)?.data?.applications ?? [];

  const formatSalary = () => {
    const salaryFrom = job?.salaryRange?.from ?? job?.salaryFrom;
    const salaryTo = job?.salaryRange?.to ?? job?.salaryTo;
    if (!salaryFrom && !salaryTo) return null;
    const currency = job?.salaryRange?.currency ?? job?.currency ?? "USD";
    const from = salaryFrom ? `${currency} ${Number(salaryFrom).toLocaleString()}` : null;
    const to = salaryTo ? `${currency} ${Number(salaryTo).toLocaleString()}` : null;
    if (from && to) return `${from} – ${to}`;
    return from ?? to;
  };

  const salary = formatSalary();

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await unsaveJob(jobId as string).unwrap();
        toaster.create({ description: "Job removed from saved.", type: "info" });
      } else {
        await saveJob(jobId as string).unwrap();
        toaster.create({ description: "Job saved.", type: "success" });
      }
    } catch {
      toaster.create({ description: "Something went wrong.", type: "error" });
    }
  };

  const handleApply = async () => {
    try {
      await applyToJob({ id: jobId as string, coverLetter: coverLetter.trim() || undefined }).unwrap();
      toaster.create({ description: "Application submitted!", type: "success" });
      setApplyOpen(false);
      setCoverLetter("");
    } catch (e: any) {
      toaster.create({ description: e?.data?.message ?? "Failed to submit application.", type: "error" });
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawApplication(jobId as string).unwrap();
      toaster.create({ description: "Application withdrawn.", type: "info" });
    } catch (e: any) {
      toaster.create({ description: e?.data?.message ?? "Failed to withdraw application.", type: "error" });
    }
  };

  return (
    <>
      <Box flex={1} h={{ base: "auto", md: "full" }} minH={0} overflowY={{ base: "visible", md: "auto" }} css={noScrollbar}>
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

        {isPageLoading ? (
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
              bg="button_bg"
              color="button_text"
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
              <HStack gap={2}>
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
                {/* Save button */}
                {!isOwner && (
                  <Button
                    size="sm"
                    variant="ghost"
                    color={isSaved ? "button_bg" : "gray.400"}
                    loading={isSaving || isUnsaving}
                    onClick={handleSaveToggle}
                    title={isSaved ? "Remove from saved" : "Save job"}
                    px={2}
                  >
                    {isSaved ? <FaBookmark /> : <FiBookmark />}
                  </Button>
                )}
                {/* Applicants button — job owner only */}
                {isOwner && (
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="input_border"
                    color="text_primary"
                    borderRadius="8px"
                    gap={1.5}
                    onClick={() => setShowApplicants((v) => !v)}
                  >
                    <FiUsers />
                    Applicants
                  </Button>
                )}
              </HStack>
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

            {/* Applicants panel */}
            {isOwner && showApplicants && (
              <Box mb={6} p={4} borderRadius="12px" border="1px solid" borderColor="input_border">
                <Text fontWeight="700" fontSize="1rem" color="text_primary" mb={3}>
                  Applicants ({applicants.length})
                </Text>
                {applicants.length === 0 ? (
                  <Text fontSize="0.875rem" color="gray.500">No applications yet.</Text>
                ) : (
                  <VStack align="stretch" gap={3}>
                    {applicants.map((app: any) => (
                      <HStack key={app.id} justify="space-between" p={3} bg="gray.50" borderRadius="8px">
                        <VStack align="flex-start" gap={0}>
                          <Text fontWeight="600" fontSize="0.875rem" color="text_primary">
                            {app.user?.fullName ?? "Applicant"}
                          </Text>
                          {app.coverLetter && (
                            <Text fontSize="0.8rem" color="gray.500" lineClamp={2}>{app.coverLetter}</Text>
                          )}
                        </VStack>
                        <Badge colorPalette="blue" borderRadius="full" px={2} fontSize="0.75rem" textTransform="capitalize">
                          {app.status ?? "pending"}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                )}
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

            {/* Action buttons */}
            {!isOwner && (
              <Box mt={6} pt={6} borderTopWidth="1px" borderColor="input_border">
                <HStack gap={3} flexWrap="wrap">
                  {/* In-platform apply */}
                  {hasApplied ? (
                    <Button
                      variant="outline"
                      borderColor="red.300"
                      color="red.500"
                      borderRadius="8px"
                      fontWeight="600"
                      px={8}
                      py={5}
                      loading={isWithdrawing}
                      onClick={handleWithdraw}
                      _hover={{ bg: "red.50" }}
                    >
                      Withdraw Application
                    </Button>
                  ) : (
                    <Button
                      bg="button_bg"
                      color="button_text"
                      borderRadius="8px"
                      fontWeight="600"
                      px={8}
                      py={5}
                      _hover={{ bg: "button_bg", opacity: 0.9 }}
                      onClick={() => setApplyOpen(true)}
                    >
                      Apply Now
                    </Button>
                  )}

                  {/* External apply link */}
                  {(job.application?.value ?? job.applicationValue) && (
                    <a
                      href={
                        (job.application?.type ?? job.applicationType) === "email"
                          ? `mailto:${job.application?.value ?? job.applicationValue}`
                          : (job.application?.value ?? job.applicationValue)
                      }
                      target={(job.application?.type ?? job.applicationType) === "email" ? undefined : "_blank"}
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        borderColor="button_bg"
                        color="button_bg"
                        borderRadius="8px"
                        fontWeight="600"
                        px={8}
                        py={5}
                        _hover={{ bg: "bd_background" }}
                      >
                        {(job.application?.type ?? job.applicationType) === "email" ? "Apply via Email" : "Apply on Website"}
                      </Button>
                    </a>
                  )}
                </HStack>
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Apply modal */}
      <Dialog.Root open={applyOpen} onOpenChange={(e) => setApplyOpen(!!(e as any).open)} placement="center">
        <Dialog.Backdrop />
        <Dialog.Positioner>
        <Dialog.Content p={6} maxW="480px">
          <Dialog.Header fontWeight="700" color="text_primary" fontSize="1.125rem" pb={2}>
            Apply for this job
          </Dialog.Header>
          <Dialog.CloseTrigger />
          <Dialog.Body pt={2}>
            <VStack align="stretch" gap={4}>
              <VStack align="flex-start" gap={1}>
                <Text fontSize="0.875rem" fontWeight="600" color="text_primary">
                  Cover Letter <Text as="span" color="gray.400" fontWeight="400">(optional)</Text>
                </Text>
                <Textarea
                  placeholder="Introduce yourself and why you're a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={5}
                  maxLength={2000}
                  fontSize="0.9rem"
                  resize="vertical"
                />
                <Text fontSize="0.75rem" color="gray.400" alignSelf="flex-end">
                  {coverLetter.length}/2000
                </Text>
              </VStack>
              <HStack gap={3} justify="flex-end" pt={2}>
                <Button
                  variant="ghost"
                  color="text_primary"
                  onClick={() => setApplyOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  bg="button_bg"
                  color="button_text"
                  borderRadius="8px"
                  fontWeight="600"
                  px={6}
                  loading={isApplying}
                  onClick={handleApply}
                  _hover={{ bg: "button_bg", opacity: 0.9 }}
                >
                  Submit Application
                </Button>
              </HStack>
            </VStack>
          </Dialog.Body>
        </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
};

export default JobDetailPage;
