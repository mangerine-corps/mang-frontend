"use client";
import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { IoClose, IoDocument, IoImage, IoVideocam } from "react-icons/io5";
import FileUploadComponent from "./FileUploadComponent";

const FileUploadTest: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    url: string;
    publicId: string;
    fileType: string;
    fileName: string;
  }>>([]);

  const handleFileUploaded = (fileData: { url: string; publicId: string; fileType: string; fileName: string }) => {
    setUploadedFiles(prev => [...prev, fileData]);
    console.log('File uploaded:', fileData);
  };

  const handleUploadComplete = () => {
    console.log('Upload complete');
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Box p={6} maxW="600px" mx="auto">
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        File Upload Test
      </Text>
      
      <VStack gap={4} align="stretch">
        <FileUploadComponent
          onFileUploaded={handleFileUploaded}
          onUploadComplete={handleUploadComplete}
          disabled={false}
        />

        {uploadedFiles.length > 0 && (
          <Box p={4} bg="blue.50" borderRadius="md">
            <Text fontSize="lg" fontWeight="medium" mb={3}>
              Uploaded Files ({uploadedFiles.length}):
            </Text>
            <VStack gap={2} align="start">
              {uploadedFiles.map((file, index) => (
                <HStack key={index} gap={3} w="full" p={2} bg="white" borderRadius="md">
                  <Icon 
                    as={file.fileType.startsWith('image/') ? IoImage : 
                        file.fileType.startsWith('video/') ? IoVideocam : IoDocument}
                    color="blue.500"
                    boxSize={5}
                  />
                  <Box flex={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      {file.fileName}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {file.fileType}
                    </Text>
                  </Box>
                  <IconButton
                    size="sm"
                    aria-label="Remove file"
                    onClick={() => removeFile(index)}
                  >
                    <IoClose />
                  </IconButton>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default FileUploadTest;
