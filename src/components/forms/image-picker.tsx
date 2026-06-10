import BottomSheet from '@/components/ui/bottom-sheet';
import Button from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { File } from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import {
	Image,
	Linking,
	Text,
	useColorScheme,
	View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
	CameraIcon,
	CloudArrowUpIcon,
	PhotoIcon,
	XCircleIcon,
} from 'react-native-heroicons/outline';
import Animated, {
	interpolateColor,
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useCustomAlert } from '@/context/AlertContext';

interface ImagePickerProps {
	label: string;
	value: string | null; // Selected image URI
	onChange: (uri: string | null, filename?: string) => void;
	iconBg?: string; // e.g. "bg-not-pink", "bg-very-yellow"
	disabled?: boolean;
	required?: boolean;
	className?: string;
}

export default function CustomImagePicker({
	label,
	value,
	onChange,
	iconBg = 'bg-not-pink',
	disabled = false,
	required = false,
	className,
}: ImagePickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';
	const { showAlert } = useCustomAlert();

	const isHovered = useSharedValue(0);
	const focusShared = useSharedValue(0);

	const triggerHaptic = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
	};

	const handleOpen = () => {
		triggerHaptic();
		focusShared.value = withTiming(1, { duration: 150 });
		setIsOpen(true);
	};

	const handleClose = () => {
		focusShared.value = withTiming(0, { duration: 150 });
		setIsOpen(false);
	};

	// Automatic compression/resizing logic
	const compressAndResizeImage = async (uri: string): Promise<string> => {
		let currentUri = uri;
		let currentSizeInMb = new File(currentUri).size / (1024 * 1024);

		// If the photo is larger than 3MB, we automatically scale and compress it
		if (currentSizeInMb > 3) {
			// Pass 1: Resize to width 1600px, quality 0.7
			let manipResult = await manipulateAsync(
				currentUri,
				[{ resize: { width: 1600 } }],
				{ compress: 0.7, format: SaveFormat.JPEG },
			);
			currentUri = manipResult.uri;
			currentSizeInMb = new File(currentUri).size / (1024 * 1024);

			// Pass 2: If still > 3MB, resize down to 1200px, quality 0.5
			if (currentSizeInMb > 3) {
				manipResult = await manipulateAsync(
					currentUri,
					[{ resize: { width: 1200 } }],
					{ compress: 0.5, format: SaveFormat.JPEG },
				);
				currentUri = manipResult.uri;
				currentSizeInMb = new File(currentUri).size / (1024 * 1024);
			}

			// Pass 3: If still > 3MB, resize down to 800px, quality 0.4
			if (currentSizeInMb > 3) {
				manipResult = await manipulateAsync(
					currentUri,
					[{ resize: { width: 800 } }],
					{ compress: 0.4, format: SaveFormat.JPEG },
				);
				currentUri = manipResult.uri;
			}
		} else {
			// Optimize minor size images slightly to save upload speed (quality 0.8)
			const manipResult = await manipulateAsync(currentUri, [], {
				compress: 0.8,
				format: SaveFormat.JPEG,
			});
			currentUri = manipResult.uri;
		}

		return currentUri;
	};

	const processImage = async (uri: string) => {
		setIsProcessing(true);
		try {
			const optimizedUri = await compressAndResizeImage(uri);
			const filename = optimizedUri.split('/').pop() || 'image.jpg';
			onChange(optimizedUri, filename);
			handleClose();
		} catch (error) {
			console.error('Error processing image:', error);
			showAlert('Error', {
				message: 'No se pudo procesar y optimizar la imagen seleccionada.',
			});
		} finally {
			setIsProcessing(false);
		}
	};

	// Permissions request with settings fallback
	const requestPermissionWithSettingsFallback = async (
		type: 'camera' | 'library',
	): Promise<boolean> => {
		if (type === 'camera') {
			const permission = await ImagePicker.getCameraPermissionsAsync();
			if (permission.granted) return true;

			if (permission.status === 'denied') {
				showAlert('Permiso de Cámara Requerido', {
					message: 'Has denegado el acceso a la cámara. Por favor, ve a la configuración de tu teléfono para habilitar el permiso de cámara y poder tomar fotos.',
					confirmText: 'Abrir Configuración',
					cancelText: 'Cancelar',
					onConfirm: () => Linking.openSettings(),
				});
				return false;
			}

			const requestResult =
				await ImagePicker.requestCameraPermissionsAsync();
			return requestResult.granted;
		} else {
			const permission =
				await ImagePicker.getMediaLibraryPermissionsAsync();
			if (permission.granted) return true;

			if (permission.status === 'denied') {
				showAlert('Permiso de Galería Requerido', {
					message: 'Has denegado el acceso a la galería. Por favor, ve a la configuración de tu teléfono para habilitar el permiso de fotos y poder subir imágenes.',
					confirmText: 'Abrir Configuración',
					cancelText: 'Cancelar',
					onConfirm: () => Linking.openSettings(),
				});
				return false;
			}

			const requestResult =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			return requestResult.granted;
		}
	};

	const pickFromGallery = async () => {
		triggerHaptic();
		const hasPermission =
			await requestPermissionWithSettingsFallback('library');
		if (!hasPermission) return;

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'] as ImagePicker.MediaType[],
			allowsEditing: true,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			await processImage(result.assets[0].uri);
		}
	};

	const takePhoto = async () => {
		triggerHaptic();
		const hasPermission =
			await requestPermissionWithSettingsFallback('camera');
		if (!hasPermission) return;

		const result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			await processImage(result.assets[0].uri);
		}
	};

	const handleRemove = () => {
		Haptics.notificationAsync(
			Haptics.NotificationFeedbackType.Warning,
		).catch(() => {});
		onChange(null);
	};

	const hoverGesture = Gesture.Hover()
		.enabled(!disabled && !isProcessing)
		.onBegin(() => {
			isHovered.value = withTiming(1, { duration: 150 });
		})
		.onEnd(() => {
			isHovered.value = withTiming(0, { duration: 150 });
		});

	const tapGesture = Gesture.Tap()
		.enabled(!disabled && !isProcessing)
		.onEnd(() => {
			runOnJS(handleOpen)();
		});

	const gesture = Gesture.Exclusive(tapGesture, hoverGesture);

	// Shared values styling for 3D bounce
	const baseBg = isDark ? '#000000' : '#ffffff';
	const hoverBg = isDark ? '#18181b' : '#f8fafc';
	const focusBg = isDark ? '#1e3a52' : '#f0f9ff';

	const animatedStyle = useAnimatedStyle(() => {
		const scale = 1 + focusShared.value * 0.01 + isHovered.value * 0.005;
		const progress = focusShared.value;
		const hoverProgress = isHovered.value;

		const activeColor = interpolateColor(
			progress,
			[0, 1],
			[
				interpolateColor(hoverProgress, [0, 1], [baseBg, hoverBg]),
				focusBg,
			],
		);

		const translateY = -1 * progress * hoverProgress;
		const translateX = -1 * progress * hoverProgress;

		return {
			transform: [{ scale }, { translateY }, { translateX }],
			backgroundColor: activeColor,
		};
	});

	const animatedShadowStyle = useAnimatedStyle(() => {
		const progress = focusShared.value;
		const hoverProgress = isHovered.value;
		const active = Math.max(progress, hoverProgress);

		const translateX = 4 * active;
		const translateY = 4 * active;

		return {
			transform: [{ translateX }, { translateY }],
			opacity: active,
		};
	});

	const filename = isProcessing
		? 'Optimizando imagen...'
		: value
			? value.split('/').pop() || 'image.jpg'
			: 'Elige una imagen...';

	return (
		<View className={cn('w-full gap-1', className)}>
			<Text className="list-title">
				{label}
				{required && <Text className="text-danger"> *</Text>}
			</Text>

			{/* Main Trigger Box */}
			<GestureDetector gesture={gesture}>
				<View className="relative w-full">
					{/* Shadow layer */}
					<Animated.View
						style={animatedShadowStyle}
						className="bg-on-surface absolute inset-0"
					/>

					{/* Container */}
					<Animated.View
						style={animatedStyle}
						className={cn(
							'border-on-surface bg-surface-base flex-row items-center overflow-hidden border-2 pr-3',
							(disabled || isProcessing) && 'opacity-50',
						)}
					>
						<View
							className={cn(
								'items-center justify-center p-3',
								iconBg,
							)}
						>
							<CloudArrowUpIcon color="#000000" />
						</View>
						<Text
							numberOfLines={1}
							className="paragraph-mono-bold text-on-surface flex-1 p-2"
						>
							{filename}
						</Text>
					</Animated.View>
				</View>
			</GestureDetector>

			{/* Helper Text */}
			<Text className="secondary-text mt-1">
				Los archivos deben pesar menos de 3 MB.
			</Text>

			{/* Image Preview Area */}
			{value && !isProcessing && (
				<View className="border-on-surface relative mt-2 aspect-4/3 w-full overflow-hidden border-2 bg-zinc-100 dark:bg-zinc-900">
					<Image
						source={{ uri: value }}
						style={{ width: '100%', height: '100%' }}
						resizeMode="cover"
					/>

					{/* Absolute Centered Bottom REMOVER Button */}
					<Button
						onPress={handleRemove}
						variant="simple-orange"
						className="absolute right-4 bottom-4"
					>
						<Button.Icon>
							<XCircleIcon size={20} />
						</Button.Icon>
						<Button.Text>REMOVER</Button.Text>
					</Button>
				</View>
			)}

			{/* Action Sheet Modal */}
			<BottomSheet isOpen={isOpen} onClose={handleClose} title={label}>
				<View className="gap-4">
					<Button variant="super-nothing" onPress={pickFromGallery}>
						<Button.Icon>
							<PhotoIcon size={24} />
						</Button.Icon>
						<Button.Text>Elegir de Galería</Button.Text>
					</Button>

					<Button variant="super-nothing" onPress={takePhoto}>
						<Button.Icon>
							<CameraIcon size={24} />
						</Button.Icon>
						<Button.Text>Tomar Foto</Button.Text>
					</Button>
				</View>
			</BottomSheet>
		</View>
	);
}
