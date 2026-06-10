import { useEffect } from 'react';
import { Alert } from 'react-native';

export interface AlertComponentProps {
	visible: boolean;
	title: string;
	message?: string;
	confirmText: string;
	cancelText?: string;
	destructive?: boolean;
	onConfirm: () => void;
	onDismiss: () => void;
}

export default function AlertComponent({
	visible,
	title,
	message,
	confirmText,
	cancelText,
	destructive,
	onConfirm,
	onDismiss,
}: AlertComponentProps) {
	useEffect(() => {
		if (visible) {
			const buttons = [];
			if (cancelText) {
				buttons.push({
					text: cancelText,
					onPress: onDismiss,
					style: 'cancel' as const,
				});
			}
			buttons.push({
				text: confirmText,
				onPress: onConfirm,
				style: (destructive ? 'destructive' : 'default') as 'destructive' | 'default',
			});

			Alert.alert(title, message || '', buttons, {
				cancelable: true,
				onDismiss: onDismiss,
			});
		}
	}, [visible, title, message, confirmText, cancelText, destructive, onConfirm, onDismiss]);

	return null;
}
