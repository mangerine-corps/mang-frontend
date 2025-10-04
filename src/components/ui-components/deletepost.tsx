

import {
  Box,
  Button,
  Center,
  CloseButton,
  Dialog,
  HStack,
  Image,
  Portal,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import CustomButton from "mangarine/components/customcomponents/button";
import { toaster } from "../ui/toaster";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useDeletePostMutation } from "mangarine/state/services/posts.service";

type props = {
  onOpenChange: any;
open: any;  postId:any
};

const DeletePost = ({ onOpenChange, open, postId }: props) => {
  const { user } = useAuth();
  const [removePost, {isLoading}] = useDeletePostMutation();
   const handleDeletePost = (postId: string) => {
      if (!user) {
        toaster.create({
          description: "You must be logged in to delete a post",
          type: "error",
          closable: true,
        });
        return;
      }
      removePost(postId)
        .unwrap()
        .then((res) => {
          console.log(res, "delete post response");
          toaster.create({
            description: "Post deleted",
            type: "success",
            closable: true,
          });
        })
        .catch((error) => {
          console.error("Error deleting post:", error);
          toaster.create({
            description: "Error deleting post",
            type: "error",
            closable: true,
          });
        });
    };
    
    const deletePostItem = () => {
      handleDeletePost(postId);
     onOpenChange()
    }
  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={onOpenChange}
      placement={"center"}
      size={"sm"}

      // motionPreset="slide-in-bottom"
    >
      {/* <Dialog.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="bg_box">
            {/* <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header> */}
            <Dialog.Body p="6" rounded={"xl"} bg="bg_box">
              <VStack
                py="6"
                // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
              >
                {/* Centering the image */}
                <Stack
                  justifyContent={"center"}
                  rounded="full"
                  h="20"
                  w="20"
                  bg="grey.50"
                  alignItems={"center"}
                  pt="4"
                  pb="2"
                >
                  <Image
                    src={"/icons/delete1.svg"}
                    alt="delete Image"
                    // boxSize={6}
                    objectFit="contain"
                    h="12"
                    w="12"
                    // height="auto"
                  />
                </Stack>
                <Text
                  textAlign={"center"}
                  w="full"
                  py={"2"}
                  fontSize={"1.25rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"600"}
                >
                  You are about to delete your post
                </Text>

                <Text
                  textAlign={"center"}
                  w="full"
                  // px={"6"}
                  fontSize={"0.875rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"400"}
                >
                  This post will be deleted from the community. Are you sure?
                </Text>
              </VStack>
              {/* <ScheduleCard
                title="Consultation Canceled Successfully"
                imageSrc={"/icons/cancel.svg"}
                content={""}
                width="95%"
                details="10% has been deducted, and the remaining amount is credited to your wallet."
              /> */}
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" pb={6}>
              <HStack
                w="full"
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                flexDir={"row"}
                // mx="auto"
              >
                <CustomButton
                  customStyle={{
                    w: "40%",
                    bg: "main_background",
                    borderWidth: "2px",
                  }}
                  onClick={onOpenChange}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"text_primary"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    No, Keep
                  </Text>
                </CustomButton>
                <CustomButton
                  customStyle={{
                    w: "40%",
                  }}
                  onClick={deletePostItem}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    Yes, Delete
                  </Text>
                </CustomButton>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default DeletePost;
