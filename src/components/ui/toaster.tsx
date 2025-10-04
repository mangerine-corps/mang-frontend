"use client"

import {
  Box,
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "top-end",
  pauseOnPageIdle: true,
  duration: 3000
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root 
            width={{ md: "sm" }}
            p='1em'
            textStyle='body1'
            display="flex"
            alignContent="center"
            justifyContent="space-between"
            >
            {toast.type === "loading" ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            )}
            <Toast.CloseTrigger top='15px'/>
            {/* {toast.meta?.closable && <Toast.CloseTrigger />} */}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
