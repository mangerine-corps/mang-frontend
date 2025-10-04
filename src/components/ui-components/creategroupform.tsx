import {
  Box,
  Text,
  Input,
  Textarea,
  VStack,
  Image,
  Flex,
  HStack,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaArrowLeft, FaBackward, FaCaretLeft } from "react-icons/fa";
import { IoChevronBackOutline } from "react-icons/io5";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import CustomButton from "../customcomponents/button";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "../customcomponents/Input";
import CustomSelect from "../customcomponents/select";




const groupSchema = Yup.object().shape({
  communityName: Yup.string().notRequired(),
  commDesc: Yup.string().notRequired(),
  category: Yup.array().of(Yup.string()).min(1, "category is required"),
  questions: Yup.string().notRequired(),
  rules: Yup.string().required("rules is required"),
});

type props ={
  back:any,
  onClick:any
}
const GroupPrivacyOption = ({ value, isChecked, onChange, title, description }) => {

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

const CreateGroupForm = ({back,onClick}:props) => {
  const [privacy, setPrivacy] = useState("public");
  const category = [
    {
      id:"0",
      label:"student",
      value:"student"

    },
    {
      id:"2",
      label:"Job seekers",
      value:"Job seekers"

    },
    {
      id:"3",
      label:"Content creators",
      value:"Content creators"

    }
  ]
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(groupSchema),
  defaultValues: {
 category:[],
    communityName: "",
    commDesc:"",

    questions:"",
    rules:"",
  },
});
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
  return (
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
            onClick={back}
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
            fontSize="1.5rem"
            font="outfit"
            color="text_primary"
            lineHeight="36px"
          >
            Create Your Group
          </Text>
        </Flex>

        <Text
          fontWeight="400"
          fontSize="1.2rem"
          font="outfit"
          lineHeight="24px"
          color="gray.600"
          ml={8}
          mb={8}
        >
          Bring people together around a shared interest.
        </Text>
      </Flex>

      <VStack gap={5}>
        <Controller
          name="communityName"
          control={control}
          render={({ field: { onChange, value} }) => (
            <CustomInput
              label="Community Name"
              placeholder="Enter community name"
              id="email"
              required={true}
              name="email"
              value={value}
              size="lg"
              onChange={onChange}
              error={errors.communityName}
              hasRightIcon={true}
              type={"text"}
              rightIcon={
                <Icon mr={"4"}>
                  <Image src="/icons/groupimg.svg" alt="group-icon" />
                  {/* {colorMode === "dark" ? (
                    <Image src="/icons/groupimg.svg" alt="group-icon" />
                  ) : (
                    <Image src="/icons/groupimg.svg" alt="group-icon" />
                  )} */}
                </Icon>
              }
            />
          )}
        />
        {/* Description */}
        <Controller
          name="commDesc"
          control={control}
          render={({ field: { onChange, value } }) => (
            <VStack w="full" alignItems={"flex-start"}>
              <Text color="gray.600" fontSize={"xs"}>
                Community Description(Optional)
              </Text>
              <Textarea
                placeholder="Describe the purpose of your community"
                fontSize="md"
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
                options={category}
                label=""
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
            fontSize="1.2rem"
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
              onChange={setPrivacy}
              title="Public Group"
              description="Anyone can join and view the content. Ideal for open discussions and broad outreach."
            />
            <GroupPrivacyOption
              value="private"
              isChecked={privacy === "private"}
              onChange={setPrivacy}
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
                  {/* {colorMode === "dark" ? (
                    <Image src="/icons/groupimg.svg" alt="group-icon" />
                  ) : (
                    <Image src="/icons/groupimg.svg" alt="group-icon" />
                  )} */}
                </Icon>
              }
            />
          )}
        />
        <Controller
          name="rules"
          control={control}
          render={({ field: { onChange, value } }) => (
            <VStack
              w="full"
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
            >
              <Text color="gray.600" fontSize="xs">
                Group Rules
              </Text>
              <Textarea
                placeholder="What rules is your Group guided by?"
                fontSize="md"
                height="150px"
                p={2}
                borderColor={"input_border"}
                value={value}
                onChange={onChange}
              />
            </VStack>
          )}
        />

        {/* Description */}

        {/* Upload Group Banner */}
        <Stack
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
          w="full"
          pb="16"
        >
          <Text color="text_primary" mt={4} textAlign={"start"} fontSize={"xs"}>
            Upload Group Banner
          </Text>
          <Stack
            w="353px"
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
      <CustomButton
        customStyle={{
          w: "full",
          color: "text_primary",
        }}
        onClick={onClick}
        // loading={isLoading}
        // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
      >
        <Text
          color={"button_text"}
          fontWeight={"600"}
          fontSize={"1rem"}
          lineHeight={"100%"}
        >
          Submit
        </Text>
      </CustomButton>
    </Box>
  );
};

export default CreateGroupForm;
