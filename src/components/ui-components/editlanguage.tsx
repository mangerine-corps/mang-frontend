import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { size } from "es-toolkit/compat";
import { useState } from "react";
import LanguageModal from "./langauagemodal";
import { BiSolidEditAlt } from "react-icons/bi";
import { useRouter } from "next/router";
import Loader from "./profile/loader";

interface EditLanguageCardProps {
  title: string;
  languages: any;
  width?: string | object;
  edit?: any;
  consultantId?: string
  isLoading: boolean
}

const EditLanguageCard = ({ title, languages, isLoading }: EditLanguageCardProps) => {
  //const { isOpen, onOpen, onClose } = useDisclosure();

  const [open, setOpen] = useState<boolean>();
  const route = useRouter()


  return (
    <VStack
      borderWidth={0.5}
      borderColor={"bg_box"}
      rounded={"15px"}
      py="6"
      bg="bg_box"
      shadow={"sm"}
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
              justifyContent={"space-between"}
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
              {route.pathname === "/profile" ? (
                <Box
                  cursor={"pointer"}
                  onClick={() => {
                    setOpen(true);
                  }}
                  mt={3}
                // pr={"2rem"}
                >
                  <Text color="text_primary" fontSize={"1rem"}>
                    <BiSolidEditAlt />
                  </Text>
                </Box>
              ) : (
                ""
              )}
            </HStack>

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
          </>
        )
      }


      <LanguageModal
        open={open}
        onOpenChange={() => {
          setOpen(!open);
        }}
      />
    </VStack>
  );
};

export default EditLanguageCard;
