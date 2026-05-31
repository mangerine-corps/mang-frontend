"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Box, BoxProps, Flex, Image, Text } from "@chakra-ui/react";
import { safeProfilePic, imgErrorFallback } from "mangarine/lib/constants";
import { useFavoriteConsultantMutation, useUnfavoriteConsultantMutation } from "mangarine/state/services/consultant.service";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useDispatch } from "react-redux";
import { addFavoriteConsultant } from "mangarine/state/reducers/consultant.reducer";

const heart = "/icons/heart.svg";
const aheart = "/icons/aheart.svg";
const locale = "/icons/Location.svg";

interface GeneralFeedProps extends BoxProps {
  imageSrc: string;
  imageAlt: string;
  name: string;
  profession: string;
  about: string;
  language: string;
  location: string;
  id: any;
  isFavorited?: boolean;
  onClick?: () => void;
}

const GeneralFeed: React.FC<GeneralFeedProps> = ({
  imageSrc,
  imageAlt,
  name,
  profession,
  about,
  language,
  location,
  id,
  isFavorited,
  onClick,
  ...props
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(!!isFavorited);
  const [favoriteConsultant] = useFavoriteConsultantMutation();
  const [unfavoriteConsultant] = useUnfavoriteConsultantMutation();
  const { user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLiked(!!isFavorited);
  }, [isFavorited]);

  const handleHeartClick = () => {
    const consultantId = id;
    if (!isLiked) {
      favoriteConsultant({ consultantId, userId: user.id })
        .unwrap()
        .then((res) => {
          setIsLiked(true);
          dispatch(addFavoriteConsultant(res.data.consultationId));
        })
        .catch(() => {});
    } else {
      unfavoriteConsultant({ consultantId, userId: user.id })
        .unwrap()
        .then(() => setIsLiked(false))
        .catch(() => {});
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={{ base: "row", sm: "column" }}
      alignItems={{ base: "center", sm: "center" }}
      gap={{ base: "12px", sm: "8px" }}
      p={{ base: "12px", sm: "16px" }}
      h={{ base: "auto", sm: "260px" }}
      overflow="hidden"
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
      borderRadius="16px"
      bg="bg_box"
      boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
      position="relative"
      textAlign={{ base: "left", sm: "center" }}
      _hover={onClick ? { boxShadow: "0px 2px 12px 0px rgba(0,0,0,0.14)", transform: "translateY(-2px)" } : undefined}
      transition="box-shadow 0.15s, transform 0.15s"
      {...props}
    >
      {/* Circular avatar */}
      <Avatar.Root boxSize={{ base: "52px", sm: "80px" }} flexShrink={0}>
        <Avatar.Fallback name={name} />
        <Avatar.Image
          src={safeProfilePic(imageSrc)}
          onError={imgErrorFallback}
          alt={imageAlt}
        />
      </Avatar.Root>

      {/* Info block */}
      <Flex
        direction="column"
        flex={1}
        minW={0}
        gap={{ base: "2px", sm: "6px" }}
        align={{ base: "flex-start", sm: "center" }}
      >
        {/* Name */}
        <Text
          fontSize={{ base: "0.875rem", sm: "0.9rem" }}
          fontWeight="700"
          color="text_primary"
          lineClamp={1}
          w="full"
        >
          {name}
        </Text>

        {/* Profession */}
        {profession ? (
          <Text
            fontSize="0.75rem"
            fontWeight="500"
            color="grey.500"
            lineClamp={1}
            w="full"
          >
            {profession}
          </Text>
        ) : null}

        {/* Language tag — hide on mobile to save space */}
        {language ? (
          <Box
            px={2}
            py="2px"
            borderRadius="full"
            bg="main_background"
            display={{ base: "none", sm: "inline-flex" }}
          >
            <Text fontSize="0.7rem" color="grey.400" fontWeight="400">
              {language}
            </Text>
          </Box>
        ) : null}

        {/* Bio — hide on mobile */}
        {about ? (
          <Text
            fontSize="0.72rem"
            fontWeight="400"
            color="grey.300"
            lineClamp={2}
            w="full"
            display={{ base: "none", sm: "block" }}
          >
            {about}
          </Text>
        ) : null}

        {/* Location + favourite */}
        <Flex align="center" justify="space-between" width="100%" mt={{ base: "2px", sm: "auto" }}>
          {location ? (
            <Flex align="center" gap="4px" minW={0} flex={1}>
              <Image src={locale} alt="location" boxSize="13px" flexShrink={0} />
              <Text fontSize="0.68rem" fontWeight="400" color="#999" truncate>
                {location}
              </Text>
            </Flex>
          ) : <Box flex={1} />}
          <Image
            src={isLiked ? heart : aheart}
            alt="favourite"
            boxSize="22px"
            cursor="pointer"
            flexShrink={0}
            onClick={(e) => {
              e.stopPropagation();
              handleHeartClick();
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default GeneralFeed;
