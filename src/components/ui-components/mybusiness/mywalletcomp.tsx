import { Box, Button, Flex, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { WalletTable } from "./wallettable";
import IncomeChart from "./incomechart";
import { useGetTransactionMutation } from "mangarine/state/services/payment.service";

const MyWalletComponent = () => {
  const [transactions, setTransactions] = useState<boolean>(false);
  const [income, setIncome] = useState<boolean>(false);
  const [getTransaction, { data, isLoading, error }] = useGetTransactionMutation();

  useEffect(() => {
    getTransaction({})
      .unwrap()
      .catch(() => {});
  }, [getTransaction]);

  // Normalize transactions array defensively
  const txns = useMemo(() => {
    const raw: any = data;
    if (!raw) return [] as any[];
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data as any[];
    if (Array.isArray(raw?.result)) return raw.result as any[];
    if (Array.isArray(raw?.data?.items)) return raw.data.items as any[];
    return [] as any[];
  }, [data]);

  // Compute total owed (sum of numeric amount fields when present)
  const totalOwed = useMemo(() => {
    return txns.reduce((sum, t: any) => {
      const amt = Number(t?.amount ?? t?.price ?? 0);
      return sum + (isFinite(amt) ? amt : 0);
    }, 0);
  }, [txns]);

  // Compute last updated from latest createdAt/date fields
  const lastUpdated = useMemo(() => {
    const dates = txns
      .map((t: any) => new Date(t?.updatedAt ?? t?.createdAt ?? t?.date ?? 0).getTime())
      .filter((n) => n && isFinite(n));
    const max = dates.length ? Math.max(...dates) : 0;
    return max ? new Date(max) : null;
  }, [txns]);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n || 0);
  const formatDateTime = (d: Date | null) => (d ? d.toLocaleString() : "—");

  // Build income summary datasets (per month buckets)
  const labels = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];
  const monthIndex = (d: any): number => {
    const dt = new Date(d);
    const idx = isNaN(dt.getTime()) ? -1 : dt.getMonth();
    return idx;
  };
  const isEarned = (s?: string) => {
    const v = (s || "").toLowerCase();
    return ["paid","completed","success","succeeded","settled"].some(k => v.includes(k));
  };
  const isUpcoming = (s?: string) => {
    const v = (s || "").toLowerCase();
    return ["pending","upcoming","scheduled","processing"].some(k => v.includes(k));
  };
  const isMissed = (s?: string) => {
    const v = (s || "").toLowerCase();
    return ["failed","missed","cancelled","canceled","declined"].some(k => v.includes(k));
  };

  const incomeDatasets = useMemo(() => {
    const earned = Array(labels.length).fill(0);
    const missed = Array(labels.length).fill(0);
    const upcoming = Array(labels.length).fill(0);
    txns.forEach((t: any) => {
      const when = t?.createdAt ?? t?.updatedAt ?? t?.date;
      const idx = monthIndex(when);
      if (idx < 0 || idx > 11) return;
      const amount = Number(t?.amount ?? t?.price ?? 0) || 0;
      const status = t?.status ?? t?.state ?? "";
      if (isEarned(status)) earned[idx] += amount;
      else if (isUpcoming(status)) upcoming[idx] += amount;
      else if (isMissed(status)) missed[idx] += amount;
    });
    return [
      { label: "Earned", data: earned, backgroundColor: "active_chat", stack: "income" },
      { label: "Missed", data: missed, backgroundColor: "#808080", stack: "income" },
      { label: "Upcoming", data: upcoming, backgroundColor: "grey.300", stack: "income" },
    ];
  }, [txns]);

  const totalEarned = useMemo(() => incomeDatasets[0].data.reduce((a,b)=>a+b,0), [incomeDatasets]);
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
      p={{base:"3",md:"8",lg:"8"}}
      w="full"
      mb="24"
      overflow={"scroll"}
    >
      <Box
        //w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
        bg="active_chat"
        w="full"
        px={6}
        py={6}
        rounded="xl"
        // marginLeft={40}
        mt={0}
      >
        <HStack
          w="full"
          pb="6"
          justifyContent={"space-between"}
          alignItems={"flex-start"}
        >
          <VStack alignItems="flex-start" justifyContent={"flex-start"}>
            <Text
              color="main_background"
              fontSize={{base:"1rem",md:"1.2rem",lg:"1.25rem"}}
              fontWeight="400"
              lineHeight={"36px"}
            >
              We Owe
            </Text>
            <HStack>
              <Text
                color="main_background"
                fontSize={{base:"1.2rem",md:"1.5rem",lg:"2.5rem"}}
                fontWeight="600"
                // lineHeight={"36px"}
              >
                {isLoading ? "Loading…" : formatCurrency(totalOwed)}
              </Text>
              <Image src="/icons/walleteye.svg" alt="close-wallet" />
            </HStack>
            <Text
              color="main_background"
              fontSize={{base:"0.8rem",md:"0.875rem",lg:"1rem"}}
              fontWeight="300"
              //   lineHeight={"36px"}
            >
              Last updated: {isLoading ? "Loading…" : formatDateTime(lastUpdated)}
            </Text>
          </VStack>
          <Stack
            bg="#FFFFFF33"
            justifyContent={"center"}
            objectFit={"contain"}
            alignItems={"center"}
            py="4"
            px="4"
            rounded="md"
          >
            {" "}
            <Image src="/icons/wallet.svg" alt="wallet-img" boxSize={{base:"4",md:"6",lg:"12"}} />
          </Stack>
          {/* <Image src="/icons/wallet.svg" alt="wallet-img" /> */}
        </HStack>
        <Text
          color="main_background"
          fontSize={{base:"0.8rem",md:"0.875rem",lg:"1rem"}}
          fontWeight="300"
          textAlign={"center"}
          pt="6"
          pb="2"
          //   lineHeight={"36px"}
        >
          Withdrawals are automatic
        </Text>
      </Box>
      <HStack
        w="full"
        py="6"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Text
          color="text_primary"
          fontSize="1.25rem"
          fontWeight="600"
          lineHeight={"36px"}
        >
          Transaction History
        </Text>
        <Button
          variant="ghost"
          onClick={() => {
            setTransactions(!transactions);
          }}
        >
          {" "}
          <Text
            color="text_primary"
            fontSize="1rem"
            fontWeight="600"
            lineHeight={"36px"}
          >
            View
          </Text>
        </Button>
      </HStack>
      {transactions && (
        <WalletTable items={txns} isLoading={isLoading} error={error} />
      )}

      <HStack
        w="full"
        py="6"
        justifyContent={"space-between"}
        alignItems={"center"}

      >
        <Text
          color="text_primary"
          fontSize="1.25rem"
          fontWeight="600"
          lineHeight={"36px"}
        >
          Income Summary
        </Text>
        <Button
          variant="ghost"
          onClick={() => {
            setIncome(!income);
          }}
        >
          {" "}
          <Text
            color="text_primary"
            fontSize="1rem"
            fontWeight="600"
            lineHeight={"36px"}
          >
            View
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
