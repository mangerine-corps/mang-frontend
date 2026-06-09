import { Box, Text, Image, VStack, SimpleGrid, Button, Flex, Spinner } from '@chakra-ui/react';
import {
  useGetCollectionQuery,
  useAddPostToCollectionMutation,
} from 'mangarine/state/services/bookmark.service';

interface CollectionBoxProps {
  postId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const CollectionBox = ({ postId, onClose, onSuccess }: CollectionBoxProps) => {
  const { data: collectionsData, isLoading } = useGetCollectionQuery(undefined);
  const [addPostToCollection, { isLoading: isAdding }] = useAddPostToCollectionMutation();

  const collections: any[] = (() => {
    const d = collectionsData?.data;
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.items)) return d.items;
    return [];
  })();

  const [selected, setSelected] = React.useState<string | null>(null);

  const handleAdd = async () => {
    if (!selected) return;
    try {
      await addPostToCollection({ collectionId: selected, postId }).unwrap();
      onSuccess?.();
      onClose();
    } catch {}
  };

  return (
    <Box
      w="850px"
      h="750px"
      borderWidth={0.5}
      bg="bg_box"
      rounded="15px"
      shadow="sm"
      p={8}
    >
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" gap={10}>
        {/* Header */}
        <Flex justifyContent="space-between" alignItems="flex-start" w="100%">
          <Box>
            <Text fontFamily="Outfit" fontSize="2.5rem" fontWeight="700" lineHeight="60px" color="text_primary">
              Add to Collection
            </Text>
            <Text fontFamily="Outfit" fontSize="1.25rem" fontWeight="400" mt={1} color="text_primary">
              Select the collection where you would like to add this post.
            </Text>
          </Box>
          <Image
            src="/icons/close.svg"
            alt="close"
            boxSize="20px"
            cursor="pointer"
            mt={2}
            mr={10}
            onClick={onClose}
          />
        </Flex>

        {/* Grid */}
        {isLoading ? (
          <Flex justify="center" align="center" w="100%" py={10}>
            <Spinner size="md" />
          </Flex>
        ) : collections.length === 0 ? (
          <Flex justify="center" align="center" w="100%" py={10}>
            <Text color="gray.400" fontFamily="Outfit" fontSize="0.95rem">
              No collections yet. Create one from your Saved page.
            </Text>
          </Flex>
        ) : (
          <SimpleGrid columns={[2, null, 3]} gap="10px" w="100%">
            {collections.map((item: any) => (
              <Box
                key={item.id}
                borderRadius="8px"
                w="222px"
                h="176px"
                p="40px"
                textAlign="center"
                boxShadow="sm"
                cursor="pointer"
                borderWidth="2px"
                borderColor={selected === item.id ? 'button_bg' : 'transparent'}
                bg={selected === item.id ? 'main_background' : 'bg_box'}
                onClick={() => setSelected(item.id)}
                transition="all 0.15s"
              >
                <VStack gap="10px">
                  <Image src="/icons/col.svg" alt={item.name} boxSize="40px" />
                  <Text fontSize="md" color="text_primary" fontWeight="600" fontFamily="Outfit">
                    {item.name ?? 'Untitled'}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        )}

        {/* Buttons */}
        <Flex justifyContent="center" gap={4} mt={6}>
          <Button
            variant="outline"
            colorScheme="gray"
            w="196px"
            h="48px"
            borderRadius="8px"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            bg="button_bg"
            color="button_text"
            w="196px"
            h="48px"
            borderRadius="8px"
            disabled={!selected}
            loading={isAdding}
            onClick={handleAdd}
          >
            Add
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

import React from 'react';
export default CollectionBox;
