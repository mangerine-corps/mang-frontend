import { Link, Text } from "@chakra-ui/react";

type props = {
  text: string;
  href: string;

};
export const CustomLink = ({ text,href }: props) => {
  return (
    <Link
      alignItems={"center"}
      justifyContent={"center"}
      w={{ base: "full", md: "full" }}
      mx={"auto"}
      href={href}
      py={3}
      bg="primary.950"
      rounded={"lg"}
    >
      <Text color={"white"} fontWeight={600} fontSize={"16px"}>
        {" "}
        {text}
      </Text>
    </Link>
  );
};
