import { Box, Button, Flex, HStack, Image, Skeleton, Stack, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { WalletTable } from "./wallettable";
import IncomeChart from "./incomechart";
import { useGetTransactionsQuery, useGetWalletTotalQuery } from "mangarine/state/services/transaction.service";
import type { EarningItem } from "mangarine/state/services/transaction.service";

const MyWalletComponent = () => {
  const router = useRouter();
  const { section } = router.query;

  const [transactions, setTransactions] = useState<boolean>(section === "transactions" || section === "payments");
  const [income, setIncome] = useState<boolean>(false);
  const [balanceHidden, setBalanceHidden] = useState<boolean>(false);

  const { data: walletData, isLoading: walletLoading } = useGetWalletTotalQuery();
  const { data: txData, isLoading: txLoading, error } = useGetTransactionsQuery({});

  const isLoading = walletLoading || txLoading;
  const availableBalance = walletData?.total ?? 0;
  const currency = walletData?.currency ?? "USD";

  const payments = txData?.payments?.payments ?? [];
  const earnings = txData?.earnings?.earnings ?? [];

  const lastUpdated = useMemo(() => {
    const dates = [
      ...payments.map((p: any) => new Date(p?.updatedAt ?? p?.createdAt ?? 0).getTime()),
      ...earnings.map((e: any) => new Date(e?.updatedAt ?? e?.createdAt ?? 0).getTime()),
    ].filter((n) => n && isFinite(n));
    const max = dates.length ? Math.max(...dates) : 0;
    return max ? new Date(max) : null;
  }, [payments, earnings]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n || 0);
  const formatDateTime = (d: Date | null) => (d ? d.toLocaleString() : "—");

  // Build income chart datasets from earnings (grouped by month)
  const labels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const incomeDatasets = useMemo(() => {
    const earned = Array(12).fill(0);
    const pending = Array(12).fill(0);
    earnings.forEach((e: EarningItem) => {
      const idx = new Date(e.createdAt ?? 0).getMonth();
      if (idx < 0 || idx > 11) return;
      if (e.status === "PAID") earned[idx] += e.netAmount;
      else pending[idx] += e.netAmount;
    });
    return [
      { label: "Paid Out", data: earned, backgroundColor: "#0B1441", stack: "income" },
      { label: "Pending", data: pending, backgroundColor: "#808080", stack: "income" },
    ];
  }, [earnings]);

  const totalEarned = useMemo(
    () => earnings.filter((e: EarningItem) => e.status === "PAID").reduce((s: number, e: EarningItem) => s + e.netAmount, 0),
    [earnings]
  );
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      direction="column"
      align="flex-start"
      justify="flex-start"
      minH="full"
      borderRadius="lg"
      boxShadow="lg"
      bg="main_background"
      p={{ base: "3", md: "8", lg: "8" }}
      w="full"
      mb="24"
      overflow="scroll"
    >
      {/* Balance card */}
      <Box bg="active_chat" w="full" px={6} py={6} rounded="xl" mt={0}>
        <HStack w="full" pb="6" justifyContent="space-between" alignItems="flex-start">
          <VStack alignItems="flex-start">
            <Text color="main_background" fontSize={{ base: "1rem", md: "1.2rem", lg: "1.25rem" }} fontWeight="400" lineHeight="36px">
              Available Balance
            </Text>
            <HStack>
              {isLoading ? (
                <Skeleton h={{ base: "2rem", md: "2.5rem", lg: "3.5rem" }} w="160px" borderRadius="md" />
              ) : (
                <Text color="main_background" fontSize={{ base: "1.2rem", md: "1.5rem", lg: "2.5rem" }} fontWeight="600">
                  {balanceHidden ? "••••••" : formatCurrency(availableBalance)}
                </Text>
              )}
              <Image
                src="/icons/walleteye.svg"
                alt="toggle balance"
                cursor="pointer"
                onClick={() => setBalanceHidden((v) => !v)}
                opacity={balanceHidden ? 0.4 : 1}
              />
            </HStack>
            <Text color="main_background" fontSize={{ base: "0.8rem", md: "0.875rem" }} fontWeight="300">
              {isLoading ? "" : `Last updated: ${formatDateTime(lastUpdated)}`}
            </Text>
          </VStack>
          <Stack bg="#FFFFFF33" justifyContent="center" alignItems="center" py="4" px="4" rounded="md">
            <Image src="/icons/wallet.svg" alt="wallet" boxSize={{ base: "4", md: "6", lg: "12" }} />
          </Stack>
        </HStack>
        <Text color="main_background" fontSize={{ base: "0.8rem", md: "0.875rem" }} fontWeight="300" textAlign="center" pt="6" pb="2">
          Withdrawals are automatic
        </Text>
      </Box>

      {/* Transaction History */}
      <HStack w="full" py="6" justifyContent="space-between" alignItems="center">
        <Text color="text_primary" fontSize="1.25rem" fontWeight="600" lineHeight="36px">
          Transaction History
        </Text>
        <Button variant="ghost" onClick={() => setTransactions(!transactions)}>
          <Text color="text_primary" fontSize="1rem" fontWeight="600" lineHeight="36px">
            {transactions ? "Hide" : "View"}
          </Text>
        </Button>
      </HStack>
      {transactions && (
        <WalletTable
          payments={payments}
          earnings={earnings}
          isLoading={txLoading}
          error={error}
        />
      )}

      {/* Income Summary */}
      <HStack w="full" py="6" justifyContent="space-between" alignItems="center">
        <Text color="text_primary" fontSize="1.25rem" fontWeight="600" lineHeight="36px">
          Income Summary
        </Text>
        <Button variant="ghost" onClick={() => setIncome(!income)}>
          <Text color="text_primary" fontSize="1rem" fontWeight="600" lineHeight="36px">
            {income ? "Hide" : "View"}
          </Text>
        </Button>
      </HStack>
      {income && (
        <IncomeChart labels={labels} datasets={incomeDatasets} totalEarned={totalEarned} year={currentYear} />
      )}
    </Flex>
  );
};

export default MyWalletComponent;
