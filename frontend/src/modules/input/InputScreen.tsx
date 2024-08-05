import React from 'react';

import { Card } from '@/components/ui/card';

import { cn } from '@/lib/utils';

import FieldText from './components/FieldText';
import BoxSql from './components/BoxSql';
// import LastQueries from '@/components/LastQueries';
import { useSqlCompletionStore } from '@/store/useSqlCompletionStore';
import { Button } from '@/components/ui/button';
import { useLastQueries } from '@/store/useLastQueries';
import { useTablesInfoSelection } from '@/store/useTablesInfoSelection';

type Props = React.HTMLAttributes<HTMLElement>;

export default function InputScreen({ className, ...props }: Props) {
	const [completions, updateWithPosition] = useSqlCompletionStore((state) => [
		state.completions,
		state.updateWithPosition,
	]);

	const [query, resetQuery] = useLastQueries((state) => [state.query, state.reset]);
	const [resetTables] = useTablesInfoSelection((state) => [state.reset]);

	const handleNewQuery = () => {
		resetQuery();
		resetTables();
	};
	return (
		<Card {...props} className={cn('w-full p-0 shadow-sm flex flex-col', className)}>
			<div className="flex flex-row items-center justify-between px-4 pt-4 mb-2">
				<h2 className="text-lg font-medium">Consulta</h2>
				{!completions[0]?.isPending && query.length > 0 && (
					<Button variant="outline" className="h-8" onClick={() => handleNewQuery()}>
						<span>Nueva consulta</span>
					</Button>
				)}
			</div>
			<div className="w-full flex flex-col flex-1 gap-1">
				{completions[0]?.isPending || !query.length ? (
					<div className="w-full px-4 flex flex-1">
						<FieldText />
					</div>
				) : (
					<div className="flex flex-1 px-4 pb-4">
						{completions.length > 0 && (
							<BoxSql
								completion={completions[0]}
								onChange={(value) => {
									updateWithPosition({
										data: value,
									});
								}}
							/>
						)}
					</div>
				)}
			</div>
		</Card>
	);
}
