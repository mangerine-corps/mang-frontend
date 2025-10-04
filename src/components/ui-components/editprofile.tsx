"use client";;
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  HStack,
  Image,
  Text,
  Textarea,
  VStack,
  Field,
  Drawer,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";

import { useDispatch } from "react-redux";

import { Controller, useForm } from "react-hook-form";


import DatePicker from "react-datepicker";


// import Toast from "../Error";
import { BiSolidError } from "react-icons/bi";
import { setUpdatedInfo } from "mangarine/state/reducers/auth.reducer";
import { isEmpty } from "es-toolkit/compat";
import { useAuth } from "mangarine/state/hooks/user.hook";
import {
  useUpdateProfileBannerMutation,
  useUpdateProfileInfoMutation,
  useUpdateProfilePictureMutation,
} from "mangarine/state/services/profile.service";
import Toast from "./Error";
import { FaTimes } from "react-icons/fa";


const camera = "/icons/whitCamera.svg";

const EditProfileModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [updateProfilePic] = useUpdateProfilePictureMutation();
  const [updateBanner] = useUpdateProfileBannerMutation();
  const [updateProfile] = useUpdateProfileInfoMutation();
//   const toast = useToast();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [previewCover, setPreviewCover] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    // resolver: yupResolver(onboardingSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      occupation: user?.occupation ?? "",
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
        const { data, } = payload;
        dispatch(setUpdatedInfo({ updatedInfo: data }));
        // toast({
        //   title: "Profile Update",
        //   description: message,
        //   status: "success",
        //   duration: 4000,
        //   isClosable: true,
        // });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleBannerUpload = (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    updateBanner(formData)
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        dispatch(setUpdatedInfo({ updatedInfo: data }));
        console.log(data,"profiledata")
    //     toast({
    //       title: "Profile Update",
    //       description: message,
    //       status: "success",
    //       duration: 4000,
    //       isClosable: true,
    //     });
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const handleProfileUpdate = (data: any) => {
    if (isValid) {
      updateProfile(data)
        .unwrap()
        .then((payload) => {
          const { data } = payload;
          dispatch(setUpdatedInfo({ updatedInfo: data }));
        //   toast({
        //     title: "Profile Update",
        //     description: message,
        //     status: "success",
        //     duration: 4000,
        //     isClosable: true,
        //   });
          onOpenChange();
        })
        .catch((err) => {
          const { data } = err;
          setErrorMessage(data.message);
          setShowToast(true);
        });
    } else {
      console.log("here");
    }
  };
  return (
   
    <Drawer.Root open={open} onOpenChange={onOpenChange} size="sm">
      <Drawer.Backdrop />

      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header></Drawer.Header>
          <Drawer.Body px="2" py="8" bg="bg_box">
            <VStack
              spaceY={6}
              w="full"
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
            >
              <HStack w="full" py={4} justifyContent={"space-between"}>
                <Text
                  fontWeight={700}
                  fontSize={"2.5rem"}
                  fontFamily={"Outfit"}
                  color={"black"}
                  textAlign={"start"}
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
                    {/* <Image
                        cursor={"pointer"}
                        onClick={onOpenChange}
                        w={4}
                        h={4}
                        // src={close}
                        alt={"close-image"}
                      /> */}
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

              <Box
                borderRadius="lg"
                background="red.900"
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
                {previewCover ? (
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
                ) : (
                  <AvatarGroup>
                    <Avatar.Root>
                      <Avatar.Fallback />
                      <Avatar.Image
                        src={
                          previewCover ? `${previewCover}` : user?.profileBanner
                        }
                        //   name={user?.fullName}
                        width="100%"
                        h={200}
                        //   maxHeight="full"
                        objectFit="cover"
                        borderRadius="12px"
                        cursor={"pointer"}
                        onClick={handleImageClick}
                      />
                    </Avatar.Root>
                  </AvatarGroup>
                  // <Avatar
                  //   cursor={"pointer"}
                  //   onClick={handleImageClick}
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
                  <Image
                    cursor={"pointer"}
                    onClick={handleBannerClick}
                    w={12}
                    h={12}
                    src={camera}
                    alt={"display-image"}
                  />
                </Box>
                {/* Profile Photo */}
                <Box
                  position="absolute"
                  top="65%"
                  left={4}
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
                      // <Avatar
                      //   src={user?.profilePics}
                      //   //   src={previewCover ? `${previewCover}` : `${coverphoto}`}
                      //   name={user?.fullName}
                      //   width="100%"
                      //   height="100%"
                      //   objectFit="cover"
                      // />
                      <AvatarGroup>
                        <Avatar.Root>
                          <Avatar.Fallback />
                          <Avatar.Image
                            src={user?.profilePics}
                            //   name={user?.fullName}
                            width="100%"
                            h={200}
                            //   maxHeight="full"
                            objectFit="cover"
                            borderRadius="12px"
                            cursor={"pointer"}
                            onClick={handleImageClick}
                          />
                        </Avatar.Root>
                      </AvatarGroup>
                    )}
                  </Box>
                  <Box
                    pos={"absolute"}
                    top={"50%"}
                    left={"50%"}
                    transform="translate(-50%, -50%)"
                    // zIndex={50}
                  >
                    <Image
                      cursor={"pointer"}
                      onClick={handleImageClick}
                      w={12}
                      h={12}
                      src={camera}
                      alt={"display-image"}
                    />
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
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, value } }) => (
                  <Field.Root mt={10} id="email">
                    <Field.Label
                      color="#999"
                      fontFamily="Outfit"
                      fontSize="12px"
                      fontStyle="normal"
                      fontWeight="400"
                    >
                      Full Name
                    </Field.Label>

                    <Input
                      onChange={(v: any) => onChange(v)}
                      placeholder="Input full name here"
                      // errors={{}}
                      // validator={undefined}
                      name="email"
                      type="email"
                      value={value}
                      borderWidth={1}
                      borderColor={"grey.200"}
                      px="3"
                      // hasRightIcon={false}
                      // hasLeftIcon={false}
                      width={"full"}
                    />
                  </Field.Root>
                )}
                name="fullName"
              />
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, value } }) => (
                  <Field.Root id="email">
                    <Field.Label
                      color="#999"
                      fontFamily="Outfit"
                      fontSize="12px"
                      fontStyle="normal"
                      fontWeight="400"
                    >
                      Occupation
                    </Field.Label>

                    <Input
                      value={value}
                      px="3"
                      onChange={(v: any) => onChange(v)}
                      placeholder="What do you do?"
                      // errors={{}}
                      // validator={undefined}
                      name="email"
                      type="email"
                      borderWidth={1}
                      borderColor={"grey.200"}
                      // hasRightIcon={false}
                      // hasLeftIcon={false}
                      width={"full"}
                    />
                  </Field.Root>
                )}
                name="occupation"
              />
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, value } }) => (
                  <Field.Root id="email">
                    <Field.Label
                      color="#999"
                      fontFamily="Outfit"
                      fontSize="12px"
                      fontStyle="normal"
                      fontWeight="400"
                    >
                      Location
                    </Field.Label>

                    <Input
                      value={value}
                      px="3"
                      onChange={(v: any) => onChange(v)}
                      placeholder="What do you do?"
                      borderWidth={1}
                      borderColor={"grey.200"}
                      // errors={{}}
                      // validator={undefined}
                      name="email"
                      type="email"
                      // hasRightIcon={false}
                      // hasLeftIcon={false}
                      width={"full"}
                    />
                  </Field.Root>
                )}
                name="location"
              />
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, value } }) => (
                  <Box
                    id="birthdate"
                    flex={1}
                    w="full"
                    flexDir={{ base: "column", md: "row" }}
                    mb={{ base: "3", md: "0" }}
                  >
                    <Field.Root w="full">
                      <Field.Label htmlFor="birthdate">
                        Date of Birth
                      </Field.Label>
                      <DatePicker
                        w="full"
                        selected={value}
                        // @ts-expect-error will check
                        value={value}
                        onChange={onChange}
                        placeholderText="mm/dd/yyyy"
                        dateFormat="MM/dd/yyyy"
                        className="custom-datepicker"
                        maxDate={new Date()}
                      />
                    </Field.Root>
                  </Box>
                )}
                name="dateOfBirth"
              />
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, value } }) => (
                  <Field.Root id="email">
                    <Field.Label
                      color="#999"
                      fontFamily="Outfit"
                      fontSize="12px"
                      fontStyle="normal"
                      fontWeight="400"
                    >
                      Bio
                    </Field.Label>

                    <Textarea
                      borderWidth={1}
                      borderColor={"grey.200"}
                      rows={5}
                      value={value}
                      px="3"
                      onChange={onChange}
                      resize={"none"}
                      placeholder="Tell us about you."
                    />
                    {/* {errors.email && (
              <Text color="red.500" fontSize="sm">
                {errors.email}
              </Text>
            )} */}
                  </Field.Root>
                )}
                name="bio"
              />

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
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default EditProfileModal;
