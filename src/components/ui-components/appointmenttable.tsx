import { useState } from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  Button,
  HStack,
  TableRoot,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumnHeader,
  Menu,
  Image,
} from "@chakra-ui/react";
import AppointmentView from "./appointmentdetails";
import { MdOutlineFileUpload } from "react-icons/md";
import { LuListFilter } from "react-icons/lu";

const appointments = [
  { id: 1, clientName: "Ralph Edwards", dateTime: "23 Jan, 2024 | 2:22pm", status: "completed" },
  { id: 2, clientName: "Ralph Edwards", dateTime: "23 Jan, 2024 | 2:22pm", status: "completed" },
  { id: 3, clientName: "Ralph Edwards", dateTime: "23 Jan, 2024 | 2:22pm", status: "rescheduled" },
  { id: 4, clientName: "Ralph Edwards", dateTime: "23 Jan, 2024 | 2:22pm", status: "rescheduled" },
  { id: 5, clientName: "Ralph Edwards", dateTime: "23 Jan, 2024 | 2:22pm", status: "completed" },
  { id: 6, clientName: "Ralph Edwards", dateTime: "23 Jan, 2024 | 2:22pm", status: "canceled" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "completed":
      return "green.500";
    case "rescheduled":
      return "orange.400";
    case "canceled":
      return "red.500";
    default:
      return "gray.500";
  }
};

const getStatusText = (status) => status.charAt(0).toUpperCase() + status.slice(1);

const AppointmentTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-az");
  const [currentPage, setCurrentPage] = useState(5);


  const sortOptions = [
    { value: "name-az", label: "Client's name (A - Z)" },
    { value: "name-za", label: "Client's name (Z - A)" },
    { value: "latest-oldest", label: "Latest - oldest" },
    { value: "oldest-latest", label: "Oldest - latest" },
  ];

  const getSortLabel = (value) => sortOptions.find((option) => option.value === value)?.label || "Sort by";
     const [details, setDetails] = useState<boolean>(false);
  return (
    <Box w="full" h="full" p="4" bg="bg_box">
      <Box mb={10}>
        <Flex
          justify="space-between"
          mb={6}
          gap={4}
          direction={{ base: "column", md: "row" }}
        >
          <HStack
            borderWidth="1.5px"
            rounded="lg"
            borderColor="gray.200"
            px="3"
            w={{ base: "full", md: "full" }}
          >
            <Image src="/Icons/searchSvg.svg" alt="Search" />
            <Input
              size="sm"
              outline={"none"}
              focusRing={"none"}
              border="none"
              alignItems={"center"}
              justifyContent={"flex-start"}
              // flex="2"
              placeholder="Search my business"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </HStack>

          <HStack ml="4" justify="flex-end">
            <Menu.Root>
              <Menu.Trigger asChild>
                <Button variant="outline" px="2" py="4" rounded={"lg"}>
                  <Text fontSize={"1rem"} color="text_primary">
                    <LuListFilter />
                  </Text>

                  <Text>{getSortLabel(sortBy)}</Text>
                  {/* <Image
                  src="/icons/chevron-down.svg"
                  alt="Sort"
                  boxSize="16px"
                  ml={2}
                /> */}
                </Button>
              </Menu.Trigger>
              {/* <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {sortOptions.map((option) => (
                    <Menu.Item >
                      <Text Text key={option.value} onClick={() => setSortBy(option.value)}>
                        {option.label}
                      </Text>
                    </Menu.Item>
                  ))}
                </Menu.Content>
              </Menu.Positioner>
            </Portal> */}
            </Menu.Root>
            <Button
              px="4"
              py="4"
              borderRadius="8px"
              bg="blue.900"
              color="white"
              _hover={{ bg: "blue.800" }}
            >
              <Text fontSize={"1rem"} color="main_background">
                <MdOutlineFileUpload />
              </Text>
              Export
            </Button>
          </HStack>
        </Flex>
        <TableRoot w="898px" h="644px" borderRadius="12px" pb="24px">
          <TableHeader>
            <TableRow>
              <TableColumnHeader
                font="outfit"
                color="text_primary"
                fontSize="0.875rem"
                fontWeight="600"
              >
               {`Client's Name`}
              </TableColumnHeader>
              <TableColumnHeader
                font="outfit"
                color="text_primary"
                fontSize="0.875rem"
                fontWeight="600"
              >
                DATE & TIME
              </TableColumnHeader>
              <TableColumnHeader
                font="outfit"
                color="text_primary"
                fontSize="0.875rem"
                fontWeight="600"
              >
                STATUS
              </TableColumnHeader>
              <TableColumnHeader
                font="outfit"
                textAlign="end"
                // pr="6"
                color="text_primary"
                fontSize="0.875rem"
                fontWeight="600"
              >
                ACTION
              </TableColumnHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell
                  font="outfit"
                  color="text_primary"
                  fontSize="0.875rem"
                  fontWeight="400"
                >
                  {appt.clientName}
                </TableCell>
                <TableCell color="gray.600">{appt.dateTime}</TableCell>
                <TableCell
                  color={getStatusColor(appt.status)}
                  fontWeight="medium"
                >
                  {getStatusText(appt.status)}
                </TableCell>
                <TableCell textAlign="end">
                  <Button
                    onClick={() => {
                      setDetails(true);
                    }}
                    w="85px"
                    h="40px"
                    borderRadius="8px"
                    border="1px solid"
                    variant="outline"
                  >
                    view
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
        <AppointmentView
          isOpen={details}
          onOpenChange={() => {
            setDetails(false);
          }}
        />
      </Box>

      <Flex justify="center" gap={2} mt={6} wrap="wrap">
        <Button variant="ghost" size="sm" p={2}>
          <Image src="/icons/left.svg" alt="Prev" />
        </Button>
        <Button variant="ghost" size="sm" w={8} h={8}>
          ...
        </Button>
        {[2, 3, 4, 5, 6, 7, 8].map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "solid" : "ghost"}
            colorScheme={page === currentPage ? "gray" : undefined}
            size="sm"
            w={8}
            h={8}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button variant="ghost" size="sm" w={8} h={8}>
          ...
        </Button>
        <Button variant="ghost" size="sm" p={2}>
          <Image src="/icons/right.svg" alt="Next" />
        </Button>
      </Flex>
    </Box>
  );
};

export default AppointmentTable;
