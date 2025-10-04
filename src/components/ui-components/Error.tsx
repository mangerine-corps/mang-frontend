import { Box, Icon, IconButton, Text } from "@chakra-ui/react";
import { IoMdCloseCircle } from "react-icons/io";
import { outfit } from "mangarine/pages/_app";

type Props = {
  icon: any;
  type: string;
  message: string;
  close: () => void
};
const Toast = ({ icon, type, message, close }: Props) => {
  return (
    <Box
      bg={type === "error" ? "red.500" : "green"}
      p={2}
      display={"flex"}
      flexDir={"row"}
      w={'full'}
      my={4}
      alignItems={"center"}
      justifyContent={"space-between"}
      rounded={"md"}
      className={outfit.className}
    >
      <Box
        flex={5}
        display={"flex"}
        flexDir={"row"}
        gap={2}
        w='full'
        alignItems={"center"}
      >
        <Icon color="white" boxSize={4} as={icon} />
        <Text fontSize={'small'} className="font-matters" fontWeight={"400"} color="white">
          {message}
        </Text>
      </Box>
      <IconButton
        onClick={close}
        aria-label="close toast"
        size={'xs'}
        flex={1}
        _hover={{
          bg: 'transparent'
        }}
        justifySelf={'end'}
        alignSelf={'end'}
        bg='transparent'
        borderWidth={0}
        color={"white"}
      ><IoMdCloseCircle /></IconButton>
    </Box>
  );
};

export default Toast;
