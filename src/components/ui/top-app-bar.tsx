import { Href, usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, Text, View, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import {
	ArrowUturnLeftIcon,
	BellIcon,
	EllipsisHorizontalIcon,
	ScaleIcon,
	UserCircleIcon,
} from 'react-native-heroicons/outline';
import Animated, {
	FadeIn,
	FadeOut,
	LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from './button';

export default function TopAppBar() {
	const router = useRouter();
	const pathname = usePathname();
	const insets = useSafeAreaInsets();
	const [menuVisible, setMenuVisible] = useState(false);
	const colorScheme = useColorScheme();
	const isDark = colorScheme === 'dark';

	const surfaceColor = isDark ? '#000000' : '#ffffff';
	const pressedColor = isDark ? '#222222' : '#E7E7E7';
	const onSurfaceColor = isDark ? '#ffffff' : '#000000';

	// Determinar qué elementos mostrar según la ruta
	const isTabScreen = ['/', '/upload', '/history'].includes(pathname);
	const showBack = !isTabScreen;
	const showNotifications = pathname !== '/notifications';

	const handleNavigate = (route: Href) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setMenuVisible(false);
		router.push(route);
	};

	// Sombras neo-brutalistas consistentes en iOS y Android
	const dropdownShadow = {
		shadowColor: isDark ? '#ffffff' : '#000000',
		shadowOffset: { width: 4, height: 4 },
		shadowOpacity: 1,
		shadowRadius: 0,
		elevation: 4,
	};

	return (
		<View
			className="flex-row items-center justify-between"
			style={{
				position: 'absolute',
				top: insets.top + 8,
				left: 24,
				right: 24,
				zIndex: 50,
			}}
		>
			{/* Botón de atrás (a la izquierda) */}
			<View className="h-12 w-12">
				{showBack && (
					<Animated.View
						entering={FadeIn.duration(200)}
						exiting={FadeOut.duration(200)}
					>
						<Pressable
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Light,
								);
								router.back();
							}}
							className="bg-surface-base size-12 items-center justify-center rounded-full shadow-sm"
							style={({ pressed }) => [
								{
									backgroundColor: pressed
										? pressedColor
										: surfaceColor,
								},
							]}
						>
							<ArrowUturnLeftIcon
								size={28}
								color={onSurfaceColor}
							/>
						</Pressable>
					</Animated.View>
				)}
			</View>

			{/* Contenedor de acciones (a la derecha) */}
			<View className="relative">
				<Animated.View
					layout={LinearTransition.duration(200)}
					className="bg-surface-base flex-row rounded-3xl shadow-sm"
				>
					{showNotifications && (
						<Animated.View
							entering={FadeIn.duration(200)}
							exiting={FadeOut.duration(200)}
							layout={LinearTransition.duration(200)}
						>
							<Pressable
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Light,
									);
									router.push('/(student)/notifications');
								}}
								className="bg-surface-base size-12 items-center justify-center rounded-full"
								style={({ pressed }) => [
									{
										backgroundColor: pressed
											? pressedColor
											: surfaceColor,
									},
								]}
							>
								<BellIcon size={28} color={onSurfaceColor} />
							</Pressable>
						</Animated.View>
					)}

					<Animated.View layout={LinearTransition.duration(200)}>
						<Pressable
							onPress={() => {
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Light,
								);
								setMenuVisible(true);
							}}
							className="bg-surface-base size-12 items-center justify-center rounded-full"
							style={({ pressed }) => [
								{
									backgroundColor: pressed
										? pressedColor
										: surfaceColor,
								},
							]}
						>
							<EllipsisHorizontalIcon
								size={28}
								color={onSurfaceColor}
							/>
						</Pressable>
					</Animated.View>
				</Animated.View>

				{/* dropdown menu */}
				{menuVisible && (
					<Modal
						transparent
						visible={menuVisible}
						animationType="none"
					>
						<GestureHandlerRootView style={{ flex: 1 }}>
							<Pressable
								className="flex-1"
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Light,
									);
									setMenuVisible(false);
								}}
							>
								<View
									style={{
										position: 'absolute',
										top: insets.top + 16,
										right: 24,
									}}
								>
									<Animated.View
										entering={FadeIn.duration(150)}
										exiting={FadeOut.duration(150)}
										className="bg-surface-base gap-4 p-4"
										style={dropdownShadow}
									>
										{/* my profile */}
										<Pressable
											onPress={() =>
												handleNavigate(
													'/(student)/profile',
												)
											}
											className="flex-row items-center gap-3 py-1"
											style={({ pressed }) => [
												{ opacity: pressed ? 0.6 : 1 },
											]}
										>
											<UserCircleIcon
												size={24}
												color={onSurfaceColor}
											/>
											<Text className="paragraph-mono-bold text-on-surface">
												Mi perfil
											</Text>
										</Pressable>

										{/* rules */}
										<Pressable
											onPress={() =>
												handleNavigate(
													'/(student)/rules',
												)
											}
											className="flex-row items-center gap-3 py-1"
											style={({ pressed }) => [
												{ opacity: pressed ? 0.6 : 1 },
											]}
										>
											<ScaleIcon
												size={24}
												color={onSurfaceColor}
											/>
											<Text className="paragraph-mono-bold text-on-surface">
												Reglamento
											</Text>
										</Pressable>

										{/* divider */}
										<View className="bg-on-surface h-[1px]" />

										{/* logout button */}
										<Button
											onPress={() =>
												handleNavigate('/(auth)/login')
											}
											variant="simple-orange"
										>
											<Button.Text className="uppercase">
												Cerrar Sesión
											</Button.Text>
										</Button>
									</Animated.View>
								</View>
							</Pressable>
						</GestureHandlerRootView>
					</Modal>
				)}
			</View>
		</View>
	);
}
