
"use client";;
import { Box, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
import { useUpdateProfileVideoMutation } from "mangarine/state/services/profile.service";
import { useRef, useState } from "react";
import { LuCircleAlert } from "react-icons/lu";
import { Button } from "../ui/button";
import { toaster } from "../ui/toaster";
import { useDispatch } from "react-redux";
import { setUpdatedInfo } from 'mangarine/state/reducers/auth.reducer';
import TopRightDrawer from "../ui/top-right-drawer";

const ACCEPTED_FORMATS = ["mp4", "mov"];
const MAX_SIZE_MB = 100;

const EditIntroVideoModal = ({
  open,
  onOpenChange,
  currentVideoLink,
}: {
  open: boolean;
  onOpenChange: () => void;
  currentVideoLink?: string;
}) => {
  const [newVideoUrl, setNewVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [updateVideo, { isLoading }] = useUpdateProfileVideoMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const hasExisting = Boolean(currentVideoLink);
  // Show new preview if a file was picked, otherwise fall back to existing
  const previewUrl = newVideoUrl ?? currentVideoLink ?? null;

  const handleClose = () => {
    setNewVideoUrl(null);
    setVideoFile(null);
    setValidationError(null);
    onOpenChange();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError(null);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ACCEPTED_FORMATS.includes(ext)) {
      setValidationError("Unsupported format. Please upload an MP4 or MOV file.");
      e.target.value = "";
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      setValidationError(
        `File is too large (${sizeMB.toFixed(0)} MB). Maximum allowed size is ${MAX_SIZE_MB} MB.`
      );
      e.target.value = "";
      return;
    }

    setVideoFile(file);
    setNewVideoUrl(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append("file", videoFile);
    updateVideo(formData)
      .unwrap()
      .then((payload) => {
        const { message, data } = payload;
        dispatch(setUpdatedInfo({ updatedInfo: data }));
        toaster.create({
          title: "Success",
          description: message,
          type: "success",
          duration: 9000,
          closable: true,
        });
        handleClose();
      })
      .catch((error) => {
        toaster.create({
          title: "Failed",
          description: error?.message ?? "Upload failed. Please try again.",
          type: "error",
          duration: 3000,
          closable: true,
        });
      });
  };

  return (
    <TopRightDrawer
      open={open}
      onOpenChange={handleClose}
      title="Add Introduction Video"
      bodyProps={{
        px: { base: "4", lg: "6" },
        py: { base: "4", lg: "5" },
        pb: { base: "14", lg: "16" },
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".mp4,.mov"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Validation error */}
      {validationError && (
        <HStack
          mb={4}
          px={3}
          py={2}
          borderRadius="md"
          bg="red.50"
          borderWidth="1px"
          borderColor="red.200"
          gap={2}
          alignItems="flex-start"
        >
          <Icon color="red.500" mt="1px" flexShrink={0}>
            <LuCircleAlert size={14} />
          </Icon>
          <Text fontSize="0.8rem" color="red.600">{validationError}</Text>
        </HStack>
      )}

      {/* Video preview area */}
      {previewUrl ? (
        <Box borderRadius="12px" overflow="hidden" w="full" position="relative">
          <video
            src={previewUrl}
            controls
            style={{ width: "100%", borderRadius: "12px", display: "block" }}
          />
        </Box>
      ) : (
        /* Empty state — no video yet */
        <Box
          w="full"
          h="220px"
          borderRadius="12px"
          borderWidth="1.5px"
          borderStyle="dashed"
          borderColor="border_background"
          bg="bd_background"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={() => inputRef.current?.click()}
          _hover={{ borderColor: "primary.300", bg: "bg_box" }}
          transition="all 0.15s"
        >
          <VStack gap={2}>
            <Image src="/icons/upload.svg" alt="upload" w={12} h={12} />
            <Text fontSize="0.875rem" color="text_muted" textAlign="center">
              Click to select a video
            </Text>
            <Text fontSize="0.75rem" color="text_muted" textAlign="center">
              MP4 or MOV · max {MAX_SIZE_MB} MB
            </Text>
          </VStack>
        </Box>
      )}

      {/* Change Video link — only shown when a video (existing or new) is visible */}
      {previewUrl && (
        <Box mt={3} textAlign="center">
          <Text
            fontSize="0.875rem"
            fontWeight="500"
            color="text_primary"
            cursor="pointer"
            textDecoration="underline"
            _hover={{ opacity: 0.7 }}
            onClick={() => inputRef.current?.click()}
          >
            Change Video
          </Text>
        </Box>
      )}

      {/* Actions */}
      <HStack w="full" mt={8} gap={4}>
        <Button
          borderColor="primary.300"
          borderWidth={1}
          bg="bg_box"
          py={2}
          rounded="6px"
          flex={1}
          _hover={{ textDecor: "none" }}
          onClick={handleClose}
        >
          <Text color="primary.300" fontSize="0.875rem" fontWeight="500">
            Cancel
          </Text>
        </Button>
        <Button
          bg="button_bg"
          borderWidth={1}
          borderColor="button_bg"
          py={2}
          flex={1}
          loading={isLoading}
          loadingText="Saving…"
          disabled={!videoFile}
          _hover={{ textDecor: "none", bg: "#111D4A" }}
          rounded="6px"
          onClick={handleSave}
        >
          <Text color="white" fontSize="0.875rem" fontWeight="500">
            Save
          </Text>
        </Button>
      </HStack>
    </TopRightDrawer>
  );
};

export default EditIntroVideoModal;
