import {
  useToast,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";
import React from "react";
import {
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
  View,
} from "lucide-react-native"; // adjust based on your icon library
import { Icon } from "@/components/ui/icon"


type ToastType = "success" | "error" | "warning" | "info";

interface ShowToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="text-green-500 mr-2 w-5 h-5" />,
  error: <XCircle className="text-red-500 mr-2 w-5 h-5" />,
  warning: <AlertTriangle className="text-yellow-500 mr-2 w-5 h-5" />,
  info: <Info className="text-blue-500 mr-2 w-5 h-5" />,
};

const variantMap: Record<ToastType, "solid" | "outline"> = {
  success: "solid",
  error: "solid",
  warning: "solid",
  info: "outline",
};

const actionMap: Record<ToastType, "success" | "error" | "warning" | "info"> = {
  success: "success",
  error: "error",
  warning: "warning",
  info: "info",
};

function createToastHook(type: ToastType) {
  return function useTypedToast() {
    const toast = useToast();
    function ErrorIcon() {
      return <Icon as={XCircle} size="md" />

    }

    const showToast = ({
      title,
      description,
      duration = 3000,
    }: ShowToastOptions) => {
      const id = Math.random().toString();

      toast.show({
        id,
        placement: "top",
        duration,
        render: () => {
          const Icon = iconMap[type];

         return (
  <Toast
    nativeID={`toast-${id}`}
    variant={variantMap[type]}
    action={actionMap[type]}
  >
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12 }}>
      <View style={{ paddingTop: 4 }}>{Icon}</View>
      <View>
        <ToastTitle>{title}</ToastTitle>
        {description && (
          <ToastDescription>{description}</ToastDescription>
        )}
      </View>
    </View>
  </Toast>
);
        },
      });
    };

    return { showToast };
  };
}

// Export hooks per type
export const useSuccessToast = createToastHook("success");
export const useErrorToast = createToastHook("error");
export const useWarningToast = createToastHook("warning");
export const useInfoToast = createToastHook("info");
