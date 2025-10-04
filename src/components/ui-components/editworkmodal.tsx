
"use client";
import { Box, Drawer, HStack, Image, Text, Textarea, VStack } from "@chakra-ui/react";
import { useState } from "react";


// const myStyles = {
//   itemShapes: RoundedStar,
//   activeFillColor: "#ffb700",
//   inactiveFillColor: "#d9d9d9",
// };

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useEditWorkMutation } from "mangarine/state/services/profile.service";
import CustomInput from "../customcomponents/Input";
import { isEmpty } from "es-toolkit/compat";
import { Button } from "../ui/button";
import { FaTimes } from "react-icons/fa";


const upload = "/assets/icons/uploadImg.svg";
const workSchema = yup.object().shape({
  title: yup.string().required("title is required"),
  description: yup.string().required("description is required"),
  link: yup.string()
      .trim()
      .required("Website is required")
      .min(10, "Website must be at least 10 characters")
      .max(2083, "Website must be at most 2083 characters")
      .matches(/^https?:\/\//i, "URL must start with http:// or https://")
      .url("Enter a valid URL"),
});

const EditWorkModal = ({
  work,
  open,
  onOpenChange,
}: {
  work?: any;
  open: boolean;
  onOpenChange: () => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState<any>({});
  // const toast = useToast();
  const [editWork] = useEditWorkMutation();

  const {
    handleSubmit,
    control,
  } = useForm({
    resolver: yupResolver(workSchema),
    defaultValues: {
      title: work?.title ?? "",
      description: work?.description ?? "",
      link: work?.link ?? "",
    },
  });
  const handleFileChange = (e: any) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
      setFile(file); // Set selected file to state
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Set the image URL to display the preview
      };
      reader.readAsDataURL(file); // Read the image as a data URL
    }
  };
  const handleImageClick = () => {
    document.getElementById("hidden-file-input").click(); // Programmatically click the hidden input
  };

  const updateWork = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("link", data.link);
    formData.append("file", file);
    editWork({ workId: work.id, formData })
      .unwrap()
      .then((payload) => {
        const { message } = payload;
        console.log(data, message,'work')
        // toast({
        //   title: "Success!",
        //   description: message,
        //   status: "success",
        //   duration: 9000,
        //   isClosable: true,
        //   position: "top-right",
        // });
        onOpenChange();
      })
      .catch((error) => {
         console.log(error)
        // toast({
        //   title: "Error",
        //   description: "Failed to create work",
        //   status: "error",
        //   duration: 9000,
        //   isClosable: true,
        //   position: "top-right",
        // });
      });
  };
  return (

     <Drawer.Root size={"sm"} open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />
      <Drawer.Trigger></Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <VStack
                spaceY={6}
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
                px="4"
              >
                <HStack w="full" py={4} px="3" justifyContent={"space-between"}>
                  <Text
                    fontWeight={700}
                    fontSize={"2rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    // textAlign={"start"}
                  >
                    Edit Work
                  </Text>
                  <HStack spaceX={4}>
                    <Box
                      border={0.5}
                      rounded={4}
                      py={2}
                      px="2"
                      onClick={onOpenChange}
                      borderColor={"gray.150"}
                      shadow={"md"}
                    >
                      <Text
                        color="text_primary"
                        fontSize={"0.8rem"}
                        fontWeight={"400"}
                      >
                        <FaTimes />
                      </Text>
                    </Box>
                  </HStack>
                </HStack>
              </VStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body px="3" py="8">
           <VStack
            spaceY={6}
            w="full"
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
          >
            
            <Controller
              name="title"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Title  "
                  placeholder="Project title "
                  id="Project title"
                  required={true}
                  name="title"
                  value={value}
                  size="md"
                  onChange={onChange}
                  //   error={{}}
                  hasRightIcon={false}
                  type={"text"}
                />
              )}
            />
            <Controller
              name="link"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="link  "
                  placeholder="Link to the project "
                  id="link"
                  required={true}
                  name="link"
                  value={value}
                  size="md"
                  onChange={onChange}
                  //   error={{}}
                  hasRightIcon={false}
                  type={"text"}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <VStack>
                  <Text
                    color="#999"
                    fontFamily="Outfit"
                    fontSize="12px"
                    fontStyle="normal"
                    fontWeight="400"
                  >
                    Work Description
                  </Text>

                  <Textarea
                    p="3"
                    value={value}
                    onChange={onChange}
                    borderWidth={1}
                    borderColor={"gray.100"}
                    rows={5}
                    resize={"none"}
                    placeholder="Tell us about the project."
                  />
                </VStack>
              )}
            />

            <Box
              rounded="10px"
              bg="#f2f2f2"
              //   onClick={() => <ImagePicker />}
              //   border={"1px"}
              //   borderColor={"primary.300"}
              my={4}
              w={"40%"}
              h={44}
              display={"flex"}
              flexDir={"column"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <input
                id="hidden-file-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {previewUrl ? (
                // <img
                //   src={previewUrl}
                //   alt="Selected"
                //   style={{ width: "100%", height: "100%", objectFit: "cover" }}
                // />
                <Image
                  cursor={"pointer"}
                  onClick={handleImageClick}
                  w={"100%"}
                  h={"full"}
                  src={previewUrl}
                  alt={"selectedimage"}
                />
              ) : (
                <Image
                  cursor={"pointer"}
                  onClick={handleImageClick}
                  w={"100%"}
                  h={"full"}
                  objectFit={"cover"}
                  src={!isEmpty(work?.file) ? work?.file : upload}
                  alt={"display-image"}
                />
              )}
            </Box>
            <HStack
              w="full"
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <HStack w="100%" display={"flex"} flexDir={"row"} spaceX={6}>
                <Button
                  borderColor="primary.300"
                  borderWidth={1}
                  color={"white"}
                  bg={"white"}
                  py={2}
                  rounded="6px"
                  w="45%"
                  px={4}
                  _hover={{
                    textDecor: "none",
                  }}
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}

                  onClick={() => {}}
                >
                  <Text
                    ml={2}
                    className="text5"
                    color={"primary.300"}
                    fontSize={"0.875rem"}
                    fontWeight={"500"}
                  >
                    Cancel
                  </Text>
                </Button>
                <Button
                  bg="primary.300"
                  borderWidth={1}
                  color={"white"}
                  borderColor={"gray.50"}
                  py={2}
                  w="45%"
                  //   isLoading={isLoading}
                  px={4}
                  _hover={{
                    textDecor: "none",
                  }}
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
                  // isLoading={isLoading}
                  onClick={handleSubmit(updateWork, (error) =>
                    console.log(error)
                  )}
                >
                  <Text
                    ml={2}
                    className="text5"
                    color={"white"}
                    fontSize={"0.875rem"}
                    fontWeight={"500"}
                  >
                    Save
                  </Text>
                </Button>
              </HStack>
            </HStack>

          </VStack>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default EditWorkModal;
