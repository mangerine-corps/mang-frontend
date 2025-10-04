import { Box, Text, Image, VStack, SimpleGrid, Button, Flex } from '@chakra-ui/react';

const collections = [
  { label: 'Travel Plans', icon: '/icons/col.svg' },
  { label: 'Learning Resource', icon: '/icons/col.svg' },
  { label: 'Recipe', icon: '/icons/col.svg' },
  { label: 'Design Ideas', icon: '/icons/col.svg' },
  { label: 'To Read Later', icon: '/icons/col.svg' },
  { label: 'New Collection', icon: '/icons/col1.svg' },
];

const CollectionBox = () => {
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
                {/* Title and Subtitle */}
                <Box>
                <Text
                    fontFamily="Outfit"
                    fontSize="2.5rem"
                    fontWeight="700"
                    lineHeight="60px"
                    color="text_primary"
                >
                    Add to Collection
                </Text>
                <Text
                    fontFamily="Outfit"
                    fontSize="1.25rem"
                    fontWeight="400"
                    mt={1}
                    color="text_primary"
                >
                    Select the collection where you would like to add this post.
                </Text>
                </Box>

                {/* Close Icon */}
                <Image
                src="/icons/close.svg"
                alt="close"
                boxSize="20px"
                cursor="pointer"
                mt={2}
                mr={10}
                />
            </Flex>
            


        {/* Grid */}
        <SimpleGrid columns={[2, null, 3]} gap="10px" w="100%">
  {collections.map((item) => (
    <Box
      key={item.label}
      border="1px bg_box"
      borderRadius="8px"
      w="222px"
      h="176px"
     // gap="10px"
      p="40px"
      textAlign="center"
      boxShadow="sm"
    >
      <VStack gap="10px">
        <Image src={item.icon} alt={item.label} boxSize="40px" />
        <Text fontSize="md" color="text_primary" fontWeight="600">
          {item.label}
        </Text>
      </VStack>
    </Box>
  ))}
</SimpleGrid>


        {/* Buttons */}
        <Flex justifyContent="center" gap={4} mt={6}>
          <Button variant="outline" colorScheme="gray" 
          w="196px"
          h="48px"
          borderRadius="8px"
          px="80px"
          py="24px"
          gap="10px">
            Cancel
          </Button>
          <Button color="bg_button" w="196px"
          h="48px"
          borderRadius="8px"
          px="80px"
          py="24px"
          gap="10px">
            Add
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CollectionBox;
