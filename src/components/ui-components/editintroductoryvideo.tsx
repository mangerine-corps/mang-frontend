import { Text, VStack, Image, Box, HStack, AspectRatio, Flex } from "@chakra-ui/react";
import { isEmpty } from "lodash";
import { useState } from "react";
import EditIntroVideoModal from "./editintrovideo";
import { outfit } from "mangarine/pages/_app";
import SectionActionButton from "./sectionactionbutton";

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
  const isEditable = Boolean(edit);
  const hasVideo = !isEmpty(videoLink);

  return (
    <VStack
      borderWidth={0.5}
      borderColor={"#0000001A"}
      rounded={"15px"}
      py="6"
      boxShadow="0px 0px 4px 0px #0000001A"
      // wordSpacing={"3"}
      w={width}
      bg="bg_box"
    >
      <HStack
        w="full"
        px="4"
        alignItems="center"
        justifyContent={"flex-start"}
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
      </HStack>
      <EditIntroVideoModal
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      />

      {imageSrc && (
        <Box position="relative" w="full" h="auto" px="4">
          {hasVideo ? (
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
                {isEditable
                  ? "Add an introductory video to showcase your expertise and connect better with clients."
                  : "This consultant hasn't added an introductory video yet."}
              </Text>
            </Box>
            // <IntroductionEmpt onClick={()=>{}} />yState
          )}

          {hasVideo && playIconSrc && (
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

      {isEditable && (
        <Box w="full" px="4" pt="4">
          <SectionActionButton
            title={title}
            label={hasVideo ? "Update Video" : "Upload Video"}
            fullWidth
            onClick={() => {
              setOpen(true);
            }}
          />
        </Box>
      )}
    </VStack>
  );
};

export default EditIntroductionVideoCard;
