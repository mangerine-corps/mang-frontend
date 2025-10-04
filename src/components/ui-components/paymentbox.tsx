import { Box, Text, Flex, Input, Button, Image } from "@chakra-ui/react";
import { useState } from "react";

const PaymentBox = ({onClick}) => {
  // const [remember, setRemember] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  // const handleCheckLinkPress = () => {
  //   setRemember(!remember);
  // };

  const paymentOptions = [
    { label: "Card (Powered by Stripe)", value: "card" },
    { label: "PayPal", value: "paypal" },
  ];

  return (
    <Box
      // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}

      w="full"
    >

      {/* payment information box */}
      <Box
        maxW="360px"
        w="100%"
        bg="bg_box"
        p="16px"
        borderRadius="8px"
        boxShadow="md"
        mx="auto"
      >
        <Text
          fontSize="lg"
          fontWeight="bold"
          font="outfit"
          color={"text_primary"}
        >
          Payment Information
        </Text>

        <Flex flexDirection="column" gap="8px" width="100%">
          {[
            "Consultation Fee",
            "Manager Fee",
            "Recording Fee",
            "Total Fee",
          ].map((item, index) => (
            <Flex key={index} justify="space-between" width="100%">
              <Text fontSize="0.875rem" color={"text_primary"}>
                {item}
              </Text>
              <Text
                fontWeight={item === "Total Fee" ? "bold" : "normal"}
                fontSize="0.875rem"
                color="text_primary"
              >
                {item === "Consultation Fee"
                  ? "$50.00"
                  : item === "Manager Fee"
                    ? "$10.00"
                    : item === "Recording Fee"
                      ? "$5.00"
                      : "$65.00"}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* payment method and form */}
      <Box
        mt={6}
        display="flex"
        flexDirection="column"
        gap="16px"
        padding="16px"
        width="100%"
      >
        <Text fontWeight={"bold"} color={"text_primary"}>
          Pay with
        </Text>

        <Flex gap="20px">
          {paymentOptions.map((option) => (
            <Box
              key={option.value}
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
                border="2px solid "
                borderColor={"text_primary"}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {paymentMethod === option.value && (
                  <Box
                    height="8px"
                    width="8px"
                    borderRadius="50%"
                    bg="text_primary"
                  />
                )}
              </Box>
              <Text color="text_primary">{option.label}</Text>
            </Box>
          ))}
        </Flex>

        <Flex flexDirection="column" gap="30px" width="100%">
          <Box>
            <Flex alignItems="center" gap="1" mb={1}>
              <Text
                color="text_primary"
                fontSize="0.75rem"
                fontFamily="outfit"
                fontWeight="normal"
              >
                Card Number
              </Text>
              <Image
                src="/icons/star.svg"
                alt="required"
                boxSize="6px"
                mt="1px"
              />
            </Flex>
            <Box position="relative" width="100%">
              <Input
                name="cardNumber"
                type="text"
                placeholder="1234 5678 9012 3456"
                pl="10px"
                pr="40px"
                _placeholder={{ color: "gray.400" }}
              />

              <Image
                src="/icons/card.svg"
                alt="card icon"
                position="absolute"
                right="12px"
                top="50%"
                transform="translateY(-50%)"
                // boxSize="20px"
                pointerEvents="none"
              />
            </Box>
          </Box>

          <Box>
            <Flex alignItems="center" gap="1" mb={1}>
              <Text
                color="text_primary"
                fontSize="0.75rem"
                fontFamily="outfit"
                fontWeight="normal"
              >
                Beneficiary
              </Text>
              <Image
                src="/icons/star.svg"
                alt="required"
                boxSize="6px"
                mt="1px"
              />
            </Flex>
            <Box position="relative" width="100%">
              <Input
                name="name"
                type="text"
                placeholder="Grace Shawn"
                pl="10px"
                pr="40px"
                fontSize="1rem"
                _placeholder={{ color: "gray.400" }}
              />

              <Image
                src="/icons/user.svg"
                alt="user icon"
                position="absolute"
                right="12px"
                top="50%"
                transform="translateY(-50%)"
                // boxSize="20px"
                pointerEvents="none"
              />
            </Box>
          </Box>

          <Flex gap="16px" width="100%">
            <Box width="50%">
              <Flex alignItems="center" gap="1" mb={1}>
                <Text
                  color="text_primary"
                  fontFamily="outfit"
                  fontSize="0.75rem"
                  fontWeight="normal"
                >
                  Expiration Date
                </Text>
                <Image
                  src="/icons/star.svg"
                  alt="star icon"
                  boxSize="6px"
                  mt="1px"
                />
              </Flex>

              <Box position="relative" width="100%">
                <Input
                  name="expirationDate"
                  type="text"
                  placeholder="MM/YY"
                  pl="10px"
                  pr="40px"
                  _placeholder={{ color: "gray.400" }}
                  // focusBorderColor="orange.400"
                />

                <Image
                  src="/icons/card.svg"
                  alt="card icon"
                  position="absolute"
                  right="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  // boxSize="20px"
                  pointerEvents="none"
                />
              </Box>
            </Box>

            <Box width="50%">
              <Flex alignItems="center" gap="1" mb={1}>
                <Text
                  color="text_primary"
                  fontFamily="outfit"
                  fontSize="0.75rem"
                  fontWeight="normal"
                >
                  CVV
                </Text>
                <Image
                  src="/icons/star.svg"
                  alt="star icon"
                  boxSize="6px"
                  mt="1px"
                />
              </Flex>

              <Box position="relative" width="100%">
                <Input
                  name="cvv"
                  type="text"
                  placeholder="CVV"
                  pl="10px"
                  pr="40px"
                  _placeholder={{ color: "gray.400" }}
                  //focusBorderColor="orange.400"
                />

                <Image
                  src="/icons/card.svg"
                  alt="card icon"
                  position="absolute"
                  right="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  boxSize="20px"
                  pointerEvents="none"
                />
              </Box>
            </Box>
          </Flex>

          {/* Optional: Remember card check */}
          <Flex align="center" mb={6}>
            <input
              type="checkbox"
              id="box"
              //checked={videoOption}
              //onChange={(e) => setVideoOption(e.target.checked)}
              style={{
                marginRight: "8px",
                width: "16px",
                height: "16px",
              }}
            />
            <Text
              color="text_primary"
              lineHeight="24px"
              fontSize="1rem"
              font="outfit"
              fontWeight="200"
            >
              Save card details
            </Text>
          </Flex>
        </Flex>

        <Button
          bg="bt_schedule"
          color="white"
          flex={1}
          borderRadius="6px"
          p="10px"
          _hover={{ bg: "bt_schedule_hover" }}
          width="100%"
          mt={6}
          onClick={onClick}
        >
          Pay | $65.00
        </Button>
        <Text color={"text_primary"} fontSize={"14px"}>
          Your payment information is safeguarded with advanced encryption
          technology
        </Text>
      </Box>
    </Box>
  );
};

export default PaymentBox;
