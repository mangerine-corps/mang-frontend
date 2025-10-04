import { Skeleton, SkeletonText, Stack, VStack } from '@chakra-ui/react';

const BoxLoader = () => {
    return (
        <Stack gap="6" w='full' >
            <VStack width="full">
                <Skeleton w='full' height="100px"  />
                <SkeletonText noOfLines={1} />
            </VStack>
        </Stack>
    )
}

export default BoxLoader