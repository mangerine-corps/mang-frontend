import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface CommunityInvite {
  communityId: string;
  creator: any;
  user: any;
  note?: string;
  isActive: boolean;
  createdAt: string;
  id: number;
}

interface InitialState {
  requests: {
    [id: string]: CommunityInvite[];
  };
}

const slice = createSlice({
  name: "CommunityInvites",
  initialState: {
    requests: {},
  } as InitialState,
  reducers: {
    setRequests: (
      state,
      action: PayloadAction<{ id: number; invites: CommunityInvite[] }>
    ) => {
      state.requests = {
        ...state.requests,
        [action.payload.id.toString()]: action.payload.invites,
      };
    },
    acceptRequest: (
      state,
      action: PayloadAction<{ communityId: number; requestId: number }>
    ) => {
      const { communityId, requestId } = action.payload;
      state.requests[communityId.toString()] = state.requests[
        communityId.toString()
      ]?.filter((r) => r.id !== requestId);
    },
    deleteRequest: (
      state,
      action: PayloadAction<{ communityId: number; requestId: number }>
    ) => {
      const { communityId, requestId } = action.payload;
      state.requests[communityId.toString()] = state.requests[
        communityId.toString()
      ]?.filter((r) => r.id !== requestId);
    },
    createRequest: (state, action: PayloadAction<CommunityInvite>) => {
      if (!state.requests[action.payload.communityId.toString()]) {
        state.requests = {
          ...state.requests,
          [action.payload.communityId.toString()]: [action.payload],
        };
      } else {
        state.requests = {
          ...state.requests,
          [action.payload.communityId.toString()]: [
            action.payload,
            ...state.requests[action.payload.communityId.toString()],
          ],
        };
      }
    },
  },
});

export const { setRequests, acceptRequest, deleteRequest, createRequest } = slice.actions;
export const selectCommunityInviteRequests =
  (id: number) => (state: RootState) =>
    state.communityInvite.requests[id.toString()];
export default slice.reducer;
