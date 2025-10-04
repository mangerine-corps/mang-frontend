import { CloseButton, Dialog, HStack, Portal, Text, VStack } from "@chakra-ui/react";
import CustomButton from "mangarine/components/customcomponents/button";

type props = {
  onOpenChange: any;
  isOpen: any;
};

const TwoFaDeletedt = ({ onOpenChange, isOpen }: props) => {
  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={onOpenChange}
      placement={"center"}
      size={"sm"}

      // motionPreset="slide-in-bottom"
    >
      {/* <Dialog.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {/* <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header> */}
            <Dialog.Body p="6" rounded={"xl"} bg="bg_box">
              <VStack
                py="10"
                // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
              >
                {/* Centering the image */}
                {/* <Stack
                  justifyContent={"center"}
                  rounded="full"
                  h="20"
                  w="20"
                  bg="grey.50"
                  alignItems={"center"}
                  pt="4"
                  pb="3"
                >
                  <Image
                    src={"/icons/delete.svg"}
                    alt="delete Image"
                    // boxSize={6}
                    objectFit="contain"
                    h="12"
                    w="12"
                    // height="auto"
                  />
                </Stack> */}
                <Text
                  textAlign={"center"}
                  w="full"
                  py={"6"}
                  fontSize={"1.25rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"600"}
                >
                  Two-Factor Authentication Deactivated
                </Text>

                <Text
                  textAlign={"center"}
                  w="full"
                  // px={"6"}
                  fontSize={"0.875rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"400"}
                >
                  Two-Factor authentication has been successfully Deactivated
                </Text>
              </VStack>
              {/* <ScheduleCard
                title="Consultation Canceled Successfully"
                imageSrc={"/icons/cancel.svg"}
                content={""}
                width="95%"
                details="10% has been deducted, and the remaining amount is credited to your wallet."
              /> */}
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="90%" pb={6}>
              <HStack
                w="full"
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                flexDir={"row"}
                // mx="auto"
              >
                <CustomButton
                  customStyle={{
                    w: "full",
                  }}
                  onClick={() => {}}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    Close
                  </Text>
                </CustomButton>
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default TwoFaDeletedt;
