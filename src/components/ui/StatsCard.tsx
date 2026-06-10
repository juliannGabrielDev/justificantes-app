import { cn } from '@/utils/cn';
import { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { ListBulletIcon } from 'react-native-heroicons/outline';

interface StatsCardProps {
	className?: string;
	badgeClassName?: string;
	icon?: ReactNode;
	amount?: string | number;
	auxText?: string;
}

export default function StatsCard({
	className,
	badgeClassName,
	icon,
	amount = 12,
	auxText = 'en Total',
}: StatsCardProps) {
	return (
		<View
			className={cn(
				'bg-surface-base gap-3 rounded-[20px] p-3',
				className,
			)}
		>
			{/* Badge */}
			<View
				className={cn(
					'bg-simple-blue self-start rounded-lg p-2',
					badgeClassName,
				)}
			>
				{icon ?? <ListBulletIcon size={24} color="#000000" />}
			</View>
			<Text className="list-item-title">
				<Text className="page-title">{amount}</Text> {auxText}
			</Text>
		</View>
	);
}
