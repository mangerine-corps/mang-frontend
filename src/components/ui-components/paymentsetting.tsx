import {
  Box,
  Text,
  HStack,
  VStack,
  Image,
  Link,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import CancelSubscription from "./modals/cancelsub";
import { outfit } from "mangarine/pages/_app";

const PaymentSetting = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cancelSub, setCancelSub] = useState<boolean>(false);
    const [deletePayment, setDeletePayment] = useState<boolean>(false);
  const paymentOptions = [
    {
      label: "Card (Powered by Stripe)",
      value: "card",
      details: "**** 1234",
      editIcon: "/icons/edit.svg",
      deleteIcon: "/icons/delete2.svg",
    },
    {
      label: "PayPal",
      value: "paypal",
      details: "john.doe@example.com",
      editIcon: "/icons/edit.svg",
      deleteIcon: "/icons/delete2.svg",
    },
  ];

  return (
    <Box className={outfit.className} w="full" p={{ base: 4, sm: 6, md: 8, lg: 10, xl: 12 }} borderRadius="lg" boxShadow="lg" bg="bg_box" mt={{ base: 4, md: 8, lg: 0, xl: "flex" }}>
      <Text
        fontSize={{base:"1rem", md:"1.5rem", lg:"1.5rem"}}
        fontWeight="600"
        lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
        font="outfit"
        color="text_primary"
        mb={6}
      >
        Payment Method
      </Text>

      <VStack align="start" >
        {paymentOptions.map((option) => (
          <Box key={option.value} w="100%">
            <HStack justify="space-between">
              <Box>
                <Text
                  font="outfit"
                  fontWeight="600"
                  lineHeight={{base: "18px",  sm: "20px",  md: "22px",  lg: "24px",  xl: "24px" }}
                  fontSize="1rem"
                  color="text_primary"
                  mb={2}
                >
                  {option.label}
                  <Text pl="4" fontWeight="400" as="span">
                    {option.details}
                  </Text>
                </Text>
              </Box>

              <HStack spaceX={"2"}>
                <Stack
                  borderWidth="1px"
                  borderColor="grey.50"
                  rounded={"6px"}
                  py="2"
                  px="2"
                  alignItems={"center"}
                  justifyContent={"center"}
                  cursor="pointer"
                  onClick={() => {}}
                  shadow={"xs"}
                >
                  <Image boxSize="5" src={option.editIcon} alt="Edit" />
                </Stack>
                <Stack
                  borderWidth="1px"
                  borderColor="grey.50"
                  rounded={"6px"}
                  py="2"
                  px="2"
                  alignItems={"center"}
                  justifyContent={"center"}
                  cursor="pointer"
                  shadow={"xs"}
                  onClick={() => {
                    setDeletePayment(true);
                  }}
                >
                  <Image boxSize="5" src={option.deleteIcon} alt="Delete" />
                </Stack>
              </HStack>
            </HStack>

            {/* Set as default selector below each option */}
            <Box
              mt={2}
              display="flex"
              alignItems="center"
              gap="8px"
              cursor="pointer"
              onClick={() => setPaymentMethod(option.value)}
            >
              <Box
                height="16px"
                width="16px"
                borderRadius="50%"
                border="2px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {paymentMethod === option.value && (
                  <Box height="8px" width="8px" borderRadius="50%" bg="black" />
                )}
              </Box>
              <Text
                color="gray.600"
                font="outfit"
                fontWeight="400"
                fontSize="1rem"
              >
                Set as default
              </Text>
            </Box>
          </Box>
        ))}
      </VStack>

      <Text
        fontSize={{base:"1rem", md:"1.5rem", lg:"1.5rem"}}
        fontWeight="600"
        lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
        font="outfit"
        color="text_primary"
        mb={2}
        mt="6"
      >
        Subscription Management
      </Text>

      <HStack w="100%" justify="space-between">
        <Text
          fontSize="1rem"
          fontWeight="600"
          lineHeight={{base: "18px",  sm: "20px",  md: "22px",  lg: "24px",  xl: "24px" }}
          font="outfit"
          color="text_primary"
          mt={4}
        >
          Current Plan:
        </Text>
        <Text color="text_primary" mt={4}>
          Premium [$9.99/month]
        </Text>
      </HStack>

      <Box mt={4}>
        <Text
          onClick={() => {
            setCancelSub(true);
          }}
          color="blue.700"
          fontSize="1rem"
          fontWeight="600"
          mt={4}
          font="outfit"
          cursor={"pointer"}
        >
          Cancel Subscription
        </Text>
      </Box>
      <CancelSubscription
        isOpen={cancelSub}
        onOpenChange={() => {
          setCancelSub(false);
        }}
      />
    </Box>
  );
};

export default PaymentSetting;
