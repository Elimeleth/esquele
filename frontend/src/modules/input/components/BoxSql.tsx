import { useCallback } from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

import SqlMarkdown from '@/components/SqlMarkdown';

import { useSqlCompletion } from '@/hooks/useSqlCompletion';
import { useSqlGenerationStore } from '@/store/useSqlGenerationStore';
import { useLastQueries } from '@/store/useLastQueries';
import { useCopyText } from '@/hooks/useCopyText';
import Loading from '@/components/loading/Loading';
import type { SqlCompletationState } from '@/types/api-sql-completion';

type BoxSqlProps = {
	completion: SqlCompletationState;
	onChange: (value: string) => void;
};

export default function BoxSql({ completion, onChange }: BoxSqlProps) {
	const [update] = useSqlGenerationStore((state) => [state.update]);
	const [query] = useLastQueries((state) => [state.query]);

	const { onCopy, isCopy } = useCopyText();

	const {
		execute,
		typeCompletion,
		isPending: isPendingSqlCompletion,
	} = useSqlCompletion(update);

	const handleExecution = useCallback(
		(type: any) => {
			execute({
				query,
				type,
				sql: completion.data,
			});
		},
		[completion.data, query]
	);

	return (
		<>
			{completion.event.length > 0 && !completion.isPending && (
				<div
					className="
				border border-input rounded-md
				flex flex-col flex-1 relative 
				w-full min-h-full shadow-sm h-auto overflow-hidden">
					<button
						className="absolute top-2 right-1 z-20 px-2
                    outline-none shadow-none bg-transparent
                    "
						onClick={() => onCopy(completion.data)}>
						{isCopy ? <Check size={14} /> : <Copy size={14} />}
					</button>
					<div className="flex flex-1 relative overflow-y-auto px-4 py-2 max-w-full">
						<SqlMarkdown completion={completion} onChange={onChange} />
					</div>
					<div className="w-full flex flex-row items-center justify-end gap-2 p-2">
						<Button
							variant="outline"
							disabled={isPendingSqlCompletion && typeCompletion == 'execute'}
							className="h-8 text-xs justify-between items-center"
							onClick={() => handleExecution('explain')}>
							{isPendingSqlCompletion && typeCompletion == 'explain' ? (
								<>
									<span className="">Explicando</span>
									<Loading withIcon={false} size="8px" />
								</>
							) : (
								<span>Explicar</span>
							)}
						</Button>
						<Button
							variant={
								isPendingSqlCompletion && typeCompletion == 'execute'
									? 'outline'
									: 'default'
							}
							disabled={isPendingSqlCompletion && typeCompletion == 'explain'}
							className="h-8 text-xs justify-between items-center"
							onClick={() => handleExecution('execute')}>
							{isPendingSqlCompletion && typeCompletion == 'execute' ? (
								<>
									<span className="">Ejecutando</span>
									<Loading withIcon={false} size="8px" />
								</>
							) : (
								<span>Ejecutar</span>
							)}
						</Button>
					</div>
				</div>
			)}
		</>
	);
}
