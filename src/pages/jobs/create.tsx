import { Box, Button, Flex, Text, Textarea, VStack, Input, HStack } from "@chakra-ui/react";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import ActivityEmptyState from "mangarine/components/ui-components/emptystate";
import React from "react";
import { useForm } from "react-hook-form";
import { outfit } from "mangarine/pages/_app";
import { useCreateJobMutation } from "mangarine/state/services/jobs.service";
import { useRouter } from "next/router";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
};

const selectStyles: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #D0D5DD",
  borderRadius: "8px",
  padding: "10px 16px",
  fontSize: "1rem",
  background: "transparent",
  appearance: "none",
  WebkitAppearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 6L8 10L12 6' stroke='%23666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  cursor: "pointer",
};

const SectionTitle = ({ children }: { children: string }) => (
  <Text className={outfit.className} fontSize="1.125rem" fontWeight="700" color="text_primary" mb={4}>
    {children}
  </Text>
);

const FieldLabel = ({ children, required }: { children: string; required?: boolean }) => (
  <Text fontSize="0.875rem" color="text_primary" mb={1.5}>
    {children}
    {required && <Text as="span" color="red.500" ml={0.5}>*</Text>}
  </Text>
);

const FieldError = ({ message }: { message?: string }) =>
  message ? <Text color="red.500" fontSize="0.8rem" mt={1}>{message}</Text> : null;

type FormValues = {
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  workplaceType: "on-site" | "hybrid" | "remote";
  jobType: string;
  experienceLevel: string;
  educationLevel: string;
  keywords: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  applicationType: "website" | "email";
  applicationValue: string;
  salaryFrom: string;
  salaryTo: string;
  currency: string;
};

const toLines = (val: string) =>
  val.split("\n").map((s) => s.trim()).filter(Boolean);

const CreateJobPage = () => {
  const router = useRouter();
  const [createJob, { isLoading }] = useCreateJobMutation();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      workplaceType: "on-site",
      experienceLevel: "entry-level",
      educationLevel: "bachelors",
      applicationType: "website",
      currency: "USD",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    try {
      await createJob({
        title: data.title,
        description: data.description,
        city: data.city,
        state: data.state,
        country: data.country,
        officeLocation: `${data.city}, ${data.country}`,
        workplaceType: data.workplaceType,
        jobType: data.jobType,
        experienceLevel: data.experienceLevel,
        educationLevel: data.educationLevel,
        keywords: data.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        responsibilities: toLines(data.responsibilities),
        requirements: toLines(data.requirements),
        benefits: toLines(data.benefits),
        applicationType: data.applicationType,
        applicationValue: data.applicationValue,
        salaryFrom: data.salaryFrom,
        salaryTo: data.salaryTo,
        currency: data.currency,
      }).unwrap();
      router.push("/jobs");
    } catch (err: any) {
      setSubmitError(err?.data?.message ?? "Failed to publish job. Please try again.");
    }
  };

  const inputBase = {
    border: "1.5px solid",
    borderColor: "input_border",
    borderRadius: "8px",
    px: "16px",
    py: "12px",
    fontSize: "1rem",
    color: "text_primary",
    bg: "transparent",
    w: "full",
    _placeholder: { color: "gray.400" },
    _focus: { outline: "none", borderColor: "text_primary" },
  };

  const textareaBase = {
    border: "1.5px solid",
    borderRadius: "8px",
    px: 4,
    py: 3,
    fontSize: "1rem",
    color: "text_primary",
    bg: "transparent",
    w: "full",
    resize: "vertical" as const,
    _placeholder: { color: "gray.400" },
    _focus: { outline: "none", borderColor: "text_primary" },
  };

  return (
          <Box
        display="flex"
        flexDir={{ base: "column", md: "row" }}
        gap={4}
        w="full"
        h={{ base: "auto", md: "full" }}
        minH={0}
        overflow={{ base: "visible", md: "hidden" }}
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
        <Flex flex={1} gap={4} h={{ base: "auto", md: "full" }} minH={0} overflow={{ base: "visible", md: "hidden" }} align="flex-start">
          <Box
            as="form"
            flex={1}
            h={{ base: "auto", md: "full" }}
            minH={0}
            bg="bg_box"
            rounded="xl"
            p={{ base: 4, md: 6 }}
            overflowY={{ base: "visible", md: "auto" }}
            css={noScrollbar}
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Job details */}
            <SectionTitle>Job details</SectionTitle>
            <VStack spaceY={4} mb={6}>
              <Box w="full">
                <FieldLabel required>Job title</FieldLabel>
                <Input {...inputBase} placeholder="Example: Product management"
                  borderColor={errors.title ? "red.400" : "input_border"}
                  {...register("title", { required: "Job title is required" })} />
                <FieldError message={errors.title?.message} />
              </Box>

              <Box w="full">
                <FieldLabel required>Job description</FieldLabel>
                <Textarea {...textareaBase} minH="120px" placeholder="Tell us about the job"
                  borderColor={errors.description ? "red.400" : "input_border"}
                  {...register("description", { required: "Job description is required" })} />
                <FieldError message={errors.description?.message} />
              </Box>

              <Box w="full">
                <FieldLabel required>Responsibilities</FieldLabel>
                <Textarea {...textareaBase} minH="100px" placeholder={"Conduct user research\nTranslate user needs into wireframes"}
                  borderColor={errors.responsibilities ? "red.400" : "input_border"}
                  {...register("responsibilities", { required: "At least one responsibility is required" })} />
                <Text fontSize="0.8rem" color="gray.500" mt={1}>One item per line</Text>
                <FieldError message={errors.responsibilities?.message} />
              </Box>

              <Box w="full">
                <FieldLabel required>Requirements</FieldLabel>
                <Textarea {...textareaBase} minH="100px" placeholder={"2+ years of UX experience\nPortfolio demonstrating UX projects"}
                  borderColor={errors.requirements ? "red.400" : "input_border"}
                  {...register("requirements", { required: "At least one requirement is required" })} />
                <Text fontSize="0.8rem" color="gray.500" mt={1}>One item per line</Text>
                <FieldError message={errors.requirements?.message} />
              </Box>

              <Box w="full">
                <FieldLabel>Benefits</FieldLabel>
                <Textarea {...textareaBase} minH="100px" placeholder={"Competitive salary\nFlexible working arrangement"}
                  {...register("benefits")} />
                <Text fontSize="0.8rem" color="gray.500" mt={1}>One item per line</Text>
              </Box>
            </VStack>

            {/* Location */}
            <SectionTitle>Location</SectionTitle>
            <VStack spaceY={4} mb={6}>
              <Box w="full">
                <FieldLabel required>City</FieldLabel>
                <Input {...inputBase} placeholder="Example: Sydney"
                  borderColor={errors.city ? "red.400" : "input_border"}
                  {...register("city", { required: "City is required" })} />
                <FieldError message={errors.city?.message} />
              </Box>

              <Box w="full">
                <FieldLabel>State / Region</FieldLabel>
                <Input {...inputBase} placeholder="Example: New South Wales"
                  {...register("state")} />
              </Box>

              <Box w="full">
                <FieldLabel required>Country</FieldLabel>
                <Input {...inputBase} placeholder="Example: Australia"
                  borderColor={errors.country ? "red.400" : "input_border"}
                  {...register("country", {
                    required: "Country is required",
                    maxLength: { value: 100, message: "Country must be 100 characters or less" },
                  })} />
                <FieldError message={errors.country?.message} />
              </Box>

              <Box w="full">
                <FieldLabel required>Workplace</FieldLabel>
                <HStack gap={6}>
                  {(["on-site", "hybrid", "remote"] as const).map((opt) => (
                    <label key={opt} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.9375rem" }}>
                      <input type="radio" value={opt}
                        style={{ accentColor: "#111D4A", width: "16px", height: "16px" }}
                        {...register("workplaceType", { required: "Please select a workplace type" })} />
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </label>
                  ))}
                </HStack>
                <FieldError message={errors.workplaceType?.message} />
              </Box>

              <Box w="full">
                <FieldLabel required>Job type</FieldLabel>
                <select style={{ ...selectStyles, borderColor: errors.jobType ? "#FC8181" : "#D0D5DD" }}
                  {...register("jobType", { required: "Please select a job type" })}>
                  <option value="" disabled>Select...</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
                <FieldError message={errors.jobType?.message} />
              </Box>
            </VStack>

            {/* Employment details */}
            <SectionTitle>Employment details</SectionTitle>
            <VStack spaceY={4} mb={6}>
              <Box w="full">
                <FieldLabel required>Experience level</FieldLabel>
                <select style={selectStyles} {...register("experienceLevel", { required: "Experience level is required" })}>
                  <option value="entry-level">Entry-level</option>
                  <option value="mid-level">Mid-level</option>
                  <option value="senior-level">Senior-level</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
                <FieldError message={errors.experienceLevel?.message} />
              </Box>

              <Box w="full">
                <FieldLabel required>Education level</FieldLabel>
                <select style={{ ...selectStyles, borderColor: errors.educationLevel ? "#FC8181" : "#D0D5DD" }}
                  {...register("educationLevel", { required: "Education level is required" })}>
                  <option value="high-school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelors">Bachelor&apos;s Degree</option>
                  <option value="masters">Master&apos;s Degree</option>
                  <option value="doctorate">Doctorate / PhD</option>
                  <option value="not-required">Not Required</option>
                </select>
                <FieldError message={errors.educationLevel?.message} />
              </Box>

              <Box w="full">
                <FieldLabel required>Keywords</FieldLabel>
                <Input {...inputBase} placeholder="Research, DesignOps, Remote"
                  borderColor={errors.keywords ? "red.400" : "input_border"}
                  {...register("keywords", { required: "At least one keyword is required" })} />
                <Text fontSize="0.8rem" color="gray.500" mt={1}>Separate keywords with commas</Text>
                <FieldError message={errors.keywords?.message} />
              </Box>

              <Box w="full">
                <FieldLabel required>Application type</FieldLabel>
                <select style={{ ...selectStyles, borderColor: errors.applicationType ? "#FC8181" : "#D0D5DD" }}
                  {...register("applicationType", { required: "Application type is required" })}>
                  <option value="website">Website</option>
                  <option value="email">Email</option>
                </select>
                <FieldError message={errors.applicationType?.message} />
              </Box>

              <Box w="full">
                <FieldLabel required>Application link / Email</FieldLabel>
                <Input {...inputBase} placeholder="https://company.com/hiring"
                  borderColor={errors.applicationValue ? "red.400" : "input_border"}
                  {...register("applicationValue", { required: "Application link or email is required" })} />
                <FieldError message={errors.applicationValue?.message} />
              </Box>
            </VStack>

            {/* Annual Salary */}
            <SectionTitle>Annual Salary</SectionTitle>
            <HStack gap={4} mb={6} align="flex-start">
              <Box flex={1}>
                <FieldLabel>From</FieldLabel>
                <Input {...inputBase} type="number" placeholder="2000" {...register("salaryFrom")} />
              </Box>
              <Box flex={1}>
                <FieldLabel>To</FieldLabel>
                <Input {...inputBase} type="number" placeholder="5000" {...register("salaryTo")} />
              </Box>
              <Box flex={1}>
                <FieldLabel>Currency</FieldLabel>
                <select style={selectStyles} {...register("currency")}>
                  <option value="USD">US dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="CAD">Canadian Dollar (CA$)</option>
                  <option value="AUD">Australian Dollar (A$)</option>
                </select>
              </Box>
            </HStack>

            {submitError && (
              <Text color="red.500" fontSize="0.875rem" mb={2}>{submitError}</Text>
            )}
            <Button
              type="submit"
              w="full"
              bg="button_bg"
              color="button_text"
              borderRadius="8px"
              fontFamily="Outfit"
              fontWeight="600"
              py={6}
              _hover={{ bg: "button_bg", opacity: 0.9 }}
              loading={isLoading}
              disabled={isLoading}
            >
              Publish job
            </Button>
          </Box>

          {/* Right — Activities */}
          <Box display={{ base: "none", lg: "block" }} w="280px" flexShrink={0}>
            <ActivityEmptyState />
          </Box>
        </Flex>
      </Box>
      );
};

export default CreateJobPage;
