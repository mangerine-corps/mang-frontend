"use client";;
import {
  Avatar,
  Box,
  Button,
  Drawer,
  HStack,
  Icon,
  Image,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import * as Yup from "yup";

import { useDispatch } from "react-redux";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";


import "react-datepicker/dist/react-datepicker.css";

import { BiSolidError } from "react-icons/bi";
import {
  useUpdateProfileBannerMutation,
  useUpdateProfileInfoMutation,
  useUpdateProfilePictureMutation,
} from "mangarine/state/services/profile.service";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { isEmpty } from "es-toolkit/compat";
import { setUpdatedInfo } from "mangarine/state/reducers/auth.reducer";
import Toast from "./Error";
import CustomInput from "../customcomponents/Input";
import { FaTimes } from "react-icons/fa";
import { toaster } from "../ui/toaster";
import FileUploader from "../customcomponents/fileupload";
import VideoUploader from "../customcomponents/videoUpload";
import { useUpdateDetailsMutation } from "mangarine/state/services/auth.service";
const profileSchema = Yup.object().shape({
  fullName: Yup.string().required("full name is required"),
  Title: Yup.string(),
  email: Yup.string()
    .required("Email is required")
    .email("Eneter a valid email address"),

  location: Yup.string().required("location  is required"),
  occupation: Yup.string().required("location  is required"),
  dateOfBirth: Yup.date().required("date of birth is required"),
  bio: Yup.string().optional(),

  // enable_selfpay: Yup.boolean().notRequired(),
});

const camera = "/icons/whitCamera.svg";

const EditConsultDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [updateProfilePic, { isLoading: picLoading }] = useUpdateProfilePictureMutation();
  const [updateBanner, { isLoading: bannerLoading }] = useUpdateProfileBannerMutation();
  const [updateProfile,] = useUpdateProfileInfoMutation();
  //   const toast = useToast();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [previewCover, setPreviewCover] = useState(null);
  const [resume, setResume] = useState<any>({})
  const [video, setVideo] = useState<any>({})
  const [addInfo, { isLoading: uploading }] = useUpdateDetailsMutation();
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      occupation: user?.occupation ?? "",
      Title: user?.Title ?? "",
      location: user?.location ?? "",
      dateOfBirth: !isEmpty(user?.dateOfBirth)
        ? new Date(
            new Date(user?.dateOfBirth).toLocaleString("en", {
              timeZone: "GMT",
            })
          )
        : new Date(),
      bio: user?.bio ?? "",
      // enable_selfpay: false,
    },
  });
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Set the image URL to display the preview
      };
      reader.readAsDataURL(file); // Read the image as a data URL
      handleProfilePicsUpload(file);
    }
  };
    const addDetails = (data: any) => {
      console.log(data);
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("video", video);
      formData.append('title', data.title)
      // formData.append('description', data.description)
      addInfo(formData)
        .unwrap()
        .then((payload) => {
          console.log(payload)

        })
        .catch((error) => {
          const { data } = error;
          console.log(data,"data")
          if (!isEmpty(data) && data.hasOwnProperty("message")) {
            setErrorMessage(data.message);
          } else {
            setErrorMessage("Update failed");
          }
          setShowToast(true);
        });
    };
  const handleCoverChange = (e) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewCover(reader.result); // Set the image URL to display the preview
      };
      reader.readAsDataURL(file); // Read the image as a data URL
      handleBannerUpload(file);
    }
  };
  const handleImageClick = () => {
    console.log("image click");
    document.getElementById("profile-input").click(); // Programmatically click the hidden input
  };
  const handleBannerClick = () => {
    console.log("banner click");
    document.getElementById("cover-input").click(); // Programmatically click the hidden input
  };
  const handleProfilePicsUpload = (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    updateProfilePic(formData)
      .unwrap()
      .then((payload) => {
        const { data, message } = payload;
        dispatch(setUpdatedInfo({ updatedInfo: data }));
        toaster.create({ title: "Profile Updated", description: message, type: "success", duration: 4000, closable: true, });
      })
      .catch((err) => {
        const { data, message } = err
        console.log(err);
        toaster.create({
          title: "Profile Error",
          description: message, type: "error",
          duration: 3000, closable: true,
        });

      });
  };
  const handleBannerUpload = (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    updateBanner(formData)
      .unwrap()
      .then((payload) => {
        const { data, message } = payload;
        dispatch(setUpdatedInfo({ updatedInfo: data }));
        toaster.create({ title: "Profile Updated", description: message, type: "success", duration: 9000, closable: true, });
        console.log(data, "successbanner");
      })
      .catch((err) => {
        toaster.create({ title: "Error", description: err?.message, type: "Error", duration: 9000, closable: true, });
      });
  };

  const handleError = (error) => {
    console.log(error, "err");
  };

  const handleProfileUpdate = (data: any) => {

    if (isValid) {
      updateProfile(data)
        .unwrap()
        .then((payload) => {
          const { data } = payload;
          dispatch(setUpdatedInfo({ updatedInfo: data }));
          toaster.create({ title: "Profile Updated", description: data?.message, type: "success", duration: 9000, closable: true, });
          // console.log(data, "buttonclicked", "sucesspicture");
          onOpenChange();
        })
        .catch((err) => {
          const { data, message } = err;
          //  const { data, message } = err;
          console.log(err);
          toaster.create({
            title: "Profile Error",
            description: message,
            type: "error",
            duration: 3000,
            closable: true,
          });

          setErrorMessage(data.message);
          setShowToast(true);
        });
    } else {
      console.log("here");
    }
  };
  return (
    <Drawer.Root size={"md"} open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />
      <Drawer.Trigger></Drawer.Trigger>
      <Drawer.Positioner zIndex={"max"}>
        <Drawer.Content pt="6" px="3">
          <Drawer.Header>
            <Drawer.Title>
              <VStack
                spaceY={6}
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
                // px="6"
              >
                <HStack w="full" py={4} px="3" justifyContent={"space-between"}>
                  <Text
                    fontWeight={700}
                    fontSize={"2rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    // textAlign={"start"}
                  >
                    Edit Profile
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
              <Box
                borderRadius="lg"
                // background="red.900"
                boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
                width="100%"
                height={200}
                //   maxHeight="200px"
                position="relative"
              >
                <input
                  id="cover-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleCoverChange}
                />{" "}
                {user?.hasOwnProperty("profileBanner") ? (
                  <Image
                    // cursor={"pointer"}
                    // onClick={handleImageClick}
                    src={user?.profileBanner}
                    //   src={previewCover ? `${previewCover}` : `${coverphoto}`}
                    alt={"coverPhotoAlt"}
                    width="100%"
                    h={200}
                    //   maxHeight="full"
                    objectFit="cover"
                    borderRadius="12px"
                  />
                ) : (
                  <Image
                    // cursor={"pointer"}
                    // onClick={handleImageClick}
                    src={previewCover}
                    //   src={previewCover ? `${previewCover}` : `${coverphoto}`}
                    alt={"coverPhotoAlt"}
                    width="100%"
                    h={200}
                    //   maxHeight="full"
                    objectFit="cover"
                    borderRadius="12px"
                  />
                  // <Avatar
                  //   // cursor={"pointer"}
                  //   // onClick={handleImageClick}
                  //   // src={user?.profilePics}
                  //   src={previewCover ? `${previewCover}` : user?.profileBanner}
                  //   name={user?.fullName}
                  //   width="100%"
                  //   h={200}
                  //   //   maxHeight="full"
                  //   objectFit="cover"
                  //   borderRadius="12px"
                  // />
                )}
                <Box
                  pos={"absolute"}
                  top={"50%"}
                  left={"50%"}
                  transform="translate(-50%, -50%)"
                  // zIndex={50}
                >
                  {bannerLoading ? (
                    <Spinner color={"text_primary"} />
                  ) : (
                    <Image
                      cursor={"pointer"}
                      onClick={handleBannerClick}
                      w={12}
                      h={12}
                      src={camera}
                      alt={"display-image"}
                    />
                  )}
                </Box>
                {/* Profile Photo */}
                <Box
                  position="absolute"
                  bottom={-10}
                  left={4}
                  // bg='red.500'
                  transform="translateY(0%)"
                >
                  <Box
                    width={["100px", "120px"]}
                    height={["100px", "120px"]}
                    borderRadius="full"
                    overflow="hidden"
                  >
                    <input
                      id="profile-input"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt={"profilePhotoAlt"}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                    ) : (
                      <Avatar.Root minW={"100%"} minH={"100%"}>
                        <Avatar.Fallback name={user?.fullName} />
                        <Avatar.Image src={user?.profilePics} />
                      </Avatar.Root>
                    )}
                  </Box>
                  <Box
                    pos={"absolute"}
                    top={"50%"}
                    left={"50%"}
                    transform="translate(-50%, -50%)"
                    // zIndex={50}
                  >
                    {picLoading ? (
                      <Spinner color="white" />
                    ) : (
                      <Image
                        cursor={"pointer"}
                        onClick={handleImageClick}
                        w={12}
                        h={12}
                        src={camera}
                        alt={"display-image"}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              {showToast && (
                <Toast
                  message={errorMessage}
                  icon={BiSolidError}
                  type="error"
                  close={() => setShowToast(false)}
                />
              )}
              <Controller
                name="Title"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label="Title "
                    placeholder="Input Title"
                    id="Title"
                    required={false}
                    name="Title"
                    value={value}
                    size="md"
                    onChange={onChange}
                    //   error={{}}
                    hasRightIcon={true}
                    type={"text"}
                    rightIcon={
                      <Icon mr={"4"}>
                        <Image src="/icons/UserIcon.svg" alt="mail-icon" />
                      </Icon>
                    }
                  />
                )}
              />
              <Controller
                name="fullName"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label="Full Name "
                    placeholder="Input Full Name"
                    id="fullName"
                    required={true}
                    name="Full Name"
                    value={value}
                    size="md"
                    onChange={onChange}
                    //   error={{}}
                    hasRightIcon={true}
                    type={"text"}
                    rightIcon={
                      <Icon mr={"4"}>
                        <Image src="/icons/UserIcon.svg" alt="mail-icon" />
                      </Icon>
                    }
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label="Email Address "
                    placeholder="Input Email Address"
                    id="email"
                    required={true}
                    name="email"
                    value={value}
                    size="md"
                    onChange={onChange}
                    //   error={{}}
                    hasRightIcon={true}
                    type={"text"}
                    rightIcon={
                      <Icon mr={"4"}>
                        <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                      </Icon>
                    }
                  />
                )}
              />
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label="Date of Birth "
                    placeholder=""
                    id="dob"
                    required={true}
                    name="dob"
                    value={
                      value ? new Date(value).toISOString().split("T")[0] : ""
                    }
                    size="md"
                    onChange={onChange}
                    //   error={{}}
                    hasRightIcon={false}
                    type={"date"}
                    rightIcon={
                      <Icon mr={"4"}>
                        <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                      </Icon>
                    }
                  />
                )}
              />
              <Controller
                name="occupation"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label="Occupation "
                    placeholder="Enter your occupation"
                    id="work"
                    required={true}
                    name="work"
                    value={value}
                    size="md"
                    onChange={onChange}
                    //   error={{}}
                    hasRightIcon={true}
                    type={"text"}
                  />
                )}
              />

              <Controller
                name="location"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label="location  "
                    placeholder="Lagos, Nigeria "
                    id="location"
                    required={true}
                    name="location"
                    value={value}
                    size="md"
                    onChange={onChange}
                    //   error={{}}
                    hasRightIcon={true}
                    type={"text"}
                    rightIcon={
                      <Icon mr={"4"}>
                        <Image src="/icons/Location.svg" alt="location-icon" />
                      </Icon>
                    }
                  />
                )}
              />
              <Controller
                name="bio"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Textarea
                    borderWidth={1}
                    borderColor={"gray.100"}
                    px="3"
                    color="text_primary"
                    rows={5}
                    value={value}
                    onChange={onChange}
                    resize={"none"}
                    placeholder="Tell us about you."
                  />
                )}
              />
              <Box w="full" spaceY={4}>
                <FileUploader handleChange={(file) => setResume(file)} />
                <VideoUploader handleChange={(file) => setVideo(file)} />
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

                    onClick={onOpenChange}
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
                    rounded={"6px"}
                    onClick={handleSubmit(handleProfileUpdate,  addDetails)}
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

export default EditConsultDrawer;
