import { useBlurTarget } from '@/context/BlurTargetContext';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import {
	Modal,
	Platform,
	Pressable,
	Text,
	useColorScheme,
	View,
} from 'react-native';
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
	runOnJS,
	SlideInDown,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

interface BottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
}

export default function BottomSheet({
	isOpen,
	onClose,
	title,
	children,
}: BottomSheetProps) {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const translateY = useSharedValue(0);
	const blurRef = useBlurTarget();

	const handleClose = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
		onClose();
		translateY.value = 0;
	};

	// Reset drag position on open
	useEffect(() => {
		if (isOpen) {
			translateY.value = 0;
		}
	}, [isOpen]);

	const panGesture = Gesture.Pan()
		.activeOffsetY([0, 10])
		.onUpdate((event) => {
			if (event.translationY > 0) {
				translateY.value = event.translationY;
			}
		})
		.onEnd((event) => {
			if (event.translationY > 100 || event.velocityY > 400) {
				translateY.value = withTiming(
					500,
					{ duration: 200 },
					(finished) => {
						if (finished) {
							runOnJS(handleClose)();
						}
					},
				);
			} else {
				translateY.value = withTiming(0, { duration: 200 });
			}
		});

	const animatedSheetStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	return (
		<Modal
			transparent
			visible={isOpen}
			animationType="fade"
			onRequestClose={handleClose}
		>
			<GestureHandlerRootView className="flex-1">
				<Pressable className="flex-1 justify-end" onPress={handleClose}>
					<BlurView
						intensity={30}
						tint={isDark ? 'dark' : 'light'}
						blurMethod="dimezisBlurViewSdk31Plus"
						blurTarget={
							(Platform.OS as string) === 'android'
								? blurRef
								: undefined
						}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
					/>
					{isOpen && (
						<Animated.View
							entering={SlideInDown.springify()
								.damping(24)
								.mass(0.9)}
							style={animatedSheetStyle}
							className="bg-surface-base max-h-[80%] w-full overflow-hidden rounded-t-4xl"
						>
							<Pressable>
								{/* Draggable header area (Indicator + Title) */}
								<GestureDetector gesture={panGesture}>
									<View className="rounded-t-3xl bg-transparent">
										<View className="items-center py-5">
											<View className="h-1.5 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700" />
										</View>

										{title && (
											<View className="border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
												<Text className="page-title text-center">
													{title}
												</Text>
											</View>
										)}
									</View>
								</GestureDetector>

								{/* Modal Content */}
								<View className="p-5 pb-10">{children}</View>
							</Pressable>
						</Animated.View>
					)}
				</Pressable>
			</GestureHandlerRootView>
		</Modal>
	);
}
