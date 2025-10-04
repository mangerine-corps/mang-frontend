import { Box, Text, HStack, VStack, Image } from "@chakra-ui/react";

const followedUsers = [
    {
      name: "Cameron Williamson",
      title: "Scaffolder",
      avatar: "/images/profile1.png",
    },
    {
      name: "Jacob Jones",
      title: "Crane Operator",
      avatar: "/images/profile2.png",
    },
    {
      name: "Kristin Watson",
      title: "Tiler",
      avatar: "/images/profile3.png",
    },
  ];


  const suggestedUsers = [
    {
      name: "Courtney Henry",
      title: "Electrician",
      avatar: "/images/profile4.png",
    },
    {
      name: "Darrell Steward",
      title: "Glazier",
      avatar: "/images/profile5.png",
    },
    {
      name: "Jane Cooper",
      title: "HVAC Technician",
      avatar: "/images/profile6.png",
    },
  ];




 const FilterSearch = () => {
  return (
    <Box bg="bg_box" rounded="lg" shadow="sm" p={5} w="full" maxW="sm">
      <VStack align="stretch">
        {followedUsers.map((person, idx) => (
          <HStack key={idx} justify="space-between" font="outfit" w="500" fontSize="0.875rem"
          lineHeight="1.313rem" gap="12px">
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
                    color="text_primary"
                    lineHeight={"shorter"}
                    fontSize={"0.875rem"}
                  >
                    {person.title}
                  </Text>
                </Box>
            </HStack>

            <Image src="/images/close.svg" alt="close" aria-label="Remove" />
            </HStack>
          ))}
        </VStack>

        <Text
          mt={5}
          font="outfit"
          w="400"
          fontSize="0.875rem"
          lineHeight="1.25rem"
          textAlign="left"
          fontWeight="medium"
          color="text_primary"
          mb={3}
        >
          Suggested
        </Text>

        {suggestedUsers.map((person, idx) => (
          <HStack key={idx} >
           <Image src={person.avatar} alt="profile-img" rounded="full" />
            <Box>
              <Text fontWeight="semibold">{person.name}</Text>
              <Text fontSize="sm" color="text_primary">
                {person.title}
              </Text>
            </Box>
          </HStack>
        ))}
      </Box>
    );
  };

  export default FilterSearch;
