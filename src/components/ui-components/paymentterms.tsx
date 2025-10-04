import { Box } from "@chakra-ui/react";
import React from "react";
import ContentComp from "./settings/contentcomp";
import ContentCompWithSubs from "./settings/contentcompwithsubs";
import HeaderContent from "./settings/headercontent";

export const PaymentTerms = ({ onClick }) => {
  return (
    <Box


      borderRadius="lg"
      boxShadow="lg"
      bg="main_background"
      p={8}
    //   w="full"
      h="auto"
      overflowY={"scroll"}
      //px={6}
      //py={6}
      // marginLeft={40}
      mt={0}
    >
      <Box pb="6">
        <HeaderContent
          desc=""
          extra=""
          onClick={onClick}
          title="Payment and Fees"
        />
      </Box>

         <ContentComp
        extra="Payments for consultations are processed through designated third
party providers. Users agree to provide accurate payment information and authorize
Mangerine to charge the designated payment method for consultation fees."
            title="5. Payments and Fees"
        desc="5.1 Payment Processing:"
      />
          <ContentComp
        extra="Consultants will be paid for their time after the consultation is
completed, and the payment will be processed within 3-5 business days depending on
jurisdiction. The payment will be for the full hourly rate regardless of the length of the session,
provided that the Consultant attends the session ."
            title=""
        desc="5.2 Consultant Payment:"
      />
           
    </Box>
  );
};
