import React, { useRef, useState } from 'react';
import { Box, Button, Text, VStack, HStack, Progress, Alert } from '@chakra-ui/react';
import { IoCloudUpload, IoVideocam, IoClose } from 'react-icons/io5';
import { useDirectUpload } from '../hooks/useDirectUpload';

interface VideoUploadProps {
  onUploadComplete?: (url: string, filename: string) => void;
  onUploadStart?: () => void;
  folder?: string;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  disabled?: boolean;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  onUploadComplete,
  onUploadStart,
  folder = 'videos',
  maxSizeInMB = 100,
  acceptedFormats = ['mp4', 'mov', 'avi', 'webm'],
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { upload, progress, isUploading, error, reset } = useDirectUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !acceptedFormats.includes(fileExtension)) {
      alert(`Please select a video file with one of these formats: ${acceptedFormats.join(', ')}`);
      return;
    }

    // Validate file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      alert(`File size must be less than ${maxSizeInMB}MB`);
      return;
    }

    setSelectedFile(file);
    reset();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      onUploadStart?.();
      const result = await upload(selectedFile, folder);
      onUploadComplete?.(result.publicUrl, result.filename);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <VStack gap={4} w="full">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled || isUploading}
      />

      {/* Upload Area */}
      {!selectedFile && (
        <Box
          w="full"
          minH="200px"
          border="2px dashed"
          borderColor="gray.300"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor={disabled ? 'not-allowed' : 'pointer'}
          onClick={() => !disabled && fileInputRef.current?.click()}
          _hover={!disabled ? { borderColor: 'blue.400', bg: 'gray.50' } : {}}
          transition="all 0.2s"
        >
          <VStack gap={3}>
            <IoCloudUpload size={48} color="gray" />
            <Text textAlign="center" color="gray.600">
              Click to select a video file
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Supported formats: {acceptedFormats.join(', ')}
              <br />
              Max size: {maxSizeInMB}MB
            </Text>
          </VStack>
        </Box>
      )}

      {/* Selected File Info */}
      {selectedFile && !isUploading && (
        <Box w="full" p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
          <HStack justify="space-between" mb={3}>
            <HStack>
              <IoVideocam size={20} />
              <VStack align="start" gap={0}>
                <Text fontWeight="medium">{selectedFile.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  {formatFileSize(selectedFile.size)}
                </Text>
              </VStack>
            </HStack>
            <Button
              size="sm"
              variant="ghost"
              display="flex"
              alignItems="center"
              gap={1}
              onClick={handleCancel}
            >
              <IoClose />
              Remove
            </Button>
          </HStack>
          
          <HStack gap={3}>
            <Button
              colorScheme="blue"
              onClick={handleUpload}
              disabled={disabled}
              flex={1}
            >
              Upload Video
            </Button>
          </HStack>
        </Box>
      )}

      {/* Upload Progress */}
      {isUploading && progress && (
        <Box w="full" p={4} border="1px solid" borderColor="blue.200" borderRadius="md" bg="blue.50">
          <VStack gap={3}>
            <HStack justify="space-between" w="full">
              <Text fontWeight="medium">Uploading {selectedFile?.name}</Text>
              <Text fontSize="sm" color="blue.600">
                {progress.percentage}%
              </Text>
            </HStack>
            
            <Progress.Root value={progress.percentage} w="full" colorScheme="blue">
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            
            <Text fontSize="sm" color="gray.600">
              {formatFileSize(progress.loaded)} / {formatFileSize(progress.total)}
            </Text>
          </VStack>
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert.Root status="error" w="full">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Upload Failed</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </VStack>
  );
};

export default VideoUpload;
