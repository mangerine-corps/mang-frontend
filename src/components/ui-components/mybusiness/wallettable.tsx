"use client";

import {
  Box,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";

type WalletTableProps = {
  items: any[];
  isLoading?: boolean;
  error?: any;
};

export const WalletTable = ({ items = [], isLoading, error }: WalletTableProps) => {
  const safeItems = Array.isArray(items) ? items : [];
  return (
    <Stack w="full" h="full" gap={6} overflowX="auto">
      <Box w="full" overflowX="auto">
        <Table.Root
          variant="outline"
          size="md"
          striped
          minW="720px" // ensures table scrolls on smaller screens
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader
                font="outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "md" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 3, md: 4 }}
              >
                Date & Time
              </Table.ColumnHeader>
              <Table.ColumnHeader
                font="outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "md" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 3, md: 4 }}
              >
                Topic
              </Table.ColumnHeader>
              <Table.ColumnHeader
                font="outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "md" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 3, md: 4 }}
              >
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader
                font="outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "md" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 3, md: 4 }}
                textAlign="end"
              >
                Amount
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body className={outfit.className}>
            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan={4} py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                  <Text color="gray.500">Loading transactions…</Text>
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading && error && (
              <Table.Row>
                <Table.Cell colSpan={4} py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                  <Text color="red.500">Failed to load transactions</Text>
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading && !error && safeItems.length === 0 && (
              <Table.Row>
                <Table.Cell  textAlign={'center'} colSpan={4} py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                  <Text textAlign="center" color="gray.500">No transactions found</Text>
                </Table.Cell>
              </Table.Row>
            )}
            {!isLoading && !error && safeItems.map((t, idx) => {
              const when = t?.createdAt ?? t?.updatedAt ?? t?.date;
              const topic = t?.topic ?? t?.description ?? t?.purpose ?? "—";
              const status = t?.status ?? t?.state ?? "—";
              const amount = Number(t?.amount ?? t?.price ?? 0);
              return (
                <Table.Row key={t?.id ?? idx} minH="72px" color="text_primary">
                  <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                    <Text textWrap={"nowrap"} fontSize={{ base: "sm", md: "md" }}>
                      {when ? new Date(when).toLocaleString() : "—"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                    <Text textWrap={"wrap"} fontSize={{ base: "sm", md: "md" }}>
                      {topic}
                    </Text>
                  </Table.Cell>
                  <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                    <Text fontSize={{ base: "sm", md: "md" }}>
                      {status}
                    </Text>
                  </Table.Cell>
                  <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }} textAlign="end">
                    <Text fontSize={{ base: "sm", md: "md" }}>
                      {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount)}
                    </Text>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* <Pagination.Root count={20} pageSize={5} defaultPage={1}>
        <ButtonGroup variant="ghost" size="sm" wrap="wrap" justifyContent="center">
          <Pagination.PrevTrigger asChild>
            <IconButton icon={<LuChevronLeft />} aria-label="Previous Page" />
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton key={page.value} variant={page.selected ? "solid" : "ghost"}>
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton icon={<LuChevronRight />} aria-label="Next Page" />
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root> */}
    </Stack>
  );
};
