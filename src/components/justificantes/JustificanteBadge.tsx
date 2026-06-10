import React from 'react';
import { View, Text } from 'react-native';
import {
	HeartIcon,
	BriefcaseIcon,
	ExclamationTriangleIcon,
} from 'react-native-heroicons/outline';

export type FractionType = 'I' | 'II' | 'III';

interface JustificanteBadgeProps {
	fraction: FractionType;
	className?: string;
}

export default function JustificanteBadge({
	fraction,
	className = '',
}: JustificanteBadgeProps) {
	let bgClass = 'bg-not-pink';
	let Icon = HeartIcon;

	if (fraction === 'II') {
		bgClass = 'bg-simple-blue';
		Icon = BriefcaseIcon;
	} else if (fraction === 'III') {
		bgClass = 'bg-simple-orange';
		Icon = ExclamationTriangleIcon;
	}

	return (
		<View
			className={`${bgClass} flex-row items-center gap-2 self-start px-2 py-1 ${className}`}
		>
			<Icon size={20} color="#000000" />
			<Text className="list-title text-black">{fraction}</Text>
		</View>
	);
}
