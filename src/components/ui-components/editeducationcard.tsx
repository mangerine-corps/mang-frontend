
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { size } from "lodash";
import { useState } from "react";
import EducationModal from "./educationmodal";
import Loader from "./profile/loader";
import SectionActionButton from "./sectionactionbutton";

interface EditEducationCardProps {
  title: string;

  width?: string | object;
  educations: any;
  edit?: any;
  isLoading: boolean;
}

const EditEducationCard = ({
  title,
  educations,
  width = "full",
  edit,
  isLoading,
}: EditEducationCardProps) => {

  const [open, setOpen] = useState<boolean>(false);
  const [startWithDraft, setStartWithDraft] = useState(false);
  const isEditable = Boolean(edit);


  return (
    <VStack
      borderWidth={0.5}
      borderColor={"bg_box"}
      rounded={"15px"}
      py="6"
      boxShadow="0px 0px 4px 0px #0000001A"
      w={width}
      bg="bg_box"
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
              Add your academic background
            </Text>

            {size(educations) > 0 ? (
              educations.map((education) => (
                <VStack w="full" alignItems="flex-start" key={education.id}>
                  <Text
                    textAlign={"left"}
                    w="full"
                    px={"4"}
                    lineHeight={"shorter"}
                    fontSize={"1rem"}
                    fontFamily={"Outfit"}
                    color={"text-primary"}
                    fontWeight={"500"}
                  >
                    {education.school_name}
                  </Text>

                  <Text
                    textAlign={"left"}
                    w="full"
                    px={"4"}
                    fontSize={"0.875rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    fontWeight={"400"}
                  >
                    {`${education.degree} ${education.field_of_study}`}
                  </Text>

                  <Text
                    textAlign={"left"}
                    w="full"
                    px={"4"}
                    lineHeight={"short"}
                    fontSize={"0.875rem"}
                    fontFamily={"Outfit"}
                    textTransform={"capitalize"}
                    color={"grey.300"}
                    fontWeight={"400"}
                  >
                    {`${education.start_month} ${education.start_year} - ${education.end_month} ${education.end_year}`}
                  </Text>
                </VStack>
              ))
            ) : (
              <Text
                fontWeight={400}
                fontSize={"1"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                textAlign={"center"}
              >
                No Education found
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


      <EducationModal
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

export default EditEducationCard;
