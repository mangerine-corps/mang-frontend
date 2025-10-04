import { Box, List, Text } from "@chakra-ui/react";
import React from "react";
import HeaderContent from "./headercontent";
import ContentComp from "./contentcomp";
import ContentCompWithSubs from "./contentcompwithsubs";

const Cookies = ({ onClick }) => {
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
      mt={0}
      onClick={onClick}
    >
      <HeaderContent title="Cookies" desc="" extra="" />

      <Box pt="4">
        <ContentCompWithSubs
          title="We use cookies to: "
          desc1="Maintain session state;"
          desc2="Measure platform usage;"
          desc3="Personalize content."
          intro1=""
          intro2="You can manage cookies via your browser."
        />
      </Box>
      <Box py="5">
        <ContentComp
          title=" CHILDREN'S PRIVACY"
          intro="Mangerine is not intended for children under 13. If we become aware that a child has
provided personal data, we will delete it promptly."
          extra=""
        />
      </Box>

    </Box>
  );
};
export default Cookies