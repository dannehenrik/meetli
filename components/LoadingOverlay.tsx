import { Modal, ModalBackdrop, ModalContent, ModalBody } from "./ui/modal";
import { Box } from "./ui/box";
import { Spinner } from "./ui/spinner";
import { Text } from "./ui/text";

export const LoadingOverlay = ({ 
  isLoading, 
  message = "Loading..." 
}: { 
  isLoading: boolean; 
  message?: string 
}) => {
  if (!isLoading) return null;

  return (
    <Modal isOpen={isLoading} closeOnOverlayClick={false}>
      <ModalBackdrop />
      <ModalContent>
        <ModalBody>
          <Box className="flex items-center justify-center p-6 gap-4">
            <Spinner size="large" />
            <Text className="text-lg">{message}</Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};