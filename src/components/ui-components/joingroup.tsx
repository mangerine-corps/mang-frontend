import { useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Text,
  VStack,
  Flex,
  Image,
  Drawer,
  HStack,
  Icon,
  Textarea,
} from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";
import { FaTimes } from "react-icons/fa";

type Group = {
  id: string;
  name: string;
  image: string;
  description: string;
  rules: string;
};

type Prop = {
  selected: Group | null;
  open: boolean;
  onOpenChange: () => void;
  action:any
};

const JoinGroup = ({ open, onOpenChange, selected, action }: Prop) => {
  const [selectedFriend, setSelectedFriend] = useState<string>("");
  const [reason, setReason] = useState("");
  const [agreed, setAgreed] = useState(false);

  const rules = selected?.rules;
  return (
    <Drawer.Root
      size={{ base: "md", md: "md", lg: "lg" }}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Drawer.Backdrop />

      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title></Drawer.Title>
          </Drawer.Header>
          <Drawer.Body
            css={{
              "&::-webkit-scrollbar": {
                width: "0px",

                height: "0px",
              },
              "&::-webkit-scrollbar-track": {
                width: "0px",
                background: "transparent",

                height: "0px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "transparent",
                borderRadius: "0px",
                maxHeight: "0px",
                height: "0px",
                width: 0,
              },
            }}
            px="6"
            py="8"
            className={outfit.className}
          >
            <HStack
              w="full"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Text
                font="outfit"
                fontSize={{ base: "1.25rem", md: "1.25rem", lg: "1.5rem" }}
                fontWeight="700"
                // lineHeight="60px"
                color="text_primary"
                py={4}
              >
                Join our Group
              </Text>
              <Drawer.Trigger>
                <FaTimes />
              </Drawer.Trigger>
            </HStack>
            <HStack alignItems="flex-start" my={8}>
              <Image
                src={selected?.image || "/placeholder.svg"}
                alt={selected?.name}
                w="80px"
                h="80px"
                bg="red.900"
                // boxSize="100px"
                borderRadius="md"
                objectFit="cover"
                mr={2}
                //mb={6}
              />
              <Box>
                <Text
                  color="text_primary"
                  font="outfit"
                  fontSize={{ base: "0.875rem", md: "1rem", lg: "1.5rem" }}
                  lineHeight="30px"
                  fontWeight="600"
                >
                  {selected?.name}
                </Text>
                <Text
                  color="grey.500"
                  font="outfit"
                  fontSize={{ base: "0.75rem", md: "0.825rem", lg: "0.875rem" }}
                  // lineHeight="30px"
                  fontWeight="400"
                >
                  {selected?.description}
                </Text>
              </Box>
            </HStack>
            <Box mb="8" mt={10}>
              <Text
                color="text_primary"
                font="outfit"
                fontSize={{ base: "1rem", md: "1rem", lg: "1.25rem" }}
                fontWeight="600"
                mb={1}
              >
                {/* Why do you want to join the {`${selected.name}`}? */}
              </Text>

              <Textarea
                mt={2}
                mb={4}
                p={3}
                placeholder="Why do you want to be a part of us?"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                minH="100px"
              />
            </Box>

            <VStack
              spaceY={6}
              w="full"
              h="full"
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
              overflowY={"scroll"}
              css={{
                "&::-webkit-scrollbar": {
                  width: "0px",

                  height: "0px",
                },
                "&::-webkit-scrollbar-track": {
                  width: "0px",
                  background: "transparent",

                  height: "0px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "transparent",
                  borderRadius: "0px",
                  maxHeight: "0px",
                  height: "0px",
                  width: 0,
                },
              }}
            >
              <Box mb={6}>
                <Text
                  color="text_primary"
                  font="outfit"
                  fontSize={{ base: "1rem", md: "1rem", lg: "1.5rem" }}
                  lineHeight="30px"
                  fontWeight="700"
                  mb={2}
                >
                  Our Rules and Regulations
                </Text>
                <VStack
                  gap={3}
                  align="start"
                  font="outfit"
                  //color="text_primary"
                  fontWeight="600"
                  fontSize="1rem"
                  color="gray.600"
                >
                  <Box
                    dangerouslySetInnerHTML={{
                      __html: rules || (
                        <>
                          <Text>
                            <b>Be respectful and professional:</b> Always
                            communicate respectfully with other members.
                            Personal attacks, harassment, or disrespectful
                            behavior will not be tolerated.
                          </Text>
                          <Text>
                            <b>No Spam or Self-Promotion:</b> Do not post spam
                            or irrelevant content in the community.
                          </Text>
                          <Text>
                            <b>Stay On-Topic:</b> Ensure that all posts and
                            comments are relevant to virtual assistant work and
                            related topics.
                          </Text>
                          <Text>
                            <b>Protect Privacy and Confidentiality:</b> Do not
                            share confidential or proprietary information about
                            clients, employers, or projects.
                          </Text>
                        </>
                      ),
                    }}
                  />
                </VStack>
              </Box>

              <HStack
                w="100%"
                display={"flex"}
                justifySelf={"end"}
                flexDir={"row"}
                spaceX={6}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
              >
                <Button
                  borderColor="primary.300"
                  borderWidth={1}
                  color={"white"}
                  bg={"white"}
                  py={2}
                  rounded="6px"
                  w="35%"
                  px={4}
                  _hover={{
                    textDecor: "none",
                  }}
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}

                  onClick={() => {onOpenChange()}}
                >
                  <Text
                    // ml={2}
                    className="text5"
                    color={"text_primary"}
                    fontSize={"0.875rem"}
                    fontWeight={"500"}
                  >
                    Cancel
                  </Text>
                </Button>
                <Button
                  bg="primary.600"
                  borderWidth={1}
                  color={"white"}
                  borderColor={"gray.50"}
                  py={2}
                  w="35%"
                  px={4}
                  _hover={{
                    textDecor: "none",
                  }}
                  onClick={action}
                  // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
                  rounded={"6px"}
                  // onClick={handleSubmit(onSubmit, (error) =>
                  //   console.log(error, "error")
                  // )}
                >
                  <Text
                    ml={2}
                    className="text5"
                    color={"white"}
                    fontSize={"0.875rem"}
                    fontWeight={"500"}
                  >
                    Submit
                  </Text>
                </Button>
              </HStack>
            </VStack>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default JoinGroup;
