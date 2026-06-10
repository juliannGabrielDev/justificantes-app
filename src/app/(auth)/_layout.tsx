import CustomTabBar, { TabConfig } from '@/components/ui/custom-tab-bar';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import {
	ArrowRightEndOnRectangleIcon,
	UserPlusIcon,
} from 'react-native-heroicons/outline';

const AUTH_TABS_CONFIG: Record<string, TabConfig> = {
	login: {
		label: 'ACCEDER',
		color: '#fcbd00', // --color-very-yellow
		Icon: ArrowRightEndOnRectangleIcon,
	},
	register: {
		label: 'REGISTRARME',
		color: '#fa8919', // --color-simple-orange
		Icon: UserPlusIcon,
	},
};

export default function AuthLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			tabBar={(props) => (
				<CustomTabBar {...props} config={AUTH_TABS_CONFIG} />
			)}
		>
			<Tabs.Screen name="login" options={{ headerShown: false }} />
			<Tabs.Screen
				name="register"
				options={{
					headerShown: true,
					title: '¡Únete!',
					headerTitleAlign: 'center',
					headerTitleStyle: {
						fontFamily: 'Pacifico',
						fontSize: 20,
					},
					headerStyle: {
						backgroundColor:
							colorScheme === 'dark' ? '#000' : '#fff',
					},
				}}
			/>
		</Tabs>
	);
}
