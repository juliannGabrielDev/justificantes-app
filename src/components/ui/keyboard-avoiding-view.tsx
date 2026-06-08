import React, { useEffect, useState } from 'react';
import {
	Keyboard,
	KeyboardAvoidingView as RNKeyboardAvoidingView,
	KeyboardAvoidingViewProps,
	Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function KeyboardAvoidingView({
	style,
	keyboardVerticalOffset,
	behavior,
	...props
}: KeyboardAvoidingViewProps) {
	const insets = useSafeAreaInsets();
	const [keyboardVisible, setKeyboardVisible] = useState(false);

	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
			setKeyboardVisible(true);
		});
		const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
			setKeyboardVisible(false);
		});
		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, []);

	const defaultBehavior =
		behavior ??
		(Platform.OS === 'ios'
			? 'padding'
			: keyboardVisible
				? 'height'
				: undefined);

	const defaultOffset =
		keyboardVerticalOffset ?? (Platform.OS === 'ios' ? insets.top : 0);

	return (
		<RNKeyboardAvoidingView
			behavior={defaultBehavior}
			keyboardVerticalOffset={defaultOffset}
			style={[{ flex: 1 }, style]}
			{...props}
		/>
	);
}
