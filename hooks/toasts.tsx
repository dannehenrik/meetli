// import { CheckCircle2, X } from 'lucide-react-native';
// import { Animated, Easing, Pressable, View } from 'react-native';
// import { HStack } from '@/components/ui/hstack';
// import { VStack } from '@/components/ui/vstack';
// import {
//   useToast,
//   Toast,
//   ToastTitle,
//   ToastDescription,
// } from "@/components/ui/toast"
// import { Icon } from '@/components/ui/icon';



// export const useAwesomeToast = () => {
//     const toast = useToast();

//     const showSuccessToast = (message: string, title = 'Success!') => {
//     const toastId = Math.random().toString();
    
//         toast.show({
//             id: toastId,
//             placement: 'top',
//             duration: 4000,
//             render: ({ id }) => {        

//                 return (
//                     <Toast 
//                     nativeID={`toast-${id}`} 
//                     action="success" 
//                     variant="solid"
                    
//                     className="rounded-xl"
//                     >
//                     <HStack className="items-center" space='xl'>
//                         <Icon className='text-background-0' as={CheckCircle2} size='xl'/>
                        
//                         <VStack>
//                         <ToastTitle className="font-semibold text-lg">
//                             {title}
//                         </ToastTitle>
//                         <ToastDescription>
//                             {message}
//                         </ToastDescription>
//                         </VStack>
                        
//                         <Pressable 
//                         onPress={() => toast.close(id)}
//                         className="p-1 rounded-full"
//                         >
//                         <Icon className='text-background-0' as={X} size='lg'/>
//                         </Pressable>
//                     </HStack>
                    
//                     </Toast>
//                 );
//             },
//         });
//     };

//     return { showSuccessToast };
// };



import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
} from "@/components/ui/toast";
import { VStack } from '@/components/ui/vstack';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react-native';

export const useAwesomeToast = () => {
    const toast = useToast();
    const placement = "top"
    const duration = 4000

    function showSuccessToast(title: string, message?: string) {
        const toastId = Math.random().toString();

        toast.show({
            id: toastId,
            placement: placement,
            duration: duration,
            render: ({ id }) => {        
                return (
                    <Toast 
                        nativeID={`toast-${id}`} 
                        action="success" 
                        variant="solid"
                        className="rounded-xl"
                    >
                        <HStack className="items-center" space='lg'>
                            <Icon className='text-background-0' as={CheckCircle2} size='xl'/>
                            
                            <VStack>
                                <ToastTitle className="font-semibold text-lg">
                                    {title}
                                </ToastTitle>
                                {message && (
                                <ToastDescription>
                                    {message}
                                </ToastDescription>
                                )}
                            </VStack>
                        </HStack>
                    </Toast>
                );
            },
        });
    };

    function showErrorToast(title: string, message?: string) {
        const toastId = Math.random().toString();
        
        toast.show({
            id: toastId,
            placement: placement,
            duration: duration,
            render: ({ id }) => {        
                return (
                    <Toast 
                        nativeID={`toast-${id}`} 
                        action="error" 
                        variant="solid"
                        className="rounded-xl"
                    >
                        <HStack className="items-center" space='lg'>
                            <Icon className='text-background-0' as={XCircle} size='xl'/>
                            
                            <VStack>
                                <ToastTitle className="font-semibold text-lg">
                                    {title}
                                </ToastTitle>
                                {message && (
                                <ToastDescription>
                                    {message}
                                </ToastDescription>
                                )}
                            </VStack>
                            
                        </HStack>
                    </Toast>
                );
            },
        });
    };

    function showWarningToast(title: string, message?: string) {
        const toastId = Math.random().toString();
        
        toast.show({
            id: toastId,
            placement: placement,
            duration: duration,
            render: ({ id }) => {        
                return (
                    <Toast 
                        nativeID={`toast-${id}`} 
                        action="warning" 
                        variant="solid"
                        className="rounded-xl"
                    >
                        <HStack className="items-center" space='lg'>
                            <Icon className='text-background-0' as={AlertTriangle} size='xl'/>
                            
                            <VStack>
                                <ToastTitle className="font-semibold text-lg">
                                    {title}
                                </ToastTitle>
                                {message && (
                                <ToastDescription>
                                    {message}
                                </ToastDescription>
                                )}
                            </VStack>
                            
                        </HStack>
                    </Toast>
                );
            },
        });
    };

    function showInfoToast(title: string, message?: string) {
        const toastId = Math.random().toString();
        
        toast.show({
            id: toastId,
            placement: placement,
            duration: duration,
            render: ({ id }) => {        
                return (
                    <Toast 
                        nativeID={`toast-${id}`} 
                        action="info" 
                        variant="solid"
                        className="rounded-xl"
                    >
                        <HStack className="items-center" space='lg'>
                            <Icon className='text-background-0' as={Info} size='xl'/>
                            
                            <VStack>
                                <ToastTitle className="font-semibold text-lg">
                                    {title}
                                </ToastTitle>
                                {message && (
                                <ToastDescription>
                                    {message}
                                </ToastDescription>
                                )}
                            </VStack>
                            
                        </HStack>
                    </Toast>
                );
            },
        });
    };

    return { 
        showSuccessToast, 
        showErrorToast, 
        showWarningToast, 
        showInfoToast 
    };
};