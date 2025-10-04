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
import { BiPlus, BiTrash } from "react-icons/bi";
import AddWorkDrawer from "./addworkdrawer";
import { useRouter } from "next/router";
import BoxLoader from "./profile/boxloader";
import { toaster } from "../ui/toaster";
// import { IoEllipsisVerticalOutline } from "react-icons/io5";

const WorkItem = ({
  work,
  handleDelete,
  handleEdit,
}: {
  work: any;
  handleDelete: (id: string) => void;
  handleEdit: (item: any) => void;
}) => {
  const [deleteWork, {isLoading:delwork}] = useDeleteWorkMutation();
  const router = useRouter();
   console.log(work, "wrks")
  const [edit, setEdit] = useState<boolean>(false);
  const handleDeleteWork = (item) => {
    console.log(item.id, "work del")
    deleteWork(work.id)
      .unwrap()
      .then((res) => {
        const {data,message}= res
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

        {router.pathname === "/profile" ? (
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
                    onClick={() => {
                      handleDeleteWork(work);
                    }}
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
  isLoading,
}: EditMyWorksCardProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState(null);
  const route = useRouter();

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };
  const handleEdit = (item) => {
    setOpen(true);
    setSelected(item);
  };
  const handleDelete = () => {};
  // const { open, onOpen, onClose } = useDisclosure();
  return (
    <VStack
      borderWidth={0.5}
      borderColor={"grey.300"}
      rounded={"15px"}
      bg="bg_box"
      //   bg={"green.400"}
      py="6"
      shadow={"sm"}
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

        {route.pathname === "/profile" && (
          <Box
            border={0.5}
            rounded={4}
            py={2}
            px="2"
            onClick={() => {
              setOpen(true);
            }}
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
                  handleDelete={handleDelete}
                />
              ))
            ) : (
              <Box w="full">
                <Text color="text_primary" textAlign={"center"}>
                  You have no work
                </Text>
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
