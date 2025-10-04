import {useState} from "react";
import {Box, Button, Drawer, HStack, Image, Text, Textarea, VStack,} from "@chakra-ui/react";
import * as Menu from "@ark-ui/react/menu";
import {Portal} from "@ark-ui/react";
import {FaTimes} from "react-icons/fa";
import FeedInput from "mangarine/components/ui-components/feedinput";

type CreatePostProps = { open: boolean; onOpenChange: () => void; action?: () => void; onCreated?: (post: any) => void };

const CreatePost = ({open, onOpenChange, action, onCreated}: CreatePostProps) => {
  const [postText, setPostText] = useState("");
  const [visibility, setVisibility] = useState("Everyone");

  return (
    <Drawer.Root size={"md"} open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />
      <Drawer.Trigger></Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <VStack
                spaceY={6}
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
                px="4"
              >
                <HStack w="full" py={4} px="3" justifyContent={"space-between"} alignItems={"center"}>
                  <Text
                    font="outfit"
                    fontSize="1.5rem"
                    fontWeight="700"
                    lineHeight="60px"
                    color="text_primary"

                  >
                    Create Post
                  </Text>
                  <HStack spaceX={4}>
                    <Box
                      border={0.5}
                      rounded={4}
                      py={2}
                      px="2"
                      onClick={onOpenChange}
                      borderColor={"gray.150"}
                      shadow={"md"}
                    >
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
          <Drawer.Body px="6" py="8">
            <FeedInput onCreated={(post) => {
              // bubble up to parent for refetch or UI updates
              try { onCreated?.(post); } catch {}
              // optional extra action from parent
              try { action?.(); } catch {}
            }} />
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default CreatePost;
