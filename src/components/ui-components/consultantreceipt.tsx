// import React from 'react';
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalBody,
//   ModalCloseButton,
//   Text,
//   Box,
//   Divider,
//   Flex,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import CustomButton from '../../custombutton';
// const paymentsuccess = "/assets/icons/payment.svg";

// interface ConsultantReceiptProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const PaymentSuccessIcon = () => (
//   <Box
//     as="img"
//     src={paymentsuccess}
//     width="90px"
//     height="90px"
//     position="absolute"
//     top="-40px"
//     left="50%"
//     transform="translateX(-50%)"
//     alt="Payment Successful"
//   />
// );

// const ConsultantReceipt: React.FC<ConsultantReceiptProps> = ({ isOpen, onClose }) => {
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} isCentered>
//       <ModalOverlay />
//       <ModalContent
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         padding="26px"
//         borderRadius="16px"
//         background="#FFF"
//         position="relative"
//         overflow="visible"
//         maxWidth="400px"
//       >
//         <ModalCloseButton />
//         <PaymentSuccessIcon />

//         <ModalBody mt="10px" textAlign="center">
//           {/* header text */}
//           <Text fontSize="24px" fontWeight="bold">
//             Payment Successful!
//           </Text>

//           <Text fontSize="14px" color="#999" mb={2}>
//             Your payment has been successfully made
//           </Text>

//           {/* divider */}
//           <Divider my={6} borderColor={useColorModeValue('gray.200', 'gray.600')} />

//           {/* payment receipt */}
//           <Flex justifyContent="space-between" width="100%" mb={2}>
//             <Text fontSize="16px" fontWeight="bold">
//               Payment Receipt
//             </Text>
//           </Flex>

//           {/* receipt number and date of issue */}
//           <Flex justifyContent="space-between" width="100%" mb={4}>
//             <Text color={'#999'} fontSize="16px" fontWeight="normal">
//               Receipt Number:
//             </Text>
//             <Text fontSize="16px" fontWeight="bold">
//               96743993
//             </Text>
//           </Flex>

//           <Flex justifyContent="space-between" width="100%" mb={4}>
//             <Text color={'#999'} fontSize="16px" fontWeight="normal">
//               Date of Issue:
//             </Text>
//             <Text fontSize="16px" fontWeight="bold">
//               August 25, 2024
//             </Text>
//           </Flex>

//           <Divider my={6} borderColor={useColorModeValue('gray.200', 'gray.600')} />

//           {/* payment details */}
//           <Flex justifyContent="space-between" width="100%" mb={2}>
//             <Text fontSize="16px" fontWeight="bold">
//               Payment Details
//             </Text>
//           </Flex>

//           <Flex justifyContent="space-between" width="100%" mb={4}>
//             <Text color={'#999'} fontSize="16px" fontWeight="normal">
//               Service Description:
//             </Text>
//             <Text fontSize="16px" fontWeight="bold">
//               96743993
//             </Text>
//           </Flex>

//           <Flex justifyContent="space-between" width="100%" mb={4}>
//             <Text color={'#999'} fontSize="16px" fontWeight="normal">
//               Date of Service:
//             </Text>
//             <Text fontSize="16px" fontWeight="bold">
//               August 25, 2024
//             </Text>
//           </Flex>

//           <Flex justifyContent="space-between" width="100%" mb={4}>
//             <Text color={'#999'} fontSize="16px" fontWeight="normal">
//               Amount Paid:
//             </Text>
//             <Text fontSize="16px" fontWeight="bold">
//               $150.00
//             </Text>
//           </Flex>

//           <Flex justifyContent="space-between" width="100%" mb={4}>
//             <Text color={'#999'} fontSize="16px" fontWeight="normal">
//               Payment Method:
//             </Text>
//             <Text fontSize="16px" fontWeight="bold">
//               Credit card()
//             </Text>
//           </Flex>
          

//           {/* total paid row */}
//           <Flex justifyContent="space-between" width="100%" mb={4}>
//             <Text color={'#999'} fontSize="16px" fontWeight="normal">
//               Total Paid:
//             </Text>
//             <Text fontSize="16px" fontWeight="bold">
//               $150.00
//             </Text>
//           </Flex>

//           <Divider my={6} borderColor={useColorModeValue('gray.200', 'gray.600')} />

//           {/* download and close buttons */}
//           <Flex justifyContent="space-between" gap={4} width="100%" mt={4}>
//             <CustomButton flex={1} variantType="primary" size="lg" onClick={() => {}}>
//               Download
//             </CustomButton>
//             <CustomButton flex={1} variantType="primary" size="lg" onClick={onClose}>
//               Close
//             </CustomButton>
//           </Flex>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// };

// export default ConsultantReceipt;
