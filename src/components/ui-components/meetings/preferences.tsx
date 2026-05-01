import { Box, Button, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomSelect from "mangarine/components/customcomponents/select";
import CustomButton from "mangarine/components/customcomponents/button";
import { useGetPreferencesQuery, useSavePreferencesMutation } from "mangarine/state/services/consultant.service";

const meetingSchema = Yup.object().shape({
    advance: Yup.array().of(Yup.string()).min(1, "Advance notice is required"),
    time:    Yup.array().of(Yup.string()).min(1, "Meeting buffer is required"),
    limit:   Yup.number().min(0),
});

const advanceType = [
    { id: "1", label: "12 Hours",  value: "12 Hours" },
    { id: "2", label: "24 Hours",  value: "24 Hours" },
    { id: "3", label: "No Notice", value: "No Notice" },
];

const meetingTime = [
    { id: "1", label: "1 Hour", value: "1 Hour" },
    { id: "2", label: "4 Hour", value: "4 Hour" },
    { id: "3", label: "6 Hour", value: "6 Hour" },
];

const Preferences = () => {
    const [counter, setCounter] = useState(0);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg]     = useState("");

    const { data: prefData, isLoading: prefLoading } = useGetPreferencesQuery();
    const [savePreferences, { isLoading: isSaving }] = useSavePreferencesMutation();

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(meetingSchema),
        defaultValues: { advance: [], time: [], limit: 0 },
    });

    // Pre-fill form once data loads
    useEffect(() => {
        const prefs = prefData?.data ?? prefData;
        if (!prefs) return;
        const advanceVal = prefs.advanceNotice ? [prefs.advanceNotice] : [];
        const timeVal    = prefs.meetingBuffer  ? [prefs.meetingBuffer]  : [];
        reset({ advance: advanceVal, time: timeVal, limit: prefs.dailyLimit ?? 0 });
        setCounter(prefs.dailyLimit ?? 0);
    }, [prefData, reset]);

    const onSubmit = async (values: any) => {
        setSuccessMsg(""); setErrorMsg("");
        try {
            await savePreferences({
                advanceNotice: values.advance?.[0] ?? "",
                meetingBuffer: values.time?.[0]    ?? "",
                dailyLimit:    counter,
            }).unwrap();
            setSuccessMsg("Preferences saved successfully.");
        } catch {
            setErrorMsg("Failed to save preferences. Please try again.");
        }
    };

    if (prefLoading) {
        return (
            <Box w="full" py={12} display="flex" justifyContent="center">
                <Spinner />
            </Box>
        );
    }

    return (
        <Box
            w="100%"
            mx="auto"
            minH="full"
            px={4}
            className={outfit.className}
            boxShadow="md"
            borderRadius="md"
            bg="main_background"
            py="5"
        >
            <Text fontWeight="600" lineHeight="36px" fontSize="1.5rem" color="text_primary" pb="4">
                Meeting Preference
            </Text>

            {/* Advance Notice */}
            <Text fontWeight="500" lineHeight="30px" fontSize="1.25rem" py="3" color="text_primary">
                Advance Notice
            </Text>
            <Stack w="full">
                <Controller
                    name="advance"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <CustomSelect
                            id="advanceNotice"
                            placeholder="Select advance notice"
                            name="advanceNotice"
                            size="md"
                            options={advanceType}
                            label="How much notice do you want before a meeting?"
                            value={value}
                            bg="main_background"
                            required={false}
                            error={errors.advance}
                            onChange={onChange}
                        />
                    )}
                />
            </Stack>

            {/* Meeting Buffer */}
            <Text fontWeight="500" lineHeight="30px" fontSize="1.25rem" py="3" color="text_primary">
                Meeting Buffer
            </Text>
            <Stack w="full">
                <Controller
                    name="time"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <CustomSelect
                            id="meetingTime"
                            placeholder="Select meeting buffer time"
                            name="meetingTime"
                            size="md"
                            options={meetingTime}
                            label="Set time between meetings"
                            value={value}
                            bg="main_background"
                            required={false}
                            error={errors.time}
                            onChange={onChange}
                        />
                    )}
                />
            </Stack>

            {/* Daily Limit */}
            <Text fontWeight="500" lineHeight="30px" fontSize={{ base: "1rem", md: "1rem", lg: "1.25rem" }} py="3" color="text_primary">
                Daily Limit
            </Text>
            <HStack spaceX="1">
                <Button
                    variant="outline"
                    type="button"
                    fontSize="1rem"
                    bg="main_background"
                    onClick={() => setCounter((p) => Math.max(0, p - 1))}
                >
                    -
                </Button>
                <Text color="text_primary" minW="8" textAlign="center">{counter}</Text>
                <Button
                    type="button"
                    variant="outline"
                    bg="main_background"
                    fontSize="1rem"
                    onClick={() => setCounter((p) => p + 1)}
                >
                    <Text color="text_primary">+</Text>
                </Button>
            </HStack>

            {successMsg && <Text color="green.500" fontSize="sm" mt={3}>{successMsg}</Text>}
            {errorMsg   && <Text color="red.500"   fontSize="sm" mt={3}>{errorMsg}</Text>}

            <CustomButton
                customStyle={{ w: "full", mt: "8" }}
                loading={isSaving}
                onClick={handleSubmit(onSubmit, (err) => console.log(err))}
            >
                <Text color="button_text" fontWeight="600" fontSize="1rem" lineHeight="100%">
                    Save Changes
                </Text>
            </CustomButton>
        </Box>
    );
};

export default Preferences;
