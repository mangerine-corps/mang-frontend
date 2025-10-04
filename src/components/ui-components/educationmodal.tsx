import {
  Box,
  Button,
  Drawer,
  Field,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import * as yup from "yup";

import { HiMiniPlus } from "react-icons/hi2";
import moment from "moment";
import {
  useAddEducationMutation,
  useDeleteEducationMutation,
} from "mangarine/state/services/profile.service";

import { useProfile } from "mangarine/state/hooks/profile.hook";
import { isEmpty, size } from "es-toolkit/compat";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { FaTimes } from "react-icons/fa";
import CustomInput from "../customcomponents/Input";
import { useDispatch } from "react-redux";
import { setCurrentEdu } from "mangarine/state/reducers/profile.reducer";
import { toaster } from "../ui/toaster";



const educationSchema = yup.object().shape({
  school_name: yup.string().required("Full name is required"),
  degree: yup.string().required("degree is required"),
  field_of_study: yup.string().required("field of study is required"),
  start_month: yup.string().required("start month is required"),
  start_year: yup.string().required("start month is required"),
  end_month: yup.string().required("end month is required"),
  end_year: yup.string().required("end month is required"),
  isCurrent: yup.boolean(),
});

export const EducationItem = ({
  education,
  handleDeleted,
  onClose
}: {
  education: any;
  handleDeleted: (id: string) => void;
  onClose: () => void
}) => {
  const [addNewEducation, { isLoading }] = useAddEducationMutation();
  const [deleteEducation,] =
    useDeleteEducationMutation();
  const dispatch = useDispatch();
  // const [schooling, setSchooling]= useState(false)
  //   const toast = useToast();
  console.log(education);
  const {
    handleSubmit,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(educationSchema),
    defaultValues: {
      school_name: education.school_name ?? "",
      degree: education.degree ?? "",
      field_of_study: education.field_of_study ?? "",
      start_month: education.start_month ?? "",
      start_year: education.start_year ?? "",
      end_month: education.end_month ?? "",
      end_year: education.end_year ?? "",
      isCurrent: education.isCurrent ?? false,
    },
  });
useEffect(() => {
  if (education) {
    reset({
      school_name: education.school_name ?? "",
      degree: education.degree ?? "",
      field_of_study: education.field_of_study ?? "",
      start_month: education.start_month ?? "",
      start_year: education.start_year ?? "",
      end_month: education.end_month ?? "",
      end_year: education.end_year ?? "",
      isCurrent: education.isCurrent ?? false,
    });
  }
}, [education, reset]);
  const handleAddEducation = (data: any) => {
    console.log("button clicked save");
    const { isCurrent, ...rest } = data;
    rest.isCurrent = Boolean(isCurrent)
    // rest.isCurrent = isCurrent === "true" ? true : false;
    addNewEducation(rest)
      .unwrap()
      .then((payload) => {
        const { data, message } = payload;
        dispatch(setCurrentEdu({ currentEdu: data }));
        // console.log(data, message, "message");
        onClose()
        toaster.create({
          title: "Success!!!",
          description: message,
          type: "success",
          duration: 9000,
          closable: true,
        });
      })
      .catch((error) => {
        toaster.create({
          title: "Error",
          description: error.message,
          type: "error",
          duration: 4000,
          closable: true,
        });
        console.log(error);
      });
  };
  const handleDeleteEducation = () => {
    deleteEducation(education.id)
      .unwrap()
      .then((payload) => {
        const { message, data } = payload;
        console.log(message, data, "edu message");
        toaster.create({
          title: "Success!!!",
          description: message,
          type: "success",
          duration: 4000,
          closable: true,
        });
        console.log(message, "message");
        handleDeleted(education.id);
      })
      .catch((error) => {
        toaster.create({
          title: "Error",
          description: error.message,
          type: "error",
          duration: 4000,
          closable: true,
        });
        console.log(error, "edu error");
      });
  };
  return (
    <VStack
      // spacing={6}
      px={4}
      py="4"
      w="full"
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      border={"1px"}
      borderColor={"#0000001A"}
      rounded={10}
      bg="main_background"
    >
      <Box pb={2} w="full">
        <Controller
          name="school_name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="School Name "
              placeholder="Enter School Name"
              id="school_name"
              required={true}
              name="school_name"
              value={value}
              size="md"
              onChange={onChange}
              //   error={{}}
              hasRightIcon={false}
              type={"text"}
              rightIcon={
                <Icon mr={"4"}>
                  <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                </Icon>
              }
            />
          )}
        />
      </Box>
      <Box pb={2} w="full">
        <Controller
          name="degree"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Degree "
              placeholder="Bachelor of Science (BSc)"
              id="degree"
              required={true}
              name="degree"
              value={value}
              size="md"
              onChange={onChange}
              //   error={{}}
              hasRightIcon={false}
              type={"text"}
              rightIcon={
                <Icon mr={"4"}>
                  <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                </Icon>
              }
            />
          )}
        />
      </Box>
      <Box pb={2} w="full">
        <Controller
          name="field_of_study"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Field of study "
              placeholder="Interactive design"
              id="field_of_study"
              required={true}
              name="field_of_study"
              value={value}
              size="md"
              onChange={onChange}
              //   error={{}}
              hasRightIcon={false}
              type={"text"}
              rightIcon={
                <Icon mr={"4"}>
                  <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                </Icon>
              }
            />
          )}
        />
      </Box>
      <HStack pb="2" w="full">
        <Field.Root id="location" my={2}>


          <HStack w="full">
            <Controller
              name="start_month"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Start Month"
                  placeholder="Start Month"
                  id="start_date"
                  required={true}
                  name="start_date"
                  value={value}
                  size="md"
                  onChange={onChange}
                  //   error={{}}
                  hasRightIcon={false}
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
              name="start_year"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="Start year"
                  placeholder="start year"
                  id="end_date"
                  required={true}
                  name="end_date"
                  value={value}
                  size="md"
                  onChange={onChange}
                  //   error={{}}
                  hasRightIcon={false}
                  type={"text"}
                  rightIcon={
                    <Icon mr={"4"}>
                      <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                    </Icon>
                  }
                />
              )}
            />
          </HStack>
        </Field.Root>
      </HStack>
      <HStack pb="2" w="full">
        <Field.Root id="location" my={2}>


          <HStack w="full">
            <Controller
              name="end_month"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="End Month"
                  placeholder="End Month"
                  id="start_date"
                  required={true}
                  name="start_date"
                  value={value}
                  size="md"
                  onChange={onChange}
                  //   error={{}}
                  hasRightIcon={false}
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
              name="end_year"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="End Year"
                  placeholder="End Year"
                  id="end_date"
                  required={true}
                  name="end_date"
                  value={value}
                  size="md"
                  onChange={onChange}
                  //   error={{}}
                  hasRightIcon={false}
                  type={"text"}
                  rightIcon={
                    <Icon mr={"4"}>
                      <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                    </Icon>
                  }
                />
              )}
            />
          </HStack>
        </Field.Root>
      </HStack>
      <Box pb={8} w="full">
        <HStack alignItems={"center"}>
          <Controller
            name="isCurrent"
            control={control}
            defaultValue={false}
            render={({ field: { value, onChange } }) => (
              <Checkbox
                checked={!!value}
                variant="outline"
                rounded="lg"
                onCheckedChange={(e) => onChange(e.checked)}
              />
            )}
          />

          <Text
            pl="1px"
            fontSize={"0.8rem"}
            fontFamily={"outfit"}
            fontWeight={"400"}
            color="grey.500"
          >
            Currently Schooling
          </Text>
        </HStack>
      </Box>

      <HStack w="full" alignItems={"center"} justifyContent={"space-between"}>
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

            onClick={handleDeleteEducation}
          >
            <Text
              ml={2}
              className="text5"
              color={"primary.300"}
              fontSize={"0.875rem"}
              fontWeight={"500"}
            >
              Delete Education
            </Text>
          </Button>
          <Button
            bg="primary.300"
            borderWidth={1}
            color={"white"}
            borderColor={"gray.50"}
            py={2}
            w="45%"
            loading={isLoading}
            px={4}
            _hover={{
              textDecor: "none",
            }}
            // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
            rounded={"6px"}
            onClick={handleSubmit(handleAddEducation)}
          >
            <Text
              ml={2}
              className="text5"
              color={"white"}
              fontSize={"0.875rem"}
              fontWeight={"500"}
            >
              Save Education
            </Text>
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
};
const EducationModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  // const [showToast, setShowToast] = useState(false);
  // const [isCheck, setIsCheck] = useState(false);
  const { educations } = useProfile();
  const [tempEducation, setTempEducation] = useState(educations);
  // const [openModal, setOpenModal] = useState(false)
  // const [errorMessage, setErrorMessage] = useState("");


  const addNewEducation = () => {
    const formData = {
      id: moment().unix(),
    };
    const newEducation = !isEmpty(tempEducation)
      ? [...tempEducation, formData]
      : [formData];
    setTempEducation(newEducation);
    // onOpenChange();
  };
   useEffect(() => {
     if (educations && educations.length > 0) {
       setTempEducation(educations);
     }
   }, [educations]);
  const handleDeleteEducation = (id: string) => {
    const newEducation = tempEducation.filter((edu) => edu.id !== id);
    setTempEducation(newEducation);
    onOpenChange()
  };

  useEffect(() => {
    console.log(educations, tempEducation)
    if (!isEmpty(educations)) {
      console.log(educations, 'inside state')
      setTempEducation(educations)
    }
  }, []);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} size="sm">
      <Drawer.Backdrop />

      <Drawer.Positioner zIndex={"max"}>
        <Drawer.Content pt="6">
          <Drawer.Header>
            <Drawer.Title>
              <VStack
                spaceY={6}
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
                px="4"
              >
                <HStack w="full" py={4} justifyContent={"space-between"}>
                  <Text
                    fontWeight={700}
                    fontSize={"2rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    // textAlign={"start"}
                  >
                    Education
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
              </VStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body px="2" py="8" bg="bg_box">
            <VStack w="full" spaceY="4">
              {size(tempEducation) > 0
                ? tempEducation.map((edu) => (
                    <>
                      <EducationItem
                        key={edu.id}
                        handleDeleted={handleDeleteEducation}
                        education={edu}
                        onClose={onOpenChange}
                      />
                    </>
                  ))
                : ""}
              <HStack align="center" w="full">
                <Box
                  border={0.5}
                  rounded={4}
                  py={2}
                  px="2"
                  onClick={addNewEducation}
                  borderColor={"gray.150"}
                  shadow={"md"}
                >
                  <Text
                    color="text_primary"
                    fontSize={"1rem"}
                    fontWeight={"600"}
                  >
                    <HiMiniPlus />
                  </Text>
                </Box>
                <Text
                  fontWeight={700}
                  fontSize={"1rem"}
                  fontFamily={"Outfit"}
                  // color={"black"}
                  color="text_primary"
                  // textAlign={"start"}
                >
                  Add Education
                </Text>
              </HStack>
            </VStack>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default EducationModal;
