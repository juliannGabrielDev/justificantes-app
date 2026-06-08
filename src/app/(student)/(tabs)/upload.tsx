import { Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function StudentUpload() {
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
				<Text className="super-title">Nuevo Justificante</Text>
			</ScrollView>
		</>
	);
}
