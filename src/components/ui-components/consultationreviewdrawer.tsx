"use client";
import {
  Box,
  Button,
  Drawer,
  HStack,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";

import { FaTimes } from "react-icons/fa";

type prop = {
  open: boolean;
  onOpenChange: any;
};

const ShareReview = ({ open, onOpenChange }) => {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} size="md">
      <Drawer.Backdrop />

      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header></Drawer.Header>
          <Drawer.Body px="2" py="8" bg="bg_box">
            <Box
              w="full"
              mx="auto"
              bg="bg_box"
              className={outfit.className}
              // borderRadius="xl"
              // boxShadow="lg"
              p={4}
            >
              <HStack justify="space-between" mb={4}>
                <Text
                  font="outfit"
                  fontSize="2.5rem"
                  fontWeight="700"
                  color="text_primary"
                >
                  Share Review
                </Text>
                <Image src="/icons/close.svg" alt="Close" cursor="pointer" />
              </HStack>

              <Box
                border="1px solid"
                borderColor="gray.50"
                borderRadius="md"
                py={4}
                mb={4}
                bg="bg_box"
              >
                <Text
                  font="outfit"
                  fontSize="1.25rem"
                  fontWeight="600"
                  color="text_primary"
                  mb={4}
                >
                  <b> Jane Doe.</b>
                  August 28, 2024
                </Text>
                <Text
                  font="outfit"
                  fontSize="1.25rem"
                  fontWeight="400"
                  color="text_primary"
                  mt={2}
                >
                  {`🌟 "Amazing consultation—clear, concise, and very insightful.
                  The consultant took the time to listen and provide tailored
                  advice that directly addressed my concerns. The depth of
                  knowledge and the practical steps offered were incredibly
                  helpful. I left the consultation feeling empowered and with a
                  clear plan of action. Highly recommend to anyone seeking
                  professional guidance!"`}
                </Text>
              </Box>

              {/* Received on */}
              <Text
                font="outfit"
                fontSize="1.25rem"
                fontWeight="600"
                color="text_primary"
                mb={1}
              >
                Received on{" "}
                <Text as="span" color="blue.800">
                  Mangerine
                </Text>
              </Text>

              {/* Message input */}
              <Text font="outfit" fontSize="sm" color="gray.400">
                Add a personal message (optional)
              </Text>
              <Textarea
                placeholder="Check out this review I received on Mangerine:   'Amazing consultation—clear, concise, and very insightful. Highly recommend!' - See more here: [http://www.manjarine.com/review/12345]"
                fontSize="sm"
                bg="bg_box"
                borderRadius="10px"
                minHeight="120px"
                p={4}
                _focus={{ borderColor: "blue.300", bg: "bg_box" }}
                mb={4}
              />

              {/* Share to buttons */}
              <HStack
                gap={4}
                mb={4}
                color="text_primary"
                flexWrap="wrap"
                justify="flex-start"
              >
                {[
                  { icon: "/icons/twitter.svg", label: "X (Twitter)" },
                  { icon: "/icons/instagram.svg", label: "Instagram" },
                  { icon: "/icons/facebook.svg", label: "Facebook" },
                  { icon: "/icons/email.svg", label: "Email" },
                  { icon: "/icons/qrcode.svg", label: "QR Code" },
                ].map((item, index) => (
                  <VStack key={index} gap={8}>
                    <Button variant="outline" size="sm" px={6} py={6} h="auto">
                      <Image
                        color="text_primary"
                        src={item.icon}
                        alt={item.label}
                      />
                    </Button>
                    <Text
                      fontSize="1rem"
                      fontWeight="400"
                      color="text_primary"
                      textAlign="center"
                    >
                      {item.label}
                    </Text>
                  </VStack>
                ))}
              </HStack>

              {/* Review Link */}
              <Box position="relative">
                <Text
                  color="text_primary"
                  fontWeight="medium"
                  fontSize="sm"
                  mb={2}
                >
                  Review Link
                </Text>

                <Input
                  value="http://www.mangerine.com/review/12345"
                  fontSize="sm"
                  bg="bg_box"
                  color="text_primary"
                  pr="40px"
                />

                <Image
                  src="/icons/copy.svg"
                  alt="Copy"
                  position="absolute"
                  top="70%"
                  right="12px"
                  transform="translateY(-50%)"
                  cursor="pointer"
                />
              </Box>
            </Box>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default ShareReview;
