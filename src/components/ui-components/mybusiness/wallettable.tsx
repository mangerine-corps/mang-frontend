"use client";

import { Badge, Box, Stack, Table, Text } from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";
import { EarningItem, PaymentItem } from "mangarine/state/services/transaction.service";

type WalletTableProps = {
  payments?: PaymentItem[];
  earnings?: EarningItem[];
  isLoading?: boolean;
  error?: any;
};

const fmt = (n: number, currency = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);

const statusColor = (status: string) => {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "paid") return "green";
  if (s === "pending") return "orange";
  if (s === "cancelled" || s === "failed") return "red";
  return "gray";
};

export const WalletTable = ({ payments = [], earnings = [], isLoading, error }: WalletTableProps) => {
  const hasPayments = payments.length > 0;
  const hasEarnings = earnings.length > 0;
  const isEmpty = !hasPayments && !hasEarnings;

  return (
    <Stack w="full" gap={6}>
      {/* Payments */}
      <Box w="full" overflowX="auto">
        <Text fontWeight="600" fontSize="0.9rem" color="text_primary" mb={2}>
          Payments Made
        </Text>
        <Table.Root variant="outline" size="md" striped minW="640px">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader fontWeight="600" px={3} py={3} className={outfit.className}>Date</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" px={3} py={3} className={outfit.className}>Consultant</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" px={3} py={3} className={outfit.className}>Status</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" px={3} py={3} textAlign="end" className={outfit.className}>Amount</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body className={outfit.className}>
            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center" py={4}>
                  <Text color="gray.500">Loading…</Text>
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading && error && (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center" py={4}>
                  <Text color="red.500">Failed to load payments</Text>
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading && !error && !hasPayments && (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center" py={4}>
                  <Text color="gray.500">No payments found</Text>
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading && !error && payments.map((p) => (
              <Table.Row key={p.id} color="text_primary">
                <Table.Cell px={3} py={3} fontSize="sm">
                  {p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </Table.Cell>
                <Table.Cell px={3} py={3} fontSize="sm">
                  {p.consultant?.fullName ?? "—"}
                </Table.Cell>
                <Table.Cell px={3} py={3}>
                  <Badge colorPalette={statusColor(p.status)} fontSize="xs">
                    {p.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell px={3} py={3} textAlign="end" fontSize="sm" fontWeight="600">
                  {fmt(Number(p.amount), p.currency)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Earnings */}
      <Box w="full" overflowX="auto">
        <Text fontWeight="600" fontSize="0.9rem" color="text_primary" mb={2}>
          Earnings Received
        </Text>
        <Table.Root variant="outline" size="md" striped minW="720px">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader fontWeight="600" px={3} py={3} className={outfit.className}>Date</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" px={3} py={3} className={outfit.className}>From</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" px={3} py={3} className={outfit.className}>Status</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" px={3} py={3} textAlign="end" className={outfit.className}>Gross</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" px={3} py={3} textAlign="end" className={outfit.className}>Fee (10%)</Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" px={3} py={3} textAlign="end" className={outfit.className}>Net</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body className={outfit.className}>
            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan={6} textAlign="center" py={4}>
                  <Text color="gray.500">Loading…</Text>
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading && !hasEarnings && (
              <Table.Row>
                <Table.Cell colSpan={6} textAlign="center" py={4}>
                  <Text color="gray.500">No earnings yet</Text>
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading && earnings.map((e) => (
              <Table.Row key={e.id} color="text_primary">
                <Table.Cell px={3} py={3} fontSize="sm">
                  {e.createdAt ? new Date(e.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                </Table.Cell>
                <Table.Cell px={3} py={3} fontSize="sm">
                  {e.payer?.fullName ?? "—"}
                </Table.Cell>
                <Table.Cell px={3} py={3}>
                  <Badge colorPalette={e.status === "PAID" ? "green" : "orange"} fontSize="xs">
                    {e.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell px={3} py={3} textAlign="end" fontSize="sm">
                  {fmt(e.grossAmount, e.currency)}
                </Table.Cell>
                <Table.Cell px={3} py={3} textAlign="end" fontSize="sm" color="red.400">
                  -{fmt(e.platformFeeAmount, e.currency)}
                </Table.Cell>
                <Table.Cell px={3} py={3} textAlign="end" fontSize="sm" fontWeight="600" color="green.500">
                  {fmt(e.netAmount, e.currency)}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Stack>
  );
};
