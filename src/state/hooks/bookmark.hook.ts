import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { selectBookmarks, selectCollections } from '../reducers/bookmark.reducer';


// custom hook for accessing collections and bookmarks 
export const useBookmark = () => {
  const collections = useSelector(selectCollections);
  const bookmarks = useSelector(selectBookmarks);

  return useMemo(
    () => ({ collections, bookmarks }), 
    [collections, bookmarks ]
  );
};
