import { useBlurTarget } from '@/context/BlurTargetContext';
import { cn } from '@/utils/cn';
import DateTimePicker from '@expo/ui/community/datetime-picker';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
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
import { CalendarIcon } from 'react-native-heroicons/outline';
import Animated, {
	interpolateColor,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

interface DatePickerProps {
	label: string;
	value: Date;
	onChange: (date: Date) => void;
	iconBg?: string; // e.g. "bg-simple-orange", "bg-very-yellow"
	disabled?: boolean;
	required?: boolean;
	className?: string;
}

export default function DatePicker({
	label,
	value,
	onChange,
	iconBg = 'bg-primary',
	disabled = false,
	required = false,
	className,
}: DatePickerProps) {
	const [show, setShow] = useState(false);
	const [tempDate, setTempDate] = useState<Date>(value);
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const blurRef = useBlurTarget();

	// Sync tempDate with value when value changes
	useEffect(() => {
		setTempDate(value);
	}, [value]);

	const isHovered = useSharedValue(0);
	const focusShared = useSharedValue(0);

	const triggerHaptic = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
	};

	const handleOpen = () => {
		triggerHaptic();
		focusShared.value = withTiming(1, { duration: 150 });
		setShow(true);
	};

	const handleClose = () => {
		triggerHaptic();
		focusShared.value = withTiming(0, { duration: 150 });
		setShow(false);
	};

	const handleConfirmIos = () => {
		triggerHaptic();
		onChange(tempDate);
		handleClose();
	};

	const normalizePickerDate = (date: Date): Date => {
		const offset = date.getTimezoneOffset();
		if (offset > 0) {
			// West of GMT (e.g. Mexico/Americas). The date returned is in UTC, so we read UTC components.
			return new Date(
				date.getUTCFullYear(),
				date.getUTCMonth(),
				date.getUTCDate(),
				12,
				0,
				0,
				0,
			);
		} else {
			// East of GMT/Zero offset. Local components are correct.
			return new Date(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
				12,
				0,
				0,
				0,
			);
		}
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		if ((Platform.OS as string) === 'android') {
			setShow(false);
			focusShared.value = withTiming(0, { duration: 150 });
			if (selectedDate) {
				const localDate = normalizePickerDate(selectedDate);
				triggerHaptic();
				onChange(localDate);
			}
		} else {
			// On iOS, update tempDate as the user scrolls, but wait for confirmation
			if (selectedDate) {
				const localDate = normalizePickerDate(selectedDate);
				setTempDate(localDate);
			}
		}
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

	// Shared values styling for 3D bounce
	const baseBg = isDark ? '#000000' : '#ffffff';
	const hoverBg = isDark ? '#18181b' : '#f8fafc';
	const focusBg = isDark ? '#1e3a52' : '#f0f9ff';

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

	const displayDateStr = value.toLocaleDateString('es-MX', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});

	return (
		<View className={cn('flex-1 gap-1', className)}>
			<Text className="list-title">
				{label}
				{required && <Text className="text-danger">*</Text>}
			</Text>

			<GestureDetector gesture={gesture}>
				<View className="relative w-full">
					{/* Shadow layer */}
					<Animated.View
						style={animatedShadowStyle}
						className="bg-on-surface absolute inset-0"
					/>

					{/* Container */}
					<Animated.View
						style={animatedStyle}
						className={cn(
							'border-on-surface bg-surface-base flex-row items-center overflow-hidden border-2 pr-3',
							disabled && 'opacity-50',
						)}
					>
						<View
							className={cn(
								'items-center justify-center p-3',
								iconBg,
							)}
						>
							<CalendarIcon color="#000000" size={24} />
						</View>
						<Text className="paragraph-mono-bold text-on-surface flex-1 p-2">
							{displayDateStr}
						</Text>
					</Animated.View>
				</View>
			</GestureDetector>

			{/* Android DatePicker */}
			{show && (Platform.OS as string) === 'android' && (
				<DateTimePicker
					value={value}
					mode="date"
					display="default"
					onValueChange={handleDateChange}
				/>
			)}

			{/* iOS Bottom Sheet DatePicker */}
			{Platform.OS === 'ios' && (
				<Modal
					transparent
					visible={show}
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
							<View className="bg-surface-base border-on-surface w-full rounded-t-4xl border-t-2 p-5 pb-8">
								{/* Header */}
								<View className="mb-6 flex-row items-center justify-between">
									<Text className="page-title">{label}</Text>
									<Pressable
										onPress={handleConfirmIos}
										className="bg-primary border-on-surface border-2 px-4 py-2"
									>
										<Text className="font-mono-bold text-sm text-black uppercase">
											Confirmar
										</Text>
									</Pressable>
								</View>

								{/* Picker */}
								<View className="items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
									<DateTimePicker
										value={tempDate}
										mode="date"
										display="spinner"
										onValueChange={handleDateChange}
										style={{ width: '100%' }}
									/>
								</View>
							</View>
						</Pressable>
					</GestureHandlerRootView>
				</Modal>
			)}
		</View>
	);
}
