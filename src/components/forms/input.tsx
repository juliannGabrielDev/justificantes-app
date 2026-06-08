import { cn } from '@/utils/cn';
import React, { createContext, useContext, useRef, useState } from 'react';
import {
	Pressable,
	Text,
	TextInput,
	TextInputProps,
	useColorScheme,
	View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
	EyeIcon,
	EyeSlashIcon,
	IdentificationIcon,
} from 'react-native-heroicons/outline';
import Animated, {
	interpolateColor,
	runOnJS,
	SharedValue,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';

// Context to share interactive states among compound subcomponents
interface InputContextValue {
	isFocused: boolean;
	setIsFocused: (focused: boolean) => void;
	isHovered: SharedValue<number>;
	focusShared: SharedValue<number>;
	disabled?: boolean;
	focusInput: () => void;
	registerInputRef: (ref: TextInput | null) => void;
}

const InputContext = createContext<InputContextValue | null>(null);

function useInputContext() {
	const context = useContext(InputContext);
	if (!context) {
		throw new Error(
			'Input compound components must be used within an Input provider',
		);
	}
	return context;
}

export interface InputFieldProps extends Omit<TextInputProps, 'editable'> {
	className?: string;
}

export function InputLabel({
	children,
	required = false,
	className,
}: {
	children: React.ReactNode;
	required?: boolean;
	className?: string;
}) {
	const { disabled } = useInputContext();
	return (
		<Text className={cn('list-title', disabled && 'opacity-60', className)}>
			{children}
			{required && <Text className="text-danger">*</Text>}
		</Text>
	);
}

export function InputContainer({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { isHovered, focusShared, disabled, focusInput } = useInputContext();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	const baseBg = isDark ? '#000000' : '#ffffff';
	const hoverBg = isDark ? '#18181b' : '#f8fafc';
	const focusBg = isDark ? '#1e3a52' : '#f0f9ff';

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
			runOnJS(focusInput)();
		});

	const gesture = Gesture.Exclusive(tapGesture, hoverGesture);

	const animatedStyle = useAnimatedStyle(() => {
		// Scale on focus and hover for premium micro-interaction
		const scale = 1 + focusShared.value * 0.01 + isHovered.value * 0.005;

		// Smooth transition of background: base -> hover -> focus
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

		// Neo-brutalist pop translation: shift up/left to reveal the solid shadow
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

		// The shadow shifts and fades in only when focused or hovered, ensuring no double borders at rest
		const translateX = 4 * active;
		const translateY = 4 * active;

		return {
			transform: [{ translateX }, { translateY }],
			opacity: active,
		};
	});

	return (
		<GestureDetector gesture={gesture}>
			<View className="relative w-full">
				{/* Solid shadow layer (neo-brutalist pop background, now only visible on hover/focus and no double border) */}
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
					{children}
				</Animated.View>
			</View>
		</GestureDetector>
	);
}

export function InputIcon({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { focusShared } = useInputContext();
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
		// Pulse/scale the icon slightly when focused
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

export function InputField({ className, ...props }: InputFieldProps) {
	const { setIsFocused, disabled, registerInputRef } = useInputContext();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	return (
		<TextInput
			ref={registerInputRef}
			editable={!disabled}
			onFocus={(e) => {
				setIsFocused(true);
				if (props.onFocus) {
					props.onFocus(e);
				}
			}}
			onBlur={(e) => {
				setIsFocused(false);
				if (props.onBlur) {
					props.onBlur(e);
				}
			}}
			className={cn(
				'text-on-surface flex-1 p-0 font-mono text-base',
				className,
			)}
			placeholderTextColor={isDark ? '#e0e0e0ff' : '#3f3f46'}
			{...props}
		/>
	);
}

export function InputPassword({ className, ...props }: InputFieldProps) {
	const { setIsFocused, disabled, registerInputRef } = useInputContext();
	const [secure, setSecure] = useState(true);
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const iconColor = isDark ? '#ffffff' : '#000000';

	return (
		<>
			<TextInput
				ref={registerInputRef}
				secureTextEntry={secure}
				editable={!disabled}
				onFocus={(e) => {
					setIsFocused(true);
					if (props.onFocus) {
						props.onFocus(e);
					}
				}}
				onBlur={(e) => {
					setIsFocused(false);
					if (props.onBlur) {
						props.onBlur(e);
					}
				}}
				className={cn(
					'text-on-surface flex-1 p-0 font-mono text-base',
					className,
				)}
				placeholderTextColor={isDark ? '#e0e0e0ff' : '#3f3f46'}
				{...props}
			/>
			<Pressable
				onPress={() => setSecure(!secure)}
				className="justify-center pr-1 pl-2"
			>
				{secure ? (
					<EyeIcon size={20} color={iconColor} />
				) : (
					<EyeSlashIcon size={20} color={iconColor} />
				)}
			</Pressable>
		</>
	);
}

export function InputHelperText({
	children,
	className,
	isError = false,
}: {
	children: React.ReactNode;
	className?: string;
	isError?: boolean;
}) {
	const { disabled } = useInputContext();
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

interface InputRootProps extends Omit<InputFieldProps, 'children'> {
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	label?: string;
	helperText?: string | null;
	icon?: React.ReactNode;
	required?: boolean;
}

function InputRoot({
	children,
	className,
	disabled = false,
	label,
	helperText,
	icon,
	required,
	...props
}: InputRootProps) {
	const [isFocused, setIsFocusedState] = useState(false);
	const isHovered = useSharedValue(0);
	const focusShared = useSharedValue(0);
	const inputRef = useRef<TextInput | null>(null);

	const setIsFocused = (focused: boolean) => {
		setIsFocusedState(focused);
		focusShared.value = withTiming(focused ? 1 : 0, { duration: 150 });
	};

	const focusInput = () => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	};

	const registerInputRef = (ref: TextInput | null) => {
		inputRef.current = ref;
	};

	// If children are supplied, act purely as context provider
	if (children) {
		return (
			<InputContext.Provider
				value={{
					isFocused,
					setIsFocused,
					isHovered,
					focusShared,
					disabled,
					focusInput,
					registerInputRef,
				}}
			>
				<View className={cn('w-full gap-2', className)}>
					{children}
				</View>
			</InputContext.Provider>
		);
	}

	// Fallback default layout if used as <Input /> directly (backward-compatible)
	return (
		<InputContext.Provider
			value={{
				isFocused,
				setIsFocused,
				isHovered,
				focusShared,
				disabled,
				focusInput,
				registerInputRef,
			}}
		>
			<View className={cn('w-full gap-2', className)}>
				<InputLabel required={required ?? true}>
					{label ?? 'Código de Estudiante'}
				</InputLabel>
				<InputContainer>
					<InputIcon>
						{icon ?? <IdentificationIcon size={28} color="#000" />}
					</InputIcon>
					<InputField {...props} />
				</InputContainer>
				{helperText !== null && (
					<InputHelperText>
						{helperText ??
							'¿Es tu primera vez aquí? Debes registrarte primero para acceder.'}
					</InputHelperText>
				)}
			</View>
		</InputContext.Provider>
	);
}

const Input = Object.assign(InputRoot, {
	Label: InputLabel,
	Container: InputContainer,
	Icon: InputIcon,
	Field: InputField,
	Password: InputPassword,
	HelperText: InputHelperText,
});

export default Input;
