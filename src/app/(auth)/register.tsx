import Input from '@/components/forms/input';
import Select from '@/components/forms/select';
import Button from '@/components/ui/button';
import KeyboardAvoidingView from '@/components/ui/keyboard-avoiding-view';
import { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import {
	AcademicCapIcon,
	CheckBadgeIcon,
	IdentificationIcon,
	LockClosedIcon,
	ShieldCheckIcon,
	UserCircleIcon,
} from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterPage() {
	const insets = useSafeAreaInsets();
	const [value, setValue] = useState('');

	return (
		<KeyboardAvoidingView>
			<ScrollView
				className="bg-background flex-1"
				contentContainerStyle={{
					paddingTop: 24,
					paddingBottom: insets.bottom + 100,
					flexGrow: 1,
					gap: 16,
					paddingHorizontal: 24,
				}}
				showsVerticalScrollIndicator={false}
			>
				<Text className="list-item-title text-center uppercase">
					Datos Personales
				</Text>

				<Input>
					<Input.Label required>Código de Estudiante</Input.Label>
					<Input.Container>
						<Input.Icon>
							<IdentificationIcon size={28} color="#000" />
						</Input.Icon>
						<Input.Field
							placeholder="22XXXXXXXXX"
							keyboardType="numeric"
						/>
					</Input.Container>
				</Input>

				<Input>
					<Input.Label required>Nombre(s)</Input.Label>
					<Input.Container>
						<Input.Icon>
							<UserCircleIcon size={28} color="#000" />
						</Input.Icon>
						<Input.Field />
					</Input.Container>
				</Input>

				<Input>
					<Input.Label required>Apellido Paterno</Input.Label>
					<Input.Container>
						<Input.Icon>
							<UserCircleIcon size={28} color="#000" />
						</Input.Icon>
						<Input.Field />
					</Input.Container>
				</Input>

				<Input>
					<Input.Label>Apellido Materno (opcional)</Input.Label>
					<Input.Container>
						<Input.Icon>
							<UserCircleIcon size={28} color="#000" />
						</Input.Icon>
						<Input.Field />
					</Input.Container>
				</Input>

				<Input>
					<Input.Label required>Correo Institucional</Input.Label>
					<Input.Container>
						<Input.Icon>
							<UserCircleIcon size={28} color="#000" />
						</Input.Icon>
						<Input.Field placeholder="tu.correo@alumnos.udg.mx" />
					</Input.Container>
					<Input.HelperText>
						Usar correo @alumnos.udg.mx, @academicos.udg.mx o
						@cucsur.udg.mx.
					</Input.HelperText>
				</Input>

				<Select value={value} onValueChange={setValue}>
					<Select.Label>Carrera</Select.Label>
					<Select.Trigger>
						<Select.Icon>
							<AcademicCapIcon />
						</Select.Icon>
						<Select.Value placeholder="Selecciona una opción..." />
					</Select.Trigger>
					<Select.Options title="Carreras">
						<Select.Option value="1">Abogado</Select.Option>
						<Select.Option value="2">
							Ingeniería de Procesos y Comercio Internacional
						</Select.Option>
						<Select.Option value="3">
							Ingeniería en Obras y Servicios
						</Select.Option>
						<Select.Option value="4">
							Ingeniería en Teleinformática
						</Select.Option>
						<Select.Option value="5">
							Ingeniería Mecatrónica
						</Select.Option>
						<Select.Option value="6">
							Ingeniero Agrónomo
						</Select.Option>
						<Select.Option value="7">
							Licenciatura en Administración
						</Select.Option>
						<Select.Option value="8">
							Licenciatura en Administración Financiera y Sistemas
						</Select.Option>
						<Select.Option value="9">
							Licenciatura en Artes
						</Select.Option>
						<Select.Option value="10">
							Licenciatura en Biología Marina
						</Select.Option>
						<Select.Option value="11">
							Licenciatura en Contaduría Pública
						</Select.Option>
						<Select.Option value="12">
							Licenciatura en Nutrición
						</Select.Option>
						<Select.Option value="13">
							Licenciatura en Turismo
						</Select.Option>
						<Select.Option value="14">
							TSU en Electrónica y Mecánica Automotriz
						</Select.Option>
					</Select.Options>
				</Select>

				<Text className="list-item-title mt-4 text-center uppercase">
					Seguridad
				</Text>

				<Input>
					<Input.Label required>Contraseña</Input.Label>
					<Input.Container>
						<Input.Icon>
							<LockClosedIcon />
						</Input.Icon>
						<Input.Password placeholder="••••••••" />
					</Input.Container>
				</Input>

				<Input>
					<Input.Label required>Confirmar Contraseña</Input.Label>
					<Input.Container>
						<Input.Icon>
							<ShieldCheckIcon size={28} color="#000" />
						</Input.Icon>
						<Input.Password placeholder="••••••••" />
					</Input.Container>
				</Input>

				<Button
					onPress={() => {}}
					className="self-end"
					variant="super-primary"
				>
					<Button.Icon>
						<CheckBadgeIcon size={20} color="#000" />
					</Button.Icon>
					<Button.Text>Crear mi cuenta</Button.Text>
				</Button>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
