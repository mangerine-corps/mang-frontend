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
import { useState } from "react";
import EditConsultDrawer from "./editconsultantprofiledrawer";
import { BiSolidEditAlt } from "react-icons/bi";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import {
  FacebookShareButton, FacebookIcon,
  WhatsappShareButton, WhatsappIcon,
  TwitterShareButton, TwitterIcon,
} from "react-share";
import { MdNotifications } from "react-icons/md";
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
import { safeProfilePic, getBannerGradient } from "mangarine/lib/constants";
import ConsultantNotificationModal from "./modals/consultantnotificationmodal";

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
    info?.businessName?.trim?.() ||
    info?.title?.trim?.() ||
    info?.profession?.trim?.() ||
    info?.occupation?.trim?.();
  const route = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [report, setReport] = useState(false);
  const [block, setBlock] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationPreference, setNotificationPreference] = useState<
    "all-updates" | "new-posts" | "new-group-consultation" | ""
  >("");
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

  const formattedDob = (() => {
    try {
      return info?.dateOfBirth ? `Born ${format(new Date(info.dateOfBirth), "d MMMM")}` : null;
    } catch {
      return null;
    }
  })();

  return (
    <>
      <Box
        w="full"
        borderRadius="2xl"
        boxShadow="sm"
        bg="bg_box"
        overflow="hidden"
      >
        {/* Cover photo / grey fallback */}
        <Box h={{ base: "130px", lg: "180px" }} w="full">
          {info?.profileBanner ? (
            <Image
              src={info.profileBanner}
              alt="profile banner"
              h="full"
              w="full"
              objectFit="cover"
            />
          ) : (
            <Box
              h="full"
              w="full"
              style={{ background: getBannerGradient(info?.id || info?.fullName) }}
            />
          )}
        </Box>

        {/* Avatar + actions row */}
        <Flex px={{ base: 4, lg: 6 }} justify="space-between" align="flex-end" mb={2}>
          <Box
            mt={{ base: "-44px", lg: "-64px" }}
            flexShrink={0}
            rounded="full"
            border="3px solid"
            borderColor="#B5B9C7"
            bg="bg_box"
            overflow="hidden"
            boxSize={{ base: "88px", lg: "148px" }}
          >
            <Avatar.Root style={{ width: "100%", height: "100%", borderRadius: "50%" }}>
              <Avatar.Fallback>{info?.fullName}</Avatar.Fallback>
              <Avatar.Image
                src={safeProfilePic(info?.profilePics)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Avatar.Root>
          </Box>

          {/* Actions */}
          <HStack gap={2} pb={1}>
            {editable ? (
              <Button
                variant="outline"
                size="sm"
                h="32px"
                px={3}
                bg="bg_box"
                borderColor="#B5B9C7"
                onClick={() => setOpen(true)}
              >
                <BiSolidEditAlt />
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  h="32px"
                  px={2}
                  variant="plain"
                  bg="bg_box"
                  boxShadow="0px 0px 8px 0px #0000001A"
                  onClick={() => setNotificationOpen(true)}
                >
                  <Image src="/icons/notification-bell.svg" alt="Notifications" boxSize="18px" />
                </Button>
                <Menu.Root positioning={{ placement: "bottom-end" }}>
                  <Menu.Trigger asChild>
                    <Button size="sm" h="32px" px={2} variant="plain" bg="bg_box" boxShadow="0px 0px 8px 0px #0000001A">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                    </Button>
                  </Menu.Trigger>
                  <Portal>
                    <Menu.Positioner zIndex="max">
                      <Menu.Content
                        bg="bg_box"
                        borderWidth="1px"
                        borderColor="border_background"
                        rounded="2xl"
                        boxShadow="0 8px 32px rgba(0,0,0,0.12)"
                        p={{ base: 3, sm: 4 }}
                        w={{ base: "calc(100vw - 32px)", sm: "320px" }}
                        maxW="calc(100vw - 32px)"
                      >
                        <Text fontFamily="Outfit" fontWeight="600" fontSize="0.95rem" color="text_primary" mb={4} textAlign="center">
                          Share profile
                        </Text>
                        <Flex justify="center" gap={{ base: 4, sm: 6 }} mb={5} wrap="wrap">
                          <FacebookShareButton url={`${typeof window !== "undefined" ? window.location.origin : ""}/profile/${info?.id}`}>
                            <VStack gap={1} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.15s">
                              <FacebookIcon size={44} round />
                              <Text fontFamily="Outfit" fontSize="0.68rem" color="text_primary" fontWeight="500">Facebook</Text>
                            </VStack>
                          </FacebookShareButton>
                          <WhatsappShareButton url={`${typeof window !== "undefined" ? window.location.origin : ""}/profile/${info?.id}`} title={`${info?.fullName} on Mangerine`}>
                            <VStack gap={1} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.15s">
                              <WhatsappIcon size={44} round />
                              <Text fontFamily="Outfit" fontSize="0.68rem" color="text_primary" fontWeight="500">WhatsApp</Text>
                            </VStack>
                          </WhatsappShareButton>
                          <TwitterShareButton url={`${typeof window !== "undefined" ? window.location.origin : ""}/profile/${info?.id}`} title={`${info?.fullName} on Mangerine`}>
                            <VStack gap={1} cursor="pointer" _hover={{ opacity: 0.8 }} transition="opacity 0.15s">
                              <TwitterIcon size={44} round />
                              <Text fontFamily="Outfit" fontSize="0.68rem" color="text_primary" fontWeight="500">Twitter</Text>
                            </VStack>
                          </TwitterShareButton>
                        </Flex>
                        <Box borderWidth="1px" borderColor="border_background" rounded="xl" px={3} py={2} bg="main_background">
                          <Flex gap={2} direction={{ base: "column", sm: "row" }} align={{ base: "stretch", sm: "center" }}>
                            <Text flex={1} fontFamily="Outfit" fontSize="0.78rem" color="text_primary" wordBreak="break-all" opacity={0.7}>
                              {typeof window !== "undefined" ? `${window.location.origin}/profile/${info?.id}` : `/profile/${info?.id}`}
                            </Text>
                            <Button
                              size="xs" bg="#111D4A" color="white" borderRadius="8px"
                              fontFamily="Outfit" fontWeight="600" fontSize="0.75rem" px={3} flexShrink={0}
                              w={{ base: "full", sm: "auto" }}
                              _hover={{ bg: "#0D173B" }}
                              onClick={handleCopyLink}
                            >
                              Copy
                            </Button>
                          </Flex>
                        </Box>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button variant="plain" size="sm" h="32px" px={2} bg="bg_box" boxShadow="0px 0px 8px 0px #0000001A">
                      <IoEllipsisVerticalOutline size={16} />
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
                          fontSize="0.875rem"
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
                          fontSize="0.875rem"
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
                          fontSize="0.875rem"
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
              </>
            )}
          </HStack>
        </Flex>

        {/* Name / title / bio / location / dob — full width */}
        <VStack align="flex-start" gap={0.5} px={{ base: 4, lg: 6 }} pb={4}>
          <HStack gap={1} minW={0} w="full">
            <Text
              fontSize={{ base: "md", lg: "lg" }}
              fontWeight="700"
              color="text_primary"
              fontFamily="Outfit"
              lineClamp={1}
            >
              {info?.fullName}
            </Text>
            {info?.isConsultant && info?.isVerified && (
              <Box color="#F5A623" flexShrink={0}>
                <RiVerifiedBadgeFill size={16} />
              </Box>
            )}
          </HStack>

          {businessLabel && (
            <Text fontSize={{ base: "0.78rem", lg: "0.85rem" }} color="grey.500" fontFamily="Outfit" lineClamp={1}>
              {businessLabel}
            </Text>
          )}

          {info?.bio && (
            <Text fontSize={{ base: "0.78rem", lg: "0.82rem" }} color="text_primary" fontFamily="Outfit" lineClamp={2} mt={0.5}>
              {info.bio}
            </Text>
          )}

          {(info?.location || formattedDob) && (
            <HStack gap={3} mt={0.5} flexWrap="wrap">
              {info?.location && (
                <HStack gap={1}>
                  <Image src="/icons/locations.svg" alt="Location" boxSize="13px" />
                  <Text fontSize={{ base: "0.72rem", lg: "0.78rem" }} color="text_primary" fontFamily="Outfit">
                    {info.location}
                  </Text>
                </HStack>
              )}
              {formattedDob && (
                <HStack gap={1}>
                  <Image src="/icons/dob.svg" alt="DOB" boxSize="13px" />
                  <Text fontSize={{ base: "0.72rem", lg: "0.78rem" }} color="text_primary" fontFamily="Outfit">
                    {formattedDob}
                  </Text>
                </HStack>
              )}
            </HStack>
          )}
        </VStack>
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
      <ConsultantNotificationModal
        isOpen={notificationOpen}
        value={notificationPreference}
        onSave={setNotificationPreference}
        onOpenChange={() => {
          setNotificationOpen(false);
        }}
      />
    </>
  );
};

export default EditConsultantProfileCard;
