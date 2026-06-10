import React, { createContext, useContext, useState, useCallback } from 'react';
import AlertComponent from '@/components/ui/AlertComponent';

export interface AlertOptions {
	message?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void;
	onCancel?: () => void;
	destructive?: boolean;
}

interface AlertContextType {
	showAlert: (title: string, options?: AlertOptions) => void;
	hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
	const [visible, setVisible] = useState(false);
	const [title, setTitle] = useState('');
	const [options, setOptions] = useState<AlertOptions | undefined>(undefined);

	const showAlert = useCallback((titleStr: string, opts?: AlertOptions) => {
		setTitle(titleStr);
		setOptions(opts);
		setVisible(true);
	}, []);

	const hideAlert = useCallback(() => {
		setVisible(false);
		// Run onCancel callback if user dismissed it without confirming
		if (options?.onCancel) {
			options.onCancel();
		}
	}, [options]);

	const handleConfirm = useCallback(() => {
		setVisible(false);
		if (options?.onConfirm) {
			options.onConfirm();
		}
	}, [options]);

	const handleDismiss = useCallback(() => {
		setVisible(false);
		if (options?.onCancel) {
			options.onCancel();
		}
	}, [options]);

	return (
		<AlertContext.Provider value={{ showAlert, hideAlert }}>
			{children}
			<AlertComponent
				visible={visible}
				title={title}
				message={options?.message}
				confirmText={options?.confirmText || 'Aceptar'}
				cancelText={options?.cancelText}
				destructive={options?.destructive}
				onConfirm={handleConfirm}
				onDismiss={handleDismiss}
			/>
		</AlertContext.Provider>
	);
}

export function useCustomAlert() {
	const context = useContext(AlertContext);
	if (!context) {
		throw new Error('useCustomAlert must be used within an AlertProvider');
	}
	return context;
}
