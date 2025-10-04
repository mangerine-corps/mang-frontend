import { Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import CustomButton from '../customcomponents/button';
import { toaster } from '../ui/toaster';
import { useUnblockUserMutation } from 'mangarine/state/services/profile.service';
// import { useUnblockUserMutation } from 'mangarine/state/services/chat-management.service';

type props = {
    title:string,
    details:string,
    onClick?:any,
    buttonText:string,
    info:any
}

export const BlockedComp = ({title,details,onClick,buttonText, info}:props) => {
  const [unblockUser, { isLoading }] = useUnblockUserMutation();
  const [reportUserId, setReportUserId] = useState<string | undefined>(
    undefined
  );
  const handleunBlockUser = async () => {
    try {
      if (!info?.id) throw new Error("User ID is missing");
      await unblockUser({
        userId: info.id,
        reason: "unBlocked from profile menu",
      }).unwrap();
      toaster.create({
        title: "User unblocked",
        type: "success",
        description: `${info?.fullName ?? "User"} has been unblocked successfully`,
        closable: true,
      });
      // dispatch(setBlockedConsultant({ id, isBlocked: showblockPage }));
    } catch (err: any) {
      toaster.create({
        title: "Unblock failed",
        type: "error",
        description:
          err?.data?.message || err?.message || "Unable to unblock user",
        closable: true,
      });
    }
  };

  // const openReportModal = () => {
  //   if (info?.id) setReportUserId(info.id);
  //   setReport(true);
  // };
  return (
    <VStack
      h="full"
      alignItems={"center"}
      justifyContent={"center"}
      // spaceY={"6"}
      w="55%"
      // w={{ base: "95%", md: "280px", lg: "340px", xl: "400px" }}
    >
      {/* Centering the image */}
      {/* <Center alignItems={"center"} pt="4" pb="3">
                  <Image
                    src={"/icons/notcancel.svg"}
                    alt="Regulations Image"
                    // boxSize={6}
                    objectFit="contain"

                    // height="auto"
                  />
                </Center> */}
      <Text
        textAlign={"left"}
        // px={"6"}
        fontSize={"2.5rem"}
        fontFamily={"Outfit"}
        color={"text_primary"}
        fontWeight={"600"}
        w="full"
        pb="3"
      >
        {title}
      </Text>

      <Text
        textAlign={"left"}
        w="full"
        pb={"8"}
        fontSize={"1.5rem"}
        fontFamily={"Outfit"}
        color={"text_primary"}
        fontWeight={"400"}
      >
        {details}
      </Text>
      <CustomButton
        customStyle={{
          w: "full",
        }}
        // onClick={onClick}
        loading={isLoading}
        onClick={handleunBlockUser}
        // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
      >
        <Text
          color={"button_text"}
          fontWeight={"600"}
          fontSize={"1rem"}
          lineHeight={"100%"}
        >
          Unblock
        </Text>
      </CustomButton>
    </VStack>
  );
}
