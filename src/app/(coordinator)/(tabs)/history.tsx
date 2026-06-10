import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function CoordinatorHistory() {
	return (
		<View className="flex-1 items-center justify-center gap-4 bg-slate-50">
			<Text className="text-xl font-bold">
				Historial de Dictámenes (Coordinador)
			</Text>

			<Link
				href="/(coordinator)/justificante/just_2"
				className="text-base font-semibold text-blue-600"
			>
				Ver Justificante Aprobado (#2)
			</Link>
		</View>
	);
}
