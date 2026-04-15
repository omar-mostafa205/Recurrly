import splashPattern from "@/constants/images";
import { styled } from "nativewind";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';

const SafeAreaView = styled(RNSafeAreaView);
const Onboarding = () => {
    return (
        <SafeAreaView className="flex-1 bg-accent">

            <View className="w-full h-[65%]">
                <Image
                    source={splashPattern}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            </View>
            <View className="flex-1 items-center justify-center px-6 gap-4">

                <Text className="text-[37px] font-sans-bold text-white text-center">
                    Gain Financial Clarity
                </Text>

                <Text className="text-2xl font-sans text-white text-center">
                    Track, analyze and cancel with ease
                </Text>

                <Pressable className="bg-white w-full py-4 rounded-full items-center">
                    <Text className="text-black font-sans-semibold text-lg">
                        Get Started
                    </Text>
                </Pressable>

            </View>
        </SafeAreaView>
    );
};

export default Onboarding;