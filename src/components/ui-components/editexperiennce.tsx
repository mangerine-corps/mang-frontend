import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { size } from "lodash";
import ExperienceModal from "./experiencemodal";
import Loader from "./profile/loader";
import SectionActionButton from "./sectionactionbutton";
//import ExperienceModal from "./experience";

interface EditExperienceCardProps {
  title: string;

  width?: string | object;
  edit?: any;
  experiences: any;
  isLoading: boolean;
}

const EditExperienceCard = ({
  title,
  experiences,
  width = "full",
  edit,
  isLoading,
}: EditExperienceCardProps) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();

  const [open, setOpen] = useState<boolean>(false);
  const [startWithDraft, setStartWithDraft] = useState(false);
  const isEditable = Boolean(edit);
  return (
    <VStack
      borderWidth={0.5}
      borderColor={"bg-box"}
      rounded={"15px"}
      py="6"
      boxShadow="0px 0px 4px 0px #0000001A"
      wordSpacing={"2"}
      w={width}
      bg="bg_box"
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <HStack
            w="full"
            px="3"
            alignItems="center"
            justifyContent={"flex-start"}
          >
            <Text
              textAlign={"left"}
              //   w="full"
              //   pl={"4px"}
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
            {isEditable ? "Showcase your professional journey" : "No work experience has been added yet."}
          </Text>

          {size(experiences) > 0 ? (
            experiences.map((experience) => (
              <VStack
                w="full"
                alignItems="flex-start"
                px="4"
                key={experience.id}
              >
                <Text
                  textAlign={"left"}
                  w="full"
                  fontSize={"1rem"}
                  fontFamily={"Outfit"}
                  lineHeight={"shorter"}
                  color={"text_primary"}
                  fontWeight={"500"}
                >
                  {experience.title}
                </Text>

                <Text
                  textAlign={"left"}
                  w="full"
                  lineHeight={"shorter"}
                  fontSize={"0.875rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"400"}
                >
                  {`${experience.company_name}`}
                </Text>

                <Text
                  textAlign={"left"}
                  w="full"
                  fontSize={"0.875rem"}
                  fontFamily={"Outfit"}
                  textTransform={"capitalize"}
                  color={"grey.500"}
                  lineHeight={"shorter"}
                  fontWeight={"400"}
                >
                  {`${experience.start_month} ${experience.start_year} - ${experience.end_month} ${experience.end_year}`}
                </Text>
              </VStack>
            ))
          ) : (
            <Text
              fontWeight={400}
              fontSize={"1rem"}
              fontFamily={"Outfit"}
              color={"text_primary"}
              textAlign={"center"}
            >
              No Experience found
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
      )}

      <ExperienceModal
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

export default EditExperienceCard;
