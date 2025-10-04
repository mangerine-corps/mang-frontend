import { Box, Button, HStack, Image, RatingGroup, Stack, Text, Textarea, VStack } from '@chakra-ui/react'
import CustomButton from 'mangarine/components/customcomponents/button';
import React, { useState } from 'react'
import { FaHeart } from 'react-icons/fa';
import ShareReview from '../sharereview';



const ReviewComp =()=>{
      const [value, setValue] = useState<number>(3)
      const [reply, setReply] = useState<boolean>(false)
        const [share, setShare] = useState<boolean>(false);
    return (
      <Box
        w="100%"
        mx="auto"
        p={4}
        boxShadow="md"
        borderRadius="md"
        bg="main_background"
        py="5"
      >
        <HStack
          w="full"
          justifyContent={"flex-start"}
          alignItems={"flex-start"}
        >
          <HStack w="40">
            <Stack
              bg="grey.100"
              justifyContent={"center"}
              objectFit={"contain"}
              alignItems={"center"}
              h="12"
              w="12"
              rounded="full"
            >
              {" "}
              <Image
                h="full"
                w="full"
                rounded="full"
                src="/images/dp.png"
                alt="review-img"
              />
            </Stack>{" "}
            <VStack align="start">
              <Text
                color="grey.500"
                textWrap={"nowrap"}
                fontSize="0.875rem"
                fontWeight={"400"}
              >
                Jenny Wilson
              </Text>
              <Text
                color="text_primary"
                textWrap={"nowrap"}
                fontSize="0.625rem"
                fontWeight={"600"}
              >
                August 31, 2024
              </Text>
            </VStack>
          </HStack>
          <VStack
            // bg="#EEFBF3"
            justifyContent={"flex-start"}
            // objectFit={"contain"}
            alignItems={"flex-start"}
            // py="4"
            px="4"
            pb="4"
            // rounded="md"
          >
            <RatingGroup.Root
              count={5}
              value={value}
              colorScheme="yellow"
              onValueChange={(e) => setValue(e.value)}
            >
              <RatingGroup.HiddenInput />
              <RatingGroup.Control />
            </RatingGroup.Root>
            <Text color="text_primary" fontSize={{base:"0.8rem",md:"0.875rem",lg:"1rem"}}  fontWeight={"400"}>
             {` Good advice, but the session was too short. The consultant
              provided valuable insights, but I felt there | | wasn't enough
              time to cover all my concerns.`}
            </Text>
          </VStack>{" "}
        </HStack>
        {reply && (
          <Stack
            // bg="red.800"
            w="full"
            alignItems={{base:"center",lg:"flex-end"}}
            justifyItems={{base:"center",lg:"flex-end"}}
          >
            <Stack w="80%">
              <Text
                color="grey.500"
                textWrap={"nowrap"}
                fontSize="1rem"
                fontWeight={"400"}
              >
                Reply to this review
              </Text>
              <Stack
                w="100%"
                borderWidth={"1.5px"}
                borderColor="grey.300"
                rounded="lg"
                resize={"none"}
              >
                <Textarea
                  border="none"
                  focusRing={"none"}
                  outline={"none"}
                  h="150px"
                  w="full"
                  p="4"
                  resize="none"
                />
                <HStack
                  alignItems="center"
                  justifyContent={"space-between"}
                  px="3"
                >
                  <HStack>
                    <Image src="/icons/smily.svg" alt="upload picture" />

                    <Image
                      pl="2"
                      src="/icons/photos.svg"
                      alt="upload picture"
                    />
                  </HStack>
                  <Button variant="ghost">
                    <Text
                      color="text_primary"
                      fontSize="1rem"
                      fontWeight={"600"}
                    >
                      Reply
                    </Text>
                  </Button>
                </HStack>
              </Stack>
            </Stack>
          </Stack>
        )}
        <HStack
          w="full"
          display={"flex"}
          alignItems={{base:"center",lg:"flex-end"}}
          justifyContent={{base:"center",lg:"flex-end"}}
          flexDir={"row"}
          py="6"
          // mx="auto"
        >
          <CustomButton
            customStyle={{
              w: "25%",
              bg: "main_background",
              borderWidth: "2px",
            }}
            onClick={() => {setShare(true) }}
            // loading={isLoading}
            // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
          >
            <Text
              color={"text_primary"}
              fontWeight={"600"}
         fontSize={{base:"0.8rem",md:"0.875rem",lg:"1rem"}} 
              lineHeight={"100%"}
            >
              Share Review
            </Text>
          </CustomButton>
          <CustomButton
            customStyle={{
              w: "25%",
            }}
            onClick={() => {
              setReply(!reply);
            }}

            // loading={isLoading}
            // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
          >
            <Text
              color={"button_text"}
              fontWeight={"600"}
           fontSize={{base:"0.8rem",md:"0.875rem",lg:"1rem"}} 
              lineHeight={"100%"}
            >
              Reply Review
            </Text>
          </CustomButton>
          <Box
            cursor="pointer"
            // onClick={() => {
            //   setShowDrawer(true);
            // }}
            ml="0"
            bg="bg_box"
            py="2.5"
            px="2.5"
            shadow={"sm"}
            rounded="md"
          >
            <Text fontSize={"xl"} fontWeight={"600"} color="text_primary">
              <FaHeart />
            </Text>
          </Box>
        </HStack>
        <ShareReview
          open={share}
          onOpenChange={() => {
            setShare(false);
          }}
        />
      </Box>
    );
}

const ReviewDetails = () => {
  return (
    <Box
      w="100%"
      mx="auto"
      p={4}
      boxShadow="md"
      borderRadius="md"
      bg="main_background"
      py="5"
    >
      <Text fontSize={{base:"1rem",md:"1.2rem",lg:"1.5rem"}} color={"text_primary"} fontWeight={"600"} py={2}>
        Recent Reviews
      </Text>
      <ReviewComp/>
    </Box>
  );
}

export default ReviewDetails