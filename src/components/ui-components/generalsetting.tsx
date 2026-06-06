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
import { TIME_ZONE_OPTIONS, normalizeTimeZoneValue } from "mangarine/lib/timezone-options";
import { useDispatch } from "react-redux";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { setUpdatedInfo } from "mangarine/state/reducers/auth.reducer";

const langOptions = [
  { id: '1', label: "English", value: "English" },
  { id: '2', label: "Chinese", value: "Chinese" },
];

const Schema = Yup.object().shape({
  language: Yup.array().of(Yup.string()).min(1, ""),
  time: Yup.array().of(Yup.string()).min(1, ""),
});

const GeneralSetting = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
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
      if (server.uiLanguage) setValue("language", Array.isArray(server.uiLanguage) ? server.uiLanguage : [server.uiLanguage]);
      const normalizedTimeZone = normalizeTimeZoneValue(server.timeZone);
      if (normalizedTimeZone) setValue("time", [normalizedTimeZone]);
    }
  }, [server, setValue]);

  const toStr = (val: any): string => {
    if (!val) return "";
    if (Array.isArray(val)) return val.filter(Boolean).join(",");
    return String(val);
  };

  const save = async (nextValues?: Partial<{ language: string[]; time: string[] }>) => {
    const form = { ...getValues(), ...nextValues };
    const uiLanguage = toStr(form.language);
    const timeZone = normalizeTimeZoneValue(toStr(form.time));

    try {
      const res = await updateGeneral({
        uiLanguage,
        timeZone,
      }).unwrap();
      if (user) {
        dispatch(setUpdatedInfo({
          updatedInfo: {
            ...user,
            uiLanguage,
            timeZone,
            timezone: timeZone,
          },
        }));
      }
      toaster.create({
        type: "success",
        title: "Saved",
        description: res?.message || "Settings updated.",
        closable: true,
      });
      refetch();
    } catch (err: any) {
      toaster.create({
        type: "error",
        title: "Failed",
        description: err?.data?.message || err?.message || "Something went wrong",
        closable: true,
      });
    }
  };

  return (
    <Flex direction="column" align="flex-start" justify="flex-start" h="full" w="full">
      <Box w="full" h="full" p={{ base: 4, md: 8 }} borderRadius="lg" boxShadow="lg" bg="bg_box">
        <HStack justify="space-between" mb={4}>
          <Text
            fontSize={{ base: "1rem", md: "1.4rem" }}
            fontWeight="600"
            lineHeight="1.4"
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
          fontSize={{ base: "0.875rem", md: "1.1rem" }}
          fontWeight="600"
          lineHeight="1.4"
          font="outfit"
          color="text_primary"
          mb={3}
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
              onChange={(val) => { onChange(val); save({ language: val }); }}
            />
          )}
        />

        <Text
          fontSize={{ base: "0.875rem", md: "1.1rem" }}
          fontWeight="600"
          lineHeight="1.4"
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
              options={TIME_ZONE_OPTIONS as any}
              label="Default Time Zone"
              isMulti={false}
              value={value}
              required={false}
              error={errors.time}
              onChange={(val) => {
                const normalizedTime = Array.isArray(val)
                  ? val.map((item) => normalizeTimeZoneValue(item)).filter(Boolean)
                  : [];
                onChange(normalizedTime);
                save({ time: normalizedTime });
              }}
            />
          )}
        />

        <Text
          fontSize={{ base: "0.875rem", md: "1.1rem" }}
          fontWeight="600"
          lineHeight="1.4"
          font="outfit"
          color="text_primary"
          mt={6}
          mb={4}
        >
          Interface Theme
        </Text>

        <HStack gap={6} align="flex-start" py={4}>
          <ColorModeButton />
        </HStack>
      </Box>
    </Flex>
  );
};

export default GeneralSetting;
