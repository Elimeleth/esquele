import { useCallback, useRef, useState } from 'react';

import { useSqlCompletion } from '@/hooks/useSqlCompletion';
import { useSqlCompletionStore } from '@/store/useSqlCompletionStore';
import { useConfigStore } from '@/store/useConfigStore';
import { useTablesInfoSelection } from '@/store/useTablesInfoSelection';
import { useLastQueries } from '@/store/useLastQueries';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import OnboardingDialog from '@/components/OnboardingDialog';
import TablesInfoDialog from '@/modules/config/components/TablesInfoDialog';
import { toast } from 'sonner';
import { Table } from 'lucide-react';

export default function FieldText() {
	const [text, setText] = useState('');
	const [aiConfig, dbConfig] = useConfigStore((state) => [
		state.aiConfig,
		state.dbConfig,
	]);
	const [update] = useSqlCompletionStore((state) => [state.updateAndIncrementPosition]);
	const [
		selections,
		getSelectionsStringMessage,
		getPromptSelectionsStringMessage,
		resetTables,
	] = useTablesInfoSelection((state) => [
		state.toUse,
		state.getSelectionsStringMessage,
		state.getPromptSelectionsStringMessage,
		state.reset,
	]);

	const [updateLastQueries] = useLastQueries((state) => [state.update]);

	const { execute, isPending } = useSqlCompletion(update);

	const onboardingDialogButtonRef = useRef<HTMLButtonElement | null>(null);
	const useTablesDialogButtonRef = useRef<HTMLButtonElement | null>(null);

	const handleSent = useCallback(() => {
		if (!aiConfig?.validate || !dbConfig?.validate) {
			onboardingDialogButtonRef?.current?.click();
			return;
		}

		if (text.length == 0) return;
		if (!selections) {
			toast('Debes proveer al menos una tabla para la consulta.', {
				action: {
					label: 'Usar tablas',
					onClick() {
						useTablesDialogButtonRef.current?.click();
					},
				},
			});
			return;
		}

		updateLastQueries(text);
		execute({
			query: text + ` ${getPromptSelectionsStringMessage()}`,
			type: 'completion',
		});
	}, [text, aiConfig?.validate, dbConfig?.validate, selections]);

	// const handleSentWithFilter = useCallback(
	// 	(filter: string) => {
	// 		if (!aiConfig?.validate || !dbConfig?.validate) {
	// 			onboardingDialogButtonRef?.current?.click();
	// 			return;
	// 		}

	// 		if (filter == text) return;

	// 		setText(filter);
	// 		removeFilter();

	// 		execute({
	// 			query: filter,
	// 			type: 'completion',
	// 		});
	// 	},
	// 	[text, aiConfig?.validate, dbConfig?.validate]
	// );

	// useEffect(() => {
	// 	if (filter.length == 0) return;

	// 	handleSentWithFilter(filter);
	// }, [filter]);

	return (
		<div className="w-full h-full relative overflow-hidden flex flex-col">
			<div className="flex flex-col gap-2 flex-1">
				<Textarea
					placeholder="Ej: Listame todos los usuarios con apellido Foo"
					className="h-full resize-none rounded-md border border-input bg-background p-2 text-foreground focus:border-primary focus:outline-none"
					value={text}
					onChange={({ target }) => setText(target.value)}
				/>

				<div className="h-[140px] max-h-[140px] overflow-y-auto rounded-md border border-input bg-background p-2 text-foreground">
					{selections ? (
						<p className="text-pretty text-sm break-words">
							{getSelectionsStringMessage().split(';').join(';\n')}
						</p>
					) : (
						<div className="w-full h-full flex flex-col gap-2 py-1">
							<div className="flex flex-row gap-1 items-center">
								<Table size={20} />
								<h4>Tablas</h4>
							</div>
							<p className="text-pretty text-xs break-words">
								Establece las tablas necesarias para la consulta
							</p>
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-row items-center justify-end gap-1 my-3">
				{selections ? (
					<Button
						disabled={isPending}
						variant="outline"
						className="h-8"
						onClick={() => resetTables()}>
						<span>Remover tablas</span>
					</Button>
				) : (
					<TablesInfoDialog isTableSelection>
						<Button
							ref={useTablesDialogButtonRef}
							disabled={isPending}
							variant="outline"
							className="h-8">
							<span>Usar tablas</span>
						</Button>
					</TablesInfoDialog>
				)}

				<Button
					disabled={!text.length || isPending}
					className="flex items-center justify-center h-8 px-5"
					onClick={() => handleSent()}>
					<span>{isPending ? 'Generando...' : 'Generar'}</span>
				</Button>
			</div>
			<OnboardingDialog>
				<button ref={onboardingDialogButtonRef} hidden></button>
			</OnboardingDialog>
		</div>
	);
}
