import { useCallback, useEffect, useRef, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { useAPIConfsStore } from '@/store/useAPIConfsStore';
import { useConfigStore } from '@/store/useConfigStore';
import { useValidateAIConnection } from '@/hooks/useValidateAIConnection';

import { AIModelsCombobox } from '@/components/AIModelsCombobox';
import { DialogClose } from '@/components/ui/dialog';

const formSchema = z.object({
	apikey: z.string().min(2, {
		message: 'Api Key must be at least 2 characters.',
	}),
	provider: z.string().min(2, {
		message: 'Provider must be at least 2 characters.',
	}),
	model_name: z.string().min(2, {
		message: 'Model must be at least 2 characters.',
	}),
});

type AIFormType = z.infer<typeof formSchema>;

export default function AIForm() {
	const [aiConnection] = useAPIConfsStore((state) => [state.aiConnection]);
	const [aiConfig] = useConfigStore((state) => [state.aiConfig]);
	const [provider, setProvider] = useState('');

	const { data, isPending, validate } = useValidateAIConnection();

	const closeButtonRef = useRef<HTMLButtonElement | null>(null);

	const form = useForm<AIFormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			apikey: aiConfig?.apikey,
			provider: aiConfig?.provider,
			model_name: aiConfig?.model_name,
		},
	});

	const handleSubmit = useCallback(
		(data: AIFormType) => {
			if (isPending) return;
			validate({
				provider: data.provider,
				apikey: data.apikey,
				model_name: data.model_name,
			});
		},
		[isPending]
	);

	useEffect(() => {
		if (!data) return;

		closeButtonRef.current?.click();
	}, [data]);

	if (!aiConnection.length) {
		return (
			<div className="flex flex-col items-center gap-4 px-1 text-center">
				<p>
					Vaya, parece que la información necesaria no se pudo cargar. Por favor, presiona
					actualizar.
				</p>
				<Button
					variant="outline"
					className="max-w-[240px]"
					onClick={() => {
						location.reload();
					}}>
					<span>Actualizar</span>
				</Button>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form className="" onSubmit={form.handleSubmit(handleSubmit)}>
				<div className="flex flex-col gap-4 px-1">
					<FormField
						control={form.control}
						name="model_name"
						render={(_) => (
							<FormItem className="flex flex-col gap-3 px-1">
								<div className="flex flex-col gap-2">
									<FormLabel htmlFor="model">Modelo</FormLabel>
									<FormControl>
										<AIModelsCombobox
											defaultValue={aiConfig?.model_name ?? ''}
											models={aiConnection}
											onChange={(provider, model) => {
												form.reset();
												setProvider(provider);
												form.setValue('provider', provider);
												form.setValue('model_name', model);
											}}
										/>
									</FormControl>
								</div>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="apikey"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-3 px-1">
								<div className="flex flex-col gap-2">
									<FormLabel htmlFor="model">API Key</FormLabel>
									<FormControl>
										<Input
											placeholder={
												aiConnection.find((p) => p.provider == provider)?.apikey
													.placeholder
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
							variant="ghost"
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
