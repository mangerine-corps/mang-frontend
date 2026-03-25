"use client";
import {
  Box,
  HStack,
  Image,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

// const myStyles = {
//   itemShapes: RoundedStar,
//   activeFillColor: "#ffb700",
//   inactiveFillColor: "#d9d9d9",
// };

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import {
  useAddWorkMutation,
  useEditWorkMutation,
} from "mangarine/state/services/profile.service";
import CustomInput from "../customcomponents/Input";
import { Button } from "../ui/button";
import { toaster } from "../ui/toaster";
import { isEmpty, size } from "es-toolkit/compat";
import TopRightDrawer from "../ui/top-right-drawer";

const upload = "/icons/imgplc.svg";
const workSchema = yup.object().shape({
  title: yup.string().required("title is required"),
  description: yup.string().required("description is required"),
  link: yup
    .string()
    .trim()
    .required("Website is required")
    .min(10, "Website must be at least 10 characters")
    .max(2083, "Website must be at most 2083 characters")
    .matches(/^https?:\/\//i, "URL must start with http:// or https://")
    .url("Enter a valid URL"),
});

const AddWorkDrawer = ({
  open,
  onOpenChange,
  work,
}: {
  open: boolean;
  onOpenChange: () => void;
  work: any;
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState<any>({});
  //   const toast = useToast();
  const [addWork, { isLoading: addwork }] = useAddWorkMutation();
  const [editWork, { isLoading }] = useEditWorkMutation();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(workSchema),
    defaultValues: {
      title: "",
      description: "",
      link: "",
    },
  });
  // Prefill when editing
  useEffect(() => {
    if (work) {
      reset({
        title: work.title || "",
        description: work.description || "",
        link: work.link || "",
      });
      setPreviewUrl(work.file || null);
    } else {
      reset({
        title: "",
        description: "",
        link: "",
      });
      setPreviewUrl(null);
    }
  }, [work, reset]);
  const handleFileChange = (e: any) => {
    const file = e.target.files[0] || null // Get the selected file

    if (file) {
      setFile(file); // Set selected file to state
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file); // Read the image as a data URL
    }
  };
  const handleImageClick = () => {
    document.getElementById("hidden-file-input").click(); // Programmatically click the hidden input
  };

  const createWork = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("link", data.link);

    if (!isEmpty(work)) {
      // Edit existing work
      const workId = work?.id;
      // Only append a new file if one was selected
      if (file && file.name) {
        formData.append("file", file);
      }

      editWork({ workId, credentials: formData })
        .unwrap()
        .then((res) => {
          const {message, data}= res
              onOpenChange();
          toaster.create({
            title: "Success",
            type: "success",
            description: message,
            duration: 3000,
            closable: true,
          });
          // Close and reset local UI state

          reset({ title: "", description: "", link: "" });
          setFile(null);
          setPreviewUrl(null);
        })
        .catch((err) => {
           const { message, data } = err;
          toaster.create({
            title: "Error",
            description: message,
            type: "error",
            duration: 3000,
            closable: true,
          });
        });
    } else {
      // Create new work - file is required
      if (!file || !file.name) {
        toaster.create({
          title: "Missing image",
          description: "Please select an image for your work.",
          type: "warning",
          duration: 6000,
          closable: true,
        });
        return;
      }
      formData.append("file", file);

      addWork(formData)
        .unwrap()
        .then((payload) => {
          const { message } = payload;
          toaster.create({
            title: "Success!",
            description: message,
            type: "success",
            duration: 9000,
            closable: true,
          });
          // Close and reset local UI state
          onOpenChange();
          reset({ title: "", description: "", link: "" });
          setFile(null);
          setPreviewUrl(null);
        })
        .catch((error) => {
          console.log(error);
          toaster.create({
            title: "Error",
            description: "Failed to create work",
            type: "error",
            duration: 9000,
            closable: true,
          });
        });
    }
  };

  return (
    <TopRightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={size(work) > 0 ? "Edit Work" : "Add Work"}
      bodyProps={{
        px: { base: "4", lg: "6" },
        py: { base: "4", lg: "5" },
        pb: { base: "14", lg: "16" },
      }}
    >
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
                    error={errors.title}
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
                    error={errors.link}
                    hasRightIcon={false}
                    type={"text"}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <VStack w="full" alignItems={"flex-start"}>
                    <Text
                      color="text_primary"
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
                      color="text_primary"
                      bg="main_background"
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
                w={"full"}
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
                    w={"12"}
                    h={"10"}
                    objectFit={"cover"}
                    src={upload}
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

                    onClick={() => {
                      onOpenChange();
                    }}
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
                    bg="#111D4A"
                    borderWidth={1}
                    color={"white"}
                    borderColor={"#111D4A"}
                    py={2}
                    w="45%"
                    px={4}
                    _hover={{
                      textDecor: "none",
                      bg: "#111D4A",
                    }}
                    loading={size(work) > 0 ? isLoading : addwork}
                    onClick={handleSubmit(createWork, (error) =>
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
    </TopRightDrawer>
  );
};

export default AddWorkDrawer;
