import React from 'react';
import {Box, Text} from '@chakra-ui/react';

const AvailableTimeCard = ({ availabilityInfo }: { availabilityInfo: any }) => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            padding={6}
            alignItems="flex-start"
            gap={3}
            borderRadius={14}
            backgroundColor="main_background"
            boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
            width={'full'}
        >
            <Text fontSize="xl" color='text_primary' fontWeight="bold" alignSelf="flex-start">
                Available Time
            </Text>

            <Box
                display="flex"
                flexDirection="column"
                gap={4}
                width={'full'}
                justifyContent="space-between"
                flexWrap="wrap"
            >
                {Array.isArray(availabilityInfo?.availability) && availabilityInfo.availability.length > 0 ? (
                    availabilityInfo.availability.map((availability: any, index: number) => {
                        const slots = Array.isArray(availability?.slots) ? availability.slots : [];
                        const firstFrom = slots[0]?.from;
                        const lastTo = slots.length > 0 ? slots[slots.length - 1]?.to : undefined;
                        const tz = availabilityInfo?.timezone ?? '';

                        // If no valid slots, skip rendering this day
                        if (!firstFrom || !lastTo) {
                            return null;
                        }

                        return (
                            <Text key={index} color='text_primary' fontSize="sm" fontWeight={'500'} alignSelf="flex-start">
                                {availability?.day}: {firstFrom} - {lastTo} {tz}
                            </Text>
                        );
                    })
                ) : (
                    <Text color='text_primary' fontSize="sm" fontWeight={'500'} alignSelf="flex-start">
                        No availability set yet
                    </Text>
                )}

            </Box>
        </Box>
    );
};

export default AvailableTimeCard;