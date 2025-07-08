import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import {
    Toast,
    ToastDescription,
    ToastTitle,
    useToast,
} from "@/components/ui/toast";
import { VStack } from '@/components/ui/vstack';
import { triggerHaptic } from '@/utils/haptics';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react-native';
import Animated, {
    FadeInDown,
    FadeInLeft,
    FadeInUp
} from 'react-native-reanimated';
const AnimatedVstack = Animated.createAnimatedComponent(VStack)
const AnimatedIcon = Animated.createAnimatedComponent(Icon)

export const useAwesomeToast = () => {
    const toast = useToast();
    const placement = "top"
    const duration = 4000

    function showSuccessToast(title: string, message?: string) {
        const toastId = Math.random().toString();
        triggerHaptic("success")
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
                        className="rounded-lg"
                        style={{
                            maxWidth: '95%', 
                            alignSelf: 'center',
                        }}
                    >
                        <HStack className="items-center" space='lg'>
                            <AnimatedIcon entering={FadeInLeft.delay(300).duration(400).springify()} className='text-background-0' as={CheckCircle2} size='xl'/>
                            
                            <AnimatedVstack entering={FadeInUp.delay(200).duration(400).springify()} style={{flexShrink: 1}}>
                                <ToastTitle className="font-semibold text-lg">
                                    {title}
                                </ToastTitle>
                                {message && (
                                <ToastDescription className='text-sm'>
                                    {message}
                                </ToastDescription>
                                )}
                            </AnimatedVstack>
                        </HStack>
                    </Toast>
                );
            },
        });
    };

    function showErrorToast(title: string, message?: string) {
        const toastId = Math.random().toString();
        triggerHaptic("error")
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
                        className="rounded-lg"
                        style={{
                            maxWidth: '95%', 
                            alignSelf: 'center',
                        }}
                    >
                        <HStack className="items-center" space='lg'>
                            <AnimatedIcon entering={FadeInLeft.delay(300).duration(400).springify()} className='text-background-0' as={XCircle} size='xl'/>
                            
                            <AnimatedVstack entering={FadeInUp.delay(200).duration(400).springify()} style={{flexShrink: 1}}>
                                <ToastTitle className="font-semibold text-lg">
                                    {title}
                                </ToastTitle>
                                {message && (
                                <ToastDescription className='text-sm'>
                                    {message}
                                </ToastDescription>
                                )}
                            </AnimatedVstack>
                            
                        </HStack>
                    </Toast>
                );
            },
        });
    };

    function showWarningToast(title: string, message?: string) {
        const toastId = Math.random().toString();
        triggerHaptic("warning")
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
                        className="rounded-lg"
                        style={{
                            maxWidth: '95%', 
                            alignSelf: 'center',
                        }}
                    >
                        <HStack className="items-center" space='lg'>
                            <AnimatedIcon entering={FadeInLeft.delay(300).duration(400).springify()} className='text-background-0' as={AlertTriangle} size='xl'/>
                            
                            <AnimatedVstack entering={FadeInUp.delay(200).duration(400).springify()} style={{flexShrink: 1}}>
                                <ToastTitle className="font-semibold text-lg">
                                    {title}
                                </ToastTitle>
                                {message && (
                                <ToastDescription className='text-sm'>
                                    {message}
                                </ToastDescription>
                                )}
                            </AnimatedVstack>
                            
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
                        className="rounded-lg"
                        style={{
                            maxWidth: '95%', 
                            alignSelf: 'center',
                        }}
                    >
                        <HStack className="items-center" space='lg'>
                            <AnimatedIcon entering={FadeInLeft.delay(300).duration(400).springify()} className='text-background-0' as={Info} size='xl'/>
                            
                            <AnimatedVstack entering={FadeInUp.delay(200).duration(400).springify()} style={{flexShrink: 1}}>
                                <ToastTitle className="font-semibold text-lg" >
                                    {title}
                                </ToastTitle>
                                {message && (
                                <ToastDescription className='text-sm'>
                                    {message}
                                </ToastDescription>
                                )}
                            </AnimatedVstack>
                            
                        </HStack>
                    </Toast>
                );
            },
        });
    }


    return { 
        showSuccessToast, 
        showErrorToast, 
        showWarningToast, 
        showInfoToast 
    };
};