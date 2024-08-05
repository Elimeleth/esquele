import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { useSqlCompletion } from '@/hooks/useSqlCompletion';
import { useSqlCompletionStore } from '@/store/useSqlCompletionStore';
import { useLastQueries } from '@/store/useLastQueries';
import { useConfigStore } from '@/store/useConfigStore';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import Loading from '@/components/loading/Loading';
import OnboardingDialog from '@/components/OnboardingDialog';

export default function FieldText() {
	const [text, setText] = useState('');
	const [aiConfig, dbConfig] = useConfigStore((state) => [
		state.aiConfig,
		state.dbConfig,
	]);
	const [update] = useSqlCompletionStore((state) => [state.updateAndIncrementPosition]);
	const [filter, removeFilter, updateLastQueries] = useLastQueries((state) => [
		state.filter,
		state.removeFilter,
		state.update,
	]);

	const { execute, isPending } = useSqlCompletion(update);

	const onboardingDialogButtonRef = useRef<HTMLButtonElement | null>(null);

	const handleSent = useCallback(() => {
		if (!aiConfig?.validate || !dbConfig?.validate) {
			onboardingDialogButtonRef?.current?.click();
			return;
		}

		if (text.length == 0) return;
		updateLastQueries(text);
		execute({
			query: text,
			type: 'completion',
		});
	}, [text, aiConfig?.validate, dbConfig?.validate]);

	const handleSentWithFilter = useCallback(
		(filter: string) => {
			if (!aiConfig?.validate || !dbConfig?.validate) {
				onboardingDialogButtonRef?.current?.click();
				return;
			}

			if (filter == text) return;

			setText(filter);
			removeFilter();

			execute({
				query: filter,
				type: 'completion',
			});
		},
		[text, aiConfig?.validate, dbConfig?.validate]
	);

	useEffect(() => {
		if (filter.length == 0) return;

		handleSentWithFilter(filter);
	}, [filter]);

	return (
		<div className="relative overflow-hidden">
			<Textarea
				placeholder="Ej: Listame todos los usuarios con apellido Foo"
				className="h-[100px] resize-none rounded-md border border-input bg-background p-2 text-foreground focus:border-primary focus:outline-none"
				value={text}
				onChange={({ target }) => setText(target.value)}
			/>
			<div className="absolute bottom-2 right-2">
				{isPending ? (
					<Loading withIcon={false} />
				) : (
					<Button
						className="
				text-muted
				bg-primary/80 hover:bg-primary
				shadow-sm shadow-primary/80
				flex items-center justify-center
				mt-3 ml-auto p-0 h-9 w-9 rounded-full"
						onClick={() => handleSent()}>
						<ArrowUp size={20} />
					</Button>
				)}
			</div>
			<OnboardingDialog>
				<button ref={onboardingDialogButtonRef} hidden></button>
			</OnboardingDialog>
		</div>
	);
}
