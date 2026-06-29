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

const LinkIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.2811 12.3101L12.2577 17.3521C10.897 18.7171 9.00478 19.5 7.06459 19.5C5.15637 19.5 3.38005 18.771 2.06028 17.447C-0.723124 14.653 -0.681192 10.063 2.15516 7.21704L7.87786 1.47302C8.82498 0.523022 10.0838 0 11.4225 0C12.7613 0 14.0201 0.523022 14.9673 1.47302C16.9204 3.43302 16.9204 6.62201 14.9673 8.58301L9.21761 14.354C8.12863 15.446 6.23136 15.446 5.14237 14.354C4.02042 13.228 4.02042 11.396 5.14237 10.269L10.1927 5.19995C10.4844 4.90795 10.96 4.90597 11.2527 5.19897C11.5454 5.49097 11.5464 5.96701 11.2537 6.26001L6.20339 11.329C5.6629 11.871 5.6629 12.753 6.20339 13.295C6.72491 13.819 7.63404 13.819 8.15555 13.295L13.9052 7.52405C15.2769 6.14805 15.2769 3.90896 13.9052 2.53296C12.5794 1.20096 10.2646 1.20096 8.93888 2.53296L3.21619 8.27698C1.00025 10.501 0.957261 14.2159 3.12124 16.3879C4.15728 17.4279 5.55702 18 7.06361 18C8.60818 18 10.1148 17.377 11.1958 16.292L16.2191 11.25C16.5108 10.958 16.9853 10.956 17.2791 11.249C17.5728 11.541 17.5738 12.0161 17.2811 12.3101Z" fill="#41416E"/>
  </svg>
);

const MediaIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="13" y="7" width="4" height="4" rx="2" fill="#111D4A" stroke="#A20606" strokeWidth="1.5"/>
    <path d="M4.71809 17.2014L6.45698 15.4625C8.08199 13.8375 10.7166 13.8375 12.3417 15.4625L14.0805 17.2014M14.0805 17.2014L14.7849 16.497C16.0825 15.1994 18.2143 15.2961 19.3891 16.7059L19.802 17.2014M14.0805 17.2014L16.6812 19.802M3.35288 15.0496C2.88237 13.0437 2.88237 10.9563 3.35288 8.95043C4.00437 6.17301 6.17301 4.00437 8.95043 3.35288C10.9563 2.88237 13.0437 2.88237 15.0496 3.35288C17.827 4.00437 19.9956 6.17301 20.6471 8.95044C21.1176 10.9563 21.1176 13.0437 20.6471 15.0496C19.9956 17.827 17.827 19.9956 15.0496 20.6471C13.0437 21.1176 10.9563 21.1176 8.95044 20.6471C6.17301 19.9956 4.00437 17.827 3.35288 15.0496Z" stroke="#363853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const linkSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  link: yup
    .string()
    .trim()
    .required("Link is required")
    .test("valid-url", "Enter a valid URL starting with http:// or https://", (value) => {
      if (!value) return false;
      return /^https?:\/\//i.test(value) && yup.string().url().isValidSync(value);
    }),
});

const mediaSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  link: yup.string().optional(),
});

type WorkMode = "link" | "media";

const AddWorkDrawer = ({
  open,
  onOpenChange,
  work,
  initialMode,
}: {
  open: boolean;
  onOpenChange: () => void;
  work: any;
  initialMode?: WorkMode | null;
}) => {
  const isEditing = !isEmpty(work);
  const inferMode = (w: any): WorkMode => (w?.link && !w?.file ? "link" : "media");
  const [mode, setMode] = useState<WorkMode | null>(
    isEditing ? inferMode(work) : (initialMode ?? null)
  );
  const [previewUrl, setPreviewUrl] = useState<any>(null);
  const [file, setFile] = useState<any>({});
  const [isDragging, setIsDragging] = useState(false);
  const [addWork, { isLoading: addwork }] = useAddWorkMutation();
  const [editWork, { isLoading }] = useEditWorkMutation();

  const schema = mode === "link" ? linkSchema : mediaSchema;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", description: "", link: "" },
  });

  useEffect(() => {
    if (work) {
      reset({
        title: work.title || "",
        description: work.description || "",
        link: work.link || "",
      });
      setPreviewUrl(work.file || null);
      setMode(inferMode(work));
    } else {
      reset({ title: "", description: "", link: "" });
      setPreviewUrl(null);
      setMode(null);
    }
  }, [work, reset]);

  // Sync initialMode when drawer opens
  useEffect(() => {
    if (open && !isEditing && initialMode) {
      setMode(initialMode);
    }
    if (!open && !isEditing) {
      setMode(null);
      setPreviewUrl(null);
      setFile({});
    }
  }, [open, isEditing, initialMode]);

  const handleFileChange = (e: any) => {
    const selected = e.target.files[0] || null;
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selected);
    }
  };

  const handleImageClick = () => {
    document.getElementById("work-file-input")?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) {
      setFile(dropped);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(dropped);
    }
  };

  const createWork = (data: any) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.link) formData.append("link", data.link);

    if (isEditing) {
      const workId = work?.id;
      if (file && file.name) formData.append("file", file);

      editWork({ workId, credentials: formData })
        .unwrap()
        .then(({ message }) => {
          onOpenChange();
          toaster.create({ title: "Success", type: "success", description: message, duration: 3000, closable: true });
          reset({ title: "", description: "", link: "" });
          setFile(null);
          setPreviewUrl(null);
        })
        .catch(({ message }) => {
          toaster.create({ title: "Error", description: message, type: "error", duration: 3000, closable: true });
        });
    } else {
      if (mode === "media" && (!file || !file.name)) {
        toaster.create({ title: "Missing media", description: "Please upload an image for your work.", type: "warning", duration: 6000, closable: true });
        return;
      }
      if (file && file.name) formData.append("file", file);

      addWork(formData)
        .unwrap()
        .then(({ message }) => {
          toaster.create({ title: "Success!", description: message, type: "success", duration: 9000, closable: true });
          onOpenChange();
          reset({ title: "", description: "", link: "" });
          setFile(null);
          setPreviewUrl(null);
        })
        .catch(() => {
          toaster.create({ title: "Error", description: "Failed to create work", type: "error", duration: 9000, closable: true });
        });
    }
  };

  return (
    <TopRightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Work" : "Add Work"}
      bodyProps={{
        px: { base: "4", lg: "6" },
        py: { base: "4", lg: "5" },
        pb: { base: "14", lg: "16" },
      }}
    >
      <VStack spaceY={5} w="full" alignItems="flex-start" px={1} pt={2} pb={4}>

        {/* Mode selector — shown when not editing and no mode chosen yet */}
        {!isEditing && !mode && (
          <HStack w="full" gap={4}>
            <Box
              as="button"
              flex={1}
              onClick={() => setMode("link")}
              borderWidth="1.5px"
              borderColor="input_border"
              borderRadius="12px"
              p={5}
              display="flex"
              flexDir="column"
              alignItems="center"
              gap={3}
              cursor="pointer"
              _hover={{ borderColor: "primary.500", bg: "primary.50" }}
              transition="all 0.15s"
            >
              <LinkIcon />
              <Text fontSize="0.875rem" fontWeight="500" color="text_primary">
                Add a link
              </Text>
            </Box>

            <Box
              as="button"
              flex={1}
              onClick={() => setMode("media")}
              borderWidth="1.5px"
              borderColor="input_border"
              borderRadius="12px"
              p={5}
              display="flex"
              flexDir="column"
              alignItems="center"
              gap={3}
              cursor="pointer"
              _hover={{ borderColor: "primary.500", bg: "primary.50" }}
              transition="all 0.15s"
            >
              <MediaIcon />
              <Text fontSize="0.875rem" fontWeight="500" color="text_primary">
                Add a media
              </Text>
            </Box>
          </HStack>
        )}

        {/* Form — shown once mode is selected */}
        {(isEditing || mode) && (
          <>
            {/* Back to mode selector (only when creating) */}
            {!isEditing && (
              <Text
                fontSize="0.8rem"
                color="primary.500"
                cursor="pointer"
                onClick={() => { setMode(null); reset({ title: "", description: "", link: "" }); setPreviewUrl(null); setFile({}); }}
              >
                ← Change type
              </Text>
            )}

            <Controller
              name="title"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Title"
                  placeholder="Project title"
                  id="work-title"
                  required={true}
                  error={errors.title}
                  name="title"
                  value={value}
                  size="md"
                  onChange={onChange}
                  hasRightIcon={false}
                  type="text"
                />
              )}
            />

            {/* Link field */}
            {mode === "link" && (
              <Controller
                name="link"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label="Link"
                    placeholder="https://..."
                    id="work-link"
                    required={true}
                    name="link"
                    value={value}
                    size="md"
                    onChange={onChange}
                    error={errors.link}
                    hasRightIcon={false}
                    type="text"
                  />
                )}
              />
            )}

            {/* Media upload */}
            {mode === "media" && (
              <Box w="full">
                <Text color="text_muted" fontSize="0.75rem" fontWeight="400" mb={2}>
                  Media
                  {!isEditing && (
                    <Text as="span" color="red.400" ml={1}>*</Text>
                  )}
                </Text>
                <Box
                  rounded="12px"
                  bg={isDragging ? "primary.50" : "#f2f2f2"}
                  borderWidth={isDragging ? "2px" : "1.5px"}
                  borderStyle="dashed"
                  borderColor={isDragging ? "primary.500" : "transparent"}
                  w="full"
                  h={44}
                  display="flex"
                  flexDir="column"
                  justifyContent="center"
                  alignItems="center"
                  overflow="hidden"
                  cursor="pointer"
                  transition="all 0.15s"
                  onClick={handleImageClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    id="work-file-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  {previewUrl ? (
                    <Image w="100%" h="full" src={previewUrl} alt="selected" objectFit="cover" />
                  ) : (
                    <VStack gap={2} pointerEvents="none">
                      <Image w={12} h={10} objectFit="cover" src={upload} alt="upload" />
                      <Text fontSize="0.75rem" color={isDragging ? "primary.500" : "gray.400"} fontWeight="500">
                        {isDragging ? "Drop to upload" : "Click or drag & drop an image"}
                      </Text>
                    </VStack>
                  )}
                </Box>
              </Box>
            )}

            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <VStack w="full" alignItems="flex-start" gap={0}>
                  <Text color="text_muted" fontSize="0.75rem" fontWeight="400" mb={2}>
                    Work Description
                    <Text as="span" color="red.400" ml={1}>*</Text>
                  </Text>
                  <Textarea
                    p="3"
                    value={value}
                    onChange={onChange}
                    borderWidth={1}
                    color="text_primary"
                    bg="main_background"
                    borderColor="gray.100"
                    rows={5}
                    resize="none"
                    placeholder="Tell us about the project."
                  />
                  {errors.description && (
                    <Text color="red.500" fontSize="0.75rem" mt={1}>{errors.description.message}</Text>
                  )}
                </VStack>
              )}
            />

            <HStack w="full" gap={4}>
              <Button
                borderColor="primary.300"
                borderWidth={1}
                bg="bg_box"
                py={2}
                rounded="6px"
                flex={1}
                onClick={onOpenChange}
              >
                <Text color="primary.300" fontSize="0.875rem" fontWeight="500">Cancel</Text>
              </Button>
              <Button
                bg="button_bg"
                borderWidth={1}
                borderColor="button_bg"
                py={2}
                flex={1}
                _hover={{ opacity: 0.85 }}
                loading={isEditing ? isLoading : addwork}
                onClick={handleSubmit(createWork, (e) => console.log(e))}
              >
                <Text color="white" fontSize="0.875rem" fontWeight="500">Save</Text>
              </Button>
            </HStack>
          </>
        )}

      </VStack>
    </TopRightDrawer>
  );
};

export default AddWorkDrawer;
