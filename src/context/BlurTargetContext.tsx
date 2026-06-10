import React, { createContext, useContext, useRef } from 'react';
import { View } from 'react-native';

const BlurTargetContext = createContext<React.RefObject<View | null> | null>(
	null,
);

export function BlurTargetProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const ref = useRef<View>(null);
	return (
		<BlurTargetContext.Provider value={ref}>
			{children}
		</BlurTargetContext.Provider>
	);
}

export function useBlurTarget() {
	const context = useContext(BlurTargetContext);
	return context || { current: null };
}
