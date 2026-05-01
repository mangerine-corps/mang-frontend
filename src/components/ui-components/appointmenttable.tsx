import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Menu,
  Portal,
  Spinner,
  Text,
  Table,
} from "@chakra-ui/react";
import AppointmentView from "./appointmentdetails";
import { MdOutlineFileUpload } from "react-icons/md";
import { LuListFilter, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useGetConsultationHistoryQuery } from "mangarine/state/services/apointment.service";
import { format } from "date-fns";

const sortOptions = [
  { value: "shortest-longest", label: "Shortest - Longest" },
  { value: "longest-shortest", label: "Longest - Shortest" },
  { value: "duration",         label: "Duration" },
  { value: "client-name",      label: "Client Name" },
  { value: "time",             label: "Time" },
];

const statusColorMap: Record<string, string> = {
  completed:   "#22C55E",
  rescheduled: "#F97316",
  canceled:    "#EF4444",
  cancelled:   "#EF4444",
  pending:     "#9CA3AF",
  upcoming:    "#3B82F6",
  no_show:     "#6B7280",
};

const formatDateTime = (val: string) => {
  if (!val) return "—";
  try { return format(new Date(val), "dd MMM, yyyy | h:mmaaa"); }
  catch { return val; }
};

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "—";

const LIMIT = 10;

type Filters = {
  fromDate?: string;
  toDate?: string;
  status?: string;
  nameSearch?: string;
};

const AppointmentTable = ({ filters = {} }: { filters?: Filters }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy]         = useState("shortest-longest");
  const [page, setPage]             = useState(1);
  const [details, setDetails]       = useState(false);
  const [selected, setSelected]     = useState<any>(null);

  const { data, isLoading, isFetching } = useGetConsultationHistoryQuery({
    page,
    limit:    LIMIT,
    fromDate: filters.fromDate || undefined,
    toDate:   filters.toDate   || undefined,
    status:   filters.status && filters.status !== "Pending" ? filters.status : undefined,
    name:     filters.nameSearch || searchTerm || undefined,
    sortBy,
  });

  const rows: any[]     = data?.data?.consultations ?? data?.data ?? [];
  const totalPages: number = data?.data?.pagination?.totalPages ?? data?.pagination?.totalPages ?? 1;
  const totalItems: number = data?.data?.pagination?.total ?? data?.pagination?.total ?? 0;

  // Build visible page numbers (up to 7 around current)
  const pageNums: number[] = [];
  const range = 3;
  for (let i = Math.max(1, page - range); i <= Math.min(totalPages, page + range); i++) {
    pageNums.push(i);
  }

  return (
    <Box w="full" bg="bg_box" borderRadius="lg" p={4}>
      {/* ── Toolbar ── */}
      <Flex justify="space-between" align="center" mb={6} gap={4} direction={{ base: "column", md: "row" }}>
        <HStack flex={1} borderWidth="1.5px" rounded="lg" borderColor="gray.200" px={3} bg="main_background">
          <Box color="gray.400" flexShrink={0}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </Box>
          <Input
            border="none"
            focusRing="none"
            placeholder="Search my business"
            fontSize="0.875rem"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </HStack>

        <HStack gap={3} flexShrink={0}>
          <Menu.Root positioning={{ placement: "bottom-end" }}>
            <Menu.Trigger asChild>
              <Button variant="outline" borderColor="gray.200" rounded="lg" px={4} py={2} bg="main_background">
                <HStack gap={2}>
                  <LuListFilter size={16} />
                  <Text fontSize="0.875rem" color="text_primary" fontWeight="400">Sort by</Text>
                </HStack>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner zIndex="max">
                <Menu.Content bg="main_background" borderWidth="1px" borderColor="gray.100" rounded="lg" shadow="lg" minW="180px" p={1}>
                  {sortOptions.map((opt) => (
                    <Menu.Item
                      key={opt.value}
                      value={opt.value}
                      onClick={() => { setSortBy(opt.value); setPage(1); }}
                      px={4} py={2} borderRadius="md" cursor="pointer"
                      bg={sortBy === opt.value ? "gray.50" : "transparent"}
                      _hover={{ bg: "gray.50" }}
                    >
                      <Text fontSize="0.875rem" color="text_primary">{opt.label}</Text>
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>

          <Button bg="#0B1441" color="white" rounded="lg" px={5} py={2} _hover={{ bg: "#1a2a6e" }}>
            <HStack gap={2}>
              <MdOutlineFileUpload size={18} />
              <Text fontSize="0.875rem" fontWeight="500">Export</Text>
            </HStack>
          </Button>
        </HStack>
      </Flex>

      {/* ── Table ── */}
      <Box overflowX="auto">
        <Table.Root variant="line" size="md" w="full">
          <Table.Header>
            <Table.Row borderColor="gray.100">
              <Table.ColumnHeader fontSize="0.875rem" fontWeight="700" color="text_primary" py={4}>
                {`CLIENT'S NAME`}
              </Table.ColumnHeader>
              <Table.ColumnHeader fontSize="0.875rem" fontWeight="700" color="text_primary" py={4}>
                DATE & TIME
              </Table.ColumnHeader>
              <Table.ColumnHeader fontSize="0.875rem" fontWeight="700" color="text_primary" py={4}>
                STATUS
              </Table.ColumnHeader>
              <Table.ColumnHeader py={4} />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading || isFetching ? (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center" py={12}>
                  <HStack justify="center" gap={2}>
                    <Spinner size="sm" />
                    <Text fontSize="sm" color="gray.400">Loading…</Text>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ) : rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center" py={12}>
                  <Text fontSize="sm" color="gray.400">No consultations found.</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              rows.map((appt: any) => {
                const status = (appt.status ?? "").toLowerCase();
                const clientName = appt.user?.fullName ?? appt.client?.fullName ?? appt.clientName ?? "—";
                const dateTime   = formatDateTime(appt.scheduledDateTimeStart ?? appt.scheduledAt ?? appt.createdAt);
                return (
                  <Table.Row key={appt.id} borderColor="gray.100" _hover={{ bg: "gray.50" }}>
                    <Table.Cell fontSize="0.875rem" color="text_primary" fontWeight="400" py={5}>
                      {clientName}
                    </Table.Cell>
                    <Table.Cell fontSize="0.875rem" color="gray.500" py={5}>
                      {dateTime}
                    </Table.Cell>
                    <Table.Cell py={5}>
                      <Text fontSize="0.875rem" fontWeight="500" color={statusColorMap[status] ?? "gray.500"}>
                        {capitalize(appt.status)}
                      </Text>
                    </Table.Cell>
                    <Table.Cell textAlign="end" py={5}>
                      <Button
                        variant="outline"
                        borderColor="gray.200"
                        borderWidth="1.5px"
                        rounded="lg"
                        px={6} py={2} h="auto"
                        fontSize="0.875rem"
                        color="text_primary"
                        fontWeight="400"
                        _hover={{ bg: "gray.50" }}
                        onClick={() => { setSelected(appt); setDetails(true); }}
                      >
                        View
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <Flex justify="center" align="center" gap={1} mt={8}>
          <Button
            variant="ghost" size="sm" w={8} h={8} rounded="md" color="text_primary"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <LuChevronLeft size={16} />
          </Button>

          {pageNums[0] > 1 && (
            <Button variant="ghost" size="sm" w={8} h={8} rounded="md" color="gray.400" fontSize="0.875rem"
              onClick={() => setPage(1)}>1</Button>
          )}
          {pageNums[0] > 2 && (
            <Text color="gray.400" px={1}>…</Text>
          )}

          {pageNums.map((p) => (
            <Button
              key={p} size="sm" w={8} h={8} rounded="md" fontSize="0.875rem"
              fontWeight={p === page ? "600" : "400"}
              bg={p === page ? "#0B1441" : "transparent"}
              color={p === page ? "white" : "text_primary"}
              _hover={{ bg: p === page ? "#0B1441" : "gray.100" }}
              onClick={() => setPage(p)}
            >
              {p}
            </Button>
          ))}

          {pageNums[pageNums.length - 1] < totalPages - 1 && (
            <Text color="gray.400" px={1}>…</Text>
          )}
          {pageNums[pageNums.length - 1] < totalPages && (
            <Button variant="ghost" size="sm" w={8} h={8} rounded="md" color="gray.400" fontSize="0.875rem"
              onClick={() => setPage(totalPages)}>{totalPages}</Button>
          )}

          <Button
            variant="ghost" size="sm" w={8} h={8} rounded="md" color="text_primary"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <LuChevronRight size={16} />
          </Button>
        </Flex>
      )}

      <AppointmentView isOpen={details} onOpenChange={() => { setDetails(false); setSelected(null); }} />
    </Box>
  );
};

export default AppointmentTable;
