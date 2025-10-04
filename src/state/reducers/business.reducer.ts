import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";


type BookmarkState = {
    bookmarks: any[],
    collections: any[],
};

const slice = createSlice({
    name: "bookmarks",
    initialState: {
        bookmarks: [],
        collections: [],
    } as unknown as BookmarkState,
    reducers: {
        setCollections: (state, { payload: { collections } }) => {
            state.collections = collections;
        },
        setBookmarks: (state, { payload: { bookmarks } }) => {
            state.bookmarks = bookmarks;
        },


    },
});

export const {
    setCollections,
    setBookmarks,
} = slice.actions;

export default slice.reducer;

export const selectCollections = (state: RootState) =>
    state.bookmark.collections;
export const selectBookmarks = (state: RootState) =>
    state.bookmark.bookmarks;

