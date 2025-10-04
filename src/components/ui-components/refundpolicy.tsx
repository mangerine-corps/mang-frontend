import { Box, VStack } from "@chakra-ui/react";
import React from "react";
import ContentComp from "./settings/contentcomp";
import ContentCompWithSubs from "./settings/contentcompwithsubs";
import HeaderContent from "./settings/headercontent";

const Refundpolicy = ({ onClick }) => {
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
          extra="At Mangerine, we strive to deliver value and satisfaction. Please review our refund
policy below:"
          onClick={onClick}
          title="REFUND POLICY"
        />
      </Box>

      <VStack spaceY={"3"} overflowY={"scroll"} h="full">
        <ContentCompWithSubs
          extra2="If the User fails to attend the consultation without prior cancellation, no
refund will be issued to the User, and the Consultant will still be compensated for the
full session."
          title="5.3 Refund Policy:"
          desc1="Consultant No-Show: "
          extra1="If a Consultant fails to attend the consultation, the User will
receive a full refund, and the Consultant will not be paid."
          desc2="User No-Show:"
        />
        <ContentComp
          extra="All applicable taxes, fees, or charges imposed by any government authority in
connection with the consultation will be the responsibility of the User."
          title=""
          desc="5.4 Taxes:"
        />
        <ContentCompWithSubs
          title="1. CANCELLATION"
          desc1="You may cancel your subscription anytime in your account settings. "
          desc2="Your subscription will remain active until the end of the billing period."
        />
        <ContentCompWithSubs
          intro1="Refunds may be granted if:"
          title="2. REFUND ELIGIBILITY"
          desc1="You were billed due to a technical issue;"
          desc2="You cancel within 24 hours of purchase;"
          desc3="A premium feature fails to function, and we are unable to resolve the issue within
5 business days."
        />
        <ContentCompWithSubs
          //    intro1="Refunds may be granted if:"
          title="3. NON-REFUNDABLE ITEMS"
          desc1="Partial months of service;"
          desc4="Requests made after 7 days from the transaction."
          desc2="Used or consumed services;"
          desc3="In-app purchases through Apple or Google Play;"
        />
        <ContentCompWithSubs
          intro1="Email support@mangerine.com with:"
          title="4. HOW TO REQUEST A REFUND"
          desc1="Account email;"
          intro2="Refunds are processed within 5–7 business days after approval."
          desc2="Transaction ID;"
          desc3="Reason for request."
        />
        <ContentCompWithSubs
          intro1="For payments made through:"
          title="5. APP STORE PURCHASES"
          desc1="Apple App Store: Request via your Apple account.;"
          intro2="Mangerine cannot directly process refunds for third-party store transactions.."
          desc2="Google Play: Request through your Google account."
        />
        <ContentComp
          title="MANGERINE LLC"
          intro="By using Mangerine, you agree to the Terms, Privacy Policy, and Refund Policy outlined
above. These documents are legally binding and intended to protect both Mangerine
and its users."
        />
      </VStack>
    </Box>
  );
};

export default Refundpolicy;
