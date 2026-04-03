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
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const statusColorMap: Record<string, string> = {
  completed: "green.500",
  cancelled: "red.500",
  expired: "gray.500",
  pending: "orange.500",
  failed: "red.400",
};

const PaymentHistory = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const { data, isLoading } = useGetMyPaymentsQuery({ page, limit });

  // Normalize nested response shapes
  const rawRoot: any = data;
  const rawNested: any =
    rawRoot?.data && !Array.isArray(rawRoot.data) ? rawRoot.data : undefined;
  const list: any[] = Array.isArray(rawRoot?.data)
    ? rawRoot.data
    : Array.isArray(rawNested?.data)
    ? rawNested.data
    : [];

  const totalPages: number =
    rawNested?.totalPages ?? rawRoot?.totalPages ?? 1;
  const totalItems: number =
    rawNested?.total ?? rawRoot?.total ?? list.length;

  const rows = useMemo(() => {
    return list.map((p: any) => {
      const consultantName = p?.consultant?.fullName ?? "Consultant";
      const rawDate =
        p?.appointmentData?.availabilityDate ||
        p?.appointmentData?.date ||
        p?.paymentData?.created ||
        "";
      const dateLabel = rawDate
        ? new Date(rawDate).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
          })
        : "—";

      const amountCents = p?.paymentData?.amount;
      const currency = p?.paymentData?.currency || "usd";
      const amount =
        typeof amountCents === "number"
          ? `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`
          : "—";

      const status: string = (p?.status || "").toString();
      const statusColor =
        statusColorMap[status.toLowerCase()] || "gray.500";
      const method = p?.paymentData?.methodSummary?.type || "—";

      return {
        id: p.id,
        topic: consultantName,
        date: dateLabel,
        amount,
        status: status.toUpperCase(),
        statusColor,
        method,
        raw: p,
      };
    });
  }, [list]);

  return (
    <Stack bg="bg_box" rounded="md" w="full" h="full" gap={6} overflowX="auto">
      <Box w="full" overflowX="auto">
        <Table.Root variant="outline" size="md" striped>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 3 }}
                fontFamily="Outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "0.875rem" }}
                color="text_primary"
              >
                Topic
              </Table.ColumnHeader>
              <Table.ColumnHeader
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 3 }}
                fontFamily="Outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "0.875rem" }}
                color="text_primary"
              >
                Date
              </Table.ColumnHeader>
              <Table.ColumnHeader
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 3 }}
                fontFamily="Outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "0.875rem" }}
                color="text_primary"
              >
                Amount
              </Table.ColumnHeader>
              <Table.ColumnHeader
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 3 }}
                fontFamily="Outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "0.875rem" }}
                color="text_primary"
              >
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader
                py={{ base: 3, md: 4 }}
                px={{ base: 2, md: 3 }}
                fontFamily="Outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "0.875rem" }}
                color="text_primary"
              >
                Method
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end" />
            </Table.Row>
          </Table.Header>

          <Table.Body w="full">
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={6} py={10} textAlign="center">
                  <HStack justify="center" gap={2}>
                    <Spinner size="sm" />
                    <Text fontFamily="Outfit" fontSize="sm" color="gray.500">
                      Loading...
                    </Text>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ) : rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={6} py={10} textAlign="center">
                  <Text fontFamily="Outfit" fontSize="sm" color="gray.400">
                    No payments found.
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              rows.map((item: any) => (
                <Table.Row key={item.id} minH="72px" color="text_primary">
                  <Table.Cell py={4} px={3}>
                    <Text
                      fontWeight="500"
                      fontFamily="Outfit"
                      fontSize={{ base: "sm", md: "0.875rem" }}
                    >
                      {item.topic}
                    </Text>
                  </Table.Cell>
                  <Table.Cell
                    fontFamily="Outfit"
                    fontSize={{ base: "sm", md: "0.875rem" }}
                    px={3}
                  >
                    {item.date}
                  </Table.Cell>
                  <Table.Cell
                    fontFamily="Outfit"
                    fontSize={{ base: "sm", md: "0.875rem" }}
                    px={3}
                  >
                    {item.amount}
                  </Table.Cell>
                  <Table.Cell py={4} px={3}>
                    <Text
                      color={item.statusColor}
                      fontFamily="Outfit"
                      fontSize={{ base: "sm", md: "0.875rem" }}
                      fontWeight="500"
                    >
                      {item.status}
                    </Text>
                  </Table.Cell>
                  <Table.Cell
                    textTransform="capitalize"
                    fontFamily="Outfit"
                    fontSize={{ base: "sm", md: "0.875rem" }}
                    px={3}
                  >
                    {item.method}
                  </Table.Cell>
                  <Table.Cell textAlign="end" px={3}>
                    <Button
                      onClick={() => setSelectedItem(item)}
                      variant="ghost"
                      fontFamily="Outfit"
                      fontSize="sm"
                      color="chat_textbg_inv"
                      _hover={{ bg: "transparent" }}
                      _active={{ bg: "transparent" }}
                    >
                      View Receipt
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Single modal instance outside the loop */}
      {selectedItem && (
        <PaymentModal
          data={selectedItem}
          isOpen={!!selectedItem}
          onOpenChange={() => setSelectedItem(null)}
        />
      )}

      {totalPages > 1 && (
        <HStack justify="center" py={4}>
          <Pagination.Root
            count={totalItems}
            pageSize={limit}
            defaultPage={1}
            key="payment-history"
          >
            <ButtonGroup variant="ghost" size="md">
              <Pagination.PrevTrigger asChild>
                <IconButton
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <LuChevronLeft />
                </IconButton>
              </Pagination.PrevTrigger>
              <Pagination.Items
                render={(pg) => (
                  <IconButton
                    key={pg.value}
                    onClick={() => setPage(pg.value)}
                    variant={{ base: "ghost", _selected: "outline" }}
                  >
                    {pg.value}
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
    </Stack>
  );
};

export default PaymentHistory;
