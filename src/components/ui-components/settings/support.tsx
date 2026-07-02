import React, { useState } from "react";
import HeaderContent from "./headercontent";
import { Box, RatingGroup, Text, Textarea, VStack } from "@chakra-ui/react";
import CustomButton from "mangarine/components/customcomponents/button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import CustomInput from "mangarine/components/customcomponents/Input";
import CustomSelect from "mangarine/components/customcomponents/select";

import { toaster } from "mangarine/components/ui/toaster";
import { useReportIssueMutation, useSendMessageMutation } from "mangarine/state/services/settings.service";
const reportType = [
  { id: "1", label: "bug", value: "bug" },
  { id: "2", label: "feature", value: "feature" },
  { id: "3", label: "general", value: "general" },
];




const Schema = yup.object().shape({
  reportType: yup.string().required("Feedback type is required"),
  issueType: yup.string().required("Description is required"),
});
const Support = ({ onClick }: { onClick: () => void }) => {
  const [text, setText] = useState<string>("");
  const [reportIssue, { isLoading: reportLoading }] = useReportIssueMutation();
  const [sendMessage, { isLoading: messageLoading }] = useSendMessageMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      reportType: "",
      issueType: "",
    },
  });

  const handleSendMessage = () => {
    if (!text.trim()) {
      toaster.create({
        type: "error",
        title: "Message required",
        description: "Please enter a message before submitting.",
        closable: true,
      });
      return;
    }
    sendMessage({ subject: "Customer Support", messageBody: text })
      .unwrap()
      .then((res) => {
        setText("");
        toaster.create({
          type: "success",
          title: "Message sent",
          description: res.message ?? "We'll get back to you shortly.",
          closable: true,
        });
      })
      .catch((err) => {
        toaster.create({
          type: "error",
          title: "Failed to send",
          description: err?.data?.message ?? "Something went wrong. Please try again.",
          closable: true,
        });
      });
  };

  const submit = (data) => {
    reportIssue({ description: data.issueType, issueType: data.reportType })
      .unwrap()
      .then((res) => {
        toaster.create({
          type: "success",
          title: "Issue reported",
          description: res.message ?? "Your issue has been reported successfully.",
          closable: true,
        });
      })
      .catch((err) => {
        toaster.create({
          type: "error",
          title: "Failed to report",
          description: err?.data?.message ?? "Something went wrong. Please try again.",
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
        title="Customer Support"
        desc=""
        extra=""
      />
      <Text
        font="outfit"
        fontSize={{ base: "1rem", md: "1.2rem", lg: "1.25rem" }}
        pt="4"
        py="2"
        fontWeight="500"
        color="text_primary"
      >
        Send us a message
      </Text>
      <Text
        color="text_primary"
        fontFamily="Outfit"
        fontSize={{ base: "1rem", md: "1.1rem", lg: "1.2rem" }}
        fontStyle="normal"
        fontWeight="400"
        pb="3"
      >
        Get help directly from our support team
      </Text>
      <VStack w="full" alignItems={"flex-start"} py="4">
        {/* <Controller
          name="subject"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomSelect
              id={`subject_${subject.id}`}
              placeholder="Select subject"
              name={"subject"}
              size="md"
              options={subjects}
              label="Select subject"
              isMulti={false}
              value={value}
              required={true}
            //   error={errors.subject}
              onChange={onChange}
            />
          )}
        /> */}
        <Text
          color="text_primary"
          fontFamily="Outfit"
          fontSize="12px"
          fontStyle="normal"
          fontWeight="400"
        >
          Message
        </Text>

        <Textarea
          p="3"
          value={text}
          onChange={(e) => setText(e.target.value)}
          borderWidth={1}
          color="text_primary"
          bg="main_background"
          borderColor="border_background"
          rows={5}
          resize={"none"}
          placeholder="Tell us about you"
        />
      </VStack>
      {/* <Controller
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
      /> */}

      <CustomButton
        customStyle={{
          w: "full",
          color: "text_primary",
          my: "8",
        }}
        loading={messageLoading}
        onClick={handleSendMessage}
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
      <Text
        font="outfit"
        fontSize={{ base: "1rem", md: "1.2rem", lg: "1.25rem" }}
        pt="4"
        // py="4"
        fontWeight="500"
        color="text_primary"
      >
        Report an Issue
      </Text>
      <Text
        color="text_primary"
        fontFamily="Outfit"
        fontSize={{ base: "1rem", md: "1.1rem", lg: "1.2rem" }}
        fontStyle="normal"
        pt="2"
        fontWeight="400"
        pb="4"
      >
        Report bugs, glitches, or other problems.
      </Text>
      <Controller
        name="reportType"
        control={control}
        render={({ field: { onChange, value } }) => (
          <CustomSelect
            id="reportType"
            placeholder="Select issue type"
            name="reportType"
            size="md"
            options={reportType}
            label="Issue Type "
            isMulti={false}
            value={value ? [value] : []}
            required={true}
            error={errors.reportType}
            onChange={onChange}
          />
        )}
      />
      <Controller
        name="issueType"
        control={control}
        render={({ field: { onChange, value } }) => (
          <VStack w="full" alignItems={"flex-start"} py="4">
            <Text
              color="text_primary"
              fontFamily="Outfit"
              fontSize="12px"
              fontStyle="normal"
              fontWeight="400"
            >
              Description
            </Text>
            <Textarea
              p="3"
              value={value}
              onChange={onChange}
              borderWidth={1}
              color="text_primary"
              bg="main_background"
              borderColor="border_background"
              rows={5}
              resize={"none"}
              placeholder="Tell us about you"
            />
          </VStack>
        )}
      />
      <CustomButton
        customStyle={{
          w: "full",
          color: "text_primary",
          my: "8",
        }}
        loading={reportLoading}
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

export default Support;
