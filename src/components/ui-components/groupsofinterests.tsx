import { Box, Text, HStack, VStack, Button, Image, Link } from "@chakra-ui/react";

const communities = [
  { name: "UI/UX Designers", members: "457 members" },
  { name: "Virtual Assistant", members: "5k members" },
  { name: "Gynamcologists", members: "2k members" },
  { name: "Technical Supports", members: "5 members" },
  { name: "Bible Colleges", members: "52 members" },
];

const GroupsOfInterests = () => {
  return (
    <Box
    font="outfit"
    // w="351px"
    // h="442px"
    borderRadius="16px"
    padding="24px"
    gap="24px"
      bg="bg_box"
      rounded="lg"
      shadow="sm"
      display={{ base: "none", md: "block", lg: "block" }}
      // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
    >
      <Text fontWeight="600" fontSize="1.25rem" lineHeight="30px" color="text_primary" mb={8}>
        Groups Of Interests
      </Text>

      <VStack align="stretch" wordSpacing={6}>
        {communities.map((community, index) => (
          <HStack key={index} justify="space-between">
            <HStack>
                <Image src="/images/group.png" boxSize="32px" rounded="full" alt="user1" />
              <Box>
                <Text font="outfit" fontWeight="600" fontSize="1rem" color="text_primary" lineHeight="20px" >
                  {community.name}
                </Text>
                <Text font="outfit" fontWeight="500" color="gray.500" fontSize="0.875rem" lineHeight="22px" >
                  {community.members}
                </Text>
              </Box>
            </HStack>
            <Button
            w="67px"
            h="32px"
            borderRadius="8px"
            border="1px"
            padding="8px"
              size="sm"
              bg="blue.900"
              color="white"
              _hover={{ bg: "blue.700" }}
            //   {<Image src="/icons/plus-white.svg" alt="plus" />}
              px={3}
            >
              Join +
            </Button>
          </HStack>
        ))}
      </VStack>

          <Link
        mt={5}
        textAlign="center"
        fontWeight="medium"
        color="blue.900"
        display="block"
        href="#"
        _hover={{ textDecoration: "underline" }}
      >
        See all
      </Link>
    </Box>
  );
};

export default GroupsOfInterests;
