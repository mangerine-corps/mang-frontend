import { useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Text,
  VStack,
  Flex,
  Image,
  Drawer,
  HStack,
  Icon,
  Badge,
  Stack,
} from "@chakra-ui/react";
import CommentItem from "./commentitem";
import { isEmpty } from "es-toolkit/compat";
import NewsItem from "./newsitem";

const CommentList = ({ open, onOpenChange, data, post }) => {
  // const {users} = data
  console.log(data, "member data");

  return (
    <Drawer.Root size={"md"} open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />

      <Drawer.Positioner zIndex="max">
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title></Drawer.Title>
          </Drawer.Header>
          <Drawer.Body px="6" py="6" overflowY={"hidden"}>
            <HStack alignItems={"center"} pb="4">
              <Drawer.Trigger>
                <CloseButton />
              </Drawer.Trigger>
            </HStack>

            <VStack pr="6" overflowY={"hidden"}>
              <Stack bg="bg_box" w="full" mx={"auto"}>
                {!isEmpty(post) && <NewsItem key={post?.id} post={post} />}
              </Stack>
            </VStack>
            <VStack
              w="full"
              alignItems={"flex-start"}
              overflowY={"scroll"}
              my="6"
              css={{
                "&::-webkit-scrollbar": {
                  width: "0px",

                  height: "0px",
                },
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
              }}
              h="full"
            >
              {data.map((comment: any) => (
                <CommentItem key={comment.id} comment={comment} post={post} />
              ))}
            </VStack>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default CommentList;
