import {
  Box,
  Image,
  Text,
  Flex,
  HStack,
  Menu,
  Button,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { isEmpty } from "es-toolkit/compat";
import { useAuth } from "mangarine/state/hooks/user.hook";
import moment from "moment";
import { useEffect, useState } from "react";
import { MdOutlineVerifiedUser } from "react-icons/md";
import EditConsultDrawer from "./editconsultantprofiledrawer";
import { BiSolidEditAlt } from "react-icons/bi";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import { HiMiniBell, HiMiniPlus } from "react-icons/hi2";
import { FaEllipsisH, FaEllipsisV, FaUpload } from "react-icons/fa";
import { HiOutlineUpload, HiUpload } from "react-icons/hi";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import BlockConsultant from "./modals/blockconsultant";

interface BlockedonsultantProfileCardProps {
  checkmarkSrc?: string;
//   dobSrc: string;
//   locationSrc: string;

  info?: any;
}

const BlockedConsultant= ({
  checkmarkSrc,

  info,
  // locationSrc,
  // dobSrc,
}: BlockedonsultantProfileCardProps) => {
  const route = useRouter();
  console.log(route.pathname, "");
  const [open, setOpen] = useState<boolean>(false);
  const [block, setBlock] = useState<boolean>(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderRadius="2xl"
      boxShadow="sm"
      bg="bg_box"
      mt="4"
      w="97%"
      // px=""
      p={{ base: 2, lg: 4 }}
      // pb={6}
      gap={2}
      // borderRadius="16px"

      // width="914px"
      position="relative"
      // bg="red.900"
    >
      {/* Cover Photo */}

      <Box
        bg="grey.500"
        // width="882px"
        height={{ base: "150px", lg: "250px" }}
        // roundedTop={"100px"}
        // rounded="2xl"
        borderRadius="14px"
        // p="24px"
        // mt="6"
        // gap="16px"
        objectFit="cover"
      />

      {/* Profile Photo */}
      <Box
        position="absolute"
        bottom={{ base: "20", lg: "54px" }}
        left={{ base: "6", lg: 10 }}
        // transform="translateY(-50%)"

        objectFit={"cover"}
        rounded={"full"}
        // bg="main_background"
        // borderRadius="100%"
        overflow="hidden"
        // bg="yellow.100"
      >

        <Image
          src={"/images/blockedavarar.svg"}
          alt={info?.fullName}
          width={{ base: "120px", lg: "180px" }}
          height={{ base: "120px", lg: "180px" }}
          borderRadius="8px"
          objectFit="cover"
        //   bg="red.800"
        />
      </Box>

      {/* Text Content */}
      <Box>
        <Flex
          flexDirection="row"
          justifyContent={"space-between"}
          alignItems={"flex-start"}
          ml={["140px", "190px"]}
          mb={5}
          pl={{ base: 0, lg: 5 }}
          pb={3}
          overflow="hidden"
        >
          <Box w="full">
            <Flex justifyContent={"space-between"}>
              <Flex alignItems="flex-start" display="flex" mb={1}>
                <Text
                  fontSize={{ base: "1rem", lg: "1.5rem" }}
                  justifyContent="center"
                  color="text_primary"
                  fontWeight="600"
                  font="outfit"
                  marginLeft="2"
                  pr="0"
                >
                  {info?.fullName}
                </Text>
                {info?.isVerified && checkmarkSrc && (
                  <Box
                    display={{ base: "hidden", lg: "block" }}
                    color="yellow.500"
                    fontSize={"1rem"}
                  >
                    <MdOutlineVerifiedUser />
                  </Box>
                )}
              </Flex>
              <Box mt={3} pr={{ base: "0", lg: "2rem" }}>
                {route.pathname === "/profile" ? (
                  <Box
                    cursor={"pointer"}
                    onClick={() => {
                      setOpen(true);
                    }}
                    mt={3}
                    pr={{ base: "0", lg: "2rem" }}
                  >
                    <Text
                      color="text_primary"
                      fontSize={{ base: "0.875rem", lg: "1rem" }}
                    >
                      <BiSolidEditAlt />
                    </Text>
                  </Box>
                ) : (
                  <HStack spaceX="2">
                    {/* <Box
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
                      <Image
                        // onClick={open}
                        alt="bell Icon"
                        src="/icons/notif.svg"
                      />
                    </Box>
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
                      <Image
                        // onClick={open}
                        alt="upload Icon"
                        src="/icons/upload.svg"
                      />
                    </Box> */}
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          // borderColor={"grey.300"}
                          shadow={"md"}
                        >
                          <Stack
                            justifyContent={"center"}
                            alignItems={"center"}
                            aria-label="Options"
                          >
                            <IoEllipsisVerticalOutline
                              size={6}
                              color={"grey.300"}
                            />
                          </Stack>
                        </Button>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content px="3" py="3" spaceY={"2"}>
                            {/* <Menu.Item
                              value="export-a"
                              _hover={{ bg: "primary." }}
                              roundedTop={"6px"}
                              color="text_primary"
                              fontSize="1rem"
                              onClick={() => {}}
                              py="2"
                            >
                              <Menu.ItemCommand>
                                {" "}
                                <Image
                                  // onClick={open}
                                  alt="link Icon"
                                  src="/icons/link.svg"
                                />
                              </Menu.ItemCommand>{" "}
                              Copy link to profile
                            </Menu.Item>
                            <Menu.Item
                              value="export-a"
                              _hover={{ bg: "primary." }}
                              roundedTop={"6px"}
                              color="text_primary"
                              fontSize="1rem"
                              py="2"
                              onClick={() => {}}
                            >
                              <Menu.ItemCommand>
                                {" "}
                                <Image
                                  // onClick={open}
                                  alt="link Icon"
                                  src="/icons/mute.svg"
                                />
                              </Menu.ItemCommand>{" "}
                              Mute {info?.fullName}
                            </Menu.Item> */}
                            <Menu.Item
                              value="export-a"
                              _hover={{ bg: "primary." }}
                              roundedTop={"6px"}
                              color="text_primary"
                              fontSize="1rem"
                              py="2"
                              onClick={() => {
                                setBlock(true);
                              }}
                            >
                              <Menu.ItemCommand>
                                {" "}
                                <Image
                                  // onClick={open}
                                  alt="link Icon"
                                  src="/icons/block.svg"
                                />
                              </Menu.ItemCommand>{" "}
                              Unblock {info?.fullName}
                            </Menu.Item>
                            <Menu.Item
                              value="export-a"
                              _hover={{ bg: "primary." }}
                              roundedTop={"6px"}
                              color="text_primary"
                              fontSize="1rem"
                              py="2"
                              onClick={() => {}}
                            >
                              <Menu.ItemCommand>
                                {" "}
                                <Image
                                  // onClick={open}
                                  alt="link Icon"
                                  src="/icons/report.svg"
                                />
                              </Menu.ItemCommand>{" "}
                              Report {info?.fullName}
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  </HStack>
                )}
              </Box>
              <BlockConsultant
                isOpen={block}
                data={info}
                checkmarkSrc={checkmarkSrc}
                onOpenChange={() => {
                  setBlock(false);
                }}
              />
            </Flex>

            <Text
              fontSize="0.875rem"
              color="text_primary"
              mb={1}
              marginLeft="2"
            >
              {!isEmpty(info?.businessName)
                ? info?.businessName
                : "UI/UX Designer"}
            </Text>
            {/* <Text
              fontSize={{ base: "0.625rem", lg: "0.75rem" }}
              color="text_primary"
              mb={2}
              marginLeft="2"
              display={{ base: "none", lg: "flex" }}
            >
              {!isEmpty(info?.bio)
                ? info?.bio
                : "  Hi, I'm Sharon Grace, a UI/UX Designer with 2 years of experience.I specialize in intuitive interfaces and user research. Let's connect and create amazing digital experiences. "}
            </Text> */}

            {/* Location and DOB */}
             {/* <Flex gap={3} alignItems="center" w="full">
              <Flex alignItems="center" gap={1} marginLeft="2">
                <Image
                  src="/icons/locations.svg"
                  alt="Location Icon"
                  boxSize={{ base: 3, lg: "6" }}
                />
                <Text
                  fontSize={{ base: "10px", lg: "12px" }}
                  color="text_primary"
                >
                  {info?.location}
                </Text>
              </Flex>

              <Flex alignItems="center" gap={1}>
                <Image
                  src="/icons/doblogo.svg"
                  alt="DOB Icon"
                  boxSize={{ base: 3, lg: "6" }}
                />
                <Text
                  fontSize={{ base: "10px", lg: "12px" }}
                  color="text_primary"
                >
                  {!isEmpty(info?.dateOfBirth)
                    ? moment(info?.dateOfBirth).format("do, MMM yyyy")
                    : "Born 19 August"}
                </Text>
              </Flex>
            </Flex> */}
            {/* <Text
              fontSize={{ base: "0.625rem", lg: "0.75rem" }}
              color="text_primary"
              // mb={2}
              marginLeft="2"
              display={{ base: "flex", lg: "none" }}
            >
              {!isEmpty(info?.bio)
                ? info?.bio
                : "  Hi, I'm Sharon Grace, a UI/UX Designer with 2 years of experience.I specialize in intuitive interfaces and user research. Let's connect and create amazing digital experiences. "}
            </Text>  */}
          </Box>
        </Flex>
      </Box>

      {/* <BlockedonsultDrawer
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      /> */}
    </Box>
  );
};

export default BlockedConsultant;
