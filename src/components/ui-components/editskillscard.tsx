
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import SkillsModal from "./skillsmodal";
import Loader from "./profile/loader";
import SectionActionButton from "./sectionactionbutton";

interface EditSkillCardProps {
  title: string;
  skills: any;
  edit?: any;
  isLoading: boolean;
  consultantId?: string
}

const EditSkillCard = ({
  title,
  skills,
  edit,
  isLoading,
}: EditSkillCardProps) => {

  const [open, setOpen] = useState<boolean>(false)
  const isEditable = Boolean(edit);


  return (
    <VStack
      borderWidth={0.5}
      borderColor={"bg_box"}
      rounded={"15px"}
      py="6"
      boxShadow="0px 0px 4px 0px #0000001A"
      wordSpacing={"2"}
      w={"full"}
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
            // onClick={onOpen}
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
            {(!skills || skills.length === 0) && (
              <Text
                w="full"
                px="4"
                pb="2"
                color="grey.500"
                fontSize="0.875rem"
                fontFamily="Outfit"
              >
                {isEditable ? "Tell people what you're great at" : "No skills have been added yet."}
              </Text>
            )}

            {(Array.isArray(skills) ? skills : []).map((skill: any, index: number) => (
              <VStack key={skill.id ?? skill.name ?? index} pl={4} w="full" alignItems={"flex-start"}>
                <Text
                  textAlign={"left"}
                  w="full"
                  // px={"4"}
                  fontSize={"1rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"500"}
                >
                  {skill.name}
                </Text>
                <Text
                  textAlign={"left"}
                  w="full"
                  // pl={"2rem"}
                  fontSize={"0.875rem"}
                  fontFamily={"Outfit"}
                  color={"#999"}
                  fontWeight={"400"}
                >
                  {skill.skills.join(", ")}
                </Text>
              </VStack>
            ))}

            {isEditable && (
              <Box w="full" px="4" pt="4">
                <SectionActionButton
                  title={title}
                  fullWidth
                  onClick={() => {
                    setOpen(true);
                  }}
                />
              </Box>
            )}
          </>
        )
      }

      <SkillsModal
        open={open}
        onOpenChange={() => {
          setOpen(!open);
        }}
      />
    </VStack>
  );
};

export default EditSkillCard;
