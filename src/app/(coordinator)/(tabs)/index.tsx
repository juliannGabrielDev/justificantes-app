import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function CoordinatorIndex() {
	return (
		<View className="flex-1 items-center justify-center gap-4 bg-slate-50">
			<Text className="text-xl font-bold">Pendientes (Coordinador)</Text>

			<Link
				href="/(coordinator)/justificante/just_1"
				className="text-base font-semibold text-blue-600"
			>
				Ver Justificante #1
			</Link>

			<Link
				href="/(coordinator)/justificante/just_2"
				className="text-base font-semibold text-blue-600"
			>
				Ver Justificante #2
			</Link>

			<Link
				href="/(coordinator)/profile"
				className="text-base font-semibold text-blue-600"
			>
				Ver Mi Perfil
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
