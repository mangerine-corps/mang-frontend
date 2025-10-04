import { Box, Text, VStack } from '@chakra-ui/react';

interface RuleItem {
  title: string;
  description: string;
}

interface RegulationsCardProps {
  title: string;
  content: RuleItem[];
  width?: string | object;
}

const RegulationsCard = ({ title, content, width = 'full' }: RegulationsCardProps) => {
  return (
    <VStack >
    <Box
      //align="start"
      w="384px"
      h="450px"
      borderRadius="16px"
      p="24px"
      gap="24px"
      borderWidth={0.5}
      bg={"bg_box"}
      rounded={'15px'}
      shadow={'sm'}
      wordSpacing={4}
      //w={width}
    >
      <Text
        fontSize={'1.25rem'}
        fontFamily={'Outfit'}
        color={'text_primary'}
        fontWeight={'600'}
        lineHeight={'20px'}
        mb={4}
      >
        {title}
      </Text>

      {content.map((item, index) => (
        <Text
          key={index}
          fontSize={'1rem'}
          fontFamily={'Outfit'}
          color={'text_primary'}
          fontWeight={'400'}
          lineHeight={'24px'}
          mb={2}
        >
          <Text as="span" fontWeight="600">
            {item.title}:{' '}
          </Text>
          {item.description}
        </Text>
      ))}
      </Box>
    </VStack>
  );
};

export default RegulationsCard;
