import { Host, Alert, Button, Text } from '@expo/ui/swift-ui';
import { View } from 'react-native';
import { AlertComponentProps } from './AlertComponent';

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
	return (
		<Host matchContents style={{ position: 'absolute', width: 0, height: 0 }}>
			<Alert
				title={title}
				isPresented={visible}
				onIsPresentedChange={(isPresented) => {
					if (!isPresented) {
						onDismiss();
					}
				}}
			>
				{/* Empty Trigger because visibility is controlled by state */}
				<Alert.Trigger>
					<View />
				</Alert.Trigger>
				<Alert.Actions>
					{cancelText && (
						<Button
							label={cancelText}
							role="cancel"
							onPress={onDismiss}
						/>
					)}
					<Button
						label={confirmText}
						role={destructive ? 'destructive' : undefined}
						onPress={onConfirm}
					/>
				</Alert.Actions>
				{message && (
					<Alert.Message>
						<Text>{message}</Text>
					</Alert.Message>
				)}
			</Alert>
		</Host>
	);
}
