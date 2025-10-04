import {Box, Button, HStack, Image, Menu, Portal, Stack, Table, Text,} from "@chakra-ui/react";
import {outfit} from "mangarine/pages/_app";

const consultations = [
    {
        id: 1,
        name: "Ralph Edwards",
        role: "President of Sales",
        date: "23 Jan, 2024 | 2:22pm",
        topic: "Resume Building",
        status: "Completed",
        statusColor: "green.500",
        avatar: "/images/dp.png",
    },
    {
        id: 2,
        name: "Albert Flores",
        role: "Nursing Assistant",
        date: "23 Jan, 2024 | 2:22pm",
        topic: "Business Planning",
        status: "Completed",
        statusColor: "green.500",
        avatar: "/images/dp.png",
    },
    {
        id: 3,
        name: "Savannah Nguyen",
        role: "Medical Assistant",
        date: "23 Jan, 2024 | 2:22pm",
        topic: "Interview Preparation",
        status: "Cancelled",
        statusColor: "red.500",
        avatar: "/images/dp.png",
    },
    {
        id: 4,
        name: "Cody Fisher",
        role: "Marketing Coordinator",
        date: "23 Jan, 2024 | 2:22pm",
        topic: "Digital Marketing",
        status: "Rescheduled",
        statusColor: "blue.500",
        avatar: "/images/dp.png",
    },
    {
        id: 5,
        name: "Leslie Alexander",
        role: "Web Designer",
        date: "23 Jan, 2024 | 2:22pm",
        topic: "System Integration",
        status: "Completed",
        statusColor: "green.500",
        avatar: "/images/dp.png",
    },
    {
        id: 6,
        name: "Leslie Alexander",
        role: "Web Designer",
        date: "23 Jan, 2024 | 2:22pm",
        topic: "System Integration",
        status: "Completed",
        statusColor: "green.500",
        avatar: "/images/dp.png",
    },
    {
        id: 7,
        name: "Leslie Alexander",
        role: "Web Designer",
        date: "23 Jan, 2024 | 2:22pm",
        topic: "System Integration",
        status: "Completed",
        statusColor: "green.500",
        avatar: "/images/dp.png",
    },
    {
        id: 8,
        name: "Leslie Alexander",
        role: "Web Designer",
        date: "23 Jan, 2024 | 2:22pm",
        topic: "System Integration",
        status: "Completed",
        statusColor: "green.500",
        avatar: "/images/dp.png",
    },
];

const UpcomingConsultations = () => {


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
                Consultant
              </Table.ColumnHeader>
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
                textAlign="end"
                px={{ base: 2, md: 3 }}
              />
            </Table.Row>
          </Table.Header>

          <Table.Body className={outfit.className}>
            {consultations.map((item) => (
              <Table.Row key={item.id} minH="72px" color="text_primary">
                {/* Consultant */}
                <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                  <HStack gap={3}>
                    <Image
                      src={item.avatar}
                      alt={item.name}
                      boxSize={{ base: "32px", md: "40px" }}
                      borderRadius="full"
                    />
                    <Box>
                      <Text textWrap={'nowrap'} fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                        {item.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {item.role}
                      </Text>
                    </Box>
                  </HStack>
                </Table.Cell>

                {/* Date & Time */}
                <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                  <Text textWrap={'nowrap'} fontSize={{ base: "sm", md: "md" }}>{item.date}</Text>
                </Table.Cell>

                {/* Topic */}
                <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                  <Text textWrap={'nowrap'} fontSize={{ base: "sm", md: "md" }}>{item.topic}</Text>
                </Table.Cell>

                {/* Status */}
                <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                  <Text
                    fontSize={{ base: "sm", md: "md" }}
                    color={item.statusColor}
                    fontWeight="medium"
                  >
                    {item.status}
                  </Text>
                </Table.Cell>

                {/* Menu */}
                <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                  <Menu.Root positioning={{ placement: "bottom-end" }}>
                    <Menu.Trigger asChild>
                      <Button variant="ghost" p={0} minW="auto">
                        <Image src="/icons/dot.svg" alt="menu" />
                      </Button>
                    </Menu.Trigger>
                    <Portal>
                      <Menu.Positioner>
                        <Menu.Content borderRadius="md" boxShadow="lg">
                          <Menu.Item
                            _hover={{ bg: "consult_hover" }}
                            py={2}
                            px={2}
                            value="watch"
                          >
                            <HStack gap={3}>
                              <Image src="/icons/watch.svg" alt="icon" boxSize="16px" />
                              <Text fontSize="sm">Watch video</Text>
                            </HStack>
                          </Menu.Item>
                          <Menu.Item
                            _hover={{ bg: "consult_hover" }}
                            py={2}
                            px={2}
                            value="rate"
                          >
                            <HStack gap={3}>
                              <Image src="/icons/star.svg" alt="icon" boxSize="16px" />
                              <Text fontSize="sm">Rate Consultant</Text>
                            </HStack>
                          </Menu.Item>
                          <Menu.Item
                            _hover={{ bg: "consult_hover" }}
                            py={2}
                            px={2}
                            value="receipt"
                          >
                            <HStack gap={3}>
                              <Image src="/icons/view.svg" alt="icon" boxSize="16px" />
                              <Text fontSize="sm">View Payment Receipt</Text>
                            </HStack>
                          </Menu.Item>
                        </Menu.Content>
                      </Menu.Positioner>
                    </Portal>
                  </Menu.Root>
                </Table.Cell>
              </Table.Row>
            ))}
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

export default UpcomingConsultations;
