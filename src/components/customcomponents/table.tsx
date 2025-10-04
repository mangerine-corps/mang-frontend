"use client";

import {
  Box,
  ButtonGroup,
  Heading,
  IconButton,
  Pagination,
  Stack,
  Table,
} from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export const PaginatedTable = () => {
  return (
    <Stack width="full" gap="5" py="4">
      <Box overflowX="auto" w="full">
      {/* <Heading size="xl">Products</Heading> */}
      <Table.Root size="lg" variant="outline" minWidth="600">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader textAlign="center" p="4">
              Date
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center" p="4">
              Time
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center" p="4">
              Location
            </Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center" p="4">
              Devices
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell p="4" color={"text_primary"} textAlign="center">
                {item.name}
              </Table.Cell>
              <Table.Cell p="4" color={"text_primary"} textAlign="center">
                {item.category}
              </Table.Cell>
              <Table.Cell p="4" color={"text_primary"} textAlign="center">
                {item.category}
              </Table.Cell>
              <Table.Cell p="4" color={"text_primary"} textAlign="center">
                {item.price}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      </Box>

      <Pagination.Root count={items.length * 5} pageSize={5} page={1}>
        <ButtonGroup variant="ghost" size="sm" wrap="wrap">
          <Pagination.PrevTrigger asChild>
            <IconButton>
              <LuChevronLeft />
            </IconButton>
          </Pagination.PrevTrigger>

          <Pagination.Items
            render={(page) => (
              <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger asChild>
            <IconButton>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>
    </Stack>
  );
};

const items = [
  { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
  { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
  { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
  { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
  { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
];
