import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  HStack,
  Portal,
  Menu,
  Image,
  Table,
  Skeleton,
  Pagination,
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import UpcomingAppointmentView from "./modals/uppcomingappointmentview";
import { FaEllipsisV, FaFilter, FaHamburger, FaUpload } from "react-icons/fa";
import { LuChevronLeft, LuChevronRight, LuListFilter, LuUpload } from "react-icons/lu";
import { MdOutlineFileUpload } from "react-icons/md";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { BiComment } from "react-icons/bi";
import { CgEyeAlt } from "react-icons/cg";
import { format } from "date-fns";
import { useCreateConversationMutation } from "mangarine/state/services/apointment.service";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { isEmpty, size, uniqBy } from "es-toolkit/compat";
import {
  setConversations,
  setCurrentConversation,
} from "mangarine/state/reducers/appointment.reducer";

const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "green.500";
    case "RESCHEDULED":
      return "orange.400";
    case "CANCELLED":
      return "red.500";
    default:
      return "yellow.500";
  }
};

const TableRowRenderer = ({ appointment }: { appointment: any }) => {
  const [profile, setProfile] = useState<any>({});
  const [details, setDetails] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();

  const { appointments, conversations, currentConversation } = useAppointment();
  const { appointments: upcoming } = appointments;
  const [createConversation, { isLoading }] = useCreateConversationMutation();
  const dispatch = useDispatch();

  const handleCreateConversation = (appointmentId) => {
    const appointment = upcoming.find(
      (appointment) => appointment.id === appointmentId
    );
    const formData = {
      appointmentId: appointment.id,
      participantId:
        user.id === appointment.consultant.id
          ? appointment.user.id
          : appointment.consultant.id,
    };
    createConversation(formData)
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        const newConversations = isEmpty(conversations)
          ? [data]
          : [...conversations, data];
        dispatch(
          setConversations({
            conversations: uniqBy(
              newConversations,
              (conversation: any) => conversation.id
            ),
          })
        );
        dispatch(setCurrentConversation({ conversation: data }));
        router.push({ pathname: "/message", query: { conversationId: data.id } });
      })
      .catch((error) => {
        console.log(error);
      });
    };

    useEffect(() => {
      if (user.id === appointment.user.id) {
        setProfile(appointment.consultant);
      } else {
        setProfile(appointment.user);
      }
    }, [appointment, user]);
  return (
    <Table.Row my={12} bg="bg_box" key={appointment.id}>
      <Table.Cell
        font="outfit"
        color="text_primary"
        fontSize="0.875rem"
        fontWeight="400"
        p="4"
      >
        <Text>{profile.fullName}</Text>
      </Table.Cell>
      <Table.Cell color="gray.600">
        {format(new Date(appointment.availability.date), "MMMM, do ")}{" "}
        {size(appointment.timeslots) > 0 ? appointment.timeslots[0].startTime : ""}
      </Table.Cell>
      <Table.Cell fontWeight="medium">
        <Text
          as={"span"}
          px={2}
          py={1}
          rounded="full"
          borderColor={getStatusColor(appointment.status)}
          color={getStatusColor(appointment.status)}
          borderWidth={1}
        >
          {appointment.status}
        </Text>
      </Table.Cell>
      <Table.Cell textAlign="end" pr="6">
        <Menu.Root>
          <Menu.Trigger border={"none"} asChild>
            <Button shadow="xs" variant="outline" px="1" py="1">
              <Text fontSize={"0.825rem"} color="text_primary">
                <FaEllipsisV />
              </Text>
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item
                  p={2}
                  onClick={() => {
                    setDetails(true);
                  }}
                  value="view"
                >
                  <CgEyeAlt />
                  <Text>{"View"}</Text>
                </Menu.Item>
                <Menu.Item
                  p={2}
                  onClick={() => {
                    handleCreateConversation(appointment.id);
                  }}
                  value="message"
                >
                  <BiComment />
                  <Text>{"Message"}</Text>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Table.Cell>
      {details && (
        <UpcomingAppointmentView

          info={appointment} isOpen={details}
          onOpenChange={() => {
            setDetails(false);
          }}
        />
      )}
    </Table.Row>
  );
};

const UpcomingAppointmentTable = ({ appointments, isLoading, onPageChange }: { appointments: any, isLoading?: boolean, onPageChange?: (p: number) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-az");
  const [currentPage, setCurrentPage] = useState(5);
  const limit = 10;

  const { appointments: upcoming, pagination } = appointments;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? 0;
  const page = pagination?.page ?? 1;

  const sortOptions = [
    { value: "name-az", label: "Client's name (A - Z)" },
    { value: "name-za", label: "Client's name (Z - A)" },
    { value: "latest-oldest", label: "Latest - oldest" },
    { value: "oldest-latest", label: "Oldest - latest" },
  ];

  const getSortLabel = (value) =>
    sortOptions.find((option) => option.value === value)?.label || "Sort by";

  useEffect(() => {
  }, [upcoming]);

  return (
    <Box w="full" h="full" p={6} bg="bg_box" rounded={"lg"}>
      <Table.Root size="lg">
        <Table.Header w="full">
          <Table.Row bg="bg_box">
            <Table.ColumnHeader
              font="outfit"
              color="text_primary"
              fontSize="0.875rem"
              fontWeight="600"
              p="4"
            >
              {`CLIENT'S NAME`}
            </Table.ColumnHeader>
            <Table.ColumnHeader
              font="outfit"
              color="text_primary"
              fontSize="0.875rem"
              fontWeight="600"
              p="4"
            >
              DATE & TIME
            </Table.ColumnHeader>
            <Table.ColumnHeader
              font="outfit"
              color="text_primary"
              fontSize="0.875rem"
              fontWeight="600"
              p="4"
            >
              STATUS
            </Table.ColumnHeader>
            <Table.ColumnHeader
              font="outfit"
              textAlign="end"
              pr="6"
              color="text_primary"
              fontSize="0.875rem"
              fontWeight="600"
              p="4"
            >
              ACTION
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body w="full">
          {isLoading ? (
            <Skeleton />
          ) : (
            <>{
              isEmpty(upcoming) ? (
                <Table.Row  >
                  <Table.Cell py={4} colSpan={10}>
                    <Text textAlign="center" w='full' >No appointments found</Text>
                  </Table.Cell>

                </Table.Row>
              ) : (
                upcoming.map((appt) => (
                  <TableRowRenderer appointment={appt} key={appt.id} />
                )))
            }</>
          )}
        </Table.Body>
      </Table.Root>

      {
        totalPages > 1 && (
          <HStack justify="center" py={4}>
            <Pagination.Root count={totalItems} pageSize={limit} page={page} key={'md'}>
              <ButtonGroup variant="ghost" size={'md'}>
                <Pagination.PrevTrigger asChild>
                  <IconButton disabled={page <= 1} onClick={() => onPageChange?.(Math.max(1, page - 1))}>
                    <LuChevronLeft />
                  </IconButton>
                </Pagination.PrevTrigger>

                <Pagination.Items
                  render={(pg) => (
                    <IconButton onClick={() => onPageChange?.(pg.value)} variant={{ base: "ghost", _selected: "outline" }}>
                      {pg.value}
                    </IconButton>
                  )}
                />

                <Pagination.NextTrigger asChild>
                  <IconButton disabled={page >= totalPages} onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}>
                    <LuChevronRight />
                  </IconButton>
                </Pagination.NextTrigger>
              </ButtonGroup>
            </Pagination.Root>
          </HStack>
        )
      }

    </Box>
  );
};

export default UpcomingAppointmentTable;
