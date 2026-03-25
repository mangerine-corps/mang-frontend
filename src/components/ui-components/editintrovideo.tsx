
"use client";;
import { Box, HStack, Image, Text } from "@chakra-ui/react";
import { useUpdateProfileVideoMutation } from "mangarine/state/services/profile.service";
import { useState } from "react";
import { Button } from "../ui/button";
import { toaster } from "../ui/toaster";
import { useDispatch } from "react-redux";
import { setUpdatedInfo } from 'mangarine/state/reducers/auth.reducer';
import TopRightDrawer from "../ui/top-right-drawer";

const video = "/icons/upload.svg";

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
  const dispatch = useDispatch();
  // const toast = useToast();

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideoFile(file);

    if (file) {
      const videoUrl = URL.createObjectURL(file); // Create a local URL for the video
      setVideoUrl(videoUrl); // Set the video URL for preview
    }
  };

  // Trigger file input when custom button is clicked
  const handleVideoClick = () => {
    document.getElementById("hidden-video-input").click();
    if (!videoFile) {
      return;
    }
    const formData = new FormData();
    formData.append("file", videoFile);
  };


  const changeVideo = () => {
    if (!videoFile) {
      return;
    }
    const formData = new FormData();
    formData.append("file", videoFile);
    updateVideo(formData)
      .unwrap()
      .then((payload) => {
        const { message, data } = payload;
        dispatch(setUpdatedInfo({ updatedInfo: data }))
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
        const {data, message} = error
        toaster.create({
          title: "Failed",
          description:message,
          type: "error",
          duration: 3000,
          closable: true,
        });
             onOpenChange();
             setVideoUrl(null)
        console.log(error, "errvid");
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
                accept="video/*"
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
              ) : (
                ""
                // <Image
                //   cursor={"pointer"}
                //   // onClick={handleImageClick}
                //   src={coverphoto}
                //   // src={previewCover ? `${previewCover}` : `${coverphoto}`}
                //   alt={"coverPhotoAlt"}
                //   width="100%"
                //   h={300}
                //   // maxHeight="full"
                //   objectFit="cover"
                //   borderRadius="12px"
                // />
              )}
              {!videoUrl && (
                <Box
                  pos={"absolute"}
                  top={"50%"}
                  left={"50%"}
                  // onClick={handleVideoClick}
                  transform="translate(-50%, -50%)"
                  // zIndex={50}
                >
                  <Image
                    cursor={"pointer"}
                    onClick={handleVideoClick}
                    w={12}
                    h={12}
                    src={video}
                    alt={"video-image"}
                  />
                </Box>
              )}
      </Box>
      <HStack w="full">
        <HStack
          w="100%"
          display={"flex"}
          mt="8"
          alignItems={"center"}
          flexDir={"row"}
          spaceX={6}
        >
          <Button
            borderColor="primary.300"
            borderWidth={1}
            color={"white"}
            bg={"white"}
            py={2}
            rounded="6px"
            w="45%"
            px={4}
            _hover={{
              textDecor: "none",
            }}
            onClick={onOpenChange}
          >
            <Text
              ml={2}
              className="text5"
              color={"primary.300"}
              fontSize={"0.875rem"}
              fontWeight={"500"}
            >
              Cancel
            </Text>
          </Button>
          <Button
            bg="#111D4A"
            borderWidth={1}
            color={"white"}
            borderColor={"#111D4A"}
            py={2}
            w="45%"
            px={4}
            loading={isLoading}
            loadingText={"Uploading"}
            _hover={{
              textDecor: "none",
              bg: "#111D4A",
            }}
            rounded={"6px"}
            onClick={changeVideo}
          >
            <Text
              ml={2}
              className="text5"
              color={"white"}
              fontSize={"0.875rem"}
              fontWeight={"500"}
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
