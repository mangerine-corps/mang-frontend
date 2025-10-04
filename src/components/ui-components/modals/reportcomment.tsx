import {
  Dialog,
  HStack,
  Portal,
  RadioGroup,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import CustomButton from "mangarine/components/customcomponents/button";
import { Global } from "@emotion/react";

import { useReportCommentMutation, useReportGroupMutation, useReportPostMutation } from "mangarine/state/services/posts.service";
import { usePosts } from "mangarine/state/hooks/post.hook";
import { toaster } from "mangarine/components/ui/toaster";
import ReportPoster from "../modals/reportposter";
import { useAuth } from "mangarine/state/hooks/user.hook";

type props = {
  onOpenChange: any;
  isOpen: any;
 data?: any;
  userId?: string;
};

const ReportComment = ({ onOpenChange, isOpen, data, userId }: props) => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("08:00 am");
  const [open, setopen] = useState(false);
  const [value, setValue] = useState<string>("");
  const [report, setReport] = useState<string>("");
   const {user} = useAuth()
  const [reportComment, { data:groupdata, error, isLoading }] = useReportCommentMutation();

 
  const openModal = () => {
    onOpenChange();
    setopen(true);
  };
  const grpId = data?.id.toString()
 console.log(grpId,"here")
  const handleSubmit = () => {
    const reportDetails = value 
    const formdata = {
      reportDetails,
      reportType:report,
      commentId:grpId,
      additionalContext:""
    //   userId:user?.id
    };
  console.log(formdata, "data")
    reportComment(formdata)
      .unwrap()
      .then((res) => {
        toaster.create({
          description: "Comment reported successfully.",
          type: "success",
          closable: true,
        });
        onOpenChange();
        setopen(false);
      })
      .catch((error) => {
        console.error("Error reporting Comment:", error, formdata);
        toaster.create({
          description: error?.data?.message || "Failed to report Comment.",
          type: "error",
          closable: true,
        });
      });
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
              <Text
                textAlign={"left"}
                w="full"
                // px={"6"}
                fontSize={"2rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"600"}
              >
                Report Comment
              </Text>
              <Dialog.Title></Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack alignItems={"flex-start"} py="2" pt="8">
                <Text
                  textAlign={"left"}
                  w="full"
                  // px={"6"}
                  fontSize={"1rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"600"}
                >
                  Please select a reason for reporting this Comment
                </Text>
                <RadioGroup.Root
                  value={value}
                  onValueChange={(e) => setValue(e.value)}
                >
                  <VStack gap="6" alignItems={"flex-start"} w="full">
                    {[
                      {
                        id: 1,
                        label: "Inappropriate Content",
                        description:
                          "Content that is violent, sexually explicit, or otherwise inappropriate.",
                      },
                      {
                        id: 2,
                        label: "Harassment or Bullying",
                        description:
                          "Behavior that targets and intimidates another user.",
                      },
                      {
                        id: 3,
                        label: "Spam or Scam",
                        description:
                          "Posts or messages that are misleading or fraudulent.",
                      },
                      {
                        id: 4,
                        label: "Fake Account",
                        description:
                          "An account impersonating someone else or providing false information.",
                      },
                      {
                        id: 5,
                        label: "Hate Speech or Offensive Language",
                        description:
                          "Content that promotes hate or uses offensive language.",
                      },
                    ].map((item) => (
                      <RadioGroup.Item key={item.id} value={item.label}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText color={"text_primary"}>
                          <HStack>
                            {item.label} {item.description}
                          </HStack>
                        </RadioGroup.ItemText>
                        <RadioGroup.ItemText
                          color={"grey.300"}
                        ></RadioGroup.ItemText>
                      </RadioGroup.Item>
                    ))}
                  </VStack>
                </RadioGroup.Root>
              </VStack>

              <Text
                textAlign={"left"}
                w="full"
                // px={"6"}
                fontSize={"1rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"400"}
                my="2"
              >
                Other
              </Text>
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
                Any other issue not covered above
              </Text>
              <Textarea
                placeholder="Any other issue not covered above"
                // minH="100px"
                mb="6"
                color="text_primary"
                p={3}
                h="6lh"
                onChange={(e) => setReport(e.target.value)}
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
                    Cancel
                  </Text>
                </CustomButton>
                <CustomButton
                  customStyle={{
                    w: "35%",
                  }}
                  // onClick={openModal}
                  loading={isLoading}
                  onClick={handleSubmit}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    Submit Report
                  </Text>
                </CustomButton>
              </HStack>
            </Dialog.Footer>
            {/* <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger> */}
            <ReportPoster
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
export default ReportComment;