"use client"
import { Box, Center, Flex, HStack, Image, Stack, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { useColorMode } from '../ui/color-mode'
import { useWindowSize } from 'react-use'
import { useRouter } from 'next/router'
export const images = [
  {
    bg: "/images/bg2.svg",
    bg2: "/images/bg1Dark.svg",
    image: "/images/onboard1.svg",
    imageDark: "/images/stayImageDark.svg",

    title: "Stay connected.",
    extra: "Solve Real Problems",
    description:
      "Talk directly with professionals and businesses. Get expert help when it matters.",
  },
  {
    bg: "/images/bg2Dark.svg",
    bg2: "/images/bg1Dark.svg",
    image: "/images/onboard2.svg",
    imageDark: "/images/joinImageDark.svg",

    title: "Join the Community ",
    extra: "Share Your Value",
    description:
      "Explore posts, connect live, and show the world what you can do—in your own words.",
  },
  {
    bg: "/images/bgDark3.svg",
    bg2: "/images/bg1Dark.svg",
    image: "/images/onboard3.svg",
    imageDark: "/images/liveImageDark.svg",
    title: "Go Live,",
    extra: " Get Discovered",
    description: "Consult, showcase your work to others. Earn income.",
  },
];

const OnboardingCarousel = () => {
  const [imageIndex, setImageIndex] = useState<number>(0)
  const { colorMode } = useColorMode()
  const { height } = useWindowSize();
  const [carouselHeight, setCarouselHeight] = useState<number>(0)
  const [isClient, setIsClient] = useState(false)
  const router =useRouter()
 const isIndex = router.pathname === "/";
  useEffect(() => {
    setIsClient(true);
    // console.log(isIndex,"route")
  }, []);


  const handleClick = (index: number) => {
    setImageIndex(index)
  }
  console.log(height)
  useEffect(() => {
    if (height < 600) {
      setCarouselHeight(height / 4)
    } else if (height < 1000) {
      setCarouselHeight(height / 1.4)
    } else {
      setCarouselHeight(height / 1.35)
    }
  }, [height])


  return (
    <Stack
      flexDir={"column"}
      justifyContent={"stretch"}
      h="95vh"
      w="full"
      minH="95vh"
      maxH={"95vh"}
      pos="relative"
      // bg="red.200"
      overflow={"hidden"}
      // pt="12"
    >
      <Carousel
        showStatus={false}
        autoPlay
        onChange={(currentIndex: number) => setImageIndex(currentIndex)}
        showThumbs={false}
        showIndicators={false}
        showArrows={false}
        infiniteLoop
        className="carousel_style"
        axis="horizontal"
        selectedItem={imageIndex}
      >
        {images.map((item, index) => (
          <VStack
            // bgImage={`url(${item.bg})`}
            bgImage={
              !isClient
                ? `url(${item.bg})`
                : colorMode === "dark"
                  ? `url(${item.bg2})`
                  : `url(${item.bg})`
            }
            bgSize={"cover"}
            // minHeight={`${height - 50}px`}
            key={index}
            minH={"95vh"}
            maxH={"95vh"}
            h="full"
            alignItems="stretch"
            justifyContent="space-between"
            spaceY={4}
            roundedBottom={"20px"}
            // py={32}
            pos="relative"
          >
            {!isIndex && (
              <Box pos="absolute" top="6" left="6" zIndex="1">
                <Image
                  boxSize={{ base: "32px", md: "64px" }}
                  objectFit="contain"
                  src={"/images/logoDark.svg"}
                  alt="logo"
                />
              </Box>
            )}

            <Flex
              justifyContent="center"
              height={ index !== 3 ? height / 2 : carouselHeight}
              mx="auto"
              minW={{ base: "300px", md: "350px", lg: "600px" }}
              maxWidth={{ base: "300px", md: "350px", lg: "600px" }}
              // minW={"600px"}
              alignItems="center"
              flex={2}
              pt={isIndex ? "12"  : 24}

            >
              <Image
                objectFit="contain"
                w="full"
                h="80%"
                alt="Group image"
                src={
                  !isClient
                    ? item.image
                    : colorMode === "dark"
                      ? item.imageDark
                      : `${item.image}`
                }
              />
            </Flex>

            <Flex
              // h="full"
              flexDir="column"
              alignSelf="center"
              mt={2}
              flex={1}
              w="70%"
              justifyContent="center"
              bottom={0}
              pb="12"
            >
              <Text
                // mb={2}
                color="white"
                fontFamily="Outfit"
                fontSize="2.2rem"
                fontWeight="700"
                lineHeight={"53.75px"}
              >
                {item.title}
              </Text>
              <Text
                mb={2}
                color="white"
                fontFamily="Outfit"
                fontSize="2.2rem"
                fontWeight="700"
              >
                {item.extra}
              </Text>
              <Text
                color="foundation.100"
                fontFamily="Outfit"
                fontSize="1.375rem"
                fontWeight={
                  !isClient ? "400" : colorMode === "dark" ? "500" : `${400}`
                }
              >
                {item.description}
              </Text>
            </Flex>
          </VStack>
        ))}
      </Carousel>

      <Center pos={"absolute"} bottom={5} right={0} left={0}>
        <HStack>
          {images.map((_, i) => (
            <Box
              key={i}
              onClick={() => handleClick(i)}
              rounded="full"
              p={0.5}
              w={imageIndex === i ? 7 : 2.5}
              h={2.5}
              bg={imageIndex === i ? "white" : "gray.300"}
              zIndex="overlay"
            />
          ))}
        </HStack>
      </Center>
    </Stack>
  );
}

export default OnboardingCarousel
