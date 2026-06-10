import Input from '@/components/forms/input';
import Button from '@/components/ui/button';
import KeyboardAvoidingView from '@/components/ui/keyboard-avoiding-view';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import {
	ArrowRightEndOnRectangleIcon,
	IdentificationIcon,
	LockClosedIcon,
} from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginPage() {
	const insets = useSafeAreaInsets();
	const router = useRouter();

	const handleLogin = () => {
		router.replace('/(student)/(tabs)');
	};

	return (
		<KeyboardAvoidingView>
			<ScrollView
				style={{ flex: 1 }}
				className="bg-background"
				contentContainerStyle={{
					paddingTop: insets.top + 24,
					paddingBottom: insets.bottom + 100,
					flexGrow: 1,
					gap: 16,
					paddingHorizontal: 24,
				}}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled"
			>
				<View className="flex-row gap-3">
					<Image
						source={require('@/assets/images/icon.png')}
						style={{ width: 64, height: 64, borderRadius: 12 }}
					/>
					<Image
						source={require('@/assets/images/cucsur-logo.jpg')}
						style={{ width: 64, height: 64, borderRadius: 12 }}
					/>
				</View>
				<View className="gap-2">
					<Text className="super-title">
						Sistema de Justificantes
					</Text>
					<Text className="list-title">
						Centro Universitario de la Costa Sur
					</Text>
				</View>

				{/* form login */}
				<View
					style={{ flexGrow: 1, justifyContent: 'center' }}
					className="gap-4"
				>
					<Input>
						<Input.Label required>Código de Estudiante</Input.Label>
						<Input.Container>
							<Input.Icon>
								<IdentificationIcon color="#000" />
							</Input.Icon>
							<Input.Field
								placeholder="22XXXXXXXXX"
								keyboardType="numeric"
							/>
						</Input.Container>
						<Input.HelperText>
							¿Es tu primera vez aquí? Debes registrarte primero
							para acceder.
						</Input.HelperText>
					</Input>
					<Input>
						<Input.Label required>Contraseña</Input.Label>
						<Input.Container>
							<Input.Icon>
								<LockClosedIcon />
							</Input.Icon>
							<Input.Password placeholder="••••••••" />
						</Input.Container>
					</Input>
				</View>

				<Button
					onPress={() => handleLogin()}
					className="self-end"
					variant="super-primary"
				>
					<Button.Icon>
						<ArrowRightEndOnRectangleIcon size={20} color="#000" />
					</Button.Icon>
					<Button.Text>Iniciar Sesión</Button.Text>
				</Button>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
