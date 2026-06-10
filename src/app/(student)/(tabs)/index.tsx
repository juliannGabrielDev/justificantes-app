import JustificantesCard from '@/components/justificantes/JustificanteCard';
import Button from '@/components/ui/button';
import StatsCard from '@/components/ui/StatsCard';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import {
	CalendarDaysIcon,
	CheckBadgeIcon,
	ClockIcon,
	XCircleIcon,
} from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const user = {
	name: 'Julian',
};

export default function StudentIndex() {
	const router = useRouter();
	const insets = useSafeAreaInsets();

	return (
		<>
			<ScrollView
				className="bg-background flex-1"
				contentContainerStyle={{
					paddingTop: insets.top + 56,
					paddingBottom: insets.bottom + 100,
					paddingHorizontal: 20,
					gap: 16,
				}}
				showsVerticalScrollIndicator={false}
			>
				<View className="gap-1">
					<Text className="super-title">¡Hola, {user.name}!</Text>
					<Text className="list-item-title text-on-surface">
						Gestiona tus justificantes con facilidad.
					</Text>
				</View>

				<Text className="list-title">Tu Resumen</Text>

				{/* stats grid */}
				<View className="gap-3">
					<View className="flex-row gap-3">
						<StatsCard
							className="flex-1"
							badgeClassName="bg-simple-blue"
							icon={
								<CalendarDaysIcon size={24} color="#000000" />
							}
							amount={12}
							auxText="en Total"
						/>
						<StatsCard
							className="flex-1"
							badgeClassName="bg-primary"
							icon={<CheckBadgeIcon size={24} color="#000000" />}
							amount={3}
							auxText="Aprobados"
						/>
					</View>
					<View className="flex-row gap-3">
						<StatsCard
							className="flex-1"
							badgeClassName="bg-very-yellow"
							icon={<ClockIcon size={24} color="#000000" />}
							amount={1}
							auxText="Pendientes"
						/>
						<StatsCard
							className="flex-1"
							badgeClassName="bg-danger"
							icon={<XCircleIcon size={24} color="#000000" />}
							amount={8}
							auxText="Rechazados"
						/>
					</View>
				</View>

				<Text className="list-title">Actividad Reciente</Text>

				<View className="gap-4">
					<JustificantesCard
						id="just_1"
						code="#001"
						status="Aprobado"
						fraction="I"
						date="05/06/2026"
						requestedAt="Solicitado el 04/06/2026"
					/>
					<JustificantesCard
						id="just_2"
						code="#002"
						status="Pendiente"
						fraction="II"
						date="08/06/2026"
						requestedAt="Solicitado el 07/06/2026"
					/>
					<JustificantesCard
						id="just_3"
						code="#003"
						status="Rechazado"
						fraction="III"
						date="02/06/2026"
						requestedAt="Solicitado el 01/06/2026"
					/>
				</View>

				<Button
					onPress={() => router.push('/(student)/(tabs)/history')}
					className="self-end"
					variant="super-primary"
				>
					<Button.Text>Ver más</Button.Text>
				</Button>
			</ScrollView>
		</>
	);
}
