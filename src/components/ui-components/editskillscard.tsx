
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { map } from "lodash";
import { useState } from "react";
import SkillsModal from "./skillsmodal";
import { BiSolidEditAlt } from "react-icons/bi";
import { useRouter } from "next/router";
import Loader from "./profile/loader";

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
  isLoading,
}: EditSkillCardProps) => {

  const [open, setOpen] = useState<boolean>(false)
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const route = useRouter()


  return (
    <VStack
      borderWidth={0.5}
      borderColor={"bg_box"}
      rounded={"15px"}
      py="6"
      shadow={"sm"}
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
              justifyContent={"space-between"}
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
              {route.pathname === "/profile" ? <Box
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
              </Box> : ""}
            </HStack>

            {map(skills, (skill) => (
              <VStack pl={4} w="full" alignItems={"flex-start"}>
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