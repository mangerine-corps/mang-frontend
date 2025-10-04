export const CommunityCategories = [
  "All",
  "Business",
  "Health",
  "Career",
  "Finance",
  "Technology & Charging",
  "Education",
];



export const dataTransformer = (data: any) => {
  const response = data.map((item: any) => {
    const { id, name, ...rest } = item;
    const formatedData = {
      id: id,
      label: name,
      value: id,
      ...rest
    };

    return formatedData;
  });
  return response;
};
