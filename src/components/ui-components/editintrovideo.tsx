
"use client";;
import { Box, HStack, Icon, Image, Text, VStack } from "@chakra-ui/react";
import { useUpdateProfileVideoMutation } from "mangarine/state/services/profile.service";
import { useState } from "react";
import { LuCircleAlert, LuInfo } from "react-icons/lu";
import { Button } from "../ui/button";
import { toaster } from "../ui/toaster";
import { useDispatch } from "react-redux";
import { setUpdatedInfo } from 'mangarine/state/reducers/auth.reducer';
import TopRightDrawer from "../ui/top-right-drawer";

const video = "/icons/upload.svg";

const ACCEPTED_FORMATS = ["mp4", "mov"];
const MAX_SIZE_MB = 100;

const EditIntroVideoModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [updateVideo, { isLoading }] = useUpdateProfileVideoMutation();
  const [videoFile, setVideoFile] = useState<any>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setValidationError(null);

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !ACCEPTED_FORMATS.includes(ext)) {
      setValidationError(`Unsupported format. Please upload an MP4 or MOV file.`);
      e.target.value = "";
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      setValidationError(`File is too large (${sizeMB.toFixed(0)} MB). Maximum allowed size is ${MAX_SIZE_MB} MB.`);
      e.target.value = "";
      return;
    }

    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
  };

  const handleVideoClick = () => {
    document.getElementById("hidden-video-input").click();
  };

  const changeVideo = () => {
    if (!videoFile?.name) return;

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
        onOpenChange();
        setVideoUrl(null);
      })
      .catch((error) => {
        const { message } = error;
        toaster.create({
          title: "Failed",
          description: message,
          type: "error",
          duration: 3000,
          closable: true,
        });
        onOpenChange();
        setVideoUrl(null);
      });
  };

  return (
    <TopRightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Introduction Video"
      bodyProps={{
        px: { base: "4", lg: "6" },
        py: { base: "4", lg: "5" },
        pb: { base: "14", lg: "16" },
      }}
    >
      {/* Upload guidelines */}
      <Box
        mb={4}
        px={3}
        py={3}
        borderRadius="lg"
        bg="bd_background"
        borderWidth="1px"
        borderColor="border_background"
      >
        <HStack mb={2} gap={2} alignItems="center">
          <Icon color="button_bg">
            <LuInfo size={15} />
          </Icon>
          <Text fontSize="0.8rem" fontWeight="600" color="text_primary">
            Upload Guidelines
          </Text>
        </HStack>
        <VStack gap={1} alignItems="flex-start">
          {[
            { label: "Formats", value: "MP4, MOV" },
            { label: "Max size", value: `${MAX_SIZE_MB} MB` },
            { label: "Recommended duration", value: "1–3 minutes" },
          ].map(({ label, value }) => (
            <HStack key={label} gap={2} alignItems="center">
              <Box w="4px" h="4px" borderRadius="full" bg="text_muted" flexShrink={0} />
              <Text fontSize="0.775rem" color="text_muted">
                <Text as="span" fontWeight="600" color="text_primary">{label}:</Text> {value}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Validation error */}
      {validationError && (
        <HStack
          mb={3}
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

      <Box
        borderRadius="lg"
        boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
        width="100%"
        height={300}
        position="relative"
      >
        <input
          id="hidden-video-input"
          type="file"
          accept=".mp4,.mov"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            style={{
              width: "100%",
              height: "300px",
              borderRadius: "12px",
            }}
          />
        ) : null}

        {!videoUrl && (
          <Box
            pos="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <VStack gap={2} alignItems="center">
              <Image
                cursor="pointer"
                onClick={handleVideoClick}
                w={12}
                h={12}
                src={video}
                alt="video-image"
              />
              <Text
                fontSize="0.775rem"
                color="text_muted"
                textAlign="center"
                cursor="pointer"
                onClick={handleVideoClick}
              >
                Click to select a video
              </Text>
            </VStack>
          </Box>
        )}
      </Box>

      <HStack w="full">
        <HStack
          w="100%"
          display="flex"
          mt="8"
          alignItems="center"
          flexDir="row"
          gap={6}
        >
          <Button
            borderColor="primary.300"
            borderWidth={1}
            color="white"
            bg="white"
            py={2}
            rounded="6px"
            w="45%"
            px={4}
            _hover={{ textDecor: "none" }}
            onClick={onOpenChange}
          >
            <Text
              ml={2}
              className="text5"
              color="primary.300"
              fontSize="0.875rem"
              fontWeight="500"
            >
              Cancel
            </Text>
          </Button>
          <Button
            bg="#111D4A"
            borderWidth={1}
            color="white"
            borderColor="#111D4A"
            py={2}
            w="45%"
            px={4}
            loading={isLoading}
            loadingText="Uploading"
            disabled={!videoFile?.name}
            _hover={{ textDecor: "none", bg: "#111D4A" }}
            rounded="6px"
            onClick={changeVideo}
          >
            <Text
              ml={2}
              className="text5"
              color="white"
              fontSize="0.875rem"
              fontWeight="500"
            >
              Upload
            </Text>
          </Button>
        </HStack>
      </HStack>
    </TopRightDrawer>
  );
};

export default EditIntroVideoModal;
