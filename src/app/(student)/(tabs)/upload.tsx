import DatePicker from '@/components/forms/date-picker';
import CustomImagePicker from '@/components/forms/image-picker';
import Input from '@/components/forms/input';
import Select from '@/components/forms/select';
import Button from '@/components/ui/button';
import KeyboardAvoidingView from '@/components/ui/keyboard-avoiding-view';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
	PaperAirplaneIcon,
	PencilSquareIcon,
	ScaleIcon,
	UserCircleIcon,
} from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StudentUpload() {
	const insets = useSafeAreaInsets();
	const [value, setValue] = useState();

	const getNormalizedToday = () => {
		const today = new Date();
		today.setHours(12, 0, 0, 0);
		return today;
	};

	const [startDate, setStartDate] = useState(getNormalizedToday());
	const [endDate, setEndDate] = useState(getNormalizedToday());
	const [evidenceImage, setEvidenceImage] = useState<string | null>(null);

	const handleStartDateChange = (date: Date) => {
		setStartDate(date);
		// If the new start date is after the current end date, push end date forward
		if (date > endDate) {
			setEndDate(date);
		}
	};

	const handleEndDateChange = (date: Date) => {
		setEndDate(date);
		// If the new end date is before the current start date, pull start date backward
		if (date < startDate) {
			setStartDate(date);
		}
	};

	// Calculate difference in days (inclusive of start and end days)
	const diffTime = endDate.getTime() - startDate.getTime();
	const diffDays = Math.max(
		1,
		Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1,
	);

	return (
		<KeyboardAvoidingView>
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
				<Text className="super-title">Nuevo Justificante</Text>

				{/* profile card */}
				<View className="bg-surface-base flex-row items-center overflow-hidden rounded-xl">
					<View className="bg-primary border-on-surface justify-center px-4 py-6">
						<UserCircleIcon color="#000000" size={28} />
					</View>
					<View className="gap-1 p-3">
						<Text className="paragraph-mono-bold">
							Julián Alejandro Gabriel Isidro
						</Text>
						<Text className="paragraph-mono-medium">
							2259485499
						</Text>
					</View>
				</View>

				{/* date pickers */}
				<View className="gap-2">
					<View className="flex-row gap-3">
						<DatePicker
							label="Desde"
							value={startDate}
							onChange={handleStartDateChange}
							iconBg="bg-simple-orange"
							required={true}
						/>
						<DatePicker
							label="Hasta"
							value={endDate}
							onChange={handleEndDateChange}
							iconBg="bg-very-yellow"
							required={true}
						/>
					</View>
					<Text className="paragraph">
						Justificante por{' '}
						<Text className="paragraph-bold">
							{diffDays}
							{diffDays === 1 ? 'Día' : 'Días'}
						</Text>
						.
					</Text>
				</View>

				{/* type of justification */}
				<Select value={value} onValueChange={setValue}>
					<Select.Label required>Tipo de Justificante</Select.Label>
					<Select.Trigger>
						<Select.Icon>
							<ScaleIcon />
						</Select.Icon>
						<Select.Value placeholder="Selecciona una opción..." />
					</Select.Trigger>
					<Select.Options title="Tipo de Justificantes">
						<Select.Option value="1">
							Fraccion I - Por Enfermedad
						</Select.Option>
						<Select.Option value="2">
							Fracción II - Comisión Académica
						</Select.Option>
						<Select.Option value="3">
							Fracción III - Por causa de fuerza mayor
						</Select.Option>
					</Select.Options>
				</Select>

				{/* description */}
				<Input>
					<Input.Label required>Descripción</Input.Label>
					<Input.Container>
						<Input.Icon>
							<PencilSquareIcon />
						</Input.Icon>
						<Input.Field
							placeholder="Escribe una descripción..."
							multiline={true}
							numberOfLines={10}
							className="h-30"
						/>
					</Input.Container>
				</Input>

				{/* image picker */}
				<CustomImagePicker
					label="Subir Evidencia"
					value={evidenceImage}
					onChange={setEvidenceImage}
					required={true}
					iconBg="bg-not-pink"
				/>

				<Button
					onPress={() => {}}
					className="self-end"
					variant="super-simple-blue"
				>
					<Button.Icon>
						<PaperAirplaneIcon />
					</Button.Icon>
					<Button.Text>Enviar</Button.Text>
				</Button>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
