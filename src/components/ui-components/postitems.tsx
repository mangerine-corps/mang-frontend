import { Box, Button, HStack, Image, Menu, Portal, Stack, Text, VStack } from "@chakra-ui/react";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import NewsAction from "./newsaction";

export const PostItems = () => {
  const Data = [
    {
      id: 0,
      firstName: "Sharon",
      lastName: "Grace",
      profession1: "UI/UX Designer | ",
      profession2: "Product Designer",
      location: "Lagos, Nigeria",
      dob: "Born August 19",
      bio: "Explore this interactive prototype I designed for [project name]. This project showcases my approach to creating seamless user flows and intuitive interfaces. Click through to see how each screen transitions to the next, and experience the thoughtful interacti....",
      image: "",
      time: "24 mins",
    },
    {
      id: 1,
      firstName: "Sharon",
      lastName: "Grace",
      profession1: "UI/UX Designer | ",
      profession2: "Product Designer",
      location: "Lagos, Nigeria",
      dob: "Born August 19",
      bio: "Explore this interactive prototype I designed for [project name]. This project showcases my approach to creating seamless user flows and intuitive interfaces. Click through to see how each screen transitions to the next, and experience the thoughtful interacti....",
      image: "",
      time: "53 minutes",
    },
  ];

  return (
    <>
      {Data.map((item: any) => (
        <Box
            // key={post?.id}
            key={item.id}
          boxShadow={"xs"}
          pos={"relative"}
          zIndex={"base"}
          bg="bg_box"
          borderWidth={0.5}
          alignItems={"flex-start"}
          borderColor={"gray.50"}
          p={4}
          _selected={{
            bg: "transparent",
          }}
          rounded={"13px"}
          w="96%"
        >
          {/* <AddToCollection
          isOpen={showCollections}
          handleSelection={handleAddToCollection}
          onClose={() => setShowCollections(false)}
        /> */}

          <HStack alignItems={"flex-start"} justifyContent={"space-between"}>
            <HStack alignItems={"flex-start"}>
              <Image
                alt="Profile Image"
                src="/person.png"
                // src={user?.profilePics || "/images/fprofile.png"}
                h={10}
                w={10}
                rounded={"full"}
              />
              <VStack align={"left"} alignItems={"flex-start"}>
                <Box display="flex" alignItems={"center"} spaceX={"2"}>
                  <Text
                    fontSize={"1rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    fontWeight={"600"}
                  >
                    {" "}
                    {item.firstName}
                    {/* {post?.creator?.fullName || "No name"} */}
                  </Text>
                  <Text
                    fontSize={"0.875rem"}
                    fontFamily={"Outfit"}
                    color={"grey.500"}
                    fontWeight={"500"}
                  >
                    {item.profession1}
                    {/* {post?.creator?.businessName || "UI/UX Designer"} */}
                  </Text>
                </Box>
                <Text
                  fontSize={"0.75rem"}
                  fontFamily={"Outfit"}
                  color={"grey.500"}
                  fontWeight={"400"}
                  lineHeight={0}
                >
                  {item.time}ago
                  {/* {new Date().toLocaleTimeString("en-US")} */}
                  {/* {new Date(post?.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })} */}
                </Text>
              </VStack>
            </HStack>

            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" size="sm">
                  <Stack
                    justifyContent={"center"}
                    alignItems={"center"}
                    rounded={"md"}
                    h={10}
                    w={8}
                    borderWidth={0.5}
                    // shadow={"sm"}
                    borderColor={"grey.50"}
                    aria-label="Options"
                  >
                    <IoEllipsisVerticalOutline size={12} color={"grey.500"} />
                  </Stack>
                </Button>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="new-txt-a">
                      Follow <Menu.ItemCommand>⌘E</Menu.ItemCommand>
                    </Menu.Item>
                    <Menu.Item value="new-file-a">
                      Report Post <Menu.ItemCommand>⌘N</Menu.ItemCommand>
                    </Menu.Item>
                    <Menu.Item value="new-win-a">
                      Delete Post <Menu.ItemCommand>⌘W</Menu.ItemCommand>
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </HStack>

          {/* conditionally truncate content */}
          {/* <Box onClick={() => handlePostClick(post?.id)} cursor="pointer"> */}
          <Box cursor="pointer" pt="2">
            <Text
              fontSize={"0.875rem"}
              fontFamily={"Outfit"}
              fontWeight={"500"}
              color={"grey.500"}
              style={{
                // display: "-webkit-box",
                overflow: "hidden",
                // WebkitBoxOrient: "vertical",
                // WebkitLineClamp: isDetailPage ? "none" : "3",
              }}
            >
              {item.bio}
              {/* {post?.content} */}
            </Text>
            {/*
        {!isDetailPage && post?.content.length > 100 && (
          <Text fontSize={"12px"} color="#FC731A" cursor={"pointer"} mt={1}>
            Read more
          </Text>
        )} */}

            {/* <Text fontSize={"12px"} color="#FC731A" cursor={"pointer"} mt={1}>
              Read more
            </Text> */}

            {/* {size(post?.images) > 0 && (
          <HStack mt={5} alignItems={"stretch"} spacing={4}>
            {post?.images.map((url, index) => (
              <Box flex={1} key={index}>
                <Image
                  h="200px"
                  w="full"
                  alt={`Post Image ${index}`}
                  objectFit={"cover"}
                  objectPosition={"center"}
                  rounded="6px"
                  src={url}
                />
              </Box>
            ))}
          </HStack>
        )} */}

            <HStack mt={5} alignItems={"stretch"} spaceX={4}>
              <Box flex={1}>
                <Image
                  h="200px"
                  w="full"
                  alt={`Post Image `}
                  //   alt={`Post Image ${index}`}
                  objectFit={"cover"}
                  objectPosition={"center"}
                  rounded="6px"
                  src={"/images/bg1.png"}
                />
              </Box>
            </HStack>
          </Box>

          <HStack mt={4} justifyContent={"space-between"}>
            <NewsAction
              count={5}
              icon="/icons/thumb.svg"
              //   count={post?.likeCount}
              desc="Likes"
              //   action={async () => {
              //     if (post?.isLiked) {
              //       console.warn("Post already liked, ignoring further clicks.");
              //       return;
              //     }
              //     await handleLikeClick(post?.id, !!post?.isLiked);
              //   }}
              action={() => {}}
              isDisabled={true}
              //   isDisabled={post?.isLiked}
            />

            <NewsAction
              icon="/icons/comment.svg"
              //   count={post?.commentCount}
              count={4}
              desc="Comments"
            />
            <NewsAction
              icon="/icons/eye2.svg"
              //   count={post?.views || 0}
              desc="Views"
              count={2}
            />
            <NewsAction
              icon="/icons/share.svg"
              //   count={post?.shareCount}
              desc="Shares"
              count={4}
            />
          </HStack>
        </Box>
      ))}
    </>
  );
};
