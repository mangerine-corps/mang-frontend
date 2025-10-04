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
const partdp3 = "/images/dp2.png";
import { FC, useEffect, useRef, useState, useMemo } from "react";
import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { useGetVideoTokenMutation, useGetConversationMutation } from "mangarine/state/services/apointment.service";
import { setCurrentConversation } from "mangarine/state/reducers/appointment.reducer";
import { useDispatch } from "react-redux";
import { useConsultationJoin } from "../../../hooks/useConsultationJoin";
import AppLayout from "mangarine/layouts/AppLayout";
import { Avatar, AvatarGroup, Box, Button, Flex, HStack, Icon, IconButton, Image, Input, Stack, Text, VStack, Menu, Portal, Dialog, CloseButton } from '@chakra-ui/react';
import { useAuth } from "mangarine/state/hooks/user.hook";
import { BiChevronDown, BiChevronLeft } from "react-icons/bi";
import { useRouter } from "next/router";
import { FaEllipsisV, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import CustomButton from "mangarine/components/customcomponents/button";
import { IoCall } from "react-icons/io5";
import { FiMaximize } from "react-icons/fi";
import { socket as globalSocketInstance } from 'mangarine/state/services/socket.service';
import { RiRecordCircleFill, RiStopCircleFill } from "react-icons/ri";
import { toaster } from "mangarine/components/ui/toaster";
import { SmileIcon } from "lucide-react";
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

// Advanced Google Meet–style pre-join panel
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
}> = ({ appId, channel, calling, setCalling, cameraOn, setCamera, micOn, setMic, localCameraTrack, localMicrophoneTrack }) => {
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
    const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string | undefined>();
    const [selectedMic, setSelectedMic] = useState<string | undefined>();
    const [selectedSpeaker, setSelectedSpeaker] = useState<string | undefined>();
    const preJoinVideoRef = useRef<any>(null);
    // Local re-render nudger and readiness flag for pre-join preview
    const [, setForceUpdate] = useState(0);
    const [localVideoReady, setLocalVideoReady] = useState(false);

    useEffect(() => {
        if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                setCameras(devices.filter((d) => d.kind === 'videoinput'));
                setMicrophones(devices.filter((d) => d.kind === 'audioinput'));
                setSpeakers(devices.filter((d) => d.kind === 'audiooutput'));
            });
        }
    }, []);

    // Ensure local tracks are enabled and nudge re-render when they change
    // The useEffect hooks for enabling tracks and detecting the first frame have been removed.
    // The useLocalCameraTrack(cameraOn) and useLocalMicrophoneTrack(micOn) hooks already manage the enabled state.
    // The logic for video readiness is now handled more effectively in the main VideoContainer.

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
        // Live self preview when not joined
        if (!calling && cameraOn && preJoinVideoRef.current && localCameraTrack) {
            localCameraTrack.play(preJoinVideoRef.current);
            return () => {
                localCameraTrack.stop();
            };
        }
    }, [calling, cameraOn, localCameraTrack]);

    return (
        <Flex w='full' h='full' align='center' justify='center' px={4}>
            <Flex w={{ base: '100%', md: '90%' }} gap={6} align='stretch' direction={{ base: 'column', md: 'row' }}>
                {/* Self preview */}
                <Box flex={3} bg='black' rounded='lg' overflow='hidden' position='relative' minH={{ base: '260px', md: '360px' }}>
                    <Box ref={preJoinVideoRef} w='100%' h='100%' />
                    <HStack position='absolute' bottom={3} left={3} gap={3}>
                        <VideoActions
                            icon={<TbMicrophoneFilled />}
                            activeIcon={<TbMicrophoneOff />}
                            canToggle
                            toggleStatus={micOn}
                            onClick={() => setMic((v) => !v)}
                        />
                        <VideoActions
                            icon={<BsCameraVideoFill />}
                            activeIcon={<BsCameraVideoOff />}
                            canToggle
                            toggleStatus={cameraOn}
                            onClick={() => setCamera((v) => !v)}
                        />
                    </HStack>
                </Box>

                {/* Controls */}
                <VStack flex={2} bg='main_background' rounded='lg' borderWidth='1px' borderColor='gray.100' p={4} gap={4} align='stretch' shadow='md'>
                    <Text color='text_primary' fontWeight='600' fontSize='lg'>Ready to join?</Text>
                    <VStack gap={3} align='stretch'>
                        <Text color='text_primary' fontSize='sm' fontWeight='500'>Camera</Text>
                        <select value={selectedCamera} onChange={(e) => setSelectedCamera(e.target.value)} disabled={!cameras.length} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                            <option value="">{cameras.length ? 'Select camera' : 'No cameras found'}</option>
                            {cameras.map((d) => (<option key={d.deviceId} value={d.deviceId}>{d.label || 'Camera'}</option>))}
                        </select>
                    </VStack>
                    <VStack gap={3} align='stretch'>
                        <Text color='text_primary' fontSize='sm' fontWeight='500'>Microphone</Text>
                        <select value={selectedMic} onChange={(e) => setSelectedMic(e.target.value)} disabled={!microphones.length} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                            <option value="">{microphones.length ? 'Select microphone' : 'No microphones found'}</option>
                            {microphones.map((d) => (<option key={d.deviceId} value={d.deviceId}>{d.label || 'Microphone'}</option>))}
                        </select>
                    </VStack>
                    <VStack gap={3} align='stretch'>
                        <Text color='text_primary' fontSize='sm' fontWeight='500'>Speakers</Text>
                        <select value={selectedSpeaker} onChange={(e) => setSelectedSpeaker(e.target.value)} disabled={!speakers.length} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                            <option value="">{speakers.length ? 'Select speakers' : 'No speakers found'}</option>
                            {speakers.map((d) => (<option key={d.deviceId} value={d.deviceId}>{d.label || 'Speakers'}</option>))}
                        </select>
                    </VStack>
                    <HStack gap={3} pt={2}>
                        <Button
                            disabled={!appId || !channel || calling}
                            onClick={() => setCalling(!calling)}
                            bgGradient='linear(to-r, #0F9D58, #34A853)'
                            color='white'
                            rounded='full'
                            px={6}
                            py={3}
                            shadow='md'
                            _hover={{ filter: 'brightness(1.05)' }}
                            _active={{ transform: 'scale(0.98)' }}
                            loading={calling}
                            loadingText='Joining…'
                        >
                            {!calling && <Icon as={BsCameraVideoFill} boxSize={5} mr={2} />}
                            <Text fontWeight='600'>{calling ? 'Joining…' : 'Join now'}</Text>
                        </Button>
                        <Button variant='outline' rounded='full' px={5} py={3} onClick={() => { }}>
                            Present
                        </Button>
                    </HStack>
                    <Text color='gray.500' fontSize='xs'>You will join with {micOn ? 'mic on' : 'mic off'} and {cameraOn ? 'camera on' : 'camera off'}.</Text>
                </VStack>
            </Flex>
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

    const { currentConversation } = useAppointment();
    const [participants, setParticipants] = useState([])
    const isConnected = useIsConnected(); // Store the user's connection status
    const [appId, setAppId] = useState(process.env.AGORA_APP_ID);
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

    const [showAllParticipant, setShowAllParticipant] = useState(false)
    const [search, setSearch] = useState('')
    const [toggleBtn, setToggleBtn] = useState(false)

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


    useJoin(
        { appid: appId, channel: currentConversation.id, token: token ? token : null, uid: user?.id },
        calling
    );
    const publishedTracks = useMemo(() => {
        if (screenShareOn && screenTrack) {
            return [localMicrophoneTrack, screenTrack];
        }
        return [localMicrophoneTrack, localCameraTrack];
    }, [screenShareOn, screenTrack, localMicrophoneTrack, localCameraTrack]);

    usePublish(publishedTracks as any);

    const remoteUsers = useRemoteUsers();

    useEffect(() => {

        getVideoToken(currentConversation?.id)
            .unwrap()
            .then((payload) => {
                console.log(payload.token)
                setToken(payload.token);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    // Fetch conversation by consultationId if provided
    useEffect(() => {
        if (consultationId && (!currentConversation?.id || currentConversation?.id !== consultationId)) {
            setIsLoadingConversation(true);
            getConversations({})
                .unwrap()
                .then((payload) => {
                    const conversation = payload.conversations?.find((conv: any) => conv.id === consultationId);
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
        console.log(token, channel, appId, calling)
        // 8a2e6207459942b4aa4f99269247362b
    }, [token, calling])

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

    return (
        <>
            <AppLayout>
                <Flex h="85vh" w='full'  >
                    <Box display={"flex"}
                        //   bg="#F4F4F4F2"
                        flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
                        justifyContent={"space-between"}
                        alignItems={'stretch'}
                        w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
                        //         // mx="auto"
                        //         // overflowY={"auto"}
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
                                // maxHeight: "0px",
                                height: "0px",
                                width: 0,
                            },
                        }}
                        spaceX="3">
                        <VStack
                            // minH={{ "2xl": "85vh" }}
                            h='full'
                            rounded={"10px"}
                            borderWidth={0.5}
                            borderColor={"gray.50"}
                            shadow="md"
                            w="full"
                            // p={4}
                            bg="main_background"
                            overflow={"auto"}
                            flex={4}
                            // spaceY={8}
                            // bg="green.900"
                            overflowY={"auto"}
                        >
                            {isConnected ? (
                                <Box pos='relative' ref={containerRef} w='full' h='full' >
                                    <HStack pos='absolute' top={0} p={3} zIndex={'overlay'} justifyContent={"space-between"} w="full">
                                        <HStack>
                                            <IconButton
                                                aria-label="back button"
                                                rounded="full"
                                                size={"xs"}
                                                borderWidth={1}
                                                borderColor={"gray.300"}
                                                color={"primary.200"}
                                                bg={"main_background"}
                                                shadow={"lg"}
                                                boxShadow={"lg"}
                                                onClick={() => {
                                                    router.back();
                                                }}
                                            >
                                                {" "}
                                                {<BiChevronLeft size={16} />}
                                            </IconButton>
                                            <Text
                                                fontFamily="Outfit"
                                                fontSize={{ base: "1rem", sm: "1.125rem", md: "1.25rem" }}
                                                fontWeight="600"
                                                color="text_primary"
                                                textAlign={{ base: "left", sm: "center" }}
                                                px={{ base: 2, sm: 0 }}

                                            >
                                                Consultation with {otherParticipantName}
                                            </Text>
                                        </HStack>
                                        {isRecording && (
                                            <HStack
                                                borderWidth={1}
                                                borderColor="gray.50"
                                                py={{ base: 1.5, sm: 2 }}
                                                px={{ base: 3, sm: 4 }}
                                                rounded="full"
                                                spaceX={{ base: 2, sm: 3 }}
                                                bg="main_background"
                                                shadow="lg"
                                            >
                                                <Box w={3} h={3} bg="red" rounded="full" />
                                                <Text
                                                    color="text_primary"
                                                    fontSize={{ base: "sm", sm: "md" }}
                                                    fontWeight="500"
                                                >
                                                    Recording • {recordingElapsed}
                                                </Text>
                                            </HStack>
                                        )}
                                    </HStack>
                                    <Box h='full' w='full'>
                                        {(screenShareOn ? !!screenTrack : !!localCameraTrack) ? (
                                            <LocalUser
                                                audioTrack={localMicrophoneTrack}
                                                cameraOn={screenShareOn ? true : (cameraOn && !!localCameraTrack)}
                                                micOn={micOn}
                                                playAudio={false}
                                                videoTrack={screenShareOn && screenTrack ? screenTrack : localCameraTrack}
                                                key={`${screenShareOn ? 'local-screen' : 'local-camera'}-${forceUpdate}`}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        ) : (
                                            <Flex align="center" justify="center" w="100%" h="100%" bg="black">
                                                <Text color="white" fontSize="sm">Starting video…</Text>
                                            </Flex>
                                        )}
                                    </Box>
                                    <VStack
                                        pos={"absolute"}
                                        px={4}
                                        spaceY={1.5}
                                        bottom={16}
                                        alignSelf={"flex-end"}
                                        right={0}
                                        rounded={'lg'}
                                    >
                                        {remoteUsers.map((user) => (
                                            // <Flex
                                            //     h="155px"
                                            //     px={"auto"}
                                            //     justifyContent={"flex-end"}
                                            //     pos={"relative"}
                                            //     w="150px"
                                            //     bgRepeat={"no-repeat"}
                                            //     bgSize={"cover"}
                                            //     rounded={"15px"}
                                            // >
                                            //     <HStack
                                            //         p={5}
                                            //         width={"100%"}
                                            //         alignSelf={"flex-start"}
                                            //         alignItems={"center"}
                                            //         justifyContent={"space-between"}
                                            //     >
                                            //         <Text
                                            //             py={3}
                                            //             px={4}
                                            //             rounded={"15px"}
                                            //             bg="#00000033"
                                            //             color={"main_background"}
                                            //             fontFamily={"Outfit"}
                                            //             fontSize={{ base: "1rem", sm: "1.125rem", md: "1.25rem" }}
                                            //         >
                                            //             Jerome Bell
                                            //         </Text>
                                            //         <IconButton
                                            //             size="md"
                                            //             bg="#00000033"
                                            //             shadow={"sm"}
                                            //             borderWidth={0.5}
                                            //             rounded="full"
                                            //             borderColor={"gray.50"}
                                            //             aria-label="open menu"
                                            //             color="text_primary"
                                            //         >
                                            //             {<FiMaximize color="main_background" size={24} />}
                                            //         </IconButton>
                                            //     </HStack>


                                            <Participant
                                                videoTrack={user.videoTrack}
                                                audioTrack={user.audioTrack}
                                                onRemoteAudio={() => unmuteRemoteAudio(user.audioTrack || null)}
                                                offRemoteAudio={() => muteRemoteAudio(user.audioTrack || null)}
                                                toggleVideo={() => setCamera(!cameraOn)}
                                                item={user} key={user.uid}
                                            >
                                                <RemoteUser user={user} style={{ width: "160px", height: '170px', borderRadius: 15, }}>
                                                    {/* <samp>{user.uid}</samp> */}
                                                </RemoteUser>
                                            </Participant>
                                            // </Flex>

                                        ))}
                                    </VStack>
                                    {isConnected && (


                                        <HStack
                                            backgroundBlendMode={"darken"}
                                            bottom="5rem"
                                            //px={4}
                                            rounded="full"
                                            //spaceX={5}
                                            //py={2}
                                            px={{ base: 2, sm: 4, md: 6 }}
                                            py={{ base: 1, sm: 2 }}
                                            spaceX={{ base: 0, sm: 4, md: 5 }}
                                            mx={"auto"}
                                            zIndex={'max'}
                                            left={{ lg: '17%' }}
                                            bg="#00000066"
                                            position={"fixed"}
                                        >
                                            <VideoActions
                                                icon={<TbMicrophoneFilled />}
                                                canToggle={true}
                                                activeIcon={<TbMicrophoneOff />}
                                                toggleStatus={micOn}
                                                onClick={() => setMic((a) => !a)}
                                            />

                                            <VideoActions
                                                icon={<BsCameraVideoFill />}
                                                canToggle={true}
                                                activeIcon={<BsCameraVideoOff />}
                                                toggleStatus={cameraOn}
                                                onClick={() => setCamera((a) => !a)}
                                            />
                                            <VideoActions
                                                icon={<Image src={monitor} alt="monitor icon" />}
                                                activeIcon={<Image src={monitor} alt="monitor icon" />}
                                                canToggle={true}
                                                toggleStatus={screenShareOn}
                                                onClick={toggleScreenShare}
                                            />
                                            <IconButton
                                                aria-label="Virtual Background"
                                                rounded="full"
                                                size={"md"}
                                                onClick={() => setShowVirtualBgPanel(!showVirtualBgPanel)}
                                                borderWidth={1}
                                                borderColor={"gray.300"}
                                                color={"primary.200"}
                                                bg={virtualBgOptions.type !== 'none' ? "primary.300" : "main_background"}
                                                shadow={"lg"}
                                                boxShadow={"lg"}
                                                title="Virtual Background"
                                                loading={isVirtualBgLoading}
                                            >
                                                <Icon color={virtualBgOptions.type !== 'none' ? 'white' : 'text_primary'}>
                                                    <SmileIcon />
                                                </Icon>
                                            </IconButton>
                                            <IconButton
                                                aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                                                rounded="full"
                                                size={"md"}
                                                onClick={() => (isRecording ? stopRecording() : startRecording())}
                                                borderWidth={1}
                                                borderColor={"gray.300"}
                                                color={"primary.200"}
                                                bg={isRecording ? "red.600" : "main_background"}
                                                shadow={"lg"}
                                                boxShadow={"lg"}
                                                title={isRecording ? 'Stop recording' : 'Start recording'}
                                            >
                                                <Icon color={isRecording ? 'white' : 'text_primary'}>
                                                    {isRecording ? <RiStopCircleFill /> : <RiRecordCircleFill />}
                                                </Icon>
                                            </IconButton>
                                            {/* <VideoActions
                                            icon={<Image src={text} alt="text icon" />}
                                            onClick={() => setRating(true)}
                                        />
                                        <VideoActions
                                            icon={<Image src={smile} alt="smile icon" />}
                                            onClick={() => setLeftMeeting(true)}
                                        /> */}
                                            {/* <VideoActions
                                            icon={<Image src={up} alt="up arrow icon" />}
                                            canToggle={false}
                                            activeIcon={<></>}
                                            onClick={() => setThankYou(true)}
                                        /> */}
                                            <Menu.Root>
                                                <Menu.Trigger asChild>
                                                    <IconButton
                                                        aria-label="back button"
                                                        rounded="full"
                                                        size={"md"}
                                                        onClick={() => { }}
                                                        borderWidth={1}
                                                        borderColor={"gray.300"}
                                                        color={"primary.200"}
                                                        bg={"main_background"}
                                                        shadow={"lg"}
                                                        boxShadow={"lg"}
                                                    >
                                                        <FaEllipsisV />
                                                    </IconButton>
                                                </Menu.Trigger>
                                                <Portal>
                                                    <Menu.Positioner>
                                                        <Menu.Content px="3" py="3" spaceY={"2"}>
                                                          
                                                            <Menu.Item
                                                                value="export-a"
                                                                _hover={{ bg: "primary." }}
                                                                roundedTop={"6px"}
                                                                color="text_primary"
                                                                fontSize="1rem"
                                                                py="2"
                                                                onClick={() => {
                                                                    // setShowBlockPage(true);
                                                                }}
                                                            >
                                                                <Menu.ItemCommand>
                                                                    {" "}
                                                                    <Image
                                                                        onClick={() => { }}
                                                                        alt="link Icon"
                                                                        src="/icons/pin.svg"
                                                                    />
                                                                </Menu.ItemCommand>{" "}
                                                                Turn on caption
                                                            </Menu.Item>
                                                            </Menu.Content>
                                                    </Menu.Positioner>
                                                </Portal>
                                            </Menu.Root>

                                            <Button
                                                bg="red.600"
                                                rounded="full"
                                                size={"md"}
                                                h={"2.5rem"}
                                                w={"2.5rem"}
                                                cursor={'pointer'}
                                                onClick={confirmEndCall}
                                                p={2}
                                                title="End Call"
                                                transition="all 0.2s"
                                                loading={isEndingCall}
                                                disabled={isEndingCall}
                                            >
                                                {isEndingCall ? (
                                                    <Box
                                                        w={4}
                                                        h={4}
                                                        borderRadius="full"
                                                        border="2px"
                                                        borderColor="white"
                                                        borderTopColor="transparent"
                                                        animation="spin 1s linear infinite"
                                                    />
                                                ) : (
                                                    <Icon as={IoCall} color="main_background" boxSize={4} />
                                                )}
                                            </Button>
                                        </HStack>


                                    )}
                                </Box>
                            ) : (
                                <PreJoinPanel
                                    appId={appId as string}
                                    channel={channel as string}
                                    calling={calling}
                                    setCalling={(v) => setCalling(v)}
                                    cameraOn={cameraOn}
                                    setCamera={(updater) => setCamera(updater)}
                                    micOn={micOn}
                                    setMic={(updater) => setMic(updater)}
                                    localCameraTrack={localCameraTrack}
                                    localMicrophoneTrack={localMicrophoneTrack}
                                />
                            )}

                        </VStack>
                        <VStack
                            minH={{ "2xl": "85vh" }}
                            w="full"
                            spaceY={3}
                            h="full"
                            flex={2}

                            display={{ base: "none", md: "none", lg: "flex", xl: "flex" }}
                        >
                            {!showAllParticipant && (
                                <VStack
                                    rounded={"10px"}
                                    borderWidth={0.5}
                                    borderColor={"gray.50"}
                                    shadow="md"

                                    boxShadow={toggleBtn ? "sm" : "xs"}
                                    w="full"
                                    p={toggleBtn ? 6 : 4}
                                    pb={4}
                                    bg="main_background"
                                    h='fit-content'
                                    alignSelf={toggleBtn ? undefined : "flex-start"}
                                    gap={toggleBtn ? 4 : 2}
                                    overflowY={"auto"}
                                >
                                    <HStack
                                        bg="main_background"
                                        w="full"
                                        flex="1"
                                        justifyContent={"space-between"}
                                    >
                                        <Text
                                            color={"text_primary"}
                                            fontWeight={toggleBtn ? "600" : "500"}
                                            fontSize={toggleBtn ? "1.25rem" : "md"}
                                        >
                                            Participants({conversationParticipants.length})
                                        </Text>
                                        <IconButton
                                            aria-label="down button"
                                            rounded="lg"
                                            size={"sm"}
                                            borderWidth={1}
                                            borderColor={"gray.50"}
                                            color={"text_primary"}
                                            bg={"main_background"}
                                            shadow={"lg"}
                                            boxShadow={"lg"}
                                            onClick={() => {
                                                setToggleBtn(!toggleBtn);
                                            }}
                                        >
                                            {" "}
                                            {<BiChevronDown size={16} />}
                                        </IconButton>
                                    </HStack>
                                    {toggleBtn ? (
                                        <HStack
                                            alignItems={"flex-start"}
                                            spaceX={4}
                                            w="full"
                                            h="full"
                                            flex="1"
                                        >
                                            <VStack w="full">
                                                <Stack w="full">
                                                    {conversationParticipants.map(p => (
                                                        <SideParticipant key={p.id} name={p.isSelf ? `${p.name} (You)` : p.name} image={p.image || partdp1} />
                                                    ))}
                                                </Stack>
                                                {conversationParticipants.length > 2 && (
                                                    <Button
                                                        variant={"ghost"}
                                                        border="none"
                                                        onClick={() => {
                                                            setShowAllParticipant(true);
                                                        }}
                                                    >
                                                        <Text
                                                            fontSize={16}
                                                            color="text_primary"
                                                            fontWeight={"600"}
                                                            fontFamily={"outfit"}
                                                            textAlign={"center"}
                                                        >
                                                            See all
                                                        </Text>
                                                    </Button>
                                                )}
                                            </VStack>
                                            <Box h="100%">
                                                <Box
                                                    h="40%"
                                                    w="10px"
                                                    bg="text_primary"
                                                    roundedTop="20px"
                                                >
                                                    <Image
                                                        src="/icons/soundoff.svg"
                                                        alt="mute"
                                                        cursor="pointer"
                                                    />
                                                </Box>{" "}
                                                <Box h="60%" w="10px" bg={"red.500"} roundedBottom="20px">
                                                    <Image
                                                        src="/icons/camera.svg"
                                                        alt="camera"
                                                        cursor="pointer"
                                                    />
                                                </Box>
                                            </Box>
                                        </HStack>
                                    ) : (
                                        <Stack pb={3} alignItems={"flex-start"} spaceX={4} w="full">
                                            <AvatarGroup
                                                gap="0" spaceX="-2" size="md">
                                                {conversationParticipants.map(p => (
                                                    <Avatar.Root key={p.id}>
                                                        <Avatar.Fallback name={p.name} />
                                                        <Avatar.Image bg="main_background" src={p.image || partdp1} />
                                                    </Avatar.Root>
                                                ))}
                                            </AvatarGroup>
                                        </Stack>
                                    )}
                                </VStack>
                            )}
                            <VStack
                                alignItems={"flex-start"}
                                rounded={"10px"}
                                w="full"
                                borderWidth={0.5}
                                borderColor={"gray.50"}
                                shadow="md"
                                flex={2}
                                pos="relative"
                                bg="main_background"
                            >
                                {isConnected ? (
                                    <VideoChat
                                        messages={chatMessages}
                                        onSendMessage={sendChatMessage}
                                        currentUserId={user?.id || ''}
                                        isConnected={chatConnected}
                                    />
                                ) : (
                                    <VStack
                                        alignItems={"center"}
                                        justify={"center"}
                                        w="full"
                                        h="full"
                                        gap={4}
                                        p={8}
                                    >
                                        <Box
                                            w={16}
                                            h={16}
                                            borderRadius="full"
                                            bg="gray.100"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Icon as={IoCall} boxSize={8} color="gray.400" />
                                        </Box>
                                        <VStack gap={2} textAlign="center">
                                            <Text
                                                color={"text_primary"}
                                                fontWeight={"600"}
                                                fontSize={"1.25rem"}
                                            >
                                                Video Chat
                                            </Text>
                                            <Text
                                                color={"gray.500"}
                                                fontSize={"md"}
                                            >
                                                Join the video call to start chatting
                                            </Text>
                                            <Text
                                                color={"gray.400"}
                                                fontSize={"sm"}
                                            >
                                                Chat will be available once you&apos;re connected
                                            </Text>
                                        </VStack>
                                    </VStack>
                                )}
                            </VStack>
                        </VStack>

                    </Box>
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
}> = ({ messages, onSendMessage, currentUserId, isConnected }) => {
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
            bg="main_background"
            h="full"
        >
            <Text
                w="full"
                textAlign={"left"}
                p={4}
                pb={4}
                color={"text_primary"}
                fontWeight={"600"}
                fontSize={"1.25rem"}
                borderBottom="1px"
                borderColor="gray.100"
            >
                Video Chat {!isConnected && "(Disconnected)"}
            </Text>

            <VStack
                flex={1}
                w="full"
                h="full"
                overflowY="auto"
                px={4}
                py={2}
                gap={3}
                align="stretch"
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
                pos="absolute"
                bottom={"0"}
                bg="main_background"
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
