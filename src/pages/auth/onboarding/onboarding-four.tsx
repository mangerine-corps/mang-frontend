import {Box, HStack, Image, Progress, Stack, Text, Textarea, VStack,} from "@chakra-ui/react";
import CustomInput from "mangarine/components/customcomponents/Input";
import {ColorModeButton} from "mangarine/components/ui/color-mode";
import GuestLayout from "mangarine/layouts/GuestLayout";
import {Controller, useForm} from "react-hook-form";

import CustomButton from "mangarine/components/customcomponents/button";
import {outfit} from "mangarine/pages/_app";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";

import {isEmpty} from "es-toolkit/compat";
import FileUploader from "mangarine/components/customcomponents/fileupload";
import VideoUploader from "mangarine/components/customcomponents/videoUpload";
import {useRouter} from "next/router";
import {useState} from "react";
import {useUpdateDetailsMutation} from "mangarine/state/services/auth.service";
import Toast from "mangarine/components/ui-components/Error";
import {BiSolidError} from "react-icons/bi";

const onboardingSchema = Yup.object().shape({
  description: Yup.string().required("Value Statement is required"),
  title: Yup.string().required("description is required"),
});

const OnboardingFour = () => {
  const [resume, setResume] = useState<any>({})
  const [video, setVideo] = useState<any>({})
  const [addInfo, { isLoading: uploading }] = useUpdateDetailsMutation();
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(onboardingSchema),
    defaultValues: {
      description: "",
      title: "",
    },
  });
  const router = useRouter();
  const onSubmit = (data: any) => {
    console.log(data);
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("video", video);
    formData.append('title', data.title)
    formData.append('description', data.description)
    addInfo(formData)
      .unwrap()
      .then((payload) => {
        console.log(payload)
        // const { data } = payload;
        router.replace("/auth/success");
      })
      .catch((error) => {
        const { data } = error;
        console.log(data,"data")
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
        <ColorModeButton />
        <VStack w={{ base: "full", md: "4/6" }} spaceY={4}>
         
          <VStack w="full" alignItems={"flex-start"}>
            <Progress.Root defaultValue={100} w="full" my="4">
              <HStack gap="5">
                {/* <Progress.Label>Usage</Progress.Label> */}
                <Progress.Track bg="mainBlack" rounded={"md"} flex="1">
                  <Progress.Range />
                </Progress.Track>
                <Progress.ValueText color="text_primary">
                  100%
                </Progress.ValueText>
              </HStack>
            </Progress.Root>
            <Text
              color="text_primary"
              fontWeight={"600"}
              fontSize={"1.5rem"}
              lineHeight={"2rem"}
            >
              Sign Up
            </Text>
            <Text
              color="grey.500"
              fontWeight={"400"}
              fontSize={"1rem"}
              lineHeight={"2rem"}
            >
              Finish your registration.
            </Text>
          </VStack>
          {showToast && (
            <Toast
              message={errorMessage}
              icon={BiSolidError}
              type="error"
              close={() => setShowToast(false)}
            />
          )}
          <Controller
            name="title"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="What best describe your current title "
                placeholder="Describe your current title"
                id="title"
                required={true}
                name="Full Name"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.title}
                hasRightIcon={true}
                type={"text"}
              />
            )}
          />
          <Box w="full">
            <HStack>
              <Text
                color="grey.500"
                fontWeight={"400"}
                fontSize={"0.75rem"}
                lineHeight={"2rem"}
              >
                Enter a value statement
              </Text>
              <Text
                color="red.500"
                fontWeight={"400"}
                fontSize={"1rem"}
                lineHeight={"2rem"}
              >
                *
              </Text>
            </HStack>
            <Controller
              name="description"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  borderColor={
                    !isEmpty(errors.description)
                      ? "error.100"
                      : !isEmpty(value)
                        ? "text_primary"
                        : "input_border"
                  }
                  px="4"
                  py="2"
                  onChange={onChange}
                  value={value}
                  variant="outline"
                  color="text_primary"
                  _placeholder={{ color: "grey.100" }}
                  placeholder="Enter your value statement"
                />
              )}
            />
          </Box>

          <Box w="full" spaceY={4}>
            <FileUploader handleChange={(file) => setResume(file)} />
            <VideoUploader handleChange={(file) => setVideo(file)} />
          </Box>

          <CustomButton
            customStyle={{ w: "full" }}
            onClick={handleSubmit(onSubmit)}
            loading={uploading}
          >
            <Text
              color={"button_text"}
              fontWeight={"600"}
              fontSize={"1rem"}
              lineHeight={"100%"}
            >
              Continue
            </Text>
          </CustomButton>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default OnboardingFour;
