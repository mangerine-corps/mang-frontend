import { Box, BoxProps, HStack, Image, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";

interface Prop extends BoxProps {
  text: string;
  icon: string;
  href: string;
  iconBg: string;
}

const chevronright = "/icons/right.svg";

const MenuItem = (prop: Prop) => {
  const { text, icon, href, iconBg, ...rest } = prop;
  const router = useRouter();
  const pathName = usePathname();
  const isActive = pathName === href;

  const handleClick = () => {
    router.push(href); 
  };

  return (
    <Box 
  // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }} 
  w="450px"
  h="666px"
  gap="24px"
  pb="16px"
  borderRadius="lg"
  boxShadow="sm"
  bg="bg_box"
  //px="16px" 
  //py="16px" 
  mr={10}
>

      <Box
        as="button"
        onClick={handleClick}
        borderRadius="12px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
       // w="100%"
        bg={"bg_box"}
        border={isActive ? "2px solid #D9D9D9" : "none"}
        //px="16px"
        //py="16px"
        gap="8px"
        cursor="pointer"
        _hover={{ bg: "#F7F7F7" }}
        borderBottom={"2px solid #F2F2F2"}

      >
        <HStack wordSpacing="1rem" alignItems="center">
          <Box
            w="2rem"
            h="2rem"
            bg="bg_box"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Image src={icon} alt={text} 
            // boxSize="1.25rem"
             />
          </Box>
          <Box
              as="button"
              role="group"
             // onClick={handleClick}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              //w="100%"
              //px="1rem"
              //py="0.75rem"
              borderRadius="12px"
              color="text_primary"
              cursor="pointer"
              _hover={{ bg: "#F7F7F7" }}
            >
              {text}
            </Box>
        </HStack>
        <Image src={chevronright} alt="arrow" 
        // boxSize="0.875rem" 
        />
      </Box>
    </Box>
  );
};

export default MenuItem;
