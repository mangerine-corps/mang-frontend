import React, { useRef, useState } from "react";
import { Box, Button, Input } from "@chakra-ui/react";
import { HiCheck, HiOutlinePlus } from "react-icons/hi";

const FileUploader = ({
  handleChange,
  currentFile,
}: {
  handleChange: (file: any) => void;
  currentFile?: string;
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleChange(file);
    if (file) {
      setFileName(file.name);
    }
  };

  const displayName = fileName ?? (currentFile ? currentFile.split("/").pop() : null);

  return (
    <Box>
      <Input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        ref={fileInputRef}
        display="none"
        onChange={handleFileChange}
      />
      {displayName ? (
        <Button
          w="full"
          variant="outline"
          onClick={handleFileSelect}
          textAlign={"center"}
          p={2}
          color="text_primary"
          borderColor={"input_border"}
        >
          <HiCheck /> {displayName}
        </Button>
      ) : (
        <Button w="full" variant="outline" onClick={handleFileSelect} colorScheme="blue">
          <HiOutlinePlus /> Upload Resume
        </Button>
      )}
    </Box>
  );
};

export default FileUploader;
