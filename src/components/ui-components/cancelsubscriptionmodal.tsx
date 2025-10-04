import {
    Box,
    Text,
    Checkbox,
    Button,
    Image,
    Flex,
  } from '@chakra-ui/react';
  import { useState } from 'react';

  
const CancelSubscriptionModal = ({ onClose, onConfirm }) => {
    const [isChecked, setIsChecked] = useState(false);

    return (
        <Box
          w="520px"
          h="673px"
         // top="21px"
         // left="910px"
          mt={10}
          px="47px"
          py="40px"
          borderRadius="16px"
          bg="bg_box"
          boxShadow="lg"
          position="relative"
        >
          {/* Close Image */}
          <Flex align="center" justify="space-between" mb={6}>
            <Text 
                font="Outfit"
                fontSize="2.5rem" 
                fontWeight="700"
                lineHeight="60px" 
                color="text_primary"
            >
                Cancel Subscription
            </Text>

            <Image
                src="/icons/close.svg"
                alt="Close"
                boxSize="20px"
                cursor="pointer"
                onClick={onClose}
            />
            </Flex>

    
          {/* Description */}
          <Text font="outfit"
          fontSize="1.5rem" 
          fontWeight="400"
          lineHeight="24px" color="text_primary" mb={8}>
            You are currently subscribed to the Premium plan. By canceling, you will be
            reverted to the Free plan and will lose access to all premium features.
          </Text>
    
          {/* Checkbox */}
            <Checkbox.Root>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label font="outfit"
          fontSize="1.5rem" 
          fontWeight="400"
         color="text_primary" >I understand and wish to proceed.</Checkbox.Label>
            </Checkbox.Root>


    
          {/* Confirm Button */}
          <Button
            colorScheme="blue"
            width="100%"
            //isDisabled={!isChecked}
            onClick={onConfirm}
            bg="bg_button"
            _hover={{ bg: "blue.800" }}
            mt={150}
          >
            Confirm Cancellation
          </Button>
        </Box>
      );
    };
    
    export default CancelSubscriptionModal;