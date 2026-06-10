import { useBlurTarget } from '@/context/BlurTargetContext';
import { cn } from '@/utils/cn';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
	Modal,
	Platform,
	Pressable,
	ScrollView,
	Text,
	useColorScheme,
	View,
} from 'react-native';
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { ChevronDownIcon } from 'react-native-heroicons/outline';
import Animated, {
	interpolateColor,
	runOnJS,
	SharedValue,
	SlideInDown,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

interface SelectContextValue {
	value: any;
	onValueChange?: (value: any) => void;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	disabled?: boolean;
	placeholder?: string;
	setPlaceholder: (placeholder: string) => void;
	optionsMap: Record<string, string>;
	registerOption: (value: any, label: string) => void;
	unregisterOption: (value: any) => void;
	isFocused: boolean;
	setIsFocused: (focused: boolean) => void;
	isHovered: SharedValue<number>;
	focusShared: SharedValue<number>;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
	const context = useContext(SelectContext);
	if (!context) {
		throw new Error(
			'Select compound components must be used within a Select provider',
		);
	}
	return context;
}

export function SelectLabel({
	children,
	required = false,
	className,
}: {
	children: React.ReactNode;
	required?: boolean;
	className?: string;
}) {
	const { disabled } = useSelectContext();
	return (
		<Text className={cn('list-title', disabled && 'opacity-60', className)}>
			{children}
			{required && <Text className="text-danger">*</Text>}
		</Text>
	);
}

export function SelectTrigger({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { isHovered, focusShared, disabled, setIsOpen, setIsFocused } =
		useSelectContext();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	const baseBg = isDark ? '#000000' : '#ffffff';
	const hoverBg = isDark ? '#18181b' : '#f8fafc';
	const focusBg = isDark ? '#1e3a52' : '#f0f9ff';

	const handleOpen = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setIsFocused(true);
		setIsOpen(true);
	};

	const hoverGesture = Gesture.Hover()
		.enabled(!disabled)
		.onBegin(() => {
			isHovered.value = withTiming(1, { duration: 150 });
		})
		.onEnd(() => {
			isHovered.value = withTiming(0, { duration: 150 });
		});

	const tapGesture = Gesture.Tap()
		.enabled(!disabled)
		.onEnd(() => {
			runOnJS(handleOpen)();
		});

	const gesture = Gesture.Exclusive(tapGesture, hoverGesture);

	const animatedStyle = useAnimatedStyle(() => {
		const scale = 1 + focusShared.value * 0.01 + isHovered.value * 0.005;
		const progress = focusShared.value;
		const hoverProgress = isHovered.value;

		const activeColor = interpolateColor(
			progress,
			[0, 1],
			[
				interpolateColor(hoverProgress, [0, 1], [baseBg, hoverBg]),
				focusBg,
			],
		);

		const translateY = -1 * progress * hoverProgress;
		const translateX = -1 * progress * hoverProgress;

		return {
			transform: [{ scale }, { translateY }, { translateX }],
			backgroundColor: activeColor,
		};
	});

	const animatedShadowStyle = useAnimatedStyle(() => {
		const progress = focusShared.value;
		const hoverProgress = isHovered.value;
		const active = Math.max(progress, hoverProgress);

		const translateX = 4 * active;
		const translateY = 4 * active;

		return {
			transform: [{ translateX }, { translateY }],
			opacity: active,
		};
	});

	const iconColor = isDark ? '#ffffff' : '#000000';

	return (
		<GestureDetector gesture={gesture}>
			<View className="relative w-full">
				<Animated.View
					style={animatedShadowStyle}
					className="bg-on-surface absolute inset-0"
				/>

				<Animated.View
					style={animatedStyle}
					className={cn(
						'border-on-surface bg-surface-base flex-row items-center gap-2 border-2 px-4 py-3',
						disabled && 'opacity-50',
						className,
					)}
				>
					<View className="flex-1 flex-row items-center gap-2">
						{children}
					</View>
					<ChevronDownIcon size={20} color={iconColor} />
				</Animated.View>
			</View>
		</GestureDetector>
	);
}

export function SelectIcon({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { focusShared } = useSelectContext();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const iconColor = isDark ? '#ffffff' : '#000000';

	const renderedChildren = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			const childColor = (child.props as any).color;
			return React.cloneElement(child, {
				color:
					!childColor ||
					childColor === '#000' ||
					childColor === '#000000'
						? iconColor
						: childColor,
			} as any);
		}
		return child;
	});

	const animatedStyle = useAnimatedStyle(() => {
		const scale = 1 + focusShared.value * 0.1;
		return {
			transform: [{ scale }],
		};
	});

	return (
		<Animated.View
			style={animatedStyle}
			className={cn('items-center justify-center', className)}
		>
			{renderedChildren}
		</Animated.View>
	);
}

export function SelectValue({
	placeholder = 'Seleccione una opción',
	className,
}: {
	placeholder?: string;
	className?: string;
}) {
	const { value, optionsMap, setPlaceholder } = useSelectContext();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	useEffect(() => {
		setPlaceholder(placeholder);
	}, [placeholder]);

	const selectedLabel =
		value !== undefined && value !== null && optionsMap[String(value)];
	const displayValue = selectedLabel || placeholder;
	const isPlaceholder = !selectedLabel;

	return (
		<Text
			className={cn(
				'text-on-surface flex-1 font-mono text-base',
				isPlaceholder && (isDark ? 'text-zinc-400' : 'text-zinc-600'),
				className,
			)}
		>
			{displayValue}
		</Text>
	);
}

export function SelectOption({
	value,
	children,
	className,
}: {
	value: any;
	children: string;
	className?: string;
}) {
	const {
		value: selectedValue,
		onValueChange,
		setIsOpen,
		registerOption,
		unregisterOption,
	} = useSelectContext();

	useEffect(() => {
		registerOption(value, children);
		return () => {
			unregisterOption(value);
		};
	}, [value, children]);

	const isSelected = String(selectedValue) === String(value);

	return (
		<Pressable
			onPress={() => {
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Success,
				);
				if (onValueChange) {
					onValueChange(value);
				}
				setIsOpen(false);
			}}
			className={cn(
				'border-b border-zinc-200 px-5 py-4 dark:border-zinc-800',
				isSelected && 'bg-gray-100 dark:bg-zinc-900',
				className,
			)}
			style={({ pressed }) => ({
				opacity: pressed ? 0.7 : 1,
			})}
		>
			<Text
				className={cn(
					'font-mono text-base text-zinc-900 dark:text-zinc-100',
					isSelected && 'text-on-surface font-mono-bold',
				)}
			>
				{children}
			</Text>
		</Pressable>
	);
}

export function SelectOptions({
	children,
	title,
}: {
	children: React.ReactNode;
	title?: string;
}) {
	const { isOpen, setIsOpen } = useSelectContext();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const translateY = useSharedValue(0);
	const blurRef = useBlurTarget();

	const handleClose = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setIsOpen(false);
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
		<>
			{/* Offscreen container to pre-register options in the context dynamically */}
			<View style={{ display: 'none' }}>{children}</View>

			<Modal
				transparent
				visible={isOpen}
				animationType="fade"
				onRequestClose={handleClose}
			>
				<GestureHandlerRootView className="flex-1">
					<Pressable
						className="flex-1 justify-end"
						onPress={handleClose}
					>
						<BlurView
							intensity={30}
							tint={isDark ? 'dark' : 'light'}
							blurMethod="dimezisBlurViewSdk31Plus"
							blurTarget={
								Platform.OS === 'android' ? blurRef : undefined
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
								className="bg-surface-base max-h-[70%] w-full rounded-t-4xl"
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

									<ScrollView bounces={false}>
										{children}
									</ScrollView>
								</Pressable>
							</Animated.View>
						)}
					</Pressable>
				</GestureHandlerRootView>
			</Modal>
		</>
	);
}

export function SelectHelperText({
	children,
	className,
	isError = false,
}: {
	children: React.ReactNode;
	className?: string;
	isError?: boolean;
}) {
	const { disabled } = useSelectContext();
	return (
		<Text
			className={cn(
				'font-sans text-xs',
				isError ? 'text-danger' : 'text-muted',
				disabled && 'opacity-60',
				className,
			)}
		>
			{children}
		</Text>
	);
}

export function SelectError({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	if (!children) return null;
	return (
		<SelectHelperText isError={true} className={className}>
			{children}
		</SelectHelperText>
	);
}

interface SelectRootProps {
	children: React.ReactNode;
	value: any;
	onValueChange?: (value: any) => void;
	disabled?: boolean;
	className?: string;
}

function SelectRoot({
	children,
	value,
	onValueChange,
	disabled = false,
	className,
}: SelectRootProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isFocused, setIsFocusedState] = useState(false);
	const [placeholder, setPlaceholderState] = useState(
		'Seleccione una opción',
	);
	const [optionsMap, setOptionsMap] = useState<Record<string, string>>({});

	const isHovered = useSharedValue(0);
	const focusShared = useSharedValue(0);

	const setIsFocused = (focused: boolean) => {
		setIsFocusedState(focused);
		focusShared.value = withTiming(focused ? 1 : 0, { duration: 150 });
	};

	// Reset focus state automatically when closed
	useEffect(() => {
		if (!isOpen) {
			setIsFocused(false);
		}
	}, [isOpen]);

	const registerOption = (val: any, label: string) => {
		setOptionsMap((prev) => ({
			...prev,
			[String(val)]: label,
		}));
	};

	const unregisterOption = (val: any) => {
		// Keep option in registry to prevent unselected unmount clearing label cache
	};

	return (
		<SelectContext.Provider
			value={{
				value,
				onValueChange,
				isOpen,
				setIsOpen,
				disabled,
				placeholder,
				setPlaceholder: setPlaceholderState,
				optionsMap,
				registerOption,
				unregisterOption,
				isFocused,
				setIsFocused,
				isHovered,
				focusShared,
			}}
		>
			<View className={cn('w-full gap-2', className)}>{children}</View>
		</SelectContext.Provider>
	);
}

const Select = Object.assign(SelectRoot, {
	Label: SelectLabel,
	Trigger: SelectTrigger,
	Icon: SelectIcon,
	Value: SelectValue,
	Options: SelectOptions,
	Option: SelectOption,
	HelperText: SelectHelperText,
	Error: SelectError,
});

export default Select;
