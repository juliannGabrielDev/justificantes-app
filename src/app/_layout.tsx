import '@/global.css';
import { Geist_400Regular, Geist_700Bold } from '@expo-google-fonts/geist';
import {
	GeistMono_400Regular,
	GeistMono_500Medium,
	GeistMono_600SemiBold,
	GeistMono_700Bold,
} from '@expo-google-fonts/geist-mono';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { useFonts } from 'expo-font';
import {
	DarkTheme,
	DefaultTheme,
	SplashScreen,
	Stack,
	ThemeProvider,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

SplashScreen.preventAutoHideAsync();

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AlertProvider } from '@/context/AlertContext';
import { BlurTargetProvider, useBlurTarget } from '@/context/BlurTargetContext';
import { BlurTargetView } from 'expo-blur';

const MyDefaultTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: '#f3f3ed',
	},
};

const MyDarkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		background: '#131313',
	},
};

function RootLayoutContent() {
	const colorScheme = useColorScheme();
	const blurRef = useBlurTarget();

	return (
		<BlurTargetView ref={blurRef} style={{ flex: 1 }}>
			<ThemeProvider
				value={colorScheme === 'dark' ? MyDarkTheme : MyDefaultTheme}
			>
				<Stack screenOptions={{ headerShown: false }} />
				<StatusBar
					style={colorScheme === 'dark' ? 'light' : 'dark'}
					animated
				/>
			</ThemeProvider>
		</BlurTargetView>
	);
}

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [fontsLoaded, error] = useFonts({
		'Geist-Regular': Geist_400Regular,
		'Geist-Bold': Geist_700Bold,
		'Geist-Mono': GeistMono_400Regular,
		'Geist-Mono-Medium': GeistMono_500Medium,
		'Geist-Mono-SemiBold': GeistMono_600SemiBold,
		'Geist-Mono-Bold': GeistMono_700Bold,
		Pacifico: Pacifico_400Regular,
	});

	useEffect(() => {
		if (error) throw error;

		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, error]);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BlurTargetProvider>
				<AlertProvider>
					<RootLayoutContent />
				</AlertProvider>
			</BlurTargetProvider>
		</GestureHandlerRootView>
	);
}
