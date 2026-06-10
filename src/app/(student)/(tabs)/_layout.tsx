import CustomTabBar, { TabConfig } from '@/components/ui/custom-tab-bar';
import TopAppBar from '@/components/ui/top-app-bar';
import { Tabs } from 'expo-router';
import {
	ArrowUpTrayIcon,
	ClipboardDocumentListIcon,
	HomeIcon,
} from 'react-native-heroicons/outline';

const TABS_COLORS = {
	green: '#0ac26a', // --color-primary
	blue: '#1086fb', // --color-simple-blue
	pink: '#f27eff', // --color-not-pink
};

const STUDENT_TABS_CONFIG: Record<string, TabConfig> = {
	index: {
		label: 'Inicio',
		color: TABS_COLORS.green,
		Icon: HomeIcon,
	},
	upload: {
		label: 'Subir',
		color: TABS_COLORS.blue,
		Icon: ArrowUpTrayIcon,
	},
	history: {
		label: 'Historial',
		color: TABS_COLORS.pink,
		Icon: ClipboardDocumentListIcon,
	},
};

export default function StudentTabsLayout() {
	return (
		<>
			<TopAppBar />
			<Tabs
				tabBar={(props) => (
					<CustomTabBar {...props} config={STUDENT_TABS_CONFIG} />
				)}
				screenOptions={{
					headerShown: false,
				}}
			/>
		</>
	);
}
