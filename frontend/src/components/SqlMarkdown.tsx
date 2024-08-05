import { useEffect, useState } from 'react';
import { formatDialect as format, postgresql, mysql } from 'sql-formatter';

import { Textarea } from './ui/textarea';

import { useConfigStore } from '@/store/useConfigStore';
import { useLastQueries } from '@/store/useLastQueries';
import { useDebounce } from '@/hooks/useDebounce';

import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { cn } from '@/lib/utils';
import type { SqlCompletationState } from '@/types/api-sql-completion';
import GoghIcon from './icons/Gogh';

type SqlMarkdownProps = {
	completion: SqlCompletationState;
	onChange: (value: string) => void;
};

export default function SqlMarkdown({ completion, onChange }: SqlMarkdownProps) {
	const [dbConfig] = useConfigStore((state) => [state.dbConfig]);
	const [query] = useLastQueries((state) => [state.query]);

	const [text, setText] = useState('');

	const { debounce } = useDebounce(700);

	useEffect(() => {
		try {
			const sql = format(completion.data, {
				dialect: dbConfig?.provider == 'postgres' ? postgresql : mysql,
				tabWidth: 4,
				keywordCase: 'upper',
				linesBetweenQueries: 2,
			});

			debounce(() => {
				setText(sql);
			});
		} catch (_) {}
	}, [completion.data]);

	return (
		<div className="flex flex-col gap-2 w-full">
			<Popover>
				<PopoverTrigger asChild>
					<div
						className={cn(
							'flex flex-row items-center gap-2 max-w-[85%]',
							completion.done && 'cursor-pointer'
						)}>
						<GoghIcon className="w-4 h-4" />
						<span className="text-xs text-muted-foreground/65 font-medium font-bold overflow-hidden text-ellipsis truncate">
							{completion.done ? query : completion.eventUpdate}
						</span>
					</div>
				</PopoverTrigger>
				{completion.done && (
					<PopoverContent>
						<div>
							<p className="text-xs text-muted-foreground/45 mb-1">Query: </p>
							<p className="text-[12.5px]">{query}</p>
						</div>
					</PopoverContent>
				)}
			</Popover>
			<Textarea
				className="w-full flex-1 border-none resize-none"
				value={text}
				onChange={({ target }) => {
					setText(target.value);

					debounce(() => {
						onChange(target.value);
					});
				}}
			/>
		</div>
	);
}
