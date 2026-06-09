import { Box, Button, HStack, Image, Menu, Portal, Spinner, Stack, Table, Text, VStack } from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";
import { useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { format } from "date-fns";
import { safeProfilePic, imgErrorFallback } from "mangarine/lib/constants";

const formatDateTime = (val: string) => {
  if (!val) return "—";
  try { return format(new Date(val), "dd MMM, yyyy | h:mmaaa"); }
  catch { return val; }
};

const statusColorMap: Record<string, string> = {
  completed:   "green.500",
  rescheduled: "blue.500",
  canceled:    "red.500",
  cancelled:   "red.500",
  pending:     "gray.500",
  upcoming:    "blue.500",
};

const UpcomingConsultations = () => {
  const { data, isLoading } = useGetUpcomingConsultationQuery({});
  const consultations: any[] = (data as any)?.data?.consultations ?? [];

  return (
    <Stack w="full" h="full" gap={6} overflowX="auto">
      <Box w="full" overflowX="auto">
        <Table.Root
          variant="outline"
          size="md"
          striped
          minW="720px"
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader fontWeight="600" fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 3 }} py={{ base: 3, md: 4 }}>
                Consultant
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 3 }} py={{ base: 3, md: 4 }}>
                Date & Time
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 3 }} py={{ base: 3, md: 4 }}>
                Topic
              </Table.ColumnHeader>
              <Table.ColumnHeader fontWeight="600" fontSize={{ base: "sm", md: "md" }} px={{ base: 2, md: 3 }} py={{ base: 3, md: 4 }}>
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end" px={{ base: 2, md: 3 }} />
            </Table.Row>
          </Table.Header>

          <Table.Body className={outfit.className}>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={5} textAlign="center" py={12}>
                  <HStack justify="center" gap={2}>
                    <Spinner size="sm" />
                    <Text fontSize="sm" color="gray.400">Loading…</Text>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ) : consultations.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5} textAlign="center" py={12}>
                  <VStack gap={1}>
                    <Text fontSize="sm" color="gray.400">No upcoming consultations.</Text>
                  </VStack>
                </Table.Cell>
              </Table.Row>
            ) : (
              consultations.map((item: any) => {
                const consultant = item.consultant ?? {};
                const statusKey = (item.status ?? "").toLowerCase();
                return (
                  <Table.Row key={item.id} minH="72px" color="text_primary">
                    <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                      <HStack gap={3}>
                        <Image
                          src={safeProfilePic(consultant.profilePics)}
                          onError={imgErrorFallback}
                          alt={consultant.fullName || "Consultant"}
                          boxSize={{ base: "32px", md: "40px" }}
                          borderRadius="full"
                          objectFit="cover"
                        />
                        <Box>
                          <Text textWrap="nowrap" fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                            {consultant.fullName || "—"}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {consultant.title || consultant.location || ""}
                          </Text>
                        </Box>
                      </HStack>
                    </Table.Cell>

                    <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                      <Text textWrap="nowrap" fontSize={{ base: "sm", md: "md" }}>
                        {formatDateTime(item.scheduledDateTimeStart ?? item.scheduledDate)}
                      </Text>
                    </Table.Cell>

                    <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                      <Text textWrap="nowrap" fontSize={{ base: "sm", md: "md" }}>
                        {item.topic || item.title || "—"}
                      </Text>
                    </Table.Cell>

                    <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                      <Text fontSize={{ base: "sm", md: "md" }} color={statusColorMap[statusKey] ?? "gray.500"} fontWeight="medium">
                        {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : "—"}
                      </Text>
                    </Table.Cell>

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
                              <Menu.Item _hover={{ bg: "consult_hover" }} py={2} px={2} value="watch">
                                <HStack gap={3}>
                                  <Image src="/icons/watch.svg" alt="icon" boxSize="16px" />
                                  <Text fontSize="sm">Watch video</Text>
                                </HStack>
                              </Menu.Item>
                              <Menu.Item _hover={{ bg: "consult_hover" }} py={2} px={2} value="rate">
                                <HStack gap={3}>
                                  <Image src="/icons/star.svg" alt="icon" boxSize="16px" />
                                  <Text fontSize="sm">Rate Consultant</Text>
                                </HStack>
                              </Menu.Item>
                              <Menu.Item _hover={{ bg: "consult_hover" }} py={2} px={2} value="receipt">
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
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Stack>
  );
};

export default UpcomingConsultations;
