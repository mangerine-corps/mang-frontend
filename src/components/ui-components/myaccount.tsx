import {
  Box,
  Text,
  HStack,
  VStack,
  Image,
  Link,
  Stack,
  Button,
  Switch,
  RadioGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import CancelSubscription from "./modals/cancelsub";
import ShareReview from "./sharereview";
import AddPayment from "./addpayment";

const MyAccount = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [value, setValue] = useState<string>("");

    const [addPayment, setAddPayment] = useState<boolean>(false);
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
    <Box w="full" p={8} borderRadius="lg" boxShadow="lg" bg="bg_box" mt={0}>
      <HStack
        mb="6"
        alignItems={"center"}
        justifyContent={"space-between"}
        w="full"
      >
        <Text
          fontSize="1.5rem"
          fontWeight="600"
          lineHeight="36px"
          font="outfit"
          color="text_primary"
          // mb={6}
          textAlign={"left"}
        >
          Payout Method
        </Text>
        <Stack
          borderWidth="1px"
          borderColor="grey.50"
          rounded={"6px"}
          py="2"
          px="2"
          alignItems={"center"}
          justifyContent={"center"}
          cursor="pointer"
          onClick={() => {setAddPayment(true)}}
          shadow={"xs"}
        >
          <Image
            src="/icons/plus.svg"
            alt="add payout method"
            // boxSize="4"
          />
        </Stack>
      </HStack>

      <VStack align="start" wordSpacing={8}>
        {paymentOptions.map((option) => (
          <Box key={option.value} w="100%">
            <HStack justify="space-between">
              <Box>
                <Text
                  font="outfit"
                  fontWeight="600"
                  lineHeight="24px"
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

      <Box my={10}>
        <Switch.Root
          w="full"
          alignItems={"flex-start"}
          justifyContent={"space-between"}
        >
          <Switch.Label
            font="outfit"
            fontSize="1.5rem"
            fontWeight="600"
            color="text_primary"
            lineHeight="36px"
          >
            Notification
          </Switch.Label>
          <Switch.HiddenInput />
          <Switch.Control />
        </Switch.Root>

        <Text
          font="outfit"
          fontSize="0.875rem"
          fontWeight="400"
          color="grey.300"
          lineHeight="30px"
          mb="4"
        >
          Receive updates via email for messages, requests, announcements, and
          payments.
        </Text>
        <VStack
          w="full"
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
          my="4"
        >
          <RadioGroup.Root
            value={value}
            onValueChange={(e) => setValue(e.value)}
            w="full"
          >
            <VStack w="full" gapY={4}>
              {[
                { id: 1, label: "Email" },
                { id: 2, label: "SMS" },
                // { id: 2, label: "Platform announcement" },
              ].map((item) => (
                <RadioGroup.Item
                  key={item.id}
                  value={item.label}
                  w="full"
                  alignItems={"flex-start"}
                  justifyContent={"space-between"}
                >
                  <RadioGroup.ItemText
                    color={"text_primary"}
                    fontSize={"1.25rem"}
                    fontWeight={"400"}
                  >
                    {item.label}
                  </RadioGroup.ItemText>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                </RadioGroup.Item>
              ))}
            </VStack>
          </RadioGroup.Root>
        </VStack>
      </Box>

      <AddPayment
        open={addPayment}
        onOpenChange={() => {
          setAddPayment(false);
        }}
      />
    </Box>
  );
};

export default MyAccount;
