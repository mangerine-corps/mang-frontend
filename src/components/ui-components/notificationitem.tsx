import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
const profile = "/images/dp.png";

const NotificationItem = ({
  item,
  hasRefund,
  hasReschedule,
  handleRefund,
}: {
  item: any;
  hasRefund?: boolean;
  hasReschedule?: boolean;
  handleRefund?: () => void;
}) => {
  console.log(item)
  return (
    <HStack spaceX={3} py={2} w="full" alignItems={"flex-start"}>
      <Image
        alt="profile image"
        align={"image profile"}
        width={12}
        height={12}
        src={profile}
      />
      <VStack>
        <HStack w="full" justifyContent={"space-between"}>
          <Text fontWeight={"600"} fontFamily={"Outfit"} fontSize={"1rem"}>
            New Friend Request
          </Text>
          <Text fontWeight={"400"} fontFamily={"Outfit"} fontSize={"0.875rem"}>
            4:30pm
          </Text>
        </HStack>
        <HStack>
          <Text
            fontWeight={"400"}
            textAlign={"justify"}
            fontFamily={"Outfit"}
            fontSize={"0.875rem"}
          >
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Modi optio
            ipsam soluta aliquam minima nihil praesentium molestias delectus
            tempore in, blanditiis qui cum? Eaque ad aperiam commodi sunt maxime
            numquam.
          </Text>
        </HStack>
        <HStack w="full" justifyContent={"flex-end"}>
          {hasRefund && (
            <Button
              display="flex"
              w="full"
              size={{ lg: "sm", "2xl": "md" }}
              borderRadius={"lg"}
              bg={"transparent"}
              color={"primary.300"}
              borderWidth={1}
              borderColor={"primary.300"}
              justifyContent="center"
              alignItems="center"
              alignSelf="stretch"
              width={{ base: "100%", md: "auto" }} // Responsive width
              onClick={handleRefund}
            >
              Request Refund
            </Button>
          )}
          {hasReschedule && (
            <Button
              display="flex"
              w="full"
              size={{ lg: "sm", "2xl": "md" }}
              borderRadius={"lg"}
              borderWidth={0}
              bg={"primary.300"}
              justifyContent="center"
              alignItems="center"
              alignSelf="stretch"
              color={"white"}
              width={{ base: "100%", md: "auto" }} // Responsive width
              onClick={() => {}}
            >
              Reschedule
            </Button>
          )}
        </HStack>
      </VStack>
    </HStack>
  );
};

export default NotificationItem;
