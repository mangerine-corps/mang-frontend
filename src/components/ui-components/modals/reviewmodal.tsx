import {
  Box,
  Button,
  Dialog,
  Field,
  HStack,
  IconButton,
  Image,
  Portal,
  RatingGroup,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CustomButton from "mangarine/components/customcomponents/button";
import ReportConsultant from "./report";
import ThankYouModal from "./thankyoumadl";

type props = {
  onOpenChange: any;
  isOpen: any;
};

const ReviewModal = ({ onOpenChange, isOpen }: props) => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("08:00 am");
  const [open, setopen] = useState(false);


// const myStyles = {
//   itemShapes: RoundedStar,
//   activeFillColor: "#ffb700",
//   inactiveFillColor: "#d9d9d9",
// };
  const dp1 = "/images/user1.png";
//   const [rating, setRating] = useState(0);




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
            <Dialog.Body w="85%" mx="auto">
              <VStack spaceY={6}>
                <Box
                  rounded="full"
                  border={"1px"}
                  borderColor={"primary.300"}
                  my={4}
                  display={"flex"}
                  flexDir={"column"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Image w={28} src={dp1} alt={"display-image"} />
                </Box>
                <Text
                  fontSize={"1.5rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                >
                  How was your experience with Joseph Brenda?
                </Text>
                {/* <RatingGroup
                  emptySymbol="fa fa-star-o fa-2x"
                  fullSymbol="fa fa-star fa-2x"
                  fractions={2}
                /> */}
                <Field.Root id="email" pb="8">
                  <Field.Label
                    color="#999"
                    fontFamily="Outfit"
                    fontSize="1rem"
                    fontStyle="normal"
                    fontWeight="400"
                  >
                    Write Your Review
                  </Field.Label>

                  <Textarea
                    borderWidth={1}
                    borderColor={"gray.100"}
                    rows={5}
                    resize={"none"}
                    placeholder="Leave a comment"
                  />
                  {/* {errors.email && (
              <Text color="red.500" fontSize="sm">
                {errors.email}
              </Text>
            )} */}
                </Field.Root>
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
                    Cancel
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
                    Submit Review
                  </Text>
                </CustomButton>
              </HStack>
            </Dialog.Footer>
            {/* <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger> */}
            <ThankYouModal
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
export default ReviewModal;
