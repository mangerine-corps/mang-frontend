import { useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Input,
  Textarea,
  Image,
  HStack,
  Text,
  Drawer,
  VStack,
} from "@chakra-ui/react";
import { FaTimes } from "react-icons/fa";

const EditPost = ({open, onOpenChange}) => {
  const [title, setTitle] = useState("Prototype");
  const [description, setDescription] = useState(
    "Explore this interactive prototype I designed for [project name]. This project showcases my approach to creating seamless user flows and intuitive interfaces. Click through to see how each screen transitions to the next, and experience the thoughtful interactions and design decisions that enhance user engagement and usability. From wireframes to high-fidelity moc...."
  );

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
                <HStack
                  w="full"
                  py={4}
                  px="3"
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Text
                    font="outfit"
                    fontSize="1.5rem"
                    fontWeight="700"
                    lineHeight="60px"
                    color="text_primary"
                  >
                    Edit Post
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
          <Drawer.Body px="6" py="8" zIndex={50}>
            <Box>
              {/* Title Input */}
              <Text
                font="outfit"
                fontSize="1rem"
                fontWeight="400"
                lineHeight="60px"
                color="gray.600"
                mb={1}
              >
                Title of work
              </Text>
              <Input
                mb={4}
                px={2}
                value={title}
                color="gray.600"
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title of work"
              />

              <Textarea
                mb={6}
                px={2}
                value={description}
                color="gray.600"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Work Description"
                minH="120px"
              />

              {/* Images */}
              <HStack gap={4} mb={6}>
                <Box w="full" h="200px" position="relative">
                  <Image
                    src="/images/groupimg1.png"
                    alt="Work Preview 1"
                    objectFit="cover"
                    w="full"
                    h="full"
                    borderRadius="md"
                  />
                  <Image
                    src="/icons/editimg.svg"
                    alt="Upload Icon"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    // boxSize="100px"
                  />
                </Box>
                <Box w="full" h="200px" position="relative">
                  <Image
                    src="/images/groupimg2.png"
                    alt="Work Preview 2"
                    objectFit="cover"
                    w="full"
                    h="full"
                    borderRadius="md"
                  />
                  <Image
                    src="/icons/editimg.svg"
                    alt="Upload Icon"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    // boxSize="100px"
                  />
                </Box>
              </HStack>

              <HStack mt={6} gap={4} justify="flex-end" w="full">
                <Button
                  py="3"
                  px="6"
                  borderRadius="8px"
                  border="1px solid"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  py="3"
                  px="6"
                  borderRadius="8px"
                  bg="blue.900"
                  color="white"
                  _hover={{ bg: "blue.800" }}
                >
                  Submit
                </Button>
              </HStack>
            </Box>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default EditPost;
