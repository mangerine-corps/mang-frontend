import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";

import { outfit } from "mangarine/pages/_app";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";

interface EditContactMeCardProps {
  title: string;
  info?: any;
  width?: string | object;
  edit?: any;
  consultantId?: string
}
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../customcomponents/Input";
import { toaster } from "../ui/toaster";
import { useUpdateContactInfoMutation } from "mangarine/state/services/profile.service";
import { useDispatch } from "react-redux";
import { setContactDetails } from "mangarine/state/reducers/profile.reducer";
import { useProfile } from "mangarine/state/hooks/profile.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
import TopRightDrawer from "../ui/top-right-drawer";
// type contactData = {
//   email: string;
//   phone_number: string;
//   website_link: string;
// };

const phoneRegex = /^[0-9]{10,15}$/;

const formatPhoneDisplay = (raw: string): string => {
  if (!raw) return "-";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return raw;
  const withPlus = `+${digits}`;
  // Group: +XXX XXXX XXXX XXXX (country code up to 3 digits, then groups of 4)
  const match = withPlus.match(/^(\+\d{1,3})(\d{4})(\d{4})(\d{0,4})$/);
  if (match) return [match[1], match[2], match[3], match[4]].filter(Boolean).join(" ");
  return withPlus;
};

const contactSchema = Yup.object().shape({
  email: Yup.string().email("Enter a valid email address").optional(),
  mobileNumber: Yup.string()
    .matches(phoneRegex, "Phone number is not valid")
    .required("Phone number is required"),
  websiteAddress: Yup.string()
    .trim()
    .test(
      "website-url",
      "URL must start with http:// or https://",
      (value) => !value || /^https?:\/\//i.test(value)
    ),
  phoneVisible: Yup.boolean(),
  emailVisible: Yup.boolean(),
  webVisible: Yup.boolean(),
});

const EditContactMeCard = ({
  title,
  width = "full",
  info,
  edit,
}: EditContactMeCardProps) => {
  const { contact } = useProfile();
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [updateContactInfo, { isLoading }] = useUpdateContactInfoMutation();
  const isEditable = Boolean(edit);
  const existingContact = useMemo(
    () => ({
      email:
        (isEditable ? contact?.email : undefined) ??
        // Only expose another user's email when they've explicitly opted in
        (info?.emailVisible ? info?.email : undefined) ??
        (isEditable ? user?.email : undefined) ??
        "",
      mobileNumber:
        (isEditable ? contact?.mobileNumber : undefined) ??
        info?.mobileNumber ??
        (isEditable ? user?.mobileNumber : undefined) ??
        "",
      websiteAddress:
        (isEditable
          ? contact?.websiteAddress ??
            contact?.website_link ??
            contact?.websiteLink ??
            contact?.website
          : undefined) ??
        info?.websiteAddress ??
        info?.website_link ??
        info?.websiteLink ??
        info?.website ??
        (isEditable
          ? user?.websiteAddress ??
            user?.website_link ??
            user?.websiteLink ??
            user?.website
          : undefined) ??
        "",
      phoneVisible: Boolean(
        (isEditable ? contact?.phoneVisible : undefined) ??
          info?.phoneVisible ??
          false
      ),
      emailVisible: Boolean(
        (isEditable ? contact?.emailVisible : undefined) ??
          info?.emailVisible ??
          false
      ),
      webVisible: Boolean(
        (isEditable
          ? contact?.webVisible ?? contact?.websiteVisible
          : undefined) ??
          info?.webVisible ??
          info?.websiteVisible ??
          false
      ),
    }),
    [
      isEditable,
      contact?.email,
      contact?.mobileNumber,
      contact?.websiteAddress,
      contact?.website_link,
      contact?.websiteLink,
      contact?.website,
      contact?.phoneVisible,
      contact?.emailVisible,
      contact?.webVisible,
      contact?.websiteVisible,
      info?.email,
      info?.mobileNumber,
      info?.websiteAddress,
      info?.website_link,
      info?.websiteLink,
      info?.website,
      info?.phoneVisible,
      info?.emailVisible,
      info?.webVisible,
      info?.websiteVisible,
      user?.email,
      user?.mobileNumber,
      user?.websiteAddress,
      user?.website_link,
      user?.websiteLink,
      user?.website,
    ]
  );
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      email: existingContact.email,
      mobileNumber: existingContact.mobileNumber,
      websiteAddress: existingContact.websiteAddress,
      phoneVisible: existingContact.phoneVisible,
      emailVisible: existingContact.emailVisible,
      webVisible: existingContact.webVisible,
    },
  });

  useEffect(() => {
    reset({
      email: existingContact.email,
      mobileNumber: existingContact.mobileNumber,
      websiteAddress: existingContact.websiteAddress,
      phoneVisible: existingContact.phoneVisible,
      emailVisible: existingContact.emailVisible,
      webVisible: existingContact.webVisible,
    });
  }, [existingContact, reset]);

  const onSubmit = (data: any) => {
    const formdata = {
      mobileNumber: data.mobileNumber,
      websiteAddress: data.websiteAddress,
      phoneVisible: Boolean(data.phoneVisible),
      emailVisible: Boolean(data.emailVisible),
      webVisible: Boolean(data.webVisible),
    };

    updateContactInfo(formdata)
      .unwrap()
      .then((res) => {
        dispatch(
          setContactDetails({
            ...existingContact,
            ...res.data,
            mobileNumber: res.data?.mobileNumber ?? data.mobileNumber,
            websiteAddress: res.data?.websiteAddress ?? data.websiteAddress,
            phoneVisible: res.data?.phoneVisible ?? data.phoneVisible,
            emailVisible: res.data?.emailVisible ?? data.emailVisible,
            webVisible:
              res.data?.webVisible ??
              res.data?.websiteVisible ??
              data.webVisible,
          })
        );
        toaster.create({
          type: "success",
          title: "Success",
          description: res.message,
          closable: true,
        });
        setOpen(false);
      })
      .catch((err) => {
        toaster.create({
          type: "error",
          title: "Error",
          description: err.message,
          closable: true,
        });
      });
  };
  return (
    <VStack
      className={outfit.className}
      borderWidth={0.5}
      borderColor={"bg_box"}
      rounded={"12px"}
      py="6"
      bg="bg_box"
      boxShadow="0px 0px 4px 0px #0000001A"
      wordSpacing={"2"}
      w={width}
    >
      <HStack
        w="full"
        px="4"
        pb="2"
        alignItems="center"
        justifyContent={"space-between"}
      >
        <Text
          textAlign={"left"}
          //   w="full"
          //   pl={"2rem"}
          fontSize={"1.25rem"}
          fontFamily={"Outfit"}
          color={"text_primary"}
          fontWeight={"600"}
        >
          {title}
        </Text>
        {isEditable ? (
          <Box
            cursor={"pointer"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Text color="text_primary" fontSize="1rem">
              {edit}
            </Text>
          </Box>
        ) : null}
      </HStack>
      <TopRightDrawer
        open={open}
        onOpenChange={() => setOpen(false)}
        title="Contact Me"
        bodyProps={{
          px: { base: "4", lg: "6" },
          py: { base: "4", lg: "5" },
          pb: { base: "14", lg: "16" },
        }}
      >
        <VStack
          spaceY={6}
          w="full"
          justifyContent={"flex-start"}
          alignItems={"flex-start"}
        >
          <Box w="full">
            <Controller
              name="email"
              control={control}
              render={({ field: { value } }) => (
                <CustomInput
                  label="Email Address"
                  placeholder="Enter your email address"
                  id="contact_email"
                  required={false}
                  name="email"
                  value={value}
                  size="md"
                  onChange={() => {}}
                  hasRightIcon={false}
                  type={"email"}
                  disabled
                />
              )}
            />
            <HStack mt="2" alignItems={"center"}>
              <Controller
                name="emailVisible"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    checked={!!value}
                    variant="outline"
                    rounded="lg"
                    onCheckedChange={(e) => {
                      onChange(e.checked);
                    }}
                  />
                )}
              />
              <Text
                pl="2px"
                fontSize={"0.875rem"}
                fontFamily={"outfit"}
                fontWeight={"400"}
                color="#999999"
              >
                Make visible to public
              </Text>
            </HStack>
          </Box>
          <Box w="full">
            <Box w="full">
              <Controller
                name="mobileNumber"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label="phone Number  "
                    placeholder="Enter your phone number here"
                    id="phone_number"
                    required={true}
                    name="mobileNumber"
                    value={value}
                    size="md"
                    onChange={onChange}
                    // @ts-expect-error 'build error'
                    error={errors?.mobileNumber?.message}
                    hasRightIcon={false}
                    type={"text"}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                )}
              />
            </Box>
            <HStack mt="2" alignItems={"center"}>
              <Controller
                name="phoneVisible"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    checked={!!value}
                    variant="outline"
                    rounded="lg"
                    onCheckedChange={(e) => {
                      onChange(e.checked);
                    }}
                  />
                )}
              />
              <Text
                pl="2px"
                fontSize={"0.875rem"}
                fontFamily={"outfit"}
                fontWeight={"400"}
                color="#999999"
              >
                Make visible to public
              </Text>
            </HStack>
          </Box>
          <Box w="full">
            <Controller
              name="websiteAddress"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Personal Website Link"
                  placeholder="https://yourwebsite.com"
                  id="website_address"
                  required={false}
                  name="websiteAddress"
                  value={value}
                  size="md"
                  onChange={onChange}
                  // @ts-expect-error 'build error'
                  error={errors?.websiteAddress?.message}
                  hasRightIcon={false}
                  type={"text"}
                />
              )}
            />
            <HStack mt="2" alignItems={"center"}>
              <Controller
                name="webVisible"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    checked={!!value}
                    variant="outline"
                    rounded="lg"
                    onCheckedChange={(e) => {
                      onChange(e.checked);
                    }}
                  />
                )}
              />
              <Text
                pl="2px"
                fontSize={"0.875rem"}
                fontFamily={"outfit"}
                fontWeight={"400"}
                color="#999999"
              >
                Make visible to public
              </Text>
            </HStack>
          </Box>
          <HStack w="100%" display={"flex"} flexDir={"row"} spaceX={6}>
            <Button
              bg="#111D4A"
              borderWidth={1}
              color={"white"}
              borderColor={"#111D4A"}
              py={2}
              w="45%"
              px={4}
              _hover={{
                textDecor: "none",
                bg: "#111D4A",
              }}
              loading={isLoading}
              rounded={"6px"}
              onClick={handleSubmit(onSubmit, (error) =>
                console.log(error, "error")
              )}
            >
              <Text
                ml={2}
                className="text5"
                color={"white"}
                fontSize={"0.875rem"}
                fontWeight={"500"}
              >
                Save Contact
              </Text>
            </Button>
          </HStack>
        </VStack>
      </TopRightDrawer>

      {/* Email section — only visible to the profile owner or when user opted in */}
      {(isEditable || existingContact.emailVisible) && (
        <>
          <Text
            textAlign={"left"}
            w="full"
            px={"4"}
            lineHeight={"shorter"}
            color={"text_primary"}
            fontSize={"1rem"}
            fontFamily={"Outfit"}
            fontWeight={"500"}
          >
            Email Address
          </Text>
          <Text
            textAlign={"left"}
            w="full"
            px={"4"}
            lineHeight={"shorter"}
            fontSize={"0.875rem"}
            fontFamily={"Outfit"}
            color={"grey.500"}
            fontWeight={"400"}
          >
            {existingContact.email || "-"}
          </Text>
        </>
      )}

      {/* Phone number section */}
      <Text
        textAlign={"left"}
        w="full"
        px={"4"}
        fontSize={"1rem"}
        fontFamily={"Outfit"}
        color={"text_primary"}
        lineHeight={"shorter"}
        fontWeight={"500"}
      >
        Phone Number
      </Text>
      <Text
        textAlign={"left"}
        w="full"
        px={"4"}
        lineHeight={"shorter"}
        fontSize={"0.875rem"}
        fontFamily={"Outfit"}
        color={"grey.500"}
        fontWeight={"400"}
      >
        {formatPhoneDisplay(existingContact.mobileNumber)}
      </Text>

      <Text
        textAlign={"left"}
        w="full"
        px={"4"}
        lineHeight={"shorter"}
        fontSize={"1rem"}
        fontFamily={"Outfit"}
        color={"text_primary"}
        fontWeight={"500"}
      >
        Personal Website
      </Text>
      <Text
        textAlign={"left"}
        w="full"
        px={"4"}
        lineHeight={"shorter"}
        fontSize={"0.875rem"}
        fontFamily={"Outfit"}
        color={"grey.500"}
        fontWeight={"400"}
      >
        {existingContact.websiteAddress || "-"}
      </Text>

      {/* <ContactMeModal isOpen={isOpen}  onClose={onClose}/> */}
    </VStack>
  );
};

export default EditContactMeCard;
