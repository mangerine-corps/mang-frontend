"use client";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Grid,
  Text,
  VStack,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { useDirectUpload } from "mangarine/hooks/useDirectUpload";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { toaster } from "mangarine/components/ui/toaster";
import { v4 as uuidv4 } from "uuid";
import { IoClose, IoDocument, IoImage, IoVideocam } from "react-icons/io5";

interface UploadingFile {
  file: File;
  localId: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "failed" | "deleted";
  url: string | null;
  publicId: string | null; // will hold Cloudflare filename for compatibility
  filename?: string | null;
  error: string | null;
  retries: number;
  preview?: string;
  loadedBytes?: number;
  totalBytes?: number;
}

interface FileUploadComponentProps {
  onFileUploaded: (fileData: {
    url: string;
    publicId: string;
    fileType: string;
    fileName: string;
    fileSize: number;
  }) => void;
  onUploadComplete: () => void;
  disabled?: boolean;
  allowedTypes?: string[]; // optional override for accepted mime types
  capture?: boolean | "user" | "environment"; // enable camera capture on supported devices
  showButton?: boolean; // whether to render the default trigger button
  autoOpen?: boolean; // automatically open file dialog on mount/prop change
  variant?: "card" | "whatsapp";
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/avi",
  "video/mov",
  "video/wmv",
  "video/flv",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "application/zip",
  "application/rar",
];

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  onFileUploaded,
  onUploadComplete,
  disabled = false,
  allowedTypes,
  capture,
  showButton = true,
  autoOpen = false,
  variant = "card",
}) => {
  const { token } = useAuth();
  const { upload, progress: globalProgress } = useDirectUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return IoImage;
    if (fileType.startsWith("video/")) return IoVideocam;
    return IoDocument;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${formatFileSize(MAX_FILE_SIZE)}`;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return "File type not supported";
    }

    return null;
  };

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve("");
      }
    });
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) {
        // If opened from a menu (autoOpen), close the uploader when user cancels
        if (autoOpen) onUploadComplete();
        return;
      }

      const newUploadingFiles: UploadingFile[] = [];

      for (const file of files) {
        const error = validateFile(file);
        if (error) {
          // toaster.error(error);
          continue;
        }

        const localId = uuidv4();
        const preview = await createFilePreview(file);

        newUploadingFiles.push({
          file,
          localId,
          progress: 0,
          status: "pending",
          url: null,
          publicId: null,
          error: null,
          retries: 0,
          preview,
          loadedBytes: 0,
          totalBytes: file.size,
        });
      }

      setUploadingFiles((prev) => [...prev, ...newUploadingFiles]);
      setIsUploading(true);

      // Start uploading files
      for (const uploadingFile of newUploadingFiles) {
        await uploadFile(uploadingFile);
      }
    },
    []
  );

  // Auto-open the file dialog when requested
  React.useEffect(() => {
    if (autoOpen && fileInputRef.current) {
      // Defer to ensure input is mounted with latest accept/capture attrs
      const id = setTimeout(() => fileInputRef.current?.click(), 0);
      return () => clearTimeout(id);
    }
  }, [autoOpen, allowedTypes, capture]);

  const uploadFile = async (uploadingFile: UploadingFile) => {
    const { file, localId } = uploadingFile;

    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.localId === localId ? { ...f, status: "uploading" as const } : f
      )
    );

    try {
      // Direct upload to Cloudflare via presigned URL
      const result = await upload(
        file,
        "chat-uploads",
        token || undefined,
        (loaded, total, percentage) => {
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.localId === localId
                ? {
                    ...f,
                    progress: percentage,
                    loadedBytes: loaded,
                    totalBytes: total,
                  }
                : f
            )
          );
        }
      );

      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.localId === localId
            ? {
                ...f,
                status: "completed" as const,
                url: result.publicUrl,
                publicId: result.filename, // store filename as publicId-compatible
                filename: result.filename,
                progress: 100,
              }
            : f
        )
      );

      // Notify parent component
      onFileUploaded({
        url: result.publicUrl,
        publicId: result.filename,
        fileType: file.type,
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.localId === localId
            ? {
                ...f,
                status: "failed" as const,
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );
      //   toaster.error(`Failed to upload ${file.name}`);
    }
  };

  const removeFile = async (localId: string) => {
    const file = uploadingFiles.find((f) => f.localId === localId);
    if (!file) return;

    // If file was uploaded successfully, delete from Cloudflare R2 via backend
    if (file.publicId && file.status === "completed") {
      try {
        const baseUrl = process.env.API_BASE_URL || "";
        // publicId holds the filename path we uploaded
        await axios.delete(`${baseUrl}/cloudflare/file/${encodeURIComponent(file.publicId)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
      } catch (error) {
        console.error("Failed to delete from Cloudflare:", error);
      }
    }

    setUploadingFiles((prev) => prev.filter((f) => f.localId !== localId));
  };

  const retryUpload = async (localId: string) => {
    const file = uploadingFiles.find((f) => f.localId === localId);
    if (!file) return;

    setUploadingFiles((prev) =>
      prev.map((f) =>
        f.localId === localId
          ? {
              ...f,
              status: "pending" as const,
              error: null,
              retries: f.retries + 1,
            }
          : f
      )
    );

    await uploadFile(file);
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Check if all uploads are complete
  React.useEffect(() => {
    if (
      uploadingFiles.length > 0 &&
      uploadingFiles.every(
        (f) => f.status === "completed" || f.status === "failed"
      )
    ) {
      setIsUploading(false);
      onUploadComplete();
    }
  }, [uploadingFiles, onUploadComplete]);

  // Aggregate progress across all items
  const totalBytes = uploadingFiles.reduce(
    (sum, f) => sum + (f.totalBytes || f.file.size),
    0
  );
  const loadedBytes = uploadingFiles.reduce(
    (sum, f) => sum + (f.loadedBytes || 0),
    0
  );
  const overallProgress =
    totalBytes > 0 ? Math.round((loadedBytes * 100) / totalBytes) : 0;

  return (
    <VStack gap={3} w="full">
      {showButton && (
        <Button
          onClick={handleUploadButtonClick}
          disabled={disabled || isUploading}
          variant="outline"
          size="sm"
          w="full"
        >
          <Icon as={IoDocument} mr={2} />
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={(allowedTypes ?? ALLOWED_TYPES).join(",")}
        // @ts-ignore
        capture={capture as any}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {/* WhatsApp-style strip */}
      {variant === "whatsapp" && uploadingFiles.length > 0 && (
        <Box w="full">
          <HStack overflowX="auto" gap={2} py={1}>
            {uploadingFiles.map((file) => {
              const isImage = file.file.type.startsWith("image/");
              return (
                <Box
                  key={file.localId}
                  position="relative"
                  w="100px"
                  h="100px"
                  bg="bg_box"
                  borderRadius="md"
                  flex="0 0 auto"
                  overflow="hidden"
                >
                  {isImage && file.preview ? (
                    <Image
                      src={file.preview}
                      alt={file.file.name}
                      w="full"
                      h="full"
                      objectFit="cover"
                    />
                  ) : (
                    <VStack
                      w="full"
                      h="full"
                      align="center"
                      justify="center"
                      gap={1}
                   
                    >
                      <Icon as={getFileIcon(file.file.type)} color="gray.600" />
                      <Text
                        color="text_primary"
                        fontSize="9px"
                        px={1}
                        lineHeight={1}
                        textAlign="center" textWrap={"wrap"}
                      >
                        {file.file.name}
                      </Text>
                    </VStack>
                  )}
                  {/* per-item circular progress */}
                  {file.status === "uploading" && (
                    <Box position="absolute" top={1} left={1}>
                      <Box position="relative" w="24px" h="24px">
                        <svg viewBox="0 0 36 36" width="24" height="24">
                          <path
                            d="M18 2 a 16 16 0 1 0 0.00001 0"
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="4"
                          />
                          <path
                            d="M18 2 a 16 16 0 1 0 0.00001 0"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="4"
                            strokeDasharray={`${file.progress}, 100`}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                          />
                        </svg>
                        <Box
                          position="absolute"
                          inset={0}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text
                            fontSize="10px"
                            onClick={() => removeFile(file.localId)}
                            color="text_primary"
                          >
                            <IoClose />{" "}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                  )}
                  {/* <Image src={"/icons/delete2.svg"} alt="close" w="10px" h="10px" position="absolute" top={0.5} right={0.5} onClick={() => removeFile(file.localId)} /> */}
                  {/* <IconButton size="xs" aria-label="Remove" position="absolute" top={0.5} right={0.5} onClick={() => removeFile(file.localId)}>
                    <IoClose />
                  </IconButton> */}
                </Box>
              );
            })}
          </HStack>
        </Box>
      )}

      {/* Card variant (default) */}
      {variant === "card" && uploadingFiles.length > 0 && (
        <Box
          w="full"
          p={3}
          borderWidth={1}
          borderColor="gray.200"
          borderRadius="md"
          bg="white"
        >
          <HStack justify="space-between" mb={3}>
            <Text fontWeight="semibold" fontSize="sm">
              Selected files ({uploadingFiles.length})
            </Text>
            <Box position="relative" w="36px" h="36px">
              <svg viewBox="0 0 36 36" width="36" height="36">
                <path
                  d="M18 2 a 16 16 0 1 0 0.00001 0"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="4"
                />
                <path
                  d="M18 2 a 16 16 0 1 0 0.00001 0"
                  fill="none"
                  stroke="#3182ce"
                  strokeWidth="4"
                  strokeDasharray={`${overallProgress}, 100`}
                  strokeLinecap="round"
                  transform="rotate(-90 18 18)"
                />
              </svg>
              <Box
                position="absolute"
                inset={0}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" color="gray.600">
                  {overallProgress}%
                </Text>
              </Box>
            </Box>
          </HStack>
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
            gap={3}
          >
            {uploadingFiles.map((file) => (
              <Box
                key={file.localId}
                borderWidth={1}
                borderColor="gray.100"
                borderRadius="md"
                p={2}
                position="relative"
              >
                <Icon
                  as={getFileIcon(file.file.type)}
                  color={
                    file.status === "completed"
                      ? "green.500"
                      : file.status === "failed"
                        ? "red.500"
                        : "gray.500"
                  }
                />
                <Text mt={1} fontSize="xs" lineHeight={1}>
                  {file.file.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {formatFileSize(file.file.size)}
                </Text>
                <Image
                  src={"/icons/delete2.svg"}
                  alt="close"
                  w="10px"
                  h="10px"
                  position="absolute"
                  top={0.5}
                  right={0.5}
                  onClick={() => removeFile(file.localId)}
                />
              </Box>
            ))}
          </Grid>
        </Box>
      )}
    </VStack>
  );
};

export default FileUploadComponent;
