import { Box, Drawer, HStack, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";

import { outfit } from "mangarine/pages/_app";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface EditContactMeCardProps {
  title: string;
  // info: any;
  width?: string | object;
  edit?: any;
  consultantId?: string
}
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "../customcomponents/Input";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";
import { toaster } from "../ui/toaster";
import { useUpdateContactInfoMutation } from "mangarine/state/services/profile.service";
import { useDispatch } from "react-redux";
import { setContactDetails } from "mangarine/state/reducers/profile.reducer";
import { useProfile } from "mangarine/state/hooks/profile.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
// type contactData = {
//   email: string;
//   phone_number: string;
//   website_link: string;
// };

const phoneRegex = /^[0-9]{10,15}$/;

const contactSchema = Yup.object().shape({
  mobileNumber: Yup.string()
    .matches(phoneRegex, "Phone number is not valid")
    .required("Phone number is required"),
   website_link: Yup.string()
    .trim()
    .required("Website is required")
    .min(10, "Website must be at least 10 characters")
    .max(2083, "Website must be at most 2083 characters")
    .matches(/^https?:\/\//i, "URL must start with http:// or https://")
    .url("Enter a valid URL"),
  phoneVisible: Yup.boolean(),
  emailVisible: Yup.boolean(),
  webVisible: Yup.boolean(),
});

const EditContactMeCard = ({
  title,
  width = "full",
  // info,
  edit,
}: EditContactMeCardProps) => {
  const {contact} = useProfile()
  const { user } = useAuth()
  const [open, setOpen] = useState<boolean>()
  const [phoneVisible, setPhoneVisible] = useState<boolean>(false)
   const [webVisible, setWebVisible] = useState<boolean>(false)
  const route = useRouter()
  const dispatch = useDispatch()
  const [updateContactInfo, { isLoading }] = useUpdateContactInfoMutation()
  const {
    control,
    handleSubmit,
    getValues,
     formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      website_link: user?.websiteAddress ?? '',
      mobileNumber: user?.mobileNumber ?? '',
      phoneVisible: phoneVisible,
      emailVisible: false,
      webVisible: false
    },
  });
  useEffect(() => {
    console.log( contact, user, "user");
  }, [contact, user]);



  const onSubmit = (data: any) => {
    const value = getValues()
    const formdata={
      mobileNumber:value.mobileNumber,
      websiteAddress:value.website_link
    }
    updateContactInfo(formdata).unwrap().then((res)=>{
      console.log(res)
      dispatch(setContactDetails(res.data))
       toaster.create({
        type:"success",
        title:"Success",
        description:res.message,
        closable:true
       });
      setOpen(false)
    }).catch((err)=>{  toaster.create({
        type:"error",
        title:"Error",
        description:err.message,
        closable:true
       });})

    console.log(data, "button ") }
  return (
    <VStack
      className={outfit.className}
      borderWidth={0.5}
      borderColor={"bg_box"}
      rounded={"12px"}
      py="6"
      bg="bg_box"
      shadow={"sm"}
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

        {route.pathname === "/profile" ? (
          <Box
            cursor={"pointer"}
            // py={1}
            // px="1"
            onClick={() => {
              setOpen(true);
            }}
            // borderColor={"gray.150"}
            // shadow={"md"}
          >
            <Text color="text_primary" fontSize="1rem">
              {edit}
            </Text>
          </Box>
        ) : (
          ""
        )}
      </HStack>
      <Drawer.Root size={"md"} open={open} onOpenChange={() => setOpen(false)}>
        <Drawer.Backdrop />
        <Drawer.Positioner zIndex="max">
          <Drawer.Content pt="6">
            <Drawer.Header>
              <Drawer.Title>
                <VStack
                  spaceY={6}
                  w="full"
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  px="6"
                ></VStack>
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body px="6" py="8">
              <VStack
                spaceY={6}
                w="full"
                justifyContent={"flex-start"}
                alignItems={"flex-start"}
              >
                <HStack w="full" justifyContent={"space-between"}>
                  <Text
                    fontWeight={700}
                    fontSize={"2rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    // textAlign={"start"}
                  >
                    Contact Me
                  </Text>
                  <HStack>
                    <Box
                      border={"1px"}
                      rounded={4}
                      py={2}
                      px="2"
                      borderColor={"bg_box"}
                      onClick={() => setOpen(false)}
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
                          // error={errors.PhoneVis}
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
                    >
                      Make visible to public
                    </Text>
                  </HStack>
                </Box>
                <Box w="full">
                  <Box w="full">
                    <Controller
                      name="website_link"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <CustomInput
                          label="Personal Website Link "
                          placeholder="Website link here"
                          id="website_link"
                          required={true}
                          name="website_link"
                          value={value}
                          size="md"
                          onChange={onChange}
                          // @ts-expect-error "build error"
                          error={errors.website_link?.message   }
                          hasRightIcon={false}
                          type={"text"}
                        />
                      )}
                    />
                  </Box>
                  <HStack py="2" alignItems={"center"}>
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
                    >
                      Make visible to public
                    </Text>
                  </HStack>
                </Box>

                <HStack w="100%" display={"flex"} flexDir={"row"} spaceX={6}>
                  {/* <Button
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

                    onClick={() => { }}
                  >
                    <Text
                      ml={2}
                      className="text5"
                      color={"text_primary"}
                      fontSize={"0.875rem"}
                      fontWeight={"500"}
                    >
                      Delete Contact
                    </Text>
                  </Button> */}
                  <Button
                    bg="primary.300"
                    borderWidth={1}
                    color={"white"}
                    borderColor={"gray.50"}
                    py={2}
                    w="45%"
                    px={4}
                    _hover={{
                      textDecor: "none",
                    }}
                    loading={isLoading}
                    // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
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
            </Drawer.Body>
            <Drawer.Footer />
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      {/* Email section */}
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
        {contact?.email}
      </Text>

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
        {contact?.mobileNumber}
      </Text>

      {/* Website section */}
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
        fontSize={"0.875rem"}
        fontFamily={"Outfit"}
        color={"grey.500"}
        fontWeight={"400"}
      >
        {contact?.websiteAddress}
      </Text>
      {/* <ContactMeModal isOpen={isOpen}  onClose={onClose}/> */}
    </VStack>
  );
};

export default EditContactMeCard;