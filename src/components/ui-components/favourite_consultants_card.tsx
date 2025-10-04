"use client";
import { useEffect } from "react";
import { Text, VStack, Image, Flex, Box, HStack } from "@chakra-ui/react";
import { useGetFavoriteConsultantsQuery } from "mangarine/state/services/consultant.service";
import { isEmpty } from "es-toolkit/compat";
import { setFavoriteConsultant } from "mangarine/state/reducers/consultant.reducer";
import { useDispatch, useSelector } from "react-redux";
import { selectFavoriteConsultant } from "mangarine/state/reducers/consultant.reducer";

interface FavouriteConsultantsCompProps {
  title?: string;
}

const FavouriteConsultantsComp = ({ title }: FavouriteConsultantsCompProps) => {
  const { data, error, isLoading } = useGetFavoriteConsultantsQuery({});
  const dispatch = useDispatch();
  // const favourite = useSelector(selectFavoriteConsultant); // ✅ get from store

  // Load API result into redux once
  useEffect(() => {
    if (data?.data?.favoriteConsultants) {
      dispatch(setFavoriteConsultant(data?.data?.favoriteConsultants));
    }
  }, [data, dispatch]);
//  console.log(data, "fav")
  if (error) {
    console.error("API Error fetching favorite consultants:", error);
  }

  return (
    <VStack
      w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
      maxW={{ base: "full", md: "340px", lg: "400px" }}
      mx="auto"
      borderWidth={0.5}
      borderColor={"bg_box"}
      rounded={"15px"}
      py="6"
      bg="bg_box"
      shadow={"sm"}
    >
      <Text
        textAlign={"left"}
        w="full"
        px={"6"}
        fontSize={"1.25rem"}
        fontFamily={"Outfit"}
        color={"text_primary"}
        fontWeight={"600"}
      >
      Favourite Consultant
      </Text>

      <Flex align="center" flexDir={"column"} justify="space-between" w="full" py="2" px={"6"}>
        {!isEmpty(data?.data?.favoriteConsultants) &&
          data?.data?.favoriteConsultants.slice(0, 3).map((item, index) => (
            <HStack
              key={item.id || index}
              w="full"
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Flex align="center" gap="8px">
                {/* Circular Profile Image */}
                <Box boxSize="40px" borderRadius="full" overflow="hidden">
                  <Image
                    src={item?.consultant?.profilePics}
                    alt="Consultant picture"
                  />
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" color="text_primary">
                    {item?.consultant?.fullName}
                  </Text>
                  <Text fontSize="xs" fontWeight="400" color="#999">
                    {item?.consultant?.businessName}
                  </Text>
                </Box>
              </Flex>
              <Image
                src="/icons/heart.svg"
                alt="Heart"
                boxSize="34px"
                cursor="pointer"
              />
            </HStack>
          ))}
      </Flex>
{
  data?.data?.favoriteConsultants.length > 3 && (
    <Text
    fontSize={"sm"}
    fontWeight={500}
    color={"#FC731A"}
    cursor={"pointer"}
    mt={4}
    textAlign="center"
  >
    See all
  </Text>
  )
}
   
    </VStack>
  );
};

export default FavouriteConsultantsComp;
