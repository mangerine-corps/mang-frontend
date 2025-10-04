import { Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import HeaderContent from "./headercontent";
import ArrowUpContent from "./arrowupcontent";

const Questions = ({ onClick }: { onClick: () => void }) => {
  const [questionOne, setQuestionOne] = useState<boolean>(false);
    const [questionTwo, setQuestionTwo] = useState<boolean>(false);
      const [questionThree, setQuestionThree] = useState<boolean>(false);
        const [questionFour, setQuestionFour] = useState<boolean>(false);
          const [questionFive, setQuestionFive] = useState<boolean>(false);
            const [questionSix, setQuestionSix] = useState<boolean>(false);
              const [questionSeven, setQuestionSeven] = useState<boolean>(false);
  return (
    <Box
      //w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}

      borderRadius="lg"
      boxShadow="lg"
      bg="main_background"
      p={8}
      w="full"
      h="auto"
      overflowY={"scroll"}
      //px={6}
      //py={6}
      // marginLeft={40}
      //   mt={0}
    >
      <HeaderContent
        title="Frequently Asked Questions"
        desc=""
        extra=""
        onClick={onClick}
      />
      <Box w="full" py="2">
        <ArrowUpContent
          title="How do i book a consultation?"
          open={questionOne}
          onClick={() => {
            setQuestionOne(!questionOne);
          }}
        />
        {questionOne ? (
          <Text
            font="outfit"
            fontSize="1rem"
            fontWeight="400"
            color="text_primary"
          >
            {`To book a consultation, navigate to the profile of the consultant
            you're interested in. Click on the "Book Consultation" button,
            choose an available time slot, and follow the prompts to confirm
            your booking. Payment options will be provided during the booking
            process.`}
          </Text>
        ) : (
          ""
        )}
      </Box>
      <Box w="full" py="2">
        <ArrowUpContent
          title="What payments methods are accepted?"
          open={questionSeven}
          onClick={() => {
            setQuestionSeven(!questionSeven);
          }}
        />
        {questionSeven ? (
          <Text
            font="outfit"
            fontSize="1rem"
            fontWeight="400"
            color="text_primary"
          >
            We accept various payment methods including credit/debit cards,
            PayPal, and bank transfers. You can select your preferred payment
            method at the time of booking.
          </Text>
        ) : (
          ""
        )}
      </Box>
      <Box w="full" py="2">
        <ArrowUpContent
          title="How can i cancel or reschedule a consultation?"
          open={questionTwo}
          onClick={() => {
            setQuestionTwo(!questionTwo);
          }}
        />
        {questionTwo ? (
          <Text
            font="outfit"
            fontSize="1rem"
            fontWeight="400"
            color="text_primary"
          >
            {`To cancel or reschedule a consultation, go to your "Bookings"
            section, select the consultation you want to modify, and choose
            either the "Cancel" or "Reschedule" option. Please note that
            cancellation policies may vary depending on the consultant.`}
          </Text>
        ) : (
          ""
        )}
      </Box>
      <Box w="full" py="2">
        <ArrowUpContent
          title="Can i message consultant before booking a session?"
          open={questionThree}
          onClick={() => {
            setQuestionThree(!questionThree);
          }}
        />
        {questionThree ? (
          <Text
            font="outfit"
            fontSize="1rem"
            fontWeight="400"
            color="text_primary"
          >
            {`To book a consultation, navigate to the profile of the consultant
            you're interested in. Click on the "Book Consultation" button,
            choose an available time slot, and follow the prompts to confirm
            your booking. Payment options will be provided during the booking
            process.`}
          </Text>
        ) : (
          ""
        )}
      </Box>
      <Box w="full" py="2">
        <ArrowUpContent
          title="Is my personal information safe on the platform"
          open={questionFour}
          onClick={() => {
            setQuestionFour(!questionFour);
          }}
        />
        {questionFour ? (
          <Text
            font="outfit"
            fontSize="1rem"
            fontWeight="400"
            color="text_primary"
          >
            {`To book a consultation, navigate to the profile of the consultant
            you're interested in. Click on the "Book Consultation" button,
            choose an available time slot, and follow the prompts to confirm
            your booking. Payment options will be provided during the booking
            process.`}
          </Text>
        ) : (
          ""
        )}
      </Box>
      <Box w="full" py="2">
        <ArrowUpContent
          title="How do i provide feedback for a consultation?"
          open={questionFive}
          onClick={() => {
            setQuestionFive(!questionFive);
          }}
        />
        {questionFive ? (
          <Text
            font="outfit"
            fontSize="1rem"
            fontWeight="400"
            color="text_primary"
          >
            {`To book a consultation, navigate to the profile of the consultant
            you're interested in. Click on the "Book Consultation" button,
            choose an available time slot, and follow the prompts to confirm
            your booking. Payment options will be provided during the booking
            process.`}
          </Text>
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
};

export default Questions;
