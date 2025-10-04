import { Box, List, Text } from "@chakra-ui/react";
import React from "react";
import ContentComp from "mangarine/components/ui-components/settings/contentcomp";
import ContentCompWithSubs from "mangarine/components/ui-components/settings/contentcompwithsubs";
import HeaderContent from "mangarine/components/ui-components/settings/headercontent";

const PrivacyPolicy = ({ onClick }) => {
  return (
    <Box
      //w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}

      borderRadius="lg"
    //   boxShadow="lg"
      bg="main_background"
      p={24}
      w="8xl"
      mx="auto"
      h="full"
      overflowY={"scroll"}
      //px={6}
      //py={6}
      // marginLeft={40}
      mt={0}
      onClick={onClick}
    >
      <HeaderContent
        title="PRIVACY POLICY"
        desc="Effective Date:"
        extra="Your privacy is important to us. This Privacy Policy explains how Mangerine collects,
uses, and safeguards your data."
      />
      <Box py="5">
        <ContentCompWithSubs
          title="1. DATA WE COLLECT"
          desc1="Account Info:"
          extra1="Name, email, password, profile data"
          desc2="Payment Info:"
          extra2="Processed securely via third parties"
          desc3="Usage Data:"
          extra3="Device, IP, browser, session activity"
          desc4="Content Data:"
          extra4="Videos, posts, comments you upload"
          intro2="Location Info (optional): For personalization and compliance"
        />
      </Box>
      <Box pb="5">
        <ContentComp
          title="Information We Collect"
          desc="Personal Information: We collect information you provide, such as your name, email address, and payment details when you create an account or book consultations.
Usage Data: We collect data on how you use the Platform, including IP addresses, browser types, and usage patterns.
Cookies: We use cookies to enhance your experience and analyze site traffic."
          extra=""
        />
      </Box>
      <Box pb="5">
        <ContentCompWithSubs
          title="2. HOW WE USE YOUR DATA"
          intro1="We use your information to:"
          desc1="Operate and improve Mangerine;"
          desc2="Process payments and subscriptions;"
          desc3="Comply with legal obligations;"
          desc4="Respond to inquiries and provide support;"
        />
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
              Prevent fraud and abuse;
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
            >
              Send marketing communications (you may opt-out anytime).
            </Text>
          </List.Item>
        </List.Root>
      </Box>
      <Box pb="5">
        <ContentCompWithSubs
          title="3. DATA SHARING"
          desc1="Payment processors (e.g., Stripe);"
          desc2="Hosting providers and infrastructure partners;"
          desc3="Analytics tools (e.g., Google Analytics);"
          desc4="Law enforcement, if legally required."
          intro1="We may share your data with:"
          intro2="We do not sell personal data."
        />
      </Box>
      <Box pb="5">
        <ContentComp
          title="4. DATA SECURITY"
          intro="We use industry-standard encryption (HTTPS/SSL), secure storage, and regular audits
to protect your information."
          extra=""
        />
      </Box>
      <Box pb="5">
        <ContentCompWithSubs
          title="5. INTERNATIONAL DATA TRANSFER"
          desc1=" GDPR for EU/EEA users;"
          desc2=" CCPA for California residents."
          intro1="As a global service, your data may be transferred across borders. We comply with:"
        />
      </Box>
      <Box pb="5">
        <ContentCompWithSubs
          title="6. YOUR RIGHTS"
          desc1="Access or correct your data;"
          desc2="Object to processing;"
          desc3="Request deletion;"
          desc4="Export your data (data portability).."
          intro1="Depending on your jurisdiction, you may have the right to:"
          intro2="Contact: support@mangerine.com."
        />
      </Box>
      <Box pb="5">
        <ContentCompWithSubs
          title="7. COOKIES"
          desc1="Maintain session state;"
          desc2="Measure platform usage;"
          desc3="Personalize content."
          intro1="We use cookies to:"
          intro2="You can manage cookies via your browser."
        />
      </Box>
      <Box pb="5">
        <ContentComp
          title="8. CHILDREN'S PRIVACY"
          intro="Mangerine is not intended for children under 13. If we become aware that a child has
provided personal data, we will delete it promptly."
          extra=""
        />
      </Box>
      <Box pb="5">
        <ContentComp
          title="8. CHILDREN'S PRIVACY"
          intro="Mangerine is not intended for children under 13. If we become aware that a child has
provided personal data, we will delete it promptly."
          extra=""
        />
      </Box>
    </Box>
  );
};
export default PrivacyPolicy