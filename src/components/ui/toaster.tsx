"use client"

import {
  Portal,
  Toaster as ChakraToaster,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "top",
  pauseOnPageIdle: true,
  duration: 3000,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster}>
        {(toast) => (
          <Toast.Root
            px={5}
            py={3}
            bg="#FFF8EC"
            borderWidth="1px"
            borderColor="#F0D9B5"
            rounded="lg"
            shadow="sm"
            display="flex"
            alignItems="center"
            justifyContent="center"
            minW="320px"
            maxW="520px"
          >
            <Toast.Description
              fontFamily="Outfit"
              fontSize="0.875rem"
              fontWeight="500"
              color="#1A1A1A"
              textAlign="center"
            >
              {toast.description ?? toast.title}
            </Toast.Description>
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
