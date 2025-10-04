import { Box, Button, HStack, VStack, Stack, Skeleton, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import JoinGroup from "./joingroup";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useCommunity } from "mangarine/state/hooks/communities.hook";
import { useGetAllCommunitiesMutation } from "mangarine/state/services/community.service";
import { setAll } from "mangarine/state/reducers/community.reducer";
import { useAuth } from "mangarine/state/hooks/user.hook";
import GroupItem from "./groups/groupItem";
import { set } from "date-fns";
import { isEmpty, size } from "es-toolkit/compat";
type props = {
  onClickPost: any;
};

const GroupComponent = ({ onClickPost }: props) => {
  const dispatch = useDispatch();
  const { all } = useCommunity();
  const allList = Array.isArray(all) ? all : [];
  const { user } = useAuth();
  const [filterResult, setFilterResult] = useState<any>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [
    getAllCommunities,
    { data: allGroups, error: allGroupsError, isLoading: allGroupsIsLoading },
  ] = useGetAllCommunitiesMutation();

  useEffect(() => {
    getAllCommunities({ page, limit, category: selectedCategory })
      .unwrap()
      .then((payload) => {
        const { data } = payload as any;
        console.log(data, "data")
        const list = Array.isArray(data) ? data : (data?.result ?? []);
        dispatch(setAll(list));
        setFilterResult(list);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  }, [dispatch, getAllCommunities, user, page, limit, selectedCategory]);

  useEffect(() => {
    setFilterResult(allList);
  }, [allList]);

  // Derive a readable category label from API data (defensive)
  const getCategoryLabel = (group: any): string => {
    // Supports: categoryName, category.name, category string, or category object with label
    const raw =
      group?.categoryName ??
      group?.category?.name ??
      group?.category?.label ??
      group?.category;
    if (typeof raw === 'string') return raw.trim();
    return '';
  };

  // Unique categories present in the fetched groups (case-insensitive, trimmed)
  const groupCategory = (() => {
    const labels = (Array.isArray(allList) ? allList : [])
      .map((g) => getCategoryLabel(g))
      .filter((label) => Boolean(label));
    const seen = new Set<string>();
    const uniq: { label: string }[] = [];
    for (const l of labels) {
      const key = l.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        uniq.push({ label: l });
      }
    }
    return uniq;
  })();

  const filterItem = (categoryLabel?: string) => {
    if (!categoryLabel || categoryLabel === 'All') {
      setSelectedCategory(undefined);
      setPage(1);
      return;
    }
    setSelectedCategory(categoryLabel);
    setPage(1);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      borderRadius="16px"
    >
      {/* Categories Scroll */}
      <HStack
        gap={2}
        // my={2}
        py="4"
        // bg="red.900"
        // p={4}
        // bg={"bg_box"}
        w="full"
        borderRadius={"10px"}
        overflowX="scroll"
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
        {size(groupCategory) > 1 && (
          <Button
            size="sm"
            variant="outline"
            borderRadius="6px"
            border="1px solid #999"
            colorScheme="gray"
            px="6"
            justifyContent="center"
            alignItems="center"
            onClick={() => {
              filterItem("All");
            }}
            display="flex"
          >
            All
          </Button>
        )}

        {Array.isArray(groupCategory) && groupCategory.map((category, index) => (
          <Button
            key={index}
            size="sm"
            variant="outline"
            borderRadius="6px"
            border="1px solid #999"
            colorScheme="gray"
            px="6"
            // py="4"
            // w="auto"
            // h="48px"
            justifyContent="center"
            alignItems="center"
            display="flex"
            onClick={() => {
              filterItem(category.label);
            }}
            // minW="unset"
          >
            <HStack>{category.label || "Uncategorized"}</HStack>
          </Button>
        ))}
      </HStack>

      {/* Group List */}
      <VStack gap={4} w="full" h="full">
        {allGroupsIsLoading ? (
          <VStack
            w="full"
            spaceY="6"
            bg="main_background"
            h="100px"
            rounded="lg"
          >
            <Stack flex="1" w="full">
              {/* <Skeleton height="5" bg="main_background" /> */}
              <Skeleton height="full" width="100%" bg="main_background" />
              <Skeleton height="full" width="100%" bg="main_background" />
              <Skeleton height="full" width="100%" bg="main_background" />
              <Skeleton height="full" width="100%" bg="main_background" />
              <Skeleton height="full" width="100%" bg="main_background" />
              <Skeleton height="full" width="100%" bg="main_background" />
            </Stack>
          </VStack>
        ) : (
          <Stack flex={3} h="full" w="full" mx={4}>
            {size(filterResult) > 0 ? (
              (Array.isArray(filterResult) ? filterResult : []).map((group, idx) => (
                <GroupItem key={group?.id ?? idx} group={group} />
              ))
            ) : (
              <Box w="full" py={4} bg="main_background" rounded="md">
                <Text color="text_primary" textAlign={"center"}>
                  No groups found
                </Text>
              </Box>
            )}
          </Stack>
        )}
      </VStack>
    </Box>
  );
};

export default GroupComponent;
