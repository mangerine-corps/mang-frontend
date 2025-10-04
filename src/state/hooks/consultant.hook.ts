import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import {
  selectConsultants,
  selectSelectedConsultant,

  selectConsultantReports,
  selectBlockedConsultant,
  selectIsStateBlocked,
  selectUpcomingConsultation,
  selectFavoriteConsultant
} from '../reducers/consultant.reducer';

// custom hook for accessing consultant details, favorites, and reports
export const useConsultants = () => {
  const consultants = useSelector(selectConsultants);
  const selectedConsultant = useSelector(selectSelectedConsultant);
  // const = useSelector(selectFavoritedConsultants);
    const blockedConsultant = useSelector(selectBlockedConsultant);
  const reports = useSelector(selectConsultantReports);
  const status = useSelector(selectIsStateBlocked)
  const upcomingConsultation = useSelector(selectUpcomingConsultation)
 const favorite = useSelector(selectFavoriteConsultant)
  return useMemo(
    () => ({ consultants, selectedConsultant,favorite,blockedConsultant, status,upcomingConsultation,  reports }),
    [consultants, selectedConsultant, favorite, status,reports, upcomingConsultation, blockedConsultant]
  );
};
