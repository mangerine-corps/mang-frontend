import {
  Box,
  Text,
  Image,
  HStack,
  VStack,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Stack,
} from "@chakra-ui/react";
import { TbWorld } from "react-icons/tb";

type Props ={
  groupData: any;
  banner: any
}
const GroupPreview = ({groupData,banner}:Props) => { console.log(groupData,"gd")
  return (
    <Box w="full">
      {/* Group Preview Title */}
      <HStack justify="space-between" my={{base:"8",md:"4",lg:"4"}}>
        <Text
          fontWeight="600"
          fontSize="1.5rem"
          font="outfit"
          color="text_primary"
          lineHeight="36px"
        >
          Group Preview
        </Text>
        <Button
          color="bg_button"
          borderRadius="100px"
          py="3"
          px="4"
          fontSize="1rem"
        >
          100%
        </Button>
      </HStack>

      <Stack
      mt="8"
        px="24px"
        py="7"
        bg="bg_box"
        //display="flex"
        borderRadius="md"
        boxShadow="md"
      >
        {/* Banner Image */}
        <Image
            cursor={"pointer"}
            w={"100%"}
            h={"full"}
            src={banner}
            alt={"selectedimage"}
        />

        {/* Group Info */}
        <VStack align="start" gap={2} mb={4}>
          <Text
            fontWeight="600"
            fontSize="1.2rem"
            font="outfit"
            color="text_primary"
            lineHeight="24px"
          >
            {groupData.name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {groupData?.category[0]}
          </Text>
          <Text
            fontWeight="400"
            fontSize="1rem"
            font="outfit"
            lineHeight="36px"
            color="gray.600"
          >
            {groupData.description}
          </Text>
        </VStack>

        {/* Members and Privacy */}
        <HStack gap={3} mb={4}>
          <AvatarGroup gap="0" spaceX="-3" size="lg">
            <Avatar.Root>
              <Avatar.Fallback name={groupData.name} />
              <Avatar.Image src="" />
            </Avatar.Root>

            {/*<Avatar.Root>*/}
            {/*  <Avatar.Fallback name="Baki Ani" />*/}
            {/*  <Avatar.Image src="" />*/}
            {/*</Avatar.Root>*/}

            {/*<Avatar.Root>*/}
            {/*  <Avatar.Fallback name="Uchiha Chan" />*/}
            {/*  <Avatar.Image src="" />*/}
            {/*</Avatar.Root>*/}
            {/*<Avatar.Root variant="solid">*/}
            {/*  <Avatar.Fallback>+3</Avatar.Fallback>*/}
            {/*</Avatar.Root>*/}
          </AvatarGroup>
          <Text fontSize="sm" color="gray.700">
            1 Members
          </Text>
          <Badge textTransform={'capitalize'} colorScheme="gray" fontSize="xs">
            {" "}
            ||
            <Text color="text_primary">
              <TbWorld />
            </Text>
            {/* <Image src="/icons/location.svg/" alt="internet" /> */}
            {/* // i cant save the globe svg icon, location as alt */}
            {groupData.visibility}
          </Badge>
        </HStack>

        <Box my={4} />

        {/* Rules */}
        <Text
          fontWeight="600"
          fontSize="1.2rem"
          font="outfit"
          lineHeight="24px"
          color="text_primary"
          mb={2}
        >
          Our Rules and Regulations
        </Text>

        <VStack
          gap={2}
          align="start"
          fontWeight="400"
          fontSize="1rem"
          font="outfit"
          color="gray.600"
          dangerouslySetInnerHTML={{ __html: groupData.rules }}
        >

        </VStack>
      </Stack>
    </Box>
  );
};

export default GroupPreview;
