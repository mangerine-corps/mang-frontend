import {
  Box,
  Button,
  HStack,
  Image,
  Menu,
  Portal,
  Spinner,
  Stack,
  Table,
  Text,
  ButtonGroup,
  Pagination,
  IconButton,
} from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";
import { FC, useState } from "react";
import { useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { format } from "date-fns";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useRouter } from "next/router";
import ReviewModal from "./modals/reviewmodal";
import PaymentModal from "./paymentreceipt";

const statusColorMap: Record<string, string> = {
  COMPLETED: "green.500",
  CANCELLED: "red.500",
  RESCHEDULED: "blue.500",
  NO_SHOW: "gray.500",
  UPCOMING: "orange.400",
  EXPIRED: "gray.400",
};

type Props = {
  searchTerm?: string;
};

const ConsultationHistory: FC<Props> = ({ searchTerm = "" }) => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const [reviewItem, setReviewItem] = useState<any>(null);
  const [receiptItem, setReceiptItem] = useState<any>(null);
  const router = useRouter();

  const { data, isLoading } = useGetUpcomingConsultationQuery({ page, limit });

  const appointments: any[] = (data as any)?.data?.consultations ?? [];
  const totalPages: number = (data as any)?.data?.pagination?.totalPages ?? 1;
  const totalItems: number = (data as any)?.data?.pagination?.total ?? 0;

  const term = searchTerm.toLowerCase().trim();
  const rows = appointments.filter((a: any) => {
    if (!term) return true;
    return (a.consultant?.fullName || "").toLowerCase().includes(term);
  });

  const formatDate = (val: string) => {
    if (!val) return "-";
    try {
      return format(new Date(val), "dd MMM, yyyy | h:mmaaa");
    } catch {
      return val;
    }
  };

  return (
    <Stack w="full" h="full" gap={6} overflowX="auto">
      <Box w="full" overflowX="auto">
        <Table.Root
          variant="outline"
          size="md"
          striped
          minW="620px"
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader
                fontFamily="Outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "0.875rem" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 3, md: 4 }}
                color="text_primary"
              >
                Consultant Name
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "0.875rem" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 3, md: 4 }}
                color="text_primary"
              >
                Date &amp; Time
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "0.875rem" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 3, md: 4 }}
                color="text_primary"
              >
                Topic
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Outfit"
                fontWeight="600"
                fontSize={{ base: "sm", md: "0.875rem" }}
                px={{ base: 2, md: 3 }}
                py={{ base: 3, md: 4 }}
                color="text_primary"
              >
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end" px={{ base: 2, md: 3 }} />
            </Table.Row>
          </Table.Header>

          <Table.Body className={outfit.className}>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={5} py={10} textAlign="center">
                  <HStack justify="center" gap={2}>
                    <Spinner size="sm" />
                    <Text fontSize="sm" color="gray.500" fontFamily="Outfit">Loading...</Text>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ) : rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5} py={10} textAlign="center">
                  <Text fontSize="sm" color="gray.400" fontFamily="Outfit">No consultations found.</Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              rows.map((item: any) => {
                const status: string = (item.status || "").toUpperCase();
                const statusColor = statusColorMap[status] || "gray.500";
                const statusLabel =
                  status === "NO_SHOW"
                    ? "No Show"
                    : status.charAt(0) + status.slice(1).toLowerCase();

                return (
                  <Table.Row key={item.id} minH="72px" color="text_primary">
                    {/* Consultant */}
                    <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                      <HStack gap={3}>
                        <Image
                          src={item.consultant?.profilePics || item.consultant?.avatar || "/images/dp.png"}
                          alt={item.consultant?.fullName || "Consultant"}
                          boxSize={{ base: "32px", md: "40px" }}
                          borderRadius="full"
                          objectFit="cover"
                        />
                        <Box>
                          <Text
                            textWrap="nowrap"
                            fontSize={{ base: "sm", md: "0.875rem" }}
                            fontWeight="600"
                            fontFamily="Outfit"
                          >
                            {item.consultant?.fullName || "—"}
                          </Text>
                          <Text fontSize="xs" color="gray.500" fontFamily="Outfit">
                            {item.consultant?.occupation ||
                              item.consultant?.role ||
                              item.consultant?.jobTitle ||
                              ""}
                          </Text>
                        </Box>
                      </HStack>
                    </Table.Cell>

                    {/* Date & Time */}
                    <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                      <Text textWrap="nowrap" fontSize={{ base: "sm", md: "0.875rem" }} fontFamily="Outfit">
                        {formatDate(item.scheduledDateTimeStart || item.scheduledAt || item.createdAt)}
                      </Text>
                    </Table.Cell>

                    {/* Topic */}
                    <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                      <Text textWrap="nowrap" fontSize={{ base: "sm", md: "0.875rem" }} fontFamily="Outfit">
                        {item.topic || item.subject || item.title || "—"}
                      </Text>
                    </Table.Cell>

                    {/* Status */}
                    <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                      <Text
                        fontSize={{ base: "sm", md: "0.875rem" }}
                        color={statusColor}
                        fontWeight="500"
                        fontFamily="Outfit"
                      >
                        {statusLabel}
                      </Text>
                    </Table.Cell>

                    {/* Action */}
                    <Table.Cell py={{ base: 3, md: 4 }} px={{ base: 2, md: 3 }}>
                      {status === "UPCOMING" || status === "CONFIRMED" ? (
                        <Button
                          size="sm"
                          bg="primary.950"
                          color="white"
                          borderRadius="8px"
                          fontFamily="Outfit"
                          fontSize="0.8rem"
                          px={4}
                          _hover={{ opacity: 0.85 }}
                          onClick={() => router.push(`/message/videoconsultation?consultationId=${item.id}`)}
                        >
                          Join Call
                        </Button>
                      ) : (
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
                                  px={3}
                                  value="watch"
                                >
                                  <HStack gap={3}>
                                    <Image src="/icons/watch.svg" alt="icon" boxSize="16px" />
                                    <Text fontSize="sm" fontFamily="Outfit">Watch Recording</Text>
                                  </HStack>
                                </Menu.Item>
                                <Menu.Item
                                  _hover={{ bg: "consult_hover" }}
                                  py={2}
                                  px={3}
                                  value="rate"
                                  onClick={() => setReviewItem(item)}
                                >
                                  <HStack gap={3}>
                                    <Image src="/icons/star.svg" alt="icon" boxSize="16px" />
                                    <Text fontSize="sm" fontFamily="Outfit">Rate Consultant</Text>
                                  </HStack>
                                </Menu.Item>
                                <Menu.Item
                                  _hover={{ bg: "consult_hover" }}
                                  py={2}
                                  px={3}
                                  value="receipt"
                                  onClick={() => setReceiptItem(item)}
                                >
                                  <HStack gap={3}>
                                    <Image src="/icons/view.svg" alt="icon" boxSize="16px" />
                                    <Text fontSize="sm" fontFamily="Outfit">View Payment Receipt</Text>
                                  </HStack>
                                </Menu.Item>
                              </Menu.Content>
                            </Menu.Positioner>
                          </Portal>
                        </Menu.Root>
                      )}
                    </Table.Cell>
                  </Table.Row>
                );
              })
            )}
          </Table.Body>
        </Table.Root>
      </Box>

      {totalPages > 1 && (
        <HStack justify="center" py={4}>
          <Pagination.Root count={totalItems} pageSize={limit} defaultPage={1} key="consultation-history">
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
                <IconButton onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                  <LuChevronRight />
                </IconButton>
              </Pagination.NextTrigger>
            </ButtonGroup>
          </Pagination.Root>
        </HStack>
      )}

      <PaymentModal
        isOpen={!!receiptItem}
        onOpenChange={() => setReceiptItem(null)}
        data={receiptItem}
      />

      <ReviewModal
        isOpen={!!reviewItem}
        onOpenChange={() => setReviewItem(null)}
        consultantName={reviewItem?.consultant?.fullName}
        consultantPic={reviewItem?.consultant?.profilePics}
        consultantId={reviewItem?.consultant?.id}
        appointmentId={reviewItem?.id}
      />

    </Stack>
  );
};

export default ConsultationHistory;
