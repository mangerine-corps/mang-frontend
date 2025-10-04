import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type BusinessUserState = {
  skills: Array<any>;
  languages: Array<any>;
  educations: Array<any>;
  experiences: Array<any>;
  works: Array<any>;
  consultings: Array<any>;
  currentEdu: Array<any>;
  disabled: boolean;
  secNum: string;
  contact: any;
};

const slice = createSlice({
  name: "profileReducer",
  initialState: {
    skills: [],
    languages: [],
    educations: [],
    experiences: [],
    works: [],
    consultings: [],
    currentEdu: [],
    disabled: false,
    contact: {},
    secNum: "",
  } as unknown as BusinessUserState,
  reducers: {
    setSkills: (state, { payload: { skills } }) => {
      state.skills = skills;
    },
    setLanguages: (state, { payload: { languages } }) => {
      state.languages = languages;
    },
    setCurrentEdu: (state, { payload: { currentEdu } }) => {
      state.currentEdu = currentEdu;
    },
    setEducation: (state, { payload: { educations } }) => {
      state.educations = educations;
    },
    // setContactDetails: (state, { payload: { contact } }) => {
    //   state.contact = contact;
    // },
    setContactDetails: (state, { payload }) => {
  state.contact = payload;
},
    setExperience: (state, { payload: { experiences } }) => {
      state.experiences = experiences;
    },
    setWorks: (state, { payload: { works } }) => {
      state.works = works;
    },
    setConsulting: (state, { payload: { consultings } }) => {
      state.consultings = consultings;
    },
    setDisabled: (state, { payload: { disabled } }) => {
      state.disabled = disabled;
    },
    setSecNum: (state, { payload: { secNum } }) => {
      state.secNum = secNum;
    },
  },
});

export const {
  setSkills,
  setLanguages,
  setEducation,
  setExperience,
  setWorks,
  setConsulting,
  setCurrentEdu,
  setDisabled,
  setSecNum,
  setContactDetails
} = slice.actions;

export default slice.reducer;

export const selectSkills = (state: RootState) => state.profile.skills;
export const selectLanguages = (state: RootState) => state.profile.languages;
export const selectEducation = (state: RootState) => state.profile.educations;
export const selectExperiences = (state: RootState) =>
  state.profile.experiences;
export const selectContact =(state:RootState)=>state.profile.contact;
export const selectWorks = (state: RootState) => state.profile.works;
export const selectCurrentEdu = (state: RootState) => state.profile.currentEdu;
export const selectConsultings = (state: RootState) =>
  state.profile.consultings;
export const selectDisabled = (state: RootState) => state.profile.disabled;
export const selectSecNum = (state: RootState) => state.profile.secNum;
