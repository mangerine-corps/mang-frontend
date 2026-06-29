import {
  Box,
  Button,
  Field,
  HStack,
  Icon,
  Image,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import * as yup from "yup";

import { HiMiniPlus } from "react-icons/hi2";
import {
  useAddEducationMutation,
  useDeleteEducationMutation,
} from "mangarine/state/services/profile.service";

import { useProfile } from "mangarine/state/hooks/profile.hook";
import { size } from "es-toolkit/compat";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import CustomInput from "../customcomponents/Input";
import { useDispatch } from "react-redux";
import { setCurrentEdu } from "mangarine/state/reducers/profile.reducer";
import { toaster } from "../ui/toaster";
import TopRightDrawer from "../ui/top-right-drawer";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1949 }, (_, i) => String(currentYear - i));

const SelectField = ({
  label,
  required,
  options,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  options: string[];
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <VStack alignItems="flex-start" gap={1} w="full">
    <Text fontSize="0.75rem" color="text_primary" fontWeight="400">
      {label}{required && <Text as="span" color="red.500"> *</Text>}
    </Text>
    <NativeSelect.Root size="md" w="full">
      <NativeSelect.Field
        value={value}
        onChange={(e) => onChange(e.target.value)}
        color={value ? "text_primary" : "gray.400"}
        borderColor="input_border"
        borderRadius="8px"
        pl={4}
        _focus={{ borderColor: "primary.300", boxShadow: "none" }}
        h="48px"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  </VStack>
);

const createDraftEducation = () => ({
  id: `draft-education-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  isDraft: true,
});

const educationSchema = yup.object().shape({
  school_name: yup.string().required("Full name is required"),
  degree: yup.string().required("degree is required"),
  field_of_study: yup.string().required("field of study is required"),
  start_month: yup.string().required("start month is required"),
  start_year: yup.string().required("start year is required"),
  end_month: yup.string().when("isCurrent", {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("end month is required"),
  }),
  end_year: yup.string().when("isCurrent", {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("end year is required"),
  }),
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
    watch,
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

  const isCurrent = watch("isCurrent");

  const handleAddEducation = (data: any) => {
    const { isCurrent, ...rest } = data;
    rest.isCurrent = Boolean(isCurrent);
    if (isCurrent) {
      delete rest.end_month;
      delete rest.end_year;
    }
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
    if (education?.isDraft) {
      handleDeleted(education.id);
      return;
    }

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
      {/* Start Date */}
      <VStack pb="2" w="full" alignItems="flex-start" gap={1}>
        <Text fontSize="0.75rem" color="text_primary" fontWeight="400">
          Start Date <Text as="span" color="red.500">*</Text>
        </Text>
        <HStack w="full" gap={3}>
          <Controller
            name="start_month"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectField
                label=""
                options={MONTHS}
                placeholder="Month"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            name="start_year"
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectField
                label=""
                options={YEARS}
                placeholder="Year"
                value={value}
                onChange={onChange}
              />
            )}
          />
        </HStack>
      </VStack>

      {/* End Date */}
      {!isCurrent && (
        <VStack pb="2" w="full" alignItems="flex-start" gap={1}>
          <Text fontSize="0.75rem" color="text_primary" fontWeight="400">
            End Date <Text as="span" color="red.500">*</Text>
          </Text>
          <HStack w="full" gap={3}>
            <Controller
              name="end_month"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectField
                  label=""
                  options={MONTHS}
                  placeholder="Month"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            <Controller
              name="end_year"
              control={control}
              render={({ field: { onChange, value } }) => (
                <SelectField
                  label=""
                  options={YEARS}
                  placeholder="Year"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </HStack>
        </VStack>
      )}
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
            color={"text_primary"}
            bg="bg_box"
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
            bg="button_bg"
            borderWidth={1}
            color={"button_text"}
            borderColor={"#111D4A"}
            py={2}
            w="45%"
            loading={isLoading}
            px={4}
            _hover={{
              textDecor: "none",
              bg: "#111D4A",
            }}
            // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
            rounded={"6px"}
            onClick={handleSubmit(handleAddEducation)}
          >
            <Text
              ml={2}
              className="text5"
              color={"button_text"}
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
  startWithDraft = false,
}: {
  open: boolean;
  onOpenChange: () => void;
  startWithDraft?: boolean;
}) => {
  // const [showToast, setShowToast] = useState(false);
  // const [isCheck, setIsCheck] = useState(false);
  const { educations } = useProfile();
  const [tempEducation, setTempEducation] = useState(educations);
  // const [openModal, setOpenModal] = useState(false)
  // const [errorMessage, setErrorMessage] = useState("");


  const addNewEducation = () => {
    setTempEducation((prev) => [
      createDraftEducation(),
      ...(Array.isArray(prev) ? prev : []),
    ]);
  };

  const handleDeleteEducation = (id: string) => {
    const newEducation = tempEducation.filter((edu) => edu.id !== id);
    setTempEducation(newEducation);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextEducations = Array.isArray(educations) ? educations : [];
    setTempEducation(
      startWithDraft
        ? [createDraftEducation(), ...nextEducations]
        : nextEducations
    );
  }, [educations, open, startWithDraft]);

  return (
    <TopRightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Education"
      headerAction={
        <Box
          as="button"
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
      }
      bodyProps={{
        px: { base: "4", lg: "5" },
        py: { base: "4", lg: "5" },
        pb: { base: "14", lg: "16" },
      }}
    >
      <VStack w="full" spaceY="4">
        {size(tempEducation) > 0
          ? tempEducation.map((edu) => (
              <EducationItem
                key={edu.id}
                handleDeleted={handleDeleteEducation}
                education={edu}
                onClose={onOpenChange}
              />
            ))
          : ""}
      </VStack>
    </TopRightDrawer>
  );
};

export default EducationModal;
