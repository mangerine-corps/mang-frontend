import {
  Button,
  Dialog,
  HStack,
  Portal,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";

import CustomButton from "mangarine/components/customcomponents/button";
import { Checkbox } from "mangarine/components/ui/checkbox";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "mangarine/components/customcomponents/Input";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Reschedule from "./rescheduleconsultation";
import { AnyAaaaRecord } from "node:dns";
import { indexOf } from "es-toolkit/compat";
import AreyouCancellingModal from "../../modals/areyoucancelling";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useCancelAppointmentMutation } from "mangarine/state/services/apointment.service";
import { useRouter } from "next/router";
type props = {
  onOpenChange: any;
  isOpen: any;
  info: any;
};
const appointmentSchema = Yup.object().shape({
  clientNote: Yup.string(),
  internalNote: Yup.string(),
});
const AppointmentDetails = ({ onOpenChange, isOpen, info }: props) => {
  const [open, setopen] = useState(false);
  const { user: authUser } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      clientNote: "",
      internalNote: "",
    },
  });
  const onSubmit = () => {
    console.log("here");
  };
  const openModal = () => {
    // onOpenChange()
    setopen(true);
  };
  const [cancelAppointment, { isLoading: isCancelling }] =
    useCancelAppointmentMutation();
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const isConsultantViewer = !!authUser?.isConsultant;
  const counterpart = useMemo(() => {
    if (!info) return null;
    // If viewer is consultant, show the client/user details; otherwise show the consultant's details
    const maybeConsultant =
      info?.consultant ||
      info?.consultantInfo ||
      info?.creator ||
      info?.provider;
    return isConsultantViewer ? info?.user : maybeConsultant;
  }, [info, isConsultantViewer]);
  const { user, message, timeslots, status } = info;
  console.log(info, message, timeslots, "info");
  const router = useRouter();
  const { consultation_id } = router.query as Record<string, string>;
  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={onOpenChange}
      placement={"center"}
      size={"lg"}
      motionPreset="slide-in-bottom"
    >
      {/* <Dialog.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p="8" rounded={"xl"} bg="bg_box">
            <Dialog.Header>
              <Text
                textAlign={"left"}
                w="full"
                py={"6"}
                fontSize={"1.5rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"600"}
              >
                Appointment Details
              </Text>
              <Dialog.Title></Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {info ? (
                <VStack
                  bg="white"
                  flex={1}
                  h="fit-content"
                  // bg="main_background"
                  // overflowY={{ base: "scroll", md: "scroll" }}
                  css={{
                    "&::-webkit-scrollbar": {
                      width: "0px",

                      height: "0px",
                    },
                    "&::-webkit-scrollbar-track": {
                      width: "0px",
                      background: "transparent",

                      height: "0px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "transparent",
                      borderRadius: "0px",
                      maxHeight: "0px",
                      height: "0px",
                      width: 0,
                    },
                  }}
                  rounded={"xl"}
                >
                  <VStack w="full" py="2" alignItems="flex-start">
                    <VStack w="full" rounded="xl">
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w="full"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          Client Name:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                          textTransform="capitalize"
                        >
                          {user.fullName}
                          {/* {isConsultantViewer ? appointment?.consultant?.fullName : appointment?.user?.fullName} */}
                        </Text>
                      </HStack>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w="full"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          Consultation Topic:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          {info?.topic || info?.title || info?.message || "-"}
                        </Text>
                      </HStack>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w="full"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          Consultation time:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          {(() => {
                            const ts = info?.timeslots?.[0] || {};
                            const rawStart = ts?.startTime || info?.startTime;
                            const rawEnd = ts?.endTime || info?.endTime;
                            const rawDate =
                              info?.availability?.date ||
                              info?.date ||
                              ts?.date;

                            const to12h = (t: any) => {
                              if (!t) return null;
                              // If it's a full ISO/date string
                              const d = new Date(t);
                              if (!isNaN(d.getTime())) {
                                return d.toLocaleTimeString([], {
                                  hour: "numeric",
                                  minute: "2-digit",
                                });
                              }
                              // If it's likely HH:mm or HH:mm:ss
                              const m = String(t).match(
                                /^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/
                              );
                              if (m) {
                                let h = parseInt(m[1], 10);
                                const min = m[2];
                                const ampm = h >= 12 ? "PM" : "AM";
                                h = h % 12 || 12;
                                return `${h}:${min} ${ampm}`;
                              }
                              return String(t);
                            };

                            const fmtDate = (d: any) => {
                              if (!d) return null;
                              const dt = new Date(d);
                              if (!isNaN(dt.getTime())) {
                                return dt.toLocaleDateString([], {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                });
                              }
                              return String(d);
                            };

                            const s = to12h(rawStart);
                            const e = to12h(rawEnd);
                            const ds = fmtDate(rawDate);

                            if (s || e || ds) {
                              const timeRange = [s, e]
                                .filter(Boolean)
                                .join(" - ");
                              return [ds, timeRange]
                                .filter(Boolean)
                                .join(" | ");
                            }
                            return "-";
                          })()}
                        </Text>
                      </HStack>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w="full"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          Duration:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          {(() => {
                            const minutes = info?.timeslots?.[0]?.duration;
                            if (!minutes && minutes !== 0) return "-";
                            const h = Math.floor(minutes / 60);
                            const m = minutes % 60;
                            const hStr =
                              h > 0 ? `${h}hr${h > 1 ? "s" : ""}` : "";
                            const mStr =
                              m > 0 ? `${m}mins` : h === 0 ? "0mins" : "";
                            return [hStr, mStr].filter(Boolean).join(":");
                          })()}
                        </Text>
                      </HStack>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w="full"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          Status:
                        </Text>
                        <Text
                          color="#FF9800"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          {info?.status || "Scheduled"}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                  {/* Counterpart Details: Consultant for users, Client for consultants */}
                  {counterpart && (
                    <VStack
                      w="full"
                      py="2"
                      rounded="xl"
                      // p="4"
                      // shadow="xs"
                      mt={2}
                      mb={4}
                      alignItems="stretch"
                    >
                      <Text
                        color="text_primary"
                        fontSize="1.25rem"
                        lineHeight="30px"
                        fontWeight="600"
                        mb={2}
                      >
                        {isConsultantViewer
                          ? "Client Details"
                          : "Consultant Details"}
                      </Text>

                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        w="full"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.0rem"
                          lineHeight="26px"
                          fontWeight="400"
                        >
                          Name:
                        </Text>
                        <Text
                          textTransform="capitalize"
                          color="text_primary"
                          fontSize="1.0rem"
                          lineHeight="26px"
                          fontWeight="500"
                        >
                          {counterpart?.fullName ||
                            counterpart?.name ||
                            counterpart?.userName ||
                            "-"}
                        </Text>
                      </HStack>

                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        w="full"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.0rem"
                          lineHeight="26px"
                          fontWeight="400"
                        >
                          Email:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.0rem"
                          lineHeight="26px"
                          fontWeight="400"
                        >
                          {counterpart?.email ||
                            counterpart?.contactEmail ||
                            "-"}
                        </Text>
                      </HStack>

                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        w="full"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.0rem"
                          lineHeight="26px"
                          fontWeight="400"
                        >
                          Role/Title:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.0rem"
                          lineHeight="26px"
                          fontWeight="400"
                        >
                          {counterpart?.role ||
                            counterpart?.title ||
                            counterpart?.occupation ||
                            "-"}
                        </Text>
                      </HStack>

                      <HStack
                        justifyContent="space-between"
                        alignItems="center"
                        w="full"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.0rem"
                          lineHeight="26px"
                          fontWeight="400"
                        >
                          Phone:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.0rem"
                          lineHeight="26px"
                          fontWeight="400"
                        >
                          {counterpart?.mobileNumber ||
                            counterpart?.phone ||
                            counterpart?.phoneNumber ||
                            "-"}
                        </Text>
                      </HStack>
                    </VStack>
                  )}
                </VStack>
              ) : (
                ""
              )}
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" py={12}>
              {["UPCOMING", "RESCHEDULED"].includes(
                (info?.status || "").toUpperCase()
              ) && (
                <VStack
                  w="full"
                  py="2"
                  rounded="xl"
                  p="4"
                  // shadow="xs"
                >
                  <HStack
                    w="full"
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    flexDir={"row"}
                    // mx="auto"
                  >
                    <CustomButton
                      customStyle={{ flex: 1 }}
                      variant="outline"
                      disabled={isCancelling}
                      onClick={() => setConfirmCancelOpen(true)}
                    >
                      <Text
                        color={""}
                        fontWeight={"600"}
                        fontSize={"1rem"}
                        lineHeight={"100%"}
                      >
                        Cancel Consultation
                      </Text>
                    </CustomButton>

                    <CustomButton
                      customStyle={{
                        flex: 1,
                      }}
                      onClick={() =>router.push(`/consultation/reschedule?consultation_id=${info?.id}`)}
                      // loading={isLoading}
                      // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                    >
                      <Text
                        color={"button_text"}
                        fontWeight={"600"}
                        fontSize={"1rem"}
                        lineHeight={"100%"}
                      >
                        Reschedule
                      </Text>
                    </CustomButton>
                  </HStack>
                </VStack>
              )}
              {/* <AreyouCancellingModal
                isOpen={confirmCancelOpen}
                onOpenChange={() => setConfirmCancelOpen(false)}
                isLoading={isCancelling}
                onConfirm={async () => {
                  if (consultation_id) return;
                  try {
                    await cancelAppointment(consultation_id).unwrap();
                    router.back();
                  } catch (e) {
                    // optionally show a toast
                  }
                }}
              />
              <Reschedule
                isOpen={open}
                onOpenChange={() => {
                  setopen(false);
                }}
              /> */}
            </Dialog.Footer>
            {/* <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger> */}
            {/* <RescheduleSuccessful
              isOpen={open}
              onOpenChange={() => {
                setopen(false);
              }}
            /> */}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default AppointmentDetails;
