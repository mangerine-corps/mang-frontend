import { Image, Stack } from '@chakra-ui/react';



type props ={
    logo:string,
    bgColor:string,
}
export const Logo = ({bgColor,logo}:props) => {

  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      borderTop={2}
      borderColor={"#0000001A"}
      p={6}
      boxShadow='xs'
      boxShadowColor={'success.500'}
      rounded={"3xl"}
      bgColor={bgColor}
    >
      <Image h="16"  alt='applogo' src={logo} />
    </Stack>
  );
}
