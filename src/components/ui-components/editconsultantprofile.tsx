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
  const businessLabel =
    info?.businessName?.trim?.() || info?.occupation?.trim?.();
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
        overflow="hidden"
      >
        {/* Cover photo / grey fallback */}
        <Box position="relative" h={{ base: "130px", lg: "180px" }} w="full">
          {info?.profileBanner ? (
            <Image
              src={info.profileBanner}
              alt="profile banner"
              h="full"
              w="full"
              objectFit="cover"
            />
          ) : (
            <Box h="full" w="full" bg="gray.200" />
          )}

          {/* Actions — top-right of cover */}
          <Box position="absolute" top={3} right={3}>
            {editable ? (
              <Button
                variant="outline"
                size="sm"
                bg="bg_box"
                borderColor="#B5B9C7"
                onClick={() => setOpen(true)}
              >
                <BiSolidEditAlt />
              </Button>
            ) : (
              <HStack spaceX={2}>
                <Button size="sm" variant="outline" bg="bg_box" borderColor="#B5B9C7">
                  <Image alt="notif" src="/icons/notif.svg" />
                </Button>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button variant="outline" size="sm" bg="bg_box" borderColor="#B5B9C7" shadow="md">
                      <Stack justifyContent="center" alignItems="center" aria-label="Options">
                        <IoEllipsisVerticalOutline size={6} color="grey.300" />
                      </Stack>
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner>
                      <Menu.Content px="3" py="3" spaceY="2">
                        <Menu.Item
                          value="export-a"
                          _hover={{ bg: "primary." }}
                          roundedTop="6px"
                          color="text_primary"
                          fontSize="1rem"
                          onClick={handleCopyLink}
                          py="2"
                        >
                          <Menu.ItemCommand>
                            <Image alt="link Icon" src="/icons/link.svg" />
                          </Menu.ItemCommand>
                          Copy link to profile
                        </Menu.Item>
                        <Menu.Item
                          value="export-b"
                          _hover={{ bg: "primary." }}
                          roundedTop="6px"
                          color="text_primary"
                          fontSize="1rem"
                          py="2"
                          onClick={() => setBlock(true)}
                        >
                          <Menu.ItemCommand>
                            <Image alt="link Icon" src="/icons/block.svg" />
                          </Menu.ItemCommand>
                          Block {info?.fullName}
                        </Menu.Item>
                        <Menu.Item
                          value="export-c"
                          _hover={{ bg: "primary." }}
                          roundedTop="6px"
                          color="text_primary"
                          fontSize="1rem"
                          py="2"
                          onClick={openReportModal}
                        >
                          <Menu.ItemCommand>
                            <Image alt="link Icon" src="/icons/report.svg" />
                          </Menu.ItemCommand>
                          Report {info?.fullName}
                        </Menu.Item>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </HStack>
            )}
          </Box>
        </Box>

        {/* Avatar + Info row */}
        <HStack px={{ base: 4, lg: 6 }} align="flex-end" gap={4} pb={4}>
          {/* Avatar — half overlapping cover */}
          <Box
            mt={{ base: "-20px", lg: "-28px" }}
            flexShrink={0}
            rounded="full"
            border="3px solid"
            borderColor="#B5B9C7"
            bg="bg_box"
            overflow="hidden"
            boxSize={{ base: "80px", lg: "112px" }}
          >
            <Avatar.Root style={{ width: "100%", height: "100%", borderRadius: "50%" }}>
              <Avatar.Fallback>{info?.fullName}</Avatar.Fallback>
              <Avatar.Image
                src={info?.profilePics}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Avatar.Root>
          </Box>

          {/* Name / business name / location */}
          <VStack align="flex-start" gap={0.5} pb={1} flex={1} minW={0}>
            <Text fontSize={{ base: "md", lg: "lg" }} fontWeight="700" color="text_primary" fontFamily="Outfit" lineClamp={1}>
              {info?.fullName}
            </Text>

            {businessLabel && (
              <Text fontSize={{ base: "0.78rem", lg: "0.85rem" }} color="grey.500" fontFamily="Outfit" lineClamp={1}>
                {businessLabel}
              </Text>
            )}

            {info?.location && (
              <HStack gap={1} mt={0.5}>
                <Image src="/icons/locations.svg" alt="Location" boxSize="13px" />
                <Text fontSize={{ base: "0.72rem", lg: "0.78rem" }} color="text_primary" fontFamily="Outfit">
                  {info.location}
                </Text>
              </HStack>
            )}
          </VStack>
        </HStack>
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
