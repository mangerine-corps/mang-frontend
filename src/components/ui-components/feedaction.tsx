import { Image, Stack, Text } from '@chakra-ui/react'
import React from 'react'

type FeedActionProps = {
  action?: () => void;
  icon: string | React.ReactNode; // string for image URL, ReactNode for icon component
};

const FeedAction = ({ action, icon }: FeedActionProps) => {
  const isImage = typeof icon === "string";

  return (
    <Stack
      onClick={action}
      justifyContent="center"
      alignItems="center"
      aria-label="action_button"
      cursor="pointer"
      borderRadius="full"
      transition="background 0.18s"
      _hover={{ bg: "rgba(17,29,74,0.08)" }}
      _active={{ bg: "rgba(17,29,74,0.16)" }}
    >
      {isImage ? (
        <Image src={icon} alt="action_button" />
      ) : (
       <Text fontSize="1rem" color="primary.400">
         {icon}
       </Text>// directly render React icon component
      )}
    </Stack>)
    }

export default FeedAction
