import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { type ElementType, type SVGProps } from "react";
import { FiHeart } from "react-icons/fi";

type MenuItem = {
  action?: () => void;
  icon: ElementType;
  label: string;
};

type MenuSection = {
  items: MenuItem[];
};

const SavedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M3.34326 1.16667C3.46045 0.963687 3.62908 0.795184 3.83215 0.678142C4.03521 0.561101 4.26555 0.499656 4.49993 0.500001H8.49993C8.85355 0.500001 9.19269 0.640477 9.44274 0.890526C9.69279 1.14057 9.83326 1.47971 9.83326 1.83333V9.83333L9.1666 9.43333M5.83333 3.16667C6.18696 3.16667 6.52609 3.30714 6.77614 3.55719C7.02619 3.80724 7.16667 4.14638 7.16667 4.5V12.5L3.83333 10.5L0.5 12.5V4.5C0.5 4.14638 0.640476 3.80724 0.890524 3.55719C1.14057 3.30714 1.47971 3.16667 1.83333 3.16667H5.83333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PaymentsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M9.83333 3.16667V1.83333C9.83333 1.47971 9.69286 1.14057 9.44281 0.890524C9.19276 0.640476 8.85362 0.5 8.5 0.5H1.83333C1.47971 0.5 1.14057 0.640476 0.890524 0.890524C0.640476 1.14057 0.5 1.47971 0.5 1.83333V5.83333C0.5 6.18695 0.640476 6.52609 0.890524 6.77614C1.14057 7.02619 1.47971 7.16667 1.83333 7.16667H3.16667M3.16667 4.5C3.16667 4.14638 3.30714 3.80724 3.55719 3.55719C3.80724 3.30714 4.14638 3.16667 4.5 3.16667H11.1667C11.5203 3.16667 11.8594 3.30714 12.1095 3.55719C12.3595 3.80724 12.5 4.14638 12.5 4.5V8.5C12.5 8.85362 12.3595 9.19276 12.1095 9.44281C11.8594 9.69286 11.5203 9.83333 11.1667 9.83333H4.5C4.14638 9.83333 3.80724 9.69286 3.55719 9.44281C3.30714 9.19276 3.16667 8.85362 3.16667 8.5V4.5ZM6.5 6.5C6.5 6.85362 6.64048 7.19276 6.89052 7.44281C7.14057 7.69286 7.47971 7.83333 7.83333 7.83333C8.18696 7.83333 8.52609 7.69286 8.77614 7.44281C9.02619 7.19276 9.16667 6.85362 9.16667 6.5C9.16667 6.14638 9.02619 5.80724 8.77614 5.55719C8.52609 5.30714 8.18696 5.16667 7.83333 5.16667C7.47971 5.16667 7.14057 5.30714 6.89052 5.55719C6.64048 5.80724 6.5 6.14638 6.5 6.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TransactionHistoryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M3.16667 3.16667H7.16667M3.16667 5.83333H7.16667M5.83333 8.5H7.16667M0.5 12.5V1.83333C0.5 1.47971 0.640476 1.14057 0.890524 0.890524C1.14057 0.640476 1.47971 0.5 1.83333 0.5H8.5C8.85362 0.5 9.19276 0.640476 9.44281 0.890524C9.69286 1.14057 9.83333 1.47971 9.83333 1.83333V12.5L7.83333 11.1667L6.5 12.5L5.16667 11.1667L3.83333 12.5L2.5 11.1667L0.5 12.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ScheduledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M5.5 12.5H1.83333C1.47971 12.5 1.14057 12.3595 0.890524 12.1095C0.640476 11.8594 0.5 11.5203 0.5 11.1667V3.16667C0.5 2.81304 0.640476 2.47391 0.890524 2.22386C1.14057 1.97381 1.47971 1.83333 1.83333 1.83333H9.83333C10.187 1.83333 10.5261 1.97381 10.7761 2.22386C11.0262 2.47391 11.1667 2.81304 11.1667 3.16667V7.16667M8.5 0.5V3.16667M3.16667 0.5V3.16667M0.5 5.83333H11.1667M7.83333 11.1667L9.16667 12.5L11.8333 9.83333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ConsultationHistoryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1.83333 0.5H4.5L6.5 2.5H11.1667C11.5203 2.5 11.8594 2.64048 12.1095 2.89052C12.3595 3.14057 12.5 3.47971 12.5 3.83333V9.16667C12.5 9.52029 12.3595 9.85943 12.1095 10.1095C11.8594 10.3595 11.5203 10.5 11.1667 10.5H1.83333C1.47971 10.5 1.14057 10.3595 0.890524 10.1095C0.640476 9.85943 0.5 9.52029 0.5 9.16667V1.83333C0.5 1.47971 0.640476 1.14057 0.890524 0.890524C1.14057 0.640476 1.47971 0.5 1.83333 0.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const JobsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M1.83333 0.5H4.5L6.5 2.5H11.1667C11.5203 2.5 11.8594 2.64048 12.1095 2.89052C12.3595 3.14057 12.5 3.47971 12.5 3.83333V9.16667C12.5 9.52029 12.3595 9.85943 12.1095 10.1095C11.8594 10.3595 11.5203 10.5 11.1667 10.5H1.83333C1.47971 10.5 1.14057 10.3595 0.890524 10.1095C0.640476 9.85943 0.5 9.52029 0.5 9.16667V1.83333C0.5 1.47971 0.640476 1.14057 0.890524 0.890524C1.14057 0.640476 1.47971 0.5 1.83333 0.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BusinessIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M0.5 11.8333V3.16667L6.5 0.5L12.5 3.16667V11.8333M7.16667 6.5H9.83333V11.8333H3.16667V7.83333H7.16667M7.16667 11.8333V5.83333C7.16667 5.65652 7.09643 5.48695 6.9714 5.36193C6.84638 5.2369 6.67681 5.16667 6.5 5.16667H5.16667C4.98986 5.16667 4.82029 5.2369 4.69526 5.36193C4.57024 5.48695 4.5 5.65652 4.5 5.83333V7.83333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DashboardCard = () => {
  const router = useRouter();

  // Saved items and jobs don't have active destinations in the current app shell yet.
  const menuSections: MenuSection[] = [
    {
      items: [
        { icon: SavedIcon, label: "Saved Items" },
        {
          icon: PaymentsIcon,
          label: "Payment History",
          action: () => router.push("/my-business?tab=wallet"),
        },
        {
          icon: TransactionHistoryIcon,
          label: "Transaction History",
          action: () => router.push("/my-business?tab=wallet"),
        },
      ],
    },
    {
      items: [
        {
          icon: ScheduledIcon,
          label: "Scheduled Consultants",
          action: () => router.push("/consultation"),
        },
        {
          icon: FiHeart,
          label: "Favorite Consultant",
          action: () => router.push("/consultation"),
        },
        {
          icon: ConsultationHistoryIcon,
          label: "Consultation History",
          action: () => router.push("/consultation"),
        },
      ],
    },
    {
      items: [{ icon: JobsIcon, label: "Jobs" }],
    },
    {
      items: [
        {
          icon: BusinessIcon,
          label: "My Business",
          action: () => router.push("/my-business"),
        },
      ],
    },
  ];

  return (
    <VStack
      w={{ base: "100%", sm: "90%", md: "100%" }}
      maxW={{ base: "full", md: "340px", lg: "400px" }}
      align="stretch"
      gap={3}
    >
      {menuSections.map((section, sectionIndex) => (
        <Box
          key={sectionIndex}
          w="full"
          borderWidth="2px"
          borderStyle="solid"
          borderColor="#E8E8E9"
          borderRadius="16px"
          bg="transparent"
          p="12px"
        >
          <VStack w="full" align="stretch" gap={1}>
            {section.items.map((item) => (
              <Box
                key={item.label}
                as={item.action ? "button" : "div"}
                type={item.action ? "button" : undefined}
                w="full"
                onClick={item.action}
                cursor={item.action ? "pointer" : "default"}
                borderRadius="12px"
                bg="transparent"
                px="14px"
                py="12px"
                textAlign="left"
              >
                <HStack gap={3}>
                  <Icon as={item.icon} boxSize={5} color="text_primary" />
                  <Text
                    fontFamily="Outfit"
                    fontSize="0.95rem"
                    fontWeight="400"
                    fontStyle="normal"
                    color="text_primary"
                  >
                    {item.label}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      ))}

      {/* Become a Consultant button hidden for now. */}
    </VStack>
  );
};

export default DashboardCard;
