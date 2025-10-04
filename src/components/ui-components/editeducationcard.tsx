
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { size } from "lodash";
import { useState } from "react";
import EducationModal from "./educationmodal";
import { BiSolidEditAlt } from "react-icons/bi";
import { useRouter } from "next/router";
import Loader from "./profile/loader";

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
  isLoading,
}: EditEducationCardProps) => {

  const [open, setOpen] = useState<boolean>(false);
  const route = useRouter()


  return (
    <VStack
      borderWidth={0.5}
      borderColor={"bg_box"}
      rounded={"15px"}
      py="6"
      shadow={"sm"}
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
              {route.pathname === "/profile" && <Box
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
              </Box>}
            </HStack>

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
          </>
        )
      }


      <EducationModal
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      />
    </VStack>
  );
};

export default EditEducationCard;
