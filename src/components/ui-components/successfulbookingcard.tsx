import { Box } from '@chakra-ui/react';
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import ConsultationDetailsBox from './consultationdetailsbox';


const SuccessfulBookingCard = () => {

  return (
    <>
    <Box
      width={{ base: "100%", md: "350px" }}
      height="auto"
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      gap="24px"
      flexShrink="0"
      borderRadius="16px"
      background="#FFF"
      boxShadow="0px 0px 4px rgba(0, 0, 0, 0.10)"
    >
      <ConsultationDetailsBox />
    </Box>
    </>
  );
};

export default SuccessfulBookingCard;
