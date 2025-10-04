/**
 * NotificationBadge Component
 * 
 * Displays a notification bell icon with unread count badge and connection status.
 * Safely handles null context values during initial load with default values.
 * 
 * Features:
 * - Shows unread notification count
 * - Displays connection status with color coding
 * - Handles loading states gracefully
 * - Safe to use during app initialization
 */

import React from 'react';
import { Box, Text, Badge, Icon, Flex } from '@chakra-ui/react';
import { FiBell } from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationBadgeProps {
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  showCount = true,
  size = 'md',
  onClick,
  variant = 'ghost'
}) => {
  const { unreadCount = 0, isConnected = false, hasError = false } = useNotifications();

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 4;
      case 'lg': return 6;
      default: return 5;
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'sm': return 'xs';
      case 'lg': return 'sm';
      default: return 'xs';
    }
  };

  return (
    <Box position="relative" display="inline-block">
      <Flex
        align="center"
        justify="center"
        cursor={onClick ? 'pointer' : 'default'}
        onClick={onClick}
        p={2}
        borderRadius="md"
        _hover={onClick ? { bg: 'gray.100' } : {}}
        transition="all 0.2s"
      >
        <Icon
          as={FiBell}
          boxSize={getIconSize()}
          color={hasError ? 'red.500' : isConnected ? 'blue.500' : 'gray.400'}
        />
        
        {showCount && unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-1"
            right="-1"
            colorScheme="red"
            size={getBadgeSize()}
            borderRadius="full"
            minW="20px"
            h="20px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
            fontWeight="bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        
        {!isConnected && !hasError && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="2px"
            h="2px"
            bg="yellow.400"
            borderRadius="full"
            animation="pulse 2s infinite"
          />
        )}
      </Flex>
    </Box>
  );
};

// Notification indicator for connection status
export const NotificationStatusIndicator: React.FC = () => {
  const { isConnected = false, hasError = false, status = 'disconnected', userId, isAuthenticated, connect, reconnect } = useNotifications();
  
  // Debug: Log the status values
  console.log('NotificationStatusIndicator Status:', {
    isConnected,
    hasError,
    status,
    userId,
    isAuthenticated,
    shouldShowConnecting: !isConnected && !hasError
  });
  
  const handleManualConnect = () => {
    console.log('Manual connect triggered');
    
    // Test backend connectivity first
    fetch('http://localhost:4000/health')
      .then(response => {
        console.log('Backend health check response:', response.status);
        if (response.ok) {
          console.log('Backend is reachable, attempting SSE connection');
          if (hasError) {
            reconnect();
          } else {
            connect();
          }
        } else {
          console.error('Backend health check failed with status:', response.status);
        }
      })
      .catch(error => {
        console.error('Backend health check failed:', error);
        console.log('Backend might not be running on port 4000');
      });
  };
  
  if (!isConnected && !hasError) {
    return (
      <Box
        position="fixed"
        top={4}
        right={4}
        zIndex={1000}
        bg="yellow.400"
        color="white"
        px={3}
        py={1}
        borderRadius="md"
        fontSize="xs"
        fontWeight="medium"
        boxShadow="md"
        cursor="pointer"
        onClick={handleManualConnect}
        title="Click to manually connect"
      >
        Connecting... ({status})
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box
        position="fixed"
        top={4}
        right={4}
        zIndex={1000}
        bg="red.500"
        color="white"
        px={3}
        py={1}
        borderRadius="md"
        fontSize="xs"
        fontWeight="medium"
        boxShadow="md"
        cursor="pointer"
        onClick={handleManualConnect}
        title="Click to retry connection"
      >
        Connection Error - Click to retry
      </Box>
    );
  }

  return null;
};

export default NotificationBadge; 