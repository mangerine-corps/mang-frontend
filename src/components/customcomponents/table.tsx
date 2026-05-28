"use client";

import {
  Box,
  ButtonGroup,
  IconButton,
  Pagination,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useGetLoginActivitiesQuery } from "mangarine/state/services/settings.service";

const PAGE_SIZE = 10;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

export const PaginatedTable = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetLoginActivitiesQuery({ page, limit: PAGE_SIZE });

  const activities = data?.activities ?? [];
  const total = data?.total ?? 0;

  return (
    <Stack width="full" gap="5" py="4">
      <Box overflowX="auto" w="full">
        <Table.Root size="lg" variant="outline" minWidth="600">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center" p="4" color="text_primary">Date</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" p="4" color="text_primary">Time</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" p="4" color="text_primary">Location</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" p="4" color="text_primary">Device</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading || isFetching ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <Table.Row key={i}>
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Table.Cell key={j} p="4" textAlign="center">
                      <Skeleton h="18px" rounded="md" />
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : activities.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={4} textAlign="center" py={10}>
                  <Text color="grey.500" fontSize="0.9rem">No login activity found.</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              activities.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell p="4" color="text_primary" textAlign="center">{formatDate(item.createdAt)}</Table.Cell>
                  <Table.Cell p="4" color="text_primary" textAlign="center">{formatTime(item.createdAt)}</Table.Cell>
                  <Table.Cell p="4" color="text_primary" textAlign="center">{item.location}</Table.Cell>
                  <Table.Cell p="4" color="text_primary" textAlign="center">{item.device}</Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {total > PAGE_SIZE && (
        <Pagination.Root
          count={total}
          pageSize={PAGE_SIZE}
          page={page}
          onPageChange={(e) => setPage(e.page)}
        >
          <ButtonGroup variant="ghost" size="sm" wrap="wrap">
            <Pagination.PrevTrigger asChild>
              <IconButton disabled={page === 1}>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>
            <Pagination.Items
              render={(p) => (
                <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                  {p.value}
                </IconButton>
              )}
            />
            <Pagination.NextTrigger asChild>
              <IconButton disabled={page === (data?.pages ?? 1)}>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      )}
    </Stack>
  );
};
