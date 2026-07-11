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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CustomInput from "../customcomponents/Input";
import PhoneInputWithCode from "../customcomponents/PhoneInputWithCode";
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
import { useDispatch } from "react-redux";
import {
  setDisabled,
  setSecNum,
} from "mangarine/state/reducers/profile.reducer";
import { useProfile } from "mangarine/state/hooks/profile.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { toaster } from "../ui/toaster";
import { parseStoredPhone } from "mangarine/lib/phone-codes";

const formatPhoneDisplay = (raw: string): string => {
  if (!raw) return "-";
  const parsed = parseStoredPhone(raw);
  if (parsed) return `${parsed.entry.flag} +${parsed.entry.dial} ${parsed.local}`;
  const digits = raw.replace(/\D/g, "");
  return digits ? `+${digits}` : raw;
};

const Schema = Yup.object({
  currentPassword: Yup.string()
    .required("Current Password is required")
    .min(8, "Password must be at least 8 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter (A-Z)"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});
const SecondarySchema = Yup.object({
  secNum: Yup.string().required("Phone number is required"),
  confirmSecNum: Yup.string()
    .required("Confirm phone number is required")
    .oneOf([Yup.ref("secNum")], "Phone numbers must match"),
});

function AccountSetting() {
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();
  const { contact } = useProfile();
  const [updatePassword, { data, error, isLoading }] =
    useUpdatePasswordMutation();

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Live validation values
  const newPw = watch("password") ?? "";
  const confirmPw = watch("confirmPassword") ?? "";
  const pwHasMinLength = newPw.length >= 8;
  const pwHasUppercase = /[A-Z]/.test(newPw);
  const pwValid = pwHasMinLength && pwHasUppercase;
  const pwTouched = newPw.length > 0;
  const confirmTouched = confirmPw.length > 0;
  const confirmPasses = confirmTouched && confirmPw === newPw;


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
        setShowPassword(false);
        toaster.create({ description: payload.message ?? "Password updated successfully", type: "success", closable: true });
      })
      .catch((error) => {
        console.log(error);
        const { data, message } = error;
        toaster.create({ description: (!isEmpty(data) && data?.message) ? data.message : (message ?? "Update failed"), type: "error", closable: true });
      });
  };
  return (
    <Flex
      direction="column"
      align="flex-start"
      justify="flex-start"
      w="full"
      flex={1}
    >
      <Box
        borderRadius="lg"
        boxShadow="lg"
        bg="bg_box"
        p={{ base: 4, md: 8 }}
        w="full"
        flex={1}
        //px={6}
        //py={6}
        // marginLeft={40}
        // mt={2}
      >
        {/* Phone Section */}
        <Box>
          <Text
            font="outfit"
            fontSize={{ base: "1rem", md: "1.5rem" }}
            fontWeight="600"
            color="text_primary"
            lineHeight="1.4"
            mb={4}
          >
            Phone Number Management
          </Text>
          <Text
            font="outfit"
            fontSize={{ base: "0.875rem", md: "1.1rem" }}
            fontWeight="400"
            color="text_primary"
            lineHeight="1.4"
          >
            Primary Phone Number
          </Text>
          <Text color="gray.500" my={4}>
            {formatPhoneDisplay(contact?.mobileNumber ?? user?.mobileNumber ?? "")}
          </Text>
        </Box>

        <Box w="full">
          <SecNum />
        </Box>
        {/* Change Password Section */}

        <Box mt={8}>
          <Text
            font="outfit"
            fontSize={{ base: "0.875rem", md: "1.1rem" }}
            fontWeight="600"
            color="text_primary"
            lineHeight="1.4"
          >
            Change Password
          </Text>
          <Text
            font="outfit"
            fontSize={{ base: "0.875rem", md: "1.1rem" }}
            fontWeight="200"
            color="text_primary"
            lineHeight="1.4"
            mb={4}
          >
            Update your password to ensure your account remains secured.
          </Text>

          <VStack w="full">
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
                  autoComplete="new-password"
                  value={value}
                  size="md"
                  onChange={onChange}
                  error={errors.currentPassword}
                  hasRightIcon={false}
                  type={showPassword ? "text" : "password"}
                  rightIcon={
                    <Button
                      variant={"ghost"}
                      color={"text_muted"}
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
                <Box w="full">
                  <CustomInput
                    label="New Password"
                    placeholder="***"
                    id="password"
                    required={true}
                    name="password"
                    autoComplete="new-password"
                    value={value}
                    size="md"
                    onChange={onChange}
                    hasRightIcon={false}
                    type={showPassword ? "text" : "password"}
                    inputStyle={{
                      borderColor: pwTouched
                        ? pwValid
                          ? "#30BC0D"
                          : "red.500"
                        : undefined,
                    }}
                    rightIcon={
                      <Button
                        variant={"ghost"}
                        color={"text_muted"}
                        bg="none"
                        p={0}
                        borderWidth={0}
                        _hover={{ bg: "transparent" }}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        <Icon>
                          <Image src="/Icons/eye.svg" alt="toggle password" />
                        </Icon>
                      </Button>
                    }
                  />
                  <Text fontSize="xs" fontFamily="Outfit" mt={1} color={pwTouched && !pwValid ? "red.500" : "gray.500"}>
                    {pwTouched && !pwValid
                      ? !pwHasMinLength
                        ? "Password must be at least 8 characters long and include at least one uppercase letter (A – Z)."
                        : "Password must include at least one uppercase letter (A – Z)."
                      : "Password must be at least 8 characters long and include at least one uppercase letter (A – Z)."}
                  </Text>
                </Box>
              )}
            />
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Box w="full">
                  <CustomInput
                    label="New Password"
                    placeholder="***"
                    id="confirmPassword"
                    required={true}
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={value}
                    size="md"
                    onChange={onChange}
                    hasRightIcon={false}
                    type={showPassword ? "text" : "password"}
                    inputStyle={{
                      borderColor: confirmTouched
                        ? confirmPasses
                          ? "#30BC0D"
                          : "red.500"
                        : undefined,
                    }}
                    rightIcon={
                      <Button
                        variant={"ghost"}
                        color={"text_muted"}
                        bg="none"
                        p={0}
                        borderWidth={0}
                        _hover={{ bg: "transparent" }}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        <Icon>
                          <Image src="/Icons/eye.svg" alt="toggle password" />
                        </Icon>
                      </Button>
                    }
                  />
                  <Text fontSize="xs" fontFamily="Outfit" mt={1} color={confirmTouched && !confirmPasses ? "red.500" : "gray.500"}>
                    {confirmTouched && !confirmPasses
                      ? "Passwords do not match."
                      : "Password must be at least 8 characters long and include at least one uppercase letter (A – Z)."}
                  </Text>
                </Box>
              )}
            />

            <CustomButton
              customStyle={{
                w: "full",
                py: { base: 3, md: 4, lg: 5 },
                px: { base: 4, md: 6, lg: 8 },
                fontSize: { base: "0.875rem", md: "1rem" },
              }}
              onClick={handleSubmit(onSubmit, (error) => console.log(error))}
            >
              <Text
                color={"button_text"}
                fontWeight={"600"}
                fontSize={{ base: "1rem", md: "1.1rem", lg: "1.15rem" }}
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
      secNum: "",
      confirmSecNum: "",
    },
  });
  useEffect(() => {
    console.log("secNumber");
  }, [sNumber]);

  const onSubmit = (data) => {
    const acctdata = getValues();
    const formdata = {
      secondaryNumber: acctdata.secNum,
      confirmSecondaryNumber: acctdata.confirmSecNum,
    };
    addSecondaryNumber(formdata)
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        toaster.create({ description: "Added secondary number successfully", type: "success", closable: true });
        dispatch(setSecNum({ secNum: data.secondaryNumber }));
        setSecondaryPhoneNumber(false);
        reset();
      })
      .catch((error) => {
        console.log(error);
        const { data } = error;
        toaster.create({ description: (!isEmpty(data) && data?.message) ? data.message : "Failed to add secondary number", type: "error", closable: true });
      });
  };
  // const editClicked = () => {
  //   setSecondaryPhoneNumber(true);
  //   setValue("secNum", sNumber); // prefill with existing number
  //   setValue("confirmSecNum", sNumber); // prefill confirm with existing number
  // };
  const editClicked = () => {
    if (sNumber) {
      const digits = sNumber.replace(/\D/g, "");
      setValue("secNum", digits);
      setValue("confirmSecNum", digits);
    }
    setSecondaryPhoneNumber(true);
  };
  const editNumber = () => {
    const acctdata = getValues();
    const formdata = {
      secondaryNumber: acctdata.secNum,
      confirmSecondaryNumber: acctdata.confirmSecNum,
    };
    editSecondaryNumber(formdata)
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        toaster.create({ description: "Updated secondary number successfully", type: "success", closable: true });
        dispatch(setSecNum({ secNum: data.secondaryNumber }));
        setSecondaryPhoneNumber(false);
        reset();
      })
      .catch((error) => {
        console.log(error);
        const { data } = error;
        toaster.create({ description: (!isEmpty(data) && data?.message) ? data.message : "Failed to update secondary number", type: "error", closable: true });
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
            fontSize={{ base: "0.875rem", md: "1.1rem" }}
            fontWeight="400"
            color="text_primary"
            lineHeight="1.4"
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
                  fontSize={{ base: "1rem", md: "1.1rem", lg: "1.15rem" }}
                  fontWeight="400"
                  color="grey.500"
                  lineHeight="30px"
                >
                  {formatPhoneDisplay(sNumber ?? "")}
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
              !SecondaryPhoneNumber && (
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
                      as="span"
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
              )
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
        //         fontSize={{ base: "1rem", md: "1.1rem", lg: "1.15rem" }}
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
        //         fontSize={{ base: "1rem", md: "1.1rem", lg: "1.15rem" }}
        //         lineHeight={"100%"}
        //       >
        //         Save Changes
        //       </Text>
        //     </CustomButton>
        //   )}
        // </VStack>
        <VStack w="full" pt="4">
          <Controller
            name="secNum"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInputWithCode
                label="Secondary Phone Number"
                placeholder="8012345678"
                required={true}
                value={value}
                onChange={onChange}
                error={errors.secNum}
              />
            )}
          />
          <Controller
            name="confirmSecNum"
            control={control}
            render={({ field: { onChange, value } }) => (
              <PhoneInputWithCode
                label="Confirm Phone Number"
                placeholder="8012345678"
                required={true}
                value={value}
                onChange={onChange}
                error={errors.confirmSecNum}
              />
            )}
          />

          {sNumber ? (
            <CustomButton disabled={disable} onClick={handleSubmit(editNumber)} customStyle={{ w: "full" }}>
              Save Changes
            </CustomButton>
          ) : (
            <CustomButton
              disabled={disable}
              loading={isLoading}
              onClick={handleSubmit(onSubmit)}
              customStyle={{ w: "full" }}
            >
              Save
            </CustomButton>
          )}
        </VStack>
      )}
    </>
  );
};
