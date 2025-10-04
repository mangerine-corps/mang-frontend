import { Box, Button, HStack, Badge, Spinner, Stack, Text, VStack, Pagination, ButtonGroup, IconButton } from "@chakra-ui/react";
import AppLayout from "mangarine/layouts/AppLayout";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import ActivityEmptyState from "mangarine/components/ui-components/emptystate";
import { useMemo, useState } from "react";
import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
  useDeleteNotificationMutation
} from "mangarine/state/services/notifications.service";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { MdMarkEmailRead } from "react-icons/md";
import { BiTrash } from "react-icons/bi";
import { format } from "date-fns";

const Notification = () => {
  // Local pagination state
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const { data, isLoading, refetch, isFetching } = useGetNotificationsQuery({ page, limit });
  const [markAsRead, { isLoading: marking }] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: markingAll }] = useMarkAllAsReadMutation();
  const [deleteNotification, { isLoading: deleting }] = useDeleteNotificationMutation();

  const items = useMemo(() => data?.data ?? [], [data]);
  const totalPages = data?.totalPages ?? 1;
  const totalItems = data?.total ?? 0;

  const onMarkAll = async () => {
    try { await markAllAsRead().unwrap(); refetch(); } catch { }
  };

  const onMark = async (id: string) => {
    try { await markAsRead({ notificationId: id }).unwrap(); refetch(); } catch { }
  };

  const onDelete = async (id: string) => {
    try { await deleteNotification({ id }).unwrap(); refetch(); } catch { }
  };

  return (
    <AppLayout>

      <Box
        display={"flex"}
        // bg="red.900"
        flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
        // alignItems={"center"}
        my={{ base: "0", md: "12px" }}
        justifyContent={"space-between"}
        w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
        mx="auto"
        pos="relative"
        overflowY={"scroll"}
        // spaceY={{ base: "4", md: "0" }}
        css={{
          "&::-webkit-scrollbar": {
            width: "0px",

            height: "0px",
          },
          "&::-webkit-scrollbar-track": {
            width: "0px",
            background: "transparent",

            height: "0px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "0px",
            maxHeight: "0px",
            height: "0px",
            width: 0,
          },
        }}
      >
        <VStack bg={{ base: "bg_box", md: "transparent" }} display={{ base: "none", md: "none", lg: "none", xl: "flex" }} >
          <Biocard />

          <DashboardCard />
        </VStack>
        <VStack
          mx={4}

          my={{ base: "4", md: "0" }}
          flex={1}
          bg="white"
          overflowY={"auto"}
          css={{
            "&::-webkit-scrollbar": {
              width: "0px",

              height: "0px",
            },
            "&::-webkit-scrollbar-track": {
              width: "0px",
              background: "transparent",

              height: "0px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
              borderRadius: "0px",
              maxHeight: "0px",
              height: "0px",
              width: 0,
            },
          }}
          rounded={"xl"}
          overflowX="hidden"
        >

          <Stack spaceY={4} flex={3} bg="bg_box" w="full" mx={4} px={4}>
            <HStack justify="space-between" py={4}>
              <Text fontSize="lg" fontWeight="600">Notifications</Text>
              <HStack>
                <Button size="xs" color="main_background" px="2" colorScheme="blue" onClick={onMarkAll} loading={markingAll}>Mark All As Read</Button>
              </HStack>
            </HStack>

            {isLoading || isFetching ? (
              <HStack justify="center" py={8}><Spinner size="sm" /><Text>Loading...</Text></HStack>
            ) : items.length === 0 ? (
              <Text py={8} textAlign="center">No notifications</Text>
            ) : (
              <Stack>
                {items.map((n: any) => (
                  <HStack key={n.id} justify="space-between" bg="white" rounded="md" p={3} borderWidth="1px">
                    <Stack gap={1}>
                      <HStack>
                        <Text fontWeight="600">{n.title}</Text>
                        <Badge px="1" colorScheme={n.status === 'UNREAD' || n.status === 'unread' ? 'blue' : 'gray'}>{format(n.created_at, 'dd/MM/yyyy')}</Badge>
                        {/* {n.priority && <Badge>{(n.priority || '').toString().toUpperCase()}</Badge>} */}
                        {n.type && <Badge px="1" variant="outline">{n.type}</Badge>}
                      </HStack>
                      <Text fontSize="sm" color="gray.600">{n.message}</Text>
                    </Stack>
                    <HStack>
                      {((n.status || '').toString().toUpperCase() !== 'READ') && (
                        <Button size="sm" variant="outline" onClick={() => onMark(n.id)} loading={marking}><MdMarkEmailRead /></Button>
                      )}
                      <Button size="sm" colorScheme="red" variant="outline" onClick={() => onDelete(n.id)} loading={deleting}><BiTrash /></Button>
                    </HStack>
                  </HStack>
                ))}
              </Stack>
            )}

            {
              totalPages > 1 && (
                <HStack justify="center" py={4}>
                  <Pagination.Root count={totalItems} pageSize={limit} defaultPage={1} key={'md'}>
                    <ButtonGroup variant="ghost" size={'md'}>
                      <Pagination.PrevTrigger asChild>
                        <IconButton disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                          <LuChevronLeft />
                        </IconButton>
                      </Pagination.PrevTrigger>

                      <Pagination.Items
                        render={(page) => (
                          <IconButton onClick={() => setPage(page.value)} variant={{ base: "ghost", _selected: "outline" }}>
                            {page.value}
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
              )
            }

          </Stack>
        </VStack>
        <VStack>
          <ActivityEmptyState />
        </VStack>
      </Box>
    </AppLayout>
  );
};

export default Notification;
