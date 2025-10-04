import { Box, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import LegalContent from "./legalcontents";
import Questions from "./questions";
import Support from "./support";
import Feedback from "./feedback";

const Help = () => {
  const [Active, setActive] = useState(null);
 const back = ()=>{
    setActive(null)
 }
  const renderChild = () => {
    switch (Active) {
      case "a":
        return <Questions onClick={back} />;
        case "b":
        return <Feedback onClick={back} />;
        case "c":
            return <Support onClick={back} />;
      default:
        return (
          <Box
            //w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}

            borderRadius="lg"
            boxShadow="lg"
            bg="main_background"
            // p={8}
            w="full"
            h="auto"
            // overflowY={"scroll"}
            //px={6}
            //py={6}
            // marginLeft={40}
            mt={0}
          >
            <Text
              font="outfit"
               fontSize={{base:"1rem",md:"1.25rem",lg:"1.5rem"}}
              fontWeight="600"
              color="text_primary"
              lineHeight="36px"
              py="4"
              px="8"
            >
              Help & Support
            </Text>
            <LegalContent
              title={"Frequently asked questions"}
              onClick={() => {
                setActive("a");
              }}
            />
            <LegalContent
              title={"Feedback"}
              onClick={() => {
                setActive("b");
              }}
            />
            <LegalContent
              title={"Customer Support"}
              onClick={() => {
                setActive("c");
              }}
            />

          </Box>
        );
    }

  };

  return <Box w="full"overflowY={"scroll"} h="100vh" >{renderChild()}</Box>;
};

export default Help;
