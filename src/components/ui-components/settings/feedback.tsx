import React, { useState } from "react";
import HeaderContent from "./headercontent";
import { Box, RatingGroup, Text, Textarea, VStack } from "@chakra-ui/react";
import CustomButton from "mangarine/components/customcomponents/button";
import { useCreateFeedbackMutation } from "mangarine/state/services/settings.service";
import CustomSelect from "mangarine/components/customcomponents/select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toaster } from "mangarine/components/ui/toaster";
const feedbackType = [
  { id: "1", label: "bug", value: "bug" },
  { id: "2", label: "feature", value: "feature" },
  { id: "3", label: "general", value: "general" },
];

const Schema = Yup.object().shape({

  feedbackType: Yup.array()
    .of(Yup.string())
    .min(1, "Feedback type is required"),
  rating: Yup.number().required("Rating is required"),
  comment: Yup.string().required("Comment is required"),
});

const Feedback = ({ onClick }: { onClick: () => void }) => {
  const [createFeedback, { data, error, isLoading }] =
    useCreateFeedbackMutation();
  const [rating, setRating] = useState<number>(1);
  const [text, setText] = useState<string>("");
    const {
      control,
      handleSubmit,
      setValue,
      getValues,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(Schema),
      defaultValues: {
        feedbackType: [],
        comment:"",
        rating:1
      },
    });
  const submit = (data) => {


    const payload = {
      rating: data.rating,
      feedbackType: data.feedbackType.join(",") ,
      comment: data.comment,
    };
    console.log(payload, "payload");
    createFeedback(payload)
      .unwrap()
      .then((res) => {
        // console.log(res, "res");
        toaster.create({
          type:"success",
          title:"Success",
          description:res.message,
          closable:true

        })
      })
      .catch((err) => {
        console.log(err, "err");
        toaster.create({
          type: "error",
          title: "Failed",
          description: err.message,
          closable: true,
        });
      });
  };

  return (
    <Box
      //w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}

      borderRadius="lg"
      boxShadow="lg"
      bg="main_background"
      p={8}
      w="full"
      h="auto"
      overflowY={"scroll"}
      //px={6}
      //py={6}
      // marginLeft={40}
      mt={0}
    >
      <HeaderContent
        onClick={onClick}
        title="Frequently Asked Questions"
        desc=""
        extra=""
      />
      <Text
        font="outfit"
        fontSize={{ base: "1rem", md: "1.2rem", lg: "1.25rem" }}
        // pt="4"
        py="4"
        fontWeight="500"
        color="text_primary"
      >
        Share your thoughts and suggestions with us
      </Text>
      <VStack w="full" alignItems={"flex-start"} py="4">
        <Controller
          name="feedbackType"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomSelect
              id="feedbackType"
              placeholder="feedbackType"
              name="feedbackType"
              size="md"
              options={feedbackType}
              label="FeedBack "
              isMulti={false}
              value={value}
              required={false}
              error={errors.feedbackType}
              onChange={onChange}
            />
          )}
        />
        <Text
          color="text_primary"
          fontFamily="Outfit"
          fontSize={{ base: "1rem", md: "1.2rem", lg: "1.25rem" }}
          fontStyle="normal"
          fontWeight="400"
        >
          Comment
        </Text>

        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <Textarea
              p="3"
              borderWidth={1}
              color="text_primary"
              bg="main_background"
              borderColor="gray.100"
              rows={5}
              resize="none"
              placeholder="Tell us in detail"
              {...field}
            />
          )}
        />
      </VStack>
      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <RatingGroup.Root
            count={5}
            value={field.value}
            onValueChange={(val) => field.onChange(val.value)}
          >
            <RatingGroup.HiddenInput />
            <RatingGroup.Control spaceX={6} />
          </RatingGroup.Root>
        )}
      />

      <CustomButton
        customStyle={{
          w: "full",
          color: "text_primary",
          my: "8",
        }}
        loading={isLoading}
        onClick={handleSubmit(submit)}
      >
        <Text
          color={"button_text"}
          fontWeight={"600"}
          fontSize={"1rem"}
          lineHeight={"100%"}
        >
          Submit
        </Text>
      </CustomButton>
    </Box>
  );
};

export default Feedback;
