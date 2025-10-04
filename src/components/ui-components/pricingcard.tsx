import React, { useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useGetConsultantPricingQuery } from 'mangarine/state/services/consultant.service';
import { useAuth } from 'mangarine/state/hooks/user.hook';

type PricingCardProps = { consultantId?: string };

const PricingCard = ({ consultantId }: PricingCardProps) => {
  const { user } = useAuth();
  const targetId = consultantId || user?.id;
  const { data, isLoading } = useGetConsultantPricingQuery(targetId as string, { skip: !targetId });
  const pricingData = data?.data?.consultant?.pricing;

  const currencySymbol = (code?: string) => {
    switch ((code || '').toUpperCase()) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'NGN':
        return '₦';
      default:
        return code ? `${code} ` : '$';
    }
  };

  const sessions = useMemo(() => {
    if (!pricingData) return [] as Array<{ label: string; amount: number }>;
    const flat = Number(pricingData.flatPrice ?? 0);
    const curr = pricingData.currency ?? 'USD';

    const items: Array<{ label: string; amount: number }> = [];

    if (!isNaN(flat) && flat > 0) {
      // 1 hour (no discount applied)
      items.push({ label: '1-Hour Session', amount: flat });

      // Percentage discounts applied to total price for the duration
      const twoPct = Number(pricingData.twoHoursDiscount ?? 0);
      const threePct = Number(pricingData.threeHoursDiscount ?? 0);
      const fourPct = Number(pricingData.fourHoursDiscount ?? 0);

      if (twoPct > 0) {
        const total = flat - flat * (twoPct / 100);
        items.push({ label: '2-Hour Session', amount: total });
      }
      if (threePct > 0) {
        const total = flat - flat * (threePct / 100);
        items.push({ label: '3-Hour Session', amount: total });
      }
      if (fourPct > 0) {
        const total = flat - flat * (fourPct / 100);
        items.push({ label: '4-Hour Session', amount: total });
      }
    }

    // Note: dayBookPercentage / midDayBookPercentage not used per requirement

    return items;
  }, [pricingData]);

  const currSym = currencySymbol(pricingData?.currency);
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
      <Text color='text_primary' fontSize="xl" fontWeight="bold" alignSelf="flex-start" marginBottom="16px">
        Pricing
      </Text>

      <Box
        display="flex"
        flexDirection="column"
        gap={4}
        width={'full'}
        justifyContent="space-between"
        flexWrap="wrap"
      >
        {isLoading && (
          <Text color='text_primary' fontSize="sm" fontWeight={'500'} alignSelf="flex-start">
            Loading pricing...
          </Text>
        )}
        {!isLoading && sessions.length === 0 && (
          <Text color='text_primary' fontSize="sm" fontWeight={'500'} alignSelf="flex-start">
            No pricing available
          </Text>
        )}
        {!isLoading && sessions.map((s) => {
          const amountFormatted = (s.amount ?? 0).toLocaleString(undefined, { style: 'currency', currency: pricingData?.currency || 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          return (
            <Text key={s.label} color='text_primary' fontSize="sm" fontWeight={'500'} alignSelf="flex-start">
              {s.label}: {amountFormatted}
            </Text>
          );
        })}
      </Box>
    </Box>
  );
};

export default PricingCard;