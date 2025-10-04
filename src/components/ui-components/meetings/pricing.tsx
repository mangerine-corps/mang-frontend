import { Box, Text, Button, VStack, HStack, Flex } from "@chakra-ui/react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "mangarine/components/customcomponents/Input";
import { useConsultantPricingMutation, useGetPricingQuery } from "mangarine/state/services/consultant.service";
import { useEffect, useState } from "react";
import { isEmpty } from "es-toolkit/compat";
import { PricingDetails } from "mangarine/utils/helper";
import { toaster } from "mangarine/components/ui/toaster";

const loginSchema = Yup.object().shape({
  // currency: Yup.string()
  //   .required("Currency is required"),
  flatPrice: Yup.string().required("flat price is required"),
  dayBookPercentage: Yup.number().required("daily percentage is required"),
  midDayBookPercentage: Yup.number().required("mid day percentage is required"),
  twoHoursDiscount: Yup.number().required("two hours percentage is required"),
  threeHoursDiscount: Yup.number().required("three hours is required"),
  fourHoursDiscount: Yup.number().required("four hours is required"),
  otherHoursDiscount: Yup.number(),
});

const Pricing = () => {
  const [consultantPricing, { isLoading }] = useConsultantPricingMutation();
  const { data, currentData, refetch } = useGetPricingQuery({})
  const [pricing, setPricing] = useState<PricingDetails>()
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      // currency: "USD",
      flatPrice: !isEmpty(pricing) ? pricing?.flatPrice : '0',
      dayBookPercentage: !isEmpty(pricing) ? pricing?.dayBookPercentage : 0,
      midDayBookPercentage: !isEmpty(pricing) ? pricing?.midDayBookPercentage : 0,
      twoHoursDiscount: !isEmpty(pricing) ? pricing?.twoHoursDiscount : 0,
      threeHoursDiscount: !isEmpty(pricing) ? pricing?.threeHoursDiscount : 0,
      fourHoursDiscount: !isEmpty(pricing) ? pricing?.fourHoursDiscount : 0,
      otherHoursDiscount: !isEmpty(pricing) ? pricing?.otherHoursDiscount : 0,
    },
  });
  const onSubmit = (data: any) => {
    const formdata = {
      currency: "USD",
      flatPrice: data.flatPrice,
      dayBookPercentage: data.dayBookPercentage,
      midDayBookPercentage: data.midDayBookPercentage,
      twoHoursDiscount: data.twoHoursDiscount,
      threeHoursDiscount: data.threeHoursDiscount,
      fourHoursDiscount: data.fourHoursDiscount,
      otherHoursDiscount: data.otherHoursDiscount,
    };
    consultantPricing(formdata)
      .unwrap()
      .then((payload) => {
        console.log(payload);
        const {message} = payload
        toaster.create({
          title: "Success!!",
          description: message,
          type: "success",
          duration: 4000,
          closable: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (!isEmpty(data) && !isEmpty(data.data)) {
      const { data: pricing } = data;
      const keys = Object.keys(pricing)
      keys.forEach((element: any) => {
        if (element !== 'id') {
          setValue(element, pricing[element])
        }
      });
      setPricing(pricing)
    }
  }, [data])

  return (
    <Box bg="bg_box" borderRadius="12px" boxShadow="md" p={6} pb="24">
      {/* Header */}

      <Text font="outfit" fontSize="2rem" fontWeight="700" color="text_primary">
        Schedule Pricing
      </Text>

      <VStack gap={6} align="stretch" py="6">
        {/* Consultant Pricing Setting */}
        <Box>
          <Text
            font="outfit"
            fontSize="1.5rem"
            fontWeight="500"
            color="text_primary"
          // mb={2}
          >
            Consultant Pricing Setting
          </Text>
          <Text font="outfit" fontSize="1rem" fontWeight="400" color="gray.500">
            Brief description of the flexibility consultants have to set their
            prices.
          </Text>
        </Box>

        {/* Hourly Session Pricing */}
        <Box>
          <Text
            font="outfit"
            fontSize="1.25rem"
            fontWeight="500"
            color="text_primary"
          // mb={2}
          >
            An Hour Session Pricing
          </Text>

          <Flex align="center" gap={2}>
            <Controller
              name="flatPrice"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="   Define the price for an hour session"
                  placeholder="Enter amount"
                  id="amount"
                  required={true}
                  name="amount"
                  value={value}
                  size="lg"
                  onChange={onChange}
                  error={errors.flatPrice}
                  hasRightIcon={true}
                  type={"text"}
                // rightIcon={
                //   <Icon mr={"4"}>
                //     {colorMode === "dark" ? (
                //       <Image src="/icons/mailwhite.svg" alt="mail-icon" />
                //     ) : (
                //       <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                //     )}
                //   </Icon>
                // }
                />
              )}
            />

            {/* <Box cursor="pointer"></Box> */}
          </Flex>
          <Text
            font="outfit"
            fontSize="0.875rem"
            fontWeight="400"
            color="gray.500"
          // mt={2}
          >
            Note: This price applies for a standard 1-hour session without
            discounts.
          </Text>
        </Box>

        {/* Last-Minute Booking */}
        <Box>
          <Text
            font="outfit"
            fontSize="1.25rem"
            fontWeight="500"
            color="text_primary"
          >
            Last-Minute Booking
          </Text>
          <HStack
            justifyContent={"space-between"}
            alignItems={"center"}
            w="full"
          >
            {/* <Box position="relative"> */}
            <Box flex="1">
              <Text
                font="outfit"
                fontSize="1rem"
                fontWeight="500"
                color="text_primary"
              >
                12-Hours
              </Text>
              <Text
                font="outfit"
                fontSize="0.875rem"
                fontWeight="400"
                color="gray.500"
              >
                Set percentage increase for bookings
              </Text>
            </Box>
            <Box position="relative" maxW="120px">
              <Controller
                name="midDayBookPercentage"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label=""
                    placeholder="0"
                    id=" midDayBookPercentage"
                    required={false}
                    name=" midDayBookPercentage"
                    value={value}
                    size="lg"
                    onChange={onChange}
                    error={errors.midDayBookPercentage}
                    hasRightIcon={true}
                    type={"number"}
                  // rightIcon={
                  //   <Icon mr={"4"}>
                  //     {colorMode === "dark" ? (
                  //       <Image src="/icons/mailwhite.svg" alt="mail-icon" />
                  //     ) : (
                  //       <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                  //     )}
                  //   </Icon>
                  // }
                  />
                )}
              />

              <Text
                position="absolute"
                right="8px"
                top="50%"
                transform="translateY(-50%)"
                fontSize="14px"
                color="gray.500"
                pointerEvents="none"
              >
                %
              </Text>
            </Box>
            {/* </Box> */}
          </HStack>
          <HStack
            justifyContent={"space-between"}
            alignItems={"center"}
            w="full"
          >
            {/* <Box position="relative"> */}
            <Box flex="1">
              <Text
                font="outfit"
                fontSize="1rem"
                fontWeight="500"
                color="text_primary"
              >
                24-Hours
              </Text>
              <Text
                font="outfit"
                fontSize="0.875rem"
                fontWeight="400"
                color="gray.500"
              >
                Set percentage increase for bookings
              </Text>
            </Box>
            <Box position="relative" maxW="120px">
              <Controller
                name="dayBookPercentage"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <CustomInput
                    label=""
                    placeholder="0"
                    id=" dayBookPercentage"
                    required={false}
                    name=" dayBookPercentage"
                    value={value}
                    size="lg"
                    onChange={onChange}
                    error={errors.midDayBookPercentage}
                    hasRightIcon={true}
                    type={"number"}
                  // rightIcon={
                  //   <Icon mr={"4"}>
                  //     {colorMode === "dark" ? (
                  //       <Image src="/icons/mailwhite.svg" alt="mail-icon" />
                  //     ) : (
                  //       <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                  //     )}
                  //   </Icon>
                  // }
                  />
                )}
              />

              <Text
                position="absolute"
                right="8px"
                top="50%"
                transform="translateY(-50%)"
                fontSize="14px"
                color="gray.500"
                pointerEvents="none"
              >
                %
              </Text>
            </Box>
            {/* </Box> */}
          </HStack>
        </Box>

        {/* Extended Sessions */}
        <Box>
          <Text
            font="outfit"
            fontSize="1.25rem"
            fontWeight="500"
            color="text_primary"
          // mb={2}
          >
            Extended Sessions
          </Text>
          <Text
            font="outfit"
            fontSize="1rem"
            fontWeight="400"
            color="gray.500"
          // mb={4}
          >
            Set discount for sessions longer than 1 hour
          </Text>
        </Box>
        <HStack justifyContent={"space-between"} alignItems={"center"} w="full">
          {/* <Box position="relative"> */}
          <Box flex="1">
            <Text
              font="outfit"
              fontSize="1rem"
              fontWeight="500"
              color="text_primary"
            >
              2 Hours Session
            </Text>
            <Text
              font="outfit"
              fontSize="0.875rem"
              fontWeight="400"
              color="gray.500"
            >
              Set your 2-hours session discount
            </Text>
          </Box>
          <Box position="relative" maxW="120px">
            <Controller
              name="twoHoursDiscount"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label=""
                  placeholder="0"
                  id="twoHoursPrice"
                  required={false}
                  name="twoHoursPrice"
                  value={value}
                  size="lg"
                  onChange={onChange}
                  error={errors.twoHoursDiscount}
                  hasRightIcon={true}
                  type={"number"}
                // rightIcon={
                //   <Icon mr={"4"}>
                //     {colorMode === "dark" ? (
                //       <Image src="/icons/mailwhite.svg" alt="mail-icon" />
                //     ) : (
                //       <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                //     )}
                //   </Icon>
                // }
                />
              )}
            />

            <Text
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              fontSize="14px"
              color="gray.500"
              pointerEvents="none"
            >
              %
            </Text>
          </Box>
          {/* </Box> */}
        </HStack>
        <HStack justifyContent={"space-between"} alignItems={"center"} w="full">
          {/* <Box position="relative"> */}
          <Box flex="1">
            <Text
              font="outfit"
              fontSize="1rem"
              fontWeight="500"
              color="text_primary"
            >
              3 Hours Session
            </Text>
            <Text
              font="outfit"
              fontSize="0.875rem"
              fontWeight="400"
              color="gray.500"
            >
              Set your 3-hours session discount
            </Text>
          </Box>
          <Box position="relative" maxW="120px">
            <Controller
              name="threeHoursDiscount"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label=""
                  placeholder="0"
                  id="threeHoursPrice"
                  required={false}
                  name="threeHoursPrice"
                  value={value}
                  size="lg"
                  onChange={onChange}
                  error={errors.threeHoursDiscount}
                  hasRightIcon={true}
                  type={"number"}
                // rightIcon={
                //   <Icon mr={"4"}>
                //     {colorMode === "dark" ? (
                //       <Image src="/icons/mailwhite.svg" alt="mail-icon" />
                //     ) : (
                //       <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                //     )}
                //   </Icon>
                // }
                />
              )}
            />

            <Text
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              fontSize="14px"
              color="gray.500"
              pointerEvents="none"
            >
              %
            </Text>
          </Box>
          {/* </Box> */}
        </HStack>
        <HStack justifyContent={"space-between"} alignItems={"center"} w="full">
          {/* <Box position="relative"> */}
          <Box flex="1">
            <Text
              font="outfit"
              fontSize="1rem"
              fontWeight="500"
              color="text_primary"
            >
              4 Hour Session
            </Text>
            <Text
              font="outfit"
              fontSize="0.875rem"
              fontWeight="400"
              color="gray.500"
            >
              Set your 4-hour session discount
            </Text>
          </Box>
          <Box position="relative" maxW="120px">
            <Controller
              name="fourHoursDiscount"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label=""
                  placeholder="0"
                  id="fourHoursPrice"
                  required={false}
                  name="fourHoursPrice"
                  value={value}
                  size="lg"
                  onChange={onChange}
                  error={errors.fourHoursDiscount}
                  hasRightIcon={true}
                  type={"number"}
                // rightIcon={
                //   <Icon mr={"4"}>
                //     {colorMode === "dark" ? (
                //       <Image src="/icons/mailwhite.svg" alt="mail-icon" />
                //     ) : (
                //       <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                //     )}
                //   </Icon>
                // }
                />
              )}
            />

            <Text
              position="absolute"
              right="8px"
              top="50%"
              transform="translateY(-50%)"
              fontSize="14px"
              color="gray.500"
              pointerEvents="none"
            >
              %
            </Text>
          </Box>
          {/* </Box> */}
        </HStack>

        <Box>
          {/* <Text
            font="outfit"
            fontSize="1.25rem"
            fontWeight="500"
            color="text_primary"
            mb={8}
          >
            More than 4-Hours Price
          </Text> */}
          <Box position="relative">
            <Controller
              name="otherHoursDiscount"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CustomInput
                  label="      More than 4-Hours Price"
                  placeholder="0"
                  id="otherHoursPrice"
                  required={false}
                  name="otherHoursPrice"
                  value={value}
                  size="lg"
                  onChange={onChange}
                  error={errors.otherHoursDiscount}
                  hasRightIcon={true}
                  type={"number"}
                // rightIcon={
                //   <Icon mr={"4"}>
                //     {colorMode === "dark" ? (
                //       <Image src="/icons/mailwhite.svg" alt="mail-icon" />
                //     ) : (
                //       <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                //     )}
                //   </Icon>
                // }
                />
              )}
            />

            <Text
              position="absolute"
              right="8px"
              top="60%"
              transform="translateY(-50%)"
              fontSize="14px"
              color="gray.500"
              pointerEvents="none"
            >
              %
            </Text>
          </Box>
          <HStack justifyContent="flex-end" py="12">
            <Button
              px="16"
              py="4"
              borderRadius="8px"
              border="1px solid"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              px="16"
              py="4"
              loading={isLoading}
              loadingText={'...Saving'}
              onClick={handleSubmit(onSubmit, (error) => console.log(error))}
              borderRadius="8px"
              bg="blue.900"
              color="white"
              _hover={{ bg: "blue.800" }}
            >
              Save
            </Button>
          </HStack>
        </Box>

        {/* Footer Buttons */}
      </VStack>
    </Box>
  );
};

export default Pricing;
