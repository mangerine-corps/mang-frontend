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


const FeedBack = () => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [value, setValue] = useState<string>("");
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
    <Box
      w="full"
      p={8}
      borderRadius="lg"
      boxShadow="lg"
      bg="bg_box"
      mt={0}
    ></Box>
  );
};

export default FeedBack;
