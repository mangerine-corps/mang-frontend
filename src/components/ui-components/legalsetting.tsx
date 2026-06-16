import { Box, Text } from "@chakra-ui/react";
import HeaderContent from "./settings/headercontent";
import ContentComp from "./settings/contentcomp";
import ContentCompWithSubs from "./settings/contentcompwithsubs";
import LegalContent from "./settings/legalcontents";
import { useState } from "react";
// import { LegalSetting } from "mangarine/components/ui-components/legalsetting";

import { PaymentTerms } from "./paymentterms";
import Cookies from "./settings/cookies";

const LEGAL_LINKS = {
  terms: "https://mangerine.com/terms",
  privacy: "https://mangerine.com/privacy",
  refund: "https://mangerine.com/refund",
};

const LegalSetting = () => {
  const [Active, setActive] = useState(null);
  const back = () => {
    setActive(null);
  };
  const renderChild = () => {
    switch (Active) {
      case "c":
        return <Cookies onClick={back} />;
      case "e":
        return <PaymentTerms onClick={back} />;
      default:
        return (
          <Box
            borderRadius="lg"
            boxShadow="lg"
            bg="main_background"
            w="full"
            h="full"
          >
            <Text
              font="outfit"
              fontSize={{ base: "1rem", md: "1.25rem", lg: "1.5rem" }}
              fontWeight="600"
              color="text_primary"
              lineHeight="36px"
              py="4"
              px="8"
            >
              Legal & Privacy
            </Text>

            <LegalContent title={"Terms of services"}  onClick={() => {
                window.open(LEGAL_LINKS.terms, "_blank");
              }}/>
            <LegalContent
              title={"Privacy Policy"}
              onClick={() => {
                window.open(LEGAL_LINKS.privacy, "_blank");
              }}
            />
            <LegalContent title={"Cookies"}  onClick={() => {
                setActive("c");
              }}/>
            <LegalContent title={"Refund Policy"}  onClick={() => {
                window.open(LEGAL_LINKS.refund, "_blank");
              }}/>
            <LegalContent title={"Payment Terms"}  onClick={() => {
                setActive("e");
              }}/>
          </Box>
        );
    }
  };

  return (
    <Box w="full" h="full">
      {renderChild()}
    </Box>
  );
};
export default LegalSetting;
