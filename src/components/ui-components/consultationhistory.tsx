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
  VStack,
} from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";
import { FC, useState } from "react";
import { useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { format } from "date-fns";
import { LuChevronLeft, LuChevronRight, LuEllipsis } from "react-icons/lu";
import { useRouter } from "next/router";
import ReviewModal from "./modals/reviewmodal";
import PaymentModal from "./paymentreceipt";
import { useCountdown, resolveStartTime } from "mangarine/hooks/useCountdown";
import { safeProfilePic, imgErrorFallback } from "mangarine/lib/constants";

const statusColorMap: Record<string, { color: string; bg: string }> = {
  COMPLETED:   { color: "#16A34A", bg: "#DCFCE7" },
  CANCELLED:   { color: "#DC2626", bg: "#FEE2E2" },
  RESCHEDULED: { color: "#111D4A", bg: "#B5B9C7" },
  PENDING:     { color: "#111D4A", bg: "#E7E8ED" },
  UPCOMING:    { color: "#111D4A", bg: "#E7E8ED" },
  CONFIRMED:   { color: "#16A34A", bg: "#DCFCE7" },
  NO_SHOW:     { color: "#6B7280", bg: "#F3F4F6" },
  EXPIRED:     { color: "#9CA3AF", bg: "#F9FAFB" },
};

const CountdownBadge = ({ appointment }: { appointment: any }) => {
  const startTime = resolveStartTime(appointment);
  const countdown = useCountdown(startTime);
  if (!startTime || !countdown.label) return null;
  const isLive = countdown.urgency === "now" || countdown.isPast;
  return (
    <Box
      display="inline-flex"
      alignItems="center"
      gap={1}
      px={2}
      py={0.5}
      borderRadius="full"
      bg={isLive ? "#DCFCE7" : "#FEF3C7"}
      fontSize="0.7rem"
      fontWeight="600"
      color={isLive ? "#16A34A" : "#D97706"}
      whiteSpace="nowrap"
    >
      {isLive && (
        <Box
          w="5px" h="5px" borderRadius="full" bg="#16A34A"
          style={{ animation: "live-pulse 1.4s ease-in-out infinite" }}
        />
      )}
      <style>{`@keyframes live-pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }`}</style>
      {countdown.isPast ? "Live now" : countdown.label}
    </Box>
  );
};

type Props = { searchTerm?: string };

const LIMIT = 10;

const ConsultationHistory: FC<Props> = ({ searchTerm = "" }) => {
  const [page, setPage] = useState(1);
  const [reviewItem, setReviewItem]   = useState<any>(null);
  const [receiptItem, setReceiptItem] = useState<any>(null);
  const router = useRouter();

  const { data, isLoading, isFetching } = useGetUpcomingConsultationQuery({ page, limit: LIMIT });

  const appointments: any[] = (data as any)?.data?.consultations
    ?? (data as any)?.data?.appointments
    ?? (data as any)?.data
    ?? [];
  const totalPages: number = (data as any)?.data?.pagination?.totalPages
    ?? (data as any)?.pagination?.totalPages
    ?? 1;

  const term = searchTerm.toLowerCase().trim();
  const rows = appointments.filter((a: any) => {
    if (!term) return true;
    return (a.consultant?.fullName ?? "").toLowerCase().includes(term);
  });

  const fmtDate = (val: string) => {
    if (!val) return "—";
    try { return format(new Date(val), "dd MMM yyyy, h:mmaaa"); }
    catch { return val; }
  };

  return (
    <Stack w="full" gap={4}>
      <Box w="full" overflowX="auto" borderRadius="lg" borderWidth="1px" borderColor="gray.100">
        <Table.Root size="sm" w="full" style={{ minWidth: 580 }}>
          <Table.Header>
            <Table.Row bg="main_background">
              <Table.ColumnHeader
                fontFamily="Outfit" fontWeight="600" fontSize="0.8rem"
                color="gray.500" px={4} py={3} textTransform="uppercase" letterSpacing="0.04em"
              >
                Consultant
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Outfit" fontWeight="600" fontSize="0.8rem"
                color="gray.500" px={4} py={3} textTransform="uppercase" letterSpacing="0.04em"
              >
                Date &amp; Time
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Outfit" fontWeight="600" fontSize="0.8rem"
                color="gray.500" px={4} py={3} textTransform="uppercase" letterSpacing="0.04em"
              >
                Topic
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontFamily="Outfit" fontWeight="600" fontSize="0.8rem"
                color="gray.500" px={4} py={3} textTransform="uppercase" letterSpacing="0.04em"
              >
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader px={4} py={3} w="60px" />
            </Table.Row>
          </Table.Header>

          <Table.Body className={outfit.className}>
            {isLoading || isFetching ? (
              <Table.Row>
                <Table.Cell colSpan={5} py={12} textAlign="center">
                  <HStack justify="center" gap={2}>
                    <Spinner size="sm" color="gray.400" />
                    <Text fontSize="0.875rem" color="gray.400" fontFamily="Outfit">Loading…</Text>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ) : rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={5} py={12} textAlign="center">
                  <Text fontSize="0.875rem" color="gray.400" fontFamily="Outfit">
                    No consultations found.
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              rows.map((item: any) => {
                const statusKey = (item.status ?? "").toUpperCase();
                const statusStyle = statusColorMap[statusKey] ?? { color: "#6B7280", bg: "#F3F4F6" };
                const statusLabel = statusKey === "NO_SHOW"
                  ? "No Show"
                  : (item.status ?? "").charAt(0).toUpperCase() + (item.status ?? "").slice(1).toLowerCase();
                const isJoinable = ["UPCOMING", "CONFIRMED", "PENDING"].includes(statusKey);

                return (
                  <Table.Row
                    key={item.id}
                    _hover={{ bg: "main_background" }}
                    transition="background 0.15s"
                    cursor="pointer"
                    onClick={() => router.push(`/consultation/view?consultation_id=${item.id}`)}
                  >
                    {/* Consultant */}
                    <Table.Cell px={4} py={3}>
                      <HStack gap={2.5}>
                        <Image
                          src={safeProfilePic(item.consultant?.profilePics ?? item.consultant?.avatar)}
                          onError={imgErrorFallback}
                          alt={item.consultant?.fullName ?? "Consultant"}
                          boxSize="36px"
                          borderRadius="full"
                          objectFit="cover"
                          flexShrink={0}
                        />
                        <VStack align="flex-start" gap={0} minW={0}>
                          <Text
                            fontSize="0.875rem" fontWeight="600" color="text_primary"
                            fontFamily="Outfit" truncate maxW="160px"
                          >
                            {item.consultant?.fullName ?? "—"}
                          </Text>
                          {(item.consultant?.title || item.consultant?.occupation) && (
                            <Text fontSize="0.72rem" color="gray.400" fontFamily="Outfit" truncate maxW="160px">
                              {item.consultant?.title ?? item.consultant?.occupation}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                    </Table.Cell>

                    {/* Date */}
                    <Table.Cell px={4} py={3}>
                      <Text fontSize="0.8rem" color="gray.500" fontFamily="Outfit" whiteSpace="nowrap">
                        {fmtDate(item.scheduledDateTimeStart ?? item.scheduledAt ?? item.createdAt)}
                      </Text>
                    </Table.Cell>

                    {/* Topic */}
                    <Table.Cell px={4} py={3}>
                      <Text fontSize="0.8rem" color="text_primary" fontFamily="Outfit" truncate maxW="140px">
                        {item.topic ?? item.subject ?? item.title ?? "—"}
                      </Text>
                    </Table.Cell>

                    {/* Status */}
                    <Table.Cell px={4} py={3}>
                      <Box
                        display="inline-flex"
                        alignItems="center"
                        px={2.5}
                        py={0.5}
                        borderRadius="full"
                        bg={statusStyle.bg}
                      >
                        <Text fontSize="0.75rem" fontWeight="600" color={statusStyle.color} fontFamily="Outfit">
                          {statusLabel}
                        </Text>
                      </Box>
                    </Table.Cell>

                    {/* Actions */}
                    <Table.Cell px={4} py={3} onClick={(e) => e.stopPropagation()}>
                      {isJoinable ? (
                        <VStack align="flex-end" gap={1}>
                          <CountdownBadge appointment={item} />
                          <Button
                            size="xs"
                            bg="#111D4A"
                            color="white"
                            borderRadius="6px"
                            fontFamily="Outfit"
                            fontSize="0.75rem"
                            px={3}
                            h="28px"
                            _hover={{ opacity: 0.85 }}
                            onClick={() => router.push(`/message/videoconsultation?consultationId=${item.id}`)}
                          >
                            Join
                          </Button>
                        </VStack>
                      ) : (
                        <Menu.Root positioning={{ placement: "bottom-end" }}>
                          <Menu.Trigger asChild>
                            <Button
                              variant="ghost"
                              size="xs"
                              p={1.5}
                              borderRadius="6px"
                              color="gray.400"
                              _hover={{ bg: "gray.100", color: "text_primary" }}
                              aria-label="More options"
                            >
                              <LuEllipsis size={16} />
                            </Button>
                          </Menu.Trigger>
                          <Portal>
                            <Menu.Positioner zIndex="max">
                              <Menu.Content
                                bg="bg_box"
                                borderWidth="1px"
                                borderColor="gray.100"
                                borderRadius="10px"
                                shadow="lg"
                                minW="180px"
                                p={1}
                              >
                                <Menu.Item
                                  value="view"
                                  px={3} py={2.5} borderRadius="7px" cursor="pointer"
                                  _hover={{ bg: "main_background" }}
                                  onClick={() => router.push(`/consultation/view?consultation_id=${item.id}`)}
                                >
                                  <HStack gap={2.5}>
                                    <Image src="/icons/view.svg" alt="" boxSize="15px" />
                                    <Text fontSize="0.825rem" color="text_primary" fontFamily="Outfit">View Details</Text>
                                  </HStack>
                                </Menu.Item>
                                <Menu.Item
                                  value="rate"
                                  px={3} py={2.5} borderRadius="7px" cursor="pointer"
                                  _hover={{ bg: "main_background" }}
                                  onClick={() => setReviewItem(item)}
                                >
                                  <HStack gap={2.5}>
                                    <Image src="/icons/star.svg" alt="" boxSize="15px" />
                                    <Text fontSize="0.825rem" color="text_primary" fontFamily="Outfit">Rate Consultant</Text>
                                  </HStack>
                                </Menu.Item>
                                <Menu.Item
                                  value="receipt"
                                  px={3} py={2.5} borderRadius="7px" cursor="pointer"
                                  _hover={{ bg: "main_background" }}
                                  onClick={() => setReceiptItem(item)}
                                >
                                  <HStack gap={2.5}>
                                    <Image src="/icons/watch.svg" alt="" boxSize="15px" />
                                    <Text fontSize="0.825rem" color="text_primary" fontFamily="Outfit">Payment Receipt</Text>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <HStack justify="center" gap={1} py={2}>
          <Button
            variant="ghost" size="sm" px={2} borderRadius="8px"
            color="text_primary" disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <LuChevronLeft size={16} />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce<(number | "…")[]>((acc, p, i, arr) => {
              if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "…" ? (
                <Text key={`ellipsis-${i}`} fontSize="0.875rem" color="gray.400" px={1}>…</Text>
              ) : (
                <Button
                  key={p}
                  size="sm"
                  w={8} h={8}
                  borderRadius="8px"
                  fontSize="0.875rem"
                  fontWeight={p === page ? "700" : "400"}
                  bg={p === page ? "#111D4A" : "transparent"}
                  color={p === page ? "white" : "text_primary"}
                  _hover={{ bg: p === page ? "#111D4A" : "gray.100" }}
                  onClick={() => setPage(p as number)}
                >
                  {p}
                </Button>
              )
            )}
          <Button
            variant="ghost" size="sm" px={2} borderRadius="8px"
            color="text_primary" disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <LuChevronRight size={16} />
          </Button>
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
