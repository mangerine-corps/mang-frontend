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
