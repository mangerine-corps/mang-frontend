import {
  Box,
  HStack,
  Icon,
  Image,
  Link,
  Progress,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import CustomInput from "mangarine/components/customcomponents/Input";
import GuestLayout from "mangarine/layouts/GuestLayout";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import CustomButton from "mangarine/components/customcomponents/button";
import { outfit } from "mangarine/pages/_app";

import CustomSelect from "mangarine/components/customcomponents/select";
// import { useRouter } from "next/router";
import { SelectOptions } from "mangarine/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import {
  useCreateAccountMutation,
  useGetInterestsMutation,
  useGetUserTypeMutation,
} from "mangarine/state/services/auth.service";
import { isEmpty } from "es-toolkit/compat";
import { dataTransformer } from "mangarine/utils/constants";
import { useDispatch } from "react-redux";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { setPreAuth } from "mangarine/state/reducers/auth.reducer";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import Toast from "mangarine/components/ui-components/Error";
import { BiSolidError } from "react-icons/bi";
import AsyncMultiSelect from "mangarine/components/AsyncMultiSelect";
import { Tooltip } from "mangarine/components/ui/tooltip";
import { IoMdInformationCircleOutline } from "react-icons/io";
const signinSchema = Yup.object().shape({
  businessName: Yup.string().notRequired(),
  interests: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string(),
        value: Yup.string(),
        id: Yup.string(),
      })
    )
    .min(1, "Area of interest is required"),
  userType: Yup.array().of(Yup.string()).min(1, "who you are is required"),
  location: Yup.string().required("location is required"),
});

const OnboardingTwo = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signinSchema),
    defaultValues: {
      interests: [],
      userType: [],
      businessName: "",
      location: "",
    },
  });
  const [getUserTypes] = useGetUserTypeMutation({});
  const { preAuth } = useAuth();
  const [getInterest] = useGetInterestsMutation({});
  const router = useRouter();
  const [userTypes, setUserTypes] = useState<SelectOptions[]>([]);
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [register, { isLoading: registering }] = useCreateAccountMutation();
  const [interestOptions, setInterestOptions] = useState<any[]>([]);

  useEffect(() => {
    getUserTypes({})
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        const transformed = dataTransformer(data);
        setUserTypes(transformed);
      });
  }, [getUserTypes]);
  useEffect(() => {
    getInterest({})
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        const transformed = dataTransformer(data);
        setInterestOptions(transformed);
      });
  }, [getInterest]);
  const createAccount = (data: any) => {
    const { fullname, ...rest } = preAuth;
    // Try to retrieve a previously-registered push token (e.g., set elsewhere in the app)
    const storedFcmToken = typeof window !== 'undefined' ? (localStorage.getItem('fcmToken') || '') : '';
    const formData = {
      fullName: fullname ?? preAuth.fullName,
      ...data,
      interests: data.interests.map((item: any) => item.id),
      ...rest,
      // Attach fcmToken if present so backend can persist it
      ...(storedFcmToken ? { fcmToken: storedFcmToken } : {}),
    };
    const userType = userTypes.find((item) => item.value === data.userType[0]);
    // setSelectedType(userType);
    register(formData)
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        dispatch(setPreAuth({ info: { ...data, userType: userType } }));
        router.push("./onboarding-three");
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
          <VStack w="full" alignItems={"flex-start"}>
            <HStack as={"button"} onClick={() => router.back()}>
              <Image cursor="pointer" src="/icons/back.svg" alt="back-icon" />
              <Text
                pl="2"
                cursor="pointer"
                color="grey.500"
                fontWeight={"400"}
                fontSize={"1rem"}
                lineHeight={"2rem"}
              >
                Back
              </Text>
            </HStack>
            <Progress.Root defaultValue={50} w="full">
              <HStack gap="5">
                <Progress.Track bg="mainBlack" rounded={"md"} flex="1">
                  <Progress.Range />
                </Progress.Track>
                <Progress.ValueText color="text_primary">
                  50%
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
          <Box w="full">
            {showToast && (
              <Toast
                message={errorMessage}
                icon={BiSolidError}
                type="error"
                close={() => setShowToast(false)}
              />
            )}
          </Box>
          <Controller
            name="businessName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Business Name (if any)"
                placeholder="Input Business Name"
                id="businessName"
                required={false}
                name="Full Name"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.businessName}
                hasRightIcon={true}
                type={"text"}
                rightIcon={
                  <Icon mr={"4"}>
                    <Image src="/icons/UserIcon.svg" alt="business-icon" />
                  </Icon>
                }
              />
            )}
          />
          <Controller
            name="interests"
            control={control}
            render={({ field: { onChange, value, onBlur } }) => (
              <Box w="full">
                <AsyncMultiSelect
                  options={interestOptions}
                  fontSize="14px"
                  size="sm"
                  error={errors.interests}
                  label={
                    <HStack pb={"2"} alignItems={"center"}>
                      <Tooltip
                        showArrow
                        content="the tooltip information goes here"
                      >
                        <IoMdInformationCircleOutline />
                      </Tooltip>
                      <HStack>
                        <Text
                          color={"text_primary"}
                          fontWeight={"400"}
                          fontSize={"0.75rem"}
                        >
                          Area of Interest
                        </Text>
                        <Text as={"span"} color={"red.400"} ml={1}>
                          *
                        </Text>
                      </HStack>
                    </HStack>
                  }
                  name={"interest"}
                  isSearchable={true}
                  isMulti={true}
                  placeholder="Input your area of interest"
                  onBlur={onBlur}
                  value={value}
                  onChange={(value: any) => {
                    onChange(value);
                    onBlur();
                  }}
                />
              </Box>
            )}
          />
          <Controller
            name="userType"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomSelect
                id={"whoareyou"}
                placeholder="Select profession"
                name={"who are you"}
                size="md"
                options={userTypes}
                label="Who are you?"
                value={value}
                required={true}
                error={errors.userType}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="location"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Location"
                placeholder="Enter your full location"
                id="location"
                required={true}
                name="location"
                value={value}
                size="lg"
                onChange={onChange}
                error={errors.location}
                hasRightIcon={true}
                type={"text"}
                rightIcon={
                  <Icon mr={"4"}>
                    <FaMapMarkerAlt />
                  </Icon>
                }
              />
            )}
          />
          <CustomButton
            customStyle={{
              w: "full",
            }}
            loading={registering}
            onClick={handleSubmit(createAccount, (error) => console.log(error))}
          >
            <Text
              color={"button_text"}
              fontWeight={"600"}
              fontSize={"1rem"}
              lineHeight={"100%"}
            >
              Sign Up
            </Text>
          </CustomButton>
          <HStack w="full" justifyContent={"flex-start"}>
            <Text
              color={"text_primary"}
              fontWeight={"500"}
              fontSize={"1rem"}
              lineHeight={"100%"}
            >
              Already have and Account?{" "}
            </Text>

            <Link
              color="primary.500"
              fontWeight={"700"}
              fontSize={"0.875rem"}
              lineHeight={"100%"}
              href="/auth/login"
            >
              Login
            </Link>
          </HStack>

          {/* <HStack w="full">
            <Separator color={"grey.500"} size="md" flex="1" />
            <Text color={"grey.500"} flexShrink="0">
              OR
            </Text>
            <Separator color={"grey.500"} size="md" flex="1" />
          </HStack>

          <CustomButton
            _hover={{ bg: "transparent" }}
            borderWidth={1}
            borderColor="button_border"
            bg="main_background"
            w="full"
            onClick={() => {}}
          >
            <HStack>
              <Image src="/icons/google_logo_light.svg" />
              <Text
                color={"grey.500"}
                fontWeight={"500"}
                fontSize={"1rem"}
                lineHeight={"100%"}
              >
                Login with Google
              </Text>
            </HStack>
          </CustomButton>
          <CustomButton
            _hover={{ bg: "transparent" }}
            borderWidth={1}
            borderColor="button_border"
            bg="main_background"
            w="full"
            onClick={() => {}}
          >
            <HStack>
              <Image
                src={
                  colorMode === "dark"
                    ? "/icons/apple_logo_dark.svg"
                    : "/icons/apple_logo_light.svg"
                }
              />
              <Text
                color={"grey.500"}
                fontWeight={"500"}
                fontSize={"1rem"}
                lineHeight={"100%"}
              >
                Login with Apple
              </Text>
            </HStack>
          </CustomButton>
        */}
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default OnboardingTwo;
