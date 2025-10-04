import {
  Button,
  Center,
  CloseButton,
  Dialog,
  HStack,
  Image,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import ScheduleCard from "../schedulecard";
import CustomButton from "mangarine/components/customcomponents/button";
import { useRouter } from "next/router";
import { useBlockUserMutation } from "mangarine/state/services/profile.service";
import { toaster } from "mangarine/components/ui/toaster";

type props = {
  onOpenChange: any;
  isOpen: any;
  data: any;
  checkmarkSrc: any;
};

const BlockConsultant = ({
  onOpenChange,
  isOpen,
  data,
  checkmarkSrc,
}: props) => {
  const [openNext, setOpenNext] = useState<boolean>(false);
  const router = useRouter();

  const [blockUser, { data: blockedData, error, isLoading }] =
    useBlockUserMutation();
  const next = () => {
    //  blockUser({}).unwrap().then((res)=>{console.log(res)}).catch((err)=>{console.log(err)})
  };
  const handleBlockUser = async () => {
          // router.push("/consultant/blockeduser");
          onOpenChange();
    try {
      if (!data?.id) throw new Error("User ID is missing");
      await blockUser({
        userId: data.id,
        reason: "Blocked from profile menu",
      }).unwrap();

      toaster.create({
        title: "User blocked",
        type: "success",
        description: `${data?.fullName ?? "User"} has been blocked successfully`,
        closable: true,
      });
      router.push("/consultant/blockeduser");
      onOpenChange();
    } catch (err: any) {
      toaster.create({
        title: "Block failed",
        type: "error",
        description:
          err?.data?.message || err?.message || "Unable to block user",
        closable: true,
      });
        onOpenChange();
    }
  };
  console.log(data, "data");
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
          <Dialog.Content p="6" pt="8" rounded={"xl"} bg="bg_box">
            {/* <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header> */}
            <Dialog.Body>
              <VStack
                spaceY={"3"}
                // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
              >
                <Text
                  textAlign={"center"}
                  w="full"
                  // px={"6"}
                  fontSize={"1.25rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"600"}
                >
                  Are you sure you want to block {data?.fullName}
                </Text>

                <Text
                  textAlign={"center"}
                  w="full"
                  pb={"3"}
                  fontSize={"0.875rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"400"}
                >
                  {` You won't be able to see their profile or messages, and they
                  won't be able to contact you.`}
                </Text>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" py={4}>
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
                    _hover: { bg: "foundation.50" },
                  }}
                  onClick={onOpenChange}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"text_primary"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    No, Cancel
                  </Text>
                </CustomButton>
                <CustomButton
                  customStyle={{
                    w: "40%",
                  }}
                  loading={isLoading}
                  onClick={handleBlockUser}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    Yes, Block
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
export default BlockConsultant;
