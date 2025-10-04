import { useState } from "react";
import { Box, Text, Image, HStack } from "@chakra-ui/react";
import { size } from "lodash";
import AvailableTimeCard from "./available_timecard";
import PricingCard from "./pricingcard";
import ConsultancyServiceModal from "./consultancyservicemodal";
import EditConsultancyServiceModal from "./editconsultancyservicemodal";
import { HiMiniPlus } from "react-icons/hi2";
import { BiEdit, BiTrash } from "react-icons/bi";
import BoxLoader from "./profile/boxloader";
import { useRouter } from "next/router";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useDeleteConsultingServiceMutation } from "mangarine/state/services/profile.service";
import { toaster } from "../ui/toaster";

const ConsultingServices = ({
  isLoading,
  consultings,
  availabilityInfo,
  consultantId,
  refetch, // ✅ pass this down from parent to refresh after edits/deletes
}: {
  isLoading: boolean;
  consultings: any[];
  availabilityInfo?: any;
  consultantId?: string;
  refetch?: () => void;
}) => {
    // const { onOpen, isOpen, onClose } = useDisclosure();
    const [open, setOpen] = useState<boolean>(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [selectedService, setSelectedService] = useState<any | null>(null);

  const [selected, setSelected] = useState(null);
  const route = useRouter();
  const { user } = useAuth();

  const [deleteConsultingService, { isLoading: deleteLoading }] =
    useDeleteConsultingServiceMutation();

  // 🔹 Delete handler
  const handleDelete = (service) => {
    const id = service?.id;
    if (!id) return;

    deleteConsultingService(id)
      .unwrap()
      .then((res) => {
        toaster.create({
          title: "Deleted",
          description: res?.message || "Service deleted successfully",
          type: "success",
          duration: 4000,
        });
        refetch?.(); // reload services from API
      })
      .catch((err) => {
        toaster.create({
          title: "Error",
          description: err?.data?.message || "Failed to delete service",
          type: "error",
          duration: 4000,
        });
      });
  };

  // 🔹 Edit handler
  const handleEdit = (service) => {
    setSelected(service);
    setOpen(true);
  };
 console.log(consultings, "consulting")
  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        padding={6}
        alignItems="flex-start"
        gap={3}
        borderRadius={14}
        backgroundColor="main_background"
        boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
        width="full"
      >
        <HStack w="full" justifyContent="space-between" alignItems="center">
          <Text
            fontSize="xl"
            fontWeight="bold"
            alignSelf="flex-start"
            color="text_primary"
            mb="16px"
          >
            Consulting Services Offered
          </Text>

          {route.pathname === "/profile" && (
            <Box
              border={0.5}
              rounded={4}
              py={2}
              px="2"
              onClick={() => {
                setSelected(null); // reset when adding new
                setOpen(true);
              }}
              borderColor="grey.300"
              shadow="md"
              cursor="pointer"
            >
              <HiMiniPlus color="text_primary" />
            </Box>
          )}
        </HStack>

        {/* Services list */}
        <Box
          display="flex"
          flexDirection="row"
          gap={4}
          width="full"
          justifyContent="flex-start"
          flexWrap="wrap"
        >
          {isLoading ? (
            <HStack w="full" gap={6}>
              {new Array(4).fill(0).map((_, idx) => (
                <BoxLoader key={idx} />
              ))}
            </HStack>
          ) : size(consultings) > 0 ? (
            consultings.map((service) => (
              <Box
                key={service.id}
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                p={2}
                gap="6px"
                pos="relative"
                borderRadius="6px"
                backgroundColor="bg_box"
                boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
                w="200px"
                cursor="pointer"
                // onClick={() => {
                //   // Open modal in edit mode for this service
                //   setSelected(service);
                //   user && setOpen(true);

                // }}
              >
                <Image
                  src={service.file}
                  alt={service.title}
                  w="100%"
                  h="100px"
                  objectFit="cover"
                  rounded="10px"
                />
                <Text
                  color="text_primary"
                  fontSize="14px"
                  fontWeight={600}
                  mt={2}
                >
                  {service.title}
                </Text>
                {route.pathname === "/profile" && (
                  <HStack
                    pos="absolute"
                    right={2}
                    top={2}
                    spaceX={2}
                    onClick={(e) => {
                      // prevent card onClick from firing when clicking the icons
                      e.stopPropagation();
                    }}
                  >
                    <Box
                      border={0.5}
                      rounded={4}
                      p={1}
                      cursor="pointer"
                      borderColor="grey.300"
                      shadow="md"
                      onClick={() => handleEdit(service)}
                    >
                      <BiEdit color="text_primary" />
                    </Box>
                    <Box
                      border={0.5}
                      rounded={4}
                      p={1}
                      cursor="pointer"
                      borderColor="grey.300"
                      shadow="md"
                      onClick={() => handleDelete(service)}
                    >
                      <BiTrash color="red" />
                    </Box>
                  </HStack>
                )}
              </Box>
            ))
          ) : (
            <Text fontWeight={400} fontSize="1rem" color="text_primary">
              No consulting services found...
            </Text>
          )}
        </Box>
      </Box>

      {/* Availability & Pricing */}
      <Box mt={5}>
        {availabilityInfo && (
          <AvailableTimeCard availabilityInfo={availabilityInfo} />
        )}
      </Box>
      <Box mt={5}>
        <PricingCard consultantId={consultantId} />
      </Box>

      {/* Add/Edit Modal */}
      <ConsultancyServiceModal
        open={open}
        service={selected}
        onOpenChange={() => {
          setOpen(false);
          setSelected(null);
          refetch?.();
        }}
        handleSelect={handleEdit}
      />
    </>
  );
};

export default ConsultingServices;
