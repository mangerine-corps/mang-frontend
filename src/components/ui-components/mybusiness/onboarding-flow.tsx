"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Input,
  RadioGroup,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  LuChevronLeft,
  LuPencil,
  LuTrash2,
  LuUpload,
} from "react-icons/lu";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import { Checkbox } from "mangarine/components/ui/checkbox";
import { toaster } from "mangarine/components/ui/toaster";
import { setUpdatedInfo } from "mangarine/state/reducers/auth.reducer";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useSubmitConsultantVerificationMutation } from "mangarine/state/services/consultant.service";
import { useLazyGetUserInfoQuery } from "mangarine/state/services/profile.service";
import { useBecomeConsultantMutation } from "mangarine/state/services/user.service";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": {
    width: "0px",
    background: "transparent",
    height: "0px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "transparent",
    borderRadius: "0px",
    maxHeight: "0px",
    height: "0px",
    width: 0,
  },
};

const STORAGE_KEY = "my-business-consultant-onboarding";
const STEP_LABELS = [
  { id: "requirements", label: "Consultant Requirement" },
  { id: "idType", label: "ID details" },
  { id: "upload", label: "Upload document" },
];

type OnboardingStep = "intro" | "requirements" | "account" | "idType" | "upload";
type DocumentSide = "front" | "back";

type UploadedDocument = {
  file: File;
  name: string;
  size: number;
};

type OnboardingDraft = {
  accountDetails: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
  };
  agreements: {
    accurate: boolean;
    ethical: boolean;
    suspension: boolean;
  };
  documents: {
    back: UploadedDocument | null;
    front: UploadedDocument | null;
  };
  idType: string;
  step: OnboardingStep;
};

const DEFAULT_DRAFT: OnboardingDraft = {
  step: "intro",
  idType: "",
  accountDetails: {
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
  },
  agreements: {
    accurate: false,
    ethical: false,
    suspension: false,
  },
  documents: {
    front: null,
    back: null,
  },
};

const allowedDocumentTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const helperItems = [
  "Make sure the document clearly shows your name and full details.",
  "Supported file types: PNG, JPG, JPEG",
  "Maximum file size: 5MB",
];

const idOptions = [
  { label: "ID card", value: "national_id" },
  { label: "Passport", value: "passport" },
  { label: "Driver's License", value: "drivers_license" },
];

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${Math.max(size / 1024, 1).toFixed(0)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getStorageSafeDraft = (draft: OnboardingDraft) => ({
  ...draft,
  documents: { front: null, back: null },
});

const normalizeStoredStep = (step: unknown): OnboardingStep => {
  switch (step) {
    case "requirements":
    case "idType":
    case "upload":
    case "intro":
      return step;
    case "account":
      return "idType";
    default:
      return "intro";
  }
};

const GreenCheckIcon = ({ boxSize = "20px" }: { boxSize?: string | number }) => {
  return (
    <svg
      width={boxSize}
      height={boxSize}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M15 1.33989C16.5083 2.21075 17.7629 3.46042 18.6398 4.96519C19.5167 6.46997 19.9854 8.17766 19.9994 9.91923C20.0135 11.6608 19.5725 13.3758 18.72 14.8946C17.8676 16.4133 16.6332 17.6831 15.1392 18.5782C13.6452 19.4733 11.9434 19.9627 10.2021 19.998C8.46083 20.0332 6.74055 19.6131 5.21155 18.7791C3.68256 17.9452 2.39787 16.7264 1.48467 15.2434C0.571462 13.7604 0.0614093 12.0646 0.00500011 10.3239L0 9.99989L0.00500011 9.67589C0.0610032 7.94888 0.563548 6.26585 1.46364 4.79089C2.36373 3.31592 3.63065 2.09934 5.14089 1.25977C6.65113 0.420205 8.35315 -0.0137108 10.081 0.000330246C11.8089 0.0143713 13.5036 0.47589 15 1.33989ZM13.707 7.29289C13.5348 7.12072 13.3057 7.01729 13.0627 7.002C12.8197 6.98672 12.5794 7.06064 12.387 7.20989L12.293 7.29289L9 10.5849L7.707 9.29289L7.613 9.20989C7.42058 9.06075 7.18037 8.98692 6.9374 9.00225C6.69444 9.01757 6.46541 9.12101 6.29326 9.29315C6.12112 9.4653 6.01768 9.69433 6.00235 9.9373C5.98702 10.1803 6.06086 10.4205 6.21 10.6129L6.293 10.7069L8.293 12.7069L8.387 12.7899C8.56237 12.926 8.77803 12.9998 9 12.9998C9.22197 12.9998 9.43763 12.926 9.613 12.7899L9.707 12.7069L13.707 8.70689L13.79 8.61289C13.9393 8.42049 14.0132 8.18024 13.9979 7.93721C13.9826 7.69419 13.8792 7.46509 13.707 7.29289Z"
        fill="#30BC0D"
      />
    </svg>
  );
};

const PendingStepIcon = ({ boxSize = "24px" }: { boxSize?: string | number }) => {
  return (
    <svg
      width={boxSize}
      height={boxSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="9" stroke="#FFCF99" strokeWidth="6" />
    </svg>
  );
};

const StepProgress = ({
  currentStep,
  completed,
}: {
  completed: Record<string, boolean>;
  currentStep: OnboardingStep;
}) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      align={{ base: "flex-start", md: "center" }}
      gap={{ base: 3, md: 0 }}
      w="full"
      maxW="760px"
      mx="auto"
    >
      {STEP_LABELS.map((step, index) => {
        const isCurrent = currentStep === step.id;
        const isComplete = completed[step.id];
        const highlight = isCurrent || isComplete;

        return (
          <Flex
            key={step.id}
            flex={{ base: "unset", md: index === STEP_LABELS.length - 1 ? "unset" : 1 }}
            align={{ base: "flex-start", md: "center" }}
            w={{ base: "full", md: "auto" }}
          >
            <VStack gap={2} align={{ base: "flex-start", md: "center" }}>
              {highlight ? (
                <GreenCheckIcon />
              ) : (
                <Flex
                  boxSize="20px"
                  rounded="full"
                  borderWidth="3px"
                  borderColor="#48BB34"
                  bg="white"
                  align="center"
                  justify="center"
                />
              )}
              <Text
                fontSize="0.7rem"
                color="text_primary"
                fontWeight={highlight ? "600" : "400"}
                textAlign={{ base: "left", md: "center" }}
                whiteSpace="nowrap"
              >
                {step.label}
              </Text>
            </VStack>

            {index < STEP_LABELS.length - 1 && (
              <Box
                display={{ base: "none", md: "block" }}
                flex={1}
                h="2px"
                mx="18px"
                bg={completed[STEP_LABELS[index + 1].id] || isCurrent || currentStep === STEP_LABELS[index + 1].id ? "#9AE688" : "#DCEFD5"}
              />
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};

const RequirementStatus = ({
  actionLabel,
  description,
  isComplete,
  onAction,
  stepNumber,
  title,
}: {
  actionLabel?: string;
  description: string;
  isComplete: boolean;
  onAction?: () => void;
  stepNumber: string;
  title: string;
}) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      align={{ base: "flex-start", md: "center" }}
      gap={3}
      w="full"
    >
      <HStack align="flex-start" gap={3}>
        <Box pt="1">
          {isComplete ? (
            <GreenCheckIcon boxSize="18px" />
          ) : (
            <PendingStepIcon />
          )}
        </Box>
        <VStack align="flex-start" gap={0}>
          <Text fontSize="0.72rem" color={isComplete ? "#41B62A" : "#F3B25B"}>
            {stepNumber}
          </Text>
          <Text fontSize="0.96rem" fontWeight="600" color="text_primary">
            {title}
          </Text>
          <Text fontSize="0.82rem" color="gray.500">
            {description}
          </Text>
        </VStack>
      </HStack>

      {actionLabel && onAction && (
        <Button
          size="sm"
          variant="outline"
          borderColor="#B8C0D4"
          color="text_primary"
          bg="white"
          px={4}
          minH="36px"
          borderRadius="10px"
          flexShrink={0}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </Flex>
  );
};

const UploadCard = ({
  descriptionItems,
  file,
  onChange,
  onRemove,
  title,
}: {
  descriptionItems: string[];
  file: UploadedDocument | null;
  onChange: (file: File) => void;
  onRemove: () => void;
  title: string;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectFile = () => {
    inputRef.current?.click();
  };

  return (
    <VStack
      align="stretch"
      gap={4}
      w="full"
      p="4"
      borderWidth="1px"
      borderColor="#ECECEC"
      borderRadius="20px"
      bg="white"
    >
      <Input
        ref={inputRef}
        type="file"
        display="none"
        accept=".jpg,.jpeg,.png"
        onChange={(event) => {
          const nextFile = event.target.files?.[0];
          event.target.value = "";
          if (nextFile) onChange(nextFile);
        }}
      />

      <VStack align="flex-start" gap={1}>
        <Text fontSize="1.05rem" fontWeight="600" color="text_primary">
          {title}
        </Text>
        {file ? (
          <HStack color="#41B62A" fontSize="0.82rem">
            <GreenCheckIcon />
            <Text>Selected</Text>
          </HStack>
        ) : (
          <Text fontSize="0.82rem" color="gray.500">
            Upload a clear file in PNG, JPG, or JPEG format.
          </Text>
        )}
      </VStack>

      <Box
        borderRadius="16px"
        bg="#F3F3F4"
        minH="126px"
        px="4"
        py="5"
      >
        {file ? (
          <HStack h="full" align="center" gap={4}>
            <Flex
              boxSize="72px"
              borderRadius="16px"
              bg="#E5E5E5"
              align="center"
              justify="center"
            >
              <Image src="/icons/docs.svg" alt="document icon" boxSize="44px" />
            </Flex>

            <VStack align="flex-start" gap={0}>
              <Text
                fontSize="0.9rem"
                fontWeight="600"
                color="text_primary"
                lineClamp={1}
              >
                {file.name}
              </Text>
              <Text fontSize="0.82rem" color="gray.500">
                {formatFileSize(file.size)}
              </Text>
            </VStack>
          </HStack>
        ) : (
          <Flex h="full" align="center" justify="center">
            <VStack color="gray.500" gap={2}>
              <LuUpload size={26} />
              <Text fontSize="0.86rem">Select a file to upload</Text>
            </VStack>
          </Flex>
        )}
      </Box>

      <HStack gap={3}>
        <Button
          size="sm"
          variant="outline"
          borderColor="#E3D5BE"
          color="text_primary"
          flex={1}
          onClick={selectFile}
        >
          <LuPencil />
          {file ? "Change" : "Upload"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          borderColor="#F3CBCB"
          color="#D92D20"
          flex={1}
          onClick={onRemove}
          disabled={!file}
        >
          <LuTrash2 />
          Remove
        </Button>
      </HStack>

      <VStack align="flex-start" gap={1}>
        {descriptionItems.map((item) => (
          <HStack key={item} align="flex-start" gap={2}>
            <Text color="gray.400" fontSize="0.95rem">
              •
            </Text>
            <Text fontSize="0.8rem" color="gray.500">
              {item}
            </Text>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
};

const ConsultantOnboardingFlow = () => {
  const [draft, setDraft] = useState<OnboardingDraft>(DEFAULT_DRAFT);
  const [hydrated, setHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [becomeConsultant] = useBecomeConsultantMutation();
  const [submitConsultantVerification] = useSubmitConsultantVerificationMutation();
  const [triggerGetUserInfo] = useLazyGetUserInfoQuery();

  const profilePictureComplete = Boolean(user?.profilePics);
  const timezoneValue =
    (user as any)?.timezone ||
    (typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "");
  const timeZoneComplete = Boolean(timezoneValue);
  const agreementsComplete = Object.values(draft.agreements).every(Boolean);
  const documentsComplete = Boolean(draft.documents.front); // back is optional

  const completedSteps = useMemo(
    () => ({
      requirements: agreementsComplete,
      idType: Boolean(draft.idType),
      upload: documentsComplete,
    }),
    [agreementsComplete, draft.idType, documentsComplete]
  );

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    let nextDraft = DEFAULT_DRAFT;

    if (typeof window !== "undefined") {
      const rawDraft = window.localStorage.getItem(STORAGE_KEY);

      if (rawDraft) {
        try {
          const parsedDraft = JSON.parse(rawDraft);
          nextDraft = {
            ...DEFAULT_DRAFT,
            ...parsedDraft,
            accountDetails: {
              ...DEFAULT_DRAFT.accountDetails,
              ...(parsedDraft?.accountDetails ?? {}),
            },
            agreements: {
              ...DEFAULT_DRAFT.agreements,
              ...(parsedDraft?.agreements ?? {}),
            },
            documents: {
              ...DEFAULT_DRAFT.documents,
              ...(parsedDraft?.documents ?? {}),
            },
            step: normalizeStoredStep(parsedDraft?.step),
          };
        } catch {
          nextDraft = DEFAULT_DRAFT;
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }
    }

    if (router.query.startOnboarding === "1" && nextDraft.step === "intro") {
      nextDraft = {
        ...nextDraft,
        step: "requirements",
      };
    }

    setDraft(nextDraft);
    setHydrated(true);

    if (router.query.startOnboarding === "1") {
      router.replace("/my-business", undefined, { shallow: true });
    }
  }, [router, router.isReady, router.query.startOnboarding]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(getStorageSafeDraft(draft))
    );
  }, [draft, hydrated]);

  const setStep = (step: OnboardingStep) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      step,
    }));
  };

  const updateAgreement = (key: keyof OnboardingDraft["agreements"], checked: boolean) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      agreements: {
        ...currentDraft.agreements,
        [key]: checked,
      },
    }));
  };

  const removeDocument = (side: DocumentSide) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      documents: { ...currentDraft.documents, [side]: null },
    }));
  };

  const uploadDocument = (side: DocumentSide, file: File) => {
    if (!allowedDocumentTypes.includes(file.type)) {
      toaster.create({
        description: "Use a PNG, JPG, or JPEG file.",
        type: "error",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toaster.create({
        description: "The maximum allowed file size is 5MB.",
        type: "error",
      });
      return;
    }

    setDraft((currentDraft) => ({
      ...currentDraft,
      documents: {
        ...currentDraft.documents,
        [side]: { file, name: file.name, size: file.size },
      },
    }));
  };

  const handleRequirementsContinue = () => {
    if (!agreementsComplete) {
      toaster.create({
        description: "Confirm the consultant requirements before continuing.",
        type: "error",
      });
      return;
    }

    setStep("idType");
  };

  const handleIdTypeContinue = () => {
    if (!draft.idType) {
      toaster.create({
        description: "Select an ID type before continuing.",
        type: "error",
      });
      return;
    }

    setStep("upload");
  };

  const handleSubmitVerification = async () => {
    if (!documentsComplete) {
      toaster.create({
        description: "Upload the front document before submitting.",
        type: "error",
      });
      return;
    }

    if (!draft.idType) {
      toaster.create({
        description: "Select an ID type before submitting.",
        type: "error",
      });
      return;
    }

    let verificationSubmitted = false;

    try {
      setIsSubmitting(true);

      const verificationFormData = new FormData();
      verificationFormData.append("idType", draft.idType);
      verificationFormData.append("idFront", draft.documents.front!.file);

      if (draft.documents.back) {
        verificationFormData.append("idBack", draft.documents.back.file);
      }

      await submitConsultantVerification(verificationFormData).unwrap();
      verificationSubmitted = true;

      await becomeConsultant(undefined).unwrap();

      try {
        const userInfoResp = await triggerGetUserInfo(undefined).unwrap();
        const latestUser = userInfoResp?.data ?? userInfoResp;

        if (latestUser) {
          dispatch(setUpdatedInfo({ updatedInfo: latestUser }));
        }
      } catch {
        toaster.create({
          description:
            "Your consultant status was updated, but your profile refresh is delayed.",
          type: "info",
        });
      }

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }

      toaster.create({
        description: "Consultant onboarding submitted successfully.",
        type: "success",
      });

      router.replace("/my-business/dashboard");
    } catch (error: any) {
      toaster.create({
        description:
          error?.data?.message ||
          error?.message ||
          (verificationSubmitted
            ? "Your ID verification was submitted, but consultant activation could not be completed right now."
            : "Unable to complete consultant onboarding right now."),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <Flex w="full" h="full" minH="420px" align="center" justify="center">
        <Spinner size="lg" color="text_primary" />
      </Flex>
    );
  }

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", lg: "320px minmax(0, 1fr)" }}
      gap={4}
      w="full"
      h="full"
      minH={0}
    >
      <VStack
        display={{ base: "none", lg: "flex" }}
        align="stretch"
        gap={4}
        h="full"
        overflowY="auto"
        css={noScrollbar}
      >
        <Biocard />
        <DashboardCard />
      </VStack>

      <Box
        bg="bg_box"
        borderWidth="1px"
        borderColor="input_border"
        borderRadius="24px"
        px={{ base: "20px", md: "36px", lg: "44px" }}
        py={{ base: "28px", md: "36px" }}
        minH={{ base: "full", lg: "calc(100vh - 160px)" }}
        boxShadow="sm"
        overflowY="auto"
        css={noScrollbar}
      >
        {draft.step === "intro" && (
          <Flex minH="520px" align="center" justify="center">
            <VStack maxW="520px" gap={6} textAlign="center">
              <Image
                src="/becomeaconsultant.png"
                alt="Become a consultant"
                boxSize={{ base: "120px", md: "176px" }}
                objectFit="contain"
              />

              <VStack gap={2}>
                <Text
                  fontFamily="Outfit"
                  fontSize={{ base: "1.75rem", md: "2rem" }}
                  fontWeight="600"
                  color="text_primary"
                >
                  Become a Consultant
                </Text>
                <Text
                  maxW="440px"
                  fontSize={{ base: "0.95rem", md: "1rem" }}
                  color="gray.500"
                >
                  Start offering your expertise, connect with clients and earn
                  from your knowledge.
                </Text>
              </VStack>

              <Button
                w="full"
                maxW="360px"
                h="52px"
                bg="button_bg"
                color="button_text"
                fontWeight="600"
                onClick={() => setStep("requirements")}
                _hover={{ bg: "button_bg" }}
              >
                Become a Consultant
              </Button>
            </VStack>
          </Flex>
        )}

        {draft.step !== "intro" && (
          <VStack align="stretch" gap={8}>
            <Text
              fontSize={{ base: "1.5rem", md: "1.9rem" }}
              fontWeight="700"
              color="text_primary"
            >
              Become a Consultant
            </Text>

            <StepProgress currentStep={draft.step} completed={completedSteps} />

            {draft.step === "requirements" && (
              <VStack align="stretch" gap={6} maxW="760px" mx="auto" w="full">
                <RequirementStatus
                  stepNumber="Step 1"
                  title="Profile Picture"
                  description={
                    profilePictureComplete
                      ? "Added to profile"
                      : "Add a profile picture to improve trust."
                  }
                  isComplete={profilePictureComplete}
                  actionLabel={profilePictureComplete ? undefined : "Complete Profile"}
                  onAction={() => router.push("/profile")}
                />

                <RequirementStatus
                  stepNumber="Step 2"
                  title="Time Zone"
                  description={
                    timeZoneComplete
                      ? `${timezoneValue} already set in profile`
                      : "Set your timezone in general settings."
                  }
                  isComplete={timeZoneComplete}
                  actionLabel={timeZoneComplete ? undefined : "Update Settings"}
                  onAction={() => router.push("/settings?tab=general")}
                />

                <RequirementStatus
                  stepNumber="Step 3"
                  title="ID Verification Required"
                  description={
                    documentsComplete
                      ? "Your verification documents are ready."
                      : "Verify your identity."
                  }
                  isComplete={documentsComplete}
                  actionLabel={documentsComplete ? "Review Uploads" : "Verify Identity"}
                  onAction={() => setStep(draft.idType ? "upload" : "idType")}
                />

                <VStack align="stretch" gap={4} pt={2}>
                  <Checkbox
                    checked={draft.agreements.accurate}
                    onCheckedChange={(e) => updateAgreement("accurate", !!(e as any).checked)}
                  >
                    <Text fontSize="0.92rem" color="text_primary">
                      I confirm that the information in my profile is accurate.
                    </Text>
                  </Checkbox>
                  <Checkbox
                    checked={draft.agreements.ethical}
                    onCheckedChange={(e) => updateAgreement("ethical", !!(e as any).checked)}
                  >
                    <Text fontSize="0.92rem" color="text_primary">
                      I agree to provide professional and ethical consultations.
                    </Text>
                  </Checkbox>
                  <Checkbox
                    checked={draft.agreements.suspension}
                    onCheckedChange={(e) => updateAgreement("suspension", !!(e as any).checked)}
                  >
                    <Text fontSize="0.92rem" color="text_primary">
                      I understand that misleading information may lead to account suspension.
                    </Text>
                  </Checkbox>
                </VStack>

                <Button
                  alignSelf="center"
                  w="full"
                  maxW="320px"
                  mt={4}
                  bg="button_bg"
                  color="button_text"
                  disabled={!agreementsComplete}
                  _disabled={{ opacity: 0.55, cursor: "not-allowed" }}
                  onClick={handleRequirementsContinue}
                  _hover={{ bg: "button_bg" }}
                >
                  Continue to Verification
                </Button>
              </VStack>
            )}

            {draft.step === "idType" && (
              <VStack align="stretch" gap={6} maxW="560px" mx="auto" w="full">
                <Button
                  variant="ghost"
                  w="fit-content"
                  px={0}
                  color="text_primary"
                  onClick={() => setStep("requirements")}
                >
                  <LuChevronLeft />
                  Back
                </Button>

                <VStack align="flex-start" gap={1}>
                  <Text fontSize="1.55rem" fontWeight="700" color="text_primary">
                    Which photo identification would you like to submit?
                  </Text>
                  <Text fontSize="0.95rem" color="gray.500">
                    Select the document type you want to use for verification.
                  </Text>
                </VStack>

                <VStack align="flex-start" gap={4}>
                  <Text fontSize="1rem" fontWeight="600" color="text_primary">
                    Select an ID
                  </Text>
                  <RadioGroup.Root
                    value={draft.idType}
                    onValueChange={(e) =>
                      setDraft((currentDraft) => ({
                        ...currentDraft,
                        idType: e.value,
                      }))
                    }
                  >
                    <VStack align="flex-start" gap={4}>
                      {idOptions.map((option) => (
                        <RadioGroup.Item key={option.value} value={option.value}>
                          <RadioGroup.ItemHiddenInput />
                          <RadioGroup.ItemIndicator />
                          <RadioGroup.ItemText color="text_primary">
                            {option.label}
                          </RadioGroup.ItemText>
                        </RadioGroup.Item>
                      ))}
                    </VStack>
                  </RadioGroup.Root>
                </VStack>

                <Button
                  alignSelf="center"
                  w="full"
                  maxW="320px"
                  mt={4}
                  bg="button_bg"
                  color="button_text"
                  disabled={!draft.idType}
                  _disabled={{ opacity: 0.55, cursor: "not-allowed" }}
                  onClick={handleIdTypeContinue}
                  _hover={{ bg: "button_bg" }}
                >
                  Continue
                </Button>
              </VStack>
            )}

            {draft.step === "upload" && (
              <VStack align="stretch" gap={6} maxW="980px" mx="auto" w="full">
                <Button
                  variant="ghost"
                  w="fit-content"
                  px={0}
                  color="text_primary"
                  onClick={() => setStep("idType")}
                >
                  <LuChevronLeft />
                  Back
                </Button>

                <HStack
                  align="stretch"
                  gap={6}
                  flexDirection={{ base: "column", lg: "row" }}
                >
                  <UploadCard
                    title={`Front of ${draft.idType === "passport" ? "passport" : "ID"}`}
                    file={draft.documents.front}
                    onChange={(file) => uploadDocument("front", file)}
                    onRemove={() => removeDocument("front")}
                    descriptionItems={helperItems}
                  />

                  <UploadCard
                    title={`Back of ${draft.idType === "passport" ? "passport" : "ID"} (optional)`}
                    file={draft.documents.back}
                    onChange={(file) => uploadDocument("back", file)}
                    onRemove={() => removeDocument("back")}
                    descriptionItems={helperItems}
                  />
                </HStack>

                <Button
                  alignSelf="center"
                  w="full"
                  maxW="320px"
                  mt={2}
                  bg="button_bg"
                  color="button_text"
                  loading={isSubmitting}
                  disabled={!documentsComplete || !draft.idType}
                  _disabled={{ opacity: 0.55, cursor: "not-allowed" }}
                  onClick={handleSubmitVerification}
                  _hover={{ bg: "button_bg" }}
                >
                  Finish Application
                </Button>
              </VStack>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default ConsultantOnboardingFlow;
