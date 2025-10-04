import { Box, HStack, Image, Input, Progress, Stack, Text, VStack } from "@chakra-ui/react";
import GuestLayout from "mangarine/layouts/GuestLayout";
import { useRef, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import CustomButton from "mangarine/components/customcomponents/button";
import { outfit } from "mangarine/pages/_app";
import { useRouter } from "next/router";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useUpdatePicsMutation } from "mangarine/state/services/auth.service";
import { BiSolidError } from "react-icons/bi";
import Toast from "mangarine/components/ui-components/Error";
import { isEmpty } from "es-toolkit/compat";
import { useDispatch } from "react-redux";
import { setPreAuth } from "mangarine/state/reducers/auth.reducer";


const SUPPORTED_FORMATS = ["image/png", "image/jpg", "image/jpeg"];

const schema = yup
  .object({
    file: yup
      .mixed()
      .required("A file is required")
      .test(
        "format",
        "Please upload only .png/.jpg/.jpeg formats",
        (value: any) =>
          !value || (value && SUPPORTED_FORMATS.includes(value.type))
      ),
  })
  .required();
// interface UploadPicturePageProps {
//   userName: string;
//   userLocation: string;
// }
const OnboardingThree = () => {

  const [imageSrc, setImageSrc] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const { preAuth } = useAuth();
  const { user } = preAuth;
  const [selectedFile, setSelectedFile] = useState<any>({})
  const dispatch = useDispatch()
  // const onSubmit = (data: any) => console.log(data);
  const [addProfile, { isLoading }] = useUpdatePicsMutation();
  const {

    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      file: "",
    },
  });
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); // Set the preview image
      };
      reader.readAsDataURL(file);
    }
  };
  const router = useRouter()

  const triggerFileSelect = () => {
    fileInputRef?.current?.click(); // Trigger file selection
    // console.log(imageSrc)
  };
  const submitProps = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    addProfile(formData)
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        const { userType } = preAuth
        console.log(userType);
        dispatch(setPreAuth({ info: { ...preAuth, user: data } }))
          router.replace("/auth/success");
      })
      .catch((error) => {
        const { data } = error;
        if (!isEmpty(data) && data.hasOwnProperty("message")) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Registration failed");
        }
        setShowToast(true);
      });
  };

  return (
    <GuestLayout>
      <VStack
        className={outfit.className}
        justifyContent={"center"}
        w="full"
        flex={1}
      >
      
        {/* <ColorModeButton /> */}
        <VStack w={{ base: "full", md: "4/6" }} spaceY={4}>
          <HStack
            w="full"
            alignItems={"center"}
            justifyContent={"flex-end"}
            as={"button"}
            onClick={() => router.replace("/auth/success")}
          >
            <Text
              pr="2"
              cursor="pointer"
              color="grey.500"
              fontWeight={"400"}
              fontSize={"1rem"}
              lineHeight={"2rem"}
            >
              Skip
            </Text>
            <Text
              pr="2"
              cursor="pointer"
              color="grey.500"
              fontWeight={"400"}
              fontSize={"1rem"}
              lineHeight={"2rem"}
            >
              <Image cursor="pointer" src="/icons/right.svg" alt="back-icon" />
            </Text>
          </HStack>
          <Progress.Root defaultValue={75} w="full">
            <HStack gap="5">
              <Progress.Track bg="mainBlack" rounded={"md"} flex="1">
                <Progress.Range />
              </Progress.Track>
              <Progress.ValueText color="text_primary">75%</Progress.ValueText>
            </HStack>
          </Progress.Root>
          <VStack w="full" alignItems={"flex-start"}>
            {showToast && (
              <Toast
                message={errorMessage}
                icon={BiSolidError}
                type="error"
                close={() => setShowToast(false)}
              />
            )}
            <Text
              color="text_primary"
              fontWeight={"600"}
              fontSize={"1.5rem"}
              lineHeight={"2rem"}
            >
              Let’s get to know you
            </Text>
            <Text
              color="grey.500"
              fontWeight={"400"}
              fontSize={"1rem"}
              lineHeight={"2rem"}
            >
              Upload a profile picture
            </Text>
            <Box
              w="100px"
              h="100px"
              pos="relative"
              rounded={"full"}
              bg="#E7E8ED"
            >
              {imageSrc ? (
                <Image
                  alt="file trigger"
                  pos={"absolute"}
                  right={1}
                  bottom={4}
                  src="/icons/redMail.svg"
                  cursor="pointer"
                  onClick={triggerFileSelect}
                ></Image>
              ) : (
                <Image
                  alt="select trigger"
                  pos={"absolute"}
                  right={1}
                  bottom={4}
                  src="/icons/filePlus.svg"
                  cursor="pointer"
                  onClick={triggerFileSelect}
                ></Image>
              )}
              <Box
                width="100px"
                rounded="full"
                height="100px"
                bg="gray.200"
                overflow="hidden"
              >
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt="Selected Image"
                    width="100%"
                    height="100%"
                    objectFit="cover"
                    rounded="full"
                  />
                ) : (
                  ""
                )}

                {/* Hidden File Input */}
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  display="none"
                  onChange={handleFileChange}
                />
              </Box>

              {/* Custom Button */}
              {/* <Button as="label" colorScheme="blue" cursor="pointer">
              Upload File
            </Button> */}
            </Box>
            <Text
              color={"text_primary"}
              fontWeight={"600"}
              fontSize={"1.5rem"}
              lineHeight={"36px"}
            >
              {user?.fullName ?? ""}
            </Text>
            <HStack>
              <Image alt="location logo" src="/icons/Location.svg" />
              <Text
                color={"grey.500"}
                fontWeight={"500"}
                fontSize={"1rem"}
                lineHeight={"100%"}
              >
                {user?.location ?? ""}
              </Text>
            </HStack>
          </VStack>

          <CustomButton
            customStyle={{ w: "full" }}
            loading={isLoading}
            onClick={handleSubmit(submitProps, (error) => console.log(error))}
          >
            <Text
              color={"button_text"}
              fontWeight={"600"}
              fontSize={"1rem"}
              lineHeight={"100%"}
            >
              Next
            </Text>
          </CustomButton>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default OnboardingThree;
