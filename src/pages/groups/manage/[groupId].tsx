import { Box, Flex, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import NewsItem from "mangarine/components/ui-components/newsitem";
import { isEmpty } from "es-toolkit/compat";
import { Post } from "mangarine/state/reducers/post.reducer";
import { useGetMyPostsInGroupQuery } from "mangarine/state/services/posts.service";
import CustomSelect from "mangarine/components/customcomponents/select";
import ManageContent from "mangarine/components/ui-components/managecontent";
import { GroupCommentItem } from "mangarine/components/ui-components/groupcommentitem";
import CreatePost from "mangarine/components/ui-components/createpost";
import { useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import AppLayout from "mangarine/layouts/AppLayout";
import Rules from "mangarine/components/ui-components/rules";
import TrendingCommunities from "mangarine/components/ui-components/trendingcommunities";

const ManageGroup = () => {
    const router = useRouter()
    const { query } = router;
    const { groupId } = query;
    const groupIdStr = groupId != null ? String(groupId) : "";
    const selecType = [
        { id: "1", value: "everyone", label: "everyone" },
        { id: "2", value: "followers", label: "followers" },
    ];
    const [select,] = useState<string[]>([]);
    const [isContentEMpty, setIsContentEmpty] = useState<boolean>(false);

    const closePost = () => {
        setOpenPost(false);
        setIsContentEmpty(true);
    };
    const [openPost, setOpenPost] = useState<boolean>(false);

    // Fetch current user's posts in this group
    const { data: myPostsResp, isLoading: loadingMyPosts, refetch } = useGetMyPostsInGroupQuery(
        { groupId: groupIdStr, page: 1, limit: 20 },
        { skip: !groupIdStr }
    );
    // Normalize response structure
    const myPosts: Post[] = ((): Post[] => {
        const d: any = myPostsResp;
        if (!d) return [];
        if (Array.isArray(d.data)) return d.data as Post[];
        if (d.data?.data && Array.isArray(d.data.data)) return d.data.data as Post[];
        return [];
    })();
    return (
        <AppLayout>
            <Box
                display={"flex"}
                // bg="red.900"
                flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
                // alignItems={"center"}
                // my="12px"
                justifyContent={"space-between"}
                gap={3}
                w={{ base: "98%", md: "96%", lg: "100%", xl: "full" }}
                mx="auto"
                overflowY={"auto"}
                spaceY={{ base: "4", md: "0" }}
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
                <VStack w={'75%'}
                    p={4}
                    bg="bg_box"
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
                    overflowX="hidden" mr="4">
                    <Flex direction="column" w="full" alignItems={"flex-start"}>
                        <Flex align="center" mb={2}>
                            {/* <Image src="/images/go-back.png" alt="left arrow" boxSize="24px" mr={2} /> */}
                            <Stack
                                h="8"
                                w="8"
                                bg="bg_box"
                                cursor="pointer"
                                rounded={"full"}
                                borderWidth={"0.5"}
                                borderColor={"grey.300"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                onClick={() => {
                                    router.back()
                                }}
                                mr="4"
                            >
                                <Text
                                    // fontWeight="600"
                                    // fontSize="1.5rem"
                                    font="outfit"
                                    color="text_primary"
                                // lineHeight="36px"
                                >
                                    <IoChevronBackOutline />
                                </Text>
                            </Stack>
                            <Text
                                fontWeight="600"
                                fontSize="1.5rem"
                                font="outfit"
                                color="text_primary"
                                lineHeight="36px"
                            >
                                Manage Your Content
                            </Text>
                        </Flex>

                        <Text
                            fontWeight="400"
                            fontSize="1.2rem"
                            font="outfit"
                            lineHeight="24px"
                            color="grey.500"
                            ml={8}
                            mb={8}
                        >
                            View and manage your posts in the community
                        </Text>
                    </Flex>
                    <HStack
                        w="full"
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Text fontSize="1.25rem" fontWeight={"400"} color="grey.300">
                            {loadingMyPosts ? "Loading..." : `${myPosts?.length || 0} posts published`}
                        </Text>
                        <Box bg="main_background">
                            <CustomSelect
                                id={"whoareyou"}
                                placeholder="Recent Post"
                                name={"who are you"}
                                size="md"
                                options={selecType}
                                label=""
                                value={select}
                                required={false}
                                // error={errors.userType}
                                onChange={() => {
                                }}
                            />
                        </Box>
                    </HStack>


                    {/* My Posts in this Group */}
                    <Stack spaceY={4} bg="bg_box" w="full" py="4" rounded={"xl"} px="0">
                        {loadingMyPosts ? (
                            <Text color="grey.500">Loading your posts…</Text>
                        ) : isEmpty(myPosts) ? (
                            <ManageContent
                                onClick={() => {
                                    setOpenPost(true);
                                }}
                            />
                        ) : (
                            myPosts.map((post: Post) => (
                                <Stack key={post.id} px="0">
                                    <NewsItem post={post} />
                                </Stack>
                            ))
                        )}
                    </Stack>
                    <CreatePost
                        action={closePost}
                        open={openPost}
                        onOpenChange={() => {
                            setOpenPost(false);
                        }}
                        onCreated={() => {
                            try { refetch(); } catch {}
                            setOpenPost(false);
                        }}
                    />
                </VStack>

                <VStack w={'25%'} gap={2}>
                    {/* <Rules rules={""} /> */}
                    <TrendingCommunities />
                </VStack>
            </Box>

        </AppLayout>
    );

};

export default ManageGroup
