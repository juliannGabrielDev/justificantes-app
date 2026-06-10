import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';

export default function ReviewJustificante() {
	const { id } = useLocalSearchParams<{ id: string }>();

	return (
		<View className="flex-1 items-center justify-center gap-4 bg-slate-50">
			<Text className="text-xl font-bold">
				Detalle de Justificante: {id}
			</Text>

			<Link
				href="/(coordinator)/(tabs)"
				className="text-base font-semibold text-blue-600"
			>
				Volver a la Lista
			</Link>
		</View>
	);
}
