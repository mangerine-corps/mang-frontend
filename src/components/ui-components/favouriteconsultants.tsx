import { Text, Box, Image, Center } from '@chakra-ui/react';
import { useGetFavoriteConsultantsQuery } from 'mangarine/state/services/consultant.service';

const FavouriteConsultants = ({ title, content, details, imageSrc }) => {
  const { data, error, isLoading } = useGetFavoriteConsultantsQuery({});
  if (error) {
    console.error('API Error fetching favorite consultants:', error);
  }

  return (
    <Box
      w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
      maxW={{ base: "full", md: "340px", lg: "400px" }} // don’t stretch too wide on large screens
      mx="auto"
      pb="12px"
      borderRadius="lg"
      boxShadow="sm"
      bg="bg_box"
      rounded={"15px"}
      py="6"
    >
      <Text
        textAlign={"left"}
        w="full"
        px={6}
        fontSize={"1.25rem"}
        fontFamily={"Outfit"}
        color={"text_primary"}
        fontWeight={"600"}
      >
        {title}
      </Text>
      {error ? (
        <Text px="6" color="red.500" textAlign="left">
          Failed to load favorite consultants. Error: {error.toString()}
        </Text>
      ) : isLoading ? (
        <Text color="gray.500" textAlign="center">
          Loading...
        </Text>
      ) : (
        <>
          {/* Centering the image */}
          <Center alignItems={"center"} pt="4" pb="3">
            <Image
              src={imageSrc}
              alt="Regulations Image"
              boxSize="40"
              objectFit="contain"
              mb="4"
              height="auto"
            />
          </Center>

          <Text
            textAlign={"left"}
            w="full"
            px={6}
            fontSize={"1rem"}
            fontFamily={"Outfit"}
            color={"text_primary"}
            fontWeight={"600"}
          >
            {content}
          </Text>

          <Text
            textAlign={"left"}
            px={6}
            fontSize={"0.875rem"}
            fontFamily={"Outfit"}
            color={"text_primary"}
            fontWeight={"400"}
            whiteSpace={"pre-line"}
          >
            {details}
          </Text>
        </>
      )}
    </Box>
  );
};

export default FavouriteConsultants;
