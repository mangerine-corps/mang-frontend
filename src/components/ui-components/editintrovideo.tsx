
"use client";;
import { Box, Drawer, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useUpdateProfileVideoMutation } from "mangarine/state/services/profile.service";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "../ui/button";
import { toaster } from "../ui/toaster";
import { useDispatch } from "react-redux";
import { setUpdatedInfo } from 'mangarine/state/reducers/auth.reducer';


const coverphoto = "";
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
    <Drawer.Root size={"md"} open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />
      <Drawer.Trigger>
        {/* <Image
        onClick={() => {
          isOpen;
        }}
        cursor={"pointer"}
        src="/icons/edit.svg"
        alt={edit}
      /> */}
      </Drawer.Trigger>
      <Drawer.Positioner zIndex={"max"}>
        <Drawer.Content pt="6" px="3">
          <Drawer.Header>
            <Drawer.Title>
              <VStack
                spaceY={6}
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
                px="3"
              >
                <HStack w="full" py={4} justifyContent={"space-between"}>
                  <Text
                    fontWeight={700}
                    fontSize={"2rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    // textAlign={"start"}
                  >
                    Edit Introduction Video
                  </Text>
                  <HStack spaceX={4}>
                    {/* <Box
                      border={0.5}
                      rounded={4}
                      py={2}
                      px="2"
                      onClick={handleVideoClick}
                      borderColor={"gray.150"}
                      shadow={"md"}
                    >
                      <Text
                        color="text_primary"
                        fontSize={"1rem"}
                        fontWeight={"600"}
                      >
                        <HiMiniPlus />
                      </Text>
                    </Box> */}
                    <Box
                      border={0.5}
                      rounded={4}
                      py={2}
                      px="2"
                      onClick={onOpenChange}
                      borderColor={"gray.150"}
                      shadow={"md"}
                    >
                      {/* <Image
                      cursor={"pointer"}
                      onClick={onOpenChange}
                      w={4}
                      h={4}
                      // src={close}
                      alt={"close-image"}
                    /> */}
                      <Text
                        color="text_primary"
                        fontSize={"0.8rem"}
                        fontWeight={"400"}
                      >
                        <FaTimes />
                      </Text>
                    </Box>
                  </HStack>
                </HStack>
              </VStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body px="3" py="8">
            <Box
              borderRadius="lg"
              //   background="red.900"
              boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
              width="100%"
              height={300}
              //   maxHeight="200px"
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
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}

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
                  bg="primary.300"
                  borderWidth={1}
                  color={"white"}
                  borderColor={"gray.50"}
                  py={2}
                  w="45%"
                  px={4}
                  loading={isLoading}
                  loadingText={"Uploading"}
                  _hover={{
                    textDecor: "none",
                  }}
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
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
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default EditIntroVideoModal;
