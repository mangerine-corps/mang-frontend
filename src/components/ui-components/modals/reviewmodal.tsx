import {
  Box,
  Dialog,
  Field,
  HStack,
  Image,
  Portal,
  RatingGroup,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import CustomButton from "mangarine/components/customcomponents/button";
import ThankYouModal from "./thankyoumadl";
import { useRateConsultantMutation } from "mangarine/state/services/consultant.service";
import { useAuth } from "mangarine/state/hooks/user.hook";

type props = {
  onOpenChange: any;
  isOpen: any;
  consultantName?: string;
  consultantPic?: string;
  consultantId?: string;
  appointmentId?: string;
};

const ReviewModal = ({ onOpenChange, isOpen, consultantName, consultantPic, consultantId, appointmentId }: props) => {
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rateConsultant, { isLoading }] = useRateConsultantMutation();
  const { user } = useAuth();

  const handleSubmit = async () => {
    setErrorMsg(null);
    try {
      await rateConsultant({
        consultantId,
        userId: user?.id,
        appointmentId,
        score: rating,
        comment: review,
      }).unwrap();
      onOpenChange();
      setThankYouOpen(true);
    } catch (err: any) {
      const msg = err?.data?.message || "Failed to submit rating. Please try again.";
      setErrorMsg(msg);
    }
  };

  return (
    <>
      <Dialog.Root lazyMount open={isOpen} onOpenChange={onOpenChange} placement={"center"} size={"lg"}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content p="8" rounded={"xl"} bg="bg_box">
              <Dialog.Header>
                <Dialog.Title />
              </Dialog.Header>
              <Dialog.Body w="85%" mx="auto">
                <VStack spaceY={6}>
                  <Box rounded="full" border={"1px"} borderColor={"primary.300"} my={4} overflow="hidden" w={28} h={28}>
                    <Image w="full" h="full" objectFit="cover" src={consultantPic || "/person.png"} alt={consultantName || "Consultant"} />
                  </Box>
                  <Text fontSize={"1.5rem"} fontFamily={"Outfit"} color={"text_primary"} textAlign="center">
                    How was your experience with {consultantName || "the consultant"}?
                  </Text>
                  <RatingGroup.Root
                    count={5}
                    value={rating}
                    onValueChange={(e) => setRating(e.value)}
                    size="lg"
                    colorPalette="yellow"
                  >
                    <RatingGroup.HiddenInput />
                    <RatingGroup.Control>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <RatingGroup.Item key={index} index={index + 1}>
                          <RatingGroup.ItemIndicator />
                        </RatingGroup.Item>
                      ))}
                    </RatingGroup.Control>
                  </RatingGroup.Root>
                  <Field.Root id="review" pb="8" w="full">
                    <Field.Label color="text_muted" fontFamily="Outfit" fontSize="1rem" fontWeight="400">
                      Write Your Review
                    </Field.Label>
                    <Textarea
                      borderWidth={1}
                      borderColor={"gray.100"}
                      rows={5}
                      resize={"none"}
                      placeholder="Leave a comment"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />
                  </Field.Root>
                </VStack>
              </Dialog.Body>
              {errorMsg && (
                <Text color="red.500" fontSize="sm" fontFamily="Outfit" textAlign="center" px={8} pb={2}>
                  {errorMsg}
                </Text>
              )}
              <Dialog.Footer mx="auto" w="85%" pb={6}>
                <HStack w="full" alignItems={"center"} justifyContent={"space-between"}>
                  <CustomButton
                    customStyle={{ w: "45%", bg: "main_background", borderWidth: "2px" }}
                    onClick={onOpenChange}
                  >
                    <Text color={"text_primary"} fontWeight={"600"} fontSize={"1rem"} lineHeight={"100%"}>
                      Cancel
                    </Text>
                  </CustomButton>
                  <CustomButton
                    customStyle={{ w: "45%" }}
                    onClick={handleSubmit}
                    loading={isLoading}
                    disabled={rating === 0 || isLoading}
                  >
                    <Text color={"button_text"} fontWeight={"600"} fontSize={"1rem"} lineHeight={"100%"}>
                      Submit Review
                    </Text>
                  </CustomButton>
                </HStack>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <ThankYouModal isOpen={thankYouOpen} onOpenChange={() => setThankYouOpen(false)} />
    </>
  );
};

export default ReviewModal;
