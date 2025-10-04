import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import Rescheduleconsultation from "mangarine/components/ui-components/modals/rescheduleconsultation";
import { useState } from "react"
const todayNotifications = [
  {
    id: 1,
    avatar: "/images/dp.png",
    title: "New Appointment Booked",
    description:
      "Reminder: You have an upcoming appointment with Sharon Grace on 12th of August. Don't forget to prepare your questions!",
    time: "4:30pm",
  },
  {
    id: 2,
    avatar: "/images/dp.png",
    title: "Payment Confirmation",
    description:
      "Payment confirmed: Your payment of $5,000 for the consultation with Abdul Sharron has been processed.",
    time: "4:38pm",
  },
  {
    id: 3,
    avatar: "/images/dp.png",
    title: "Review Request",
    description:
      "You have 6 days left to review your recent consultation with Mel Silver. Your feedback is valuable!",
    time: "4:38pm",
  },
  {
    id: 4,
    avatar: "/images/dp.png",
    title: "Session Review",
    description:
      "Reminder: Your group consultation session with Doreen Bush starts in 1 hour.",
    time: "4:38pm",
  },
];

const yesterdayNotifications = [
  {
    id: 5,
    avatar: "/images/dp.png",
    title: "Community Interaction",
    description:
      "Someone replied to your comment in the Virtual Assistant community discussion. Continue the conversation!",
    time: "4:38pm",
  },
  {
    id: 6,
    avatar: "/images/dp.png",
    title: "Canceled Consultation",
    description:
      "Your consultation with Riel Hungry on 5th of September at 3:00pm has been canceled. You can reschedule or request a refund.",
    time: "4:36pm",
    hasActions: true,
  },
  {
    id: 7,
    avatar: "/images/dp.png",
    title: "Profile Activity",
    description: "You have a new follower! View their profile and connect.",
    time: "4:38pm",
  },
  {
    id: 8,
    avatar: "/images/dp.png",
    title: "New Friend Request",
    description:
      "You've got a new friend request from Adejane Grace. They'd like to connect with you and see your posts. Check it out and decide whether to accept or decline their request.",
    time: "4:36pm",
  },
];

const NotificationItem = ({ notification }) => (

  <Flex
    p={3}
    gap={3}
    //_hover={{ bg: "gray.50" }}
    borderRadius="md"
    align="start"
    cursor="pointer"
  >
    <Image
      src={notification.avatar}
      alt={notification.title}
      boxSize="40px"
      borderRadius="full"
    />
    <Box flex="1">
      <Flex justify="space-between" gap={2} align="start">
        <Box>
          <Text
            font="outfit"
            color="text_primary"
            fontWeight="600"
            fontSize="1rem"
            mb={1}
          >
            {notification.title}
          </Text>
          <Text
            font="outfit"
            fontWeight="400"
            fontSize="0.875"
            color="gray.500"
          >
            {notification.description}
          </Text>
          {notification.hasActions && (
            
           <HStack
              mt={{ base: 6, sm: 8, md: 10 }}
              gap={{ base: 3, sm: 4 }}
              direction={{ base: "column", sm: "column", md: "row" }}
              justify={{ base: "center", sm: "center", md: "flex-end" }}
              align="stretch"
              w="full"
            >
              <Button
                // w={{ base: "100", sm: "full", md: "180px", lg: "196px", xl: "196px" }}
                // h={{ base: "44px", sm: "44px", md: "48px" }}
                px={{ base: 4, sm: 6, md: 8 }}
                   py={{ base: 4, sm: 6, md: 8 }}
                // gap="10px"
                borderRadius="8px"
                 color="text_primary"
                border="1px solid"
                variant="outline"
              >
                Request Refund
              </Button>

              <Button
                // w={{ base: "100", sm: "full", md: "180px", lg: "196px", xl: "196px" }}
                // h={{ base: "44px", sm: "44px", md: "48px" }}
                px={{ base: 4, sm: 6, md: 8 }}
                   py={{ base: 4, sm: 6, md: 8 }}
                gap="10px"
                borderRadius="8px"
                bg="blue.900"
                color="white"
                _hover={{ bg: "blue.800" }}
              >
                Reschedule
              </Button>
            </HStack>

          )}
        </Box>
        <Text
          font="outfit"
          color="text_primary"
          fontWeight="600"
          fontSize="1rem"
        >
          {notification.time}
        </Text>
      </Flex>
    </Box>
  </Flex>
);

const NotificationPage = () => {
  return (
    <Box
      w="full"
      h="full"
    >
      <Box px={4} py={4} borderBottomWidth="1px">
        <Flex justify="space-between" align="center">
          <Text
            font="inter"
            fontWeight="700"
            fontSize="1.25rem"
            color="text_primary"
          >
            Notification
          </Text>
          <Text
            font="inter"
            fontWeight="600"
            fontSize="0.935rem"
            cursor="pointer"
            color="blue.500"
          >
            Mark all as read
          </Text>
        </Flex>
      </Box>

      <VStack gap={4} align="stretch">
        <Box bg="bg_box" px={4} py={2}>
          <Text
            font="outfit"
            color="text_primary"
            fontWeight="600"
            fontSize="1rem"
          >
            Today
          </Text>
        </Box>
        {todayNotifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}

        <Box bg="bg_box" px={4} py={2}>
          <Text
            font="outfit"
            color="text_primary"
            fontWeight="600"
            fontSize="1rem"
          >
            Yesterday
          </Text>
        </Box>
        {yesterdayNotifications.map((n) => (
          <NotificationItem key={n.id} notification={n} />
        ))}
      </VStack>

      <Box mt={4} pt={4} borderTopWidth="1px">
        <Flex justify="center" gap={1} px={4} pb={4}>
          <Button size="sm" variant="ghost">
            <BiChevronLeft size={16} />
          </Button>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((page) => (
            <Button
              key={page}
              size="sm"
              variant={page === 5 ? "solid" : "ghost"}
              colorScheme={page === 5 ? "gray" : "gray"}
            >
              {page}
            </Button>
          ))}
          <Text color="gray.400" px={1}>
            ...
          </Text>
          <Button size="sm" variant="ghost">
            <BiChevronRight size={16} />
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default NotificationPage;
