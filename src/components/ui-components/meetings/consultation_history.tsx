import { Box, HStack, Input, Stack, Text, VStack } from "@chakra-ui/react";
import AppointmentTable from "../appointmenttable";
import { Calendar } from "react-date-range";
import { useEffect, useState } from "react";
import { FaCalendar } from "react-icons/fa6";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelect from "mangarine/components/customcomponents/select";
import { Controller, useForm } from "react-hook-form";
import { SelectOptions } from "mangarine/types";


const Schema = Yup.object().shape({
  advance: Yup.array().of(Yup.string()).min(1, "advance is required"),
  status: Yup.array().of(Yup.string()).min(1, "Status is required"),

});
const status = [
  {
    id: "1",
    label: "Pending",
    value: "Pending",
  },
  {
    id: "2",
    label: "Ongoing",
    value: "Ongoing",
  },
  {
    id: "3",
    label: "Completed",
    value: "Completed",
  },
  {
    id: "4",
    label: "Cancelled",
    value: "Cancelled",
  },
];
const ConsultationHistory = () => {
    const [date, setDate] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false)
    const [searchTerm, setSearchTerm] = useState<string>("")
     const [showTo, setShowTo] = useState(false);
       const [timeOptions, setTimeOptions] = useState<SelectOptions[]>([]);
    useEffect(() => {
    console.log(date, "date")
    }, [date])
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      advance: [],
      status: [],

    },
  });
  const onSubmit = () => {
    console.log("here");
  };
    return (
      <Box
        w="100%"
        mx="auto"
        // p={4}
        boxShadow="md"
        borderRadius="md"
        // bg="main_background"
      >
        <HStack w="full" h="full" bg="bg_box" mb="6" p="4" rounded={"lg"}>
          <VStack w="full" alignItems={"flex-start"} pb="4">
            <Text>From</Text>
            <HStack
              w="full"
              borderWidth={"1.5px"}
              rounded="lg"
              py="2"
              px="2"
              pos="relative"
              justifyContent={"space-between"}
              alignItems={"center"}
              borderColor="grey.300"
              onClick={() => {
                setShowCalendar(!showCalendar);
              }}
            >
              <Text></Text>{" "}
              <Text color="grey.300">
                <FaCalendar />
              </Text>
            </HStack>
            {showCalendar && (
              <Stack pos="absolute" top="60" maxW="200px">
                <Calendar
                  onChange={(item) => setDate(item)}
                  //   locale={locales[locale]}
                  date={date}
                />
              </Stack>
            )}
          </VStack>
          <VStack w="full" alignItems={"flex-start"} pb="4">
            <Text>To</Text>
            <HStack
              w="full"
              borderWidth={"1.5px"}
              rounded="lg"
              py="2"
              px="2"
              justifyContent={"space-between"}
              alignItems={"center"}
              borderColor="grey.300"
              onClick={() => {
                setShowTo(!showTo);
              }}
            >
              <Text></Text>{" "}
              <Text color="grey.300">
                <FaCalendar />
              </Text>
            </HStack>

            {showTo && (
              <Stack pos="absolute" top="60" maxW="200px">
                <Calendar
                  onChange={(item) => setDate(item)}
                  //   locale={locales[locale]}
                  date={date}
                />
              </Stack>
            )}
          </VStack>
          <VStack w="full" alignItems={"flex-start"}>
            <Stack w="full">
              <Controller
                name="status"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    id={"status"}
                    placeholder="Select meeting buffer time"
                    name={"meeting time"}
                    size="sm"
                    options={status}
                    label="         Status"
                    value={value}
                    bg="main_background"
                    required={false}
                    error={{}}
                    onChange={onChange}
                  />
                )}
              />
            </Stack>
          </VStack>
          <VStack w="full" alignItems={"flex-start"} pb="4">
            <Text>Name</Text>
            <HStack
              borderWidth="1.5px"
              rounded="lg"
              borderColor="grey.300"
              px="3"
              w={{ base: "full", md: "full" }}
            >
              {/* <Image src="/Icons/searchSvg.svg" alt="Search" /> */}
              <Input
                size="xs"
                outline={"none"}
                focusRing={"none"}
                border="none"
                alignItems={"center"}
                justifyContent={"flex-start"}
                // flex="2"
                placeholder="Search Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </HStack>
          </VStack>
        </HStack>
        <AppointmentTable />
        {/* <AppointmentDetails />
            <FollowUp />
            <FollowupSchedule />
            <BookingCalendar /> */}
      </Box>
    );
}
export default ConsultationHistory;