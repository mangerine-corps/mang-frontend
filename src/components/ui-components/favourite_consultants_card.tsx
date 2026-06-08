"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Text, VStack, Image, Flex, Box, HStack, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import NextImage from "next/image";
import {
  useGetFavoriteConsultantsQuery,
  useUnfavoriteConsultantMutation,
} from "mangarine/state/services/consultant.service";
import { safeProfilePic, imgErrorFallback } from "mangarine/lib/constants";
import { isEmpty } from "es-toolkit/compat";
import { setFavoriteConsultant } from "mangarine/state/reducers/consultant.reducer";
import { useDispatch } from "react-redux";
import { useAuth } from "mangarine/state/hooks/user.hook";

const heart = "/icons/heart.svg";
const aheart = "/icons/aheart.svg";

const FavouriteConsultantsComp = () => {
  const { data, error, isLoading, refetch } = useGetFavoriteConsultantsQuery({});
  const [unfavoriteConsultant] = useUnfavoriteConsultantMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useAuth();

  // Track which consultant IDs have been locally unfavourited (optimistic)
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const list = Array.isArray(data?.data) ? data.data : data?.data?.favoriteConsultants;
    if (list) dispatch(setFavoriteConsultant(list));
  }, [data, dispatch]);

  if (error) {
    console.error("API Error fetching favorite consultants:", error);
  }

  const handleUnfavourite = async (e: React.MouseEvent, consultantId: string) => {
    e.stopPropagation();
    // Optimistic remove
    setRemovedIds((prev) => new Set(prev).add(consultantId));
    try {
      await unfavoriteConsultant({ consultantId, userId: user?.id }).unwrap();
      refetch();
    } catch {
      // Revert on failure
      setRemovedIds((prev) => { const s = new Set(prev); s.delete(consultantId); return s; });
    }
  };

  const rawList: any[] = Array.isArray(data?.data)
    ? data.data
    : (data?.data?.favoriteConsultants ?? []);

  const consultants = rawList.filter(
    (item: any) => !removedIds.has(item?.consultant?.id)
  );

  return (
    <VStack
      w="100%"
      rounded="lg"
      py="6"
      bg="bg_box"
      boxShadow="sm"
      alignItems="flex-start"
    >
      <Text
        textAlign="left"
        w="full"
        px="6"
        fontSize="1.25rem"
        fontFamily="Outfit"
        color="text_primary"
        fontWeight="600"
      >
        Favourite Consultant
      </Text>

      {isLoading && (
        <Flex flexDir="column" gap={4} w="full" px="6">
          {Array.from({ length: 3 }).map((_, i) => (
            <HStack key={i} w="full" justifyContent="space-between">
              <HStack gap="8px">
                <SkeletonCircle size="10" />
                <Box>
                  <Skeleton h="14px" w="100px" mb={1} rounded="md" />
                  <Skeleton h="12px" w="70px" rounded="md" />
                </Box>
              </HStack>
              <SkeletonCircle size="8" />
            </HStack>
          ))}
        </Flex>
      )}

      {!isLoading && isEmpty(consultants) && (
        <Text px="6" fontSize="0.875rem" color="gray.400" fontFamily="Outfit" textAlign="left">
          You haven&apos;t added any consultants to your favourites yet. Tap the ♥ icon to save one!
        </Text>
      )}

      <Flex flexDir="column" gap={4} w="full" py="2" px="6">
        {consultants.slice(0, 3).map((item: any, index: number) => {
          const consultantId = item?.consultant?.id;
          return (
            <HStack
              key={consultantId || index}
              w="full"
              alignItems="center"
              justifyContent="space-between"
            >
              <Flex
                align="center"
                gap="8px"
                cursor="pointer"
                flex={1}
                minW={0}
                _hover={{ opacity: 0.8 }}
                onClick={() => {
                  if (consultantId) router.push(`/profile/${consultantId}`);
                }}
              >
                <Box boxSize="40px" borderRadius="full" overflow="hidden" flexShrink={0} position="relative">
                  <NextImage
                    src={safeProfilePic(item?.consultant?.profilePics)}
                    alt={item?.consultant?.fullName ?? "Consultant"}
                    fill
                    sizes="40px"
                    style={{ objectFit: "cover" }}
                  />
                </Box>
                <Box minW={0}>
                  <Text fontSize="sm" fontWeight="bold" color="text_primary" truncate>
                    {item?.consultant?.fullName}
                  </Text>
                  <Text fontSize="xs" fontWeight="400" color="#999" truncate>
                    {item?.consultant?.businessName}
                  </Text>
                </Box>
              </Flex>

              {/* Filled heart — click to unfavourite */}
              <Image
                src={heart}
                alt="Remove favourite"
                boxSize="28px"
                cursor="pointer"
                flexShrink={0}
                _hover={{ opacity: 0.7 }}
                transition="opacity 0.15s"
                onClick={(e) => handleUnfavourite(e, consultantId)}
              />
            </HStack>
          );
        })}
      </Flex>

      {rawList.length > 0 && (
        <Text
          fontSize="sm"
          fontWeight={500}
          color="#FC731A"
          cursor="pointer"
          px="6"
          mt={2}
          _hover={{ textDecoration: "underline" }}
          onClick={() => router.push("/saved?tab=consultants")}
        >
          See all
        </Text>
      )}
    </VStack>
  );
};

export default FavouriteConsultantsComp;
