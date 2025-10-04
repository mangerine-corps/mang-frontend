import { Box, List, Text } from "@chakra-ui/react";
import React from "react";
import HeaderContent from "./headercontent";
import LegalContent from "./legalcontents";
import ContentComp from "./contentcomp";
import ContentCompWithSubs from "./contentcompwithsubs";

export const Terms = ({ onClick }) => {
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
          title="PART 1: TERMS AND CONDITIONS (TERMS OF USE)"
        />
      </Box>
      <ContentComp
        extra=""
        desc=""
        title="1. INTRODUCTION"
        intro='Welcome to Mangerine, a global professional social media platform that empowers
users to connect, network, collaborate, and share multimedia content — including video
— with the option to access premium features through secure payments.
These Terms and Conditions ("Terms") govern your use of our website, mobile
application, and any associated services (collectively referred to as the "Service"). By
accessing or using the Service, you agree to comply with and be bound by these Terms,
our Privacy Policy, and our Refund Policy.
If you do not agree with these Terms, please do not use Mangerine.'
      />

      <ContentCompWithSubs
        title="2. ELIGIBILITY"
        desc1=" You must be at least 13 years old (or the minimum legal age in your country) to
use Mangerine."
        desc2=" If you are under 18, you must have permission from a parent or legal guardian."
        desc3="  By using the Service, you affirm that you meet all eligibility requirements and
have the legal authority to accept these Terms."
      />

      <ContentCompWithSubs
        intro1="To access most features of Mangerine, you must register for an account. By registering,
you agree to:"
        title="3. ACCOUNT REGISTRATION"
        desc1="Provide accurate and up to date information."
        desc2=" Maintain the confidentiality of your login credentials."
        extra2=""
        desc3=" Be fully responsible for all activity that occurs under your account."
        extra3=""
        intro2="We reserve the right to suspend or terminate accounts for any breach of these Terms."
      />
      <ContentCompWithSubs
        desc1="a. Your Content"
        title="4. CONTENT POLICY"
        extra1="You retain ownership of the content you upload or share on Mangerine, including
videos, images, articles, and comments.
By submitting content, you grant Mangerine a worldwide, royalty-free, non-exclusive,
transferable, and sublicensable license to use, display, reproduce, distribute, and modify
your content solely for operating and improving the Service."
        desc2=" b. Prohibited Content: You may not upload, post, or share content that:"
       
        desc3="Infringes upon third-party intellectual property;"
    
      />
      <Box>
        <List.Root>
          <List.Item>
            {" "}
            <Text
              fontFamily="outfit"
              fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
              fontWeight="400"
              color="text_primary"
              whiteSpace="pre-wrap"
            >
             Is unlawful, defamatory, obscene, or threatening;
            </Text>
          </List.Item>
          <List.Item>
            {" "}
            <Text
              fontFamily="outfit"
              fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
              fontWeight="400"
              color="text_primary"
              whiteSpace="pre-wrap"
            >Violates any applicable laws or regulations</Text>
          </List.Item>
          <List.Item>
            {" "}
            <Text
              fontFamily="outfit"
              fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
              fontWeight="400"
              color="text_primary"
              whiteSpace="pre-wrap"
            >Includes viruses, malware, or deceptive links;</Text>
          </List.Item>
           <List.Item>
            {" "}
            <Text
              fontFamily="outfit"
              fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
              fontWeight="400"
              color="text_primary"
              whiteSpace="pre-wrap"
            >Promotes violence, hate speech, or discrimination</Text>
          </List.Item>
        </List.Root>
      </Box>
      <ContentComp
        extra=""
        title=""
        desc=""
        intro="We reserve the right to remove or restrict access to any content that violates these
guidelines."
      />
      <ContentCompWithSubs
        intro1="Mangerine offers paid features including, but not limited to, premium subscriptions,
video hosting tiers, boosted visibility, and specialized professional tools."
        title="5. PAYMENTS, SUBSCRIPTIONS, AND TRANSACTIONS"
        desc1="Payment Terms"
        desc2=" Subscriptions"
        extra1="Payments are securely processed via trusted third-party providers (e.g., Stripe,
PayPal, Google Pay, Apple Pay and more)."
        extra4="You may cancel at any time through your account settings or the relevant app
store."
desc4="Refunds"
intro2="See the Refund Policy (Part 3) for full details on eligibility and procedure."
        extra3="Subscriptions auto-renew unless canceled before the renewal date."
      />
      <ContentCompWithSubs
        extra1=""
        title="6. VIDEO SHARING AND STREAMING"
        desc1=" Mangerine allows users to upload, stream, and share professional videos."
        desc2="You are solely responsible for ensuring you own or have permission to use any
video content uploaded."
        extra2=""
        desc3=" Mangerine reserves the right to remove or moderate videos that violate these
Terms or applicable law."
        extra3=""
      />
      <ContentCompWithSubs
        intro1="You agree not to:"
    
        title="7. USER CONDUCT"
        desc1=" Harass, threaten, or defame others;"
        desc2=" Create fake profiles or impersonate others;."
        extra2=""
        desc3=" Use bots, scrapers, or data miners;"
        extra3=""
      />
         <Box>
        <List.Root>
          <List.Item>
            {" "}
            <Text
              fontFamily="outfit"
              fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
              fontWeight="400"
              color="text_primary"
              whiteSpace="pre-wrap"
            >
             Interfere with the security or integrity of the Service;
            </Text>
          </List.Item>
          <List.Item>
            {" "}
            <Text
              fontFamily="outfit"
              fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
              fontWeight="400"
              color="text_primary"
              whiteSpace="pre-wrap"
            >Engage in unlawful or fraudulent activity.</Text>
          </List.Item>
    
        </List.Root>
      </Box>
      <ContentComp
          intro="Violation of this section may result in account suspension or permanent ban."
        extra=""
        title=""
        desc=""
      />
       <ContentComp
          intro="Mangerine collects and processes personal data in accordance with our Privacy Policy
(see Part 2). By using Mangerine, you agree to our data practices."
        extra=""
        title="8. PRIVACY"
        desc=""
      />
             <ContentComp
          intro="All rights to Mangerine’s platform, including the brand, logos, UI/UX, software, and
content created by Mangerine, are owned by or licensed to Mangerine LLC.
You may not reuse or reproduce any proprietary materials without written permission."
        extra=""
        title="9. INTELLECTUAL PROPERTY"
        desc=""
      />
        <ContentComp
          intro="Mangerine may include third-party links or integrate with external services. We are not
responsible for the content, policies, or security of third-party sites."
        extra=""
        title="10. THIRD-PARTY LINKS AND SERVICES"
        desc=""
      />
      <ContentCompWithSubs
      intro1="We may suspend or permanently terminate your account if:"
        extra1=""
        title="11. TERMINATION"
        desc1="You breach these Terms;"
        desc2=" You misuse the Service;"
        extra2=""
        desc3=" Legal or regulatory requirements demand it."
        extra3=""
        intro2=" You may delete your account at any time in your settings."
      />
      <ContentCompWithSubs
        intro1="Mangerine provides the Service “as is” with no guarantees of uptime, availability, or
fitness for any particular purpose.
We are not liable for:"
        title="12. LIMITATION OF LIABILITY"
        desc1="Lost revenue, profits, or data;"
        desc2=" Personal injury or emotional distress;"
        extra2=""
        desc3=" Unauthorized access or third-party hacking."
        intro2="Our total liability shall not exceed the total amount you paid to Mangerine in the past 12
months."

      />
      <ContentCompWithSubs
        intro1="You agree to indemnify and hold harmless Mangerine, its directors, officers, employees,
and affiliates from any claim, loss, liability, or demand arising from:"
        title="13. INDEMNIFICATION"
        desc1="Your content;"
        desc2=" Your use of the Service;"
        extra2=""
        desc3=" Your violation of these Terms or any third-party rights."
        extra3=""
      />
      <ContentCompWithSubs
        intro1="These Terms are governed by the laws of the State of Delaware, United States.
All disputes shall be resolved through binding arbitration under the International
Chamber of Commerce (ICC) Arbitration Rules."
        title="14. GOVERNING LAW &amp; DISPUTE RESOLUTION"
        desc1="Seat of Arbitration: Wilmington, Delaware, USA"
        desc2=" Language: English"
        desc3="Binding: The arbitrator&#39;s decision shall be final and enforceable."
      />
      <ContentComp
        intro="We may modify these Terms at any time. We’ll notify users via email, app notification, or
banner. Continued use of the Service after changes constitutes your acceptance."
        title="15. CHANGES TO THESE TERMS"
desc=""

      />
      <ContentCompWithSubs
        intro1="Mangerine LLC."
        title="16. CONTACT US"
        intro2="Email: support@mangerine.com"
  
      />

    </Box>
  );
};
