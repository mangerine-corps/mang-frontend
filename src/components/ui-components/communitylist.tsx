"use client";;
import { StackProps, Text, VStack, Spinner } from "@chakra-ui/react";
import CommunityItem from "./communityitem";

import { useState } from "react";

import { isEmpty } from "lodash";

interface CommunityListsProps extends StackProps {
  title: string;
  type: "trending" | "recommended" | "all" | "joined";
  url: string;
  filterJoined?: boolean;
}
type Community = {
  image: "";
  name: "";
  users: any[];
};
const CommunityLists = ({
  title,
  // type,
  // url,
  // filterJoined,
  ...rest
}: CommunityListsProps) => {
  // const defaultMin = 2;
  // const defaultMax = 10;


  const [communities,] = useState<any[]>([]);
  const [loading,] = useState<boolean>(false);

  // const { data: joinedData, isSuccess: joinedSuccess } =
  // useGetJoinedCommunitiesQuery({});

  // const joinedCommunities = useSelector(
  //   (state: RootState) => state.community.joined
  // );

//   const fetchCommunities = useCallback(async () => {
//     setLoading(true); // Set loading state to true when fetching starts
//     try {
//       const res = await getCommunities({ url }).unwrap();
//       const d = res.data.result || res.data;
//       if (filterJoined && joinedCommunities) {
//         const filtered = d.filter((c: Community) => {
//           const indx = joinedCommunities?.findIndex(
//             (jd: Community) => jd.id == c.id
//           );
//           return indx === -1;
//         });
//         setCommunities(filtered);
//       } else {
//         setCommunities(d);
//       }
//     } catch (error) {
//       console.error("Failed to fetch communities", error);
//     } finally {
//       setLoading(false); // Set loading state to false when fetching ends
//     }
//   }, [getCommunities, url, filterJoined, joinedCommunities]);

//   useEffect(() => {
//     fetchCommunities();
//   }, [fetchCommunities]);

//   useEffect(() => {
//     // if (filterJoined && joinedCommunities) {
//     //   const filteredCommunities = communities.filter((c) => {
//     //     const indx = joinedCommunities?.findIndex(
//     //       (jd: Community) => jd.id == c.id
//     //     );
//     //     return indx === -1;
//     //   });
//     //   setCommunities(filteredCommunities);
//     // }
//   }, [joinedCommunities, filterJoined]);

  const handleSeeMoreClicked = () => {};

  return (
    <VStack
      rounded={"15px"}
      p={"1.25rem"}
      shadow={"0px 0px 4px 0px #0000001A"}
      minW={"300px"}
      {...rest}
      bg="main_background"
    >
      <Text
        textAlign={"left"}
        w="full"
        fontSize={"1.25rem"}
        fontFamily={"Outfit"}
        color={"background.400"}
        fontWeight={"600"}
        p={0}
        mb="1.25rem"
      >
        {title}
      </Text>
      {loading ? (
        <Spinner color="primary.300" />
      ) : (
        !isEmpty(communities) &&
        communities?.map((community: Community) => (
          <CommunityItem community={community} key={community.name} />
        ))
      )}
      {!isEmpty(communities) && (
        <Text
          fontSize={"sm"}
          fontWeight={500}
          color={"#FC731A"}
          cursor={"pointer"}
          mt={4}
          textAlign="center"
          onClick={() => handleSeeMoreClicked()}
        >
          See More
        </Text>
      )}
    </VStack>
  );
};

export default CommunityLists;
