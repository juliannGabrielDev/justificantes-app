import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const user = {
	name: 'Julian',
};

export default function StudentIndex() {
	const insets = useSafeAreaInsets();

	return (
		<>
			<ScrollView
				className="bg-background flex-1"
				contentContainerStyle={{
					paddingTop: insets.top + 56,
					paddingBottom: insets.bottom,
					paddingHorizontal: 20,
					gap: 16,
				}}
				showsVerticalScrollIndicator={false}
			>
				<View className="gap-1">
					<Text className="super-title">¡Hola, {user.name}!</Text>
					<Text className="list-item-title text-on-surface">
						Gestiona tus justificantes con facilidad.
					</Text>
				</View>
			</ScrollView>
		</>
	);
}
