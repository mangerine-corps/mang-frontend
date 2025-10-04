import { Flex, Text } from '@chakra-ui/react'
import { outfit } from 'mangarine/pages/_app'
import React, { FC } from 'react'


type Props = {
    hasText?: boolean,
    text?: string,
    icon?: React.ReactNode,
    size?: string,
    color?: string,
    className?: string,
}
const Icon: FC<Props> = ({ icon, hasText, text }) => {
    return (
        <Flex w='auto'  className={outfit.className} shadow={'md'} p={2} spaceX={'space4'} rounded='sm' flexDir={'row'}>
            {icon}
            {
                hasText && (
                    <Text color='black' fontSize={'14px'}   >{text}</Text>
                )
            }
        </Flex>
    )
}

export default Icon
