import React from 'react';

import { Card } from '@/components/ui/card';

import { cn } from '@/lib/utils';

import FieldText from './components/FieldText';
import BoxSql from './components/BoxSql';
import LastQueries from '@/components/LastQueries';
import { useSqlCompletionStore } from '@/store/useSqlCompletionStore';

type Props = React.HTMLAttributes<HTMLElement>;

export default function InputScreen({ className, ...props }: Props) {
	const [completions, updateWithPosition] = useSqlCompletionStore((state) => [
		state.completions,
		state.updateWithPosition,
	]);

	return (
		<Card {...props} className={cn('w-full p-0 shadow-sm flex flex-col', className)}>
			<h2 className="mb-1 text-lg font-medium px-4 pt-4">Consulta</h2>
			<div className="w-full flex flex-col flex-1 gap-1">
				<div className="w-full px-4">
					<FieldText />
				</div>
				<LastQueries />
				{/* <div className="flex flex-col flex-1 gap-y-4 max-h-[340px] overflow-hidden overflow-y-auto snap-y snap-mandatory px-4 pb-4">
					{completions.map((completion) => (
						<BoxSql
							completion={completion}
							onChange={(value) => {
								updateWithPosition({
									data: value,
								});
							}}
						/>
					))}
				</div> */}
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
			</div>
		</Card>
	);
}
