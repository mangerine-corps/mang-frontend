import { Box, Text } from "@chakra-ui/react";
import HeaderContent from "./settings/headercontent";
import ContentComp from "./settings/contentcomp";
import ContentCompWithSubs from "./settings/contentcompwithsubs";
import LegalContent from "./settings/legalcontents";
import { Privacy } from "./settings/privacy";
import { useState } from "react";
// import { LegalSetting } from "mangarine/components/ui-components/legalsetting";
import { Terms } from "./settings/terms";

import Refundpolicy from "./refundpolicy";
import { PaymentTerms } from "./paymentterms";
import Cookies from "./settings/cookies";


const LegalSetting = () => {
  const [Active, setActive] = useState(null);
  const back = () => {
    setActive(null);
  };
  const renderChild = () => {
    switch (Active) {
      case "a":
        return <Terms onClick={back} />;
      case "b":
        return <Privacy onClick={back} />;
      case "c":
        return <Cookies onClick={back} />;
        case "d":
            return <Refundpolicy onClick={back} />;
            case "e":
                return <PaymentTerms onClick={back} />;
      default:
        return (
          <Box
            //w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}

            borderRadius="lg"
            boxShadow="lg"
            bg="main_background"
            // p={8}
            w="full"
            // h="auto"
            // overflowY={"scroll"}
            //px={6}
            //py={6}
            // marginLeft={40}
            mt={0}
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
                setActive("a");
              }}/>
            <LegalContent
              title={"Privacy Policy"}
              onClick={() => {
                setActive("b");
              }}
            />
            <LegalContent title={"Cookies"}  onClick={() => {
                setActive("c");
              }}/>
            <LegalContent title={"Refund Policy"}  onClick={() => {
                setActive("d");
              }}/>
            <LegalContent title={"Payment Terms"}  onClick={() => {
                setActive("e");
              }}/>
          </Box>
        );
    }
  };

  return (
    <Box w="full" overflowY={"scroll"} h={"fit-content"}>
      {renderChild()}
    </Box>
  );
};
export default LegalSetting;
