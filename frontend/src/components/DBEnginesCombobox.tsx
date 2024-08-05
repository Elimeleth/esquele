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

import type { DBConnection } from '@/types/api-confs';

type Props = {
	defaultValue?: string;
	engines: DBConnection[];
	onChange: (engine: string) => void;
};

export function DBEngineCombobox({ defaultValue = '', engines, onChange }: Props) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState(defaultValue);

	React.useEffect(() => {
		if (engines.length == 0) return;
		if (defaultValue.length > 0) {
			const engine = engines.find((e) => e.provider == defaultValue);
			if (!engine) {
				return;
			}
			setValue(engine.provider);
			onChange(engine.provider);
			return;
		}
		setValue(engines[0].provider);
		onChange(engines[0].provider);
	}, [engines]);

	React.useEffect(() => {
		setValue(defaultValue);
	}, [defaultValue]);

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
							{engines.map((engine) => (
								<CommandItem
									key={engine.provider}
									value={engine.provider}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? '' : currentValue);
										setOpen(false);
										onChange(engine.provider);
									}}>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === engine.provider ? 'opacity-100' : 'opacity-0'
										)}
									/>
									{engine.provider}
								</CommandItem>
							))}
						</CommandList>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
