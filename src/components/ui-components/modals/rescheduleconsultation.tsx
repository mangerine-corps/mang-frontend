import {
  Button,
  Center,
  CloseButton,
  Dialog,
  Grid,
  HStack,
  Image,
  Portal,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ScheduleCard from "../schedulecard";
import CustomButton from "mangarine/components/customcomponents/button";
import { Global } from "@emotion/react";
import Calendar from "react-calendar";
import RescheduleSuccessful from "./reschedulesucessful";

type props = {
  onOpenChange: any;
  isOpen: any;
};

const RescheduleConsultation = ({ onOpenChange, isOpen }: props) => {
    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState("08:00 am");
    const [open, setopen] = useState(false);

    const times = ["08:00 am", "12:00 pm", "03:00 pm", "04:00 pm", "06:00 pm"];
    useEffect(() => {
      console.log(date, "date");
    }, [date]);
    const openModal=()=>{
        // onOpenChange()
        setopen(true)
    }
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
            <Global
              styles={`
          .react-calendar {
            border: none !important;
            border-radius: 16px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            padding: 10px;
          }
          .react-calendar__tile {
            border-radius: 50%;
            padding: 10px 6px;
            font-size: 0.85rem;
            border: none;
            background: 'bg_box';
            color: #333;
          }
          .react-calendar__tile--now {
            color:rgb(11, 10, 8);
            border: 1px solid #FF6600;
            background: transparent;
          }
          .react-calendar__tile--active {
            background:'text_primary' !important;
            color: white !important;
          }
          .react-calendar__tile:enabled:hover {
            background-color: rgba(255, 102, 0, 0.15);
            color:'text_primary';
          }
          .react-calendar__navigation button {
            background: none;
            border: none;
            color:'text_primary';
            font-weight: bold;
          }
          .react-calendar__month-view__weekdays {
            text-align: center;
            color:text_primary;
            font-weight: bold;
            text-decoration:none;
            font-size: 0.875rem;
          }
        `}
            />
            <Dialog.Header>
              <Text
                textAlign={"left"}
                w="full"
                // px={"6"}
                fontSize={"2rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"600"}
              >
                Consultation Rescheduled Successfully
              </Text>
              <Dialog.Title></Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack alignItems={"flex-start"} py="2" pt="8">
                <HStack alignItems={"flex-start"}>
                  <Text
                    textAlign={"left"}
                    w="full"
                    // px={"6"}
                    fontSize={"1rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    fontWeight={"600"}
                  >
                    <Text
                      textAlign={"left"}
                      w="full"
                      // px={"6"}
                      fontSize={"1rem"}
                      fontFamily={"Outfit"}
                      color={"grey.300"}
                      fontWeight={"400"}
                    >
                      Current Date:
                    </Text>
                  </Text>
                  <Text
                    textAlign={"left"}
                    // px={"6"}
                    fontSize={"1.25rem"}
                    fontFamily={"Outfit"}
                    color={"grey.300"}
                    fontWeight={"400"}
                  >
                    {` ${date.toLocaleDateString()}`}
                  </Text>
                </HStack>
                <HStack alignItems={"flex-start"}>
                  <Text
                    textAlign={"left"}
                    w="full"
                    // px={"6"}
                    fontSize={"1rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    fontWeight={"600"}
                  >
                    <Text
                      textAlign={"left"}
                      w="full"
                      // px={"6"}
                      fontSize={"1rem"}
                      fontFamily={"Outfit"}
                      color={"grey.300"}
                      fontWeight={"400"}
                    >
                      Current Time:
                    </Text>
                  </Text>
                  <Text
                    textAlign={"left"}
                    // px={"6"}
                    fontSize={"1rem"}
                    fontFamily={"Outfit"}
                    color={"grey.300"}
                    fontWeight={"400"}
                  >
                    {` ${date.toLocaleTimeString()}`}
                  </Text>
                </HStack>
              </VStack>
              <Text
                textAlign={"left"}
                w="full"
                // px={"6"}
                fontSize={"1.25rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"600"}py="6"
              >
                Choose a new date and time
              </Text>

              <HStack
                spaceX={8}
                pb="8"
                // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
              >
                {/* Centering the image */}

                <VStack w="60%" alignItems={"flex-start"}>
                  <Text
                    fontSize="1rem"
                    font="outfit"
                    fontWeight="600"
                    mt="6"
                    mb="2"
                    textAlign={"left"}
                    color="grey.300"
                  >
                    Select Date
                  </Text>
                  <Calendar onChange={(d) => setDate(d as Date)} value={date} />
                </VStack>
                <VStack w="40%" alignItems={"flex-start"}>
                  <Text
                    fontSize="1rem"
                    font="outfit"
                    fontWeight="600"
                    mt="6"
                    mb="2"
                    textAlign={"left"}
                    color="grey.300"
                  >
                    Select Time
                  </Text>
                  <Grid
                    w="full"
                    templateColumns="repeat(1, 1fr)"
                    gapY="3"
                    mb="6"
                  >
                    {times.map((time) => (
                      <Button
                        key={time}
                        size="sm"
                        w="full"
                        variant="outline"
                        borderColor="bt_schedule"
                        bg={
                          selectedTime === time ? "bt_schedule" : "transparent"
                        }
                        color={selectedTime === time ? "white" : "bt_schedule"}
                        _hover={{
                          bg:
                            selectedTime === time
                              ? "bt_schedule"
                              : "bt_schedule",
                          color: "white",
                        }}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </Grid>
                </VStack>
              </HStack>
              <Text
                textAlign={"left"}
                w="full"
                // px={"6"}
                fontSize={"1rem"}
                fontFamily={"Outfit"}
                color={"grey.300"}
                fontWeight={"400"}
                mb="2"
              >
                Message(Optional)
              </Text>
              <Textarea
                placeholder="Add a note explaining the scheduling"
                // minH="100px"
                mb="6"
                color="text_primary"
                p={3}
                h="6lh"
              />
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" pb={6}>
              <HStack
                w="full"
                display={"flex"}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
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
                    Cancel
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
                    Confirm Reschedule
                  </Text>
                </CustomButton>
              </HStack>
            </Dialog.Footer>
            {/* <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger> */}
            <RescheduleSuccessful isOpen={open} onOpenChange={()=>{setopen(false)}}/>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default RescheduleConsultation;
