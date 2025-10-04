
"use client";;
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Menu,
  Portal,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import { IoCall } from "react-icons/io5";
import { FaMicrophoneSlash } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa6";

import { FiMaximize } from "react-icons/fi";
import {
  LocalUser, // Plays the microphone audio track and the camera video track
  RemoteUser, // Plays the remote user audio and video tracks
  useIsConnected, // Returns whether the SDK is connected to Agora's server
  useJoin, // Automatically join and leave a channel on mount and unmount
  useLocalMicrophoneTrack, // Create a local microphone audio track
  useLocalCameraTrack, // Create a local camera video track
  usePublish, // Publish the local tracks
  useRemoteUsers, // Retrieve the list of remote users
} from "agora-rtc-react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { BiChevronDown, BiChevronLeft } from "react-icons/bi";
import AppLayout from "mangarine/layouts/AppLayout";
import SessionEnded from "mangarine/components/ui-components/modals/sessionended";
import ThankYouModal from "mangarine/components/ui-components/modals/thankyoumadl";
import LeftMeeting from "mangarine/components/ui-components/modals/leftmeeting";
import ReviewModal from "mangarine/components/ui-components/modals/reviewmodal";
import { useRouter } from "next/router";
import { useGetVideoTokenMutation } from "mangarine/state/services/apointment.service";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { isEmpty } from "es-toolkit/compat";
import dynamic from "next/dynamic";
// import VideoCalling from "mangarine/components/ui-components/video/agoravideocontainer";
const appId = process.env.AGORA_APP_ID

const DynamicAgoraVideoCall = dynamic(
  () => import('mangarine/components/ui-components/video/agoravideocontainer'),
  { ssr: false } // THIS IS THE KEY PART!
);

const part1 = "/images/participant1.png";
const part2 = "/images/participant2.png";
const up = "/images/up.png";
const menu = "/icons/videomenu.svg";

const cvideo = "/icons/video.svg";
const video_slash = "/icons/video-slash.svg";
const monitor = "/icons/monitor.svg";
const text = "/icons/test.svg";
const mic = "/icons/micvideo.svg";
const smile = "/icons/happy.svg";
const partvid = "/icons/main_backgroundcam.svg";
const partvidslash = "/icons/main_backgroundcamslash.svg";


const partdp1 = "/images/dp.png";
const partdp3 = "/images/dp2.png";


const VideoConsultation = () => {
  const router = useRouter();
  const { consultationId } = router.query;

  // const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
  // const [showAllParticipant, setShowAllParticipant] = useState(false);
  // const { currentConversation } = useAppointment()
  // const [togglePbtn, setTogglePbtn] = useState(false);
  // const [endSession, setEndSession] = useState(false);
  // const [leftMeeting, setLeftMeeting] = useState(false);
  // const [thankYou, setThankYou] = useState(false);
  // const [rating, setRating] = useState(false);
  // const router = useRouter();
  // const [videoToken, setVideoToken] = useState('')
  // const [calling, setCalling] = useState(false)
  // useJoin({ appid: appId, channel: currentConversation.id, token: videoToken ? videoToken : null }, calling)
  // const [micOn, setMic] = useState(true);
  // const [cameraOn, setCamera] = useState(true);
  // const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  // const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  // usePublish([localMicrophoneTrack, localCameraTrack]);

  // const [getVideoToken, { isLoading }] = useGetVideoTokenMutation()

  // useEffect(() => {
  //   getVideoToken(currentConversation.id).unwrap().then((payload) => {
  //     setVideoToken(payload.token);
  //   }).catch((error) => {
  //     console.log(error)
  //   })
  // }, [])

  // useEffect(() => {
  //   if (!isEmpty(videoToken)) {

  //   }
  // }, [videoToken])


  return (
    <DynamicAgoraVideoCall consultationId={consultationId as string} />
  )

}

export default VideoConsultation

