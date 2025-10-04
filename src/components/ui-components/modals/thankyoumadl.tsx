import {
  Box,
  Button,
  Dialog,
  HStack,
  IconButton,
  Image,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CustomButton from "mangarine/components/customcomponents/button";
import ReportConsultant from "./report";
import LeftMeeting from "./leftmeeting";

type props = {
  onOpenChange: any;
  isOpen: any;
};

const ThankYouModal = ({ onOpenChange, isOpen }: props) => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("08:00 am");
  const [open, setopen] = useState(false);
  const [value, setValue] = useState<string>("");
  const timecircle = "/assets/icons/timecircle.svg";
  const [selected, setSelected] = useState<any>({});
  const [search, setSearch] = useState("");
  const successcheck = "/icons/successful.svg";
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
              <Dialog.Title>
                {/* <HStack justifyContent={"center"}>
                  <IconButton
                    size="lg"
                    // bg={useColorModeValue("white", "background.300")}
                    borderWidth={0}
                    borderColor={"gray.50"}
                    rounded={"md"}
                    aria-label="open menu"
                    color="text_primary"
                  >
                    {<Image alt="time" src={timecircle} />}
                  </IconButton>
                  <Text
                    fontSize={"1.5rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                  >
                    Your consultation Session has ended.
                  </Text>
                </HStack> */}
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body w="85%">
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
                  <Image w={"full"} src={successcheck} alt={"display-image"} />
                </Box>
                <VStack alignItems={"center"}>
                  <Text
                    fontSize={"1.5rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                  >
                    Thank you for your feedback
                  </Text>
                  <Text fontSize={"1rem"} pt="1" pb="8" fontFamily={"Outfit"} color={"text_primary"}>
                    Your review has been submitted successfully
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
                // mx="auto"
              >
                <CustomButton
                  customStyle={{
                    w: "45%",
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
                    Home
                  </Text>
                </CustomButton>
                <CustomButton
                  customStyle={{
                    w: "45%",
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
                    View other consultants
                  </Text>
                </CustomButton>
              </HStack>
            </Dialog.Footer>
            {/* <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger> */}
            <LeftMeeting
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
export default ThankYouModal;
