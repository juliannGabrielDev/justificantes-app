import { Stack } from 'expo-router';
import TopAppBar from '@/components/ui/top-app-bar';

export default function StudentLayout() {
	return (
		<>
			<TopAppBar />
			<Stack screenOptions={{ headerShown: false }} />
		</>
	);
}
