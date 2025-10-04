"use client";
import { Box, Button, Drawer, HStack, Image, Text, Textarea, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toaster } from "../ui/toaster";
import CustomInput from "../customcomponents/Input";
import { useEditConsultingServiceMutation } from "mangarine/state/services/profile.service";

const upload = "/icons/imgplc.svg";

const schema = yup.object().shape({
  title: yup.string().required("title is required"),
  description: yup.string().required("description is required"),
  hours: yup.string().nullable(),
});

interface EditConsultancyServiceModalProps {
  open: boolean;
  onOpenChange: () => void;
  service: any | null;
}

const EditConsultancyServiceModal = ({ open, onOpenChange, service }: EditConsultancyServiceModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [editService, { isLoading }] = useEditConsultingServiceMutation();

  const { handleSubmit, control, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      hours: "",
    },
  });

  useEffect(() => {
    if (service) {
      setValue("title", service.title ?? "");
      setValue("description", service.description ?? "");
      setValue("hours", String(service.hours ?? ""));
      setPreviewUrl(service.file ?? null);
      setFile(null);
    }
  }, [service, setValue]);

  const handleFileChange = (e: any) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleImageClick = () => {
    document.getElementById("hidden-file-input-edit")?.click();
  };

  const onSubmit = async (data: any) => {
    if (!service?.id) return;
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("hours", data.hours ?? "");
    if (file) formData.append("file", file);

    try {
      const payload: any = await editService({ id: service.id, credentials: formData }).unwrap();
      const { message } = payload || {};
      toaster.create({
        title: "Success!",
        description: message ?? "Consultancy updated successfully",
        type: "success",
        duration: 4000,
        closable: true,
      });
      onOpenChange();
    } catch (err: any) {
      const { message } = err || {};
      toaster.create({
        title: "Error",
        description: message ?? "Failed to update service",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} size="md">
      <Drawer.Backdrop />
      <Drawer.Positioner zIndex="max">
        <Drawer.Content pt="6" px="3">
          <Drawer.Header>
            <Drawer.Title>
              <VStack spaceY={6} w="full" justifyContent="space-between" alignItems="center" px="4">
                <HStack w="full" py={4} justifyContent="space-between">
                  <Text fontWeight={700} fontSize="2rem" fontFamily="Outfit" color="text_primary">
                    Edit Consultancy Service
                  </Text>
                </HStack>
              </VStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body px="2" py="8" bg="bg_box">
            <VStack spaceY={6} w="full" justifyContent="flex-start" alignItems="flex-start">
              <Controller
                name="title"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomInput
                    label="Service Title"
                    placeholder="Service"
                    id="service_name_edit"
                    required
                    name="title"
                    value={value}
                    size="md"
                    onChange={onChange}
                    hasRightIcon={false}
                    type="text"
                  />
                )}
              />

              <Controller
                name="hours"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomInput
                    label="How many consulting hours?"
                    placeholder="Consultancy hours"
                    id="consultancy_hour_edit"
                    required
                    name="hours"
                    value={value}
                    size="md"
                    onChange={onChange}
                    hasRightIcon={false}
                    type="text"
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
                    color="text_primary"
                    bg="main_background"
                    borderColor={"gray.100"}
                    rows={5}
                    resize={"none"}
                    placeholder="Tell us about the service."
                  />
                )}
              />

              <Box rounded="10px" bg="#f2f2f2" my={4} w={"full"} h={44} display={"flex"} flexDir={"column"} justifyContent={"center"} alignItems={"center"}>
                <input id="hidden-file-input-edit" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
                {previewUrl ? (
                  <Image cursor={"pointer"} onClick={handleImageClick} w={"100%"} h={"full"} src={previewUrl} alt={"selectedimage"} />
                ) : (
                  <Image cursor={"pointer"} onClick={handleImageClick} w={12} h={12} src={upload} alt={"display-image"} />
                )}
              </Box>

              <HStack w="full" spaceX={6}>
                <Button borderColor="primary.300" borderWidth={1} color={"white"} bg={"white"} py={2} rounded="6px" flex={1} onClick={onOpenChange}>
                  <Text className="text5" color={"primary.300"} fontSize={"0.875rem"} fontWeight={"500"}>
                    Cancel
                  </Text>
                </Button>
                <Button bg="primary.300" borderWidth={1} color={"white"} borderColor={"gray.50"} py={2} flex={1} loading={isLoading} rounded={"6px"} onClick={handleSubmit(onSubmit)}>
                  <Text className="text5" color={"white"} fontSize={"0.875rem"} fontWeight={"500"}>
                    Save
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

export default EditConsultancyServiceModal;
