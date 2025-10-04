"use client";
import { StackProps, Text, VStack, Spinner } from "@chakra-ui/react";
// import {
//   Community,
//   setAll,
//   setJoined,
//   setRecommended,
//   setTrending,
// } from "@/state/reducers/community.reducer";
// import {
//   useGetCommunitiesMutation,
//   useGetJoinedCommunitiesQuery,
// } from "@/state/services/community.service";
import { useCallback, useEffect, useState } from "react";
// import { useCommunity } from "@/state/hooks/communities.hook";
import { isEmpty } from "lodash";
import { useGetCommunitiesMutation } from "mangarine/state/services/community.service";
import { useSelector } from "react-redux";
import { RootState } from "mangarine/state/store";
import { Community } from "mangarine/state/reducers/community.reducer";
import CommunityItem from "./communityitem";

interface CommunityListsProps extends StackProps {
  title: string;
  type?: "trending" | "recommended" | "all" | "joined";
  url?: string;
  filterJoined?: boolean;
}

const CommunityLists = ({
  title,
  type,
  url,
  filterJoined,
  ...rest
}: CommunityListsProps) => {
  // const defaultMin = 2;
  // const defaultMax = 10;
const [seeMore, setSeeMore] = useState(false)
  const [getCommunities] = useGetCommunitiesMutation();
    const [communities, setCommunities] = useState<any[]>([]);
  // const [communities, ] = useState<any[]>([]);
  const [loading,setLoading ] = useState<boolean>(false);
  // const community = [];
  console.log(type)
  // const { data: joinedData, isSuccess: joinedSuccess } =
  // useGetJoinedCommunitiesQuery({});

  const joinedCommunities = useSelector(
    (state: RootState) => state.community.joined
  );
  const visibleCommunities = seeMore ? communities :communities.slice(0,5)
  const fetchCommunities = useCallback(async () => {

    setLoading(true); // Set loading state to true when fetching starts
    try {
      const res = await getCommunities({ url }).unwrap();
      const d = res.data.result || res.data;
      if (filterJoined && joinedCommunities) {
        const filtered = d.filter((c: Community) => {
          const indx = joinedCommunities?.findIndex(
            (jd: Community) => jd.id == c.id
          );
          return indx === -1;
        });
        setCommunities(filtered);
      } else {
        setCommunities(d);
      }
    } catch (error) {
      console.error("Failed to fetch communities", error);
    } finally {
      setLoading(false); // Set loading state to false when fetching ends
    }
  }, [getCommunities, url,filterJoined,joinedCommunities]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  useEffect(() => {
    if (filterJoined && joinedCommunities) {
      const filteredCommunities = communities.filter((c) => {
        const indx = joinedCommunities?.findIndex(
          (jd: Community) => jd.id == c.id
        );
        return indx === -1;
      });
      setCommunities(filteredCommunities);
    }
  }, [joinedCommunities,filterJoined,communities]);

  const handleSeeMoreClicked = () => {
setSeeMore(!seeMore)
  };

  return (
    <VStack
      rounded={"15px"}
      p={"1em"}
      w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
      maxW={{ base: "full", md: "340px", lg: "400px" }}
      // w="240px"
      shadow={"0px 0px 4px 0px #0000001A"}
      // minW={"300px"}
      {...rest}
      bg="main_background"
    >
      <Text
        textAlign={"left"}
        w="full"
        fontSize={"1.25rem"}
        fontFamily={"Outfit"}
        color={"text_primary"}
        fontWeight={"600"}
        p={0}
        mb="1.25rem"
      >
        {title}
      </Text>
      {loading ? (
        <Spinner color="primary.300" />
      ) : (
        (!isEmpty(communities) &&
          visibleCommunities
            .slice(0, 3)
            ?.map((community: Community) => (
              <CommunityItem community={community} key={community.id} />
            ))) || (
          <Text
            textAlign={"center"}
            color="text_primary"
            fontWeight={"500"}
            fontSize="1rem"
          >
            Quiet here
          </Text>
        )
      )}
      {!isEmpty(communities) && communities.length > 5 && (
        <Text
          fontSize={"sm"}
          fontWeight={500}
          color={"primary.300"}
          cursor={"pointer"}
          mt={4}
          textAlign="center"
          onClick={handleSeeMoreClicked}
        >
          {seeMore ? (
            <Text
              cursor="pointer"
              onClick={() => {
                setSeeMore(false);
              }}
            >
              See Less
            </Text>
          ) : (
            "See More"
          )}
        </Text>
      )}
    </VStack>
  );
};

export default CommunityLists;
