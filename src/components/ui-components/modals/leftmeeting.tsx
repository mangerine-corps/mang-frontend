import { Box, Dialog, HStack, IconButton, Image, Portal, RatingGroup, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import CustomButton from "mangarine/components/customcomponents/button";

type props = {
  onOpenChange: any;
  isOpen: any;
};

const LeftMeeting = ({ onOpenChange, isOpen }: props) => {

  const [ open,setopen] = useState(false);


const emojiMap: Record<string, string> = {
  1: "😡",
  2: "😠",
  3: "😐",
  4: "😊",
  5: "😍",
};


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
              <VStack spaceY={8} alignItems={"center"} w="85%" mx="auto">
                <Text
                  fontSize={"1.5rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                >
                  You left the meeting
                </Text>
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
                      Rejoin
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
                      Return to Homepage
                    </Text>
                  </CustomButton>
                </HStack>
                <Box rounded={"8px"} bg="primary.150" py={3} px={3} w="full">
                  <Text
                    fontSize="24px"
                    fontFamily={"outfit"}
                    textAlign={"center"}
                  >
                    How was the audio and video?
                  </Text>
                  <HStack></HStack>
                  {/* <HStack
                    my={6}
                    w="full"
                    justifyContent={"space-between"}
                    alignItems={"stretch"}
                  >
                    <VStack>
                      <IconButton
                        size="lg"
                        bg={"transparent"}
                        borderWidth={0}
                        borderColor={"gray.50"}
                        rounded={"md"}
                        aria-label="open menu"
                        color="text_primary"
                      >
                        {<Image src={""} alt="Rating 1 star: Very bad" />}
                      </IconButton>
                      <Text
                        ml={2}
                        className="text5"
                        color={"gray.200"}
                        fontSize={"0.875rem"}
                        fontWeight={"500"}
                      >
                        Very bad
                      </Text>
                    </VStack>
                    <VStack h="full" justifyContent={"flex-start"}>
                      <IconButton
                        size="lg"
                        bg={"transparent"}
                        borderWidth={0}
                        borderColor={"gray.50"}
                        rounded={"md"}
                        aria-label="open menu"
                        color="text_primary"
                      >
                        {<Image src={""} alt="Rating 2 stars: Bad" />}
                      </IconButton>
                    </VStack>
                    <VStack>
                      <IconButton
                        size="lg"
                        bg={"transparent"}
                        borderWidth={0}
                        borderColor={"gray.50"}
                        rounded={"md"}
                        aria-label="open menu"
                        color="text_primary"
                      >
                        {<Image src={""} alt="Rating 3 stars: Okay" />}
                      </IconButton>
                    </VStack>
                    <VStack>
                      <IconButton
                        size="lg"
                        bg={"transparent"}
                        borderWidth={0}
                        borderColor={"gray.50"}
                        rounded={"md"}
                        aria-label="open menu"
                        color="text_primary"
                      >
                        <Image src={""} alt="Rating 4 stars: Good" />
                      </IconButton>
                    </VStack>
                    <VStack>
                      <IconButton
                        size="lg"
                        bg={"transparent"}
                        borderWidth={0}
                        borderColor={"gray.50"}
                        rounded={"md"}
                        aria-label="open menu"
                        color="text_primary"
                      >
                        <Image src={""} alt="Rating 5 stars: Very good" />
                      </IconButton>
                      <Text
                        ml={2}
                        className="text5"
                        color={"gray.200"}
                        fontSize={"0.875rem"}
                        fontWeight={"500"}
                      >
                        Very good
                      </Text>
                    </VStack>
                  </HStack> */}
                  <HStack
                    w="full"
                    py="8"
                    // bg="red.900"
                    alignItems={"center"}
                    mx="auto"
                    justifyContent={"center"}
                    // alignItems={"stretch"}
                  >
                    <RatingGroup.Root count={5} defaultValue={3}>
                      <RatingGroup.Control
                     
                      >
                        {Array.from({ length: 5 }).map((_, index) => (
                          <RatingGroup.Item
                            key={index}
                            index={index + 1}
                            minW="16"
                            filter={{
                              base: "grayscale(1)",
                              _checked: "revert",
                            }}
                            transition="scale 0.1s"
                            _hover={{ scale: "1.1" }}
                          >
                            {emojiMap[index + 1]}
                          </RatingGroup.Item>
                        ))}
                      </RatingGroup.Control>
                    </RatingGroup.Root>
                  </HStack>
                </Box>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="85%" pb={6}></Dialog.Footer>
            {/* <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger> */}
            {/* <ReportConsultant
              isOpen={open}
              onOpenChange={() => {
                setopen(false);
              }}
            /> */}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default LeftMeeting;
