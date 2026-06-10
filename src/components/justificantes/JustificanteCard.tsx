import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import JustificanteBadge, { FractionType } from './JustificanteBadge';

export interface JustificanteCardProps {
	id: string;
	code: string;
	status: 'Aprobado' | 'Pendiente' | 'Rechazado';
	fraction: FractionType;
	date: string;
	requestedAt: string;
	onPress?: () => void;
}

export default function JustificanteCard({
	id,
	code,
	status,
	fraction,
	date,
	requestedAt,
	onPress,
}: JustificanteCardProps) {
	const router = useRouter();

	const handlePress = () => {
		if (onPress) {
			onPress();
		} else {
			router.push({
				pathname: '/(student)/justificante/[id]',
				params: { id },
			});
		}
	};

	let statusColorClass = 'bg-primary';
	if (status === 'Pendiente') {
		statusColorClass = 'bg-very-yellow';
	} else if (status === 'Rechazado') {
		statusColorClass = 'bg-danger';
	}

	return (
		<Pressable
			onPress={handlePress}
			className="border-on-surface active:opacity-90 overflow-hidden rounded-[20px] border-2 border-dashed"
		>
			<View className="bg-surface-base gap-2 p-4">
				<View className="flex-row justify-between">
					<View>
						<Text className="list-item-title">{code}</Text>
						<Text className="page-title">{status}</Text>
					</View>
					<JustificanteBadge fraction={fraction} />
				</View>
				<Text className="caption">
					<Text className="caption-bold">Fecha:</Text> {date}
				</Text>
				<Text className="caption">{requestedAt}</Text>
			</View>
			<View className={`${statusColorClass} h-2`} />
		</Pressable>
	);
}
