import React, { useRef, useState } from "react";
import { Box, Button, Input } from "@chakra-ui/react";
import { HiCheck, HiOutlineUpload } from "react-icons/hi";

const VideoUploader = ({ handleChange }: { handleChange: (file: any) => void }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleChange(file)
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <Box>
      {/* Hidden file input */}
      <Input
        type="file"
        accept=".mp4,.mp3,.mov,.avi,.mkv"
        ref={fileInputRef}
        display="none"
        onChange={handleFileChange}
      />

      {/* Button or file name display */}
      {fileName ? (
        <Button
          // border={2}
          // borderRadius="md"
          // borderColor={"mainBlack"}
          w="full"
          variant="outline"
          onClick={handleFileSelect}
          textAlign={"center"}
          p={2}
          color="text_primary"
          borderColor={"input_border"}
        >
          <HiCheck /> {fileName}
        </Button>
      ) : (
        <Button
          w="full"
          variant="outline"
          onClick={handleFileSelect}
          colorScheme="blue"
        >
          <HiOutlineUpload /> Upload video showcasing skills, and value
        </Button>
      )}
    </Box>
  );
};

export default VideoUploader;
