import {
  CloseButton,
  Dialog,
  HStack,
  Image,
  Portal,
  Text,
} from "@chakra-ui/react";
import CustomButton from "mangarine/components/customcomponents/button";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void; // called to close/cancel
  onConfirm: () => void; // called to confirm delete
  data?: any;
};

const DeleteGroup = ({ isOpen, onOpenChange, onConfirm, data }: Props) => {
  return (
    <Dialog.Root lazyMount open={isOpen} onOpenChange={onOpenChange} placement={"center"} size={"xs"}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p="8" rounded={"xl"} bg="bg_box">
            <Dialog.Body>
              <Text
                textAlign={"center"}
                w="full"
                fontSize={"1.25rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"600"}
                py="4"
              >
                Are you sure you want to delete {`${data?.name ?? "this group"}`}?
              </Text>

              <Text
                textAlign={"center"}
                w="full"
                fontSize={"0.875rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"400"}
              >
                This action is permanent. All posts and membership data will be removed and cannot be recovered.
              </Text>
            </Dialog.Body>

            <Dialog.Footer mx="auto" w="100%" py={6}>
              <HStack w="full" alignItems={"center"} justifyContent={"center"}>
                <CustomButton
                  customStyle={{ w: "40%", bg: "main_background", borderWidth: "2px" }}
                  onClick={onOpenChange}
                >
                  <Text color={"text_primary"} fontWeight={"600"} fontSize={"1rem"} lineHeight={"100%"}>
                    No, Cancel
                  </Text>
                </CustomButton>
                <CustomButton customStyle={{ w: "40%" }} onClick={onConfirm}>
                  <HStack>
                    <Image alt="delete" src="/icons/delete1.svg" />
                    <Text color={"button_text"} fontWeight={"600"} fontSize={"1rem"} lineHeight={"100%"}>
                      Yes, Delete
                    </Text>
                  </HStack>
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

export default DeleteGroup;
