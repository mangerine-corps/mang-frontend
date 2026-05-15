import {
  Box,
  Text,
  VStack,
  Switch,
  RadioGroup,
} from "@chakra-ui/react";
import { useState } from "react";
import CancelSubscription from "./modals/cancelsub";
import ShareReview from "./sharereview";

const MyAccount = () => {
  const [value, setValue] = useState<string>("");

  return (
    <Box w="full" p={8} borderRadius="lg" boxShadow="lg" bg="bg_box" mt={0}>
      <Box my={10}>
        <Switch.Root
          w="full"
          alignItems={"flex-start"}
          justifyContent={"space-between"}
        >
          <Switch.Label
            font="outfit"
            fontSize="1.5rem"
            fontWeight="600"
            color="text_primary"
            lineHeight="36px"
          >
            Notification
          </Switch.Label>
          <Switch.HiddenInput />
          <Switch.Control />
        </Switch.Root>

        <Text
          font="outfit"
          fontSize="0.875rem"
          fontWeight="400"
          color="grey.300"
          lineHeight="30px"
          mb="4"
        >
          Receive updates via email for messages, requests, announcements, and
          payments.
        </Text>
        <VStack
          w="full"
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
          my="4"
        >
          <RadioGroup.Root
            value={value}
            onValueChange={(e) => setValue(e.value)}
            w="full"
          >
            <VStack w="full" gapY={4}>
              {[
                { id: 1, label: "Email" },
                { id: 2, label: "SMS" },
                // { id: 2, label: "Platform announcement" },
              ].map((item) => (
                <RadioGroup.Item
                  key={item.id}
                  value={item.label}
                  w="full"
                  alignItems={"flex-start"}
                  justifyContent={"space-between"}
                >
                  <RadioGroup.ItemText
                    color={"text_primary"}
                    fontSize={"1.25rem"}
                    fontWeight={"400"}
                  >
                    {item.label}
                  </RadioGroup.ItemText>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                </RadioGroup.Item>
              ))}
            </VStack>
          </RadioGroup.Root>
        </VStack>
      </Box>

    </Box>
  );
};

export default MyAccount;
