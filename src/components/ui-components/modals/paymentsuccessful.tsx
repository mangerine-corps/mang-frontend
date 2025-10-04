import {
  Box,
  Button,
  Dialog,
  HStack,
  Image,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import CustomButton from "mangarine/components/customcomponents/button";

type PaymentSuccessfulModalProps = {
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  paymentAmount?: number;
};

const PaymentSuccessfulModal = ({
  onOpenChange,
  isOpen,
  paymentAmount = 0
}: PaymentSuccessfulModalProps) => {
  const router = useRouter();
  const successcheck = "/icons/successful.svg";

  const handleViewConsultants = () => {
    onOpenChange(false);
    router.push("/consultant");
  };

  const handleGoHome = () => {
    onOpenChange(false);
    router.push("/home");
  };

  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={(e) => onOpenChange(!!e.open)}
      placement={"center"}
      size={"lg"}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p="8" rounded={"xl"} bg="bg_box">
            <Dialog.Header>
              <Dialog.Title>
                {/* Header content */}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body w='full'>
              <VStack spaceY={12}>
                <Box
                  rounded="full"
                  h={24}
                  w={24}
                  alignSelf={"center"}
                  display={"flex"}
                  flexDir={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Image w={"full"} src={successcheck} alt={"success-icon"} />
                </Box>
                <VStack alignItems={"center"}>
                  <Text
                    fontSize={"1.5rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                  >
                    Payment Successful!
                  </Text>
                  <Text
                    fontSize={"1rem"}
                    pt="1"
                    pb="8"
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    textAlign="center"
                  >
                    Your payment of ${paymentAmount.toFixed(2)} has been processed successfully.
                    You can now schedule your consultation.
                  </Text>
                </VStack>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="85%" pb={6}>
              <HStack
                w="full"
                display={"flex"}
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={"row"}
              >
                <CustomButton
                  customStyle={{
                    w: "45%",
                    bg: "main_background",
                    borderWidth: "2px",
                  }}
                  onClick={handleGoHome}
                >
                  <Text
                    color={"text_primary"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    Go Home
                  </Text>
                </CustomButton>
                <CustomButton
                  customStyle={{
                    w: "45%",
                  }}
                  onClick={handleViewConsultants}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    View Consultants
                  </Text>
                </CustomButton>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default PaymentSuccessfulModal; 