import {
  Box,
  Button,
  CloseButton,
  Dialog,
  HStack,
  Icon,
  Portal,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsCollectionFill } from "react-icons/bs";
import { useGetCollectionQuery } from "mangarine/state/services/bookmark.service";

const AddToCollection = ({
  isOpen,
  onClose,
  handleSelection,
}: {
  isOpen: boolean;
  handleSelection: (collectionId: string) => void;
  onClose: () => void;
}) => {
  const [selected, setSelected] = useState<string>("");
  const { data: collectionsData, isFetching } = useGetCollectionQuery(undefined, { skip: !isOpen });

  const collections: any[] = (() => {
    const d = collectionsData?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.items)) return d.items;
    return [];
  })();

  const handleConfirm = () => {
    if (!selected) return;
    handleSelection(selected);
    setSelected("");
    onClose();
  };

  const handleClose = () => {
    setSelected("");
    onClose();
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(e) => { if (!(e as any).open) handleClose(); }}
      placement="center"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="18px" p={6} maxW="420px" w="full">
            <Dialog.CloseTrigger asChild>
              <CloseButton
                onClick={handleClose}
                position="absolute"
                top="16px"
                right="16px"
                size="sm"
              />
            </Dialog.CloseTrigger>

            <Dialog.Header pb={1}>
              <Text fontWeight="700" fontSize="1.1rem" color="text_primary" fontFamily="Outfit">
                Add to Collection
              </Text>
              <Text fontSize="0.82rem" color="grey.400" fontFamily="Outfit" mt={1}>
                Select a collection to save this post into.
              </Text>
            </Dialog.Header>

            <Dialog.Body pt={3} pb={5}>
              {isFetching ? (
                <VStack align="stretch" gap={3}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} h="52px" rounded="xl" />
                  ))}
                </VStack>
              ) : collections.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Icon color="grey.300" fontSize="2.5rem" mb={3}>
                    <BsCollectionFill />
                  </Icon>
                  <Text fontSize="0.9rem" color="grey.400" fontFamily="Outfit">
                    You have no collections yet. Create one from the Saved page.
                  </Text>
                </Box>
              ) : (
                <VStack align="stretch" gap={2}>
                  {collections.map((col: any) => {
                    const isSelected = selected === col.id;
                    return (
                      <HStack
                        key={col.id}
                        px={4}
                        py={3}
                        borderRadius="12px"
                        cursor="pointer"
                        borderWidth="1.5px"
                        borderColor={isSelected ? "button_bg" : "border_background"}
                        bg={isSelected ? "main_background" : "bg_box"}
                        onClick={() => setSelected(col.id)}
                        transition="all 0.15s"
                        _hover={{ borderColor: "button_bg", bg: "main_background" }}
                        gap={3}
                      >
                        <Box
                          w="36px"
                          h="36px"
                          rounded="lg"
                          bg={isSelected ? "button_bg" : "gray.100"}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                          transition="background 0.15s"
                        >
                          <Icon
                            color={isSelected ? "button_text" : "grey.400"}
                            fontSize="0.9rem"
                          >
                            <BsCollectionFill />
                          </Icon>
                        </Box>
                        <VStack align="flex-start" gap={0} flex={1} minW={0}>
                          <Text
                            fontSize="0.9rem"
                            fontWeight={isSelected ? "600" : "500"}
                            color="text_primary"
                            fontFamily="Outfit"
                            truncate
                          >
                            {col.name ?? col.title ?? "Untitled"}
                          </Text>
                          <Text fontSize="0.72rem" color="grey.400" fontFamily="Outfit">
                            {col.postCount ?? col.count ?? 0} post
                            {(col.postCount ?? col.count ?? 0) !== 1 ? "s" : ""}
                          </Text>
                        </VStack>
                        {isSelected && (
                          <Box
                            boxSize="18px"
                            borderRadius="full"
                            bg="button_bg"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                          >
                            <Box boxSize="7px" borderRadius="full" bg="white" />
                          </Box>
                        )}
                      </HStack>
                    );
                  })}
                </VStack>
              )}
            </Dialog.Body>

            <Dialog.Footer gap={3} pt={0}>
              <Button
                variant="outline"
                borderRadius="8px"
                fontFamily="Outfit"
                flex={1}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                bg="button_bg"
                color="button_text"
                borderRadius="8px"
                fontFamily="Outfit"
                flex={1}
                disabled={!selected}
                onClick={handleConfirm}
                _hover={{ opacity: 0.9 }}
              >
                Add to collection
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AddToCollection;
