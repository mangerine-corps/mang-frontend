import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectAll,
  selectCreated,
  selectJoined,
  selectRecommendedCommunities,
  selectTrending,

} from "../reducers/community.reducer";

export const useCommunity = () => {
  const all = useSelector(selectAll);
  const created = useSelector(selectCreated);
  const joined = useSelector(selectJoined);
  const recommended = useSelector(selectRecommendedCommunities);
  const trending = useSelector(selectTrending);
 
  return useMemo(
    () => ({ all, created, joined, recommended, trending,  }),
    [all, created, joined, recommended, trending]
  );
};
