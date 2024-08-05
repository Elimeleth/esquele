import { useEffect } from 'react';
import { useConfigStore } from '@/store/useConfigStore';
import { useSystemStatus } from '@/store/useSystemStatus';
import { cn } from '@/lib/utils';

const message = {
	offline: 'Fuera de linea',
	initializing: 'Inicializando',
	online: 'En linea',
};

export default function SystemStatus() {
	const [aiConfig, dbConfig] = useConfigStore((state) => [
		state.aiConfig,
		state.dbConfig,
	]);

	const [status, updateSystem] = useSystemStatus((state) => [state.status, state.update]);

	useEffect(() => {
		if (!aiConfig?.validate) {
			updateSystem({ status: 'offline' });
			return;
		}

		if (!dbConfig?.validate) {
			updateSystem({ status: 'initializing' });
			return;
		}

		updateSystem({ status: 'online' });
	}, [aiConfig?.validate, dbConfig?.validate]);

	return (
		<div className="border px-3 py-1 flex flex-row gap-3 items-center text-center rounded-sm">
			<span
				className={cn(
					'h-2 w-2 rounded-full bg-green-400',
					status == 'offline' && 'bg-muted-foreground/80',
					status == 'initializing' && 'bg-blue-400'
				)}></span>
			<span className="text-sm font-medium">{message[status]}</span>
		</div>
	);
}
