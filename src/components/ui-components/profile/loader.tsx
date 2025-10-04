import { HStack, SkeletonCircle, SkeletonText, Stack } from '@chakra-ui/react';

const Loader = () => {
    return (
        <Stack p={6} rounded='lg' gap="6" w='full'>
            <HStack width="full">
                <SkeletonText noOfLines={1} />
                <SkeletonCircle size="4" />
            </HStack>

            <SkeletonText noOfLines={6} gap="4" />
        </Stack>
    )
}

export default Loader