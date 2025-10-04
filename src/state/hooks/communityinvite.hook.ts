import { useSelector } from "react-redux"
import { selectCommunityInviteRequests } from "../reducers/communityinvite.reducer"
import { useMemo } from "react"


export const useCommunityInvite = (id: number)=>{
    const requests = useSelector(selectCommunityInviteRequests(id))
    return useMemo(()=>{
        return {requests}
    }, [requests])
}

