import {
  Flex,
  Box,
  Image,
  Text,
  VStack,
  HStack,
  Menu,
  Portal,
  Button,
  Stack,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { size } from "lodash";

import { useDeleteWorkMutation } from "mangarine/state/services/profile.service";
import { HiMiniPlus } from "react-icons/hi2";

import { IoEllipsisVerticalOutline } from "react-icons/io5";
import AddWorkDrawer from "./addworkdrawer";
import BoxLoader from "./profile/boxloader";
import { toaster } from "../ui/toaster";
// import { IoEllipsisVerticalOutline } from "react-icons/io5";

const WorkItem = ({
  work,
  handleEdit,
  editable,
}: {
  work: any;
  handleEdit: (item: any) => void;
  editable: boolean;
}) => {
  const [deleteWork] = useDeleteWorkMutation();

  const handleDeleteWork = () => {
    deleteWork(work.id)
      .unwrap()
      .then((res) => {
        const { message } = res;
        toaster.create({
          type: "success",
          title: "Success",
          description: message,
          closable: true,
        });
      })
      .catch((error) => {
        console.log(error);
        const { data, message } = error;
        toaster.create({
          type: "error",
          title: "Error",
          description: message,
          closable: true,
        });
      });
  };

  return (
    <Box
      flex="0 0 auto"
      width="200px"
      padding="16px"
      flexDirection="column"
      alignItems="flex-start"
      gap="8px"
      borderRadius="8px"
      background="bg_box"
      pos={"relative"}
      boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
    >
      <Box pos={"relative"}>
        <Image
          height={100}
          width={150}
          src={work.file}
          alt={work.title}
          borderRadius="8px"
        />

        {editable ? (
          <Menu.Root>
            <Menu.Trigger asChild>
              <Button
                borderWidth={1}
                borderColor="text_primary"
                variant="outline"
                size="sm"
                pos={"absolute"}
                top="0"
              >
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  aria-label="Options"
                  color={"text_primary"}
                >
                  <IoEllipsisVerticalOutline size={6} />
                </Stack>
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content px="2" py="3" spaceY={"2"}>
                  <Menu.Item
                    value="export-a"
                    _hover={{ bg: "primary." }}
                    roundedTop={"6px"}
                    onClick={() => {
                      handleEdit(work);
                    }}
                  >
                    <Menu.ItemCommand>
                      <Image src="/icons/edit.svg" alt="edit" h={"2.5"} w="2" />
                    </Menu.ItemCommand>{" "}
                    Edit Work
                  </Menu.Item>
                  <Menu.Item
                    value="export-b"
                    _hover={{ bg: "primary." }}
                    roundedTop={"6px"}
                    onClick={handleDeleteWork}
                  >
                    <Menu.ItemCommand>
                      {" "}
                      <Image
                        src="/icons/delete2.svg"
                        alt="trash"
                        h={"2.5"}
                        w="2"
                      />
                      {/* <BiTrash /> */}
                    </Menu.ItemCommand>
                    Delete Work
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        ) : (
          ""
        )}
      </Box>

      <Text fontSize="1rem" fontWeight="600" mt={2} color="text_primary">
        {work.title}
      </Text>
      <Text textAlign={"justify"} fontSize="0.875rem" color="#666">
        {work.description}
      </Text>
      {/*<EditWorkModal work={work} open={open} onClose={onClose} /> */}
    </Box>
  );
};

interface EditMyWorksCardProps {
  title: string;
  works: any;
  width?: string | object;
  edit?: any;
  isLoading: boolean;
}

const EditMyWorksCard = ({
  title,
  width,
  works,
  edit,
  isLoading,
}: EditMyWorksCardProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState(null);
  const [addMode, setAddMode] = useState<"link" | "media" | null>(null);
  const isEditable = Boolean(edit);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  const handleEdit = (item) => {
    setSelected(item);
    setAddMode(null);
    setOpen(true);
  };
  const openWithMode = (mode: "link" | "media") => {
    setSelected(null);
    setAddMode(mode);
    setOpen(true);
  };
  // const { open, onOpen, onClose } = useDisclosure();
  return (
    <VStack
      rounded={"15px"}
      bg="bg_box"
      py="6"
      boxShadow="0px 0px 4px 0px #0000001A"
      wordSpacing={"3"}
      w={width}
      position="relative"
    >
      <HStack
        px={"4"}
        justifyContent={"space-between"}
        alignItems={"center"}
        w="full"
      >
        <Text
          textAlign={"left"}
          fontSize={"1.25rem"}
          fontFamily={"Outfit"}
          color={"text_primary"}
          fontWeight={"600"}
        >
          {title}
        </Text>

        {isEditable && size(works) > 0 && (
          <Menu.Root positioning={{ placement: "bottom-end" }}>
            <Menu.Trigger asChild>
              <Box
                as="button"
                py={1}
                px={1}
                cursor="pointer"
              >
                <HiMiniPlus color="text_primary" size={18} />
              </Box>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner zIndex="max">
                <Menu.Content
                  bg="bg_box"
                  borderWidth="1px"
                  borderColor="input_border"
                  borderRadius="12px"
                  shadow="md"
                  minW="180px"
                  p={2}
                >
                  <Menu.Item value="link" cursor="pointer" borderRadius="8px" px={4} py={3} onClick={() => openWithMode("link")}>
                    <HStack gap={3}>
                      <svg width="14" height="16" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.2811 12.3101L12.2577 17.3521C10.897 18.7171 9.00478 19.5 7.06459 19.5C5.15637 19.5 3.38005 18.771 2.06028 17.447C-0.723124 14.653 -0.681192 10.063 2.15516 7.21704L7.87786 1.47302C8.82498 0.523022 10.0838 0 11.4225 0C12.7613 0 14.0201 0.523022 14.9673 1.47302C16.9204 3.43302 16.9204 6.62201 14.9673 8.58301L9.21761 14.354C8.12863 15.446 6.23136 15.446 5.14237 14.354C4.02042 13.228 4.02042 11.396 5.14237 10.269L10.1927 5.19995C10.4844 4.90795 10.96 4.90597 11.2527 5.19897C11.5454 5.49097 11.5464 5.96701 11.2537 6.26001L6.20339 11.329C5.6629 11.871 5.6629 12.753 6.20339 13.295C6.72491 13.819 7.63404 13.819 8.15555 13.295L13.9052 7.52405C15.2769 6.14805 15.2769 3.90896 13.9052 2.53296C12.5794 1.20096 10.2646 1.20096 8.93888 2.53296L3.21619 8.27698C1.00025 10.501 0.957261 14.2159 3.12124 16.3879C4.15728 17.4279 5.55702 18 7.06361 18C8.60818 18 10.1148 17.377 11.1958 16.292L16.2191 11.25C16.5108 10.958 16.9853 10.956 17.2791 11.249C17.5728 11.541 17.5738 12.0161 17.2811 12.3101Z" fill="#41416E"/>
                      </svg>
                      <Text fontSize="0.875rem" color="text_primary">Add a link</Text>
                    </HStack>
                  </Menu.Item>
                  <Menu.Item value="media" cursor="pointer" borderRadius="8px" px={4} py={3} onClick={() => openWithMode("media")}>
                    <HStack gap={3}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="13" y="7" width="4" height="4" rx="2" fill="#111D4A" stroke="#A20606" strokeWidth="1.5"/>
                        <path d="M4.71809 17.2014L6.45698 15.4625C8.08199 13.8375 10.7166 13.8375 12.3417 15.4625L14.0805 17.2014M14.0805 17.2014L14.7849 16.497C16.0825 15.1994 18.2143 15.2961 19.3891 16.7059L19.802 17.2014M14.0805 17.2014L16.6812 19.802M3.35288 15.0496C2.88237 13.0437 2.88237 10.9563 3.35288 8.95043C4.00437 6.17301 6.17301 4.00437 8.95043 3.35288C10.9563 2.88237 13.0437 2.88237 15.0496 3.35288C17.827 4.00437 19.9956 6.17301 20.6471 8.95044C21.1176 10.9563 21.1176 13.0437 20.6471 15.0496C19.9956 17.827 17.827 19.9956 15.0496 20.6471C13.0437 21.1176 10.9563 21.1176 8.95044 20.6471C6.17301 19.9956 4.00437 17.827 3.35288 15.0496Z" stroke="#363853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <Text fontSize="0.875rem" color="text_primary">Add media</Text>
                    </HStack>
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        )}

        {/* <Box
              border={0.5}
              rounded={4}
              py={2}
              px="2"
              onClick={() => {
                setOpen(true);
              }}
              borderColor={"gray.150"}
              shadow={"md"}
            >
            <Text color="text_primary" fontSize={"1rem"}>
              <BiSolidEditAlt />
            </Text>
          </Box> */}
      </HStack>
      <AddWorkDrawer
        open={open}
        onOpenChange={() => { setOpen(false); setAddMode(null); }}
        work={selected}
        initialMode={addMode}
      />

      <Flex
        ref={scrollContainerRef}
        overflowX="auto"
        gap={4}
        px="3"
        w="full"
        flexWrap="nowrap"
        css={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        }}
        scrollbar="hidden"
      >
        {isLoading ? (
          <HStack >
            <BoxLoader />
         
          </HStack>
        ) : (
          <>
            {size(works) > 0 ? (
              works.map((work) => (
                <WorkItem
                  handleEdit={handleEdit}
                  key={work.id}
                  work={work}
                  editable={isEditable}
                />
              ))
            ) : (
              <Box w="full" py={{ base: 6, lg: 10 }}>
                <VStack gap={4} w="full">
                  <Image
                    src="/jobs.png"
                    alt="No work added yet"
                    maxW={{ base: "120px", lg: "160px" }}
                    h="auto"
                  />
                  <Text
                    color="text_primary"
                    textAlign={"center"}
                    fontSize={{ base: "0.95rem", lg: "1rem" }}
                    maxW="360px"
                  >
                    {isEditable ? "Showcase your best work by adding projects or a portfolio." : "No works or portfolio has been added yet."}
                  </Text>
                  {isEditable && (
                    <Menu.Root positioning={{ placement: "bottom" }}>
                      <Menu.Trigger asChild>
                        <Button
                          variant="outline"
                          bg="transparent"
                          color="#111D4A"
                          borderColor="#111D4A"
                          borderWidth="1px"
                          px={6}
                          rounded="md"
                          _hover={{ bg: "rgba(17, 29, 74, 0.06)" }}
                        >
                          Add Work
                        </Button>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner zIndex="max">
                          <Menu.Content
                            bg="bg_box"
                            borderWidth="1px"
                            borderColor="input_border"
                            borderRadius="10px"
                            shadow="md"
                            minW="160px"
                            p={1}
                          >
                            <Menu.Item value="link" cursor="pointer" borderRadius="8px" onClick={() => openWithMode("link")}>
                              <HStack gap={2}>
                                <svg width="14" height="16" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17.2811 12.3101L12.2577 17.3521C10.897 18.7171 9.00478 19.5 7.06459 19.5C5.15637 19.5 3.38005 18.771 2.06028 17.447C-0.723124 14.653 -0.681192 10.063 2.15516 7.21704L7.87786 1.47302C8.82498 0.523022 10.0838 0 11.4225 0C12.7613 0 14.0201 0.523022 14.9673 1.47302C16.9204 3.43302 16.9204 6.62201 14.9673 8.58301L9.21761 14.354C8.12863 15.446 6.23136 15.446 5.14237 14.354C4.02042 13.228 4.02042 11.396 5.14237 10.269L10.1927 5.19995C10.4844 4.90795 10.96 4.90597 11.2527 5.19897C11.5454 5.49097 11.5464 5.96701 11.2537 6.26001L6.20339 11.329C5.6629 11.871 5.6629 12.753 6.20339 13.295C6.72491 13.819 7.63404 13.819 8.15555 13.295L13.9052 7.52405C15.2769 6.14805 15.2769 3.90896 13.9052 2.53296C12.5794 1.20096 10.2646 1.20096 8.93888 2.53296L3.21619 8.27698C1.00025 10.501 0.957261 14.2159 3.12124 16.3879C4.15728 17.4279 5.55702 18 7.06361 18C8.60818 18 10.1148 17.377 11.1958 16.292L16.2191 11.25C16.5108 10.958 16.9853 10.956 17.2791 11.249C17.5728 11.541 17.5738 12.0161 17.2811 12.3101Z" fill="#41416E"/>
                                </svg>
                                <Text fontSize="0.875rem" color="text_primary">Add a link</Text>
                              </HStack>
                            </Menu.Item>
                            <Menu.Item value="media" cursor="pointer" borderRadius="8px" onClick={() => openWithMode("media")}>
                              <HStack gap={2}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <rect x="13" y="7" width="4" height="4" rx="2" fill="#111D4A" stroke="#A20606" strokeWidth="1.5"/>
                                  <path d="M4.71809 17.2014L6.45698 15.4625C8.08199 13.8375 10.7166 13.8375 12.3417 15.4625L14.0805 17.2014M14.0805 17.2014L14.7849 16.497C16.0825 15.1994 18.2143 15.2961 19.3891 16.7059L19.802 17.2014M14.0805 17.2014L16.6812 19.802M3.35288 15.0496C2.88237 13.0437 2.88237 10.9563 3.35288 8.95043C4.00437 6.17301 6.17301 4.00437 8.95043 3.35288C10.9563 2.88237 13.0437 2.88237 15.0496 3.35288C17.827 4.00437 19.9956 6.17301 20.6471 8.95044C21.1176 10.9563 21.1176 13.0437 20.6471 15.0496C19.9956 17.827 17.827 19.9956 15.0496 20.6471C13.0437 21.1176 10.9563 21.1176 8.95044 20.6471C6.17301 19.9956 4.00437 17.827 3.35288 15.0496Z" stroke="#363853" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <Text fontSize="0.875rem" color="text_primary">Add media</Text>
                              </HStack>
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  )}
                </VStack>
              </Box>
            )}
          </>
        )}
      </Flex>

      {/* Conditionally render "Next" image slider */}
      {size(works) > 3 && (
        <Box
          position="absolute"
          top="50%"
          right="2rem"
          transform="translateY(-50%)"
          onClick={handleScroll}
          cursor="pointer"
          zIndex={2}
        >
          <Image src="/icons/next.svg" alt="Next" />
        </Box>
      )}
    </VStack>
  );
};

export default EditMyWorksCard;
