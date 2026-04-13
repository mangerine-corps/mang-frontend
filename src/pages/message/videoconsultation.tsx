
"use client";
import React, { Component } from "react";
import { Box, Button, Text, VStack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const DynamicAgoraVideoCall = dynamic(
  () => import("mangarine/components/ui-components/video/agoravideocontainer"),
  { ssr: false }
);

/** Catches unhandled exceptions thrown by the Agora SDK internals */
class VideoErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      message: error?.message || "An unexpected video error occurred.",
    };
  }

  componentDidCatch(error: any, info: any) {
    console.error("[VideoErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          w="full"
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="gray.900"
        >
          <VStack gap={4} textAlign="center" maxW="420px" px={6}>
            <Text fontSize="1.25rem" fontWeight="700" color="white">
              Video call error
            </Text>
            <Text fontSize="0.9rem" color="gray.400">
              {this.state.message}
            </Text>
            <Button
              bg="#1C275D"
              color="white"
              borderRadius="10px"
              onClick={() => {
                this.setState({ hasError: false, message: "" });
                window.location.reload();
              }}
            >
              Reload and try again
            </Button>
          </VStack>
        </Box>
      );
    }
    return this.props.children;
  }
}

const VideoConsultation = () => {
  const router = useRouter();
  const consultationIdParam = router.query.consultationId;
  const consultationId = Array.isArray(consultationIdParam)
    ? consultationIdParam[0]
    : consultationIdParam;

  return (
    <VideoErrorBoundary>
      <DynamicAgoraVideoCall consultationId={consultationId} />
    </VideoErrorBoundary>
  );
};

export default VideoConsultation;
