import { Box, Text, HStack, VStack, Button, Image } from "@chakra-ui/react";

  const peopleToFollow = [
    {
      name: "Darrell Steward",
      title: "UI/UX Designer",
      avatar: "/person.png",
    },
    {
      name: "Annette Black",
      title: "Architect",
      avatar: "/person.png",
    },
  ];

  const WhoToFollow = () => {
    return (
      <Box
        bg="main_background"
        rounded="lg"
        shadow="sm"
        p={6}

        display={{ base: "none", md: "block", lg: "block" }}
        // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
      >
        <Text fontWeight="bold" color="text_primary" fontSize="1rem" mb={8}>
          Who to follow
        </Text>

        <VStack wordSpacing={8} align="stretch">
          {peopleToFollow.map((person, index) => (
            <HStack key={index} justify="space-between">
              <HStack>
                <Image src={person.avatar} alt="profile-img" rounded="full" />

                <Box
                  display="flex"
                  flexDir={"column"}
                  alignItems={"flex-start"}
                  justifyContent={"flex-start"}
                >
                  <Text
                    fontWeight="semibold"
                    color="text_primary"
                    fontSize={"1rem"}
                  >
                    {person.name}
                  </Text>
                  <Text
                    color="grey.500"
                    lineHeight={"shorter"}
                    fontSize={"0.875rem"}
                  >
                    {person.title}
                  </Text>
                </Box>
              </HStack>
              <Button
                variant="outline"
                size="sm"
                px="2"
                py="2"
                rounded="md"
                color="grey.500"
              >
                <Image alt="add-follower-icon" src="/icons/plus.svg" />
                <Text fontSize={"0.875rem"}>Follow</Text>
              </Button>
            </HStack>
          ))}
        </VStack>

        <Text
          mt={5}
          textAlign="center"
          fontWeight="medium"
          color="blue.900"
          cursor="pointer"
          _hover={{ textDecoration: "underline" }}
        >
          Show more
        </Text>
      </Box>
    );
  };

  export default WhoToFollow;
