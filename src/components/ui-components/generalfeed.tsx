"use client";
import React, { useEffect, useState } from "react";
import { Box, BoxProps, Image, Text, Flex } from "@chakra-ui/react";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
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
  id: any
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
  const { selectedConsultant } = useConsultants();
  const [favoriteConsultant, { data, error }] = useFavoriteConsultantMutation();
   const [unfavoriteConsultant, { data:unfavData, error:unFavError }] = useUnfavoriteConsultantMutation();
  const { user } = useAuth()
  const dispatch = useDispatch()
 
  // Keep local state in sync with server-provided flag
  useEffect(() => {
    setIsLiked(!!isFavorited);
  }, [isFavorited]);

const handleHeartClick = () => {
  const consultantId = id;

  if (!isLiked) {
    // 🔹 Like consultant
    const formdata = {
      consultantId,
      userId: user.id,
    };

    favoriteConsultant(formdata)
      .unwrap()
      .then((res) => {
        setIsLiked(true);
        const consultationId = res.data.consultationId
        dispatch(addFavoriteConsultant(consultationId))
        console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  } else {
    // 🔹 Unlike consultant
    unfavoriteConsultant({ consultantId, userId: user.id })
      .unwrap()
      .then((res) => {
        setIsLiked(false);
        console.log(res, "res");
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }
};


  return (
    <Box
      display="flex"
      width="100%"
      h={"full"}
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      gap="8px"
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
      borderRadius="16px"
      bg={"bg_box"}
      boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
      position="relative"
      _hover={onClick ? { boxShadow: "0px 0px 8px 0px rgba(0, 0, 0, 0.18)" } : undefined}
      transition="box-shadow 0.15s"
      {...props}
    >
      <Image
        src={safeProfilePic(imageSrc)}
        onError={imgErrorFallback}
        alt={imageAlt}
        alignSelf="stretch"
        w="100%"
        onClick={onClick}
        h="180px"
        borderRadius="10px"
        objectFit="cover"
      />

      {/* Name and Language Row */}
      <Flex justifyContent="space-between" alignItems="center" width="100%" onClick={onClick}>
        <Text
          textAlign="left"
          fontSize="sm"
          fontWeight="bold"
          color="text_primary"
        >
          {name}
        </Text>
        <Text fontSize="xs" fontWeight="400" color="#999">
          {language}
        </Text>
      </Flex>

      <Text
        textAlign="left"
        fontSize="xs"
        fontWeight={"400"}
        color={"grey.500"}
      >
        {profession}
      </Text>
      <Text
        lineClamp={2}
        textAlign="left"
        fontSize="xs"
        fontWeight={"400"}
        color={"grey.300"}
      >
        {about}
      </Text>

      <Flex align="center" justify="space-between" width="100%">
        <Flex align="center" gap="2px">
          <Image src={locale} alt="location" boxSize="16px" />
          <Text
            textAlign="left"
            fontSize={"10px"}
            fontWeight={"400"}
            color={"#999"}
          >
            {location}
          </Text>
        </Flex>
        <Image
          src={isLiked ? heart : aheart}
          alt="Heart"
          boxSize="40px"
          cursor="pointer"
          onClick={() => {
            handleHeartClick()
          }}
        />
      </Flex>
    </Box>
  );
};

export default GeneralFeed;
