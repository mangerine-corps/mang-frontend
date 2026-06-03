import {
  Box,
  Text,
  HStack,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import CustomSelect from "../customcomponents/select";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { useEffect, useMemo } from "react";
import { useGetGeneralSettingsQuery, useUpdateGeneralSettingsMutation } from "mangarine/state/services/settings.service";
import { ColorModeButton } from "../ui/color-mode";
import { toaster } from "../ui/toaster";

const timeZoneOptions = [
  { id: '1', label: "(UTC-8:00) Pacific Time", value: "(UTC-8:00) Pacific Time" },
  { id: '2', label: "(UTC+1:00) West Africa Time", value: "(UTC+1:00) West Africa Time" },
  { id: '3', label: "(UTC+0:00) GMT", value: "(UTC+0:00) GMT" },
];

const langOptions = [
  { id: '1', label: "English", value: "English" },
  { id: '2', label: "Chinese", value: "Chinese" },
];

const Schema = Yup.object().shape({
  language: Yup.array().of(Yup.string()).min(1, ""),
  time: Yup.array().of(Yup.string()).min(1, ""),
});

const GeneralSetting = () => {
  const { data, isLoading, isFetching, refetch } = useGetGeneralSettingsQuery();
  const [updateGeneral, { isLoading: saving }] = useUpdateGeneralSettingsMutation();
  const server = useMemo(() => (data as any)?.data || {}, [data]);

  const {
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      language: [],
      time: [],
    },
  });

  useEffect(() => {
    if (server) {
      if (server.uiLanguage) setValue("language", server.uiLanguage);
      if (server.timeZone) setValue("time", server.timeZone);
    }
  }, [server, setValue]);

  const save = () => {
    const form = getValues();
    updateGeneral({
      uiLanguage: form.language.join(","),
      timeZone: form.time.join(","),
    }).then((res) => {
      toaster.create({
        type: "success",
        title: "Saved",
        description: (res as any)?.data?.message || "Settings updated.",
        closable: true,
      });
      refetch();
    }).catch((err: any) => {
      toaster.create({
        type: "error",
        title: "Failed",
        description: err?.message || "Something went wrong",
        closable: true,
      });
    });
  };

  return (
    <Flex direction="column" align="flex-start" justify="flex-start" h="full" w="full">
      <Box w="full" h="full" p={8} borderRadius="lg" boxShadow="lg" bg="bg_box">
        <HStack justify="space-between" mb={4}>
          <Text
            fontSize={{ base: "1.1rem", md: "1.4rem" }}
            fontWeight="600"
            lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px" }}
            font="outfit"
            color="text_primary"
          >
            General Settings
          </Text>
          {saving && <Spinner size="sm" />}
        </HStack>

        {(isLoading || isFetching) && (
          <HStack py={2}><Spinner size="sm" /><Text ml={2}>Loading...</Text></HStack>
        )}

        <Text
          fontSize={{ base: "1.1rem", md: "1.3rem" }}
          fontWeight="600"
          lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px" }}
          font="outfit"
          color="text_primary"
          mb={6}
        >
          Language Preference
        </Text>

        <Controller
          name="language"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomSelect
              id="language"
              placeholder="Language"
              name="Language"
              size="md"
              options={langOptions}
              label="Language"
              isMulti={false}
              value={value}
              required={false}
              error={errors.language}
              onChange={(val) => { onChange(val); save(); }}
            />
          )}
        />

        <Text
          fontSize={{ base: "1.1rem", md: "1.3rem" }}
          fontWeight="600"
          lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px" }}
          font="outfit"
          color="text_primary"
          my={6}
        >
          Time Zone
        </Text>

        <Controller
          name="time"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomSelect
              id="timezone"
              placeholder="Select Time Zone"
              name="Time Zone"
              size="md"
              options={timeZoneOptions}
              label="Default Time Zone"
              isMulti={false}
              value={value}
              required={false}
              error={errors.time}
              onChange={(val) => { onChange(val); save(); }}
            />
          )}
        />

        <Text
          fontSize={{ base: "1.1rem", md: "1.3rem" }}
          fontWeight="600"
          lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px" }}
          font="outfit"
          color="text_primary"
          mt={10}
          mb={8}
        >
          Interface Theme
        </Text>

        <HStack gap={6} align="flex-start" py="12">
          <ColorModeButton />
        </HStack>
      </Box>
    </Flex>
  );
};

export default GeneralSetting;
