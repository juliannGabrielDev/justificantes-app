import Button from '@/components/ui/button';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import {
	ArrowDownTrayIcon,
	BriefcaseIcon,
	ExclamationTriangleIcon,
	HeartIcon,
} from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RULES_PDF_URL =
	'https://justificantescucostasur.com/view/assets/docs/reglamento.pdf';

export default function StudentRules() {
	const insets = useSafeAreaInsets();
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(0);

	const handleDownloadPDF = async () => {
		try {
			setIsDownloading(true);
			setDownloadProgress(0);
			const filename = 'Reglamento_CUCSUR.pdf';
			const destination = new File(Paths.document, filename);

			const downloadTask = File.createDownloadTask(
				RULES_PDF_URL,
				destination,
				{
					onProgress: ({ bytesWritten, totalBytes }) => {
						if (totalBytes > 0) {
							const progress = (bytesWritten / totalBytes) * 100;
							setDownloadProgress(progress);
						}
					},
				}
			);

			const resultFile = await downloadTask.downloadAsync();

			if (!resultFile) {
				throw new Error('No se pudo descargar el archivo.');
			}

			if (await Sharing.isAvailableAsync()) {
				await Sharing.shareAsync(resultFile.uri, {
					mimeType: 'application/pdf',
					dialogTitle: 'Descargar Reglamento Institucional',
					UTI: 'com.adobe.pdf',
				});
			} else {
				Alert.alert(
					'Algo salió mal',
					'La función de compartir no está disponible en este dispositivo.',
				);
			}
		} catch (error) {
			console.error(error);
			Alert.alert(
				'Algo salió mal',
				'No se pudo descargar el reglamento, intenta más tarde.',
			);
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<>
			<ScrollView
				className="bg-background flex-1"
				contentContainerStyle={{
					paddingTop: insets.top + 76,
					paddingBottom: insets.bottom + 24,
					paddingHorizontal: 20,
					gap: 16,
				}}
				showsVerticalScrollIndicator={false}
			>
				<View>
					<Text className="list-title text-center">
						Reglamento General de Evaluación y Promoción de Alumnos
					</Text>
					<Text className="super-title text-center">Capítulo XI</Text>
					<Text className="list-title text-center">
						De la justificación de las faltas de asistencia
					</Text>
				</View>
				<Text className="paragraph text-justify">
					Artículo 53. Los alumnos podrán justificar su falta de
					asistencia a clases por alguna de las siguientes causas:
				</Text>

				{/* badge */}
				<View className="bg-not-pink flex-row items-center gap-2 self-start px-2 py-1">
					<HeartIcon size={20} color="#000000" />
					<Text className="list-title text-black">I</Text>
				</View>
				<Text className="paragraph-bold">Por enfermedad;</Text>

				{/* badge */}
				<View className="bg-simple-blue flex-row items-center gap-2 self-start px-2 py-1">
					<BriefcaseIcon size={20} color="#000000" />
					<Text className="list-title text-black">II</Text>
				</View>
				<Text className="paragraph text-justify">
					<Text className="paragraph-bold">
						Por el cumplimiento de una comisión conferida por
						autoridad universitaria
					</Text>
					, con conocimiento del Coordinador de Carrera, en los
					Centros Universitarios y en el caso del Sistema de Educación
					Media Superior el Director de Escuela, siempre que los
					trabajos realizados en ella tengan estrecha relación con los
					estudios universitarios, y
				</Text>

				{/* badge */}
				<View className="bg-simple-orange flex-row items-center gap-2 self-start px-2 py-1">
					<ExclamationTriangleIcon size={20} color="#000000" />
					<Text className="list-title text-black">III</Text>
				</View>
				<Text className="paragraph text-justify">
					<Text className="paragraph-bold">
						Por causa de fuerza mayor justificada
					</Text>{' '}
					que impida al alumno asistir, a juicio del Coordinador de
					Carrera en los Centros Universitarios y del Director de
					Escuela en el Sistema de Educación Media Superior.
				</Text>

				<Text className="paragraph text-justify">
					<Text className="underline">
						El máximo de faltas de asistencia a clases que se pueden
						justificar a un alumno no excederá del 20% del total de
						horas establecidas en el programa de la materia
					</Text>
					, excepto lo establecido en el último párrafo del artículo
					54 de este ordenamiento. 7 Reglamento General de Evaluación
					y Promoción de Alumnos 2017.
				</Text>

				<Text className="paragraph text-justify">
					Artículo 54. El alumno deberá justificar las faltas de
					asistencia con el documento idóneo, al Coordinador de
					Carrera en los Centros Universitarios y al Director de
					Escuela en el Sistema de Educación Media Superior,{' '}
					<Text className="underline">
						dentro de los cinco días hábiles siguientes a la fecha
						en que haya podido reanudar sus estudios
					</Text>
					.
				</Text>

				<Text className="paragraph text-justify">
					<Text className="underline">
						Si el Coordinador de Carrera
					</Text>{' '}
					o el Director de Escuela{' '}
					<Text className="underline">
						considera justificadas las faltas, se deberá hacer del
						conocimiento de los profesores de las materias que están
						cursando los alumnos, para que realicen la anotación
						correspondiente
					</Text>
					.
				</Text>

				<Text className="paragraph text-justify">
					En forma excepcional el Director de la Escuela en el Sistema
					de Educación Media Superior o el Coordinador de Carrera en
					los Centros Universitarios,{' '}
					<Text className="underline">
						podrán justificar un porcentaje máximo del 35% del total
						de las horas, establecidas en el programa de la materia,
						siempre y cuando se hayan realizado por alguna causa
						grave justificada
					</Text>
					.
				</Text>

				<Text className="paragraph text-justify">
					Artículo 55. Cuando la inasistencia del alumno debidamente
					justificada en los términos del artículo anterior, se haya
					realizado el día de aplicación o calificación de un medio de
					evaluación, el profesor de la materia y el alumno acordarán
					la fecha y hora para llevarlo a cabo.
				</Text>

				<Button
					onPress={handleDownloadPDF}
					variant="nothing"
					className="mt-6 self-end"
					disabled={isDownloading}
				>
					{isDownloading ? (
						<Button.Loader percentage={downloadProgress} />
					) : (
						<>
							<Button.Icon>
								<ArrowDownTrayIcon size={24} color="#000000" />
							</Button.Icon>
							<Button.Text>Descargar en PDF</Button.Text>
						</>
					)}
				</Button>
			</ScrollView>
		</>
	);
}
