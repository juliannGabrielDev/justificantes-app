import TopAppBar from '@/components/ui/top-app-bar';
import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, View, useColorScheme } from 'react-native';
import {
	ArrowUpTrayIcon,
	ClipboardDocumentListIcon,
	HomeIcon,
} from 'react-native-heroicons/outline';
import Animated, {
	FadeInLeft,
	FadeOutRight,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';

const TABS_COLORS = {
	green: '#0ac26a', // --color-primary
	blue: '#1086fb', // --color-simple-blue
	pink: '#f27eff', // --color-not-pink
};

interface TabItemProps {
	label: string;
	isFocused: boolean;
	onPress: () => void;
	onLongPress: () => void;
	color: string;
	Icon: React.ComponentType<{ size: number; color: string }>;
}

function TabItem({
	label,
	isFocused,
	onPress,
	onLongPress,
	color,
	Icon,
}: TabItemProps) {
	const activeProgress = useSharedValue(0);
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const inactiveIconColor = isDark ? '#ffffff' : '#000000';

	useEffect(() => {
		// Speed tuned spring physics for snappy, instant response
		activeProgress.value = withSpring(isFocused ? 1 : 0, {
			damping: 20,
			stiffness: 300,
			mass: 0.5,
		});
	}, [isFocused, activeProgress]);

	const containerStyle = useAnimatedStyle(() => {
		const paddingHorizontal = 12 + activeProgress.value * 6;

		// Delivers a micro scale bounce on active focus transition
		const scale = 1 + activeProgress.value * 0.04;

		return {
			paddingHorizontal,
			transform: [{ scale }],
		};
	});

	const pillStyle = useAnimatedStyle(() => {
		return {
			backgroundColor: color,
			opacity: activeProgress.value,
			transform: [
				{ scaleX: activeProgress.value },
				{ scaleY: activeProgress.value },
			],
		};
	});

	// Cross-fade animations for the icons to blend color smoothly on the UI thread
	const activeIconStyle = useAnimatedStyle(() => ({
		opacity: activeProgress.value,
		transform: [{ scale: activeProgress.value }],
	}));

	const inactiveIconStyle = useAnimatedStyle(() => ({
		opacity: 1 - activeProgress.value,
		transform: [{ scale: 1 - activeProgress.value * 0.1 }],
	}));

	return (
		<Pressable
			onPress={onPress}
			onLongPress={onLongPress}
			accessibilityRole="button"
			accessibilityState={isFocused ? { selected: true } : {}}
			className="rounded-full py-1.5"
		>
			<Animated.View
				layout={LinearTransition.duration(120)}
				style={containerStyle}
				className="relative flex-row items-center gap-2 overflow-hidden rounded-full py-2"
			>
				{/* Active Pill Background scaling from center */}
				<Animated.View
					style={pillStyle}
					className="absolute inset-0 rounded-full"
				/>

				{/* Content layer above the background */}
				<View className="z-10 flex-row items-center gap-2">
					{/* Cross-fading icon wrapper */}
					<View className="relative h-5.5 w-5.5 items-center justify-center">
						<Animated.View
							style={inactiveIconStyle}
							className="absolute"
						>
							<Icon size={20} color={inactiveIconColor} />
						</Animated.View>
						<Animated.View
							style={activeIconStyle}
							className="absolute"
						>
							<Icon size={20} color="#000000" />
						</Animated.View>
					</View>

					{isFocused && (
						<Animated.Text
							entering={FadeInLeft.duration(100)}
							exiting={FadeOutRight.duration(80)}
							className="font-mono-semibold mr-1 text-xs tracking-wider text-black uppercase"
						>
							{label}
						</Animated.Text>
					)}
				</View>
			</Animated.View>
		</Pressable>
	);
}

function CustomTabBar({ state, navigation }: any) {
	return (
		<View className="absolute right-6 bottom-6 left-6">
			{/* shadow */}
			<View className="bg-on-surface absolute inset-0 translate-x-1 translate-y-1 rounded-full" />

			{/* bar container */}
			<View className="bg-surface-base border-on-surface flex-row items-center justify-around overflow-hidden rounded-full border-2 px-3 py-2">
				{state.routes.map((route: any, index: number) => {
					const isFocused = state.index === index;

					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
						});

						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name, route.params);
						}
					};

					const onLongPress = () => {
						navigation.emit({
							type: 'tabLongPress',
							target: route.key,
						});
					};

					// map
					let label = 'Inicio';
					let color = TABS_COLORS.green;
					let Icon = HomeIcon;

					if (route.name === 'upload') {
						label = 'Subir';
						color = TABS_COLORS.blue;
						Icon = ArrowUpTrayIcon;
					} else if (route.name === 'history') {
						label = 'Historial';
						color = TABS_COLORS.pink;
						Icon = ClipboardDocumentListIcon;
					}

					return (
						<TabItem
							key={route.key}
							label={label}
							isFocused={isFocused}
							onPress={onPress}
							onLongPress={onLongPress}
							color={color}
							Icon={Icon}
						/>
					);
				})}
			</View>
		</View>
	);
}

export default function StudentTabsLayout() {
	return (
		<>
			<TopAppBar />
			<Tabs
				tabBar={(props) => <CustomTabBar {...props} />}
				screenOptions={{
					headerShown: false,
				}}
			/>
		</>
	);
}
