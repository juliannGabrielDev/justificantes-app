import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function CoordinatorProfile() {
	return (
		<View className="flex-1 items-center justify-center gap-4 bg-slate-50">
			<Text className="text-xl font-bold">Perfil del Coordinador</Text>

			<Link
				href="/(coordinator)/(tabs)"
				className="text-base font-semibold text-blue-600"
			>
				Volver a Inicio
			</Link>

			<Link
				href="/(auth)/login"
				className="text-base font-semibold text-red-600"
			>
				Cerrar Sesión
			</Link>
		</View>
	);
}
