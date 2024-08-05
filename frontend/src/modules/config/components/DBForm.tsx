import { useCallback, useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useAPIConfsStore } from '@/store/useAPIConfsStore';
import { useConfigStore } from '@/store/useConfigStore';
import { useValidateDBConnection } from '@/hooks/useValidateDBConnection';

import { DBEngineCombobox } from '@/components/DBEnginesCombobox';
import { DialogClose } from '@/components/ui/dialog';

const formSchema = z.object({
	url: z.string().min(2, {
		message: 'Url must be at least 2 characters.',
	}),
	schema: z.string().min(2, {
		message: 'Schema be at least 2 characters.',
	}),
});

type DBFormType = z.infer<typeof formSchema>;

export default function DBForm() {
	const [dbConnection] = useAPIConfsStore((state) => [state.dbConnection]);
	const [dbConfig] = useConfigStore((state) => [state.dbConfig]);

	const [engine, setEngine] = useState('');
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);

	const { data, isPending, validate } = useValidateDBConnection();

	const form = useForm<DBFormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			url: dbConfig?.url,
			schema: dbConfig?.schema,
		},
	});

	const handleSubmit = useCallback(
		(data: DBFormType) => {
			if (isPending) return;
			validate({
				provider: engine.toLowerCase(),
				type: engine.toLowerCase() as any,
				schema: data.schema,
				url: data.url,
			});
		},
		[engine, isPending]
	);

	useEffect(() => {
		if (!data) return;

		closeButtonRef.current?.click();
	}, [data]);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<div className="flex flex-col gap-3 px-1">
					<div className="w-full flex flex-col gap-2">
						<Label htmlFor="model">Motor</Label>

						<DBEngineCombobox
							defaultValue={dbConfig?.provider}
							engines={dbConnection}
							onChange={(value) => {
								form.reset();
								setEngine(value);
							}}
						/>
					</div>
					<FormField
						control={form.control}
						name="url"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-3 px-1">
								<div className="flex flex-col gap-2">
									<FormLabel htmlFor="model">Url</FormLabel>
									<FormControl>
										<Input
											placeholder={
												dbConnection.find((p) => p.provider == engine)?.url.placeholder
											}
											{...field}
											enabledObscureText
										/>
									</FormControl>
								</div>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="schema"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-3 px-1">
								<div className="flex flex-col gap-2">
									<FormLabel htmlFor="model">Esquema</FormLabel>
									<FormControl>
										<Input
											placeholder={
												dbConnection.find((p) => p.provider == engine)?.schema.placeholder
											}
											{...field}
											enabledObscureText
										/>
									</FormControl>
								</div>
							</FormItem>
						)}
					/>
				</div>
				<div className="flex flex-row justify-end gap-3 mt-5">
					<DialogClose asChild>
						<Button
							ref={closeButtonRef}
							type="button"
							disabled={isPending}
							variant="destructive"
							className="h-8">
							<span>Cancelar</span>
						</Button>
					</DialogClose>

					<Button type="submit" className="h-8">
						<span>{isPending ? 'Validando...' : 'Validar'}</span>
					</Button>
				</div>
			</form>
		</Form>
	);
}
