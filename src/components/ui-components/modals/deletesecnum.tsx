
import { CloseButton, Dialog, HStack, Image, Portal, Stack, Text, VStack } from "@chakra-ui/react";
import CustomButton from "mangarine/components/customcomponents/button";
import { useRemoveSecondaryNumberMutation } from "mangarine/state/services/settings.service";
import { useProfile } from "mangarine/state/hooks/profile.hook";
import { useDispatch } from "react-redux";
import { setSecNum } from "mangarine/state/reducers/profile.reducer";

type props = {
  onOpenChange: any;
  isOpen: any;
};

const DeleteSecNum = ({ onOpenChange, isOpen }: props) => {
    const [removeSecondaryNumber,{ isLoading}] = useRemoveSecondaryNumberMutation();
   const dispatch = useDispatch()
    const {disable} = useProfile()
     const deleteNumber = () => {
       removeSecondaryNumber({})
         .unwrap()
         .then((payload) => {
          dispatch(setSecNum(""))
          onOpenChange()
           console.log(payload, "payload");

         })
         .catch((error) => {
           console.log(error);
           const { data } = error;
          //  if (!isEmpty(data) && data.hasOwnProperty("message")) {
          //    setDisabled(true);}
          //  } else {
          //    setErrorMessage(" failed");
          //  }
          //  setShowToast(true);
         });
     };
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
              <VStack py="10"
              // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
              >
                {/* Centering the image */}
                <Stack justifyContent={"center"} rounded="full" h="20" w="20" bg="grey.50" alignItems={"center"} pt="4" pb="3">
                  <Image
                    src={"/icons/delete2.svg"}
                    alt="delete Image"
                    // boxSize={6}
                    objectFit="contain"
   h="12" w="12"
                    // height="auto"
                  />
                </Stack>
                <Text
                  textAlign={"center"}
                  w="full"
                  py={"6"}
                  fontSize={"1.25rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"600"}
                >
                  Are you sure you want to remove your secondary phone number?
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
                  This number will no longer be used for account recovery or
                  notifications.
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
            <Dialog.Footer mx="auto" w="100%" pb={6}>
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
                    w: "40%",
                    bg: "main_background",
                    borderWidth: "2px",
                  }}
                  onClick={() => {}}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"text_primary"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    No, Keep
                  </Text>
                </CustomButton>
                <CustomButton
                  customStyle={{
                    w: "40%",
                  }}
                  onClick={deleteNumber}
                  loading={isLoading}
                  disabled={disable}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    Yes, Delete
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
export default DeleteSecNum;
