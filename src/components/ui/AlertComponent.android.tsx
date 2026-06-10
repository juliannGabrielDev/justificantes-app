import { Host, AlertDialog, TextButton, Text } from '@expo/ui/jetpack-compose';
import { AlertComponentProps } from './AlertComponent';

export default function AlertComponent({
	visible,
	title,
	message,
	confirmText,
	cancelText,
	onConfirm,
	onDismiss,
}: AlertComponentProps) {
	if (!visible) return null;

	return (
		<Host matchContents style={{ position: 'absolute', width: 0, height: 0 }}>
			<AlertDialog onDismissRequest={onDismiss}>
				<AlertDialog.Title>
					<Text>{title}</Text>
				</AlertDialog.Title>
				{message && (
					<AlertDialog.Text>
						<Text>{message}</Text>
					</AlertDialog.Text>
				)}
				<AlertDialog.ConfirmButton>
					<TextButton onClick={onConfirm}>
						<Text>{confirmText}</Text>
					</TextButton>
				</AlertDialog.ConfirmButton>
				{cancelText && (
					<AlertDialog.DismissButton>
						<TextButton onClick={onDismiss}>
							<Text>{cancelText}</Text>
						</TextButton>
					</AlertDialog.DismissButton>
				)}
			</AlertDialog>
		</Host>
	);
}
