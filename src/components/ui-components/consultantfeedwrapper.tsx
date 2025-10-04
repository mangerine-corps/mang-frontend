import { Box, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';

interface DynamicTabsProps {
  activity?: React.ReactNode;
  consulting: React.ReactNode;
  reviews: React.ReactNode;
  data?:any;
}

const DynamicTabs: React.FC<DynamicTabsProps> = ({ activity, consulting, reviews ,data}) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'consulting' | 'reviews'>('consulting');

  // helper function to render the corresponding component
  const renderContent = () => {
    switch (activeTab) {
      case 'consulting':
        return <Box>{consulting}</Box>;
      case 'reviews':
        return <Box>{reviews}</Box>;
      case 'activity':
      default:
        return <Box>{activity}</Box>;
    }
  };

  return (
    <Box
      width="100%"
      // maxWidth="800px"
      mx="auto"
      mt="2"
      borderRadius="16px"
      bg="bg_box"
      boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
      p={4}

      boxSizing="border-box"
    >
      <Flex justifyContent="flex-start" alignItems="center" spaceX={6} mb="4">


        <Box
          display="inline-block"
          textAlign="center"
          borderBottom={activeTab === 'consulting' ? '2px solid black' : '2px solid transparent'}
          cursor="pointer"
          onClick={() => setActiveTab('consulting')}
          transition="border-color 0.2s ease"
          pb={2}
        >
          <Text
            color={activeTab === 'consulting' ? 'black' : '#999999'}
            fontSize="lg"
            fontWeight={activeTab === 'consulting' ? 'bold' : 'normal'}
          >
            Consulting Services
          </Text>
        </Box>

        <Box
          display="inline-block"
          textAlign="center"
          borderBottom={activeTab === 'reviews' ? '2px solid black' : '2px solid transparent'}
          cursor="pointer"
          onClick={() => setActiveTab('reviews')}
          transition="border-color 0.2s ease"
          pb={2}
        >
          <Text
            color={activeTab === 'reviews' ? 'black' : '#999999'}
            fontSize="lg"
            fontWeight={activeTab === 'reviews' ? 'bold' : 'normal'}
          >
            Ratings and Reviews
          </Text>
        </Box>
      </Flex>

      <Box mt="4">
        {renderContent()}
      </Box>
    </Box>
  );
};

export default DynamicTabs;