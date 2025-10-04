import { Box, Button, Drawer, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import * as Yup from "yup";

import { HiMiniPlus } from "react-icons/hi2";
import moment from "moment";
import {
  useAddExperienceMutation,
  useDeleteExperienceMutation,
} from "mangarine/state/services/profile.service";

import { useProfile } from "mangarine/state/hooks/profile.hook";
import { isEmpty, size } from "es-toolkit/compat";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import { FaTimes } from "react-icons/fa";
import CustomInput from "../customcomponents/Input";
import CustomSelect from "../customcomponents/select";
import { toaster } from "../ui/toaster";

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
  title: Yup.string().required("title is required"),
  employment_type: Yup.array()
    .of(Yup.string())
    .min(1, "employment type is required"),
  company_name: Yup.string().required("company name is required"),
  location: Yup.string().required("location is required"),
  start_month: Yup.string().required("start month is required"),
  start_year: Yup.string().required("start month is required"),
  end_month: Yup.string().required("end month is required"),
  end_year: Yup.string().required("end month is required"),
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
  // const [current, setCurrent] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
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

  useEffect(() => {
    // console.log(experience);
    const expItem = experienceType.find(
      (item) => item.value === experience.employment_type
    );
    // console.log(expItem, "exp");
    if (!isEmpty(expItem)) {
      setValue("employment_type", [expItem.label]);
    }
  }, [experience, setValue]);

  const handleAddExperience = (data: any) => {
    // console.log(data, "data")

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
              label="Title "
              placeholder="Enter Title"
              id="title"
              required={true}
              name="title"
              value={value}
              size="md"
              onChange={onChange}
              //   error={{}}
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
            // <CustomSelect
            //   id={"experienceTypeOpt"}
            //   placeholder="Input your area of interest"
            //   name={"Area of Interest"}
            //   size="md"
            //   // options={experienceType}
            //   label="Experience type"
            //   isMulti={true}
            //   // value={value}
            //   required={true}
            //   // error={errors.experience_type}
            //   onChange={onChange}
            // />
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
              label="Company Name "
              placeholder="Enter company name"
              id="company_name"
              required={true}
              name="company_name"
              value={value}
              size="md"
              onChange={onChange}
              //   error={{}}
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
              label="Location "
              placeholder="Lagos, Nigeria "
              id="location"
              required={true}
              name="location"
              value={value}
              size="md"
              onChange={onChange}
              //   error={{}}
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
                id="start_date"
                required={true}
                name="start_date"
                value={value}
                size="md"
                onChange={onChange}
                //   error={{}}
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
              />
            )}
          />
        </HStack>
      </HStack>
      <HStack pb="2" w="full">
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
              />
            )}
          />
        </HStack>
      </HStack>
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
            bg="primary.300"
            borderWidth={1}
            color={"white"}
            borderColor={"gray.50"}
            py={2}
            w="45%"
            px={4}
            loading={isLoading}
            _hover={{
              textDecor: "none",
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
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  const { experiences } = useProfile();
  const [tempExperience, setTempExperience] = useState(experiences);

  const addNewExperience = () => {
    const formData = {
      id: moment().unix(),
    };
    const newExperience = !isEmpty(tempExperience)
      ? [...tempExperience, formData]
      : [formData];
    setTempExperience(newExperience);
  };
   useEffect(() => {
     if (experiences && experiences.length > 0) {
       setTempExperience(experiences);
     }
   }, [experiences]);
  const handleDeleteExperience = (id: string) => {
    const newExperience = tempExperience.filter(
      (experience) => experience.id !== id
    );
    setTempExperience(newExperience);
  };
  console.log(experiences);

  useEffect(() => {}, [experiences, tempExperience]);

  return (
    <Drawer.Root size={"sm"} open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />
      <Drawer.Trigger>
        {/* <Image
          onClick={() => {
            isOpen;
          }}
          cursor={"pointer"}
          src="/icons/edit.svg"
          alt={edit}
        /> */}
      </Drawer.Trigger>
      <Drawer.Positioner zIndex={'max'}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <VStack
                spaceY={6}
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
                px="6"
              >
                <HStack w="full" py={4} justifyContent={"space-between"}>
                  <Text
                    fontWeight={700}
                    fontSize={"2.5rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    // textAlign={"start"}
                  >
                    Experience
                  </Text>
                  <HStack spaceX={4}>
                    {/* <Box
                      border={0.5}
                      rounded={4}
                      py={2}
                      px="2"
                      onClick={addNewExperience}
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
                    </Box> */}
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
          <Drawer.Body px="3" py="8">
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

             <HStack w="full" align="center" justify={"flex-start"}>
               <Box
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
                {/* <Text color="text_primary" fontSize={"1rem"} fontWeight={"600"}>
                  <HiMiniMinus />
                </Text> */}
              </Box>
              <Text color="grey.500" fontSize={"1rem"} fontWeight={"600"}>
                 Add Experience
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

export default ExperienceModal;
