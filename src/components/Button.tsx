import { Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

type props = {
  text: string;
  href: string;

};
export const CustomLink = ({ text,href }: props) => {
  return (
    <Link
      asChild
      alignItems={"center"}
      justifyContent={"center"}
      w={{ base: "full", md: "full" }}
      mx={"auto"}
      py={3}
      bg="primary.950"
      rounded={"lg"}
    >
      <NextLink href={href}>
        <Text color={"white"} fontWeight={600} fontSize={"16px"}>
          {" "}
          {text}
        </Text>
      </NextLink>
    </Link>
  );
};
