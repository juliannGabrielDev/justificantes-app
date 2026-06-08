import { Text, View } from 'react-native';
import { SparklesIcon } from 'react-native-heroicons/outline';

export default function StudentNotifications() {
	return (
		<View className="bg-background flex-1 items-center justify-center gap-4">
			<View className="bg-primary size-16 items-center justify-center">
				<SparklesIcon size={32} color="#000000" />
			</View>
			<View className="items-center gap-1">
				<Text className="super-title">Notificaciones</Text>
				<Text className="paragraph-mono-medium text-on-surface">
					Estas al día.
				</Text>
			</View>
		</View>
	);
}
