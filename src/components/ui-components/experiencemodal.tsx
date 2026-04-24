import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import * as Yup from "yup";

import { HiMiniPlus } from "react-icons/hi2";
import {
  useAddExperienceMutation,
  useDeleteExperienceMutation,
} from "mangarine/state/services/profile.service";

import { useProfile } from "mangarine/state/hooks/profile.hook";
import { isEmpty, size } from "es-toolkit/compat";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import CustomInput from "../customcomponents/Input";
import CustomSelect from "../customcomponents/select";
import { toaster } from "../ui/toaster";
import TopRightDrawer from "../ui/top-right-drawer";

const createDraftExperience = () => ({
  id: `draft-experience-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  isDraft: true,
});

const experienceType = [
  {
    id: "1",
    value: "Full-time",
    label: "Full-time",
  },
  {
    id: "2",
    value: "Part-time",
    label: "Part-time",
  },
  {
    id: "3",
    value: "Contract",
    label: "Contract",
  },
  {
    id: "4",
    value: "Internship",
    label: "Internship",
  },
  {
    id: "5",
    value: "Volunteer",
    label: "Volunteer",
  },
  {
    id: "6",
    value: "Freelance",
    label: "Freelance",
  },
];

const experienceSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  employment_type: Yup.array()
    .of(Yup.string())
    .min(1, "Employment type is required"),
  company_name: Yup.string().required("Company name is required"),
  location: Yup.string().required("Location is required"),
  start_month: Yup.string().required("Start month is required"),
  start_year: Yup.string().required("Start year is required"),
  end_month: Yup.string().when("isCurrent", {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("End month is required"),
  }),
  end_year: Yup.string().when("isCurrent", {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("End year is required"),
  }),
  isCurrent: Yup.boolean(),
});

const ExperienceItem = ({
  experience,
  handleDeleted,
  onClose,
}: {
  experience: any;
  handleDeleted: (id: string) => void;
  onClose: () => void;
}) => {
  const [addNewExperience, { isLoading }] = useAddExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(experienceSchema),
    defaultValues: {
      title: experience?.title ?? "",
      employment_type: [],
      company_name: experience?.company_name ?? "",
      location: experience?.location ?? "",
      start_month: experience?.start_month ?? "",
      end_month: experience?.end_month ?? "",
      end_year: experience?.end_year ?? "",
      start_year: experience?.start_year ?? "",
      isCurrent: experience.isCurrent ? true : false,
    },
  });

  const isCurrent = watch("isCurrent");

  useEffect(() => {
    const expItem = experienceType.find(
      (item) => item.value === experience.employment_type
    );
    if (!isEmpty(expItem)) {
      setValue("employment_type", [expItem.label]);
    }
  }, [experience, setValue]);

  const handleAddExperience = (data: any) => {

    const {
      employment_type: [employment_typeString],
      isCurrent,
      ...rest
    } = data;
    rest.employment_type = employment_typeString;
    rest.isCurrent = isCurrent === true ? true : false;

    addNewExperience(rest)
      .unwrap()
      .then(() => {
        onClose();
        toaster.create({
          title: "Success",
          description: "Experience added successfully",
          type: "success",

          closable: true,
        });
      })
      .catch((error) => {
        toaster.create({
          title: "Error",
          description: "error adding experience",
          type: "error",

          closable: true,
        });
        console.log(error);
      });
    // console.log("button clicked")
  };
  // const [experienceTypeOpt, setExperienceTypeOpt] = useState<SelectOptions[]>(
  //   []
  // );
  const handleDeleteExpereince = () => {
    if (experience?.isDraft) {
      handleDeleted(experience.id);
      return;
    }

    deleteExperience(experience.id)
      .unwrap()
      .then(() => {
        handleDeleted(experience.id);
         toaster.create({
          title: "Success",
          description: "Experience deleted successfully",
          type: "success",

          closable: true,
        });
        onClose()

      })
      .catch((error) => {
        console.log(error);
         toaster.create({
          title: "Error",
          description: "Error deleting experience",
          type: "error",

          closable: true,
        });
        onClose()
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
          name="title"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Title"
              placeholder="Enter Title"
              id="title"
              required={true}
              name="title"
              value={value}
              size="md"
              onChange={onChange}
              error={errors.title}
              hasRightIcon={false}
              type={"text"}
            />
          )}
        />
      </Box>
      <Box pb={2} w="full">
        <Controller
          name="employment_type"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomSelect
              id={experience.id}
              placeholder="Select employment type"
              name={"employment type"}
              size="md"
              options={experienceType}
              label="Employment type"
              isMulti={false}
              value={value}
              required={true}
              error={errors.employment_type}
              onChange={onChange}
            />
          )}
        />
      </Box>
      <Box pb={2} w="full">
        <Controller
          name="company_name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Company Name"
              placeholder="Enter company name"
              id="company_name"
              required={true}
              name="company_name"
              value={value}
              size="md"
              onChange={onChange}
              error={errors.company_name}
              hasRightIcon={false}
              type={"text"}
            />
          )}
        />
      </Box>

      <Box pb={2} w="full">
        <Controller
          name="location"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomInput
              label="Location"
              placeholder="Lagos, Nigeria"
              id="location"
              required={true}
              name="location"
              value={value}
              size="md"
              onChange={onChange}
              error={errors.location}
              hasRightIcon={false}
              type={"text"}
            />
          )}
        />
      </Box>

      <HStack pb="2" w="full">
        <HStack w="full">
          <Controller
            name="start_month"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Start Month"
                placeholder="Start Month"
                id="start_month"
                required={true}
                name="start_month"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.start_month}
                hasRightIcon={false}
                type={"text"}
              />
            )}
          />
          <Controller
            name="start_year"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Start Year"
                placeholder="Start Year"
                id="start_year"
                required={true}
                name="start_year"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.start_year}
                hasRightIcon={false}
                type={"text"}
              />
            )}
          />
        </HStack>
      </HStack>
      {!isCurrent && (
        <HStack pb="2" w="full">
          <HStack w="full">
            <Controller
              name="end_month"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="End Month"
                  placeholder="End Month"
                  id="end_month"
                  required={true}
                  name="end_month"
                  value={value}
                  size="md"
                  onChange={onChange}
                  error={errors.end_month}
                  hasRightIcon={false}
                  type={"text"}
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
                  id="end_year"
                  required={true}
                  name="end_year"
                  value={value}
                  size="md"
                  onChange={onChange}
                  error={errors.end_year}
                  hasRightIcon={false}
                  type={"text"}
                />
              )}
            />
          </HStack>
        </HStack>
      )}
      <Box pb={8} w="full">
        <HStack alignItems={"center"}>
          <Controller
            name="isCurrent"
            control={control}
            render={({ field: { value,onChange } }) => (
              <Checkbox
                checked={!!value}
                variant="outline"
                rounded="lg"
                onCheckedChange={(e)=>{onChange(e.checked)}}
              />
            )}
          />

          <Text
            pl="1px"
            fontSize={"0.875rem"}
            fontFamily={"outfit"}
            fontWeight={"400"}
            color="grey.500"
          >
            Currently working in this role
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

            onClick={handleDeleteExpereince}
          >
            <Text
              ml={2}
              className="text5"
              color={"primary.300"}
              fontSize={"0.875rem"}
              fontWeight={"500"}
            >
              Delete Experience
            </Text>
          </Button>
          <Button
            bg="#111D4A"
            borderWidth={1}
            color={"white"}
            borderColor={"#111D4A"}
            py={2}
            w="45%"
            px={4}
            loading={isLoading}
            _hover={{
              textDecor: "none",
              bg: "#111D4A",
            }}
            // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
            rounded={"6px"}
            onClick={handleSubmit(handleAddExperience)}
          >
            <Text
              ml={2}
              className="text5"
              color={"white"}
              fontSize={"0.875rem"}
              fontWeight={"500"}
            >
              Save Experience
            </Text>
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
};
const ExperienceModal = ({
  open,
  onOpenChange,
  startWithDraft = false,
}: {
  open: boolean;
  onOpenChange: () => void;
  startWithDraft?: boolean;
}) => {
  const { experiences } = useProfile();
  const [tempExperience, setTempExperience] = useState(experiences);

  const addNewExperience = () => {
    setTempExperience((prev) => [
      createDraftExperience(),
      ...(Array.isArray(prev) ? prev : []),
    ]);
  };
  const handleDeleteExperience = (id: string) => {
    const newExperience = tempExperience.filter(
      (experience) => experience.id !== id
    );
    setTempExperience(newExperience);
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextExperiences = Array.isArray(experiences) ? experiences : [];
    setTempExperience(
      startWithDraft
        ? [createDraftExperience(), ...nextExperiences]
        : nextExperiences
    );
  }, [experiences, open, startWithDraft]);

  return (
    <TopRightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Experience"
      headerAction={
        <Box
          as="button"
          border={0.5}
          rounded={4}
          py={2}
          px="2"
          cursor={"pointer"}
          onClick={addNewExperience}
          borderColor={"gray.150"}
          shadow={"md"}
        >
          <Text color="text_primary" fontSize={"1rem"} fontWeight={"600"}>
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
        {size(tempExperience) > 0 &&
          tempExperience.map((experience) => (
            <ExperienceItem
              key={experience.id}
              handleDeleted={handleDeleteExperience}
              experience={experience}
              onClose={onOpenChange}
            />
          ))}
      </VStack>
    </TopRightDrawer>
  );
};

export default ExperienceModal;
