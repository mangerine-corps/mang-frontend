"use client";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Menu,
  Portal,
  SkeletonCircle,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import NewsItem from "mangarine/components/ui-components/newsitem";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Post } from "mangarine/state/reducers/post.reducer";
import { isEmpty } from "es-toolkit/compat";
import CommentInputWrapper from "mangarine/components/ui-components/commentinputwrapper";
import CommentSection from "mangarine/components/ui-components/commentsection";
import { IoEllipsisVerticalOutline } from "react-icons/io5";
import FeedInput from "mangarine/components/ui-components/feedinput";
import ReportGroup from "mangarine/components/ui-components/groups/reportgroup";
import InviteFriend from "mangarine/components/ui-components/groups/invitefriend";
import MemberList from "mangarine/components/ui-components/groups/memberlist";
import Leavegroup from "mangarine/components/ui-components/groups/leavegroup";
import AppLayout from "mangarine/layouts/AppLayout";
import Rules from "mangarine/components/ui-components/rules";
import TrendingCommunities from "mangarine/components/ui-components/trendingcommunities";
import {
  useGetCommunityPostMutation,
  useGetCommunityQuery,
  useJoinOrLeaveCommunityMutation,
  usePinCommunityMutation,
  useDeleteCommunityMutation,
} from "mangarine/state/services/community.service";
import { useDispatch } from "react-redux";
import { setAll } from "mangarine/state/reducers/community.reducer";
import { useCommunity } from "mangarine/state/hooks/communities.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
import DeleteGroup from "mangarine/components/ui-components/groups/deletegroup";
import { TbTrash } from "react-icons/tb";
import { toaster } from "mangarine/components/ui/toaster";
import { usePathname } from "next/navigation";
import { useCopyToClipboard } from "react-use";

const SingleGroup = ({}) => {
  const router = useRouter();
  const { query } = router;
  const { groupId } = query;
  const [joinOrLeaveCommunity, { isLoading }] =
    useJoinOrLeaveCommunityMutation();
  const [report, setReport] = useState<boolean>(false);
  const [invite, setInvite] = useState<boolean>(false);
  const [member, setMember] = useState<boolean>(false);
  const [leave, setLeave] = useState<boolean>(false);
  const [selected, setSelected] = useState<any>(null);
  // const [post,] = useState<Post>(null);
  const [grpPost, setGrpPost] = useState([]);
  const [pinCommunity, { error: pinError, data: pinData }] =
    usePinCommunityMutation();
  const groupIdStr = groupId != null ? String(groupId) : "";
  const dispatch = useDispatch();
  const { all } = useCommunity();
  const { user } = useAuth();
  const [, copyToClipboard] = useCopyToClipboard();
  const [deleteCommunity, { isLoading: deleting }] =
    useDeleteCommunityMutation();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { data } = useGetCommunityQuery({
    id: groupIdStr,
  });
  useEffect(() => {}, [data, query]);

  const grp = data?.data;

  const rulesHtml = grp?.rules;

  const filterBy = [
    {
      id: 1,
      title: "All Posts",
    },
    {
      id: 2,
      title: "Latest Posts",
    },
    {
      id: 3,
      title: "Recommended Posts",
    },
  ];

  const [getCommunityPost, { data: postData, isLoading: loading, error }] =
    useGetCommunityPostMutation();
  const pathname = usePathname();
  const profileUrl = ` ${process.env.APP_URL}${pathname}`;
  useEffect(() => {
    if (!groupIdStr) {
      console.error("groupIdStr is missing or invalid");
      return;
    }
    const formData = {
      page: 1,
      limit: 10,
      groupId: groupIdStr,
    };
    getCommunityPost(formData)
      .then((response) => {
        const { data } = response;
        const { posts } = data.data;
        setGrpPost(posts);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, [getCommunityPost, groupIdStr]);

  // Open confirm modal for delete
  const handleDeleteGroup = () => {
    setDeleteOpen(true);
  };

  // Confirm delete action
  const confirmDeleteGroup = () => {
    if (!grp?.id) return;
    deleteCommunity(grp.id)
      .unwrap()
      .then(() => {
        const remaining = (all || []).filter((g) => g.id !== grp.id);
        dispatch(setAll(remaining));
        setDeleteOpen(false);
        router.push("/groups");
      })
      .catch((err) => {
        console.error("Failed to delete group", err);
        setDeleteOpen(false);
      });
  };
  const handleLeave = (item) => {
    setLeave(true);
    setSelected(item);
  };
  const handleReport = (item) => {
    setReport(true);
    setSelected(item);
  };
  const pinGroup = () => {
    pinCommunity(grp?.id)
      .unwrap()
      .then((res) => {
        toaster.create({
          type:"success",
          title:res.message,
          closable:true
        })
        // console.log(res);
      })
      .catch((err) => {
         toaster.create({
           type: "error",
           title: err.message,
           closable: true,
         });
        // console.log(err);
      });
  };

  console.log(selected, "selectedGroup");
  const showMembr = (item) => {
    setMember(true);
    setSelected(item);
  };
  const handleEdit = (item: any) => {
    console.log(item, "id");
    const id = item?.id || grp?.id;
    if (!id) return;
    router.push(`/groups/create?editId=${id}`);
  };
  const handleCopyLink = () => {
    copyToClipboard(profileUrl);
    console.log(profileUrl, "url");
    toaster.create({
      title: "Success",
      type: "success",
      description: "Profile link copied successfully",
      closable: true,
    });
  };
  const handleLeaveGroup = () => {
    joinOrLeaveCommunity(grp?.id)
      .unwrap()
      .then((result) => {
        console.log(result, "response");
        const { data } = result;
        console.log(data, "leaving");
        let updateGroups = all.filter((group) => {
          if (group.id !== data.id) return group;
        });
        // setCanView(true)
        dispatch(setAll(updateGroups));
        setLeave(false);
        // Optionally update UI or state here
      })
      .catch((error) => {
        console.error("Error joining/leaving community:", error);
        toaster.create({
          type: "error",
          description: error.message,
          closable: true,
        });
        setLeave(false);
        // Optionally show an error message here
      });
  };
  // console.log(grp.users[0].profilePics, "grpPost");
  return (
    <AppLayout>
      <Box
        display={"flex"}
        h="full"
        // bg="red.900"
        flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
        // alignItems={"center"}
        my={{ base: "3", md: "0" }}
        // justifyContent={{ base: "center", md: "space-between" }}
        // gap={3}
        // my={{ base: "6", md: "0" }}
        w={{ base: "100%", md: "96%", lg: "100%", xl: "full" }}
        // mx="auto"
        // overflowY={"auto"}
        spaceY={{ base: "2", md: "0" }}
      >
        <VStack
          // mx={4}
          w={{ base: "98%", md: "75%", lg: "75%", xl: "75%" }}
          // h={{base:"full",mdToXl:"full "}}
          mx={{ base: "auto", md: "0", lg: "0" }}
          mr={{ base: "0", md: "4", lg: "3" }}
          // p={4}
          // spaceY={{base:"0",md:"12"  }}
          py={{ base: "0", md: "0" }}
          // bg="green.500"
          // flex={1}
          // bg="bg_box"
          overflowY={"auto"}
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
          rounded={"xl"}
          // overflowX={{ base: "none", md: "hidden" }}
        >
          <Stack
            // mt="8"
            px={{ base: "8", md: "24px" }}
            py="7"
            bg="bg_box"
            w="full"
            // bg="green.900"
            borderRadius="xl"
            boxShadow="xs"
          >
            <Image
              src={grp?.image}
              alt="Group Banner"
              w="full"
              h={{ base: "100px", md: "202px" }}
              borderRadius="lg"
              mb={4}
            />
            <HStack
              w="full"
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <VStack align="start" gap={2} mb={4}>
                <Text
                  fontWeight="600"
                  fontSize="1.2rem"
                  font="outfit"
                  color="text_primary"
                  lineHeight="24px"
                >
                  {grp?.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {grp?.category}
                </Text>
                <Text
                  fontWeight="400"
                  fontSize="1rem"
                  font="outfit"
                  // lineHeight="36px"
                  color="grey.600"
                >
                  {grp?.description}
                </Text>
              </VStack>
              {user?.id === grp?.creator?.id && (
                <Button
                  bg="button_bg"
                  size="md"
                  px="4"
                  onClick={() => {
                    handleEdit(grp);
                  }}
                >
                  Edit
                </Button>
              )}
            </HStack>

            {/* Members and Privacy */}
            <HStack
              w="full"
              justifyContent={{ base: "flex-start", lg: "space-between" }}
              alignItems={"center"}
            >
              <HStack gap={3} mb={4}>
                {!grp?.users ? (
                  <HStack spaceX="-3">
                    {[1, 2, 3, 4].map((i) => (
                      <SkeletonCircle key={i} size="10" />
                    ))}
                  </HStack>
                ) : (
                  <AvatarGroup
                    gap="0"
                    spaceX="-3"
                    size={{ base: "xs", md: "lg" }}
                  >
                    {grp?.users.slice(0, 4).map((user, index) => (
                      <Avatar.Root key={index}>
                        <Avatar.Fallback name={user?.fullName || "?"} />
                        <Avatar.Image
                          src={user?.profilePics || "/default-avatar.png"}
                        />
                      </Avatar.Root>
                    ))}
                  </AvatarGroup>
                )}

                <Text
                  fontSize="sm"
                  color="gray.700"
                  cursor={"pointer"}
                  onClick={() => {
                    showMembr(grp);
                  }}
                >
                  {grp?.memberCount || 0} members
                </Text>
                <Badge colorScheme="gray" fontSize="xs">
                  {" "}
                  ||
                  <Image src="/icons/location.svg" alt="" />
                  {grp?.isPrivate === true ? "Private" : "Public"}
                </Badge>
              </HStack>
              <HStack spaceX="2" display={{ base: "none", md: "flex" }}>
                {/* <Box
                  border={0.5}
                  rounded={4}
                  py={2}
                  px="2"
                  onClick={() => {
                    //   setOpen(true);
                  }}
                  borderColor={"grey.300"}
                  shadow={"md"}
                >
                  <Image
                    // onClick={open}
                    alt="bell Icon"
                    src="/icons/notif.svg"
                  />
                </Box> */}
                <Box
                  border={0.5}
                  rounded={4}
                  py={2}
                  px="2"
                  cursor="pointer"
                  onClick={() => {
                    //   setOpen(true);
                  }}
                  borderColor={"grey.300"}
                  shadow={"md"}
                >
                  <Image
                    onClick={() => {
                      handleCopyLink();
                    }}
                    alt="upload Icon"
                    src="/icons/upload.svg"
                  />
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
                        {/* <Menu.Item
                          value="invite"
                          _hover={{ bg: "primary." }}
                          roundedTop={"6px"}
                          color="text_primary"
                          fontSize="1rem"
                          onClick={() => {
                            setInvite(true);
                          }}
                          py="2"
                        >
                          <Menu.ItemCommand>
                            {" "}
                            <Image
                              // onClick={open}
                              alt="link Icon"
                              src="/icons/invite.svg"
                            />
                          </Menu.ItemCommand>{" "}
                          Invite
                        </Menu.Item> */}
                        {user?.id === grp?.creator?.id && (
                          <Menu.Item
                            value="manage"
                            _hover={{ bg: "primary." }}
                            roundedTop={"6px"}
                            color="text_primary"
                            fontSize="1rem"
                            py="2"
                            onClick={() =>
                              router.push(`/groups/manage/${grp?.id}`)
                            }
                          >
                            <Menu.ItemCommand>
                              {" "}
                              <Image
                                // onClick={open}
                                alt="link Icon"
                                src="/icons/manage.svg"
                              />
                            </Menu.ItemCommand>{" "}
                            Manage your content
                          </Menu.Item>
                        )}

                        <Menu.Item
                          value="pin"
                          _hover={{ bg: "primary." }}
                          roundedTop={"6px"}
                          color="text_primary"
                          fontSize="1rem"
                          py="2"
                          onClick={pinGroup}
                        >
                          <Menu.ItemCommand>
                            {" "}
                            <Image
                              // onClick={open}
                              alt="link Icon"
                              src="/icons/pin.svg"
                            />
                          </Menu.ItemCommand>{" "}
                          Pin Group
                        </Menu.Item>
                        <Menu.Item
                          value="report"
                          _hover={{ bg: "primary." }}
                          roundedTop={"6px"}
                          color="text_primary"
                          fontSize="1rem"
                          py="2"
                          onClick={() => {
                            handleReport(grp);
                          }}
                        >
                          <Menu.ItemCommand>
                            {" "}
                            <Image
                              // onClick={open}
                              alt="link Icon"
                              src="/icons/report.svg"
                            />
                          </Menu.ItemCommand>{" "}
                          Report Group
                        </Menu.Item>
                        {user?.id !== grp?.creator?.id && (
                          <Menu.Item
                            value="leave"
                            _hover={{ bg: "primary." }}
                            roundedTop={"6px"}
                            color="text_primary"
                            fontSize="1rem"
                            py="2"
                            onClick={() => {
                              handleLeave(grp);
                            }}
                          >
                            <Menu.ItemCommand>
                              {" "}
                              <Image
                                // onClick={open}
                                alt="link Icon"
                                src="/icons/leave.svg"
                              />
                            </Menu.ItemCommand>{" "}
                            Leave Group
                          </Menu.Item>
                        )}
                        {user?.id === grp?.creator?.id && (
                          <Menu.Item
                            value="delete"
                            _hover={{ bg: "primary." }}
                            color="red.500"
                            fontSize="1rem"
                            py="2"
                            onClick={handleDeleteGroup}
                          >
                            <Menu.ItemCommand>
                              <Icon color="red.500" size="lg">
                                <TbTrash />
                              </Icon>
                            </Menu.ItemCommand>
                            Delete Group
                          </Menu.Item>
                        )}
                      </Menu.Content>
                    </Menu.Positioner>
                  </Portal>
                </Menu.Root>
              </HStack>
            </HStack>
          </Stack>
          <FeedInput
            onCreated={(post) => {
              // Prepend the newly created post to the group's posts list
              setGrpPost((prev) => [
                post,
                ...(Array.isArray(prev) ? prev : []),
              ]);
            }}
          />
          <HStack
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
            w={{ base: "98%", md: "full" }}
            overflowX={{ base: "scroll", md: "clip" }}
            pb="4"
          >
            {filterBy.map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant="outline"
                borderRadius="6px"
                border="1px solid #999"
                colorScheme="gray"
                px={{ base: "2", md: "6" }}
                // py="4"
                // w="auto"
                // h="48px"
                justifyContent="center"
                alignItems="center"
                display="flex"
                // minW="unset"
              >
                {item.title}
              </Button>
            ))}
          </HStack>

          <Stack
            spaceY={4}
            bg="bg_box"
            w="full"
            py="8"
            mb="12"
            rounded={"xl"}
            px="3"
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
            mx={4}
          >
            {!isEmpty(grpPost) ? (
              grpPost.map(
                (post: Post) =>
                  post && (
                    <Stack key={post.id} px="3">
                      <NewsItem key={post?.id} post={post} />
                      <CommentInputWrapper postId={post?.id} />
                      {!isEmpty(post) && <CommentSection post={post} />}
                    </Stack>
                  )
              )
            ) : (
              <Text
                justifyContent={"center"}
                alignItems={"center"}
                textAlign={"center"}
              >
                Be The first to post a comment in the group
              </Text>
            )}
          </Stack>
        </VStack>

        <VStack
          w={{ base: "98%", md: "30%", lg: "25%" }}
          gap={2}
          h="full"
          mx={{ base: "auto", md: "0", lg: "0" }}
        >
          <Rules rules={rulesHtml} />
          <TrendingCommunities />
        </VStack>
        <ReportGroup
          isOpen={report}
          onOpenChange={() => setReport(false)}
          data={selected}
        />
        <InviteFriend open={invite} onOpenChange={() => setInvite(false)} />
        <MemberList
          open={member}
          data={selected}
          onOpenChange={() => setMember(false)}
        />
        <Leavegroup
          isOpen={leave}
          data={selected}
          onOpenChange={handleLeaveGroup}
        />
        <DeleteGroup
          isOpen={deleteOpen}
          onOpenChange={() => setDeleteOpen(false)}
          onConfirm={confirmDeleteGroup}
          data={grp}
        />
      </Box>
    </AppLayout>
  );
};

export default SingleGroup;
