import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'src/controller/hooks';
import { cancelPaymentRequestThunk } from 'src/controller/payment-list/cancelPaymentRequestThunk';
import { setShowCancelModal } from 'src/controller/payment-list/paymentListSlice';
import { actionNames, processKeys, updateProcessStatus } from 'src/controller/process/processSlice';

export default function CancelModal() {
  const dispatch = useAppDispatch();
  const { showCancelModal, selectedPaymentRequest } = useAppSelector(state => state.paymentList);
  const { cancel } = useAppSelector(state => state.process);

  const handleClose = useCallback(() => {
    dispatch(setShowCancelModal(false));
  }, []);

  const handleCancelPaymentRequest = useCallback(() => {

    dispatch(updateProcessStatus({
      actionName: actionNames.cancel,
      att: processKeys.processing,
      value: true
    }))
    dispatch(cancelPaymentRequestThunk())

  }, [])

  return (
    <Modal isOpen={showCancelModal} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Do you want to cancel this Payment Request?</Text>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup gap={4}>
            <Button isLoading={cancel.processing} variant='outline' onClick={() => handleCancelPaymentRequest()} colorScheme={"purple"}>Cancel</Button>
            <Button variant={"outline"} colorScheme='blue' mr={3} onClick={handleClose}>
              Close
            </Button>
          </ButtonGroup>


        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}