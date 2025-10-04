import { useSelector } from "react-redux";
import { useMemo } from "react";
import {
  selectConsultings,
  selectEducation,
  selectExperiences,
  selectLanguages,
  selectSkills,
  selectWorks,
  selectCurrentEdu,
  selectDisabled,
  selectSecNum,
  selectContact,
} from "../reducers/profile.reducer";

// custom hook for accessing collections and bookmarks
export const useProfile = () => {
  const skills = useSelector(selectSkills);
  const contact = useSelector(selectContact)
  const languages = useSelector(selectLanguages);
  const educations = useSelector(selectEducation);
  const experiences = useSelector(selectExperiences);
  const works = useSelector(selectWorks);
    const currentEdu = useSelector(selectCurrentEdu);
  const consultings = useSelector(selectConsultings);
  const disable = useSelector(selectDisabled);
  const sNumber = useSelector(selectSecNum)
  return useMemo(
    () => ({ skills,disable, languages, contact, educations, sNumber, experiences, works,currentEdu, consultings }),
    [skills, languages, disable, educations, contact, experiences, works,sNumber, currentEdu ,consultings]
  );
};
