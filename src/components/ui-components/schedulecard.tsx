import { Box, Flex, Text, HStack, Button, Image, Link } from "@chakra-ui/react";
import { isEmpty } from "es-toolkit/compat";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { setUpcomingConsultation } from "mangarine/state/reducers/consultant.reducer";
import { useGetUpcomingConsultationQuery } from "mangarine/state/services/apointment.service";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Schedulecard
  = () => {
    const {
      isLoading,
      data: upcomingData,
      currentData,
      error,
    } = useGetUpcomingConsultationQuery({});
    const [upcoming, setUpcoming] = useState([]);
    const { user } = useAuth();
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
      if (!isEmpty(upcomingData)) {
        const { data } = upcomingData;
        setUpcoming(data?.consultations);
        dispatch(setUpcomingConsultation(data?.consultations));
        // const {data:newdata}= data
      } else if (!isEmpty(currentData)) {
        const { data } = currentData;
        dispatch(setUpcomingConsultation(data?.consultations));
      }
    }, [upcomingData, currentData]);

    // console.log(upcoming?.data?.consultations, "up")

    //  const upcomingConsultation =()=>{
    //   if(!user){
    //     upcoming?.data?.consultations.map((item, index)=>{

    //     })
    //   }
    //  }
    return (
      <Box
        w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
        maxW={{ base: "full", md: "340px", lg: "400px" }}
        pb="12px"
        borderRadius="lg"
        // flex={1}
        boxShadow="sm"
        bg="bg_box"
        p="4"
        rounded={"15px"}
        // py="6"
        alignItems={"flex-start"}
      >
        {/* Title */}
        <Text fontSize="xl" fontWeight="bold" mb={4} color="text_primary">
          Activities
        </Text>

        {/* Activity Card */}
        {user ? (
          <>
            {upcoming?.map((item, idx) => (
              <Box
                key={idx}
                // bg="gray.50"

                // p={4}
                mb={4}

              // border="1px solid"
              // borderColor="gray.100"
              >
                <Flex justify="space-between" align="center">
                  <HStack>
                    <Image
                      h="14"
                      w="14"
                      borderRadius="full"
                      src={item.consultant.profilePics}
                      alt="profile-img"
                    />
                    <Box>
                      <Text
                        fontWeight="bold"
                        color="text_primary"
                        fontSize={"0.875rem"}
                      >
                        {item.consultant.fullName}
                      </Text>
                      <Text fontSize="sm" color="grey.500">
                        {item.role}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack>
                    <Box
                      p={4}
                      bg="gray.100"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => {
                        router.push(
                          `/message?conversationId=${item?.conversation?.id}`
                        );
                      }}
                      _hover={{ bg: "gray.200", cursor: "pointer" }}
                    >
                      <Image src="/icons/greyMail.svg" alt="mail-icon" />
                    </Box>
                    <Box
                      p={4}
                      bg="gray.100"
                      borderRadius="md"
                      cursor="pointer"
                      onClick={() => {
                        router.push(
                          `/message/videoconsultation?consultation_id=${item?.id}`
                        );
                      }}
                      _hover={{ bg: "gray.200", cursor: "pointer" }}
                    >
                      <Image src="/icons/greyCamera.svg" alt="camera" />
                    </Box>
                  </HStack>
                </Flex>

                {/* Date & Time */}
                <Flex
                  align="center"
                  justify="space-between"
                  bg="badge_background"
                  p={2}
                  borderRadius="md"
                  mt={4}
                >
                  <HStack color="text_primary" fontSize="sm">
                    <Image src="/icons/cal.svg" alt="calendar" />
                    <Text color="text_primary" fontSize="0.875rem">
                      {item?.dateDisplay}
                    </Text>
                  </HStack>
                  <HStack ml="2" color="text_primary" fontSize="sm">
                    <Image alt="clock" src="/icons/clock.svg" />
                    <Text color="text_primary" fontSize="0.875rem">
                      {item?.timeRangeDisplay}
                    </Text>
                  </HStack>
                </Flex>

                {/* Buttons */}
                <Flex mt={4} gap={3}>
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    borderColor="gray.300"
                    color="button_bg"
                    flex={1}
                    onClick={() =>
                      router.push(
                        `/consultation/cancel?consultation_id=${item?.id}`
                      )
                    }
                    cursor="pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="bt_schedule"
                    color="white"
                    cursor="pointer"
                    onClick={() =>
                      router.push(
                        `/consultation/reschedule?consultation_id=${item?.id}`
                      )
                    }
                    flex={1}
                    _hover={{ bg: "bt_schedule_hover" }}
                  >
                    Reschedule
                  </Button>
                </Flex>
              </Box>
            ))}
          </>
        ) : (
          <>
            {" "}
            {upcoming?.map((item, idx) => (
              <Box
                key={idx}
                // bg="gray.50"

                // p={4}
                mb={4}

              // border="1px solid"
              // borderColor="gray.100"
              >
                <Flex justify="space-between" align="center">
                  <HStack>
                    <Image src={item.user.profilePics} alt="profile-img" />
                    <Box>
                      <Text
                        fontWeight="bold"
                        color="text_primary"
                        fontSize={"0.875rem"}
                      >
                        {item.user.fullName}
                      </Text>
                      <Text fontSize="sm" color="grey.500">
                        {item.role}
                      </Text>
                    </Box>
                  </HStack>

                  <HStack>
                    <Box
                      p={4}
                      bg="gray.100"
                      borderRadius="md"
                      _hover={{ bg: "gray.200", cursor: "pointer" }}
                    >
                      <Image src="/icons/greyMail.svg" alt="mail-icon" />
                    </Box>
                    <Box
                      p={4}
                      bg="gray.100"
                      borderRadius="md"
                      _hover={{ bg: "gray.200", cursor: "pointer" }}
                    >
                      <Image src="/icons/greyCamera.svg" alt="camera" />
                    </Box>
                  </HStack>
                </Flex>

                {/* Date & Time */}
                <Flex
                  align="center"
                  justify="space-between"
                  bg="badge_background"
                  p={2}
                  borderRadius="md"
                  mt={4}
                >
                  <HStack color="text_primary" fontSize="sm">
                    <Image src="/icons/cal.svg" alt="calendar" />
                    <Text color="text_primary" fontSize="0.875rem">
                      {item.dateDisplay}
                    </Text>
                  </HStack>
                  <HStack ml="2" color="text_primary" fontSize="sm">
                    <Image alt="clock" src="/icons/clock.svg" />
                    <Text color="text_primary" fontSize="0.875rem">
                      {item.timeRangeDisplay}
                    </Text>
                  </HStack>
                </Flex>

                {/* Buttons */}
                <Flex mt={4} gap={3}>
                  <Button
                    variant="outline"
                    colorScheme="gray"
                    borderColor="gray.300"
                    color="button_bg"
                    flex={1}
                  >
                    Cancel
                  </Button>
                  <Button
                    bg="bt_schedule"
                    color="white"
                    flex={1}
                    _hover={{ bg: "bt_schedule_hover" }}
                  >
                    Reschedule
                  </Button>
                </Flex>
              </Box>
            ))}
          </>
        )}

        {/* View All */}
        {upcoming.length > 1 && (
          <Text textAlign="center" fontWeight="medium" color="act_text" mt={2}>
            <Text
              onClick={() => {
                router.push("/consultations");
              }}
              cursor="pointer"
            >
              View All
            </Text>
          </Text>
        )}
      </Box>
    );
  };

export default Schedulecard;

