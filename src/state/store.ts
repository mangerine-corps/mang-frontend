import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
// import localForage from 'localforage';
import { combineReducers } from "redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { BookmarkApi } from "./services/bookmark.service";
import { CommunityInviteApi } from "./services/communityinvite.service";
import { settingsApi } from "./services/settings.service";
import { consultantsApi } from "./services/consultant.service";
import userAuth from "./reducers/auth.reducer";
import userType from "./reducers/user.reducer";
import profile from "./reducers/profile.reducer";
import community from "./reducers/community.reducer";
import bookmark from "./reducers/bookmark.reducer";
import appointments from "./reducers/appointment.reducer";
import payment from "./reducers/payment.reducer";

import chats from "./reducers/chat.reducer";
import communityInvite from "./reducers/communityinvite.reducer";
import postReducer from "./reducers/post.reducer";
import consultants from "./reducers/consultant.reducer";
import { postsApi } from "./services/posts.service";
import { UserAuthApi } from "./services/auth.service";
// import { UserTypeApi } from "./services/user.service";
import { ProfileApi } from "./services/profile.service";
import { CommunityApi } from "./services/community.service";
import { UserTypeApi } from "./services/user.service";
import { profileRecommendationsApi } from "./services/profile-recommendations.service";
import { availabilityApi } from "mangarine/state/services/availability.service";
import { appointmentApi } from "mangarine/state/services/apointment.service";
import { chatApi } from "./services/chat.service";
import { chatManagementApi } from "./services/chat-management.service";
import { paymentApi } from "./services/payment.service";
import { notificationsApi } from "./services/notifications.service";
import { transactionApi } from "./services/transaction.service";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blackList: [],
};

// Combine reducers
const reducers = combineReducers({
  userType,
  userAuth,
  profile,
  community,
  bookmark,
  communityInvite,
  posts: postReducer,
  consultants,
  appointments,
  chats,
  payment,
  [postsApi.reducerPath]: postsApi.reducer,
  [UserAuthApi.reducerPath]: UserAuthApi.reducer,
  [ProfileApi.reducerPath]: ProfileApi.reducer,
  [BookmarkApi.reducerPath]: BookmarkApi.reducer,
  [CommunityApi.reducerPath]: CommunityApi.reducer,
  [CommunityInviteApi.reducerPath]: CommunityInviteApi.reducer,
  [settingsApi.reducerPath]: settingsApi.reducer,
  [consultantsApi.reducerPath]: consultantsApi.reducer,
  [UserTypeApi.reducerPath]: UserTypeApi.reducer,
  [profileRecommendationsApi.reducerPath]: profileRecommendationsApi.reducer,
  [availabilityApi.reducerPath]: availabilityApi.reducer,
  [appointmentApi.reducerPath]: appointmentApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [chatManagementApi.reducerPath]: chatManagementApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
  [transactionApi.reducerPath]: transactionApi.reducer,
});

// Root reducer with reset logic
const rootReducer = (state: any, action: any) => {
  if (action.type === "userauth/signOut") {
    state = {}; // Reset state on sign out
  }
  return reducers(state, action);
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create and configure the store
export const createStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat([
        UserAuthApi.middleware,
        ProfileApi.middleware,
        CommunityApi.middleware,
        postsApi.middleware,
        BookmarkApi.middleware,
        CommunityInviteApi.middleware,
        settingsApi.middleware,
        consultantsApi.middleware,
        UserTypeApi.middleware,
        profileRecommendationsApi.middleware,
        availabilityApi.middleware,
        appointmentApi.middleware,
        chatApi.middleware,
        chatManagementApi.middleware,
        paymentApi.middleware,
        notificationsApi.middleware,
        transactionApi.middleware,
      ]),
  });

export const store = createStore();
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof reducers>;
export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
