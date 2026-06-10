import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function CoordinatorTabsLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#2563eb',
				tabBarInactiveTintColor: '#64748b',
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Pendientes',
					tabBarIcon: ({ color }) => (
						<Text style={{ color, fontSize: 18 }}>⏳</Text>
					),
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: 'Historial',
					tabBarIcon: ({ color }) => (
						<Text style={{ color, fontSize: 18 }}>🗄️</Text>
					),
				}}
			/>
		</Tabs>
	);
}
