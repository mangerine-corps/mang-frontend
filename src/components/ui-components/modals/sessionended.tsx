import { Box, Button, Dialog, HStack, IconButton, Image, Portal, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CustomButton from "mangarine/components/customcomponents/button";
import ReportConsultant from "./report";
import ReviewModal from "./reviewmodal";

type props = {
  onOpenChange: any;
  isOpen: any;
};

const SessionEnded = ({ onOpenChange, isOpen }: props) => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("08:00 am");
  const [open, setopen] = useState(false);
  const [value, setValue] = useState<string>("");
  const timecircle = "/icons/alarm.svg";
  const [selected, setSelected] = useState<any>({});
  const [search, setSearch] = useState("");
  const dp = "/images/user1.png";
  const messages = [
    {
      id: 1,
      name: "Jacob jones",
      job: "Web designer",
      img: "/images/user1.png",
    },
    {
      id: 2,
      name: "Cameron whilliamson",
      job: "marketing coordinator",
      img: "/images/user2.png",
    },
    {
      id: 3,
      name: "Kathryn Murphy",
      job: "marketing coordinator",
      img: "/images/user3.png",
    },
  ];

  const ChatItem = () => {};

  const times = ["08:00 am", "12:00 pm", "03:00 pm", "04:00 pm", "06:00 pm"];
  useEffect(() => {
    console.log(date, "date");
  }, [date]);
  const openModal = () => {
    // onOpenChange()
    setopen(true);
  };
  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={onOpenChange}
      placement={"center"}
      size={"lg"}

      // motionPreset="slide-in-bottom"
    >
      {/* <Dialog.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p="8" rounded={"xl"} bg="bg_box">
            <Dialog.Header>
              <Dialog.Title></Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <HStack w="full" justifyContent={"center"} py="8" alignItems={"center"}>
                {<Image alt="time" src={timecircle} />}

                <Text fontSize={"1.5rem"} fontFamily={"Outfit"} color={"text_primary"} fontWeight="600">
                  Your consultation Session has ended.
                </Text>
              </HStack>
              <VStack spaceY={"8"} mx={"auto"} alignItems={"center"} w="75%">
                <Box
                  rounded="full"
                  h={40}
                  w={40}
                  border={"1px"}
                  borderColor={"primary.300"}
                  display={"flex"}
                  flexDir={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Image
                    rounded="full"
                    w="full"
                    h="full"
                    src={"/images/participant2.png"}
                    alt={"display-image"}
                  />
                </Box>

                <Text
                  fontSize={"16px"}
                  textAlign="center"
                  fontFamily={"Outfit"}
                  color={"#333333"}
                  fontWeight={"600"}
                  pb="8"
                >
                  We hope your session was helpful! Please take a moment to rate
                  your experience with Joseph Brenda.
                </Text>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" py={6}>
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
                    w: "35%",
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
                    Rate Later
                  </Text>
                </CustomButton>
                <CustomButton
                  customStyle={{
                    w: "35%",
                  }}
                  onClick={openModal}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    Rate Now
                  </Text>
                </CustomButton>
              </HStack>
            </Dialog.Footer>
            {/* <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger> */}
            <ReviewModal
              isOpen={open}
              onOpenChange={() => {
                setopen(false);
              }}
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default SessionEnded;
