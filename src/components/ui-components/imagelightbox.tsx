import { Box, Image, Portal } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

type Props = {
  src: string | null;
  onClose: () => void;
};

const ImageLightbox = ({ src, onClose }: Props) => {
  if (!src) return null;
  return (
    <Portal>
      <Box
        position="fixed"
        inset={0}
        bg="rgba(0,0,0,0.92)"
        zIndex={99999999}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={onClose}
      >
        <Box position="absolute" top={4} right={4} cursor="pointer" onClick={onClose} color="white">
          <IoClose size={32} />
        </Box>
        <Image
          src={src}
          alt="preview"
          maxH="90vh"
          maxW="90vw"
          objectFit="contain"
          rounded="md"
          onClick={(e) => e.stopPropagation()}
        />
      </Box>
    </Portal>
  );
};

export default ImageLightbox;
