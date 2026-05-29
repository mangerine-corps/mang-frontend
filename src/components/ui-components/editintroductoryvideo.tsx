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
  const [playing, setPlaying] = useState(false);
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

      <Box w="full" px="4">
        {hasVideo ? (
          playing ? (
            <AspectRatio ratio={16 / 9} w="full" mx="auto" borderRadius="12px" overflow="hidden">
              <iframe
                title="intro-video"
                src={videoLink}
                allowFullScreen
                style={{ borderRadius: "12px" }}
              />
            </AspectRatio>
          ) : (
            <Flex
              w="full"
              mx="auto"
              borderRadius="12px"
              overflow="hidden"
              bg="gray.900"
              aspectRatio={16 / 9}
              align="center"
              justify="center"
              cursor="pointer"
              onClick={() => setPlaying(true)}
              _hover={{ opacity: 0.85 }}
              transition="opacity 0.15s"
              position="relative"
            >
              <Image
                src="/icons/whitePlay.svg"
                alt="Play"
                boxSize="56px"
                filter="drop-shadow(0 2px 8px rgba(0,0,0,0.5))"
              />
            </Flex>
          )
        ) : (
          <Box
            w="full"
            mx="auto"
            bg="bg_box"
            borderRadius="lg"
          >
            <Flex direction="column" pb="6" align="center" justify="center">
              <Image src="/icons/emptyvid.svg" alt="video-icon" />
            </Flex>
            <Text
              className={outfit.className}
              fontWeight="600"
              color="text_primary"
              fontSize="1.2rem"
              py="3"
              textAlign="left"
            >
              No Introductory Video Yet
            </Text>
            <Text
              className={outfit.className}
              color="grey.500"
              fontSize="0.875rem"
              lineHeight="1.25rem"
              pt={1}
            >
              {isEditable
                ? "Add an introductory video to showcase your expertise and connect better with clients."
                : "This consultant hasn't added an introductory video yet."}
            </Text>
          </Box>
        )}
      </Box>

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
