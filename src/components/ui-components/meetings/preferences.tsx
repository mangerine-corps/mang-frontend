import {Box, Button, HStack, Input, Stack, Text} from "@chakra-ui/react";
import {outfit} from "mangarine/pages/_app";
import * as Yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import CustomSelect from "mangarine/components/customcomponents/select";
import {SelectOptions} from "mangarine/types";
import CustomButton from "mangarine/components/customcomponents/button";


const meetingSchema = Yup.object().shape({
    advance: Yup.array().of(Yup.string()).min(1, "advance is required"),
    time: Yup.array().of(Yup.string()).min(1, "Time is required"),
    limit: Yup.number()
});
const advanceType = [
    {
        id: "1",
        label: "12 Hours",
        value: "12 Hours",
    },
    {
        id: "2",
        label: "24 Hours",
        value: "12 Hours",
    },
    {
        id: "3",
        label: "No Notice",
        value: "12 Hours",
    },

];
const meetingTime = [
    {
        id: "1",
        label: "1 Hour",
        value: "1 Hour",
    },
    {
        id: "2",
        label: "4 Hour",
        value: "4 Hour",
    },
    {
        id: "3",
        label: "6 Hour",
        value: "6 Hour",
    },
];
const Preferences = () => {
    const [advanceOptions, setadvanceOptions] = useState<SelectOptions[]>([]);
    const [counter, setCounter] = useState(0);
    const [timeOptions, setTimeOptions] = useState<SelectOptions[]>([]);

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(meetingSchema),
        defaultValues: {
            advance: [],
            time: [],
            limit: counter,
        },
    });
    const onSubmit = () => {
        console.log("here");
    };
    // Handle increment
    const increment = () => {
        setCounter((prevCount) => prevCount + 1);
    };

    // Handle decrement
    const decrement = () => {
        setCounter((prevCount) => prevCount - 1);
    };
    return (
        <Box
            w="100%"
            mx="auto"
            minH={'full'}
            px={4}
            className={outfit.className}
            boxShadow="md"
            borderRadius="md"
            bg="main_background"
            py="5"
        >
            <Text
                fontWeight="600"
                lineHeight={"36px"}
                fontSize="1.5rem"
                color="text_primary"
                pb="4"
            >
                Meeting Preference
            </Text>
            <Text
                fontWeight="500"
                lineHeight={"30px"}
                fontSize="1.25rem"
                py="3"
                color="text_primary"
            >
                Advance Notice
            </Text>

            <Stack w="full">
                <Controller
                    name="advance"
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <CustomSelect
                            id={"advanceNotice"}
                            placeholder="Select advance notice hour"
                            name={"who are you"}
                            size="md"
                            options={advanceType}
                            label="          How much notice do you want before meeting"
                            value={value}
                            bg="main_background"
                            required={false}
                            error={errors.advance}
                            onChange={onChange}
                        />
                    )}
                />
            </Stack>
            <Text
                fontWeight="500"
                lineHeight={"30px"}
                fontSize="1.25rem"
                py="3"
                color="text_primary"
            >
                Meeting Buffer
            </Text>

            <Stack w="full">
                <Controller
                    name="time"
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <CustomSelect
                            id={"meetingTime"}
                            placeholder="Select meeting buffer time"
                            name={"meeting time"}
                            size="md"
                            options={meetingTime}
                            label="         Set time between meeting"
                            value={value}
                            bg="main_background"
                            required={false}
                            error={errors.time}
                            onChange={onChange}
                        />
                    )}
                />
            </Stack>
            <Stack w="full">
                <Controller
                    name="time"
                    control={control}
                    render={({field: {onChange, value}}) => (
                        <HStack>
                            {/* <Input
                type="button"
                onClick={() => {
                  increment();
                  onChange(counter + 1); // Update form value on increment
                }}
              >
                Increment
              </Input>
              <Input
                type="button"
                onClick={() => {
                  decrement();
                  onChange(counter - 1); // Update form value on decrement
                }}
              >
                Decrement
              </Input> */}
                        </HStack>
                    )}
                />
            </Stack>
            <Text
                fontWeight="500"
                lineHeight={"30px"}
                fontSize={{base:"1rem",md:"1rem",lg:"1.25rem"}}
                py="3"
                color="text_primary"
            >
                Daily Limit
            </Text>
            <Controller
                name="limit"
                control={control}
                render={({field: {onChange, value}}) => (
                    <HStack spaceX="1">
                        <Button
                            variant={"outline"}
                            type="button"
                            fontSize={"1rem"}
                            bg="main_background"
                            onClick={() => {
                                decrement();
                                onChange(counter - 1); // Update form value on decrement
                            }}
                        >
                            -
                        </Button>
                        <Text color="text_primary">{counter}</Text>
                        <Button
                            type="button"
                            variant={"outline"}
                            bg="main_background"
                            fontSize={"1rem"}
                            onClick={() => {
                                increment();
                                onChange(counter + 1); // Update form value on increment
                            }}
                        >
                            <Text color="text_primary">
                                +
                            </Text>
                        </Button>
                        {/* <input type="hidden" {...field} value={counter} /> */}
                    </HStack>
                )}
            />
            <CustomButton
                customStyle={{
                    w: "full",
                    mt: "8",
                }}
                onClick={handleSubmit(onSubmit, (error) => console.log(error))}
            >
                <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                >
                    Save Changes
                </Text>
            </CustomButton>
        </Box>
    );
}

export default Preferences