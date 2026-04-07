import { Box, Flex, Text } from '@chakra-ui/react';
import { useState } from 'react';

interface DynamicTabsProps {
  activity?: React.ReactNode;
  consulting?: React.ReactNode;
  reviews?: React.ReactNode;
  data?: any;
}

const DynamicTabs: React.FC<DynamicTabsProps> = ({ activity, consulting, reviews, data }) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'consulting' | 'reviews'>('activity');

  const renderContent = () => {
    switch (activeTab) {
      case 'activity':
        return <Box>{activity}</Box>;
      case 'consulting':
        return <Box>{consulting}</Box>;
      case 'reviews':
        return <Box>{reviews}</Box>;
      default:
        return <Box>{activity}</Box>;
    }
  };

  const allTabs: { key: 'activity' | 'consulting' | 'reviews'; label: string; content: React.ReactNode }[] = [
    { key: 'activity', label: 'Activity Feed', content: activity },
    { key: 'consulting', label: 'Consulting Services', content: consulting },
    { key: 'reviews', label: 'Rating and Reviews', content: reviews },
  ];

  const tabs = allTabs.filter((tab) => tab.key === 'activity' || tab.content !== undefined);

  return (
    <Box
      width="100%"
      mx="auto"
      mt="2"
      borderRadius="16px"
      bg="bg_box"
      boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
      p={4}
      boxSizing="border-box"
    >
      <Flex justifyContent="flex-start" alignItems="center" gap={6} mb="4" borderBottom="1px solid" borderColor="gray.100" pb={0}>
        {tabs.map((tab) => (
          <Box
            key={tab.key}
            display="inline-block"
            textAlign="center"
            borderBottom={activeTab === tab.key ? '2px solid #111D4A' : '2px solid transparent'}
            cursor="pointer"
            onClick={() => setActiveTab(tab.key)}
            transition="border-color 0.2s ease"
            pb={3}
          >
            <Text
              color={activeTab === tab.key ? '#111D4A' : '#999999'}
              fontSize="0.9rem"
              fontWeight={activeTab === tab.key ? '600' : '400'}
              fontFamily="Outfit"
              whiteSpace="nowrap"
            >
              {tab.label}
            </Text>
          </Box>
        ))}
      </Flex>

      <Box mt="4">
        {renderContent()}
      </Box>
    </Box>
  );
};

export default DynamicTabs;
