
"use client";;
import { Box, Button, Drawer, HStack, Image, Text, Textarea, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";



import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useAddConsultingServiceMutation, useEditConsultingServiceMutation } from "mangarine/state/services/profile.service";
import { toaster } from "../ui/toaster";
import CustomInput from "../customcomponents/Input";

const upload = "/icons/imgplc.svg";
const workSchema = yup.object().shape({
  title: yup.string().required("title is required"),
  description: yup.string().required("description is required"),
  hours: yup.string().nullable(),
});

const ConsultancyServiceModal = ({
  open,
  onOpenChange,
  service,
  handleSelect
}: {
  open: boolean;
  onOpenChange: () => void;
  service:any;
   handleSelect:any
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState<any>(null);
  const [addService, { isLoading: addLoading }] = useAddConsultingServiceMutation();
  const [editService, { isLoading: editLoading }] = useEditConsultingServiceMutation();
  console.log(service, "service")
  const {
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(workSchema),
    defaultValues: {
      title: "",
      description: "",
      hours: "",
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

  // const createService = (data: any) => {
  //   if (!file) {
  //     toaster.create({
  //       title: "validation error.",
  //       description: "please select a file",
  //       type: "error",
  //       duration: 9000,
  //       closable: true,
  //     });
  //     return;
  //   }
  //   const formData = new FormData();
  //   formData.append("title", data.title);
  //   formData.append("description", data.description);
  //   formData.append("hours", data.hours);
  //   formData.append("file", file);
  //   addService(formData)
  //     .unwrap()
  //     .then((payload) => {
  //       const { message } = payload;
  //       toaster.create({
  //         title: "Success!",
  //         description: message,
  //         type: "success",
  //         duration: 9000,
  //         closable: true,
  //       });
  //       reset({ title: '', description: '', hours: '' })
  //       setFile(null)
  //       setPreviewUrl(null)
  //       onOpenChange();
  //     })
  //     .catch(() => {
  //       toaster.create({
  //         title: "Error",
  //         description: "Failed to create service",
  //         type: "error",
  //         duration: 9000,
  //         closable: true,
  //       });
  //     });
  // };
  useEffect(() => {
    if (service) {
      reset({
        title: service.title ?? "",
        description: service.description ?? "",
        hours: service.hours ?? "",
      });
      setPreviewUrl(service.file || null); // preview existing image
      setFile(null); // clear file until user picks a new one
    } else {
      reset({ title: "", description: "", hours: "" });
      setPreviewUrl(null);
      setFile(null);
    }
  }, [service, reset]);
 const createService = async (data: any) => {
   const formData = new FormData();
   formData.append("title", data.title);
   formData.append("description", data.description);
   formData.append("hours", data.hours);

   if (service?.id) {
     // 🔹 Update Mode
     if (file) {
       formData.append("file", file); // only add if new file uploaded
     }

     editService({ id: service.id, credentials: formData })
       .unwrap()
       .then((payload) => {
         toaster.create({
           title: "Updated",
           description: payload?.message || "Service updated successfully",
           type: "success",
           duration: 9000,
         });
         reset({ title: "", description: "", hours: "" });
         setFile(null);
         setPreviewUrl(null);
         onOpenChange();
       })
       .catch((err) =>
         toaster.create({
           title: "Error",
           description: err?.data?.message || "Failed to update service",
           type: "error",
           duration: 9000,
         })
       );
   } else {
     // 🔹 Create Mode
     if (!file) {
       toaster.create({
         title: "Validation error",
         description: "Please select a file",
         type: "error",
         duration: 9000,
       });
       return;
     }

     formData.append("file", file);

     addService(formData)
       .unwrap()
       .then((payload) => {
         toaster.create({
           title: "Success",
           description: payload?.message,
           type: "success",
           duration: 9000,
         });
         reset({ title: "", description: "", hours: "" });
         setFile(null);
         setPreviewUrl(null);
         onOpenChange();
       })
       .catch((err) =>
         toaster.create({
           title: "Error",
           description: err?.data?.message || "Failed to create service",
           type: "error",
           duration: 9000,
         })
       );
   }
 };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} size="md">
      <Drawer.Backdrop />

      <Drawer.Positioner zIndex="max" >
        <Drawer.Content pt="6" px="3">
          <Drawer.Header>
            <Drawer.Title>
              <VStack
                spaceY={6}
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
                px="4"
              >
                <HStack w="full" py={4} justifyContent={"space-between"}>
                  <Text
                    fontWeight={700}
                    fontSize={"2rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                  // textAlign={"start"}
                  >
                    Consultancy Service
                  </Text>

                </HStack>
              </VStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body px="2" py="8" bg="bg_box">
            <VStack
              spaceY={6}
              w="full"
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
            >
              <Controller
                name="title"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomInput
                    label="Service Title  "
                    placeholder="Service "
                    id="service_name"
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
                name="hours"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomInput
                    label="How many consulting hours? "
                    placeholder="Consultancy hours "
                    id="consultancy_hour"
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
                name="description"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Textarea
                    p="3"
                    value={value}
                    onChange={onChange}
                    borderWidth={1}
                    color='text_primary'
                    bg="main_background"
                    borderColor={"gray.100"}
                    rows={5}
                    resize={"none"}
                    placeholder="Tell us about the service."
                  />

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
                    w={12}
                    h={12}
                    src={upload}
                    alt={"display-image"}
                  />
                )}
              </Box>

              <HStack w='full' spaceX={6}>
                <Button
                  borderColor="primary.300"
                  borderWidth={1}
                  color={"white"}
                  bg={"white"}
                  py={2}
                  rounded="6px"
                  flex={1}
                  _hover={{
                    textDecor: "none",
                  }}
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}

                  onClick={onOpenChange}
                >
                  <Text
                    // ml={2}
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
                  flex={1}
                  _hover={{
                    textDecor: "none",
                  }}
                  loading={addLoading || editLoading}
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
                  rounded={"6px"}
                  onClick={handleSubmit(createService, (error) =>
                    console.log(error)
                  )}
                >
                  <Text
                    // ml={2}
                    className="text5"
                    color={"white"}
                    fontSize={"0.875rem"}
                    fontWeight={"500"}
                  >
                    {service?.id ? "Update" : "Save"}
                  </Text>
                </Button>
              </HStack>

            </VStack>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default ConsultancyServiceModal;
