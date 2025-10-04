import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Text,
  VStack,
  Flex,
  Image,
  Icon,
  HStack,
  Stack,
  createToaster,

} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import CustomInput from "../customcomponents/Input";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import CustomButton from "../customcomponents/button";
import DeleteSecNum from "./modals/deletesecnum";
import {
  useAddSecondaryNumberMutation,
  useEditSecondaryNumberMutation,
  useUpdatePasswordMutation,
} from "mangarine/state/services/settings.service";
import { isEmpty } from "es-toolkit/compat";
import { toaster, Toaster } from "../ui/toaster";
import { useDispatch } from "react-redux";
import {
  setDisabled,
  setSecNum,
} from "mangarine/state/reducers/profile.reducer";
import { useProfile } from "mangarine/state/hooks/profile.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { allCountries } from "country-telephone-data";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Select } from "chakra-react-select";

const Schema = Yup.object({
  currentPassword: Yup.string()
    .required("Current Password is required")
    .min(8, "Password must be at least 8 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(
      8,
      "Password must be at least 8 characters long and include at least one uppercase letter (A - Z)"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
const SecondarySchema = Yup.object({
  secNumCountryCode: Yup.string().required("Country code is required"),

  secNum: Yup
    .string()
    .required("Phone number is required"),
    // .test("valid-phone", "Invalid phone number", function (value) {
    //   const { secNumCountryCode } = this.parent; // 👈 get the selected code from the same form
    //   if (!value || !secNumCountryCode) return false;

    //   const fullNumber = `${secNumCountryCode}${value}`;
    //   const phoneNumber = parsePhoneNumberFromString(fullNumber);

    //   return phoneNumber ? phoneNumber.isValid() : false;
    // }),

  confirmSecNum: Yup
    .string()
    .required("Confirm phone number is required")
    .oneOf([Yup.ref("secNum")], "Phone numbers must match"),
});

function AccountSetting() {
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { user } = useAuth();
  const [updatePassword, { data, error, isLoading }] =
    useUpdatePasswordMutation();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = () => {
    const acctdata = getValues();

    const formdata = {
      currentPassword: acctdata.currentPassword,
      newPassword: acctdata.password,
      confirmPassword: acctdata.confirmPassword,
    };
    updatePassword(formdata)
      .unwrap()
      .then((payload) => {
        console.log(payload, "payload");
        setShowPassword(false);
        toaster.create({
          title: "Success",
          type:"success",
          description: payload.message,
          closable:true,
          // placement: `${top-end}`,
        });
        // router.push("/auth/login");
      })
      .catch((error) => {
        console.log(error);
        const { data, message } = error;
         toaster.create({
           type: "error",
           title: "Failed",
           description:  message,
           closable: true,
         });
        if (!isEmpty(data) && data.hasOwnProperty("message")) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage(" failed");
        }
        setShowToast(true);
      });
  };
  console.log(allCountries, "user");
  return (
    <Flex
      direction="column"
      align="flex-start"
      justify="flex-start"
      minH="full"
      w="full"
      overflowY={{ base: "auto", md: "flex", lg: "flex" }}
      maxH={{ base: "full", md: "flex", lg: "flex" }}
    >
      <Box
        //w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
        h="full"
        borderRadius="lg"
        boxShadow="lg"
        bg="main_background"
        p={8}
        w="full"
        //px={6}
        //py={6}
        // marginLeft={40}
        // mt={2}
      >
        {/* Phone Section */}
        <Box>
          <Toaster />
          <Text
            font="outfit"
            fontSize={{ base: "1rem", md: "1.25rem", lg: "1.5rem" }}
            fontWeight="600"
            color="text_primary"
            lineHeight={{
              base: "20px",
              sm: "24px",
              md: "28px",
              lg: "32px",
              xl: "36px",
            }}
            mb={4}
          >
            Phone Number Management
          </Text>
          <Text
            font="outfit"
            fontSize={{ base: "1rem", md: "1.2rem", lg: "1.25rem" }}
            fontWeight="400"
            color="text_primary"
            lineHeight={{
              base: "20px",
              sm: "24px",
              md: "28px",
              lg: "32px",
              xl: "36px",
            }}
          >
            Primary Phone Number
          </Text>
          <Text color="gray.500" my={4}>
            {user?.mobileNumber}
          </Text>
        </Box>

        <Box w="full">
          <SecNum />
        </Box>
        {/* Change Password Section */}

        <Box mt={{ base: 4, md: 8, lg: "flex", xl: "flex" }}>
          <Text
            font="outfit"
            fontSize={{ base: "1rem", md: "1.2rem", lg: "1.25rem" }}
            fontWeight="600"
            color="text_primary"
            lineHeight={{
              base: "20px",
              sm: "24px",
              md: "28px",
              lg: "32px",
              xl: "36px",
            }}
          >
            Change Password
          </Text>
          <Text
            font="outfit"
            fontSize={{ base: "1rem", md: "1.2rem", lg: "1.25rem" }}
            fontWeight="200"
            color="text_primary"
            lineHeight={{
              base: "20px",
              sm: "24px",
              md: "28px",
              lg: "32px",
              xl: "36px",
            }}
            mb={4}
          >
            Update your password to ensure your account remains secured.
          </Text>

          <VStack w="full" pt="6">
            <Controller
              name="currentPassword"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Current Password"
                  placeholder="******"
                  id="password"
                  required={true}
                  name="currentPassword"
                  value={value}
                  size="md"
                  onChange={onChange}
                  error={errors.currentPassword}
                  hasRightIcon={false}
                  type={showPassword ? "text" : "password"}
                  rightIcon={
                    <Button
                      variant={"ghost"}
                      color={"#697586"}
                      bg="none"
                      p={0}
                      loading={isLoading}
                      borderWidth={0}
                      _hover={{ bg: "transparent" }}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? (
                        <Icon>
                          <Image src="/Icons/eye.svg" alt="password-open" />
                        </Icon>
                      ) : (
                        <Icon>
                          <Image src="/Icons/eye.svg" alt="password-close" />
                        </Icon>
                      )}
                    </Button>
                  }
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="New Password"
                  placeholder="***"
                  id="password"
                  required={true}
                  name="password"
                  value={value}
                  size="md"
                  onChange={onChange}
                  error={errors.password}
                  hasRightIcon={false}
                  type={showPassword ? "text" : "password"}
                  rightIcon={
                    <Button
                      variant={"ghost"}
                      color={"#697586"}
                      bg="none"
                      p={0}
                      borderWidth={0}
                      _hover={{ bg: "transparent" }}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? (
                        <Icon>
                          <Image src="/Icons/eye.svg" alt="password-open" />
                        </Icon>
                      ) : (
                        <Icon>
                          <Image src="/Icons/eye.svg" alt="password-close" />
                        </Icon>
                      )}
                    </Button>
                  }
                />
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Confirm Password"
                  placeholder="***"
                  id="password"
                  required={true}
                  name="password"
                  value={value}
                  size="md"
                  onChange={onChange}
                  error={errors.confirmPassword}
                  hasRightIcon={false}
                  type={showPassword ? "text" : "password"}
                  rightIcon={
                    <Button
                      variant={"ghost"}
                      color={"#697586"}
                      bg="none"
                      p={0}
                      borderWidth={0}
                      _hover={{ bg: "transparent" }}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? (
                        <Icon>
                          <Image src="/Icons/eye.svg" alt="password-open" />
                        </Icon>
                      ) : (
                        <Icon>
                          <Image src="/Icons/eye.svg" alt="password-close" />
                        </Icon>
                      )}
                    </Button>
                  }
                />
              )}
            />

            <CustomButton
              customStyle={{
                w: "full",
                py: { base: 3, md: 4, lg: "flex" },
                px: { base: 4, md: 6, lg: "flex" },
                fontSize: { base: "0.875rem", md: "1rem" },
              }}
              onClick={handleSubmit(onSubmit, (error) => console.log(error))}
            >
              <Text
                color={"button_text"}
                fontWeight={"600"}
                fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
                textAlign={"center"}
                // lineHeight={"100%"}
              >
                Save Changes
              </Text>
            </CustomButton>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}

export default AccountSetting;

const SecNum = () => {
  const [SecondaryPhoneNumber, setSecondaryPhoneNumber] =
    useState<boolean>(false);
  const [Delete, setDelete] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [addSecondaryNumber, { data, error, isLoading }] =
    useAddSecondaryNumberMutation();
  const [editSecondaryNumber] = useEditSecondaryNumberMutation();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { disable, sNumber } = useProfile();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SecondarySchema),
    defaultValues: {
      secNumCountryCode: "",
      secNum: "",
      confirmSecNum: "",
    },
  });
  useEffect(() => {
    console.log("secNumber");
  }, [sNumber]);

  const onSubmit = (data) => {
    const acctdata = getValues();
      console.log(acctdata, "data");
//  const fullNumber = `${data.secNumCountryCode}${data.secNum}`;
//  const confirmNumber = `${data.secNumCountryCode}${data.confirmSecNum}`;

//  const formdata = {
//    secondaryNumber: fullNumber,
//    confirmSecondaryNumber: confirmNumber,
//  };

    // addSecondaryNumber(formdata)
    //   .unwrap()
    //   .then((payload) => {
    //     const { data } = payload;
    //       toaster.create({
    //         type: "success",
    //         title: "Success",
    //         description: "Added secondary number successfully",
    //         closable: true,
    //       });
    //     console.log(data.secondaryNumber, "payload");

    //     dispatch(setSecNum({ secNum: data.secondaryNumber }));
    //     // router.push("/auth/login");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     const { data } = error;
    //       toaster.create({
    //         type: "error",
    //         title: "Failed",
    //         description: "Failed to add secondary number",
    //         closable: true,
    //       });
    //     if (!isEmpty(data) && data.hasOwnProperty("message")) {
    //       setErrorMessage(data.message);
    //     } else {
    //       setErrorMessage(" failed");
    //     }
    //     setShowToast(true);
    //   });
  };
  const getFlagEmoji = (countryCode) =>
    countryCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt())
      );
// const countries = allCountries.map((c) => ({
//   name: c.name,
//   iso2: c.iso2,
//   dialCode: `+${c.dialCode}`,
// }));
const countryOptions = allCountries.map((c) => ({
  label: `+${c.dialCode}`, // 🇳🇬 +234
  value: `+${c.dialCode}`, // ✅ store with + prefix
}));
  // const editClicked = () => {
  //   setSecondaryPhoneNumber(true);
  //   setValue("secNum", sNumber); // prefill with existing number
  //   setValue("confirmSecNum", sNumber); // prefill confirm with existing number
  // };
  const editClicked = () => {
    if (sNumber) {
      // split into country code + local part
      const match = sNumber.match(/^(\+\d+)(\d+)$/);
      if (match) {
        setValue("secNumCountryCode", match[1]);
        setValue("secNum", match[2]);
        setValue("confirmSecNum", match[2]);
      }
    }
    setSecondaryPhoneNumber(true);
  };
  const editNumber = () => {
    const fullNumber = `${data.secNumCountryCode}${data.secNum}`;
    const confirmNumber = `${data.secNumCountryCode}${data.confirmSecNum}`;
const formdata = {
  secondaryNumber: fullNumber,
  confirmSecondaryNumber: confirmNumber,
};
    editSecondaryNumber(formdata)
      .unwrap()
      .then((payload) => {
        console.log(payload, "payload");
        const { data } = payload;
        toaster.create({
          type: "success",
          title: "Success",
          description: "Updated secondary number successfully",
          closable: true,
        });
        dispatch(setSecNum({ secNum: data.secondaryNumber }));
        console.log(sNumber, "num");
        setSecondaryPhoneNumber(false);
        reset();
        // router.push("/auth/login");
      })
      .catch((error) => {
        console.log(error);
        const { data } = error;
        toaster.create({
          type: "error",
          title: "Failed",
          description: "Failed to add secondary number",
          closable: true,
        });
        if (!isEmpty(data) && data.hasOwnProperty("message")) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage(" failed");
        }
        setShowToast(true);
      });
  };

  return (
    <>
      <HStack w="full" justifyContent={"space-between"}>
        <VStack
          w="full"
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
        >
          <Text
            font="outfit"
            fontSize={{ base: "1rem", md: "1.2rem", lg: "1.25rem" }}
            fontWeight="400"
            color="text_primary"
            lineHeight={{
              base: "20px",
              sm: "24px",
              md: "28px",
              lg: "32px",
              xl: "36px",
            }}
          >
            Secondary Phone Number
          </Text>
          <Stack w="full">
            {!isEmpty(sNumber) ? (
              <HStack
                justifyContent={"space-between"}
                alignItems={"center"}
                w="full"
              >
                <Text
                  font="outfit"
                  fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
                  fontWeight="400"
                  color="grey.500"
                  lineHeight="30px"
                >
                  {sNumber}
                </Text>
                <HStack spaceX={"2"}>
                  <Stack
                    borderWidth="1px"
                    borderColor="grey.50"
                    rounded={"6px"}
                    py="2"
                    px="2"
                    alignItems={"center"}
                    justifyContent={"center"}
                    cursor="pointer"
                    onClick={() => {
                      editClicked();
                    }}
                    shadow={"xs"}
                  >
                    <Image boxSize="4" src={"/icons/edit.svg"} alt="Edit" />
                  </Stack>
                  <Stack
                    borderWidth="1px"
                    borderColor="grey.50"
                    rounded={"6px"}
                    py="2"
                    px="2"
                    alignItems={"center"}
                    justifyContent={"center"}
                    cursor="pointer"
                    shadow={"xs"}
                    onClick={() => {
                      setDelete(true);
                    }}
                  >
                    <Image
                      boxSize="4"
                      src={"/icons/delete2.svg"}
                      alt="Delete"
                    />
                  </Stack>
                  <DeleteSecNum
                    isOpen={Delete}
                    onOpenChange={() => setDelete(false)}
                  />
                </HStack>
              </HStack>
            ) : (
              <VStack
                w="full"
                p="0"
                m="0"
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
              >
                <Text color="gray.500">
                  No secondary phone number added. Consider adding one for extra
                  security.{" "}
                  <Text
                    color="blue.500"
                    onClick={() => {
                      setSecondaryPhoneNumber(true);
                    }}
                    cursor={"pointer"}
                  >
                    Add secondary number
                  </Text>
                </Text>
              </VStack>
            )}
          </Stack>
        </VStack>
      </HStack>
      {SecondaryPhoneNumber && (
        // <VStack w="full" pt="2">
        //   <Controller
        //     name="secNum"
        //     control={control}
        //     render={({ field: { onChange, value } }) => (
        //       <CustomInput
        //         label="Secondary Phonenumber"
        //         placeholder="Enter phone number"
        //         id="password"
        //         required={true}
        //         name="password"
        //         value={value}
        //         size="md"
        //         onChange={onChange}
        //         error={errors.secNum}
        //         hasRightIcon={false}
        //         // type={showPassword ? "text" : "password"}
        //       />
        //     )}
        //   />
        //   <Controller
        //     name="confirmSecNum"
        //     control={control}
        //     render={({ field: { onChange, value } }) => (
        //       <CustomInput
        //         label="Confirm Secondary Phonenumber"
        //         placeholder="********"
        //         id="password"
        //         required={true}
        //         name="password"
        //         value={value}
        //         size="md"
        //         onChange={onChange}
        //         error={errors.confirmSecNum}
        //         hasRightIcon={false}
        //         // type={showPassword ? "text" : "password"}
        //       />
        //     )}
        //   />
        //   {SecondaryPhoneNumber ? (
        //     <CustomButton
        //       customStyle={{
        //         w: "full",
        //       }}
        //       disabled={disable}
        //       onClick={() => {
        //         editNumber();
        //       }}
        //     >
        //       <Text
        //         color={"button_text"}
        //         fontWeight={"600"}
        //         fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
        //         lineHeight={"100%"}
        //       >
        //         Save Changes
        //       </Text>
        //     </CustomButton>
        //   ) : (
        //     <CustomButton
        //       customStyle={{
        //         w: "full",
        //       }}
        //       loading={isLoading}
        //       disabled={disable}
        //       onClick={handleSubmit(onSubmit, (error) => console.log(error))}
        //     >
        //       <Text
        //         color={"button_text"}
        //         fontWeight={"600"}
        //         fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
        //         lineHeight={"100%"}
        //       >
        //         Save Changes
        //       </Text>
        //     </CustomButton>
        //   )}
        // </VStack>
        <VStack w="full" pt="4">
          {/* Country + Number */}
          <HStack w="full">
            <Controller
              name="secNumCountryCode"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={countryOptions}
                  placeholder="Code"
                  chakraStyles={{
                    container: (base) => ({ ...base, w: "20%" }),
                  }}
                />
              )}
            />

            <Controller
              name="secNum"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="Enter phone number"
                  error={errors.secNum}
                />
              )}
            />
          </HStack>
          <HStack w="full">
            <Controller
              name="secNumCountryCode"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={countryOptions}
                  placeholder="Code"
                  chakraStyles={{
                    container: (base) => ({ ...base, w: "20%" }),
                  }}
                />
              )}
            />

            <Controller
              name="confirmSecNum"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  placeholder="Confirm phone number"
                  error={errors.confirmSecNum}
                />
              )}
            />
          </HStack>

          {/* Confirm */}

          {/* Save button switches depending on mode */}
          {sNumber ? (
            <CustomButton disabled={disable} onClick={handleSubmit(editNumber)}>
              Save Changes
            </CustomButton>
          ) : (
            <CustomButton
              disabled={disable}
              loading={isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </CustomButton>
          )}
        </VStack>
      )}
    </>
  );
};
