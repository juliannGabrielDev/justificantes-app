import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function IndexPage() {
	return (
		<View className="flex-1 items-center justify-center gap-4 bg-slate-50">
			<Text className="text-xl font-bold">Punto de Entrada</Text>

			<Link
				href="/(auth)/login"
				className="text-simple-blue text-base font-semibold"
			>
				Ir a Login
			</Link>

			<Link
				href="/(student)/(tabs)"
				className="text-simple-blue text-base font-semibold"
			>
				Ir a Panel Estudiante
			</Link>
		</View>
	);
}
