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
} from "agora-rtc-react";

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
import { BsCameraVideoFill, BsCameraVideoOff } from "react-icons/bs";
import { TbMicrophoneFilled, TbMicrophoneOff } from "react-icons/tb";

const partdp1 = "/images/dp.png";
import { FC, useEffect, useRef, useState, useMemo } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { useGetVideoTokenMutation, useGetConversationMutation } from "mangarine/state/services/apointment.service";
import { setCurrentConversation } from "mangarine/state/reducers/appointment.reducer";
import { useDispatch } from "react-redux";
import { useConsultationJoin } from "../../../hooks/useConsultationJoin";
import AppLayout from "mangarine/layouts/AppLayout";
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
    ChevronRight, MoreVertical, FlipHorizontal2, Camera, MessageSquare,
} from "lucide-react";
import { VirtualBackgroundProcessor, VirtualBackgroundOptions, PREDEFINED_BACKGROUNDS } from "mangarine/utils/virtualBackground";


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
    }, [videoStatus]); // Re-run effect when user or visibility state changes

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
}> = ({ appId, channel, calling, setCalling, cameraOn, setCamera, micOn, setMic, localCameraTrack, localMicrophoneTrack, consultationName, tokenReady = true, joinError }) => {
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
                <Text color="red.500" fontSize="0.875rem" mb={2} maxW="680px" w="full" textAlign="center">
                    {joinError}
                </Text>
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

export const VideoCalling = ({ consultationId }: { consultationId?: string }) => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    return (
        <AgoraRTCProvider client={client}>
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
    const [participants, setParticipants] = useState([])
    const isConnected = useIsConnected(); // Store the user's connection status
    const [appId] = useState(process.env.NEXT_PUBLIC_AGORA_APP_ID);
    const [channel, setChannel] = useState(currentConversation.id);
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
    const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
    const { localCameraTrack } = useLocalCameraTrack(cameraOn);
    const { markUserJoined } = useConsultationJoin();
    const [hasMarkedJoined, setHasMarkedJoined] = useState(false);


    // Screen sharing states
    const [screenShareOn, setScreenShareOn] = useState(false);
    const [screenTrack, setScreenTrack] = useState<ILocalVideoTrack | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [localVideoReady, setLocalVideoReady] = useState(false);

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
            markUserJoined(currentConversation.id)
                .then(() => {
                    console.log('Successfully marked user as joined consultation');
                    setHasMarkedJoined(true);
                })
                .catch((error) => {
                    console.error('Failed to mark user as joined:', error);
                    // Retry after 5 seconds if failed
                    setTimeout(() => {
                        if (!hasMarkedJoined) {
                            markUserJoined(currentConversation.id)
                                .then(() => {
                                    setHasMarkedJoined(true);
                                })
                                .catch(() => {
                                    console.error('Retry failed to mark user as joined');
                                });
                        }
                    }, 5000);
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
                const track = await AgoraRTC.createScreenVideoTrack({}, "auto");
                setScreenTrack(track as unknown as ILocalVideoTrack);
                setScreenShareOn(true);
                setCamera(false); // turn off camera while sharing screen
                // Nudge re-render to ensure LocalUser swaps tracks immediately
                setForceUpdate((p) => p + 1);
                // Auto stop when user ends share via browser UI
                try {
                    // @ts-ignore optional event listener in Agora tracks
                    track.on && track.on('track-ended', () => {
                        setScreenTrack(null);
                        setScreenShareOn(false);
                        setCamera(true);
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
            setCamera(true); // restore camera

            // Force re-render of published tracks
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
        const initVirtualBackground = async () => {
            try {
                const processor = new VirtualBackgroundProcessor();
                await processor.initialize();
                setVirtualBgProcessor(processor);
            } catch (error) {
                console.error('Failed to initialize virtual background:', error);
            }
        };
        
        initVirtualBackground();
        
        return () => {
            if (virtualBgProcessor) {
                virtualBgProcessor.cleanup();
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

    const [getVideoToken, { isLoading }] = useGetVideoTokenMutation();
    const [getConversations] = useGetConversationMutation();
    const dispatch = useDispatch();

    const muteRemoteAudio = (audioTrack: IRemoteAudioTrack | null) => {
        if (!audioTrack) return;
        audioTrack.setVolume(0);
    };

    // Unmute remote audio
    const unmuteRemoteAudio = (audioTrack: IRemoteAudioTrack | null) => {
        if (!audioTrack) return;
        audioTrack.setVolume(100);  // Set to a reasonable volume level
    };


    const { error: joinErr } = useJoin(
        { appid: appId, channel: currentConversation.id, token: token ? token : null, uid: 0 },
        calling
    );

    useEffect(() => {
        if (joinErr) {
            console.error('Agora join error:', joinErr);
            setCalling(false);
            setJoinError(`Connection failed: ${(joinErr as any)?.message || JSON.stringify(joinErr)}`);
        }
    }, [joinErr]);
    const publishedTracks = useMemo(() => {
        if (screenShareOn && screenTrack) {
            return [localMicrophoneTrack, screenTrack];
        }
        return [localMicrophoneTrack, localCameraTrack];
    }, [screenShareOn, screenTrack, localMicrophoneTrack, localCameraTrack]);

    usePublish(publishedTracks as any);

    const remoteUsers = useRemoteUsers();

    // Fetch token only once the correct conversation is loaded
    useEffect(() => {
        const convId = currentConversation?.id;
        if (!convId) return;
        // If a consultationId was given, wait until the conversation matches it
        if (consultationId && convId !== consultationId) return;

        setTokenReady(false);
        getVideoToken(convId)
            .unwrap()
            .then((payload) => {
                console.log(payload.token);
                setToken(payload.token);
                setTokenReady(true);
            })
            .catch((error) => {
                console.log(error);
                setTokenReady(true); // Allow joining without token (open channels)
            });
    }, [currentConversation?.id]);

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

    // Fetch conversation by consultationId if provided
    useEffect(() => {
        if (consultationId && (!currentConversation?.id || currentConversation?.id !== consultationId)) {
            setIsLoadingConversation(true);
            getConversations({})
                .unwrap()
                .then((payload) => {
                    const conversation = payload.data?.find((conv: any) => conv.id === consultationId);
                    if (conversation) {
                        dispatch(setCurrentConversation({ conversation }));
                    } else {
                        console.log('Conversation not found for consultationId:', consultationId);
                    }
                })
                .catch((error) => {
                    console.log('Error fetching conversation:', error);
                })
                .finally(() => {
                    setIsLoadingConversation(false);
                });
        }
    }, [consultationId, currentConversation?.id, getConversations, dispatch]);

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


    useEffect(() => {
        console.log('[Agora] appId:', appId, '| channel:', currentConversation?.id, '| token:', token ? `${token.slice(0,12)}...` : 'EMPTY', '| calling:', calling);
    }, [token, calling, appId, currentConversation?.id])

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
    }, [user?.id, currentConversation?.id, user?.fullName, user?.profilePics, isConnected]);

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

            // First, stop publishing tracks to the channel
            if (localCameraTrack && typeof localCameraTrack.stop === 'function') {
                console.log('Stopping camera track...');
                try {
                    localCameraTrack.stop();
                    console.log('Camera track stopped successfully');
                } catch (error) {
                    console.error('Error stopping camera track:', error);
                }
            } else {
                console.log('Camera track not available or invalid');
            }

            if (localMicrophoneTrack && typeof localMicrophoneTrack.stop === 'function') {
                console.log('Stopping microphone track...');
                try {
                    localMicrophoneTrack.stop();
                    console.log('Microphone track stopped successfully');
                } catch (error) {
                    console.error('Error stopping microphone track:', error);
                }
            } else {
                console.log('Microphone track not available or invalid');
            }

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

            // Force cleanup of any remaining tracks with multiple attempts
            const forceCleanup = () => {
                if (localCameraTrack && typeof localCameraTrack.stop === 'function') {
                    try {
                        console.log('Force stopping camera track...');
                        localCameraTrack.stop();
                    } catch (error) {
                        console.error('Error in force camera cleanup:', error);
                    }
                }

                if (localMicrophoneTrack && typeof localMicrophoneTrack.stop === 'function') {
                    try {
                        console.log('Force stopping microphone track...');
                        localMicrophoneTrack.stop();
                    } catch (error) {
                        console.error('Error in force microphone cleanup:', error);
                    }
                }
            };

            // Multiple cleanup attempts with delays
            forceCleanup();
            setTimeout(forceCleanup, 100);
            setTimeout(forceCleanup, 500);
            setTimeout(forceCleanup, 1000);

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

    // Cleanup effect to ensure tracks are stopped when component unmounts
    useEffect(() => {
        return () => {
            console.log('Component unmounting, cleaning up tracks...');

            // Stop all tracks when component unmounts
            if (localCameraTrack && typeof localCameraTrack.stop === 'function') {
                try {
                    localCameraTrack.stop();
                    console.log('Camera track stopped on unmount');
                } catch (error) {
                    console.error('Error stopping camera track on unmount:', error);
                }
            } else {
                console.log('Camera track not available for cleanup on unmount');
            }

            if (localMicrophoneTrack && typeof localMicrophoneTrack.stop === 'function') {
                try {
                    localMicrophoneTrack.stop();
                    console.log('Microphone track stopped on unmount');
                } catch (error) {
                    console.error('Error stopping microphone track on unmount:', error);
                }
            } else {
                console.log('Microphone track not available for cleanup on unmount');
            }

            // Clean up Socket.IO if still connected
            if (socketRef.current && chatConnected) {
                try {
                    socketRef.current.disconnect();
                    console.log('Socket.IO disconnected on unmount');
                } catch (error) {
                    console.error('Error disconnecting Socket.IO on unmount:', error);
                }
            }
            // Ensure any ongoing recording is stopped
            try { stopRecording(); } catch { }
        };
    }, [localCameraTrack, localMicrophoneTrack, chatConnected]);

    // Show loading state while fetching conversation
    if (isLoadingConversation) {
        return (
            <Flex justify="center" align="center" h="100vh">
                <Text>Loading consultation...</Text>
            </Flex>
        );
    }

    // Show error state if consultationId is provided but conversation is not found
    if (consultationId && !currentConversation?.id) {
        return (
            <Flex justify="center" align="center" h="100vh" direction="column" gap={4}>
                <Text>Consultation not found</Text>
                <Button onClick={() => router.back()}>Go Back</Button>
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
                bg={danger ? "#ea4335" : active ? "white" : "rgba(255,255,255,0.12)"}
                color={danger ? "white" : active ? "#1C275D" : "white"}
                _hover={{
                    bg: danger ? "#c5221f" : active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.2)",
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
            <AppLayout>
                <Flex h="full" w="full" direction="row" borderRadius="16px" overflow="hidden" position="relative">
                    {/* ── Main call area ── */}
                    <Flex direction="column" flex={1} bg="#202124" position="relative" minW={0}>
                        {/* Video content */}
                        <Box flex={1} position="relative" overflow="hidden">
                            {isConnected ? (
                            <>
                                {/* ── Header bar ── */}
                                <HStack
                                    position="absolute"
                                    top={0}
                                    left={0}
                                    right={0}
                                    px={5}
                                    py={3}
                                    bg="rgba(0,0,0,0.45)"
                                    backdropFilter="blur(6px)"
                                    zIndex={10}
                                    justify="space-between"
                                >
                                    <HStack gap={3}>
                                        <IconButton
                                            aria-label="Back"
                                            borderRadius="full"
                                            size="sm"
                                            bg="rgba(255,255,255,0.12)"
                                            color="white"
                                            _hover={{ bg: "rgba(255,255,255,0.22)" }}
                                            onClick={() => router.back()}
                                        >
                                            <BiChevronLeft size={18} />
                                        </IconButton>
                                        <Text
                                            fontFamily="Outfit"
                                            fontWeight="600"
                                            fontSize={{ base: "0.95rem", md: "1.1rem" }}
                                            color="white"
                                        >
                                            {otherParticipantName}&apos;s Consultation
                                        </Text>
                                        <HStack
                                            px={3}
                                            py={1}
                                            bg="rgba(255,255,255,0.14)"
                                            borderRadius="full"
                                            gap={1.5}
                                        >
                                            <Users size={13} color="white" />
                                            <Text fontSize="0.8rem" color="white" fontWeight="500">
                                                {conversationParticipants.length + remoteUsers.length}
                                            </Text>
                                        </HStack>
                                    </HStack>
                                    {isRecording && (
                                        <HStack
                                            px={3}
                                            py={1.5}
                                            bg="rgba(220,38,38,0.8)"
                                            borderRadius="full"
                                            gap={2}
                                        >
                                            <Box w={2.5} h={2.5} bg="white" borderRadius="full" />
                                            <Text color="white" fontSize="0.82rem" fontWeight="600">
                                                {recordingElapsed}
                                            </Text>
                                        </HStack>
                                    )}
                                </HStack>

                                {/* ── Main video stage ── */}
                                <Box ref={containerRef} w="full" h="full" position="relative" bg="#202124">
                                    {remoteUsers.length > 0 ? (
                                        // Remote user takes full stage
                                        <RemoteUser
                                            user={remoteUsers[0]}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        // Local user fills stage when alone
                                        <>
                                            {(screenShareOn ? !!screenTrack : !!localCameraTrack) ? (
                                                <LocalUser
                                                    audioTrack={localMicrophoneTrack}
                                                    cameraOn={screenShareOn ? true : (cameraOn && !!localCameraTrack)}
                                                    micOn={micOn}
                                                    playAudio={false}
                                                    videoTrack={screenShareOn && screenTrack ? screenTrack : localCameraTrack}
                                                    key={`local-main-${forceUpdate}`}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            ) : (
                                                <Flex align="center" justify="center" w="full" h="full" bg="#202124" direction="column" gap={4}>
                                                    <Text color="rgba(255,255,255,0.5)" fontSize="1.1rem" fontWeight="500">
                                                        👋 Welcome {user?.fullName?.split(' ')[0]}
                                                    </Text>
                                                    <Text color="rgba(255,255,255,0.35)" fontSize="0.9rem">
                                                        No one else has joined yet
                                                    </Text>
                                                    <Box
                                                        w="72px"
                                                        h="72px"
                                                        borderRadius="full"
                                                        bg="#3c4043"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        fontSize="1.8rem"
                                                        color="white"
                                                        fontWeight="700"
                                                    >
                                                        {user?.fullName?.[0]?.toUpperCase() || '?'}
                                                    </Box>
                                                </Flex>
                                            )}
                                        </>
                                    )}

                                    {/* Local PiP — bottom right when remote is present */}
                                    {remoteUsers.length > 0 && (
                                        <Box
                                            position="absolute"
                                            bottom={20}
                                            right={4}
                                            w="160px"
                                            style={{ aspectRatio: "4/3" }}
                                            borderRadius="12px"
                                            overflow="hidden"
                                            borderWidth="2px"
                                            borderColor="rgba(255,255,255,0.2)"
                                            shadow="lg"
                                            bg="#3c4043"
                                        >
                                            {cameraOn && localCameraTrack ? (
                                                <LocalUser
                                                    audioTrack={localMicrophoneTrack}
                                                    cameraOn={cameraOn}
                                                    micOn={micOn}
                                                    playAudio={false}
                                                    videoTrack={localCameraTrack}
                                                    key={`local-pip-${forceUpdate}`}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            ) : (
                                                <Flex align="center" justify="center" w="full" h="full">
                                                    <Text color="white" fontWeight="700" fontSize="1.4rem">
                                                        {user?.fullName?.[0]?.toUpperCase() || 'Y'}
                                                    </Text>
                                                </Flex>
                                            )}
                                            <Text
                                                position="absolute"
                                                bottom={1.5}
                                                left={2}
                                                fontSize="0.65rem"
                                                color="white"
                                                bg="rgba(0,0,0,0.5)"
                                                px={1.5}
                                                py={0.5}
                                                borderRadius="4px"
                                            >
                                                You
                                            </Text>
                                        </Box>
                                    )}
                                </Box>

                                {/* ── Bottom toolbar ── */}
                                <HStack
                                    position="absolute"
                                    bottom={0}
                                    left={0}
                                    right={0}
                                    px={6}
                                    py={3}
                                    bg="#3c4043"
                                    justify="space-between"
                                    zIndex={10}
                                >
                                    {/* Left: empty spacer for balance */}
                                    <Box flex={1} />

                                    {/* Center: main controls */}
                                    <HStack gap={{ base: 2, md: 3 }} justify="center" flex={2}>
                                        <ToolBtn
                                            label={micOn ? "Mute" : "Unmute"}
                                            icon={micOn
                                                ? <TbMicrophoneFilled size={20} />
                                                : <TbMicrophoneOff size={20} />}
                                            active={micOn}
                                            danger={!micOn}
                                            onClick={() => setMic((a) => !a)}
                                        />
                                        <ToolBtn
                                            label={cameraOn ? "Turn off camera" : "Turn on camera"}
                                            icon={cameraOn
                                                ? <BsCameraVideoFill size={18} />
                                                : <BsCameraVideoOff size={18} />}
                                            active={cameraOn}
                                            danger={!cameraOn}
                                            onClick={() => setCamera((a) => !a)}
                                        />
                                        <ToolBtn
                                            label="Emoji reactions"
                                            icon={<SmileIcon size={20} />}
                                            onClick={() => setShowVirtualBgPanel(!showVirtualBgPanel)}
                                            active={virtualBgOptions.type !== 'none'}
                                        />
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

                                    {/* Right: end call */}
                                    <HStack flex={1} justify="flex-end">
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
                                channel={currentConversation?.id}
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
            </AppLayout>

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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
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

    const handleDownloadTranscript = () => {
        const lines = messages
            .filter((m) => m.senderId !== 'system')
            .map((m) => `[${m.timestamp.toLocaleTimeString()}] ${m.senderName}: ${m.message}`)
            .join('\n');
        const blob = new Blob([lines], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcript.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <VStack
            alignItems={"flex-start"}
            rounded={"10px"}
            w="full"
            borderWidth={0.5}
            borderColor={"gray.50"}
            shadow="md"
            flex={2}
            pos="relative"
            bg="white"
            h="full"
        >
            {/* Transcript panel header */}
            <HStack
                w="full"
                px={4}
                py={3}
                borderBottom="1px"
                borderColor="gray.100"
                justify="space-between"
                align="center"
                flexShrink={0}
            >
                <Text
                    color="gray.800"
                    fontWeight="600"
                    fontSize="1rem"
                >
                    Meeting Transcript {!isConnected && <Text as="span" color="red.400" fontSize="xs">(Disconnected)</Text>}
                </Text>
                <HStack gap={1}>
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <IconButton aria-label="More options" variant="ghost" size="sm" color="gray.500" _hover={{ bg: "gray.100" }}>
                                <MoreVertical size={18} />
                            </IconButton>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content minW="200px" shadow="lg" borderRadius="md">
                                    <Menu.Item value="translate" fontSize="sm">Translate to...</Menu.Item>
                                    <Menu.Item value="show-original" fontSize="sm">Show original and translated</Menu.Item>
                                    <Menu.Item value="download" fontSize="sm" onClick={handleDownloadTranscript}>Download Transcript</Menu.Item>
                                </Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                    {onClose && (
                        <IconButton aria-label="Close panel" variant="ghost" size="sm" color="gray.500" _hover={{ bg: "gray.100" }} onClick={onClose}>
                            <X size={18} />
                        </IconButton>
                    )}
                </HStack>
            </HStack>

            <VStack
                flex={1}
                w="full"
                overflowY="auto"
                px={4}
                py={2}
                gap={3}
                align="stretch"
                minH={0}
            >
                {messages.length === 0 ? (
                    <VStack justify="center" h="full" color="gray.500" gap={2}>
                        <Text fontSize="sm">No messages yet</Text>
                        <Text fontSize="xs">Start the conversation!</Text>
                    </VStack>
                ) : (
                    messages.map((msg) => (
                        <Box
                            key={msg.id}
                            alignSelf={msg.senderId === 'system' ? "center" : (msg.isOwn ? "flex-end" : "flex-start")}
                            maxW={msg.senderId === 'system' ? "100%" : "80%"}
                        >
                            {msg.senderId === 'system' ? (
                                // System message (join/leave notifications)
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
                                // Regular chat message
                                <VStack align={msg.isOwn ? "flex-end" : "flex-start"} gap={1}>
                                    {!msg.isOwn && (
                                        <HStack gap={2} align="center">
                                            <Box
                                                w={6}
                                                h={6}
                                                borderRadius="full"
                                                overflow="hidden"
                                            >
                                                <Image
                                                    src={msg.senderImage || partdp1}
                                                    alt={msg.senderName}
                                                    w="full"
                                                    h="full"
                                                    objectFit="cover"
                                                />
                                            </Box>
                                            <Text fontSize="xs" color="gray.600" fontWeight="500">
                                                {msg.senderName}
                                            </Text>
                                        </HStack>
                                    )}
                                    <Box
                                        bg={msg.isOwn ? "blue.500" : "gray.100"}
                                        color={msg.isOwn ? "white" : "gray.800"}
                                        px={3}
                                        py={2}
                                        borderRadius="lg"
                                        maxW="100%"
                                        wordBreak="break-word"
                                    >
                                        <Text fontSize="sm">{msg.message}</Text>
                                    </Box>
                                    <Text fontSize="xs" color="gray.500">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                </VStack>
                            )}
                        </Box>
                    ))
                )}
                <div ref={messagesEndRef} />
            </VStack>

            <HStack
                w="100%"
                mx="auto"
                p="4"
                alignItems={"center"}
                flexShrink={0}
                bg="white"
                borderTop="1px"
                borderColor="gray.100"
            >
                <HStack
                    w="full"
                    bg="#F4F4F4"
                    rounded="full"
                    px="2"
                    spaceX="0"
                >
                    <IconButton
                        aria-label="emoji"
                        variant="ghost"
                        rounded="full"
                        size="sm"
                    >
                        <SmileIcon />
                    </IconButton>
                    <Input
                        variant='flushed'
                        focusRing={"none"}
                        border={"none"}
                        pl="3"
                        _focus={{
                            shadow: "none",
                        }}
                        shadow={"xs"}
                        placeholder="Type a message..."
                        color={"#999999"}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        fontSize={"14px"}
                        disabled={!isConnected}
                    />
                    <Button
                        aria-label="Send message"
                        size="sm"
                        variant="ghost"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || !isConnected}
                        p={2}
                    >
                        <Image src={"/icons/send.svg"} alt="send icon" boxSize={4} />
                    </Button>
                </HStack>
            </HStack>

            {/* Download Transcript button */}
            <Box w="full" px={4} pb={4} flexShrink={0} mt="auto">
                <Button
                    w="full"
                    variant="outline"
                    size="sm"
                    color="gray.600"
                    borderColor="gray.200"
                    _hover={{ bg: "gray.50" }}
                    onClick={handleDownloadTranscript}
                    disabled={messages.filter((m) => m.senderId !== 'system').length === 0}
                >
                    <HStack gap={2}>
                        <Download size={15} />
                        <Text fontSize="sm">Download Transcript</Text>
                    </HStack>
                </Button>
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
