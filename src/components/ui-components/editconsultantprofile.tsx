import {
  Box,
  Image,
  Text,
  Flex,
  Avatar,
  Menu,
  Stack,
  Portal,
  HStack,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import EditConsultDrawer from "./editconsultantprofiledrawer";
import { BiSolidEditAlt } from "react-icons/bi";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import BlockConsultant from "./modals/blockconsultant";

import { useDispatch } from "react-redux";
import { setIsStateBlocked } from "mangarine/state/reducers/consultant.reducer";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useFollowUserMutation } from "mangarine/state/services/posts.service";
import { toaster } from "../ui/toaster";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useCopyToClipboard } from "react-use";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import ReportUser from "./modals/reportuser";
import { useBlockUserMutation } from "mangarine/state/services/profile.service";

interface EditConsultantProfileCardProps {
  checkmarkSrc?: string;
  dobSrc: string;
  locationSrc: string;
  consultantId?: string;
  info?: any;
  editable?: boolean;
}

const EditConsultantProfileCard = ({
  checkmarkSrc,
  info,
  editable = false,
  // locationSrc,
  // dobSrc,
}: EditConsultantProfileCardProps) => {
  const route = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [report, setReport] = useState(false);
  const [block, setBlock] = useState<boolean>(false);
  const [follow, setFollow] = useState(false);
  const [showblockPage, setShowBlockPage] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [addFollower] = useFollowUserMutation();
  const { user } = useAuth();
  const [, copyToClipboard] = useCopyToClipboard();
  const router = useRouter();
  const [blockUser, { isLoading: blocking }] = useBlockUserMutation();
  const [reportUserId, setReportUserId] = useState<string | undefined>(undefined);

  // useEffect(() => {
  //   dispatch(setIsStateBlocked(showblockPage));
  // }, [showblockPage, dispatch]);
  // const handleBlockConsultant = (id: string) => {
  //   setShowBlockPage(true)

  // };
  const pathname = usePathname();
  const profileUrl = ` ${process.env.APP_URL}${pathname}`;
  const handleCopyLink = () => {
    copyToClipboard(profileUrl);
     console.log(profileUrl,"url")
    toaster.create({
      title: "Success",
      type: "success",
      description: "Profile link copied successfully",
      closable: true,
    });
  };

  const { status } = useConsultants();

  // Call block user endpoint directly
  const handleBlockUser = async () => {
    try {
      if (!info?.id) throw new Error("User ID is missing");
      await blockUser({ userId: info.id, reason: "Blocked from profile menu" }).unwrap();
      toaster.create({
        title: "User blocked",
        type: "success",
        description: `${info?.fullName ?? "User"} has been blocked successfully`,
        closable: true,
      });
        // dispatch(setBlockedConsultant({ id, isBlocked: showblockPage }));
    } catch (err: any) {
      toaster.create({
        title: "Block failed",
        type: "error",
        description: err?.data?.message || err?.message || "Unable to block user",
        closable: true,
      });
    }
  };

  const openReportModal = () => {
    if (info?.id) setReportUserId(info.id);
    setReport(true);
  };

  return (
    <>
      <Box
        position="relative"
        w="full"
        borderRadius="2xl"
        boxShadow="sm"
        bg="bg_box"
        p={{ base: 3, lg: 4 }}
      >
        {/* Banner */}
        <Image
          src={info?.profileBanner}
          alt="profile banner"
          h={{ base: "150px", lg: "220px" }}
          w="full"
          borderRadius="xl"
          objectFit="cover"
        />

        {/* Content Row (Avatar + Text + Actions) */}
        <Flex
          mt={{ base: -2, lg: -10 }} // lift avatar up into banner
          pl={{ base: 2, lg: 6 }}
          pr={{ base: 2, lg: 6 }}
          align="center"
          justify="space-between"
          flexDir={{ base: "column", md: "row" }}
        >
          {/* Avatar + Text */}
          <HStack align="flex-end" spaceX={{ base: 3, lg: 6 }}>
            {/* Avatar */}
            <Box
              flexShrink={0} //
              rounded="full"
              overflow="hidden"
              border="3px solid"
              borderColor="white"
              boxSize={{
                base: "80px",
                sm: "140px",
                md: "160px",
                lg: "180px",
              }}
            >
              <Avatar.Root
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                }}
              >
                <Avatar.Fallback>{info?.fullName}</Avatar.Fallback>
                <Avatar.Image
                  src={info?.profilePics}
                  // alt={info?.fullName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Avatar.Root>
            </Box>
            {/* Texts */}
            <VStack align="flex-start" maxW="lg">
              <HStack>
                <Text
                  fontSize={{ base: "lg", lg: "2xl" }}
                  fontWeight="600"
                  pt="6"
                  lineHeight={"0"}
                  color="text_primary"
                >
                  {info?.fullName}
                </Text>
                {info?.isVerified && checkmarkSrc && (
                  <Box
                    display={{ base: "hidden", lg: "block" }}
                    color="yellow.500"
                    fontSize={"1rem"}
                  >
                    <RiVerifiedBadgeFill />
                  </Box>
                )}
              </HStack>
              <Text
                fontSize={{ base: "sm", lg: "md" }}
                // pt="1"
                lineHeight={"-3"}
                color="gray.500"
              >
                {info?.occupation}
              </Text>

              <Text
                fontSize={{ base: "sm", lg: "md" }}
                color="gray.500"
                lineClamp={"2"}
                truncate="true"
              >
                {info?.bio}
              </Text>
              <Flex gap={3} alignItems="center" w="full" pb="2">
                <Flex alignItems="center">
                  <Image
                    src="/icons/locations.svg"
                    alt="Location Icon"
                    boxSize={{ base: 3, lg: "4" }}
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
                    boxSize={{ base: 3, lg: "4" }}
                  />
                  <Text
                    fontSize={{ base: "10px", lg: "12px" }}
                    color="text_primary"
                  >
                    {info?.dateOfBirth
                      ? format(new Date(info.dateOfBirth), "do, MMM yyyy")
                      : ""}
                  </Text>
                </Flex>
              </Flex>
            </VStack>
          </HStack>

          {/* Actions */}
          <Stack
            // mt={{ base: 4, md: 0 }}
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
            h="full"
          >
            {editable ? (
              <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
                {<BiSolidEditAlt />}
              </Button>
            ) : (
              <HStack
                spaceX={2}
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
                h="full"
              >
                <Button size="sm" variant="outline">
                  <Image alt="notif" src="/icons/notif.svg" />
                </Button>
                {/* <Button size="sm" variant="outline">
                  <Image alt="upload" src="/icons/upload.svg" />
                </Button> */}
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
                          color="text_primary"
                          fontSize="1rem"
                          onClick={() => {
                            handleCopyLink();
                          }}
                          py="2"
                        >
                          <Menu.ItemCommand>
                            {" "}
                            <Image alt="link Icon" src="/icons/link.svg" />
                          </Menu.ItemCommand>{" "}
                          Copy link to profile
                        </Menu.Item>
                        {/* <Menu.Item
                            value="export-a"
                            _hover={{ bg: "primary." }}
                            roundedTop={"6px"}
                            color="text_primary"
                            fontSize="1rem"
                            py="2"
                            onClick={() => { }}
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
                          value="export-b"
                          _hover={{ bg: "primary." }}
                          roundedTop={"6px"}
                          color="text_primary"
                          fontSize="1rem"
                          py="2"
                          onClick={()=>{setBlock(true)}}
                        >
                          <Menu.ItemCommand>
                            {" "}
                            <Image
                              // onClick={open}
                              alt="link Icon"
                              src="/icons/block.svg"
                            />
                          </Menu.ItemCommand>{" "}
                          Block {info?.fullName}
                        </Menu.Item>
                        <Menu.Item
                          value="export-c"
                          _hover={{ bg: "primary." }}
                          roundedTop={"6px"}
                          color="text_primary"
                          fontSize="1rem"
                          py="2"
                          onClick={openReportModal}
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
          </Stack>
        </Flex>
      </Box>

      <EditConsultDrawer
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      />
      <BlockConsultant
        isOpen={block}
        checkmarkSrc={checkmarkSrc}
        data={info}
        onOpenChange={() => {
          setBlock(false);
        }}
      />
      <ReportUser
      // postId={""}
      userId={reportUserId || info?.id || ""}
        isOpen={report}
        // checkmarkSrc={checkmarkSrc}
        // data={info}
        onOpenChange={() => {
          setReport(false);
        }}
      />
    </>
  );
};

export default EditConsultantProfileCard;
