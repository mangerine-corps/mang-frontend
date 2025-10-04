import {
  Box,
  Button,
  Stack,
  Table,
  Text,
  HStack,
  Spinner,
  Pagination,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import PaymentModal from "./paymentreceipt";
import { useGetMyPaymentsQuery } from "mangarine/state/services/apointment.service";
import { format } from 'date-fns';
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const statusColorMap: Record<string, string> = {
  completed: "green.500",
  cancelled: "red.500",
  expired: "gray.500",
  pending: "orange.500",
};

const PaymentHistory = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const { data, isLoading } = useGetMyPaymentsQuery({ page, limit });

  const rows = useMemo(() => {
    const list = data?.data ?? [];
    return list.map((p: any) => {
      const consultantName = p?.consultant?.fullName ?? "Consultant";
      const availabilityDate = p?.appointmentData?.availabilityDate || p?.appointmentData?.date || p?.paymentData?.created || "";
      const amountCents = p?.paymentData?.amount;

      const currency = p?.paymentData?.currency || "usd";
      const amount = typeof amountCents === "number" ? `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}` : "-";
      const status: string = (p?.status || "").toString();
      const statusColor = statusColorMap[status.toLowerCase?.() || status] || "gray.500";
      const method = p?.paymentData?.methodSummary?.type || "-";
      return {
        id: p.id,
        topic: consultantName,
        date: availabilityDate,
        amount,
        status: status.toUpperCase?.() || status,
        statusColor,
        method,
      };
    });
  }, [data]);

  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.total ?? 0;

  return (
    <Stack bg="white" rounded="md" w="full" h="full" gap={6} overflowX="auto">
      <Box w="full" overflowX="auto">
        <Table.Root
          variant="outline"
          size="md"
          striped
          // minW="720px"
        >
          <Table.Header
            justifyContent={"space-between"}
            alignItems={""}
            w="full"
          >
            <Table.Row>
              <Table.ColumnHeader
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 3 }}
                font="outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "1rem" }}
                color="text_primary"
              >
                Topic
              </Table.ColumnHeader>
              <Table.ColumnHeader
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 3 }}
                font="outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "1rem" }}
                color="text_primary"
              >
                Date
              </Table.ColumnHeader>
              <Table.ColumnHeader
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 3 }}
                font="outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "1rem" }}
                color="text_primary"
              >
                Amount
              </Table.ColumnHeader>
              <Table.ColumnHeader
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 3 }}
                font="outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "1rem" }}
                color="text_primary"
              >
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 3 }}
                font="outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "1rem" }}
                color="text_primary"
              >
                Method
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end" />
            </Table.Row>
          </Table.Header>

          <Table.Body overflowX="auto" w="full">
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={6} py={8} textAlign="center">
                  <HStack justify="center">
                    <Spinner size="sm" />
                    <Text>Loading...</Text>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ) : rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6} py={8} textAlign="center">
                  <Text>No payments found</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              rows.map((item: any) => (
                <Table.Row key={item.id} minH="72px" color="text_primary">
                  <Table.Cell py={4} px={3}>
                    <Text
                      fontWeight="medium"
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {item.topic}
                    </Text>
                  </Table.Cell>
                  <Table.Cell fontSize={{ base: "sm", md: "md" }} px="3">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </Table.Cell>
                  <Table.Cell fontSize={{ base: "sm", md: "md" }} px="3">
                    {item.amount}
                  </Table.Cell>
                  <Table.Cell>
                    <Text
                      py={4}
                      px={3}
                      color={item.statusColor}
                      fontSize={{ base: "sm", md: "md" }}
                    >
                      {item.status}
                    </Text>
                  </Table.Cell>
                  <Table.Cell textTransform="capitalize" fontSize={{ base: "sm", md: "md" }} px="3">
                    {item.method}
                  </Table.Cell>
                  <Table.Cell textAlign="end" px="3">
                    <Button
                      onClick={() => setOpen(true)}
                      variant="ghost"
                      fontSize="sm"
                      color="chat_textbg_inv"
                      _hover={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }}
                    >
                      View Receipt
                    </Button>
                    <PaymentModal
                      data={item}
                      isOpen={open}
                      onOpenChange={() => {
                        setOpen(false);
                      }}
                    />
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>
      {totalPages > 1 && (
        <HStack justify="center" py={4}>
          <Pagination.Root
            count={totalItems}
            pageSize={limit}
            defaultPage={1}
            key={"md"}
          >
            <ButtonGroup variant="ghost" size={"md"}>
              <Pagination.PrevTrigger asChild>
                <IconButton
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>

              <Pagination.Items
                render={(page) => (
                  <IconButton
                    onClick={() => setPage(page.value)}
                    variant={{ base: "ghost", _selected: "outline" }}
                  >
                    {page.value}
                  </IconButton>
                )}
              />

              <Pagination.NextTrigger asChild>
                <IconButton
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </HStack>
      )}

      {/* <Pagination.Root count={payments.length * 5} pageSize={5} page={1}>
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton icon={<LuChevronLeft />} aria-label="Previous" />
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <Pagination.Item key={page.value} page={page.value}>
                <IconButton
                  aria-label={`Page ${page.value}`}
                  variant={page.selected ? "solid" : "ghost"}
                >
                  {page.value}
                </IconButton>
              </Pagination.Item>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton icon={<LuChevronRight />} aria-label="Next" />
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root> */}
    </Stack>
  );
};

export default PaymentHistory;
