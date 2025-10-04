import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import FeedAction from "./feedaction";
import EmojiPicker from "emoji-picker-react";
import { useRef, useState } from "react";
import { useClickAway } from "react-use";
import { RiEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { useCreatePostMutation } from "mangarine/state/services/posts.service";
import { useDispatch } from "react-redux";
import { addPost } from "mangarine/state/reducers/post.reducer";
import { toaster } from "../ui/toaster";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useRouter } from "next/router";
import { IoVideocamOutline } from "react-icons/io5";

const smily = "/icons/smily.svg";
const location = "/icons/loc.svg";
const tag = "/icons/tag.svg";
const image = "/icons/img.svg";
const videoimg = <IoVideocamOutline />;

type FeedInputProps = {
  onCreated?: (post: any) => void;
};

const FeedInput = ({ onCreated }: FeedInputProps) => {
  const [value, setValue] = useState("");
  const [, setIsModalOpen] = useState(false);
  const [showTextBox, setShowTextBox] = useState<boolean>(false);
  const { user } = useAuth();
  const openModal = () => {
    setIsModalOpen(true);
  };
  const router = useRouter();
  // const [, setInputValue] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [, setOpenImageLimit] = useState(false);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [, setEditingImageIndex] = useState<number | null>(null);

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
    if (fileInputRef.current) {
      fileInputRef.current.click();
      // store the index of the image being edited in a state
      setEditingImageIndex(index);
    }
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

  return (
    <>
      <HStack
        rounded={"15px"}
        boxShadow={"sm"}
        borderWidth={0.8}
        alignItems={"flex-start"}
        borderColor={"grey.300"}
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
            boxShadow={"sm"}
            borderWidth={0.8}
            minH={"100px"}
            my={4}
            position="relative"
            cursor="pointer"
            mr="4"
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
                <HStack
                  alignItems={"stretch"}
                  borderTopWidth={1}
                  paddingTop={4}
                  spaceX={3}
                >
                  {imagePreview.map((src, index) => (
                    <Box
                      display={"flex"}
                      h="full"
                      key={index}
                      position="relative"
                      width={
                        selectedImage.length > 1
                          ? { base: "100%", md: "calc(25% - 8px)" }
                          : "100%"
                      }
                      maxWidth={
                        selectedImage.length > 1 ? "none" : "calc(100% - 16px)"
                      }
                    >
                      <Image
                        src={src}
                        alt={`Selected Image ${index + 1}`}
                        objectFit="contain"
                        width="100%"
                        height={selectedImage.length > 1 ? "auto" : "auto"}
                        maxHeight={selectedImage.length > 1 ? "auto" : "auto"}
                        borderRadius="md"
                      />

                      {/* edit image button */}
                      <Box
                        position="absolute"
                        top="8px"
                        left="8px"
                        width="24px"
                        height="24px"
                        borderRadius="2px"
                        bg="rgba(0, 0, 0, 0.3)"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        cursor="pointer"
                        onClick={() => handleEditImage(index)}
                      >
                        <RiEditFill color="white" />
                      </Box>

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
                        onClick={() => handleRemoveImage(index)}
                      >
                        <MdDelete color="red" />
                      </Box>
                    </Box>
                  ))}
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
                    <Box>
                      <FeedAction icon={videoimg} action={handleClick} />
                      <input
                        type="file"
                        accept="video/*"
                        ref={videoInputRef}
                        className="hidden"
                        onChange={handleMyVideoChange}
                        style={{ display: "none" }}
                      />
                    </Box>

                    <Box pos={"relative"}>
                      <FeedAction
                        icon={smily}
                        action={() => setShowPicker(!showPicker)}
                      />
                      {/* <input type="text" value={inputValue} readOnly /> */}
                      <Box ref={emojiRef} pos={"absolute"} zIndex={"max"}>
                        {showPicker && (
                          <EmojiPicker onEmojiClick={onEmojiClick} />
                        )}
                      </Box>
                    </Box>

                    {/* <FeedAction icon={location} />
                    <FeedAction icon={tag} /> */}
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
                      bg={"primary.300"}
                      justifyContent="center"
                      alignItems="center"
                      loading={isLoading}
                      alignSelf="flex-end"
                      color={"white"}
                      // width={{ base: "100%", md: "auto" }}
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
            // minH={"2rem"}
            rounded={"15px"}
            boxShadow={"sm"}
            cursor={"pointer"}
            borderWidth={0.8}
            onClick={() => {
              setShowTextBox(true);
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
    </>
  );
};

export default FeedInput;
