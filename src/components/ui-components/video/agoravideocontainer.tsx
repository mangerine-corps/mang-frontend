import {
    LocalUser,
    RemoteUser,
    useIsConnected,
    useJoin,
    useLocalMicrophoneTrack,
    useLocalCameraTrack,
    usePublish,
    useRemoteUsers,
    IRemoteAudioTrack,
    useVolumeLevel,
    IMicrophoneAudioTrack,
    IRemoteVideoTrack,
    ICameraVideoTrack,
    useRemoteVideoTracks,
    ILocalVideoTrack,
    UID,
} from "agora-rtc-react";

import { DEFAULT_AVATAR } from "mangarine/lib/constants";
const part1 = DEFAULT_AVATAR;
const part2 = DEFAULT_AVATAR;
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
import { BsCameraVideoFill, BsCameraVideoOff } from "react-icons/bs";
import { TbMicrophoneFilled, TbMicrophoneOff } from "react-icons/tb";

const partdp1 = DEFAULT_AVATAR;
import { FC, useEffect, useRef, useState, useMemo } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { useGetVideoTokenMutation, useGetConversationMutation, useGetAppointmentByIdQuery, useRequestTimeExtensionMutation } from "mangarine/state/services/apointment.service";
import { formatSessionTime } from "mangarine/hooks/useCountdown";
import { setCurrentConversation } from "mangarine/state/reducers/appointment.reducer";
import { useDispatch } from "react-redux";
import { useConsultationJoin } from "../../../hooks/useConsultationJoin";
import { Avatar, AvatarGroup, Box, Button, Flex, HStack, Icon, IconButton, Image, Input, Stack, Text, VStack, Menu, Portal, Dialog, CloseButton, Tooltip } from '@chakra-ui/react';
import { useAuth } from "mangarine/state/hooks/user.hook";
import { BiChevronLeft, BiChevronDown } from "react-icons/bi";
import { useRouter } from "next/router";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { socket as globalSocketInstance } from 'mangarine/state/services/socket.service';
import { RiRecordCircleFill, RiStopCircleFill } from "react-icons/ri";
import { toaster } from "mangarine/components/ui/toaster";
import {
    SmileIcon, Users, Grid2x2, MonitorUp, FileText, X, Download,
    ChevronRight, MoreVertical, FlipHorizontal2, Camera, MessageSquare, PlusCircle,
    Check, Mic, Volume2, Video,
} from "lucide-react";
import { VirtualBackgroundProcessor, VirtualBackgroundOptions, PREDEFINED_BACKGROUNDS } from "mangarine/utils/virtualBackground";

const stringToAgoraUid = (userId: string): number => {
    let hash = 0;

    for (let i = 0; i < userId.length; i += 1) {
        const char = userId.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash;
    }

    return Math.abs(hash);
};


const VideoActions = ({
    icon,
    activeIcon,
    canToggle,
    onClick,
    toggleStatus = false,
    ...props
}: {
    icon: any;
    activeIcon?: any
    onClick: () => void;
    canToggle?: boolean;
    toggleStatus?: boolean;
}) => {
    return (
        <IconButton
            pos={"relative"}
            aria-label="back button"
            rounded="full"
            size={"md"}
            onClick={() => {
                if (canToggle) {
                    onClick()
                }
            }}
            borderWidth={1}
            borderColor={"gray.300"}
            color={"primary.200"}
            bg={"main_background"}
            shadow={"lg"}
            boxShadow={"lg"}
            {...props}
        >
            {toggleStatus ? (
                <Icon color="text_primary">
                    {icon}
                </Icon>
            ) : (
                <Icon color="text_primary">
                    {activeIcon}
                </Icon>
            )}

        </IconButton>
    );
};

type Props = {
    children: React.ReactNode;
    item: any,
    onRemoteAudio: () => void,
    offRemoteAudio: () => void,
    toggleVideo: () => void,
    audioTrack: IRemoteAudioTrack;
    videoTrack: IRemoteVideoTrack;
}
const Participant: FC<Props> = ({ item, audioTrack, videoTrack, children, onRemoteAudio, offRemoteAudio, toggleVideo }) => {
    const volumeLevel = useVolumeLevel(audioTrack)
    const [videoStatus, setVideoStatus] = useState(true)
    const videoRef = useRef(null);
    const handleAudio = () => {
        if (volumeLevel > 0) {
            onRemoteAudio()
        } else {
            offRemoteAudio()
        }
    }
    useEffect(() => {
        if (videoRef.current && videoTrack) {
            if (videoStatus) {
                // If the video should be visible, play it into the ref
                videoTrack.play(videoRef.current);
            } else {
                // If not visible, stop the track to free up resources and hide the element
                videoTrack.stop();
            }
        }

        // Cleanup function: stop the video when the component unmounts or user/track changes
        return () => {
            if (videoTrack) {
                videoTrack.stop();
            }
        };
    }, [videoStatus, videoTrack]); // Re-run effect when user or visibility state changes

    const toggleVideoVisibility = () => {
        setVideoStatus(prev => !prev);
    };

    return (
        <Box rounded={"15px"}>
            <Box
                pos={"relative"}
                // bgImage={image}
                ref={videoRef}
                objectFit="cover"
                bgSize={"cover"}
                bgRepeat={"no-repeat"}
                bgPos={"top"}
                minH={{ base: "10rem", sm: "12rem", md: "14rem" }}
                minW={{ base: "10rem", sm: "11rem", md: "12rem" }}
                rounded={"15px"}
            >
                {children}
                <HStack
                    top="1"
                    // px={4}
                    px={{ base: 2, sm: 3 }}
                    rounded="full"
                    spaceX={2}
                    py={2}
                    position={"absolute"}
                >
                    <IconButton
                        aria-label="back button"
                        rounded="full"
                        _hover={{}}
                        size={"xs"}
                        onClick={handleAudio}
                        zIndex={'max'}
                        borderWidth={1}
                        borderColor={"gray.300"}
                        bg={volumeLevel > 0 ? "primary.300" : "red.600"}
                        shadow={"lg"}
                        boxShadow={"lg"}
                    >
                        {volumeLevel > 0 ? (
                            <Icon color="main_background">
                                <TbMicrophoneFilled />
                            </Icon>
                        ) : (
                            <Icon color="main_background">
                                <TbMicrophoneOff />
                            </Icon>
                        )}
                    </IconButton>
                    <IconButton
                        aria-label="back button"
                        rounded="full"
                        size={"xs"}
                        _hover={{}}
                        onClick={toggleVideo}
                        borderWidth={1}
                        borderColor={"gray.300"}
                        color={"primary.200"}
                        bg={videoStatus ? "primary.300" : "red.600"}
                        shadow={"lg"}
                        zIndex={'max'}
                        boxShadow={"lg"}
                    >
                        {videoStatus ? (
                            <Icon color="main_background">
                                <BsCameraVideoFill />
                            </Icon>
                        ) : (
                            <Icon color="main_background">
                                <BsCameraVideoOff />
                            </Icon>
                        )}
                    </IconButton>
                </HStack>
            </Box>
        </Box>
    );
};

// Google Meet–style pre-join panel
export const PreJoinPanel: React.FC<{
    appId?: string;
    channel?: string;
    calling: boolean;
    setCalling: (v: boolean) => void;
    cameraOn: boolean;
    setCamera: (updater: (v: boolean) => boolean) => void;
    micOn: boolean;
    setMic: (updater: (v: boolean) => boolean) => void;
    localCameraTrack: ICameraVideoTrack | null;
    localMicrophoneTrack: IMicrophoneAudioTrack | null;
    consultationName?: string;
    tokenReady?: boolean;
    joinError?: string | null;
    onRetry?: () => void;
}> = ({ appId, channel, calling, setCalling, cameraOn, setCamera, micOn, setMic, localCameraTrack, localMicrophoneTrack, consultationName, tokenReady = true, joinError, onRetry }) => {
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string | undefined>();
    const [selectedMic, setSelectedMic] = useState<string | undefined>();
    const preJoinVideoRef = useRef<any>(null);

    useEffect(() => {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                setCameras(devices.filter((d) => d.kind === 'videoinput'));
                setMicrophones(devices.filter((d) => d.kind === 'audioinput'));
            });
        }
    }, []);

    useEffect(() => {
        if (selectedCamera && localCameraTrack?.setDevice) {
            localCameraTrack.setDevice(selectedCamera).catch(() => { });
        }
    }, [selectedCamera, localCameraTrack]);

    useEffect(() => {
        if (selectedMic && localMicrophoneTrack?.setDevice) {
            localMicrophoneTrack.setDevice(selectedMic).catch(() => { });
        }
    }, [selectedMic, localMicrophoneTrack]);

    useEffect(() => {
        if (!calling && cameraOn && preJoinVideoRef.current && localCameraTrack) {
            localCameraTrack.play(preJoinVideoRef.current);
            return () => { localCameraTrack.stop(); };
        }
    }, [calling, cameraOn, localCameraTrack]);

    const toggleBtn = (active: boolean, activeColor = "white") => ({
        borderRadius: "full" as const,
        w: "44px",
        h: "44px",
        p: 0,
        bg: active ? "rgba(255,255,255,0.15)" : "rgba(220,38,38,0.85)",
        backdropFilter: "blur(4px)",
        borderWidth: "1px",
        borderColor: active ? "rgba(255,255,255,0.3)" : "transparent",
        color: activeColor,
        _hover: { transform: "scale(1.06)" },
        transition: "all 0.15s",
    });

    return (
        <Flex w="full" h="full" align="center" justify="center" bg="white" p={6} direction="column">
            {/* Header */}
            <VStack gap={0} mb={6} textAlign="center">
                <Text fontSize="0.95rem" color="#5f6368">You are joining</Text>
                <Text fontSize="1.35rem" fontWeight="700" color="#202124" fontFamily="Outfit">
                    {consultationName || "Consultation"}
                </Text>
            </VStack>

            {/* Video preview box */}
            <Box
                position="relative"
                w="full"
                maxW="680px"
                borderRadius="16px"
                overflow="hidden"
                bg="#202124"
                mb={4}
                style={{ aspectRatio: "16/9" }}
            >
                {cameraOn ? (
                    <Box ref={preJoinVideoRef} w="full" h="full" />
                ) : (
                    <Flex align="center" justify="center" w="full" h="full">
                        <Box
                            w="80px"
                            h="80px"
                            borderRadius="full"
                            bg="#3c4043"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <BsCameraVideoOff size={32} color="white" />
                        </Box>
                    </Flex>
                )}

                {/* Camera flip — top right */}
                <IconButton
                    aria-label="Flip camera"
                    position="absolute"
                    top={3}
                    right={3}
                    {...toggleBtn(true)}
                    onClick={() => { }}
                >
                    <FlipHorizontal2 size={18} color="white" />
                </IconButton>

                {/* Mic + Camera toggles — bottom center */}
                <HStack
                    position="absolute"
                    bottom={4}
                    left="50%"
                    transform="translateX(-50%)"
                    gap={4}
                >
                    <IconButton
                        aria-label={micOn ? "Mute" : "Unmute"}
                        {...toggleBtn(micOn)}
                        onClick={() => setMic((v) => !v)}
                    >
                        {micOn
                            ? <TbMicrophoneFilled size={20} color="white" />
                            : <TbMicrophoneOff size={20} color="white" />}
                    </IconButton>
                    <IconButton
                        aria-label={cameraOn ? "Turn off camera" : "Turn on camera"}
                        {...toggleBtn(cameraOn)}
                        onClick={() => setCamera((v) => !v)}
                    >
                        {cameraOn
                            ? <BsCameraVideoFill size={18} color="white" />
                            : <BsCameraVideoOff size={18} color="white" />}
                    </IconButton>
                </HStack>
            </Box>

            {/* Device pickers */}
            <HStack gap={3} w="full" maxW="680px" mb={5}>
                <Box flex={1}>
                    <select
                        value={selectedCamera}
                        onChange={(e) => setSelectedCamera(e.target.value)}
                        disabled={!cameras.length}
                        style={{
                            width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0',
                            borderRadius: 8, fontSize: 13, color: '#3c4043', background: 'white',
                        }}
                    >
                        <option value="">{cameras.length ? 'Camera' : 'No camera'}</option>
                        {cameras.map((d) => <option key={d.deviceId} value={d.deviceId}>{d.label || 'Camera'}</option>)}
                    </select>
                </Box>
                <Box flex={1}>
                    <select
                        value={selectedMic}
                        onChange={(e) => setSelectedMic(e.target.value)}
                        disabled={!microphones.length}
                        style={{
                            width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0',
                            borderRadius: 8, fontSize: 13, color: '#3c4043', background: 'white',
                        }}
                    >
                        <option value="">{microphones.length ? 'Microphone' : 'No microphone'}</option>
                        {microphones.map((d) => <option key={d.deviceId} value={d.deviceId}>{d.label || 'Microphone'}</option>)}
                    </select>
                </Box>
            </HStack>

            {/* Error message */}
            {joinError && (
                <VStack gap={2} mb={2} maxW="680px" w="full" align="center">
                    <Text color="red.500" fontSize="0.875rem" textAlign="center">
                        {joinError}
                    </Text>
                    {onRetry && (
                        <Button
                            size="sm"
                            variant="outline"
                            borderColor="#1C275D"
                            color="#1C275D"
                            borderRadius="8px"
                            onClick={onRetry}
                            _hover={{ bg: "#f0f2f8" }}
                        >
                            Try Again
                        </Button>
                    )}
                </VStack>
            )}

            {/* Join Room button */}
            <Button
                disabled={!appId || !channel || calling || !tokenReady}
                loading={calling || !tokenReady}
                loadingText={!tokenReady ? "Preparing..." : "Joining..."}
                onClick={() => setCalling(true)}
                w="full"
                maxW="680px"
                h="52px"
                bg="#1C275D"
                color="white"
                borderRadius="12px"
                fontSize="1rem"
                fontWeight="600"
                _hover={{ bg: "#16214F" }}
                _active={{ transform: "scale(0.99)" }}
            >
                Join Room
            </Button>
        </Flex>
    );
};
const SideParticipant = ({ name, image }: { name?: any; image: any }) => {
    const [micStatus, setMicStatus] = useState(false);
    const [videoStatus, setVideoStatus] = useState(false);

    return (
        <Box
            rounded={"full"}
            borderWidth={0.5}
            borderColor={"gray.50"}
            shadow="md"
            boxShadow={"md"}
            w="90%"
            p={3}
            px={3}
            bg="main_background"
        >
            <HStack justifyContent={"space-between"} w="full" rounded={"15px"}>
                <HStack>
                    <Image h={12} alt="" rounded={"full"} src={image} />
                    <Text color="text_primary">{name}</Text>
                </HStack>
                <HStack top="1" px={4} rounded="full" spaceX={2} py={2}>
                    <IconButton
                        aria-label="back button"
                        rounded="full"
                        _hover={{}}
                        size={"md"}
                        onClick={() => setMicStatus(!micStatus)}
                        borderWidth={1}
                        borderColor={"gray.50"}
                        color={"primary.200"}
                        bg={"main_background"}
                        shadow={"lg"}
                        boxShadow={"lg"}
                    >
                        {micStatus ? (
                            <Icon color="primary.300" boxSize={"1.25rem"} >
                                <FaMicrophone />
                            </Icon>
                        ) : (
                            <Icon
                                color="primary.300"
                                boxSize={"1.5rem"}
                            >
                                <FaMicrophoneSlash />
                            </Icon>
                        )}
                    </IconButton>
                    <IconButton
                        aria-label="back button"
                        rounded="full"
                        size={"md"}
                        _hover={{}}
                        onClick={() => setVideoStatus(!videoStatus)}
                        borderWidth={1}
                        borderColor={"gray.50"}
                        color={"primary.200"}
                        bg={"main_background"}
                        shadow={"lg"}
                        boxShadow={"lg"}
                    >
                        {videoStatus ? (
                            <Image src={"/icons/camera.svg"} alt="" />
                        ) : (
                            <Image src={video_slash} alt="" />
                        )}
                    </IconButton>
                </HStack>
            </HStack>
        </Box>
    );
};
const ChatRoomMessage = ({
    onClick,
    img,
    chatInfo,
}: {
    onClick: any;
    img: any;
    chatInfo: any;
}) => {
    return (
        <Box px={"3"} cursor={"pointer"} onClick={onClick}>
            <HStack
                display={"flex"}
                py={4}
                flexDir={"row"}
                px={4}
                justifyContent={"space-between"}
                alignItems={"flex-start"}
                spaceX={4}
            >
                <Box rounded={"full"}>
                    <Image w={24} src={img} alt={"display-img"} />
                </Box>
                <HStack
                    display={"flex"}
                    flexDir={"row"}
                    alignItems={"flex-start"}
                    justifyContent={"flex-start"}
                // mx={1}
                // w={"80%"}
                >
                    <Stack
                        px={2}
                        _hover={{ bg: "primary.150" }}
                        rounded={"6px"}
                        py={2}
                        border={"1px"}
                        borderColor={"gray.50"}
                    >
                        <Text
                            fontFamily={"outfit"}
                            fontWeight={"400"}
                            fontSize={"16px"}
                            color={"grey.500"}
                        >
                            {chatInfo}
                            I’m in a noisy environment sir so i cant talk. Thank you for
                            understanding sir
                        </Text>
                    </Stack>
                </HStack>
            </HStack>
        </Box>
    );
};

// Non-persistent chat message interface
interface VideoChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderImage?: string;
    message: string;
    timestamp: Date;
    isOwn: boolean;
}

// Client must be created once and remain stable across renders.
// Creating it inside the render function causes a new instance on every re-render,
// which Agora cannot handle and throws CAN_NOT_GET_GATEWAY_SERVER internally.
const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export const VideoCalling = ({ consultationId }: { consultationId?: string }) => {
    return (
        <AgoraRTCProvider client={agoraClient}>
            <VideoContainer consultationId={consultationId} />
        </AgoraRTCProvider>
    );
};

const VideoContainer = ({ consultationId }: { consultationId?: string }) => {
    const [calling, setCalling] = useState(false);
    const [isLoadingConversation, setIsLoadingConversation] = useState(false);
    const [tokenReady, setTokenReady] = useState(false);
    const [joinError, setJoinError] = useState<string | null>(null);
    const joinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { currentConversation } = useAppointment();
    const isConnected = useIsConnected();
    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID ?? "";
    const [token, setToken] = useState("");
    const { user, token: authToken } = useAuth()
    const router = useRouter()
    const [endSession, setEndSession] = useState(false);
    const [leftMeeting, setLeftMeeting] = useState(false);
    const containerRef = useRef(null)
    const [thankYou, setThankYou] = useState(false);
    const [rating, setRating] = useState(false);
    const [micOn, setMic] = useState(true);
    const [cameraOn, setCamera] = useState(true);

    const { localMicrophoneTrack } = useLocalMicrophoneTrack(true);
    const { localCameraTrack } = useLocalCameraTrack(true);

    // Use setEnabled to mute/unmute without destroying the track
    useEffect(() => {
        localMicrophoneTrack?.setEnabled(micOn).catch(() => {});
    }, [micOn, localMicrophoneTrack]);

    useEffect(() => {
        localCameraTrack?.setEnabled(cameraOn).catch(() => {});
    }, [cameraOn, localCameraTrack]);
    const { markUserJoined } = useConsultationJoin();
    const [hasMarkedJoined, setHasMarkedJoined] = useState(false);


    // Screen sharing states
    const [screenShareOn, setScreenShareOn] = useState(false);
    const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [localVideoReady, setLocalVideoReady] = useState(false);

    // Device selection
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
    const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);
    const [activeMicId, setActiveMicId] = useState<string>('default');
    const [activeCameraId, setActiveCameraId] = useState<string>('default');
    const [activeSpeakerId, setActiveSpeakerId] = useState<string>('default');

    useEffect(() => {
        AgoraRTC.getCameras().then(d => { setCameras(d); if (d[0]) setActiveCameraId(d[0].deviceId); }).catch(() => {});
        AgoraRTC.getMicrophones().then(d => { setMicrophones(d); if (d[0]) setActiveMicId(d[0].deviceId); }).catch(() => {});
        AgoraRTC.getPlaybackDevices().then(d => { setSpeakers(d); if (d[0]) setActiveSpeakerId(d[0].deviceId); }).catch(() => {});
    }, []);

    // Ensure video track is properly enabled when available
    useEffect(() => {
        if (localCameraTrack && cameraOn && !screenShareOn) {
            // Force a re-render to ensure video is displayed
            setForceUpdate(prev => prev + 1);
        }
    }, [localCameraTrack, cameraOn, screenShareOn]);

    // Force re-render when connection status changes to ensure video displays
    useEffect(() => {
        if (isConnected && localCameraTrack && cameraOn) {
            setTimeout(() => {
                setForceUpdate(prev => prev + 1);
            }, 100);
        }
    }, [isConnected, localCameraTrack, cameraOn]);

    // Mark user as joined when they connect to the video call
    useEffect(() => {
        if (isConnected && currentConversation?.id && !hasMarkedJoined) {
            // The endpoint expects the UUID of the messaging conversation linked to the appointment,
            // not the appointment ID itself. The appointment object carries this as `conversationId`.
            const convId: string | undefined =
                (currentConversation as any)?.conversationId ??
                (currentConversation as any)?.conversation?.id;

            if (!convId) {
                // No conversation UUID available — mark as done so we don't retry
                setHasMarkedJoined(true);
                return;
            }

            markUserJoined(convId)
                .then(() => setHasMarkedJoined(true))
                .catch(() => {
                    setHasMarkedJoined(true); // prevent repeated attempts
                });
        }
    }, [isConnected, currentConversation?.id, hasMarkedJoined, markUserJoined]);


    // Recording states
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const recordingStartTimeRef = useRef<number | null>(null);
    const recordingTimerRef = useRef<any>(null);
    const [recordingElapsed, setRecordingElapsed] = useState<string>("00:00");
    
    // Virtual background states
    const [virtualBgProcessor, setVirtualBgProcessor] = useState<VirtualBackgroundProcessor | null>(null);
    const [virtualBgOptions, setVirtualBgOptions] = useState<VirtualBackgroundOptions>({ type: 'none' });
    const [showVirtualBgPanel, setShowVirtualBgPanel] = useState(false);
    const [isVirtualBgLoading, setIsVirtualBgLoading] = useState(false);
    const virtualBgCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const virtualBgVideoRef = useRef<HTMLVideoElement | null>(null);
    const virtualBgStreamRef = useRef<MediaStream | null>(null);
    const virtualBgAnimationRef = useRef<number | null>(null);
    const mixedAudioContextRef = useRef<AudioContext | null>(null);
    const displayStreamRef = useRef<MediaStream | null>(null); // legacy, no longer used with canvas capture
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasStreamRef = useRef<MediaStream | null>(null);
    const drawAnimationRef = useRef<number | null>(null);
    const primaryVideoElRef = useRef<HTMLVideoElement | null>(null);
    const pipVideoElRef = useRef<HTMLVideoElement | null>(null);

    // Toggle screen sharing
    const toggleScreenShare = async () => {
        if (!screenShareOn) {
            try {
                const result = await AgoraRTC.createScreenVideoTrack({}, "auto");
                // createScreenVideoTrack with "auto" may return [videoTrack, audioTrack] or just videoTrack
                const videoTrack: ILocalVideoTrack = Array.isArray(result) ? result[0] : result as ILocalVideoTrack;
                setScreenTrack(videoTrack);
                setScreenShareOn(true);
                // Keep camera ON — we show it in PiP while screen sharing
                setForceUpdate((p) => p + 1);
                // Auto stop when user ends share via browser UI
                try {
                    videoTrack.on && (videoTrack as any).on('track-ended', () => {
                        setScreenTrack(null);
                        setScreenShareOn(false);
                        setForceUpdate((p) => p + 1);
                    });
                } catch { }
            } catch (error: any) {
                // Handle user cancelling the share dialog quietly (browser and Agora variants)
                const code = (error?.code || error?.name || '').toString();
                const msg = (error?.message || '').toString();
                const userCanceled =
                    code.includes('PERMISSION_DENIED') ||
                    code.includes('NotAllowedError') ||
                    code.includes('NotAllowedErrorError') ||
                    msg.toLowerCase().includes('permission denied') ||
                    msg.toLowerCase().includes('not allowed');
                if (userCanceled) {
                    toaster.create({
                        title: 'Screen share cancelled',
                        type: 'info',
                        duration: 2000,
                        closable: true,
                    });
                    // Ensure flags remain off
                    setScreenTrack(null);
                    setScreenShareOn(false);
                    setCamera(true);
                    return;
                }
                console.error("Failed to start screen sharing:", error);
            }
        } else {
            if (screenTrack) {
                try {
                    screenTrack.stop();
                    // @ts-ignore optional api
                    screenTrack.close && screenTrack.close();
                } catch (err) {
                    console.error("Error stopping screen share:", err);
                }
            }
            setScreenTrack(null);
            setScreenShareOn(false);
            setForceUpdate(prev => prev + 1);
        }
    };

    // Cleanup screen track on unmount
    useEffect(() => {
        return () => {
            if (screenTrack) {
                screenTrack.stop();
                // @ts-ignore
                screenTrack.close && screenTrack.close();
            }
        };
    }, [screenTrack]);

    // Initialize virtual background processor
    useEffect(() => {
        let isMounted = true;
        let processor: VirtualBackgroundProcessor | null = null;

        const initVirtualBackground = async () => {
            try {
                processor = new VirtualBackgroundProcessor();
                await processor.initialize();
                if (!isMounted) {
                    processor.cleanup();
                    return;
                }
                setVirtualBgProcessor(processor);
            } catch (error) {
                console.error('Failed to initialize virtual background:', error);
            }
        };
        
        initVirtualBackground();
        
        return () => {
            isMounted = false;
            if (processor) {
                processor.cleanup();
            }
            if (virtualBgAnimationRef.current) {
                cancelAnimationFrame(virtualBgAnimationRef.current);
            }
            if (virtualBgStreamRef.current) {
                virtualBgStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Apply virtual background processing
    const applyVirtualBackground = async (options: VirtualBackgroundOptions) => {
        if (!virtualBgProcessor || !localCameraTrack) return;
        
        setIsVirtualBgLoading(true);
        
        try {
            if (options.type === 'none') {
                // Disable virtual background
                if (virtualBgAnimationRef.current) {
                    cancelAnimationFrame(virtualBgAnimationRef.current);
                    virtualBgAnimationRef.current = null;
                }
                if (virtualBgStreamRef.current) {
                    virtualBgStreamRef.current.getTracks().forEach(track => track.stop());
                    virtualBgStreamRef.current = null;
                }
                setVirtualBgOptions(options);
                setIsVirtualBgLoading(false);
                return;
            }
            
            // Background image will be handled in processFrame method
            
            // Create video element from camera track
            const videoEl = document.createElement('video');
            videoEl.playsInline = true;
            videoEl.muted = true;
            videoEl.autoplay = true;
            
            const mediaStreamTrack = (localCameraTrack as any).getMediaStreamTrack();
            videoEl.srcObject = new MediaStream([mediaStreamTrack]);
            await videoEl.play();
            
            virtualBgVideoRef.current = videoEl;
            
            // Start processing loop
            const processFrame = async () => {
                if (!virtualBgProcessor || !videoEl || videoEl.videoWidth === 0) {
                    virtualBgAnimationRef.current = requestAnimationFrame(processFrame);
                    return;
                }
                
                try {
                    const processedCanvas = await virtualBgProcessor.processFrame(videoEl, options);
                    virtualBgCanvasRef.current = processedCanvas;
                    
                    // For testing: directly show the processed canvas
                    // Find the video element and replace its content with the processed canvas
                    const videoContainer = videoEl.parentElement;
                    if (videoContainer && processedCanvas) {
                        // Hide the original video
                        videoEl.style.display = 'none';
                        
                        // Show the processed canvas
                        processedCanvas.style.width = '100%';
                        processedCanvas.style.height = '100%';
                        processedCanvas.style.objectFit = 'cover';
                        processedCanvas.id = 'virtual-bg-canvas';
                        
                        // Remove existing canvas if any
                        const existingCanvas = videoContainer.querySelector('#virtual-bg-canvas');
                        if (existingCanvas) {
                            existingCanvas.remove();
                        }
                        
                        // Add the new processed canvas
                        videoContainer.appendChild(processedCanvas);
                        
                        console.log('Virtual background canvas displayed');
                    }
                } catch (error) {
                    console.error('Error processing virtual background frame:', error);
                }
                
                virtualBgAnimationRef.current = requestAnimationFrame(processFrame);
            };
            
            virtualBgAnimationRef.current = requestAnimationFrame(processFrame);
            setVirtualBgOptions(options);
            
        } catch (error) {
            console.error('Failed to apply virtual background:', error);
            toaster.create({
                title: 'Virtual Background Error',
                description: 'Failed to apply virtual background. Please try again.',
                type: 'error',
                duration: 3000,
            });
        } finally {
            setIsVirtualBgLoading(false);
        }
    };

    // Handle virtual background selection
    const handleVirtualBackgroundChange = async (type: 'none' | 'blur' | 'image', backgroundImage?: string) => {
        const options: VirtualBackgroundOptions = {
            type,
            backgroundImage,
            blurAmount: 10
        };
        
        await applyVirtualBackground(options);
        setShowVirtualBgPanel(false);
    };

    // Helper to format elapsed recording time
    const formatDuration = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const hh = h > 0 ? String(h).padStart(2, '0') + ':' : '';
        return `${hh}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Utility: create a playing HTMLVideoElement from a MediaStreamTrack
    const createVideoElFromTrack = async (track: MediaStreamTrack): Promise<HTMLVideoElement> => {
        const v = document.createElement('video');
        v.playsInline = true;
        v.muted = true; // prevent feedback
        v.autoplay = true;
        v.srcObject = new MediaStream([track]);
        await v.play().catch(() => { });
        return v;
    };

    // Start local recording (canvas composition + mixed mic/remote audio)
    const startRecording = async () => {
        if (isRecording) return;
        try {
            // Prepare audio mixer
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            mixedAudioContextRef.current = audioCtx;
            const destination = audioCtx.createMediaStreamDestination();

            // Add local microphone
            try {
                if (localMicrophoneTrack && typeof (localMicrophoneTrack as any).getMediaStreamTrack === 'function') {
                    const micTrack: MediaStreamTrack = (localMicrophoneTrack as IMicrophoneAudioTrack).getMediaStreamTrack();
                    const micStream = new MediaStream([micTrack]);
                    const micSource = audioCtx.createMediaStreamSource(micStream);
                    micSource.connect(destination);
                }
            } catch (e) {
                console.warn('Mic not available for recording mix:', e);
            }

            // Add remote users audio
            try {
                remoteUsers.forEach((u) => {
                    if (u.audioTrack && typeof u.audioTrack.getMediaStreamTrack === 'function') {
                        const rTrack = u.audioTrack.getMediaStreamTrack();
                        const rStream = new MediaStream([rTrack]);
                        const rSource = audioCtx.createMediaStreamSource(rStream);
                        rSource.connect(destination);
                    }
                });
            } catch (e) {
                console.warn('Remote audio not available for recording mix:', e);
            }

            // Build video composition on an offscreen canvas
            const canvas = document.createElement('canvas');
            const width = 1280;
            const height = 720;
            canvas.width = width;
            canvas.height = height;
            canvasRef.current = canvas;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Failed to get canvas 2D context');

            // Decide primary and PiP sources
            let primaryTrack: MediaStreamTrack | null = null;
            // Prefer screen share if on
            if (screenTrack && typeof (screenTrack as any).getMediaStreamTrack === 'function') {
                // @ts-ignore
                primaryTrack = screenTrack.getMediaStreamTrack();
            } else if (localCameraTrack && typeof (localCameraTrack as any).getMediaStreamTrack === 'function') {
                primaryTrack = (localCameraTrack as ICameraVideoTrack).getMediaStreamTrack();
            }

            // Choose first remote user's video as PiP if available
            let pipTrack: MediaStreamTrack | null = null;
            const firstRemote = remoteUsers.find(u => !!u.videoTrack);
            if (firstRemote && firstRemote.videoTrack && typeof firstRemote.videoTrack.getMediaStreamTrack === 'function') {
                pipTrack = firstRemote.videoTrack.getMediaStreamTrack();
            }

            // Create video elements
            if (primaryTrack) {
                primaryVideoElRef.current = await createVideoElFromTrack(primaryTrack);
            }
            if (pipTrack) {
                pipVideoElRef.current = await createVideoElFromTrack(pipTrack);
            }

            // Draw loop
            const draw = () => {
                if (!ctx) return;
                // background
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, width, height);
                // draw primary full-frame
                const pv = primaryVideoElRef.current;
                if (pv && pv.videoWidth && pv.videoHeight) {
                    // cover behavior
                    const scale = Math.max(width / pv.videoWidth, height / pv.videoHeight);
                    const sw = pv.videoWidth * scale;
                    const sh = pv.videoHeight * scale;
                    const dx = (width - sw) / 2;
                    const dy = (height - sh) / 2;
                    ctx.drawImage(pv, dx, dy, sw, sh);
                }
                // draw PiP bottom-right
                const rv = pipVideoElRef.current;
                if (rv && rv.videoWidth && rv.videoHeight) {
                    const pipW = Math.floor(width * 0.25);
                    const pipH = Math.floor((rv.videoHeight / rv.videoWidth) * pipW);
                    const margin = 16;
                    const x = width - pipW - margin;
                    const y = height - pipH - margin;
                    ctx.save();
                    // rounded rect
                    const radius = 12;
                    ctx.beginPath();
                    ctx.moveTo(x + radius, y);
                    ctx.lineTo(x + pipW - radius, y);
                    ctx.quadraticCurveTo(x + pipW, y, x + pipW, y + radius);
                    ctx.lineTo(x + pipW, y + pipH - radius);
                    ctx.quadraticCurveTo(x + pipW, y + pipH, x + pipW - radius, y + pipH);
                    ctx.lineTo(x + radius, y + pipH);
                    ctx.quadraticCurveTo(x, y + pipH, x, y + pipH - radius);
                    ctx.lineTo(x, y + radius);
                    ctx.quadraticCurveTo(x, y, x + radius, y);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(rv, x, y, pipW, pipH);
                    ctx.restore();
                }
                drawAnimationRef.current = requestAnimationFrame(draw);
            };
            drawAnimationRef.current = requestAnimationFrame(draw);

            // Create MediaStream from canvas
            const canvasStream = (canvas as HTMLCanvasElement).captureStream(30);
            canvasStreamRef.current = canvasStream;

            const combined = new MediaStream([
                ...canvasStream.getVideoTracks(),
                ...destination.stream.getAudioTracks(),
            ]);

            // Select supported mime type
            const mimeTypes = [
                'video/webm;codecs=vp9,opus',
                'video/webm;codecs=vp8,opus',
                'video/webm'
            ];
            const selectedType = mimeTypes.find((t) => MediaRecorder.isTypeSupported(t)) || '';

            const recorder = new MediaRecorder(combined, selectedType ? { mimeType: selectedType } as any : undefined);
            mediaRecorderRef.current = recorder;
            recordedChunksRef.current = [];

            recorder.ondataavailable = (e: BlobEvent) => {
                if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
            };
            recorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: selectedType || 'video/webm' });
                const url = URL.createObjectURL(blob);
                // Auto-download the recording
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                const fileName = `consultation-${currentConversation?.id || 'recording'}-${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 100);
            };

            recorder.start(1000); // gather data every second
            setIsRecording(true);
            recordingStartTimeRef.current = Date.now();
            setRecordingElapsed('00:00');
            if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = setInterval(() => {
                const start = recordingStartTimeRef.current;
                if (!start) return;
                setRecordingElapsed(formatDuration(Date.now() - start));
            }, 1000);
        } catch (err) {
            console.error('Failed to start recording:', err);
            setIsRecording(false);
        }
    };

    const stopRecording = () => {
        if (!isRecording) return;
        try {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
        } catch (e) {
            console.warn('Error stopping recorder:', e);
        }
        // Stop drawing loop and canvas stream
        if (drawAnimationRef.current) {
            cancelAnimationFrame(drawAnimationRef.current);
            drawAnimationRef.current = null;
        }
        if (canvasStreamRef.current) {
            canvasStreamRef.current.getTracks().forEach(t => { try { t.stop(); } catch { } });
            canvasStreamRef.current = null;
        }
        primaryVideoElRef.current = null;
        pipVideoElRef.current = null;
        // Close audio context
        if (mixedAudioContextRef.current) {
            try { mixedAudioContextRef.current.close(); } catch { }
            mixedAudioContextRef.current = null;
        }
        setIsRecording(false);
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
        recordingStartTimeRef.current = null;
    };

    const stopRecordingRef = useRef(stopRecording);
    stopRecordingRef.current = stopRecording;

    // Panel state: 'chat' | 'participants' | null
    const [activePanel, setActivePanel] = useState<'chat' | 'participants' | null>(null);

    const togglePanel = (panel: 'chat' | 'participants') => {
        setActivePanel((prev) => (prev === panel ? null : panel));
    };

    // Non-persistent chat state
    const [chatMessages, setChatMessages] = useState<VideoChatMessage[]>([]);
    const [chatConnected, setChatConnected] = useState(false);
    const socketRef = useRef<any>(null);

    // State for tracking if call is ending
    const [isEndingCall, setIsEndingCall] = useState(false);

    // State for end call confirmation modal
    const [showEndCallModal, setShowEndCallModal] = useState(false);

    // Session timer
    const [callStartTime, setCallStartTime] = useState<number | null>(null);
    const [sessionElapsed, setSessionElapsed] = useState(0);

    // Time extension
    const [showExtendModal, setShowExtendModal] = useState(false);
    const [extendStatus, setExtendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [requestTimeExtension] = useRequestTimeExtensionMutation();

    const [tokenUid, setTokenUid] = useState<UID | null>(null);
    const [tokenRetryCount, setTokenRetryCount] = useState(0);
    const [consultationStatus, setConsultationStatus] = useState<string | null>(null);
    const [getVideoToken, { isLoading }] = useGetVideoTokenMutation();
    const [getConversations] = useGetConversationMutation();
    const dispatch = useDispatch();

    // Fetch appointment directly when consultationId is in URL — this is more reliable
    // than scanning the conversations list which uses message-thread IDs that may differ
    const { data: appointmentData, isLoading: isApptLoading, error: apptError } = useGetAppointmentByIdQuery(
        consultationId as string,
        { skip: !consultationId || !!currentConversation?.id }
    );

    const muteRemoteAudio = (audioTrack: IRemoteAudioTrack | null) => {
        if (!audioTrack) return;
        audioTrack.setVolume(0);
    };

    // Unmute remote audio
    const unmuteRemoteAudio = (audioTrack: IRemoteAudioTrack | null) => {
        if (!audioTrack) return;
        audioTrack.setVolume(100);  // Set to a reasonable volume level
    };
    const fallbackJoinUid = useMemo<UID | null>(() => {
        if (typeof user?.id === "string" && user.id.trim()) {
            return stringToAgoraUid(user.id.trim());
        }

        return null;
    }, [user?.id]);

    const joinUid = useMemo<UID | null>(() => {
        if (tokenUid !== null && tokenUid !== undefined && tokenUid !== "") {
            return tokenUid;
        }

        return fallbackJoinUid;
    }, [tokenUid, fallbackJoinUid]);

    const channelName = consultationId ?? "";

    const joinOptions = useMemo(() => {
        return {
            appid: appId ?? "",
            channel: channelName,
            token: token || null,
            ...(joinUid !== null ? { uid: joinUid } : {}),
        };
    }, [appId, channelName, token, joinUid]);

    // If user clicked Join but the token isn't ready yet, immediately retry the token fetch.
    useEffect(() => {
        if (calling && !token && tokenReady) {
            setJoinError(null);
            setTokenReady(false);
            setTokenRetryCount((c) => c + 1);
        }
    }, [calling]);

    // Only attempt to join when all required params are present and valid.
    // Passing undefined channel or empty appId causes Agora to throw an unhandled exception.
    const canJoin = Boolean(calling && appId && channelName && token);

    useEffect(() => {
        console.log('[Agora] canJoin check:', {
            canJoin,
            calling,
            appId: appId || 'MISSING',
            channel: channelName || 'MISSING',
            token: token ? `${token.slice(0, 20)}...` : 'MISSING',
            uid: joinUid ?? 'AUTO',
            consultationId,
        });
    }, [canJoin, calling, appId, channelName, token, joinUid]);

    const { error: joinErr, data: joinedUid, isLoading: joinLoading } = useJoin(joinOptions, canJoin);

    useEffect(() => {
        console.log('[Agora] useJoin state — isLoading:', joinLoading, '| joinedUid:', joinedUid ?? 'none', '| error:', joinErr ?? 'none');
    }, [joinLoading, joinedUid, joinErr]);

    useEffect(() => {
        if (joinErr) {
            console.error('Agora join error:', joinErr);
            setCalling(false);
            const errCode = (joinErr as any)?.code || '';
            const errMsg = (joinErr as any)?.message || '';
            let friendlyMsg = 'Failed to join the call. Please try again.';
            if (errCode.includes('INVALID_TOKEN') || errCode.includes('CAN_NOT_GET_GATEWAY') || errMsg.includes('invalid token') || errMsg.includes('authorized failed')) {
                friendlyMsg = 'Video token is invalid or expired. Please leave and re-enter the call.';
            } else if (errCode.includes('NETWORK') || errMsg.includes('network')) {
                friendlyMsg = 'Network error. Please check your connection and try again.';
            }
            setJoinError(friendlyMsg);
        }
    }, [joinErr]);
    const publishedTracks = useMemo(() => {
        const tracks = screenShareOn && screenTrack
            ? [localMicrophoneTrack, screenTrack, localCameraTrack]
            : [localMicrophoneTrack, localCameraTrack];
        return tracks.filter(Boolean);
    }, [screenShareOn, screenTrack, localMicrophoneTrack, localCameraTrack]);

    usePublish(publishedTracks as any);

    const remoteUsers = useRemoteUsers();

    const switchCamera = (deviceId: string) => {
        localCameraTrack?.setDevice(deviceId).catch(() => {});
        setActiveCameraId(deviceId);
    };
    const switchMicrophone = (deviceId: string) => {
        localMicrophoneTrack?.setDevice(deviceId).catch(() => {});
        setActiveMicId(deviceId);
    };
    const switchSpeaker = (deviceId: string) => {
        remoteUsers.forEach(u => {
            (u.audioTrack as any)?.setPlaybackDevice?.(deviceId).catch?.(() => {});
        });
        setActiveSpeakerId(deviceId);
    };

    useEffect(() => {
        console.log('[Agora] isConnected:', isConnected, '| channel:', channelName || 'NONE');
    }, [isConnected, currentConversation?.id]);

    const prevRemoteCountRef = useRef(0);
    useEffect(() => {
        console.log('[Agora] remoteUsers changed — count:', remoteUsers.length, '| uids:', remoteUsers.map(u => u.uid));
        if (remoteUsers.length > prevRemoteCountRef.current) {
            try {
                const ctx = new AudioContext();
                const gain = ctx.createGain();
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.connect(ctx.destination);
                [523, 659, 784].forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    osc.connect(gain);
                    osc.start(ctx.currentTime + i * 0.12);
                    osc.stop(ctx.currentTime + i * 0.12 + 0.15);
                });
            } catch { }
        }
        prevRemoteCountRef.current = remoteUsers.length;
    }, [remoteUsers]);

    // Fetch token using appointmentId as the channel name
    useEffect(() => {
        const channelId = consultationId;
        if (!channelId) return;

        setTokenReady(false);
        setJoinError(null);
        setTokenUid(null);
        getVideoToken(channelId)
            .unwrap()
            .then((payload) => {
                console.log('[Agora] rtc-token response:', payload);
                if (!payload?.token) {
                    setJoinError('Failed to get a video token from the server. Please try again.');
                    setTokenReady(true); // Unblock UI so retry button is accessible
                    return;
                }
                console.log('[Agora] rtc-token:', payload.token);
                setToken(payload.token);
                // Use the UID returned by the server so it matches the token
                if (typeof payload.uid === "string" || typeof payload.uid === "number") {
                    console.log('[Agora] rtc-uid from token response:', payload.uid);
                    setTokenUid(payload.uid);
                } else if (fallbackJoinUid !== null) {
                    console.log('[Agora] rtc-uid fallback from stringToAgoraUid(user.id):', fallbackJoinUid, '| user.id:', user?.id);
                } else {
                    console.warn('[Agora] no rtc uid from backend response and no user.id fallback');
                }
                setTokenReady(true);
            })
            .catch((error) => {
                console.error('Video token fetch failed:', error);
                const serverMsg: string = (error as any)?.data?.message ?? (error as any)?.message ?? '';
                const upperMsg = serverMsg.toUpperCase();
                if (upperMsg.includes('EXPIRED')) {
                    setConsultationStatus('EXPIRED');
                    setJoinError('This consultation has expired and can no longer be joined.');
                } else if (upperMsg.includes('CANCELLED')) {
                    setConsultationStatus('CANCELLED');
                    setJoinError('This consultation has been cancelled.');
                } else if (upperMsg.includes('COMPLETED')) {
                    setConsultationStatus('COMPLETED');
                    setJoinError('This consultation has already been completed.');
                } else {
                    setJoinError(serverMsg || 'Could not retrieve a video token. Please try again.');
                }
                setTokenReady(true); // Unblock the UI so the retry button is reachable
            });
    }, [consultationId, getVideoToken, tokenRetryCount]);

    // If calling but Agora hasn't connected after 12s, surface an error
    useEffect(() => {
        if (calling && !isConnected) {
            joinTimeoutRef.current = setTimeout(() => {
                setCalling(false);
                setJoinError('Could not connect to the call. Please check your connection and try again.');
            }, 12_000);
        } else {
            if (joinTimeoutRef.current) clearTimeout(joinTimeoutRef.current);
            if (isConnected) setJoinError(null);
        }
        return () => {
            if (joinTimeoutRef.current) clearTimeout(joinTimeoutRef.current);
        };
    }, [calling, isConnected]);

    // When appointment data loads, sync it into Redux as the current conversation.
    // The appointment object has the same fields (id, user, consultant) that the
    // video container needs — we no longer need the separate conversations endpoint.
    useEffect(() => {
        if (!appointmentData) return;
        const appt = (appointmentData as any)?.data ?? appointmentData;
        if (!appt?.id) return;

        // Surface any terminal status so the gate screen shows
        const status = (appt.status || '').toUpperCase();
        if (['EXPIRED', 'CANCELLED', 'COMPLETED'].includes(status)) {
            setConsultationStatus(status);
            setIsLoadingConversation(false);
            return;
        }

        dispatch(setCurrentConversation({ conversation: appt }));
        setIsLoadingConversation(false);
    }, [appointmentData, dispatch]);

    // Handle appointment fetch error
    useEffect(() => {
        if (!apptError) return;
        const serverMsg: string = (apptError as any)?.data?.message ?? '';
        const upper = serverMsg.toUpperCase();
        if (upper.includes('EXPIRED')) setConsultationStatus('EXPIRED');
        else if (upper.includes('CANCELLED')) setConsultationStatus('CANCELLED');
        else if (upper.includes('COMPLETED')) setConsultationStatus('COMPLETED');
        setIsLoadingConversation(false);
    }, [apptError]);

    // Fallback: if we arrived via the messages page (currentConversation already set in Redux)
    // and the IDs match, mark loading done.
    useEffect(() => {
        if (consultationId && currentConversation?.id === consultationId) {
            setIsLoadingConversation(false);
        }
    }, [consultationId, currentConversation?.id]);

    // Build participants from conversation (self + other)
    const conversationParticipants = useMemo(() => {
        const list: Array<{ id: string; name: string; image?: string; isSelf: boolean }> = [];
        const conv = currentConversation || {} as any;
        const convUser = conv.user || {};
        const convConsultant = conv.consultant || {};
        if (!convUser?.id && !convConsultant?.id) return list;
        const amUser = user?.id === convUser?.id;
        const self = amUser ? convUser : convConsultant;
        const other = amUser ? convConsultant : convUser;
        if (self?.id) list.push({ id: self.id, name: self.fullName || 'Me', image: self.profilePics, isSelf: true });
        if (other?.id) list.push({ id: other.id, name: other.fullName || 'Participant', image: other.profilePics, isSelf: false });
        return list;
    }, [currentConversation, user?.id]);

    const otherParticipantName = useMemo(() => {
        const conv = currentConversation || {} as any;
        const convUser = conv.user || {};
        const convConsultant = conv.consultant || {};
        const amUser = user?.id === convUser?.id;
        const other = amUser ? convConsultant : convUser;
        return other?.fullName || 'Consultation';
    }, [currentConversation, user?.id]);


    // Session duration from appointment timeslot; null when unknown
    const sessionDurationSeconds = useMemo(() => {
        const mins = (currentConversation as any)?.timeslots?.[0]?.duration;
        return mins ? Number(mins) * 60 : null;
    }, [currentConversation]);

    const sessionRemaining = sessionDurationSeconds !== null ? sessionDurationSeconds - sessionElapsed : null;

    useEffect(() => {
        console.log('[Agora] appId:', appId, '| channel:', currentConversation?.id, '| uid:', joinUid ?? 'AUTO', '| token:', token || 'EMPTY', '| calling:', calling);
    }, [token, calling, appId, currentConversation?.id, joinUid])

    // Initialize Socket.IO for non-persistent video chat
    useEffect(() => {
        if (!user?.id || !currentConversation?.id || !isConnected) return;

        console.log('Initializing Socket.IO for video chat');

        // Use the global socket instance
        socketRef.current = globalSocketInstance;
        const currentSocket = socketRef.current;

        if (currentSocket) {
            // Connect to the video chat room
            const authData = {
                token: authToken,
                roomId: `video-chat-${currentConversation.id}`
            };

            console.log('Setting Socket.IO auth:', {
                roomId: authData.roomId
            });

            currentSocket.auth = authData;
            currentSocket.connect();

            const onConnect = () => {
                console.log('Socket.IO Connected for video chat');
                setChatConnected(true);

                // Join the video chat room
                currentSocket.emit('join-video-room', {
                    roomId: `video-chat-${currentConversation.id}`,
                    userId: user.id,
                    userName: user.fullName,
                    userImage: user.profilePics
                });
            };

            const onDisconnect = () => {
                console.log('Socket.IO Disconnected from video chat');
                setChatConnected(false);
            };

            const onConnectError = (error: any) => {
                console.error('Socket.IO Connection Error:', error);
                setChatConnected(false);
            };

            const onVideoChatMessage = (messageData: any) => {
                if (messageData.senderId !== user.id) {
                    const newMessage: VideoChatMessage = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        senderId: messageData.senderId,
                        senderName: messageData.senderName,
                        senderImage: messageData.senderImage,
                        message: messageData.message,
                        timestamp: new Date(messageData.timestamp),
                        isOwn: false
                    };
                    setChatMessages(prev => [...prev, newMessage]);
                }
            };

            const onUserJoinedVideoRoom = (userData: any) => {
                if (userData.userId !== user.id) {
                    const joinMessage: VideoChatMessage = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        senderId: 'system',
                        senderName: 'System',
                        senderImage: undefined,
                        message: `${userData.userName} joined the chat`,
                        timestamp: new Date(userData.timestamp),
                        isOwn: false
                    };
                    setChatMessages(prev => [...prev, joinMessage]);
                }
            };

            const onUserLeftVideoRoom = (userData: any) => {
                if (userData.userId !== user.id) {
                    const leaveMessage: VideoChatMessage = {
                        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                        senderId: 'system',
                        senderName: 'System',
                        senderImage: undefined,
                        message: `${userData.userName} left the chat`,
                        timestamp: new Date(userData.timestamp),
                        isOwn: false
                    };
                    setChatMessages(prev => [...prev, leaveMessage]);
                }
            };

            currentSocket.on('connect', onConnect);
            currentSocket.on('disconnect', onDisconnect);
            currentSocket.on('connect_error', onConnectError);
            currentSocket.on('video-chat-message', onVideoChatMessage);
            currentSocket.on('user-joined-video-room', onUserJoinedVideoRoom);
            currentSocket.on('user-left-video-room', onUserLeftVideoRoom);

            return () => {
                currentSocket.off('connect', onConnect);
                currentSocket.off('disconnect', onDisconnect);
                currentSocket.off('connect_error', onConnectError);
                currentSocket.off('video-chat-message', onVideoChatMessage);
                currentSocket.off('user-joined-video-room', onUserJoinedVideoRoom);
                currentSocket.off('user-left-video-room', onUserLeftVideoRoom);
                currentSocket.emit('leave-video-room', {
                    roomId: `video-chat-${currentConversation.id}`,
                    userId: user.id
                });
            };
        } else {
            console.error('Global socket instance not available');
        }
    }, [authToken, user?.id, currentConversation?.id, user?.fullName, user?.profilePics, isConnected]);

    // Chat functions
    const sendChatMessage = async (message: string) => {
        if (!message.trim() || !user?.id || !socketRef.current || !chatConnected) return;

        try {
            socketRef.current.emit('send-video-chat-message', {
                roomId: `video-chat-${currentConversation.id}`,
                senderId: user.id,
                senderName: user.fullName || 'You',
                senderImage: user.profilePics,
                message: message.trim(),
                timestamp: new Date().toISOString()
            });

            const newMessage: VideoChatMessage = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                senderId: user.id,
                senderName: user.fullName || 'You',
                senderImage: user.profilePics,
                message: message.trim(),
                timestamp: new Date(),
                isOwn: true
            };

            setChatMessages(prev => [...prev, newMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const clearChat = () => {
        setChatMessages([]);
    };

    // End call function
    const handleEndCall = async () => {
        try {
            setIsEndingCall(true);
            console.log('Ending video call...');
            // Stop any ongoing recording first
            try { stopRecording(); } catch { }

            // Stop and close (release hardware) local tracks
            if (localCameraTrack) {
                try {
                    localCameraTrack.stop();
                    (localCameraTrack as any).close?.();
                } catch (error) {
                    console.error('Error stopping camera track:', error);
                }
            }

            if (localMicrophoneTrack) {
                try {
                    localMicrophoneTrack.stop();
                    (localMicrophoneTrack as any).close?.();
                } catch (error) {
                    console.error('Error stopping microphone track:', error);
                }
            }

            // Disable camera and mic state so tracks are not re-acquired
            setCamera(false);
            setMic(false);

            // Clean up Socket.IO connections
            if (socketRef.current && chatConnected) {
                console.log('Cleaning up Socket.IO...');
                socketRef.current.emit('leave-video-room', {
                    roomId: `video-chat-${currentConversation.id}`,
                    userId: user?.id
                });
                socketRef.current.disconnect();
                setChatConnected(false);
            }

            // Clear chat messages
            setChatMessages([]);

            // Reset video call state - this will trigger useJoin to leave the channel
            console.log('Resetting video call state...');
            setCalling(false);
            setEndSession(true);

            // Final forced hardware release after a short delay
            setTimeout(() => {
                try { localCameraTrack?.stop(); (localCameraTrack as any)?.close?.(); } catch { }
                try { localMicrophoneTrack?.stop(); (localMicrophoneTrack as any)?.close?.(); } catch { }
            }, 300);

            // Navigate back to the conversation or show end call UI
            setTimeout(() => {
                router.push('/message');
            }, 1500);

        } catch (error) {
            console.error('Error ending call:', error);
        } finally {
            setIsEndingCall(false);
        }
    };

    // Confirm end call function
    const confirmEndCall = () => {
        setShowEndCallModal(true);
    };

    useEffect(() => {
        if (!isConnected) {
            clearChat();
            setChatConnected(false);
        }
    }, [isConnected]);

    // Start/stop session elapsed timer when call connects/disconnects
    useEffect(() => {
        if (isConnected && callStartTime === null) setCallStartTime(Date.now());
        if (!isConnected) { setCallStartTime(null); setSessionElapsed(0); }
    }, [isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!callStartTime) return;
        const id = setInterval(() => setSessionElapsed(Math.floor((Date.now() - callStartTime) / 1000)), 1000);
        return () => clearInterval(id);
    }, [callStartTime]);

    // Keep refs pointing to the latest tracks so the unmount cleanup can release them
    // without re-running every time the track instances change (which was closing tracks mid-call).
    const cameraTrackRef = useRef(localCameraTrack);
    const micTrackRef = useRef(localMicrophoneTrack);
    useEffect(() => { cameraTrackRef.current = localCameraTrack; }, [localCameraTrack]);
    useEffect(() => { micTrackRef.current = localMicrophoneTrack; }, [localMicrophoneTrack]);

    // Cleanup effect — release camera/mic hardware only when component truly unmounts
    useEffect(() => {
        return () => {
            try { cameraTrackRef.current?.stop(); (cameraTrackRef.current as any)?.close?.(); } catch { }
            try { micTrackRef.current?.stop(); (micTrackRef.current as any)?.close?.(); } catch { }
            if (socketRef.current) {
                try { socketRef.current.disconnect(); } catch { }
            }
            try { stopRecordingRef.current(); } catch { }
        };
    }, []); // empty — runs only on unmount

    // Show loading state while fetching consultation data
    if (isLoadingConversation || (isApptLoading && consultationId && !currentConversation?.id)) {
        return (
            <Flex justify="center" align="center" h="100vh" direction="column" gap={3} bg="white">
                <Box w="40px" h="40px" borderRadius="full" bg="#f0f2f8" display="flex" alignItems="center" justifyContent="center">
                    <IoCall size={20} color="#1C275D" />
                </Box>
                <Text fontSize="0.95rem" color="#5f6368">Loading consultation...</Text>
            </Flex>
        );
    }

    // Consultation is expired / cancelled / completed — show a friendly gate screen
    if (consultationStatus && (consultationStatus === 'EXPIRED' || consultationStatus === 'CANCELLED' || consultationStatus === 'COMPLETED')) {
        const isExpired = consultationStatus === 'EXPIRED';
        const isCancelled = consultationStatus === 'CANCELLED';
        const headline = isExpired
            ? 'Consultation Expired'
            : isCancelled
            ? 'Consultation Cancelled'
            : 'Consultation Ended';
        const subtitle = isExpired
            ? 'This consultation session has passed its scheduled time.'
            : isCancelled
            ? 'This consultation was cancelled.'
            : 'This consultation has already been completed.';

        return (
            <Flex justify="center" align="center" h="100vh" direction="column" gap={5} bg="white" px={6}>
                <Box
                    w="72px" h="72px" borderRadius="full"
                    bg={isExpired ? "#fff3cd" : isCancelled ? "#fde8e8" : "#e8f5e9"}
                    display="flex" alignItems="center" justifyContent="center"
                >
                    <IoCall size={30} color={isExpired ? "#b08000" : isCancelled ? "#c53030" : "#2e7d32"} />
                </Box>
                <VStack gap={1} textAlign="center">
                    <Text fontSize="1.35rem" fontWeight="700" color="#202124">{headline}</Text>
                    <Text fontSize="0.9rem" color="#5f6368" maxW="380px">{subtitle}</Text>
                </VStack>
                <Button
                    bg="#1C275D"
                    color="white"
                    borderRadius="10px"
                    px={6}
                    onClick={() => router.push('/message')}
                    _hover={{ bg: "#16214F" }}
                >
                    Go to Messages
                </Button>
            </Flex>
        );
    }

    // Show error state if consultationId is provided but conversation is not found
    if (consultationId && !currentConversation?.id) {
        return (
            <Flex justify="center" align="center" h="100vh" direction="column" gap={4} bg="white">
                <Text fontSize="1.1rem" fontWeight="600" color="#202124">Consultation not found</Text>
                <Text fontSize="0.875rem" color="#5f6368">We couldn&apos;t find the details for this consultation.</Text>
                <Button
                    bg="#1C275D" color="white" borderRadius="10px"
                    onClick={() => router.back()}
                    _hover={{ bg: "#16214F" }}
                >
                    Go Back
                </Button>
            </Flex>
        );
    }

    // Toolbar button helper
    const ToolBtn = ({
        label, icon, active = false, danger = false, onClick, loading: btnLoading = false,
    }: {
        label: string; icon: React.ReactNode; active?: boolean; danger?: boolean;
        onClick?: () => void; loading?: boolean;
    }) => (
        <VStack gap={1} align="center">
            <IconButton
                aria-label={label}
                onClick={onClick}
                borderRadius="full"
                w="48px"
                h="48px"
                p={0}
                bg={danger ? "#ea4335" : "white"}
                color={danger ? "white" : active ? "#1C275D" : "#444"}
                borderWidth="1px"
                borderColor={danger ? "transparent" : active ? "#1C275D" : "#e0e0e0"}
                shadow="sm"
                _hover={{
                    bg: danger ? "#c5221f" : "#f5f5f5",
                    transform: "scale(1.06)",
                }}
                transition="all 0.15s"
                loading={btnLoading}
            >
                {icon}
            </IconButton>
        </VStack>
    );

    return (
        <>
                <Flex h="full" w="full" direction="row" borderRadius="16px" overflow="hidden" position="relative">
                    {/* ── Main call area ── */}
                    <Flex direction="column" flex={1} bg="white" position="relative" minW={0}>
                        {/* Video content */}
                        <Box flex={1} position="relative" overflow="hidden" display="flex" flexDirection="column">
                            {isConnected ? (
                            <>
                                {/* ── Header bar ── */}
                                <HStack
                                    px={5}
                                    py={3}
                                    bg="white"
                                    borderBottomWidth="1px"
                                    borderColor="#e8e8e8"
                                    zIndex={10}
                                    justify="space-between"
                                    flexShrink={0}
                                >
                                    <HStack gap={3}>
                                        <Text
                                            fontFamily="Outfit"
                                            fontWeight="600"
                                            fontSize={{ base: "0.95rem", md: "1.05rem" }}
                                            color="#202124"
                                        >
                                            {otherParticipantName}&apos;s Consultation
                                        </Text>
                                        <HStack
                                            px={2.5}
                                            py={0.5}
                                            bg="#f1f3f4"
                                            borderRadius="full"
                                            gap={1.5}
                                        >
                                            <Users size={13} color="#5f6368" />
                                            <Text fontSize="0.8rem" color="#5f6368" fontWeight="500">
                                                {1 + remoteUsers.length}
                                            </Text>
                                        </HStack>
                                    </HStack>
                                    <HStack gap={3}>
                                        {isRecording && (
                                            <HStack px={3} py={1.5} bg="rgba(220,38,38,0.1)" borderRadius="full" gap={2}>
                                                <Box w={2.5} h={2.5} bg="red.500" borderRadius="full" />
                                                <Text color="red.500" fontSize="0.82rem" fontWeight="600">
                                                    {recordingElapsed}
                                                </Text>
                                            </HStack>
                                        )}
                                        {sessionRemaining !== null && (
                                            <HStack
                                                px={3} py={1.5} borderRadius="full" gap={1.5}
                                                bg={
                                                    sessionRemaining < 0 ? "rgba(220,38,38,0.08)" :
                                                    sessionRemaining < 300 ? "rgba(220,38,38,0.1)" :
                                                    sessionRemaining < 600 ? "rgba(255,152,0,0.1)" :
                                                    "#f1f3f4"
                                                }
                                            >
                                                <Text
                                                    fontSize="0.82rem"
                                                    fontWeight="600"
                                                    color={
                                                        sessionRemaining < 0 ? "red.500" :
                                                        sessionRemaining < 300 ? "red.500" :
                                                        sessionRemaining < 600 ? "orange.400" :
                                                        "#5f6368"
                                                    }
                                                >
                                                    {sessionRemaining > 0
                                                        ? `${formatSessionTime(sessionRemaining)} left`
                                                        : `+${formatSessionTime(-sessionRemaining)} over`}
                                                </Text>
                                            </HStack>
                                        )}
                                    </HStack>
                                </HStack>

                                {/* ── Main video stage ── */}
                                <Box ref={containerRef} flex={1} position="relative" overflow="hidden"
                                    bg={remoteUsers.length > 0 || screenShareOn ? "#202124" : "#FDF6EE"}
                                >
                                    {/* Google Meet-style screen share banner */}
                                    {screenShareOn && (
                                        <Flex
                                            position="absolute"
                                            top={0} left={0} right={0}
                                            zIndex={20}
                                            bg="#1a73e8"
                                            align="center"
                                            justify="space-between"
                                            px={4} py={2}
                                        >
                                            <HStack gap={2}>
                                                <Box w={2} h={2} bg="white" borderRadius="full" />
                                                <Text fontSize="0.85rem" fontWeight="600" color="white">
                                                    You are presenting to everyone
                                                </Text>
                                            </HStack>
                                            <Button
                                                size="sm"
                                                bg="white"
                                                color="#1a73e8"
                                                borderRadius="6px"
                                                fontWeight="600"
                                                fontSize="0.8rem"
                                                px={3}
                                                h="28px"
                                                _hover={{ bg: "#e8f0fe" }}
                                                onClick={toggleScreenShare}
                                            >
                                                Stop presenting
                                            </Button>
                                        </Flex>
                                    )}

                                    {screenShareOn && screenTrack ? (
                                        // Screen share fills the main stage
                                        <LocalUser
                                            audioTrack={localMicrophoneTrack}
                                            cameraOn={true}
                                            micOn={micOn}
                                            playAudio={false}
                                            videoTrack={screenTrack}
                                            key={`screen-main-${forceUpdate}`}
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    ) : remoteUsers.length > 0 ? (
                                        // Remote user takes full stage
                                        <Box w="full" h="full" css={{ '& video': { width: '100% !important', height: '100% !important', objectFit: 'cover', objectPosition: 'center center' } }}>
                                            <RemoteUser
                                                user={remoteUsers[0]}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        </Box>
                                    ) : (
                                        // No one else has joined — show welcome message
                                        <Flex align="center" justify="center" w="full" h="full" direction="column" gap={3}>
                                            <Text fontSize="1.1rem" fontWeight="500" color="#202124">
                                                👋 Welcome {user?.fullName?.split(' ')[0]}
                                            </Text>
                                            <Text fontSize="0.9rem" color="#5f6368">
                                                No one else has joined yet
                                            </Text>
                                        </Flex>
                                    )}

                                    {/* Remote user PiP — shown bottom-left when screen sharing */}
                                    {screenShareOn && remoteUsers.length > 0 && (
                                        <Box
                                            position="absolute"
                                            bottom={4}
                                            left={4}
                                            w="200px"
                                            style={{ aspectRatio: "16/9" }}
                                            borderRadius="14px"
                                            overflow="hidden"
                                            borderWidth="2px"
                                            borderColor="rgba(255,255,255,0.2)"
                                            shadow="lg"
                                            bg="#3c4043"
                                        >
                                            <Box w="full" h="full" css={{ '& video': { width: '100% !important', height: '100% !important', objectFit: 'cover', objectPosition: 'center center' } }}>
                                                <RemoteUser
                                                    user={remoteUsers[0]}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Local PiP — always shows camera feed, even during screen share */}
                                    <Box
                                        position="absolute"
                                        bottom={4}
                                        right={4}
                                        w="200px"
                                        style={{ aspectRatio: "16/9" }}
                                        borderRadius="14px"
                                        overflow="hidden"
                                        borderWidth="1px"
                                        borderColor="rgba(0,0,0,0.08)"
                                        shadow="lg"
                                        bg="#3c4043"
                                    >
                                        {cameraOn && localCameraTrack ? (
                                            <Box w="full" h="full" css={{ '& video': { width: '100% !important', height: '100% !important', objectFit: 'cover', objectPosition: 'center center' } }}>
                                                <LocalUser
                                                    audioTrack={localMicrophoneTrack}
                                                    cameraOn={true}
                                                    micOn={micOn}
                                                    playAudio={false}
                                                    videoTrack={localCameraTrack}
                                                    key={`local-pip-${forceUpdate}`}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </Box>
                                        ) : (
                                            <Flex align="center" justify="center" w="full" h="full">
                                                <Box
                                                    w="52px"
                                                    h="52px"
                                                    borderRadius="full"
                                                    bg="rgba(0,0,0,0.12)"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    fontSize="1.4rem"
                                                    color={remoteUsers.length === 0 ? "#5f6368" : "white"}
                                                    fontWeight="700"
                                                >
                                                    {user?.fullName?.[0]?.toUpperCase() || 'Y'}
                                                </Box>
                                            </Flex>
                                        )}
                                        {/* Name label */}
                                        <HStack
                                            position="absolute"
                                            bottom={0}
                                            left={0}
                                            right={0}
                                            px={2.5}
                                            py={2}
                                            bg={remoteUsers.length === 0 ? "rgba(253,246,238,0.85)" : "rgba(0,0,0,0.5)"}
                                            justify="space-between"
                                            align="center"
                                        >
                                            <HStack gap={1.5}>
                                                <TbMicrophoneFilled size={12} color={remoteUsers.length === 0 ? "#444" : "white"} />
                                                <Text
                                                    fontSize="0.7rem"
                                                    color={remoteUsers.length === 0 ? "#333" : "white"}
                                                    fontWeight="500"
                                                >
                                                    {user?.fullName || 'You'}
                                                </Text>
                                            </HStack>
                                            <MoreVertical size={14} color={remoteUsers.length === 0 ? "#444" : "white"} />
                                        </HStack>
                                    </Box>
                                </Box>

                                {/* ── Bottom toolbar ── */}
                                <HStack
                                    px={6}
                                    py={4}
                                    bg="white"
                                    borderTopWidth="1px"
                                    borderColor="#e8e8e8"
                                    justify="space-between"
                                    zIndex={10}
                                    flexShrink={0}
                                >
                                    {/* Left: empty spacer for balance */}
                                    <Box flex={1} />

                                    {/* Center: main controls */}
                                    <HStack gap={{ base: 2, md: 3 }} justify="center" flex={2}>
                                        {/* Mic + device picker */}
                                        <HStack gap={0}>
                                            <ToolBtn
                                                label={micOn ? "Mute" : "Unmute"}
                                                icon={micOn ? <TbMicrophoneFilled size={20} /> : <TbMicrophoneOff size={20} />}
                                                active={micOn}
                                                danger={!micOn}
                                                onClick={() => setMic((a) => !a)}
                                            />
                                            <Menu.Root>
                                                <Menu.Trigger asChild>
                                                    <IconButton aria-label="Audio settings" size="xs" variant="ghost" borderRadius="full" color="#888" _hover={{ bg: "#f0f0f0", color: "#111" }} h="18px" w="14px" minW="unset" mb="14px">
                                                        <BiChevronDown size={12} />
                                                    </IconButton>
                                                </Menu.Trigger>
                                                <Portal>
                                                    <Menu.Positioner>
                                                        <Menu.Content
                                                            minW="280px"
                                                            bg="white"
                                                            borderRadius="14px"
                                                            shadow="0 8px 30px rgba(0,0,0,0.14)"
                                                            border="1px solid #f0f0f0"
                                                            py={2}
                                                            overflow="hidden"
                                                        >
                                                            {/* Microphone section */}
                                                            <Box px={4} pt={2} pb={1}>
                                                                <HStack gap={2} mb={2}>
                                                                    <Box p={1.5} bg="#f0f4ff" borderRadius="8px">
                                                                        <Mic size={13} color="#1C275D" />
                                                                    </Box>
                                                                    <Text fontSize="0.75rem" fontWeight="700" color="#1C275D" letterSpacing="0.04em" textTransform="uppercase">Microphone</Text>
                                                                </HStack>
                                                                {microphones.map(d => {
                                                                    const isActive = d.deviceId === activeMicId;
                                                                    return (
                                                                        <HStack
                                                                            key={d.deviceId}
                                                                            px={2} py={2}
                                                                            borderRadius="8px"
                                                                            cursor="pointer"
                                                                            bg={isActive ? "#f0f4ff" : "transparent"}
                                                                            _hover={{ bg: isActive ? "#e8eeff" : "#f7f7f7" }}
                                                                            onClick={() => switchMicrophone(d.deviceId)}
                                                                            justify="space-between"
                                                                        >
                                                                            <Text fontSize="0.82rem" color={isActive ? "#1C275D" : "#444"} fontWeight={isActive ? "600" : "400"} lineClamp={1}>
                                                                                {d.label || `Microphone ${d.deviceId.slice(0, 6)}`}
                                                                            </Text>
                                                                            {isActive && <Check size={14} color="#1C275D" />}
                                                                        </HStack>
                                                                    );
                                                                })}
                                                            </Box>

                                                            {speakers.length > 0 && (
                                                                <>
                                                                    <Box h="1px" bg="#f0f0f0" mx={4} my={2} />
                                                                    <Box px={4} pb={2}>
                                                                        <HStack gap={2} mb={2}>
                                                                            <Box p={1.5} bg="#f0f4ff" borderRadius="8px">
                                                                                <Volume2 size={13} color="#1C275D" />
                                                                            </Box>
                                                                            <Text fontSize="0.75rem" fontWeight="700" color="#1C275D" letterSpacing="0.04em" textTransform="uppercase">Speaker</Text>
                                                                        </HStack>
                                                                        {speakers.map(d => {
                                                                            const isActive = d.deviceId === activeSpeakerId;
                                                                            return (
                                                                                <HStack
                                                                                    key={d.deviceId}
                                                                                    px={2} py={2}
                                                                                    borderRadius="8px"
                                                                                    cursor="pointer"
                                                                                    bg={isActive ? "#f0f4ff" : "transparent"}
                                                                                    _hover={{ bg: isActive ? "#e8eeff" : "#f7f7f7" }}
                                                                                    onClick={() => switchSpeaker(d.deviceId)}
                                                                                    justify="space-between"
                                                                                >
                                                                                    <Text fontSize="0.82rem" color={isActive ? "#1C275D" : "#444"} fontWeight={isActive ? "600" : "400"} lineClamp={1}>
                                                                                        {d.label || `Speaker ${d.deviceId.slice(0, 6)}`}
                                                                                    </Text>
                                                                                    {isActive && <Check size={14} color="#1C275D" />}
                                                                                </HStack>
                                                                            );
                                                                        })}
                                                                    </Box>
                                                                </>
                                                            )}
                                                        </Menu.Content>
                                                    </Menu.Positioner>
                                                </Portal>
                                            </Menu.Root>
                                        </HStack>

                                        {/* Camera + device picker */}
                                        <HStack gap={0}>
                                            <ToolBtn
                                                label={cameraOn ? "Turn off camera" : "Turn on camera"}
                                                icon={cameraOn ? <BsCameraVideoFill size={18} /> : <BsCameraVideoOff size={18} />}
                                                active={cameraOn}
                                                danger={!cameraOn}
                                                onClick={() => setCamera((a) => !a)}
                                            />
                                            <Menu.Root>
                                                <Menu.Trigger asChild>
                                                    <IconButton aria-label="Camera settings" size="xs" variant="ghost" borderRadius="full" color="#888" _hover={{ bg: "#f0f0f0", color: "#111" }} h="18px" w="14px" minW="unset" mb="14px">
                                                        <BiChevronDown size={12} />
                                                    </IconButton>
                                                </Menu.Trigger>
                                                <Portal>
                                                    <Menu.Positioner>
                                                        <Menu.Content
                                                            minW="280px"
                                                            bg="white"
                                                            borderRadius="14px"
                                                            shadow="0 8px 30px rgba(0,0,0,0.14)"
                                                            border="1px solid #f0f0f0"
                                                            py={2}
                                                            overflow="hidden"
                                                        >
                                                            <Box px={4} pt={2} pb={2}>
                                                                <HStack gap={2} mb={2}>
                                                                    <Box p={1.5} bg="#f0f4ff" borderRadius="8px">
                                                                        <Video size={13} color="#1C275D" />
                                                                    </Box>
                                                                    <Text fontSize="0.75rem" fontWeight="700" color="#1C275D" letterSpacing="0.04em" textTransform="uppercase">Camera</Text>
                                                                </HStack>
                                                                {cameras.map(d => {
                                                                    const isActive = d.deviceId === activeCameraId;
                                                                    return (
                                                                        <HStack
                                                                            key={d.deviceId}
                                                                            px={2} py={2}
                                                                            borderRadius="8px"
                                                                            cursor="pointer"
                                                                            bg={isActive ? "#f0f4ff" : "transparent"}
                                                                            _hover={{ bg: isActive ? "#e8eeff" : "#f7f7f7" }}
                                                                            onClick={() => switchCamera(d.deviceId)}
                                                                            justify="space-between"
                                                                        >
                                                                            <Text fontSize="0.82rem" color={isActive ? "#1C275D" : "#444"} fontWeight={isActive ? "600" : "400"} lineClamp={1}>
                                                                                {d.label || `Camera ${d.deviceId.slice(0, 6)}`}
                                                                            </Text>
                                                                            {isActive && <Check size={14} color="#1C275D" />}
                                                                        </HStack>
                                                                    );
                                                                })}
                                                            </Box>
                                                        </Menu.Content>
                                                    </Menu.Positioner>
                                                </Portal>
                                            </Menu.Root>
                                        </HStack>
                                        {/* <ToolBtn
                                            label="Messages"
                                            icon={<MessageSquare size={20} />}
                                            active={activePanel === 'chat'}
                                            onClick={() => togglePanel('chat')}
                                        /> */}
                                        <ToolBtn
                                            label="Participants"
                                            icon={<Users size={20} />}
                                            active={activePanel === 'participants'}
                                            onClick={() => togglePanel('participants')}
                                        />
                                        <ToolBtn
                                            label={screenShareOn ? "Stop presenting" : "Present screen"}
                                            icon={<MonitorUp size={20} />}
                                            active={screenShareOn}
                                            onClick={toggleScreenShare}
                                        />
                                        <ToolBtn
                                            label={isRecording ? `Stop recording (${recordingElapsed})` : "Record"}
                                            icon={isRecording ? <RiStopCircleFill size={20} /> : <RiRecordCircleFill size={20} />}
                                            active={false}
                                            danger={isRecording}
                                            onClick={() => isRecording ? stopRecording() : startRecording()}
                                        />
                                        <ToolBtn
                                            label="Meeting transcript"
                                            icon={<FileText size={20} />}
                                            active={activePanel === 'chat'}
                                            onClick={() => togglePanel('chat')}
                                        />
                                    </HStack>

                                    {/* Right: extra time + end call */}
                                    <HStack flex={1} justify="flex-end" gap={2}>
                                        {sessionRemaining !== null && sessionRemaining < 600 && (
                                            <ToolBtn
                                                label="Request Extra Time"
                                                icon={<PlusCircle size={18} />}
                                                active
                                                onClick={() => { setExtendStatus('idle'); setShowExtendModal(true); }}
                                            />
                                        )}
                                        <ToolBtn
                                            label="End call"
                                            icon={<IoCall size={20} style={{ transform: 'rotate(135deg)' }} />}
                                            danger
                                            onClick={confirmEndCall}
                                            loading={isEndingCall}
                                        />
                                    </HStack>
                                </HStack>
                            </>
                        ) : (
                            <PreJoinPanel
                                appId={appId as string}
                                channel={channelName}
                                calling={calling}
                                setCalling={(v) => setCalling(v)}
                                cameraOn={cameraOn}
                                setCamera={(updater) => setCamera(updater)}
                                micOn={micOn}
                                setMic={(updater) => setMic(updater)}
                                localCameraTrack={localCameraTrack}
                                localMicrophoneTrack={localMicrophoneTrack}
                                consultationName={`${otherParticipantName}'s Consultation`}
                                tokenReady={tokenReady}
                                joinError={joinError}
                                onRetry={() => {
                                    setJoinError(null);
                                    setToken("");
                                    setTokenReady(false);
                                    setTokenRetryCount((c) => c + 1);
                                }}
                            />
                        )}

                        </Box>
                    </Flex>

                    {/* ── Right panel: Participants or Transcript ── */}
                    {activePanel && isConnected && (
                        <Box
                            w="360px"
                            flexShrink={0}
                            bg="white"
                            borderLeftWidth="1px"
                            borderColor="#e0e0e0"
                            h="full"
                            display="flex"
                            flexDirection="column"
                        >
                            {activePanel === 'participants' ? (
                                /* Participants panel */
                                <VStack align="stretch" h="full">
                                    <HStack
                                        px={5}
                                        py={4}
                                        borderBottomWidth="1px"
                                        borderColor="#e0e0e0"
                                        justify="space-between"
                                    >
                                        <Text fontWeight="700" fontSize="1.1rem" color="#202124">
                                            People ({conversationParticipants.length + remoteUsers.length})
                                        </Text>
                                        <IconButton
                                            aria-label="Close"
                                            size="sm"
                                            variant="ghost"
                                            borderRadius="full"
                                            onClick={() => setActivePanel(null)}
                                        >
                                            <X size={18} />
                                        </IconButton>
                                    </HStack>
                                    <VStack align="stretch" flex={1} overflowY="auto" px={4} py={3} gap={2}>
                                        {conversationParticipants.map((p) => (
                                            <HStack key={p.id} px={3} py={2} borderRadius="10px" _hover={{ bg: "#f1f3f4" }}>
                                                <Avatar.Root size="sm">
                                                    <Avatar.Fallback name={p.name} />
                                                    <Avatar.Image src={p.image || partdp1} />
                                                </Avatar.Root>
                                                <Text fontSize="0.9rem" color="#202124" fontWeight="500">
                                                    {p.isSelf ? `${p.name} (You)` : p.name}
                                                </Text>
                                                {p.isSelf && (
                                                    <Box ml="auto">
                                                        {micOn
                                                            ? <TbMicrophoneFilled size={14} color="#5f6368" />
                                                            : <TbMicrophoneOff size={14} color="#ea4335" />}
                                                    </Box>
                                                )}
                                            </HStack>
                                        ))}
                                        {remoteUsers.map((ru) => (
                                            <HStack key={ru.uid} px={3} py={2} borderRadius="10px" _hover={{ bg: "#f1f3f4" }}>
                                                <Avatar.Root size="sm">
                                                    <Avatar.Fallback name={String(ru.uid)} />
                                                </Avatar.Root>
                                                <Text fontSize="0.9rem" color="#202124" fontWeight="500">
                                                    {otherParticipantName}
                                                </Text>
                                            </HStack>
                                        ))}
                                    </VStack>
                                </VStack>
                            ) : (
                                /* Meeting transcript / chat panel */
                                <VideoChat
                                    messages={chatMessages}
                                    onSendMessage={sendChatMessage}
                                    currentUserId={user?.id || ''}
                                    isConnected={chatConnected}
                                    onClose={() => setActivePanel(null)}
                                />
                            )}
                        </Box>
                    )}
                </Flex>

            {/* ── Time Extension Request Modal ── */}
            <Dialog.Root
                open={showExtendModal}
                onOpenChange={({ open }) => { if (!open) { setShowExtendModal(false); setExtendStatus('idle'); } }}
                placement="center"
                size="xs"
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content borderRadius="16px" p={0} overflow="hidden">
                            <Dialog.Header px={5} pt={5} pb={3} borderBottomWidth="1px" borderColor="#e8e8e8">
                                <Dialog.Title fontFamily="Outfit" fontWeight="700" fontSize="1.1rem" color="#202124">
                                    Request Extra Time
                                </Dialog.Title>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" pos="absolute" top={3} right={3} />
                                </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body px={5} py={4}>
                                {extendStatus === 'success' ? (
                                    <VStack gap={3} py={2} textAlign="center">
                                        <Box w="48px" h="48px" borderRadius="full" bg="#E8F5E9" display="flex" alignItems="center" justifyContent="center">
                                            <Text fontSize="1.5rem">✓</Text>
                                        </Box>
                                        <Text fontFamily="Outfit" fontWeight="600" color="#202124">Request Sent!</Text>
                                        <Text fontSize="0.875rem" color="#5f6368" fontFamily="Outfit">
                                            The other participant has been notified. They will accept or decline shortly.
                                        </Text>
                                    </VStack>
                                ) : extendStatus === 'error' ? (
                                    <VStack gap={3} py={2} textAlign="center">
                                        <Text fontSize="0.875rem" color="red.500" fontFamily="Outfit">
                                            Could not send the extension request. Please try again.
                                        </Text>
                                    </VStack>
                                ) : (
                                    <VStack gap={3} align="stretch">
                                        <Text fontSize="0.875rem" color="#5f6368" fontFamily="Outfit">
                                            Choose how much additional time you need:
                                        </Text>
                                        {[15, 30].map((mins) => (
                                            <Button
                                                key={mins}
                                                w="full"
                                                px={4} py={6}
                                                borderRadius="10px"
                                                borderWidth="1.5px"
                                                borderColor="#e0e0e0"
                                                bg="white"
                                                variant="outline"
                                                justifyContent="flex-start"
                                                _hover={{ borderColor: '#1C275D', bg: '#f8f9ff' }}
                                                disabled={extendStatus === 'loading'}
                                                loading={extendStatus === 'loading'}
                                                onClick={async () => {
                                                    const apptId = (currentConversation as any)?.id;
                                                    if (!apptId) return;
                                                    setExtendStatus('loading');
                                                    try {
                                                        await requestTimeExtension({ appointmentId: apptId, extraMinutes: mins }).unwrap();
                                                        setExtendStatus('success');
                                                    } catch {
                                                        setExtendStatus('error');
                                                    }
                                                }}
                                            >
                                                <VStack align="start" gap={0}>
                                                    <Text fontFamily="Outfit" fontWeight="600" color="#202124" fontSize="0.95rem">
                                                        +{mins} minutes
                                                    </Text>
                                                    <Text fontFamily="Outfit" fontSize="0.78rem" color="#5f6368">
                                                        Extend session by {mins} min
                                                    </Text>
                                                </VStack>
                                            </Button>
                                        ))}
                                    </VStack>
                                )}
                            </Dialog.Body>
                            {extendStatus !== 'success' && (
                                <Dialog.Footer px={5} pb={5} pt={2}>
                                    <Dialog.ActionTrigger asChild>
                                        <Button variant="outline" borderRadius="8px" fontFamily="Outfit" w="full">
                                            Cancel
                                        </Button>
                                    </Dialog.ActionTrigger>
                                </Dialog.Footer>
                            )}
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>

            {/* Virtual Background Panel */}
            {showVirtualBgPanel && (
                <Box
                    position="fixed"
                    bottom="8rem"
                    left="50%"
                    transform="translateX(-50%)"
                    bg="main_background"
                    borderRadius="lg"
                    shadow="xl"
                    borderWidth={1}
                    borderColor="gray.200"
                    p={4}
                    zIndex="modal"
                    minW="400px"
                    maxW="500px"
                >
                    <VStack gap={4} align="stretch">
                        <HStack justify="space-between" align="center">
                            <Text fontSize="lg" fontWeight="600" color="text_primary">
                                Virtual Background
                            </Text>
                            <IconButton
                                aria-label="Close virtual background panel"
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowVirtualBgPanel(false)}
                            >
                                <Icon as={BiChevronDown} />
                            </IconButton>
                        </HStack>

                        <VStack gap={3} align="stretch">
                            {/* None Option */}
                            <HStack
                                p={3}
                                borderRadius="md"
                                borderWidth={1}
                                borderColor={virtualBgOptions.type === 'none' ? "primary.300" : "gray.200"}
                                bg={virtualBgOptions.type === 'none' ? "primary.50" : "transparent"}
                                cursor="pointer"
                                onClick={() => handleVirtualBackgroundChange('none')}
                                _hover={{ bg: virtualBgOptions.type === 'none' ? "primary.50" : "gray.50" }}
                            >
                                <Box
                                    w={12}
                                    h={8}
                                    borderRadius="md"
                                    bg="gray.100"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Text fontSize="xs" color="gray.500">None</Text>
                                </Box>
                                <VStack align="start" gap={0} flex={1}>
                                    <Text fontSize="sm" fontWeight="500" color="text_primary">
                                        No Background
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                        Show your real background
                                    </Text>
                                </VStack>
                                {virtualBgOptions.type === 'none' && (
                                    <Box w={2} h={2} borderRadius="full" bg="primary.300" />
                                )}
                            </HStack>

                            {/* Blur Option - Disabled for now */}
                            <HStack
                                p={3}
                                borderRadius="md"
                                borderWidth={1}
                                borderColor="gray.200"
                                bg="gray.50"
                                cursor="not-allowed"
                                opacity={0.5}
                                _hover={{ bg: "gray.50" }}
                            >
                                <Box
                                    w={12}
                                    h={8}
                                    borderRadius="md"
                                    bg="gray.300"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    filter="blur(2px)"
                                >
                                    <Text fontSize="xs" color="gray.600">Blur</Text>
                                </Box>
                                <VStack align="start" gap={0} flex={1}>
                                    <Text fontSize="sm" fontWeight="500" color="gray.400">
                                        Blur Background
                                    </Text>
                                    <Text fontSize="xs" color="gray.400">
                                        Coming soon
                                    </Text>
                                </VStack>
                            </HStack>

                            {/* Predefined Backgrounds */}
                            <Text fontSize="sm" fontWeight="500" color="text_primary" mt={2}>
                                Background Images
                            </Text>
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(2, 1fr)"
                                gap={3}
                            >
                                {PREDEFINED_BACKGROUNDS.map((bg) => (
                                    <HStack
                                        key={bg.id}
                                        p={2}
                                        borderRadius="md"
                                        borderWidth={1}
                                        borderColor={
                                            virtualBgOptions.type === 'image' && virtualBgOptions.backgroundImage === bg.url
                                                ? "primary.300"
                                                : "gray.200"
                                        }
                                        bg={
                                            virtualBgOptions.type === 'image' && virtualBgOptions.backgroundImage === bg.url
                                                ? "primary.50"
                                                : "transparent"
                                        }
                                        cursor="pointer"
                                        onClick={() => handleVirtualBackgroundChange('image', bg.url)}
                                        _hover={{
                                            bg: virtualBgOptions.type === 'image' && virtualBgOptions.backgroundImage === bg.url
                                                ? "primary.50"
                                                : "gray.50"
                                        }}
                                    >
                                        <Box
                                            w={12}
                                            h={8}
                                            borderRadius="md"
                                            bg="gray.200"
                                            backgroundImage={`url(${bg.thumbnail || bg.url})`}
                                            backgroundSize="cover"
                                            backgroundPosition="center"
                                        />
                                        <VStack align="start" gap={0} flex={1}>
                                            <Text fontSize="xs" fontWeight="500" color="text_primary">
                                                {bg.name}
                                            </Text>
                                        </VStack>
                                        {virtualBgOptions.type === 'image' && virtualBgOptions.backgroundImage === bg.url && (
                                            <Box w={2} h={2} borderRadius="full" bg="primary.300" />
                                        )}
                                    </HStack>
                                ))}
                            </Box>

                            {isVirtualBgLoading && (
                                <HStack justify="center" py={2}>
                                    <Box
                                        w={4}
                                        h={4}
                                        borderRadius="full"
                                        border="2px"
                                        borderColor="primary.300"
                                        borderTopColor="transparent"
                                        animation="spin 1s linear infinite"
                                    />
                                    <Text fontSize="sm" color="gray.500">
                                        Applying virtual background...
                                    </Text>
                                </HStack>
                            )}
                        </VStack>
                    </VStack>
                </Box>
            )}

            {/* End Call Confirmation Modal */}
            <EndCallModal
                isOpen={showEndCallModal}
                onClose={() => setShowEndCallModal(false)}
                onConfirm={handleEndCall}
                isLoading={isEndingCall}
            />
        </>
    );
};

// Non-persistent video chat component
const VideoChat: FC<{
    messages: VideoChatMessage[];
    onSendMessage: (message: string) => void;
    currentUserId: string;
    isConnected: boolean;
    onClose?: () => void;
}> = ({ messages, onSendMessage, currentUserId, isConnected, onClose }) => {
    const [newMessage, setNewMessage] = useState('');
    const [chatTab, setChatTab] = useState<'public' | 'private'>('public');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <VStack
            w="full"
            h="full"
            bg="white"
            align="stretch"
            gap={0}
        >
            {/* ── Tab header ── */}
            <HStack
                px={4}
                py={3}
                justify="space-between"
                align="center"
                flexShrink={0}
                borderBottomWidth="1px"
                borderColor="gray.100"
            >
                <HStack
                    bg="#f1f3f4"
                    borderRadius="full"
                    p="3px"
                    gap={0}
                >
                    {(['public', 'private'] as const).map((tab) => (
                        <Button
                            key={tab}
                            size="sm"
                            borderRadius="full"
                            px={4}
                            h="32px"
                            fontFamily="Outfit"
                            fontSize="0.82rem"
                            fontWeight={chatTab === tab ? "600" : "400"}
                            bg={chatTab === tab ? "#111D4A" : "transparent"}
                            color={chatTab === tab ? "white" : "#5f6368"}
                            _hover={{ bg: chatTab === tab ? "#111D4A" : "rgba(0,0,0,0.06)" }}
                            onClick={() => setChatTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </Button>
                    ))}
                </HStack>
                {onClose && (
                    <IconButton
                        aria-label="Close"
                        variant="ghost"
                        size="sm"
                        borderRadius="full"
                        color="gray.500"
                        _hover={{ bg: "gray.100" }}
                        onClick={onClose}
                    >
                        <X size={18} />
                    </IconButton>
                )}
            </HStack>

            {/* ── Messages area ── */}
            <VStack
                flex={1}
                w="full"
                overflowY="auto"
                px={4}
                py={3}
                gap={3}
                align="stretch"
                minH={0}
                bg="#f8f9fa"
            >
                {/* Welcome message — always shown at top */}
                <Box
                    bg="#e8eaed"
                    borderRadius="10px"
                    px={3}
                    py={2.5}
                >
                    <Text fontSize="0.82rem" color="#444" lineHeight="1.5">
                        Welcome to Chat!<br />
                        All messages are deleted when call ends.
                    </Text>
                </Box>

                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        alignSelf={msg.senderId === 'system' ? "center" : (msg.isOwn ? "flex-end" : "flex-start")}
                        maxW={msg.senderId === 'system' ? "100%" : "80%"}
                    >
                        {msg.senderId === 'system' ? (
                            <Box
                                bg="gray.200"
                                color="gray.600"
                                px={3}
                                py={1}
                                borderRadius="full"
                                textAlign="center"
                                fontSize="xs"
                                fontStyle="italic"
                            >
                                <Text>{msg.message}</Text>
                            </Box>
                        ) : (
                            <VStack align={msg.isOwn ? "flex-end" : "flex-start"} gap={1}>
                                {!msg.isOwn && (
                                    <Text fontSize="xs" color="gray.600" fontWeight="500">
                                        {msg.senderName}
                                    </Text>
                                )}
                                <Box
                                    bg={msg.isOwn ? "#111D4A" : "white"}
                                    color={msg.isOwn ? "white" : "gray.800"}
                                    px={3}
                                    py={2}
                                    borderRadius="12px"
                                    maxW="100%"
                                    wordBreak="break-word"
                                    shadow="sm"
                                >
                                    <Text fontSize="0.82rem">{msg.message}</Text>
                                </Box>
                                <Text fontSize="0.68rem" color="gray.400">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </VStack>
                        )}
                    </Box>
                ))}
                <div ref={messagesEndRef} />
            </VStack>

            {/* ── Input area ── */}
            <Box flexShrink={0} borderTopWidth="1px" borderColor="gray.100">
                <Box bg="#FDF6EE" px={4} py={3}>
                    <Input
                        border="none"
                        outline="none"
                        focusRing="none"
                        placeholder="Type Message Here"
                        _placeholder={{ color: "#999", fontSize: "0.875rem" }}
                        fontSize="0.875rem"
                        color="gray.800"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={!isConnected}
                    />
                </Box>
                <HStack
                    px={4}
                    py={2.5}
                    justify="space-between"
                    bg="white"
                >
                    <HStack gap={2}>
                        <IconButton
                            aria-label="Attach file"
                            variant="ghost"
                            size="sm"
                            borderRadius="full"
                            color="gray.500"
                            _hover={{ bg: "gray.100" }}
                        >
                            <ChevronRight size={18} style={{ transform: 'rotate(90deg)' }} />
                        </IconButton>
                        <IconButton
                            aria-label="Emoji"
                            variant="ghost"
                            size="sm"
                            borderRadius="full"
                            color="gray.500"
                            _hover={{ bg: "gray.100" }}
                        >
                            <SmileIcon size={18} />
                        </IconButton>
                    </HStack>
                    <IconButton
                        aria-label="Send"
                        variant="ghost"
                        size="sm"
                        borderRadius="full"
                        color={newMessage.trim() && isConnected ? "#111D4A" : "gray.300"}
                        _hover={{ bg: "gray.100" }}
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || !isConnected}
                    >
                        <ChevronRight size={20} />
                    </IconButton>
                </HStack>
            </Box>
        </VStack>
    );
};

// End Call Confirmation Modal
const EndCallModal = ({ isOpen, onClose, onConfirm, isLoading }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
}) => {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()} placement="center" size="xs">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        alignItems="center"
                        p="26px"
                        borderRadius="16px"
                        w="full"
                        maxW="400px"
                        bg="white"
                        shadow="xl"
                    >
                        <Dialog.CloseTrigger asChild>
                            <CloseButton
                                position="absolute"
                                top="16px"
                                right="16px"
                                size="sm"
                                color="gray.500"
                                _hover={{ color: "gray.700" }}
                            />
                        </Dialog.CloseTrigger>

                        <Dialog.Body mt="10px" textAlign="center" w="full">
                            {/* Warning Icon */}
                            <Box
                                w="80px"
                                h="80px"
                                borderRadius="full"
                                bg="red.100"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mx="auto"
                                mb="6"
                            >
                                <Icon as={IoCall} boxSize={10} color="red.500" />
                            </Box>

                            {/* Title */}
                            <Text fontSize="24px" fontWeight="bold" color="text_primary" mb="3">
                                End Call?
                            </Text>

                            {/* Description */}
                            <Text fontSize="16px" color="gray.600" mb="8" lineHeight="1.5">
                                Are you sure you want to end this video call? This action cannot be undone.
                            </Text>

                            {/* Action Buttons */}
                            <VStack gap={3} w="full">
                                <Button
                                    w="full"
                                    bg="red.600"
                                    color="white"
                                    _hover={{ bg: "red.700" }}
                                    _active={{ bg: "red.800" }}
                                    onClick={onConfirm}
                                    loading={isLoading}
                                    disabled={isLoading}
                                    h="48px"
                                    fontSize="16px"
                                    fontWeight="600"
                                    borderRadius="lg"
                                >
                                    {isLoading ? "Ending Call..." : "End Call"}
                                </Button>

                                <Button
                                    w="full"
                                    variant="outline"
                                    borderColor="gray.300"
                                    color="gray.700"
                                    _hover={{ bg: "gray.50" }}
                                    onClick={onClose}
                                    disabled={isLoading}
                                    h="48px"
                                    fontSize="16px"
                                    fontWeight="500"
                                    borderRadius="lg"
                                >
                                    Cancel
                                </Button>
                            </VStack>
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default VideoCalling;
