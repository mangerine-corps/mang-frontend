import {
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import GroupPreview from "mangarine/components/ui-components/grouppreview";
import GroupEmpty from "mangarine/components/ui-components/groupempty";
import CustomButton from "mangarine/components/customcomponents/button";
import AppLayout from "mangarine/layouts/AppLayout";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import CustomInput from "mangarine/components/customcomponents/Input";
import CustomSelect from "mangarine/components/customcomponents/select";
import { useCreateCommunityMutation, useGetCommunityQuery, useUpdateCommunityMutation } from "mangarine/state/services/community.service";
import { useRouter } from "next/router";
import { IoChevronBackOutline } from "react-icons/io5";

import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useDispatch } from "react-redux";
import { addCommunity } from "mangarine/state/reducers/community.reducer"; // Add css for snow theme
import { toaster } from "mangarine/components/ui/toaster";
import { useCommunity } from "mangarine/state/hooks/communities.hook";
import { dataTransformer } from "mangarine/utils/constants";
import { useGetInterestsMutation } from "mangarine/state/services/auth.service";
// or import 'quill/dist/quill.bubble.css'; // Add css for bubble theme

const groupSchema = Yup.object().shape({
  name: Yup.string().notRequired(),
  description: Yup.string().notRequired(),
  category: Yup.array().of(Yup.string()).min(1, "category is required"),
  questions: Yup.string().notRequired(),
  rules: Yup.string().required("rules is required"),
  visibility: Yup.string().optional(),
});

const GroupPrivacyOption = ({
  value,
  isChecked,
  onChange,
  title,
  description,
}) => {
      
  return (
    <HStack
      onClick={() => onChange(value)}
      // borderWidth="1px"
      // borderColor={isChecked ? "blue.500" : "gray.200"}
      // borderRadius="md"
      // p={4}
      py="2"
      justifyContent={"space-between"}
      // alignItems={}
      w="full"
      cursor="pointer"
      // bg={isChecked ? "blue.50" : "main_background"}
      // _hover={{ bg: isChecked ? "blue.50" : "gray.50" }}
    >
      <Box
      // pl="6px"
      // borderLeft="4px solid"
      // borderColor={isChecked ? "blue.600" : "transparent"}
      >
        <Text fontWeight="bold" mb={1}>
          {title}
        </Text>
        <Text fontSize="sm" color="grey.500">
          {description}
        </Text>
      </Box>
      <Box
        h="4"
        w="4"
        borderWidth="1px"
        borderColor={isChecked ? "blue.500" : "grey.200"}
        rounded="full"
        onClick={() => onChange(value)}
        bg={isChecked ? "text_primary" : "transparent"}
        _hover={{ bg: isChecked ? "text_primary" : "grey.50" }}
      ></Box>
    </HStack>
  );
};

const CreateGroup = () => {
  const [privacy, setPrivacy] = useState("public");
  const [showPreview, setShowPreview] = useState(false);
  const [createCommuntity, { isLoading }] = useCreateCommunityMutation();
  const [updateCommunity, { isLoading: updating }] = useUpdateCommunityMutation();
  const { quill, quillRef } = useQuill();

  const dispatch = useDispatch();
  const { all } = useCommunity();
  console.log(all, "all communities");
  const groupCategory = all.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.category === item.category)
  );
  console.log(groupCategory, "cat");
  const router = useRouter();
  const { query } = router;
  const editId = typeof query?.editId === 'string' ? query.editId : '';
  const { data: editData } = useGetCommunityQuery({ id: editId }, { skip: !editId });
  const [getInterest] = useGetInterestsMutation({});
        const [interestOptions, setInterestOptions] = useState<any[]>([]);
      useEffect(() => {
        getInterest({})
          .unwrap()
          .then((payload) => {
            const { data } = payload;
            const transformed = dataTransformer(data);
            setInterestOptions(transformed);
          });
      }, [getInterest]);
  const category = [
    {
      id: "0",
      label: "student",
      value: "student",
    },
    {
      id: "2",
      label: "Job seekers",
      value: "Job seekers",
    },
    {
      id: "3",
      label: "Content creators",
      value: "Content creators",
    },
  ];
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(groupSchema),
    defaultValues: {
      category: [],
      name: "",
      description: "",
      questions: "",
      rules: "",
      visibility: "public",
    },
  });
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        // console.log(quill.getText()); // Get text only
        // console.log(quill.getContents());
        setValue("rules", quill.root.innerHTML);
      });
    }
  }, [quill, setValue]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState<any>({});
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

  // Prefill form when editing an existing group
  useEffect(() => {
    const g: any = editData?.data;
    if (!editId || !g) return;
    // Basic fields
    setValue("name", g.name ?? "");
    setValue("description", g.description ?? "");
    setValue("category", g.category ? [g.category] : []);
    setValue("questions", g.questions ?? "");
    setValue("rules", g.rules ?? "");
    const vis = g.isPrivate ? "private" : "public";
    setValue("visibility", vis);
    setPrivacy(vis);
    // Banner preview
    if (g.image) setPreviewUrl(g.image);
    // Quill content
    if (quill) {
      try {
        quill.setContents([]);
        quill.clipboard.dangerouslyPasteHTML(g.rules || "");
      } catch {}
    }
  }, [editId, editData, setValue, quill]);

  const onSubmit = () => {
    const values = getValues();
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("category", values.category?.[0] ?? "");
    formData.append("questions", values.questions);
    formData.append("rules", values.rules);
    if (file && file.name) {
      formData.append("image", file);
    }
    formData.append("visibility", values.visibility);
    formData.append(
      "isPrivate",
      values.visibility === "private" ? "true" : "false"
    );
    if (editId) {
      updateCommunity({ id: editId, data: formData })
        .unwrap()
        .then((payload: any) => {
          const { data, message } = payload || {};
          toaster.create({
            title: "Updated",
            description: message || "Community updated successfully",
            type: "success",
            duration: 4000,
            closable: true,
          });
          router.push(`/groups/${editId}`);
        })
        .catch((error) => {
          console.log(error);
          toaster.create({
            title: "Update failed",
            description: error?.data?.message || "Unable to update community",
            type: "error",
            duration: 4000,
            closable: true,
          });
        });
      return;
    }

    createCommuntity(formData)
      .unwrap()
      .then((payload: any) => {
        const { data, message } = payload;
        console.log(data, "create");
        dispatch(addCommunity({ community: data }));
        toaster.create({
          title: "Success ",
          description: message,
          type: "success",
          duration: 4000,
          closable: true,
        });
        router.back();
      })
      .catch((error) => console.log(error));
  };
  const handlePreview = () => {
    setShowPreview(true);
  };
  const groupForm = useWatch({
    control,
  });

  return (
    <AppLayout>
      <Flex
        // bg="main_background"
        h="full"
        p={{ base: "4", lg: "0" }}
        columnGap={"4"}
        // mt={{ base: "4rem" }}
        flex="4"
        flexDirection={{ base: "column", lg: "row" }}
        overflowX="hidden"
        justifyContent={{ base: "space-between" }}
        scrollbar={"hidden"}
      >
        <Flex
          flexDir="column"
          flex={2}
          // h="full"
          overflowY={{ base: "none", lg: "auto" }}
          css={{
            "&::-webkit-scrollbar": {
              width: "0px",

              height: "0px",
            },
            "&::-webkit-scrollbar-track": {
              width: "0px",
              background: "transparent",

              height: "0px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
              borderRadius: "0px",
              maxHeight: "0px",
              height: "0px",
              width: 0,
            },
          }}
        >
          <Box
            // w="756px"
            // h="auto"
            px="24px"
            py="20px"
            bg="bg_box"
            borderRadius="md"
            boxShadow="md"
          >
            <Flex direction="column">
              <Flex align="center" mb={2}>
                {/* <Image src="/images/go-back.png" alt="left arrow" boxSize="24px" mr={2} /> */}
                <Stack
                  h="6"
                  w="6"
                  cursor="pointer"
                  rounded={"full"}
                  borderWidth={"1.5px"}
                  borderColor={"grey.300"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  onClick={() => router.back()}
                  mr="4"
                >
                  <Text
                    // fontWeight="600"
                    // fontSize="1.5rem"
                    font="outfit"
                    color="text_primary"
                    // lineHeight="36px"
                  >
                    <IoChevronBackOutline />
                  </Text>
                </Stack>
                <Text
                  fontWeight="600"
                  fontSize={{ base: "1rem", md: "1.5rem" }}
                  font="outfit"
                  color="text_primary"
                  lineHeight={{ base: "24px", md: "36px" }}
                >
                  {editId ? "Edit Group" : "Create Your Group"}
                </Text>
              </Flex>

              <Text
                fontWeight="400"
                fontSize={{ base: "0.875rem", md: "1.2rem" }}
                font="outfit"
                lineHeight="24px"
                color="gray.600"
                ml={8}
                mb={{ base: "4", md: 8 }}
              >
                Bring people together around a shared interest.
              </Text>
            </Flex>

            <VStack gap={5}>
              <Controller
                name="name"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label="Community Name"
                    placeholder="Enter community name"
                    id="email"
                    required={true}
                    name="email"
                    value={value}
                    size="lg"
                    onChange={onChange}
                    error={errors.name}
                    hasRightIcon={true}
                    type={"text"}
                    rightIcon={
                      <Icon mr={"4"}>
                        <Image src="/icons/groupimg.svg" alt="group-icon" />
                      </Icon>
                    }
                  />
                )}
              />
              {/* Description */}
              <Controller
                name="description"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <VStack w="full" alignItems={"flex-start"}>
                    <Text
                      color={"text_primary"}
                      fontWeight={"400"}
                      fontSize={"0.75rem"}
                    >
                      Community Description(Optional)
                    </Text>
                    <Textarea
                      placeholder="Describe the purpose of your community"
                      color={"text_primary"}
                      fontWeight={"400"}
                      fontSize={"0.75rem"}
                      height="150px"
                      p={2}
                      value={value}
                      onChange={onChange}
                      borderColor={"input_border"}
                    />
                  </VStack>
                )}
              />

              {/* Category */}

              <Controller
                name="category"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    id={"interests"}
                    placeholder="Select a category"
                    name={"category"}
                    size="md"
                         options={interestOptions}
                    label="Select a category"
                    isMulti={false}
                    value={value}
                    required={true}
                    error={errors.category}
                    onChange={onChange}
                  />
                )}
              />

              {/* Group Privacy */}
              <Box w="full" alignItems={"start"}>
                <Text
                  fontWeight="600"
                  fontSize={{ base: "0.875rem", md: "1.2rem" }}
                  font="outfit"
                  color="text_primary"
                  mb={2}
                >
                  Group Privacy
                </Text>
                <VStack gap={3}>
                  <GroupPrivacyOption
                    value="public"
                    isChecked={privacy === "public"}
                    onChange={() => {
                      setPrivacy("public");

                      setValue("visibility", "public");
                    }}
                    title="Public Group"
                    description="Anyone can join and view the content. Ideal for open discussions and broad outreach."
                  />
                  <GroupPrivacyOption
                    value="private"
                    isChecked={privacy === "private"}
                    onChange={() => {
                      setPrivacy("private");
                      setValue("visibility", "private");
                    }}
                    title="Private Group"
                    description="Membership by invitation or request only. Suitable for focused or exclusive groups."
                  />
                </VStack>
              </Box>

              <Controller
                name="questions"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label="Ask questions to new members"
                    placeholder="Why do you want to join this Group"
                    id="email"
                    required={true}
                    name="email"
                    value={value}
                    size="lg"
                    onChange={onChange}
                    error={errors.questions}
                    hasRightIcon={true}
                    type={"text"}
                    rightIcon={
                      <Icon mr={"4"}>
                        <Image src="/icons/groupimg.svg" alt="group-icon" />
                      </Icon>
                    }
                  />
                )}
              />

              <div style={{ width: "100%", height: 200 }}>
                <div ref={quillRef} />
              </div>

              {/* Description */}

              {/* Upload Group Banner */}
              <Stack
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
                w={{ base: "full", md: "full", lg: "full" }}
                // px={{base:"4",md:"0", lg:"0"}}
                pt={{ base: "24", md: "16", lg: "16" }}
                pb={{ base: "4", md: "16", lg: "16" }}
              >
                <Text
                  color="text_primary"
                  mt={{ base: "10", md: "4" }}
                  textAlign={"start"}
                  fontSize={"xs"}
                >
                  Upload Group Banner
                </Text>
                <Stack
                  w={{ base: "full", md: "353px", lg: "353px" }}
                  h="268px"
                  borderRadius="8px"
                  // px="126px"
                  // py="84px"
                  // gap="10px"
                  borderWidth="1px"
                  //borderStyle="dashed"
                  borderColor="gray.50"
                  // p={4}
                  //textAlign="center"
                  color="grey.400"
                  cursor="pointer"
                >
                  <Box
                    rounded="10px"
                    bg="#f2f2f2"
                    //   onClick={() => <ImagePicker />}
                    //   border={"1px"}
                    //   borderColor={"primary.300"}
                    // my={4}
                    w={"full"}
                    h={"full"}
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
                        // w={"100%"}
                        // h={"full"}
                        objectFit={"cover"}
                        src="/icons/imgplc.svg"
                        alt={"display-image"}
                      />
                    )}
                  </Box>
                </Stack>
              </Stack>
            </VStack>
            {showPreview ? (
              <CustomButton
                customStyle={{
                  w: "full",
                  color: "text_primary",
                }}
                // onClick={onClick}
                loading={editId ? updating : isLoading}
                onClick={handleSubmit(onSubmit)}
              >
                <Text
                  color={"button_text"}
                  fontWeight={"600"}
                  fontSize={"1rem"}
                  lineHeight={"100%"}
                >
                  {editId ? "Update" : "Submit"}
                </Text>
              </CustomButton>
            ) : (
              <CustomButton
                customStyle={{
                  w: "full",
                  color: "text_primary",
                }}
                // onClick={onClick}
                loading={editId ? updating : isLoading}
                onClick={handlePreview}
              >
                <Text
                  color={"button_text"}
                  fontWeight={"600"}
                  fontSize={"1rem"}
                  lineHeight={"100%"}
                >
                  {editId ? "Preview Changes" : "Preview"}
                </Text>
              </CustomButton>
            )}
          </Box>
        </Flex>
        <Flex
          flexDir="column"
          flex={2}
          h="full"
          overflowY={{ base: "none", lg: "auto" }}
          my={{ base: "4", md: "0", lg: "0" }}
        >
          {showPreview ? (
            <GroupPreview groupData={groupForm} banner={previewUrl} />
          ) : (
            <GroupEmpty />
          )}
        </Flex>
      </Flex>
    </AppLayout>
  );
};
export default CreateGroup;
