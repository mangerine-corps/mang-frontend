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
  const isEditable = Boolean(edit);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  const handleEdit = (item) => {
    setOpen(true);
    setSelected(item);
  };
  const openAddDrawer = () => {
    setSelected(null);
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
          <Box
            border={0.5}
            rounded={4}
            py={2}
            px="2"
            onClick={openAddDrawer}
            borderColor={"grey.300"}
            shadow={"md"}
          >
            <Text
              textAlign={"left"}
              // fontSize={"1.25rem"}
              fontFamily={"Outfit"}
              color={"text_primary"}
              fontWeight={"600"}
            >
              <HiMiniPlus color="text_primary" />
            </Text>
          </Box>
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
        onOpenChange={() => {
          setOpen(false);
        }}
        work={selected}
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
                    <Button
                      variant="outline"
                      bg="transparent"
                      color="#111D4A"
                      borderColor="#111D4A"
                      borderWidth="1px"
                      px={6}
                      rounded="md"
                      onClick={openAddDrawer}
                      _hover={{ bg: "rgba(17, 29, 74, 0.06)" }}
                    >
                      Add Work
                    </Button>
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
