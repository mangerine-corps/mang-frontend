import { Button } from "@chakra-ui/react";

const SectionActionButton = ({
  title,
  label,
  fullWidth = false,
  onClick,
}: {
  title: string;
  label?: string;
  fullWidth?: boolean;
  onClick: () => void;
}) => {
  return (
    <Button
      variant="outline"
      bg="transparent"
      color="button_bg"
      borderColor="button_bg"
      borderWidth="1px"
      rounded="6px"
      px={{ base: 3, lg: 4 }}
      py={2}
      w={fullWidth ? "full" : "auto"}
      h="auto"
      minH="36px"
      fontSize={{ base: "0.75rem", lg: "0.875rem" }}
      fontWeight="500"
      onClick={onClick}
      _hover={{ bg: "rgba(17, 29, 74, 0.06)" }}
    >
      {label ?? `Add ${title}`}
    </Button>
  );
};

export default SectionActionButton;
