import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import type { AIConnection } from '@/types/api-confs';
import { Label } from './ui/label';

type Props = {
	defaultValue?: string;
	models: AIConnection[];
	onChange: (provider: string, model: string) => void;
};

export function AIModelsCombobox({ defaultValue = '', models, onChange }: Props) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState(defaultValue);

	React.useEffect(() => {
		if (models.length == 0) return;
		if (defaultValue.length > 0) {
			const model = models.find((m) => m.model_names.includes(defaultValue));
			if (!model) {
				return;
			}
			setValue(model.provider);
			onChange(model.provider, model.model_names.find((m) => m == defaultValue)!);
			return;
		}
		setValue(models[0].provider);
		onChange(models[0].provider, models[0].model_names[0]);
	}, [models]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between">
					{value || 'Seleciona un modelo...'}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[240px] p-0 z-50">
				<Command>
					<CommandInput placeholder="Buscar modelo..." />
					<CommandEmpty>Modelo no disponible</CommandEmpty>

					<CommandGroup>
						<CommandList className="text-primary">
							{models.map((model) => (
								<>
									<Label
										key={model.provider}
										className="pl-2 text-sm text-muted-foreground/90 font-medium">
										{model.provider}
									</Label>
									{model.model_names.map((name, index) => (
										<CommandItem
											key={`${name}-${index}`}
											value={name}
											onSelect={(currentValue) => {
												setValue(currentValue === value ? '' : currentValue);
												setOpen(false);
												onChange(model.provider, name);
											}}>
											<Check
												key={`check-${name}-${index}`}
												className={cn(
													'mr-2 h-4 w-4',
													value === name ? 'opacity-100' : 'opacity-0'
												)}
											/>
											{name}
										</CommandItem>
									))}
								</>
							))}
						</CommandList>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
