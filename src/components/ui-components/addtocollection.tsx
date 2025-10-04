import {
  Box,
  Button,
  CloseButton,
  Dialog,
  For,
  HStack,
  IconButton,
  Portal,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import { map, size } from "lodash";
import { useBookmark } from "mangarine/state/hooks/bookmark.hook";


const AddToCollection = ({
  // isOpen,
  onClose,
  handleSelection,
}: {
  isOpen: boolean;
  handleSelection: (collectionId: string) => void;
  onClose: () => void;
}) => {
  const [selected, setSelected] = useState<any>({});
  // const [search, setSearch] = useState("");
  // const [rating, setRating] = useState(0);
//   const bg = useColorModeValue("white", "background.100");
  // const textColor =("text_primary");
  const { collections } = useBookmark();

  const handleClose = () => {
    handleSelection(selected.id);
  };
  return (

   <HStack wrap="wrap" gap="4">
      <For each={[ "center"]}>
        {(placement) => (
          <Dialog.Root
            key={placement}
            placement={placement}
            motionPreset="slide-in-bottom"
          >
            <Dialog.Trigger asChild>
              <Button variant="outline">Open Dialog ({placement}) </Button>
            </Dialog.Trigger>
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title>Dialog Title</Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
                      <VStack spaceY={6}>
             <Text fontSize={"1.5rem"} fontFamily={"Outfit"} color={"black"}>
               Add to Collection
            </Text>
            <Text
              color="#999"
              fontFamily="Outfit"
              fontSize="12px"
              fontStyle="normal"
              fontWeight="400"
            >
              Select the collection where you would like to add this post
            </Text>
            <Box>
              <SimpleGrid my={4} columns={3} mx="auto" gap={5}>
                {size(collections) > 0 && (
                  <>
                    {map(collections, (collection) => (
                      <Box
                        my="4px"
                        boxShadow={"sm"}
                        w={"200px"}
                        h={"200px"}
                        px="4px"
                        py="4px"
                        borderWidth={0.5}
                        borderColor={
                          selected.id === collection.id
                            ? "primary.300"
                            : "gray.50"
                        }
                        rounded={"md"}
                        display={"flex"}
                        onClick={() => setSelected(collection)}
                        flexDir="column"
                        alignItems={"center"}
                        _hover={{ border: "1px", borderColor: "primary.300" }}
                        justifyContent={"center"}
                      >
                        <IconButton
                          size="lg"
                          bg={"transparent"}
                          borderWidth={0}
                          borderColor={"gray.50"}
                          rounded={"md"}
                          aria-label="open menu"
                          color="black"
                          _hover={{
                            textDecor: "none",
                            bg: "none",
                          }}

                        ></IconButton>
                        <Text fontSize={"1.5rem"} fontWeight={"600"}>
                          {collection.name}
                        </Text>
                      </Box>
                    ))}
                  </>
                )}
              </SimpleGrid>
            </Box>

            <HStack
              w="full"
              display={"flex"}
              flexDir={"row"}
              spaceX={6}
              bg="white"
              justifyContent={"flex-end"}
              bottom={0}
            >
              <HStack w="90%" mx="auto">
                <Button
                  borderColor="primary.300"
                  borderWidth={1}
                  color={"white"}
                  bg={"white"}
                  py={2}
                  rounded="6px"
                  w="100%"
                  px={4}
                  _hover={{
                    textDecor: "none",
                  }}
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}

                  onClick={onClose}
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
                  w="100%"
                  px={4}
                  _hover={{
                    textDecor: "none",
                  }}
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
                  rounded={"6px"}
                  onClick={handleClose}
                >
                  <Text
                    ml={2}
                    className="text5"
                    color={"white"}
                    fontSize={"0.875rem"}
                    fontWeight={"500"}
                  >
                    Add
                  </Text>
                </Button>
              </HStack>
            </HStack>
          </VStack>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">Cancel</Button>
                    </Dialog.ActionTrigger>
                    <Button>Save</Button>
                  </Dialog.Footer>
                  <Dialog.CloseTrigger asChild>
                    <CloseButton size="sm" />
                  </Dialog.CloseTrigger>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        )}
      </For>
    </HStack>

  );
};

export default AddToCollection;
