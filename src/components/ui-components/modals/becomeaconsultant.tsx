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
import CancelConsultation from "./cancelconsultationmodal";
import FilterDrawer from "./filterdrawer";
import { RiPokerDiamondsLine } from "react-icons/ri";
import { useBecomeConsultantMutation } from "mangarine/state/services/user.service";
import { useLazyGetUserInfoQuery } from "mangarine/state/services/profile.service";
import { useDispatch } from "react-redux";
import { setUpdatedInfo } from "mangarine/state/reducers/auth.reducer";
import { useRouter } from "next/router";

type props = {
  onOpenChange: any;
  isOpen: any;
};

const BecomeAConsultantModal = ({ onOpenChange, isOpen }: props) => {
  const [open, setOpen] = useState<boolean>(false);
  const [becomeConsultant, { isLoading: becomeConsultantLoading, isError: becomeConsultantError }] = useBecomeConsultantMutation();
  const [triggerGetUserInfo] = useLazyGetUserInfoQuery();
  const dispatch = useDispatch();
  const close = () => {
    onOpenChange();
    setOpen(true);
  };
  const router = useRouter();
  const becomeAConsultant = () => {
    becomeConsultant({})
      .unwrap()
      .then(async (res) => {
        try {
          const userInfoResp = await triggerGetUserInfo(undefined).unwrap();
          const latestUser = userInfoResp?.data ?? userInfoResp; // handle {data: ...} shape
          if (latestUser) {
            dispatch(setUpdatedInfo({ updatedInfo: latestUser }));
          }
        } catch (e) {
          console.warn("Failed to refresh user info after becoming consultant", e);
        }
        onOpenChange();
      // if(!isEmpty(res.data)){
      //   setOpenConsultant(false)
      // }
      })
      .catch((err) => {
        console.log(err, "error becoming consultant");
      });
  }
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
          <Dialog.Content p="8" rounded={"xl"} bg="bg_box">
            {/* <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header> */}
            <Dialog.Body py={4} bg="bg_box">
              <VStack>
                <Text
                  //   textAlign={"center"}
                  w="full"
                  // px={"6"}
                  lineHeight={"36px"}
                  fontSize={"1.5rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"500"}
                >
                  Have knowledge or skills to share?
                </Text>

                <Text
                  //   textAlign={"center"}
                  w="full"
                  py={"1.5"}
                  fontSize={{ base: "0.875rem", md: "1rem" }}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"400"}
                >
                  Join our community of consultants and start earning by helping
                  others. Set your own hours, choose your rates, and make an
                  impact.
                </Text>
                <VStack py="1.5" textAlign={"start"} w="full" justifyContent={"flex-start"} alignItems="flex-start" spaceY={"0"}>
                  <Text
                    //   textAlign={"center"}
                    // px={"6"}
                    fontSize={"0.875rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    fontWeight={"400"}
                  >
                    🔹 Host 1-on-1 or group sessions
                  </Text>


                  <Text
                    //   textAlign={"center"}

                    // px={"6"}
                    fontSize={"0.875rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    fontWeight={"400"}
                  >
                    🔹 Reach users looking for your expertise
                  </Text>
                  <Text
                    //   textAlign={"center"}

                    // px={"6"}
                    fontSize={"0.875rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    fontWeight={"400"}
                  >
                    🔹 Get paid for your time and insight
                  </Text>
                </VStack>
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
                    w: "50%",
                    bg: "transparent",
                    borderWidth: "2px",
                  }}
                  onClick={onOpenChange}
                // loading={isLoading}
                // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"text_primary"}
                    fontWeight={"600"}
                    fontSize={{ base: "0.875rem", md: "1rem" }}
                    lineHeight={"100%"}
                  >
                    Not Now
                  </Text>
                </CustomButton>
                <CustomButton
                  customStyle={{
                    w: "50%",
                  }}
                  onClick={becomeAConsultant}
                // loading={isLoading}
                // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={{ base: "0.875rem", md: "1rem" }}
                    lineHeight={"100%"}
                  >
                    Become a Consultant
                  </Text>
                </CustomButton>
              </HStack>
              <FilterDrawer
                open={open}
                onOpenChange={() => {
                  setOpen(false);
                }}
              />
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
export default BecomeAConsultantModal;
