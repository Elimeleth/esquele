import { useEffect } from 'react';
import { useConfigStore } from '@/store/useConfigStore';
import { useSystemStatus } from '@/store/useSystemStatus';
import { cn } from '@/lib/utils';

import { AnimatePresence, Variants, motion } from 'framer-motion';

const message = {
	offline: 'Fuera de linea',
	initializing: 'Inicializando',
	online: 'En linea',
};

const variants: Variants = {
	open: {
		position: 'fixed',
		top: '.5rem',
		right: '.5rem',
		zIndex: 2020,
		transition: {
			duration: 1,
			bounce: 200,
			damping: 300,
		},
	},
	close: {
		position: 'static',
		transition: {
			duration: 1,
			bounce: 200,
			damping: 300,
		},
		zIndex: 'auto',
	},
};

export default function SystemStatus() {
	const [aiConfig, dbConfig, isValidatingDb] = useConfigStore((state) => [
		state.aiConfig,
		state.dbConfig,
		state.isValidatingDb,
	]);

	const [status, updateSystem] = useSystemStatus((state) => [state.status, state.update]);

	useEffect(() => {
		if (isValidatingDb) {
			updateSystem({ status: 'initializing' });
			return;
		}
		if (!aiConfig?.validate && !dbConfig?.validate) {
			updateSystem({ status: 'offline' });
			return;
		}

		updateSystem({ status: 'online' });
	}, [aiConfig?.validate, dbConfig?.validate, isValidatingDb]);

	return (
		<AnimatePresence>
			<motion.div
				animate={isValidatingDb ? 'open' : 'close'}
				variants={variants}
				className={cn(
					'border px-3 py-1 flex flex-row gap-3 items-center text-center rounded-sm',
					isValidatingDb && 'fixed top-2 right-2 z-[20000]'
				)}>
				<span
					className={cn(
						'h-2 w-2 rounded-full bg-green-400',
						status == 'offline' && 'bg-muted-foreground/80',
						status == 'initializing' && 'bg-blue-400'
					)}></span>
				<span className="text-sm font-medium">{message[status]}</span>
			</motion.div>
		</AnimatePresence>
	);
}
