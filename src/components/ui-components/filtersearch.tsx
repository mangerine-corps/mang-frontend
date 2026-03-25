import { Avatar, Box, HStack, Icon, Spinner, Text, VStack } from "@chakra-ui/react";
import { Clock, X } from "lucide-react";
import {
  useGetRecentSearchesQuery,
  useGetSuggestedSearchesQuery,
  useRemoveRecentSearchMutation,
} from "mangarine/state/services/search.service";

interface FilterSearchProps {
  onSelect?: (item: { id: string; name: string; type: "user" | "consultant" }) => void;
}

const FilterSearch = ({ onSelect }: FilterSearchProps) => {
  const { data: recentData, isLoading: recentLoading } = useGetRecentSearchesQuery();
  const { data: suggestedData, isLoading: suggestedLoading } = useGetSuggestedSearchesQuery();
  const [removeRecent] = useRemoveRecentSearchMutation();

  const recentSearches: any[] = (recentData?.data ?? []).slice(0, 3);
  const suggested: any[] = (suggestedData?.data ?? []).slice(0, 3);

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeRecent(id);
  };

  const handleSelect = (item: any) => {
    const resolved = item.profile ?? item;
    onSelect?.({
      id: resolved.id ?? item.targetId,
      name: resolved.fullName ?? resolved.name ?? "",
      type: item.type ?? "user",
    });
  };

  return (
    <Box bg="bg_box" rounded="lg" shadow="sm" p={4} w="full">
      {/* Recent Searches */}
      {recentLoading ? (
        <HStack py={2} justifyContent="center">
          <Spinner size="sm" />
        </HStack>
      ) : recentSearches.length > 0 ? (
        <VStack align="stretch" gap={0} mb={3}>
          <Text
            fontSize="0.75rem"
            fontFamily="Outfit"
            fontWeight="600"
            color="grey.500"
            mb={2}
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            Recent
          </Text>
          {recentSearches.map((item: any, idx: number) => {
            const profile = item.profile ?? item;
            const name = profile.fullName ?? profile.name ?? item.query ?? "";
            const title = profile.businessName ?? profile.title ?? "";
            const avatar = profile.profilePics ?? null;
            const id = item.id ?? item.targetId;

            return (
              <HStack
                key={idx}
                justify="space-between"
                py={2}
                px={1}
                rounded="md"
                cursor="pointer"
                _hover={{ bg: "main_background" }}
                onClick={() => handleSelect(item)}
              >
                <HStack gap={3}>
                  <Icon color="grey.400">
                    <Clock size={14} />
                  </Icon>
                  {avatar ? (
                    <Avatar.Root w={8} h={8}>
                      <Avatar.Fallback name={name} />
                      <Avatar.Image src={avatar} />
                    </Avatar.Root>
                  ) : null}
                  <Box>
                    <Text fontWeight="500" color="text_primary" fontSize="0.875rem" fontFamily="Outfit">
                      {name}
                    </Text>
                    {title ? (
                      <Text color="grey.500" fontSize="0.75rem" fontFamily="Outfit">
                        {title}
                      </Text>
                    ) : null}
                  </Box>
                </HStack>
                <Box
                  as="button"
                  onClick={(e: React.MouseEvent) => handleRemove(e, id)}
                  p={1}
                  rounded="full"
                  _hover={{ bg: "gray.100" }}
                  color="grey.400"
                >
                  <X size={12} />
                </Box>
              </HStack>
            );
          })}
        </VStack>
      ) : null}

      {/* Suggested */}
      {suggestedLoading ? (
        <HStack py={2} justifyContent="center">
          <Spinner size="sm" />
        </HStack>
      ) : suggested.length > 0 ? (
        <VStack align="stretch" gap={0}>
          <Text
            fontSize="0.75rem"
            fontFamily="Outfit"
            fontWeight="600"
            color="grey.500"
            mb={2}
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            Suggested
          </Text>
          {suggested.map((item: any, idx: number) => {
            const name = item.fullName ?? item.name ?? "";
            const title = item.businessName ?? item.title ?? "";
            const avatar = item.profilePics ?? null;

            return (
              <HStack
                key={idx}
                py={2}
                px={1}
                rounded="md"
                cursor="pointer"
                gap={3}
                _hover={{ bg: "main_background" }}
                onClick={() => onSelect?.({ id: item.id, name, type: item.type ?? "user" })}
              >
                <Avatar.Root w={8} h={8}>
                  <Avatar.Fallback name={name} />
                  <Avatar.Image src={avatar} />
                </Avatar.Root>
                <Box>
                  <Text fontWeight="500" color="text_primary" fontSize="0.875rem" fontFamily="Outfit">
                    {name}
                  </Text>
                  {title ? (
                    <Text color="grey.500" fontSize="0.75rem" fontFamily="Outfit">
                      {title}
                    </Text>
                  ) : null}
                </Box>
              </HStack>
            );
          })}
        </VStack>
      ) : null}

      {!recentLoading && !suggestedLoading && recentSearches.length === 0 && suggested.length === 0 && (
        <Text fontSize="0.875rem" color="grey.400" textAlign="center" py={3} fontFamily="Outfit">
          No recent or suggested searches
        </Text>
      )}
    </Box>
  );
};

export default FilterSearch;
