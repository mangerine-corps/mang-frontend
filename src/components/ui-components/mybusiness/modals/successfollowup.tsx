import { Box, Button, CloseButton, Dialog, HStack, Image, Portal, Text } from "@chakra-ui/react";
import CustomButton from "mangarine/components/customcomponents/button";
import { useRouter } from "next/router";

type props = {
  onOpenChange: any;
  isOpen: any;
};

const SuccessfulFollowup = ({ onOpenChange, isOpen }: props) => {
  const router = useRouter()
  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={onOpenChange}
      placement={"center"}
      size={"xs"}

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
              <Box
                w="full"
                //      borderRadius="16px"
                // bg="bg_box"
                // boxShadow="md"
                position="relative"
              >
                <Box
                  w="full"
                  h="120px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  mb={4}
                >
                  <Image src="/icons/successful.svg" alt="Delete Icon" />
                </Box>

                <Text
                  font="outfit"
                  fontSize="1.5rem"
                  fontWeight="500"
                  color="text_primary"
                  textAlign="center"
                  mb={6}
                >
                  Follow-up Scheduled Successfully!
                </Text>

                <Text
                  font="outfit"
                  fontSize="1rem"
                  fontWeight="500"
                  color="text_primary"
                  textAlign="center"
                  mb={8}
                >
                  Your follow-up is scheduled for the next 3 days. The client
                  can access your inbox and reply to your follow-up message.
                </Text>
              </Box>
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
                <Button
                  w="50%"
                  px="6"
                  py="3"
                  borderRadius="8px"
                  border="1px solid"
                  variant="outline"
                >
                  Cancel
                </Button>
                <CustomButton
                  customStyle={{
                    w: "50%",
                  }}
                  onClick={() => {router.push("/message")}}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    View Inbox
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
export default SuccessfulFollowup;
