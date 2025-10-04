
import {
  Box,
  Text,
  VStack,
  Image,
  HStack, // ✅ added missing Image
} from "@chakra-ui/react";

import CustomSelect from "../customcomponents/select";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { HStack as HX, Button, Spinner } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useGetGeneralSettingsQuery, useUpdateGeneralSettingsMutation } from "mangarine/state/services/settings.service";
import { ColorModeButton } from "../ui/color-mode";
import { toaster } from "../ui/toaster";

// Define time zone options
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
  // time: Yup.string().required("Time zone is required"),
});

const GeneralSetting = () => {
  const { data, isLoading, isFetching, refetch } = useGetGeneralSettingsQuery();
  const [updateGeneral, { isLoading: saving }] = useUpdateGeneralSettingsMutation();
  const server = useMemo(() => (data as any)?.data || {}, [data]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      language: [],
      // userType: [],
      time: [],
    },
  });

  useEffect(() => {
    if (server) {
      if (server.uiLanguage) setValue("language", server.uiLanguage);
      if (server.timeZone) setValue("time", server.timeZone);
      // interfaceTheme can be handled when theme selection is wired
    }
  }, [server, setValue]);

  const onSave = () => {
    const form = getValues();

    const res = {
      uiLanguage: form.language.join(","),
      timeZone: form.time.join(","),
    }
    updateGeneral(res).then((res) => {
      const {data} =res
      console.log(res, "res")
      toaster.create({
        type: "success",
        title: "Success",
        description: data?.message,
        closable: true,
      });
    }).catch((err: any) => {
      toaster.create({
        type: "error",
        title: "Failed",
        description: err?.message || "Something went wrong",
        closable: true,
      })
    })

  }


  return (
    <Box w="full" p={8} borderRadius="lg" boxShadow="lg" bg="bg_box" mt={{ base: 4, md: 8, lg: 0, xl: "flex" }}>
      <HX justify="space-between" mb={4}>
        <Text fontSize={{ base: "1rem", md: "1.3rem" }} fontWeight="600" lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px", }} font="outfit" color="text_primary">
          General Settings
        </Text>

      </HX>
      {(isLoading || isFetching) && (
        <HX py={2}><Spinner size="sm" /><Text ml={2}>Loading...</Text></HX>
      )}
      <Text fontSize={{ base: "1rem", md: "1.1rem" }} fontWeight="600" lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px", }} font="outfit" color="text_primary" mb={6}>
        Language Preference
      </Text>

      {/* Language Dropdown */}
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
            onChange={onChange}
          />
        )}
      />

      <Text fontSize={{ base: "1rem", md: "1.1rem" }} fontWeight="600" lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px", }} font="outfit" color="text_primary" my={6}>
        Time Zone
      </Text>

      {/* Time Zone Dropdown */}
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
            onChange={onChange}
          />
        )}
      />

      <Text fontSize={{ base: "1rem", md: "1.1rem" }} fontWeight="600" lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px", }} font="outfit" color="text_primary" mt={10} mb={8}>
        Interface Theme
      </Text>

      <HStack gap={6} align="flex-start" py="12">
        <ColorModeButton />

      </HStack>
      <Button size="sm" px={4} mt="12" colorScheme="blue" onClick={onSave} loading={saving}>Save Changes</Button>
    </Box>
  );
};

export default GeneralSetting;
