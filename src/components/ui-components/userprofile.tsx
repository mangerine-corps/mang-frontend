
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
import { HiMiniBell } from "react-icons/hi2";
import { HiOutlineUpload } from "react-icons/hi";
import { IoEllipsisVerticalOutline } from "react-icons/io5";

interface UserProfileProps {
  checkmarkSrc?: string;
  dobSrc: string;
  locationSrc: string;
  consultantId?: string;
}

const UserProfile = ({
  checkmarkSrc,
  consultantId,
  // locationSrc,
  // dobSrc,
}: UserProfileProps) => {
  
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  // const { selectedConsultant } = useConsultants();
  useEffect(() => {
    
  }, [user, consultantId, user]);
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      borderRadius="2xl"
      boxShadow="sm"
      bg="bg_box"
      p={{ base: 2, lg: 4 }}
      // pb={6}
      gap={2}
      // borderRadius="16px"

      // width="914px"
      position="relative"
      // bg="red.900"
    >
      {/* Cover Photo */}
      <Image
        src={user?.profileBanner}
        alt={"profile banner"}
        // width="882px"
        height={{ base: "150px", lg: "250px" }}
        // roundedTop={"100px"}
        // rounded="2xl"
        borderRadius="14px"
        // p="24px"
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
        bg="yellow.100"
      >
        {/* <Box
            // bgImage={`${user?.profilePics}`}
            bgImg={"url(user?.profilePics)"}
            bgRepeat={"none"}
            bgSize={"cover"}
            objectFit={"center"}
            alignItems={"center"}
            justifyContent={"center"}
            p="4"
            w="200px"
            h="200px"
            bg="grey.500"
            rounded="full"
          ></Box> */}
        <Image
          src={user?.profilePics}
          alt={user?.fullName}
          width={{ base: "120px", lg: "180px" }}
          height={{ base: "120px", lg: "180px" }}
          borderRadius="8px"
          objectFit="cover"
          bg="red.800"
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
                  {user?.fullName}
                </Text>
                {user?.isVerified && checkmarkSrc && (
                  <Box
                    display={{ base: "hidden", lg: "block" }}
                    color="yellow.500"
                    fontSize={"1rem"}
                  >
                    <MdOutlineVerifiedUser />
                  </Box>
                )}
              </Flex>
              <Box
                cursor={"pointer"}
                onClick={() => {
                  setOpen(true);
                }}
                mt={3}
                pr={{ base: "0", lg: "2rem" }}
              >
                {user?.id !== consultantId ? (
                  <Text
                    color="text_primary"
                    fontSize={{ base: "0.875rem", lg: "1rem" }}
                  >
                    <BiSolidEditAlt />
                  </Text>
                ) : (
                  <HStack spaceX="2">
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
                        // color={"text_primary"}
                        fontWeight={"600"}
                      >
                        <HiMiniBell color="grey.300" />
                      </Text>
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
                      <Text
                        textAlign={"left"}
                        // fontSize={"1.25rem"}
                        fontFamily={"Outfit"}
                        // color={"text_primary"}
                        fontWeight={"600"}
                      >
                        <HiOutlineUpload color="grey.300" />
                      </Text>
                    </Box>
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
                            <Menu.Item
                              value="export-a"
                              _hover={{ bg: "primary." }}
                              roundedTop={"6px"}
                            >
                              <Menu.ItemCommand>
                                {" "}
                                <Image
                                  // onClick={open}
                                  alt="Follow Icon"
                                  src="/assets/icons/User-plus.svg"
                                />
                              </Menu.ItemCommand>{" "}
                              Edit Work
                            </Menu.Item>
                            <Menu.Item
                              value="export-b"
                              _hover={{ bg: "primary." }}
                              roundedTop={"6px"}
                            >
                              <Menu.ItemCommand>
                                {" "}
                                <Image
                                  // onClick={() => handleDeleteWork()}
                                  alt="Follow Icon"
                                  src="/assets/icons/User-plus.svg"
                                />
                              </Menu.ItemCommand>{" "}
                              Delete Work
                            </Menu.Item>
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                  </HStack>
                )}
              </Box>
            </Flex>

            <Text
              fontSize="0.875rem"
              color="text_primary"
              mb={1}
              marginLeft="2"
            >
              {!isEmpty(user?.businessName)
                ? user?.businessName
                : "UI/UX Designer"}
            </Text>
            <Text
              fontSize={{ base: "0.625rem", lg: "0.75rem" }}
              color="text_primary"
              mb={2}
              marginLeft="2"
              display={{ base: "none", lg: "flex" }}
            >
              {!isEmpty(user?.bio)
                ? user?.bio
                : "  Hi, I'm Sharon Grace, a UI/UX Designer with 2 years of experience.I specialize in intuitive interfaces and user research. Let's connect and create amazing digital experiences. "}
            </Text>

            {/* Location and DOB */}
            <Flex gap={3} alignItems="center" w="full">
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
                  {user?.location}
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
                  {!isEmpty(user?.dateOfBirth)
                    ? moment(user?.dateOfBirth).format(
                        "do, MMM yyyy"
                      )
                    : "Born 19 August"}
                </Text>
              </Flex>
            </Flex>
            <Text
              fontSize={{ base: "0.625rem", lg: "0.75rem" }}
              color="text_primary"
              // mb={2}
              marginLeft="2"
              display={{ base: "flex", lg: "none" }}
            >
              {!isEmpty(user?.bio)
                ? user?.bio
                : "  Hi, I'm Sharon Grace, a UI/UX Designer with 2 years of experience.I specialize in intuitive interfaces and user research. Let's connect and create amazing digital experiences. "}
            </Text>
          </Box>
        </Flex>
      </Box>

      <EditConsultDrawer
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      />
    </Box>
  );
};

export default UserProfile;
