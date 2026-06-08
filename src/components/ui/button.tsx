import { cn } from '@/utils/cn';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { createContext, useContext } from 'react';
import { Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
	cancelAnimation,
	Easing,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';

const triggerHaptic = () => {
	Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
};

export type BaseVariant =
	| 'primary'
	| 'very-yellow'
	| 'simple-blue'
	| 'simple-orange'
	| 'not-pink'
	| 'nothing';

export type SuperVariant = `super-${BaseVariant}`;

export type ButtonVariant = BaseVariant | SuperVariant;

const variantStyles: Record<BaseVariant, string> = {
	primary: 'bg-primary',
	'very-yellow': 'bg-very-yellow',
	'simple-blue': 'bg-simple-blue',
	'simple-orange': 'bg-simple-orange',
	'not-pink': 'bg-not-pink',
	nothing: 'bg-white border-2 border-black',
};

interface ButtonContextValue {
	disabled?: boolean;
}

const ButtonContext = createContext<ButtonContextValue>({ disabled: false });

function ButtonRoot({
	onPress,
	children,
	className,
	variant = 'primary',
	disabled = false,
}: {
	onPress?: () => void;
	variant?: ButtonVariant;
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
}) {
	const isSuper = variant.startsWith('super-');
	const baseVariant = (
		isSuper ? variant.replace('super-', '') : variant
	) as BaseVariant;
	const paddingStyles = isSuper ? 'px-6 py-4' : 'px-3 py-2';
	const bgStyles = variantStyles[baseVariant] || 'bg-primary';

	const opacity = useSharedValue(1);
	const scale = useSharedValue(1);
	const isHovered = useSharedValue(0);

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
		.onBegin(() => {
			// Trigger light tactile feedback on press down
			runOnJS(triggerHaptic)();

			// Light, simple timing transition for press effect
			opacity.value = withTiming(0.8, { duration: 100 });
			scale.value = withTiming(0.95, { duration: 100 });
		})
		.onFinalize((event, success) => {
			// Reset animations
			opacity.value = withTiming(1, { duration: 100 });
			scale.value = withTiming(1, { duration: 100 });

			if (success && onPress) {
				runOnJS(onPress)();
			}
		});

	const gesture = Gesture.Exclusive(tapGesture, hoverGesture);

	const animatedStyle = useAnimatedStyle(() => {
		// Scales up by 3% and lifts up by 2px on hover, presses down on tap
		const hoverScale = 1 + isHovered.value * 0.03;
		const finalScale = scale.value * hoverScale;
		const translateY = -2 * isHovered.value;

		return {
			opacity: opacity.value,
			transform: [{ scale: finalScale }, { translateY }],
		};
	});

	return (
		<ButtonContext.Provider value={{ disabled }}>
			<GestureDetector gesture={gesture}>
				<Animated.View
					style={animatedStyle}
					className={cn(
						'flex-row items-center justify-center gap-2',
						bgStyles,
						paddingStyles,
						disabled && 'opacity-50',
						className,
					)}
				>
					{children}
				</Animated.View>
			</GestureDetector>
		</ButtonContext.Provider>
	);
}

function ButtonText({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { disabled } = useContext(ButtonContext);
	return (
		<Text
			className={cn(
				'font-mono-semibold text-[16px] text-black uppercase',
				disabled && 'opacity-60',
				className,
			)}
		>
			{children}
		</Text>
	);
}

function ButtonIcon({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const renderedChildren = React.Children.map(children, (child) => {
		if (React.isValidElement(child)) {
			// Force/default child color to black if not already specified
			return React.cloneElement(child, {
				color: (child.props as any).color || '#000000',
			} as any);
		}
		return child;
	});

	return (
		<View className={cn('items-center justify-center', className)}>
			{renderedChildren}
		</View>
	);
}

function ButtonLoader({
	percentage,
	className,
}: {
	percentage?: number;
	className?: string;
}) {
	const rotation = useSharedValue(0);

	React.useEffect(() => {
		rotation.value = withRepeat(
			withTiming(360, {
				duration: 1200,
				easing: Easing.linear,
			}),
			-1,
			false,
		);
		return () => {
			cancelAnimation(rotation);
		};
	}, []);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value}deg` }],
		};
	});

	return (
		<View
			className={cn(
				'flex-row items-center justify-center gap-2',
				className,
			)}
		>
			<Animated.View style={animatedStyle}>
				<Image
					source={require('../../assets/sided-cookie-7.svg')}
					style={{ width: 20, height: 20 }}
					tintColor="#000000"
				/>
			</Animated.View>
			{percentage !== undefined && percentage > 0 && (
				<Text className="font-mono-semibold text-[14px] text-black">
					{Math.round(percentage)}%
				</Text>
			)}
		</View>
	);
}

const Button = Object.assign(ButtonRoot, {
	Text: ButtonText,
	Icon: ButtonIcon,
	Loader: ButtonLoader,
});

export default Button;
