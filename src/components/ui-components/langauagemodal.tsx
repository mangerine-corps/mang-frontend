import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import * as Yup from "yup";
import { HiMiniPlus } from "react-icons/hi2";
import { isEmpty, size } from "lodash";

import {
  useAddLanguageMutation,
  useDeleteLanguageMutation,
} from "mangarine/state/services/profile.service";
import CustomSelect from "../customcomponents/select";
import { useProfile } from "mangarine/state/hooks/profile.hook";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useMount } from "react-use";
import { toaster } from "../ui/toaster";
import TopRightDrawer from "../ui/top-right-drawer";

const createDraftLanguage = () => ({
  id: `draft-language-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  language: "",
  proficiency: "",
  isDraft: true,
});

const languages = [
  {
    id: "1",
    value: "English",
    label: "English",
  },
  {
    id: "2",
    value: "Spanish",
    label: "Spanish",
  },
  {
    id: "3",
    value: "French",
    label: "French",
  },
  {
    id: "4",
    value: "German",
    label: "German",
  },
  {
    id: "5",
    value: "Italian",
    label: "Italian",
  },
  {
    id: "6",
    value: "Japanese",
    label: "Japanese",
  },
  {
    id: "7",
    value: "Korean",
    label: "Korean",
  },
  {
    id: "8",
    value: "Mandarin",
    label: "Mandarin",
  },
  {
    id: "9",
    value: "Russian",
    label: "Russian",
  },
];
const proficiencies = [
  {
    id: "1",
    value: "Basic",
    label: "Basic",
  },
  {
    id: "2",
    value: "Intermediate",
    label: "Intermediate",
  },
  {
    id: "3",
    value: "Advanced",
    label: "Advanced",
  },
  {
    id: "4",
    value: "Fluent",
    label: "Fluent",
  },
  {
    id: "5",
    value: "Native",
    label: "Native",
  },
];

const langSchema = Yup.object().shape({
  language: Yup.array().of(Yup.string()).min(1, "language is required"),
  proficiency: Yup.array().of(Yup.string()).min(1, "proficiency is required"),
});

const LanguageItem = ({
  language,
  handleDeleted,
  onClose,
}: {
  language: any;
  handleDeleted: (id: string) => void;
  onClose: any;
}) => {

  const [addNewLanguage, { isLoading }] = useAddLanguageMutation();
  const [deleteLanguage] = useDeleteLanguageMutation();
  const {
    handleSubmit,
    control,
    setValue,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(langSchema),
    defaultValues: {
      language: [],
      proficiency: [],
    },
  });
  useEffect(() => {
    const langItem = languages.find((item) => item.value === language.language);
    const profItem = proficiencies.find(
      (item) => item.value === language.proficiency
    );
    console.log(langItem, profItem, "lang");
    if (!isEmpty(langItem)) {
      setValue("language", [langItem.label]);
    }
    if (!isEmpty(profItem)) {
      setValue("proficiency", [profItem.label]);
    }
  }, [language, setValue]);

  const handleAddLanguage = (data: any) => {
    console.log(data, "data");

    const {
      language: [language_typeString],
      proficiency: [proficiency_typeString],
      ...rest
    } = data;
    rest.language = language_typeString;
    rest.proficiency = proficiency_typeString;

    addNewLanguage(rest)
      .unwrap()
      .then(() => {
        toaster.create({
          title: "Success",
          description: "Language added successfully",
          type: "success",
          closable: true,
        });
        onClose();
      })
      .catch((error) => {
        console.log(error);
        toaster.create({
          title: "Error",
          description: "Error adding language",
          type: "error",
          closable: true,
        });
      });
    console.log("button clicked");
  };

  const handleDeleteLanguage = () => {
    if (language?.isDraft) {
      handleDeleted(language.id);
      return;
    }

    deleteLanguage(language.id)
      .unwrap()
      .then(() => {
        handleDeleted(language.id);
        toaster.create({
          title: "Success",
          description: "Language deleted successfully",
          type: "success",
          closable: true,
        });
        onClose()
      })
      .catch((error) => {
        console.log(error);
        toaster.create({
          title: "Error",
          description: "Error deleting language",
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
    >
      <HStack pb="2" w="full">
        <Controller
          name="language"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomSelect
              id={`language_${language.id}`}
              placeholder="Select language"
              name={"language"}
              size="md"
              options={languages}
              label="Select Language"
              isMulti={false}
              value={value}
              required={true}
              error={errors.language}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="proficiency"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomSelect
              id={`proficiency_${language.id}`}
              placeholder="Select proficiency"
              name={"proficiency"}
              size="md"
              options={proficiencies}
              label="Select proficiency"
              isMulti={false}
              value={value}
              required={true}
              error={errors.proficiency}
              onChange={onChange}
            />
          )}
        />
      </HStack>

      <HStack w="full" alignItems={"center"} justifyContent={"flex-end"}>
        <HStack w="auto" display={"flex"} flexDir={"row"} spaceX={4}>
          <Button
            borderColor="primary.300"
            borderWidth={1}
            color={"text_primary"}
            bg="bg_box"
            py={2}
            rounded="6px"
            minW="160px"
            px={4}
            _hover={{
              textDecor: "none",
            }}
            // isDisabled={isEmpty(selectedDay) || selectedTime == ''}

            onClick={handleDeleteLanguage}
          >
            <Text
              ml={2}
              className="text5"
              color={"primary.300"}
              fontSize={"0.875rem"}
              fontWeight={"500"}
            >
              Delete Language
            </Text>
          </Button>
          <Button
            bg="button_bg"
            borderWidth={1}
            color={"button_text"}
            borderColor={"#111D4A"}
            py={2}
            minW="160px"
            px={4}
            _hover={{
              textDecor: "none",
              bg: "#111D4A",
            }}
            loading={isLoading}
            // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
            rounded={"6px"}
            onClick={handleSubmit(handleAddLanguage)}
          >
            <Text
              ml={2}
              className="text5"
              color={"button_text"}
              fontSize={"0.875rem"}
              fontWeight={"500"}
            >
              Save Language
            </Text>
          </Button>
        </HStack>
      </HStack>
    </VStack>
  );
};

const LanguageModal = ({
  open,
  onOpenChange,
  startWithDraft = false,
}: {
  open: boolean;
  onOpenChange: () => void;
  startWithDraft?: boolean;
}) => {
  const { languages } = useProfile();
  const [tempLanguages, settempLanguages] = useState(languages);

  const addNewLanguage = () => {
    settempLanguages((prev) => [
      ...(Array.isArray(prev) ? prev : []),
      createDraftLanguage(),
    ]);
  };
  const handleDeleteLanguage = (id: string) => {
    const newLanguages = tempLanguages.filter((lang) => lang.id !== id);
    settempLanguages(newLanguages);
  };
  useEffect(() => {
    if (!open) {
      return;
    }

    const nextLanguages = Array.isArray(languages) ? languages : [];
    settempLanguages(
      startWithDraft
        ? [...nextLanguages, createDraftLanguage()]
        : nextLanguages
    );
  }, [languages, open, startWithDraft]);
  useMount(() => {
    console.log(languages);
  });

  useEffect(() => {
    // console.log(languages, "lanuguages");
  }, [languages, tempLanguages]);

  return (
    <TopRightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Language"
      headerAction={
        <Box
          border={0.5}
          rounded={4}
          py={2}
          px="2"
          onClick={addNewLanguage}
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
        {size(tempLanguages) > 0 ? (
          tempLanguages.map((language) => (
            <LanguageItem
              key={language.id}
              handleDeleted={handleDeleteLanguage}
              language={language}
              onClose={onOpenChange}
            />
          ))
        ) : (
          <Text
            fontWeight={700}
            fontSize={"1rem"}
            fontFamily={"Outfit"}
            color={"text_primary"}
          >
            No Languages found
          </Text>
        )}
      </VStack>
    </TopRightDrawer>
  );
};

export default LanguageModal;
