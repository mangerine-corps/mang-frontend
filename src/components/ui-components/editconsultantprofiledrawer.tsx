"use client";;
import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  NativeSelect,
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
import { toaster } from "../ui/toaster";
import FileUploader from "../customcomponents/fileupload";
import VideoUploader from "../customcomponents/videoUpload";
import { useUpdateDetailsMutation } from "mangarine/state/services/auth.service";
import TopRightDrawer from "../ui/top-right-drawer";
const profileSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  title: Yup.string().optional(),
  email: Yup.string().required("Email is required").email("Enter a valid email address"),
  location: Yup.string().required("Location is required"),
  occupation: Yup.string().required("Occupation is required"),
  dateOfBirth: Yup.date().required("Date of birth is required"),
  bio: Yup.string().optional(),
  timeZone: Yup.string().optional(),
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
  const [updateProfile, { isLoading: profileLoading }] = useUpdateProfileInfoMutation();
  //   const toast = useToast();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [previewCover, setPreviewCover] = useState(null);
  const [resume, setResume] = useState<any>({})
  const [video, setVideo] = useState<any>({})
  const [addInfo, { isLoading: uploading }] = useUpdateDetailsMutation();
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      occupation: user?.occupation ?? "",
      title: user?.title ?? user?.Title ?? "",
      location: user?.location ?? "",
      timeZone: user?.timeZone ?? "",
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

  const handleProfileUpdate = async (data: any) => {
    try {
      const profileResp = await updateProfile(data).unwrap();
      dispatch(setUpdatedInfo({ updatedInfo: profileResp.data }));

      const formData = new FormData();
      if (data.title) formData.append("title", data.title);
      if (data.bio) formData.append("description", data.bio);
      if (video instanceof File) formData.append("video", video);
      if (resume instanceof File) formData.append("resume", resume);
      await addInfo(formData).unwrap();

      toaster.create({ title: "Profile Updated", type: "success", duration: 4000, closable: true });
      onOpenChange();
    } catch (err: any) {
      const msg = err?.data?.message ?? err?.message ?? "Update failed";
      toaster.create({ title: "Error", description: Array.isArray(msg) ? msg.join(", ") : msg, type: "error", duration: 6000, closable: true });
    }
  };
  return (
    <TopRightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Profile"
      size="md"
      borderRadius="0"
      bodyProps={{
        px: { base: "4", lg: "6" },
        py: { base: "4", lg: "5" },
        pb: { base: "14", lg: "20" },
      }}
    >
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

              <Box h="10" w="full" /> {/* spacer for avatar overlap */}
              {showToast && (
                <Toast
                  message={errorMessage}
                  icon={BiSolidError}
                  type="error"
                  close={() => setShowToast(false)}
                />
              )}
              <Box w="full">
                <Text color="#999999" fontWeight="400" fontSize="0.75rem" mb={1}>
                  Title
                </Text>
                <Controller
                  name="title"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <NativeSelect.Root size="md" w="full">
                      <NativeSelect.Field
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        borderWidth={1}
                        borderColor="gray.100"
                        color="text_primary"
                        px={3}
                      >
                        <option value="">Select title</option>
                        <optgroup label="Honorifics">
                          <option value="Mr.">Mr.</option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Dr.">Dr.</option>
                          <option value="Prof.">Prof.</option>
                          <option value="Engr.">Engr.</option>
                          <option value="Barr.">Barr.</option>
                          <option value="Chief">Chief</option>
                          <option value="Rev.">Rev.</option>
                        </optgroup>
                        <optgroup label="Professional">
                          <option value="Consultant">Consultant</option>
                          <option value="Senior Consultant">Senior Consultant</option>
                          <option value="Lead Consultant">Lead Consultant</option>
                          <option value="Principal Consultant">Principal Consultant</option>
                          <option value="Director">Director</option>
                          <option value="Manager">Manager</option>
                          <option value="Analyst">Analyst</option>
                          <option value="Specialist">Specialist</option>
                          <option value="Advisor">Advisor</option>
                          <option value="Coach">Coach</option>
                          <option value="Mentor">Mentor</option>
                        </optgroup>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  )}
                />
              </Box>
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
                    value={(() => {
                      if (!value) return "";
                      const d = new Date(value);
                      return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
                    })()}
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
              <Box w="full">
                <Text
                  color="#999999"
                  fontWeight={"400"}
                  fontSize={"0.75rem"}
                  mb={1}
                >
                  Bio
                </Text>
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
              </Box>
              <Box w="full">
                <Text color="#999999" fontWeight="400" fontSize="0.75rem" mb={1}>
                  Time Zone
                </Text>
                <Controller
                  name="timeZone"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <NativeSelect.Root size="md" w="full">
                      <NativeSelect.Field
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        borderWidth={1}
                        borderColor="gray.100"
                        color="text_primary"
                        px={3}
                      >
                        <option value="">Select time zone</option>
                        <option value="Africa/Lagos">Africa/Lagos (WAT, UTC+1)</option>
                        <option value="Africa/Nairobi">Africa/Nairobi (EAT, UTC+3)</option>
                        <option value="Africa/Johannesburg">Africa/Johannesburg (SAST, UTC+2)</option>
                        <option value="Africa/Accra">Africa/Accra (GMT, UTC+0)</option>
                        <option value="Europe/London">Europe/London (GMT/BST)</option>
                        <option value="Europe/Paris">Europe/Paris (CET, UTC+1)</option>
                        <option value="America/New_York">America/New_York (EST, UTC-5)</option>
                        <option value="America/Chicago">America/Chicago (CST, UTC-6)</option>
                        <option value="America/Denver">America/Denver (MST, UTC-7)</option>
                        <option value="America/Los_Angeles">America/Los_Angeles (PST, UTC-8)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
                        <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                        <option value="Asia/Singapore">Asia/Singapore (SGT, UTC+8)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (JST, UTC+9)</option>
                        <option value="Australia/Sydney">Australia/Sydney (AEST, UTC+10)</option>
                        <option value="UTC">UTC (UTC+0)</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                  )}
                />
              </Box>

              <Box w="full" spaceY={4}>
                <FileUploader handleChange={(file) => setResume(file)} currentFile={user?.resume} />
                <VideoUploader handleChange={(file) => setVideo(file)} currentFile={user?.videoIntro} />
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
                    bg="#111D4A"
                    borderWidth={1}
                    color={"white"}
                    borderColor={"#111D4A"}
                    py={2}
                    w="45%"
                    loading={profileLoading || uploading}
                    px={4}
                    _hover={{
                      textDecor: "none",
                      bg: "#111D4A",
                    }}
                    rounded={"6px"}
                    onClick={handleSubmit(handleProfileUpdate)}
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

export default EditConsultDrawer;
