import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { size } from "es-toolkit/compat";
import { useState } from "react";
import LanguageModal from "./langauagemodal";
import Loader from "./profile/loader";
import SectionActionButton from "./sectionactionbutton";

interface EditLanguageCardProps {
  title: string;
  languages: any;
  width?: string | object;
  edit?: any;
  consultantId?: string
  isLoading: boolean
}

const EditLanguageCard = ({ title, languages, edit, isLoading }: EditLanguageCardProps) => {
  //const { isOpen, onOpen, onClose } = useDisclosure();

  const [open, setOpen] = useState<boolean>(false);
  const [startWithDraft, setStartWithDraft] = useState(false);
  const isEditable = Boolean(edit);


  return (
    <VStack
      borderWidth={0.5}
      borderColor={"bg_box"}
      rounded={"15px"}
      py="6"
      bg="bg_box"
      boxShadow="0px 0px 4px 0px #0000001A"
      wordSpacing={"2"}
      w={"full"}
    >
      {
        isLoading ? (
          <Loader />
        ) : (
          <>
            <HStack
              w="full"
              px="4"
              alignItems="center"
              justifyContent={"flex-start"}
            >
              <Text
                textAlign={"left"}
                //   w="full"
                //   pl={"2rem"}
                fontSize={"1.25rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"600"}
              >
                {title}
              </Text>
            </HStack>
            <Text
              w="full"
              px="4"
              pb="2"
              color="grey.500"
              fontSize="0.875rem"
              fontFamily="Outfit"
            >
              Tell us which language you speak
            </Text>

            {size(languages) > 0 ? (
              languages.map((language) => (
                <VStack w="full" key={language?.id}>
                  <Text
                    textAlign={"left"}
                    w="full"
                    px={"4"}
                    fontSize={""}
                    fontFamily={"Outfit"}
                    lineHeight={"shorter"}
                    color={"text_primary"}
                    fontWeight={"400"}
                  >
                    {language.language}
                  </Text>
                  <Text
                    textAlign={"left"}
                    w="full"
                    px={"4"}
                    lineHeight={"shorter"}
                    fontSize={""}
                    fontFamily={"Outfit"}
                    color={"grey.500"}
                    fontWeight={"400"}
                  >
                    {language.proficiency}
                  </Text>
                </VStack>
              ))
            ) : (
              <Text
                fontWeight={400}
                fontSize={"1rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
              // textAlign={"start"}
              >
                No Languages found
              </Text>
            )}

            {isEditable && (
              <Box w="full" px="4" pt="4">
                <SectionActionButton
                  title={title}
                  fullWidth
                  onClick={() => {
                    setStartWithDraft(true);
                    setOpen(true);
                  }}
                />
              </Box>
            )}
          </>
        )
      }


      <LanguageModal
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setStartWithDraft(false);
        }}
        startWithDraft={startWithDraft}
      />
    </VStack>
  );
};

export default EditLanguageCard;
