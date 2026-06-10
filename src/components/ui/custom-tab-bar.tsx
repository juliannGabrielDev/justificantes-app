import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, View, useColorScheme } from 'react-native';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';

interface TabItemProps {
	label: string;
	isFocused: boolean;
	onPress: () => void;
	onLongPress: () => void;
	color: string;
	Icon: React.ComponentType<{ size: number; color: string }>;
}

export function TabItem({
	label,
	isFocused,
	onPress,
	onLongPress,
	color,
	Icon,
}: TabItemProps) {
	const activeProgress = useSharedValue(0);

	const colorScheme = useColorScheme();
	const inactiveIconColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

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
							entering={FadeIn.duration(120)}
							exiting={FadeOut.duration(80)}
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

export interface TabConfig {
	label: string;
	color: string;
	Icon: React.ComponentType<{ size: number; color: string }>;
}

interface CustomTabBarProps {
	state: any;
	navigation: any;
	config: Record<string, TabConfig>;
}

export default function CustomTabBar({
	state,
	navigation,
	config,
}: CustomTabBarProps) {
	return (
		<View
			className="absolute right-0 bottom-8 left-0 items-center justify-center"
			pointerEvents="box-none"
		>
			<View className="relative">
				{/* shadow */}
				<Animated.View
					layout={LinearTransition.duration(120)}
					className="bg-on-surface absolute inset-0 translate-x-1 translate-y-1 rounded-full"
				/>

				{/* bar container */}
				<Animated.View
					layout={LinearTransition.duration(120)}
					className="bg-surface-base border-on-surface flex-row items-center gap-4 rounded-full border-2 px-6 py-1"
				>
					{state.routes.map((route: any, index: number) => {
						const isFocused = state.index === index;

						const onPress = () => {
							const event = navigation.emit({
								type: 'tabPress',
								target: route.key,
								canPreventDefault: true,
							});

							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Light,
							).catch(() => {});

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

						const tabConfig = config[route.name];
						if (!tabConfig) return null;

						return (
							<TabItem
								key={route.key}
								label={tabConfig.label}
								isFocused={isFocused}
								onPress={onPress}
								onLongPress={onLongPress}
								color={tabConfig.color}
								Icon={tabConfig.Icon}
							/>
						);
					})}
				</Animated.View>
			</View>
		</View>
	);
}
