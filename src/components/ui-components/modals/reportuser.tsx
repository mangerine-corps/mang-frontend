import {
  Dialog,
  HStack,
  Portal,
  RadioGroup,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import CustomButton from "mangarine/components/customcomponents/button";
import { useReportUserMutation } from "mangarine/state/services/profile.service";
import { toaster } from "mangarine/components/ui/toaster";

const reportReasons = [
  { id: 1, label: "Inappropriate Content", value: "inappropriate_content", description: "Content that is violent, sexually explicit, or otherwise inappropriate." },
  { id: 2, label: "Harassment or Bullying", value: "harassment", description: "Behavior that targets and intimidates another user." },
  { id: 3, label: "Spam or Scam", value: "spam", description: "Posts or messages that are misleading or fraudulent." },
  { id: 4, label: "Fake Account", value: "fake_account", description: "An account impersonating someone else or providing false information." },
  { id: 5, label: "Hate Speech or Offensive Language", value: "hate_speech", description: "Content that promotes hate or uses offensive language." },
];

type props = {
  onOpenChange: any;
  isOpen: any;
  userId?: string;
};

const ReportUser = ({ onOpenChange, isOpen, userId }: props) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [reportUser, { isLoading }] = useReportUserMutation();

  const handleSubmit = () => {
    const reason = selectedReason || "other";
    if (!reason && !description.trim()) {
      toaster.create({ type: "error", title: "Please select a reason or provide a description.", closable: true });
      return;
    }
    reportUser({ reportedUserId: userId, reason, description: description || undefined })
      .unwrap()
      .then((res) => {
        toaster.create({
          description: res?.message ?? "User reported successfully.",
          type: "success",
          closable: true,
        });
        setSelectedReason("");
        setDescription("");
        onOpenChange();
      })
      .catch((err) => {
        toaster.create({
          description: err?.data?.message || "Failed to report user.",
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
                Report User
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
                  Please select a reason for reporting this user
                </Text>
                <RadioGroup.Root
                  value={selectedReason}
                  onValueChange={(e) => setSelectedReason(e.value)}
                >
                  <VStack gap="6" alignItems={"flex-start"} w="full">
                    {reportReasons.map((item) => (
                      <RadioGroup.Item key={item.id} value={item.value}>
                        <RadioGroup.ItemHiddenInput />
                        <RadioGroup.ItemIndicator />
                        <RadioGroup.ItemText color={"text_primary"}>
                          <HStack>
                            {item.label}
                          </HStack>
                          <Text fontSize="0.875rem" color={"grey.300"}>{item.description}</Text>
                        </RadioGroup.ItemText>
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
                mb="6"
                color="text_primary"
                p={3}
                h="6lh"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default ReportUser;
