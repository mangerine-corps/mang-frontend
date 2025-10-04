import { Box, HStack, Input, Stack, Text, VStack } from "@chakra-ui/react";
import { Calendar } from "react-date-range";
import { useEffect, useRef, useState } from "react";
import { FaCalendar } from "react-icons/fa6";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelect from "mangarine/components/customcomponents/select";
import { Controller, useForm, useWatch } from "react-hook-form";
import { SelectOptions } from "mangarine/types";
import UpcomingAppointmentTable from "../mybusiness/upcomingappointmenttable";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { useFetchUpcomingConsultationsMutation, useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { useDispatch } from "react-redux";
import { setAppointments } from "mangarine/state/reducers/appointment.reducer";
import { useAppointment } from "mangarine/state/hooks/appointment.hook"; // theme css file
import { useAuth } from "mangarine/state/hooks/user.hook";
import { isEmpty, uniqBy } from "es-toolkit/compat";
import CustomInput from "mangarine/components/customcomponents/Input";
import { useClickAway } from "react-use";
import { format, addDays } from "date-fns";

const Schema = Yup.object().shape({
  advance: Yup.array().of(Yup.string()).min(1, "advance is required"),
  status: Yup.array().of(Yup.string()).min(1, "Status is required"),
});
const status = [
  {
    id: "1",
    label: "UPCOMING",
    value: "UPCOMING",
  },
  {
    id: "3",
    label: "COMPLETED",
    value: "COMPLETED",
  },
  {
    id: "4",
    label: "CANCELLED",
    value: "CANCELLED",
  },
  {
    id: "5",
    label: "EXPIRED",
    value: "EXPIRED",
  },
];
const UpcomingAppointments = () => {
  const [dateTo, setDateTo] = useState<Date | null>(addDays(new Date(), 7));
  const [dateFrom, setDateFrom] = useState<Date | null>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showTo, setShowTo] = useState(false);
  const [timeOptions, setTimeOptions] = useState<SelectOptions[]>([]);
  const dispatch = useDispatch();
  const [filterStatus, setFilterStatus] = useState("UPCOMING");
  const { appointments } = useAppointment();
  const { user } = useAuth();
  const fromRef = useRef(null);
  useClickAway(fromRef, () => {
    setShowCalendar(false);
  });
  const toRef = useRef(null);
  useClickAway(toRef, () => {
    setShowTo(false);
  });

  const [page, setPage] = useState(1);
  // When true, we use the query hook; initially false so we use mutation on load
  const [useQueryForFilters, setUseQueryForFilters] = useState(false);
  // Prepare query params for upcoming consultations, including optional from/to when both are set
  const fromStr = dateFrom ? format(dateFrom as any, "yyyy-MM-dd") : undefined;
  const toStr = dateTo ? format(dateTo as any, "yyyy-MM-dd") : undefined;
  const shouldFetch = Boolean(fromStr && toStr);
  const queryParams = {
    page,
    limit: 10,
    status: filterStatus,
    ...(shouldFetch ? { from: fromStr, to: toStr } : {}),
  } as const;
  const { data: upcomingResp, isLoading: isQueryLoading } = useGetUpcomingConsultationQuery(queryParams, { skip: !shouldFetch || !useQueryForFilters });
  const [fetchUpcoming, { data: upcomingRespMut, isLoading: isMutationLoading }] = useFetchUpcomingConsultationsMutation();
  // Sync filter from the select to the query param
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
  const selectedStatus = useWatch({ control, name: "status" });
  useEffect(() => {
    if (selectedStatus && selectedStatus[0]) {
      setFilterStatus(selectedStatus[0]);
      setPage(1);
      // Switch to query mode when user applies filter
      setUseQueryForFilters(true);
    }
  }, [selectedStatus]);
  useEffect(() => {
    if (!upcomingResp) return;
    // Normalize various possible response shapes
    // Try: { data: [...], total, page, totalPages }
    // Or: { data: { data: [...], total, page, totalPages } }
    // Or: { items: [...], pagination: { total, page, totalPages } }
    const root: any = upcomingResp as any;
    const nested: any = root?.data && !Array.isArray(root.data) ? root.data : undefined;
    let dataArray: any[] = Array.isArray(root?.data)
      ? root.data
      : Array.isArray(nested?.data)
      ? nested.data
      : Array.isArray(root?.items)
      ? root.items
      : Array.isArray(root?.consultations)
      ? root.consultations
      : Array.isArray(nested?.consultations)
      ? nested.consultations
      : [];

    // If each element is wrapped like { consultation: {...} }, unwrap it
    if (dataArray.length && dataArray.every((x: any) => x && typeof x === 'object' && 'consultation' in x)) {
      dataArray = dataArray.map((x: any) => x.consultation);
    }

    const total = (root?.total ?? nested?.total ?? root?.pagination?.total ?? nested?.pagination?.total) as number | undefined;
    const currentPage = (root?.page ?? nested?.page ?? root?.pagination?.page ?? nested?.pagination?.page) as number | undefined;
    const totalPages = (root?.totalPages ?? nested?.totalPages ?? root?.pagination?.totalPages ?? nested?.pagination?.totalPages) as number | undefined;

    // Guard: if pagination hasn't changed, skip dispatch to avoid loop
    const prevPage = (appointments as any)?.pagination?.page;
    const prevTotal = (appointments as any)?.pagination?.total;
    const hasNumbers = typeof currentPage === 'number' && typeof total === 'number';
    if (hasNumbers && prevPage === currentPage && prevTotal === total) {
      return;
    }

    const pagination = {
      total,
      page: currentPage,
      totalPages,
    };

    // Replace list on first page or when filter changed (page reset to 1)
    const merged = page === 1
      ? dataArray
      : ([...(appointments.appointments || []), ...dataArray] as any[]);

    const uniqueAppts = uniqBy(merged, (appointment: any) => appointment.id);
    const upcomingData = {
      appointments: uniqueAppts,
      pagination,
    };
    dispatch(setAppointments({ ...upcomingData }));
  }, [upcomingResp, page, dispatch]);

  // Handle mutation response with same normalization logic
  useEffect(() => {
    if (!upcomingRespMut) return;
    const root: any = upcomingRespMut as any;
    const nested: any = root?.data && !Array.isArray(root.data) ? root.data : undefined;
    let dataArray: any[] = Array.isArray(root?.data)
      ? root.data
      : Array.isArray(nested?.data)
      ? nested.data
      : Array.isArray(root?.items)
      ? root.items
      : Array.isArray(root?.consultations)
      ? root.consultations
      : Array.isArray(nested?.consultations)
      ? nested.consultations
      : [];

    if (dataArray.length && dataArray.every((x: any) => x && typeof x === 'object' && 'consultation' in x)) {
      dataArray = dataArray.map((x: any) => x.consultation);
    }

    const total = (root?.total ?? nested?.total ?? root?.pagination?.total ?? nested?.pagination?.total) as number | undefined;
    const currentPage = (root?.page ?? nested?.page ?? root?.pagination?.page ?? nested?.pagination?.page) as number | undefined;
    const totalPages = (root?.totalPages ?? nested?.totalPages ?? root?.pagination?.totalPages ?? nested?.pagination?.totalPages) as number | undefined;

    const prevPage = (appointments as any)?.pagination?.page;
    const prevTotal = (appointments as any)?.pagination?.total;
    const hasNumbers = typeof currentPage === 'number' && typeof total === 'number';
    if (hasNumbers && prevPage === currentPage && prevTotal === total) {
      return;
    }

    const pagination = {
      total,
      page: currentPage,
      totalPages,
    };

    const merged = page === 1
      ? dataArray
      : ([...(appointments.appointments || []), ...dataArray] as any[]);

    const uniqueAppts = uniqBy(merged, (appointment: any) => appointment.id);
    const upcomingData = {
      appointments: uniqueAppts,
      pagination,
    };
    dispatch(setAppointments({ ...upcomingData }));
  }, [upcomingRespMut, page, dispatch]);
  // When either date changes, reset to first page. Fetch will be skipped until both are set.
  useEffect(() => {
    setPage(1);
    // Switch to query mode when user adjusts date range
    setUseQueryForFilters(true);
  }, [dateTo, dateFrom]);

  // On initial load and whenever page changes in mutation mode, fetch via mutation
  useEffect(() => {
    if (!shouldFetch) return;
    if (!useQueryForFilters) {
      fetchUpcoming(queryParams as any);
    }
  }, [page, shouldFetch, useQueryForFilters, filterStatus, fromStr, toStr]);
  //   ? (appointments?.appointments || []).filter((appointment) => {
  //       return (
  //         appointment.status.toLowerCase() === selectedStatus
  //       );
  //     })
  //   : appointments.appointments || [];

  // First filter by status
  const filteredByStatus = selectedStatus
    ? (appointments.appointments || []).filter((appointment: any) =>
        isEmpty(selectedStatus) ? appointment : appointment?.status === selectedStatus[0]
      )
    : (appointments.appointments || []);

  // Then filter by name based on the current user's relation to the appointment
  const term = (searchTerm || "").toLowerCase().trim();
  const filteredAppointments = filteredByStatus.filter((appt: any) => {
    if (!term) return true;
    const counterpart = user?.id === appt?.consultant?.id ? appt?.user : appt?.consultant;
    const name = (counterpart?.fullName || "").toLowerCase();
    return name.includes(term);
  });

  const appointmentsForTable = {
    appointments: filteredAppointments,
    pagination: (appointments as any)?.pagination,
  };




  return (
    <Box
      w="full"
      mx="auto"
      // p={4}
      h="full"
      // boxShadow="md"
      borderRadius="md"
      // overflowX={'auto'}
      // bg="main_background"
    >
      <HStack w="full"  bg="bg_box" mb="3" p="4" rounded={"lg"}>
        <VStack mt={1.5} w="full" alignItems={"flex-start"} pb="4">
          <Text color="text_primary" fontSize={"0.75rem"}>
            From
          </Text>
          <HStack
            w="full"
            borderWidth={"1px"}
            rounded="md"
            py="7px"
            px="2"
            pos="relative"
            justifyContent={"space-between"}
            alignItems={"center"}
            borderColor="input_border"
            onClick={() => {
              setShowCalendar(!showCalendar);
            }}
          >
            <Text
              color={dateFrom ? "text_primary" : "grey.150"}
              fontSize={"14px"}
            >
              {dateFrom ? format(dateFrom, "yyyy-MM-dd") : "Select Date"}
            </Text>{" "}
            <Text color="grey.300">
              <FaCalendar />
            </Text>
          </HStack>
          {showCalendar && (
            <Stack
              ref={fromRef}
              zIndex={"max"}
              pos="absolute"
              shadow={"md"}
              top="40"
            >
              <Calendar
                onChange={(item) => {
                  setDateFrom(item);
                  setShowCalendar(false);
                }}
                color="black"
                //   locale={locales[locale]}
                date={dateFrom}
              />
            </Stack>
          )}
        </VStack>
        <VStack mt={1.5} w="full" alignItems={"flex-start"} pb="4">
          <Text color="text_primary" fontSize={"0.75rem"}>
            To
          </Text>
          <HStack
            w="full"
            borderWidth={"1px"}
            rounded="md"
            py="7px"
            px="2"
            justifyContent={"space-between"}
            alignItems={"center"}
            borderColor="input_border"
            onClick={() => {
              setShowTo(!showTo);
            }}
          >
            <Text
              color={dateTo ? "text_primary" : "grey.150"}
              fontSize={"14px"}
            >
              {dateTo ? format(dateTo, "yyyy-MM-dd") : "Select Date"}
            </Text>{" "}
            <Text color="grey.300">
              <FaCalendar />
            </Text>
          </HStack>

          {showTo && (
            <Stack
              ref={toRef}
              zIndex={"max"}
              pos="absolute"
              shadow={"md"}
              top="40"
            >
              <Calendar
                onChange={(item) => {
                  setDateTo(item);
                  setShowTo(false);
                }}
                color="black"
                //   locale={locales[locale]}
                date={dateTo}
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
                <Stack>
                  <CustomSelect
                    // collection={[]}
                    id={"status"}
                    placeholder="Filter Appointment"
                    name={"status"}
                    size="sm"
                    options={status}
                    label="         Status"
                    value={value}
                    bg="main_background"
                    required={false}
                    error={{}}
                    onChange={onChange}
                  />
                </Stack>
              )}
            />
          </Stack>
        </VStack>
        <VStack
          mt={2.5}
          w="full"
          gap={0}
          spaceY={0}
          alignItems={"flex-start"}
          pb="4"
        >
          <Text color="text_primary" fontSize={"0.75rem"}>
            Name
          </Text>

          {/* <Image src="/Icons/searchSvg.svg" alt="Search" /> */}
          <CustomInput
            size="sm"
            name="search"
            // flex="2"
            placeholder="Search Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e)}
          />
        </VStack>
      </HStack>

      <UpcomingAppointmentTable
        isLoading={isQueryLoading || isMutationLoading}
        appointments={appointmentsForTable}
        onPageChange={(p: number) => {
          setPage(p);
        }}
      />

      {/* <AppointmentDetails />
            <FollowUp />
            <FollowupSchedule />
            <BookingCalendar /> */}
    </Box>
  );
};
export default UpcomingAppointments;
