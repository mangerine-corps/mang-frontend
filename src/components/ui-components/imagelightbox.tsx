import { Box, Image, Portal, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

type Props = {
  images: string[];
  initialIndex: number | null;
  onClose: () => void;
};

const ImageLightbox = ({ images, initialIndex, onClose }: Props) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (initialIndex !== null) setCurrent(initialIndex ?? 0);
  }, [initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (initialIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setCurrent((c) => (c < images.length - 1 ? c + 1 : 0));
      if (e.key === "ArrowLeft") setCurrent((c) => (c > 0 ? c - 1 : images.length - 1));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [initialIndex, images.length, onClose]);

  if (initialIndex === null || images.length === 0) return null;

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c > 0 ? c - 1 : images.length - 1));
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c < images.length - 1 ? c + 1 : 0));
  };

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
        {/* Close */}
        <Box
          position="absolute" top={4} right={4}
          cursor="pointer" color="white" zIndex={1}
          onClick={onClose}
        >
          <IoClose size={32} />
        </Box>

        {/* Counter */}
        {images.length > 1 && (
          <Box
            position="absolute" top={4}
            left="50%" transform="translateX(-50%)"
            bg="rgba(0,0,0,0.5)" px={3} py={1} rounded="full"
          >
            <Text color="white" fontSize="sm" fontWeight="500">
              {current + 1} / {images.length}
            </Text>
          </Box>
        )}

        {/* Prev arrow */}
        {images.length > 1 && (
          <Box
            position="absolute" left={{ base: 2, md: 6 }}
            cursor="pointer" color="white"
            onClick={prev}
            bg="rgba(255,255,255,0.15)"
            _hover={{ bg: "rgba(255,255,255,0.25)" }}
            rounded="full" p={2} zIndex={1}
          >
            <IoChevronBack size={28} />
          </Box>
        )}

        {/* Image */}
        <Image
          src={images[current]}
          alt={`Image ${current + 1} of ${images.length}`}
          maxH="90vh"
          maxW={{ base: "92vw", md: "80vw" }}
          objectFit="contain"
          rounded="md"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Next arrow */}
        {images.length > 1 && (
          <Box
            position="absolute" right={{ base: 2, md: 6 }}
            cursor="pointer" color="white"
            onClick={next}
            bg="rgba(255,255,255,0.15)"
            _hover={{ bg: "rgba(255,255,255,0.25)" }}
            rounded="full" p={2} zIndex={1}
          >
            <IoChevronForward size={28} />
          </Box>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <Box
            position="absolute" bottom={4}
            left="50%" transform="translateX(-50%)"
            display="flex" gap={1.5}
          >
            {images.map((_, i) => (
              <Box
                key={i}
                w={i === current ? "18px" : "8px"}
                h="8px"
                rounded="full"
                bg={i === current ? "white" : "rgba(255,255,255,0.4)"}
                cursor="pointer"
                transition="all 0.2s"
                onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Portal>
  );
};

export default ImageLightbox;
