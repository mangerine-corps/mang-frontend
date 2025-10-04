import { Box, Button, HStack, Image, Stack, Text } from '@chakra-ui/react'
 import React from 'react'

const users = [
  {
    id: 1,
    img: '/avatars/user1.png',
    name: 'Jacob Jones',
    job: 'Web Designer',
  },
  {
    id: 2,
    img: '/avatars/user2.png',
    name: 'Cameron Williamson',
    job: 'Marketing Coordinator',
  },
  {
    id: 3,
    img: '/avatars/user3.png',
    name: 'Kathryn Murphy',
    job: 'Nursing Assistant',
  },
  {
    id: 4,
    img: '/avatars/user4.png',
    name: 'Robert Fox',
    job: 'Medical Assistant',
  },
]

type imgProps = {
  item: {
    id: number
    img: string
    name: string
    job: string
  }
  onClick?: () => void
  selected: { id: number }
}

const NewMessageItem = ({ item, onClick, selected }: imgProps) => {
    console.log(item,selected)
  return (
    <Box onClick={onClick} cursor={'pointer'}>
      <HStack
        display={'flex'}
        py={4}
        flexDir={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <HStack
          display={'flex'}
          flexDir={'row'}
          alignItems={'flex-start'}
          justifyContent={'flex-start'}
        >
          <Box pos={'relative'}>
            <Image src={item.img} alt={'display-img'} />
          </Box>

          <Stack gap={'0'}>
            <Text fontFamily={'outfit'} fontWeight={'600'} fontSize={'20px'}>
              {item.name}
            </Text>
            <Text fontFamily={'outfit'} fontWeight={'400'} fontSize={'16px'} color={'#333333'}>
              {item.job}
            </Text>
          </Stack>
        </HStack>
        <Stack
          display={'flex'}
          flexDir={'column'}
          justifyContent={'center'}
          alignItems={'center'}
          borderWidth={1}
          borderColor={'primary.100'}
          h={6}
          w={6}
        //   p={3}
          rounded={'full'}
        >
          <Box bg={item.id == selected.id ? 'primary.300' : 'transparent'} w="4" h="4" rounded={'full'} />
        </Stack>
      </HStack>
    </Box>
  )
}

export default NewMessageItem;
