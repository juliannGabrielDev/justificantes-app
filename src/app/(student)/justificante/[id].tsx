import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import JustificanteBadge, {
	FractionType,
} from '@/components/justificantes/JustificanteBadge';
import Button from '@/components/ui/button';

// Mock data list matching the ones we'll show on the home screen
const MOCK_JUSTIFICANTES: Record<
	string,
	{
		code: string;
		status: 'Aprobado' | 'Pendiente' | 'Rechazado';
		fraction: FractionType;
		date: string;
		requestedAt: string;
		reason: string;
		description: string;
	}
> = {
	just_1: {
		code: '#001',
		status: 'Aprobado',
		fraction: 'I',
		date: '05/06/2026',
		requestedAt: 'Solicitado el 04/06/2026',
		reason: 'Enfermedad (Gripe fuerte y fiebre)',
		description:
			'El estudiante presentó justificante médico de institución oficial indicando cuadro febril severo con recomendación de reposo absoluto por 48 horas.',
	},
	just_2: {
		code: '#002',
		status: 'Pendiente',
		fraction: 'II',
		date: '08/06/2026',
		requestedAt: 'Solicitado el 07/06/2026',
		reason: 'Comisión Universitaria (Representación deportiva)',
		description:
			'Comisión académica/deportiva oficial para asistir al Torneo Interuniversitario Estatal representando al Centro de Estudios.',
	},
	just_3: {
		code: '#003',
		status: 'Rechazado',
		fraction: 'III',
		date: '02/06/2026',
		requestedAt: 'Solicitado el 01/06/2026',
		reason: 'Fuerza Mayor (Falla mecánica en transporte)',
		description:
			'Inasistencia por retraso del transporte foráneo. Se rechazó por no adjuntar el boleto de viaje ni el reporte de la línea de transporte correspondiente.',
	},
};

export default function JustificanteDetail() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const insets = useSafeAreaInsets();
	const router = useRouter();

	const data = MOCK_JUSTIFICANTES[id || ''] || {
		code: `#${id?.substring(0, 3) || '000'}`,
		status: 'Pendiente' as const,
		fraction: 'I' as const,
		date: 'DD/MM/YYYY',
		requestedAt: 'Solicitado el DD/MM/YYYY',
		reason: 'Detalles del justificante',
		description:
			'Información detallada no disponible para este justificante.',
	};

	let statusColor = 'bg-primary';
	if (data.status === 'Pendiente') {
		statusColor = 'bg-very-yellow';
	} else if (data.status === 'Rechazado') {
		statusColor = 'bg-danger';
	}

	return (
		<ScrollView
			className="bg-background flex-1"
			contentContainerStyle={{
				paddingTop: insets.top + 76,
				paddingBottom: insets.bottom + 24,
				paddingHorizontal: 20,
				gap: 20,
			}}
			showsVerticalScrollIndicator={false}
		>
			<View className="gap-2">
				<Text className="list-title">DETALLE DE SOLICITUD</Text>
				<View className="flex-row items-center justify-between">
					<Text className="super-title">{data.code}</Text>
					<JustificanteBadge fraction={data.fraction} />
				</View>
			</View>

			{/* Neo-brutalist ticket style container */}
			<View className="border-on-surface bg-surface-base overflow-hidden rounded-[20px] border-2">
				<View className="gap-4 p-5">
					<View className="gap-1">
						<Text className="caption-bold text-muted">Estado</Text>
						<Text className="page-title">{data.status}</Text>
					</View>

					<View className="bg-on-surface/10 h-[2px] border-t-2 border-dashed" />

					<View className="gap-1">
						<Text className="caption-bold text-muted">
							Motivo / Tipo de Falta
						</Text>
						<Text className="paragraph-bold">{data.reason}</Text>
					</View>

					<View className="gap-1">
						<Text className="caption-bold text-muted">
							Rango de Fechas Inasistencia
						</Text>
						<Text className="paragraph">{data.date}</Text>
					</View>

					<View className="gap-1">
						<Text className="caption-bold text-muted">
							Fecha de Solicitud
						</Text>
						<Text className="paragraph">{data.requestedAt}</Text>
					</View>

					<View className="bg-on-surface/10 h-[2px] border-t-2 border-dashed" />

					<View className="gap-1">
						<Text className="caption-bold text-muted">
							Descripción / Evidencia adjunta
						</Text>
						<Text className="paragraph text-justify">
							{data.description}
						</Text>
					</View>
				</View>
				<View className={`${statusColor} h-3`} />
			</View>

			<Button
				onPress={() => router.back()}
				variant="super-primary"
				className="mt-4"
			>
				<Button.Text>Regresar</Button.Text>
			</Button>
		</ScrollView>
	);
}
