import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Portal,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { BiChevronDown } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import FeedAction from "./feedaction";
import dynamic from "next/dynamic";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false, loading: () => null });
import { useCallback, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { RiEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useCreatePostMutation } from "mangarine/state/services/posts.service";
import { useDispatch } from "react-redux";
import { addPost } from "mangarine/state/reducers/post.reducer";
import { toaster } from "../ui/toaster";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useRouter } from "next/router";
import { IoVideocamOutline } from "react-icons/io5";
import UploadToPremiumModal from "./modals/uploadtopremium";
import ImageLightbox from "./imagelightbox";

const smily = "/icons/smily.svg";
const tag = "/icons/tag.svg";
const image = "/icons/img.svg";
const locationIcon = "/icons/location.svg";
const videoimg = <IoVideocamOutline />;

type FeedInputProps = {
  onCreated?: (post: any) => void;
};

const FeedInput = ({ onCreated }: FeedInputProps) => {
  const [value, setValue] = useState("");
  const [, setIsModalOpen] = useState(false);
  const [showTextBox, setShowTextBox] = useState<boolean>(false);
  const [showMobileCreate, setShowMobileCreate] = useState(false);
  const { user } = useAuth();
  const openModal = () => {
    setIsModalOpen(true);
  };
  const router = useRouter();
  // const [, setInputValue] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [openImageLimit, setOpenImageLimit] = useState(false);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropIndex, setCropIndex] = useState<number | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const cropImgRef = useRef<HTMLImageElement | null>(null);

  // const [, setIsPreviewMode] = useState(false);
  const dispatch = useDispatch();

  const [createPost, { isLoading }] = useCreatePostMutation();

  const MAX_IMAGES = 4;
  const emojiRef = useRef(null);
  useClickAway(emojiRef, () => {
    setShowPicker(false);
  });

  const handleClick = () => {
    videoInputRef.current?.click();
    console.log("input ref:", videoInputRef.current);
  };
  const handleMyVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // just take the first file
    if (!file) return;

    setSelectedVideo(file); // store file object
    setVideoPreview(URL.createObjectURL(file)); // create preview URL
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const onEmojiClick = (emojiObject) => {
    // console.log(value);
    setValue(`${value} ${emojiObject.emoji}`);
  };

  const handleImageClick = () => {
    fileInputRef.current.click(); // trigger hidden file input
  };
  const handleMyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const totalImages = selectedImage.length + fileArray.length;

      // if selected images exceed the limit
      if (totalImages > MAX_IMAGES) {
        setOpenImageLimit(true); // trigger the ImageLimitModal
        return;
      }

      setSelectedImage([...selectedImage, ...fileArray]);

      const previewArray = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreview((prevPreviews) => [...prevPreviews, ...previewArray]);
    }
  };

  const handleEditImage = (index: number) => {
    setCropSrc(imagePreview[index]);
    setCropIndex(index);
    setCrop(undefined);
    setCompletedCrop(null);
    setCropOpen(true);
  };

  const onCropImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerCrop(makeAspectCrop({ unit: "%", width: 80 }, 1, width, height), width, height));
  }, []);

  const applyCrop = () => {
    if (!completedCrop || !cropImgRef.current || cropIndex === null) return;
    const img = cropImgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      img,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0,
      completedCrop.width,
      completedCrop.height
    );
    canvas.toBlob((blob) => {
      if (!blob) return;
      const originalName = selectedImage[cropIndex]?.name ?? "image.jpg";
      const file = new File([blob], originalName, { type: "image/jpeg" });
      const previewUrl = URL.createObjectURL(blob);
      setSelectedImage((prev) => { const a = [...prev]; a[cropIndex] = file; return a; });
      setImagePreview((prev) => { const a = [...prev]; a[cropIndex] = previewUrl; return a; });
      setCropOpen(false);
      setCropSrc(null);
      setCropIndex(null);
    }, "image/jpeg", 0.95);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...selectedImage];
    const updatedPreviews = [...imagePreview];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setSelectedImage(updatedImages);
    setImagePreview(updatedPreviews);
    // reset the file input to allow re-selecting the same image
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


const addTag =(username:string)=>{
  if (!tags.includes(username)) {
    setTags([...tags, username]);
  }
}

  const submitPost = async () => {
    // Require at least content or one media (image or video)
    if (!value && selectedImage.length === 0 && !selectedVideo) {
      return;
    }
    const formData = new FormData();
    formData.append("content", value.trim());
    if (router.pathname.includes("group")) {
      const { groupId } = router.query;
      formData.append("groupId", groupId as unknown as string);
    }
    if (selectedVideo) {
      formData.append("video", selectedVideo);
    }
    selectedImage.forEach((image, index) => {
      formData.append(`image[${index}]`, image);
    });

    createPost(formData)
      .unwrap()
      .then((response: any) => {
        dispatch(addPost({ post: response.data }));
        // Notify parent (e.g., group page) so it can add the new post to the list
        try {
          if (typeof onCreated === 'function') {
            onCreated(response.data);
          }
        } catch {}
        setValue("");
        setSelectedImage([]);
        setImagePreview([]);
        fileInputRef.current.value = "";
        // clear video state and reset input
        setSelectedVideo(null);
        setVideoPreview(null);
        if (videoInputRef.current) {
          videoInputRef.current.value = "";
        }
        toaster.create({
          title: "Post Created.",
          description: "Your post has been created successfully.",
          type: "success",
          duration: 4000,
          closable: true,
        });
        // refetch();
      })
      .catch((error: any) => {
        console.log(error);
        toaster.create({
          title: "Unable to create post.",
          description: "Post creation failed.",
          type: "error",
          duration: 4000,
          closable: true,
        });
      });
  };

  const deleteVideo = () => {
    setSelectedVideo(null);
    setVideoPreview(null);
    if (videoInputRef.current) {
      videoInputRef.current.value = ""; // reset the file input
    }
  };

  // const handleFileChange = (event: any) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     console.log("Selected file:", file);
  //     // You can now upload it, preview it, etc.
  //   }
  // };

  const closeMobile = () => {
    setShowMobileCreate(false);
    setValue("");
    setSelectedImage([]);
    setImagePreview([]);
    setSelectedVideo(null);
    setVideoPreview(null);
  };

  return (
    <>
      <UploadToPremiumModal isOpen={openImageLimit} onOpenChange={() => setOpenImageLimit(false)} />

      {/* Mobile full-screen create post overlay */}
      {showMobileCreate && (
        <Portal>
          <Box
            display={{ base: "flex", md: "none" }}
            position="fixed"
            inset={0}
            zIndex={1400}
            bg="main_background"
            flexDirection="column"
          >
            {/* Header */}
            <HStack
              px={4}
              py={3}
              borderBottomWidth="1px"
              borderColor="#E8E8E9"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text
                fontSize="0.875rem"
                fontWeight="500"
                color="text_primary"
                cursor="pointer"
                onClick={closeMobile}
              >
                Cancel
              </Text>
              <Text fontSize="1rem" fontWeight="700" color="text_primary">
                Create Post
              </Text>
              <Button
                bg="#111D4A"
                color="white"
                size="sm"
                borderRadius="8px"
                px={4}
                loading={isLoading}
                onClick={submitPost}
                _hover={{ bg: "#1a2a6c" }}
              >
                Post
              </Button>
            </HStack>

            {/* Avatar + audience */}
            <HStack px={4} pt={4} gap={3}>
              <Avatar.Root w={9} h={9}>
                <Avatar.Fallback name={`${user?.fullName}`} />
                <Avatar.Image src={user?.profilePics} />
              </Avatar.Root>
              <HStack
                borderWidth="1px"
                borderColor="#E8E8E9"
                borderRadius="full"
                px={3}
                py={1}
                gap={1}
                cursor="pointer"
              >
                <Text fontSize="0.8rem" fontWeight="500" color="text_primary">Everyone</Text>
                <Icon color="text_primary"><BiChevronDown /></Icon>
              </HStack>
            </HStack>

            {/* Textarea */}
            <Box flex={1} px={4} pt={3} overflowY="auto">
              <Textarea
                border="none"
                outline="none"
                resize="none"
                placeholder="What would you like to share?"
                value={value}
                onChange={(e: any) => setValue(e.target.value)}
                color="text_primary"
                fontSize="1rem"
                minH="120px"
                autoFocus
                _focus={{ boxShadow: "none", borderColor: "transparent" }}
              />

              {/* Image previews */}
              {imagePreview.length > 0 && (
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="8px" pt={3}>
                  {imagePreview.map((src, index) => (
                    <Box key={src} position="relative" borderRadius="10px" overflow="hidden">
                      <Image
                        src={src}
                        alt="preview"
                        w="full"
                        h="130px"
                        objectFit="cover"
                        borderRadius="10px"
                      />
                      <Box
                        position="absolute" top="6px" left="6px"
                        w="24px" h="24px" borderRadius="4px"
                        bg="rgba(0,0,0,0.45)" display="flex"
                        alignItems="center" justifyContent="center"
                        cursor="pointer"
                        onClick={(e) => { e.stopPropagation(); handleEditImage(index); }}
                      >
                        <RiEditFill color="white" size={13} />
                      </Box>
                      <Box
                        position="absolute" top="6px" right="6px"
                        w="24px" h="24px" borderRadius="4px"
                        bg="rgba(0,0,0,0.45)" display="flex"
                        alignItems="center" justifyContent="center"
                        cursor="pointer"
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                      >
                        <IoClose color="white" size={13} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Bottom actions */}
            <HStack
              px={4}
              py={3}
              borderTopWidth="1px"
              borderColor="#E8E8E9"
              gap={4}
            >
              <Box onClick={handleImageClick} cursor="pointer">
                <Image src={image} alt="image" boxSize="22px" />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleMyImageChange}
                  style={{ display: "none" }}
                />
              </Box>
              <Box cursor="pointer" onClick={() => setShowPicker(!showPicker)} pos="relative">
                <Image src={smily} alt="emoji" boxSize="22px" />
                <Box ref={emojiRef} pos="absolute" bottom="40px" left={0} zIndex="max">
                  {showPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
                </Box>
              </Box>
              <Image src={locationIcon} alt="location" boxSize="22px" cursor="pointer" />
            </HStack>
          </Box>
        </Portal>
      )}

      <HStack
        rounded={"15px"}
        borderWidth={1}
        alignItems={"flex-start"}
        borderColor={"#E8E8E9"}
        bg="bg_box"
        // h="full"
        // p={4}
        // flex={''}

        w="full"
        // w={{ base: "98%", md: "97%", lg: "96%", xl: "96%" }}
        my="4"
        onClick={openModal} // triggers the modal when clicked
      >
        <Avatar.Root shadow={"lg"} mx="4" mt={4} w={10} h={10}>
          <Avatar.Fallback name={`${user?.fullName}`} />
          <Avatar.Image src={user?.profilePics} />
        </Avatar.Root>
        {showTextBox ? (
          <Box
            w={"full"}
            // minH={"2rem"}
            rounded={"15px"}
            borderWidth={2}
            minH={"100px"}
            my={4}
            position="relative"
            cursor="pointer"
            mr="4"
            borderColor={"#E8E8E9"}
          >
            <HStack
              p={4}
              w={"full"}
              h={"full"}
              spaceX={"6"}
              justifyContent={"space-between"}
            >
              <VStack
                flex={2}
                w={"full"}
                h="full"
                justifyContent={"space-between"}
              >
                <Textarea
                  borderWidth={0}
                  resize={"none"}
                  placeholder="What would you like to share?"
                  value={value}
                  color="text_primary"
                  onChange={(e: any) => setValue(e.target.value)}
                  outline={"none"}
                  // isReadOnly // making it read-only since modal opens on click
                  w={"full"}
                />
                {imagePreview.length > 0 && (
                  <Box
                    display="grid"
                    gridTemplateColumns="repeat(2, 1fr)"
                    gap="8px"
                    borderTopWidth={1}
                    pt={4}
                    w="full"
                  >
                    {imagePreview.map((src, index) => (
                      <Box key={src} position="relative" borderRadius="10px" overflow="hidden">
                        <Image
                          src={src}
                          alt="Selected image"
                          objectFit="cover"
                          w="full"
                          h="130px"
                          borderRadius="10px"
                          cursor="pointer"
                          onClick={() => setLightboxIndex(index)}
                        />
                        <Box
                          position="absolute" top="6px" left="6px"
                          w="24px" h="24px" borderRadius="4px"
                          bg="rgba(0,0,0,0.45)" display="flex"
                          alignItems="center" justifyContent="center"
                          cursor="pointer"
                          onClick={(e) => { e.stopPropagation(); handleEditImage(index); }}
                        >
                          <RiEditFill color="white" size={13} />
                        </Box>
                        <Box
                          position="absolute" top="6px" right="6px"
                          w="24px" h="24px" borderRadius="4px"
                          bg="rgba(0,0,0,0.45)" display="flex"
                          alignItems="center" justifyContent="center"
                          cursor="pointer"
                          onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                        >
                          <IoClose color="white" size={13} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
                <HStack alignItems="stretch" pt={imagePreview.length > 0 ? 0 : 4}>
                  {videoPreview && (
                    <Box
                      display={"flex"}
                      h="full"
                      // key={index}
                      position="relative"
                      // width={
                      //   selectedImage.length > 1
                      //     ? { base: "100%", md: "calc(25% - 8px)" }
                      //     : "100%"
                      // }
                      // maxWidth={
                      //   selectedImage.length > 1 ? "none" : "calc(100% - 16px)"
                      // }
                    >
                      <video
                        controls
                        width="full"
                        className="rounded-md shadow"
                      >
                        <source src={videoPreview} type="video/mp4" />
                      </video>

                  

                      {/* cancel image button */}
                      <Box
                        position="absolute"
                        top="8px"
                        right="8px"
                        width="24px"
                        height="24px"
                        borderRadius="2px"
                        bg="rgba(0, 0, 0, 0.3)"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        cursor="pointer"
                        onClick={deleteVideo}
                      >
                        <MdDelete color="red" />
                      </Box>
                    </Box>
                  )}
                </HStack>

                <HStack flex={1} w="full" justifyContent={"space-between"}>
                  <HStack spaceX={"4"}>
                    <Box>
                      <FeedAction icon={image} action={handleImageClick} />
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleMyImageChange}
                        style={{ display: "none" }}
                      />
                    </Box>
                    <Box pos={"relative"}>
                      <FeedAction
                        icon={smily}
                        action={() => setShowPicker(!showPicker)}
                      />
                      <Box ref={emojiRef} pos={"absolute"} zIndex={"max"}>
                        {showPicker && (
                          <EmojiPicker onEmojiClick={onEmojiClick} />
                        )}
                      </Box>
                    </Box>
                  </HStack>
                  <VStack
                    w="full"
                    flex="1"
                    h="full"
                    justifyContent={"flex-end"}
                  >
                    {/* <HStack
                pos={"relative"}
                w="full"
                justifyContent={"space-between"}
              >
                <Popover.Root>
                  <Popover.Trigger asChild>
                    <HStack
                      py={2}
                      px={2}
                      w="120px"
                      justifyContent={"space-between"}
                      rounded="md"
                      alignItems={"center"}
                      borderWidth={1}
                      borderColor={"gray.100"}
                    >
                      <Box mx={1} flex={2} w="full">
                        <Text>Everyone</Text>
                      </Box>
                      <IconButton
                        aria-label="right icon"
                        _hover={{ bg: "transparent" }}
                        borderWidth={0}
                        size={"xs"}
                      >
                        {<BiChevronDown size={16} />}
                      </IconButton>
                    </HStack>
                  </Popover.Trigger>
                  <Portal>
                    <PopoverContent maxW="120px">
                      <PopoverBody>
                        <Text fontSize={"1rem"} cursor={"pointer"} py={2}>
                          Everyone
                        </Text>
                        <Text fontSize={"1rem"} cursor={"pointer"} py={2}>
                          Followers
                        </Text>

                        <HStack py={2} justifyContent={"space-between"}>
                          <Box mx={1} flex={2} w="full">
                            <Text fontSize={"1rem"} cursor={"pointer"}>
                              Groups
                            </Text>
                          </Box>
                          <IconButton
                            aria-label="right icon"
                            _hover={{ bg: "transparent" }}
                            borderWidth={0}
                            size={"xs"}
                          >
                            {<BiChevronDown size={16} />}
                          </IconButton>
                        </HStack>
                      </PopoverBody>
                    </PopoverContent>
                  </Portal>
                </Popover.Root>
              </HStack> */}

                    <Button
                      display="flex"
                      size={"md"}
                      borderRadius={"lg"}
                      px={5}
                      onClick={submitPost}
                      bg={value ? "#111D4A" : "transparent"}
                      borderWidth={0}
                      justifyContent="center"
                      alignItems="center"
                      loading={isLoading}
                      alignSelf="flex-end"
                      color={value ? "white" : "gray.400"}
                      disabled={!value}
                      transition="all 0.2s"
                    >
                      Post
                    </Button>
                  </VStack>
                </HStack>
              </VStack>
            </HStack>
          </Box>
        ) : (
          <HStack
            w={"full"}
            rounded={"15px"}
            borderWidth={1}
            cursor={"pointer"}
            borderColor={"#E8E8E9"}
            onClick={() => {
              if (window.innerWidth < 768) {
                setShowMobileCreate(true);
              } else {
                setShowTextBox(true);
              }
            }}
            my={4}
            mr="4"
            py="4"
            pl="4"
            alignItems={"center"}
            justifyContent={"flex-start"}
          >
            <Text color="grey.500" fontSize={"1rem"} fontWeight={"400"}>
              What would you like to share?
            </Text>
          </HStack>
        )}

        {/* <CreatePostModal isOpen={isModalOpen} onClose={closeModal} /> */}
      </HStack>
      <ImageLightbox images={imagePreview} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />

      {/* Crop modal */}
      {cropOpen && cropSrc && (
        <Portal>
          <Box
            position="fixed"
            inset={0}
            zIndex={1500}
            bg="blackAlpha.800"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
          >
            <Box
              bg="bg_box"
              borderRadius="16px"
              overflow="hidden"
              maxW="560px"
              w="full"
              boxShadow="xl"
            >
              <HStack
                px={4}
                py={3}
                borderBottomWidth="1px"
                borderColor="input_border"
                justifyContent="space-between"
              >
                <Text fontWeight="700" fontSize="1rem" color="text_primary">Crop Image</Text>
                <Box
                  cursor="pointer"
                  onClick={() => { setCropOpen(false); setCropSrc(null); }}
                  p={1}
                >
                  <IoClose size={20} color="currentColor" />
                </Box>
              </HStack>

              <Box p={4} maxH="60vh" overflowY="auto" display="flex" alignItems="center" justifyContent="center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  minWidth={40}
                  minHeight={40}
                >
                  <img
                    ref={cropImgRef}
                    src={cropSrc}
                    alt="Crop preview"
                    onLoad={onCropImageLoad}
                    style={{ maxWidth: "100%", maxHeight: "50vh", display: "block" }}
                  />
                </ReactCrop>
              </Box>

              <HStack px={4} py={3} borderTopWidth="1px" borderColor="input_border" justifyContent="flex-end" gap={3}>
                <Button
                  variant="outline"
                  size="sm"
                  borderRadius="8px"
                  onClick={() => { setCropOpen(false); setCropSrc(null); }}
                >
                  Cancel
                </Button>
                <Button
                  bg="#111D4A"
                  color="white"
                  size="sm"
                  borderRadius="8px"
                  onClick={applyCrop}
                  disabled={!completedCrop}
                  _hover={{ bg: "#1a2a6c" }}
                >
                  Apply Crop
                </Button>
              </HStack>
            </Box>
          </Box>
        </Portal>
      )}
    </>
  );
};

export default FeedInput;
