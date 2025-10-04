import { Text, VStack, Image, Box, HStack, AspectRatio, Button, Flex } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import EditIntroVideoModal from "./editintrovideo";
import { useRouter } from "next/router";
import IntroductionEmptyState from "./emptyIntroductoryvid";
import { outfit } from "mangarine/pages/_app";

interface EditIntroductionVideoCardProps {
  title: string;
  imageSrc: string;
  playIconSrc: string;
  width?: string | object;
  edit?: any;
  consultantId?: string;
}

interface EditIntroductionVideoCardProps {
  title: string;
  imageSrc: string;
  playIconSrc: string;
  width?: string | object;
  edit?: any;
  videoLink: string
}

const EditIntroductionVideoCard = ({
  title,
  imageSrc,
  playIconSrc,
  width = "full",
  videoLink,
  edit,
}: EditIntroductionVideoCardProps) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  // const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const route = useRouter()

  useEffect(() => {

  }, [videoLink])

  return (
    <VStack
      borderWidth={0.5}
      borderColor={"#0000001A"}
      rounded={"15px"}
      py="6"
      shadow={"sm"}
      // wordSpacing={"3"}
      w={width}
      bg="bg_box"
    >
      <HStack
        w="full"
        px="4"
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Text
          textAlign={"left"}
          //   pl={"2rem"}
          fontSize={"1.25rem"}
          fontFamily={"Outfit"}
          color={"text_primary"}
          fontWeight={"600"}
        >
          {title}
        </Text>
        {route.pathname === "/profile" ? (
          <Box
            cursor={"pointer"}
            py={1}
            px="1"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Text color="text_primary" fontSize="1rem">
              {edit}
            </Text>
          </Box>
        ) : (
          ""
        )}
      </HStack>
      <EditIntroVideoModal
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      />

      {imageSrc && (
        <Box position="relative" w="full" h="auto" px="4">
          {!isEmpty(videoLink) ? (
            // <video
            //   src={videoLink}
            //   controls
            //   style={{
            //     width: "100%",
            //     height: "full",
            //     borderRadius: "12px",
            //   }}
            // />
            <AspectRatio p={0} maxW="560px" ratio={2}>
              <iframe title="naruto" src={videoLink} allowFullScreen />
            </AspectRatio>
          ) : (
            <Box
              flex="flex-end"
              w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
              // maxW={{ base: "full", md: "340px", lg: "400px" }}
              // maxW="340px"
              mx="auto"
              // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
              display={{ base: "none", md: "block", lg: "block" }}
              // p={6}
              bg="bg_box"
              borderRadius="lg"
              // border="1px solid"
              // borderColor="grey.300"
              // boxShadow="sm"
            >
              <Flex direction="column" pb="6" align="center" justify="center">
                <Image src="/icons/emptyvid.svg" alt="video-icon" />
              </Flex>
              <Text
                className={outfit.className}
                fontWeight="600"
                color="text_primary"
                fontSize="1.2rem"
                // mb={4}
                py="3"
                textAlign={"left"}
              >
                No Introductory Video Yet
              </Text>

              <Text
                className={outfit.className}
                color="grey.500"
                font-family="Outfit"
                font-weight="25rem"
                font-size="0.875rem"
                line-height="1.25rem"
                wordSpacing={2}
                // mb={6}
                // pr={11}
                pt={1}
                // pl={2}
              >
                Add an introductory video to showcase your expertise and connect
                better with clients.
              </Text>
              {route.pathname === "/profile" && (
                <Button
                  bg="primary.500"
                  borderWidth={1}
                  color={"white"}
                  borderColor={"gray.50"}
                  py={2}
                  my="3"
                  cursor="pointer"
                  w="full"
                  px={4}
                  _hover={{
                    textDecor: "none",
                  }}
                  onClick={() => {
                    setOpen(true);
                  }}
                  // loading={isLoading}
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
                  rounded={"6px"}
                  // onClick={onClick}
                >
                  <Text
                    ml={2}
                    className="text5"
                    color={"white"}
                    fontSize={"0.875rem"}
                    fontWeight={"500"}
                  >
                    Upload Video
                  </Text>
                </Button>
              )}
            </Box>
            // <IntroductionEmpt onClick={()=>{}} />yState
          )}

          {playIconSrc && (
            <Image
              src="/icons/whitePlay.svg"
              alt="Play icon"
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              boxSize="40px"
              cursor="pointer"
            />
          )}
        </Box>
      )}
    </VStack>
  );
};

export default EditIntroductionVideoCard;
