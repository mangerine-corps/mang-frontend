"use client";
import {
  Box,
  Button,
  Drawer,
  HStack,
  Image,
  RadioGroup,
  Slider,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

// const myStyles = {
//   itemShapes: RoundedStar,
//   activeFillColor: "#ffb700",
//   inactiveFillColor: "#d9d9d9",
// };

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useAddWorkMutation } from "mangarine/state/services/profile.service";

import { FaTimes } from "react-icons/fa";
import { toaster } from "mangarine/components/ui/toaster";
import CustomInput from "mangarine/components/customcomponents/Input";
import { RadioComponent } from "mangarine/components/customcomponents/radiocomponent";
import { CheckBoxComp } from "mangarine/components/customcomponents/checkboxcomp";

const upload = "/assets/icons/uploadImg.svg";
const workSchema = yup.object().shape({
  option: yup.string().required("option is required"),
  description: yup.string().required("description is required"),
  link: yup.string().nullable(),
});

type FilterHeaderProps = { label: string };
const FilterHeader = ({ label }: FilterHeaderProps) => {
  return (
    <HStack
      w="full"
      py={4}
      px="3"
      borderBottomWidth={"1.5px"}
      justifyContent={"space-between"}
    >
      <Text
        fontWeight={500}
        fontSize={"1.5rem"}
        fontFamily={"Outfit"}
        color={"text_primary"}
      >
        {label}
      </Text>
    </HStack>
  );
};

const FilterDrawer = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState<any>({});
  const [value, setValue] = useState<string | null>(null);
  const [checkAvailable, setCheckAvailable] = useState<boolean>(false);
  //   const toast = useToast();
  const [addWork, { isLoading }] = useAddWorkMutation();
  const sortItem = [
    { label: "Relevance", value: "1" },
    { label: "Latest", value: "2" },
    { label: "Most Active", value: "3" },
  ];
  const expertiseItem = [
    { label: "Business Consulting", value: "1" },
    { label: "Marketing Strategy", value: "2" },
    { label: "Health & Wellness", value: "3" },
  ];
  const marks = [
    { value: 0, label: "0%" },
    // { value: 50, label: "50%" },
    { value: 100, label: "100%" },
  ];
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(workSchema),
    defaultValues: {
      option: "",
      description: "",
      link: "",
    },
  });

  const handleFileChange = (e: any) => {
    const file = e.target.files[0]; // Get the selected file

    if (file) {
      setFile(file); // Set selected file to state
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Set the image URL to display the preview
      };
      reader.readAsDataURL(file); // Read the image as a data URL
    }
  };
  const handleImageClick = () => {
    document.getElementById("hidden-file-input").click(); // Programmatically click the hidden input
  };

  const createWork = (data: any) => {
    const formData = new FormData();
    formData.append("option", data.option);
    formData.append("description", data.description);
    formData.append("link", data.link);
    formData.append("file", file);
    addWork(formData)
      .unwrap()
      .then((payload) => {
        const { message } = payload;
        console.log(data, message, "work");
        toaster.create({
          title: "Success!",
          description: message,
          type: "success",
          duration: 9000,
          closable: true,
        });
        onOpenChange();
      })
      .catch((error) => {
        console.log(error);
        // toast({
        //   option: "Error",
        //   description: "Failed to create work",
        //   status: "error",
        //   duration: 9000,
        //   isClosable: true,
        //   position: "top-right",
        // });
      });
  };
  return (
    <Drawer.Root size={"md"} open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />
      <Drawer.Trigger></Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <VStack
                spaceY={6}
                w="full"
                justifyContent={"space-between"}
                alignItems={"center"}
                px="4"
              >
                <HStack
                  w="full"
                  py={4}
                  px="3"
                  borderBottomWidth={"1.5px"}
                  justifyContent={"space-between"}
                >
                  <Text
                    fontWeight={500}
                    fontSize={"1.5rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    // textAlign={"start"}
                  >
                    Filter by
                  </Text>
                  <HStack spaceX={4}>
                    <Box
                      border={0.5}
                      rounded={4}
                      py={2}
                      px="2"
                      onClick={onOpenChange}
                      borderColor={"gray.150"}
                      //   shadow={"md"}
                    >
                      <Text
                        color="text_primary"
                        fontSize={"1.25rem"}
                        fontWeight={"400"}
                      >
                        <FaTimes />
                      </Text>
                    </Box>
                  </HStack>
                </HStack>
              </VStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body px="3" py="8">
            <VStack
              spaceY={6}
              w="full"
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
            >
              <FilterHeader label="Sort By" />
              <RadioComponent Items={sortItem} />

              <FilterHeader label="Availability" />

              <CheckBoxComp
                label={"Available Now"}
                checked={checkAvailable}
                onChecked={setCheckAvailable}
              />

              <FilterHeader label="Area of Expertise" />
              <VStack alignItems={"flex-start"} w="full" spaceY={4}>
                {expertiseItem.map((item) => (
                  <CheckBoxComp
                    key={item.value}
                    label={item.label}
                    checked={checkAvailable}
                    onChecked={setCheckAvailable}
                  />
                ))}
                <FilterHeader label="Price range" />

                <Slider.Root
                  width="100%"
                  colorPalette="black"
                  defaultValue={[20, 60]}
                  minStepsBetweenThumbs={8}
                >
                  <Slider.Control>
                    <Slider.Track>
                      <Slider.Range />
                    </Slider.Track>
                    <Slider.Thumbs />
                    <Slider.Marks marks={marks} />
                  </Slider.Control>
                </Slider.Root>
              </VStack>
              <FilterHeader label="Ratings" />

              <CheckBoxComp
                label={"Beginner"}
                checked={checkAvailable}
                onChecked={setCheckAvailable}
              />
                 <CheckBoxComp
                label={"Intermediate"}
                checked={checkAvailable}
                onChecked={setCheckAvailable}
              />
                 <CheckBoxComp
                label={"Advanced"}
                checked={checkAvailable}
                onChecked={setCheckAvailable}
              />

               <FilterHeader label="Expert Level" />

              <CheckBoxComp
                label={"Beginner"}
                checked={checkAvailable}
                onChecked={setCheckAvailable}
              />
                 <CheckBoxComp
                label={"Intermediate"}
                checked={checkAvailable}
                onChecked={setCheckAvailable}
              />
                 <CheckBoxComp
                label={"Advanced"}
                checked={checkAvailable}
                onChecked={setCheckAvailable}
              />

              {/* <CheckBoxComp
                label={"Available Now"}
                checked={checkAvailable}
                onChecked={ setCheckAvailable }
              /> */}
              <HStack
                w="full"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <HStack w="100%" display={"flex"} flexDir={"row"} spaceX={6}>
                  <Button
                    borderColor="primary.300"
                    borderWidth={1}
                    color={"white"}
                    bg={"white"}
                    py={2}
                    rounded="6px"
                    w="45%"
                    px={4}
                    _hover={{
                      textDecor: "none",
                    }}
                    // isDisabled={isEmpty(selectedDay) || selectedTime == ''}

                    onClick={() => {
                      onOpenChange();
                    }}
                  >
                    <Text
                      ml={2}
                      className="text5"
                      color={"primary.300"}
                      fontSize={"0.875rem"}
                      fontWeight={"500"}
                    >
                      Reset
                    </Text>
                  </Button>
                  <Button
                    bg="primary.300"
                    borderWidth={1}
                    color={"white"}
                    borderColor={"gray.50"}
                    py={2}
                    w="45%"
                    //   isLoading={isLoading}
                    px={4}
                    _hover={{
                      textDecor: "none",
                    }}
                    loading={isLoading}
                    // isDisabled={isEmpty(selectedDay) || selectedTime == ''}
                    // isLoading={isLoading}
                    onClick={handleSubmit(createWork, (error) =>
                      console.log(error)
                    )}
                  >
                    <Text
                      ml={2}
                      className="text5"
                      color={"white"}
                      fontSize={"0.875rem"}
                      fontWeight={"500"}
                    >
                      Apply
                    </Text>
                  </Button>
                </HStack>
              </HStack>
            </VStack>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default FilterDrawer;
