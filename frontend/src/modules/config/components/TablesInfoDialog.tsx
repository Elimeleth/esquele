import React, { useCallback, useState } from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import { useTablesInfoStore } from '@/store/useTableInfoStore';
import { TableInfoElement } from '@/types/api-table-info';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Checkbox } from '@/components/ui/checkbox';
import { useTablesInfoSelection } from '@/store/useTablesInfoSelection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

type TablesInfoDialogProps = {
	isTableSelection?: boolean;
	children: React.ReactNode;
};

const useSearchTables = (search: string, tables: TableInfoElement[]) => {
	const handleSearchTables = useCallback(() => {
		if (!search.length) {
			return tables;
		}

		return tables.filter((t) => t.tableName.toLowerCase().includes(search.toLowerCase()));
	}, [search, tables]);

	return { handleSearchTables };
};

export default function TablesInfoDialog({
	children,
	isTableSelection = false,
}: TablesInfoDialogProps) {
	const [search, setSearch] = useState<string>('');
	const [tables] = useTablesInfoStore((state) => [state.tables]);
	const { handleSearchTables } = useSearchTables(search, tables);

	const [selections, update] = useTablesInfoSelection((state) => [
		state.selections,
		state.update,
	]);

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] max-h-[560px] flex flex-col">
				<DialogHeader>
					<DialogTitle>Información de tablas</DialogTitle>
					<DialogDescription className="text-sm">
						Esta información ha sido cargada a través de la base de datos configurada.
					</DialogDescription>
				</DialogHeader>
				<Input
					className="bg-transparent h-9 w-full"
					placeholder="Buscar tabla"
					value={search}
					onChange={({ target }) => {
						setSearch(target.value);
					}}
				/>
				<Tables tables={handleSearchTables()} isTableSelection={isTableSelection} />
				{isTableSelection && selections.size > 0 && (
					<DialogFooter>
						<Button
							variant="outline"
							className="h-8"
							onClick={() => {
								update({ toUse: true });
							}}>
							<span>Usar tablas</span>
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}

type TablesProps = {
	tables: TableInfoElement[];
	isTableSelection: boolean;
};

function Tables({ tables, isTableSelection }: TablesProps) {
	return (
		<div
			className={cn(
				'flex flex-col gap-y-2 flex-1 h-full max-h-[480px] overflow-y-auto',
				tables.length > 7 && 'pr-2'
			)}>
			{tables.map((table) => (
				<DBTable
					key={table.tableName}
					table={table}
					isTableSelection={isTableSelection}
				/>
			))}
		</div>
	);
}

type DBTableProps = {
	table: TableInfoElement;
	isTableSelection: boolean;
};

export function DBTable({ table, isTableSelection }: DBTableProps) {
	const [enabled, setEnabled] = useState(false);

	const [addSelection, removeSelectionValueFromKey, removeSelection] =
		useTablesInfoSelection((state) => [
			state.addSelection,
			state.removeSelectionValueFromKey,
			state.removeSelection,
		]);

	const handleUpdateTableSelection = (enable: boolean, value: string) => {
		if (!enable) {
			removeSelectionValueFromKey(table.tableName, value);
			return;
		}

		addSelection(table.tableName, value);
	};

	return (
		<div className="flex flex-col gap-y-2">
			<Accordion type="single" collapsible>
				<AccordionItem value={table.tableName}>
					<div className="flex flex-row gap-2 items-center">
						{isTableSelection && (
							<Checkbox
								checked={enabled}
								onCheckedChange={(checked) => {
									setEnabled(checked as boolean);
									if (!checked) {
										removeSelection(table.tableName);
									}
								}}
							/>
						)}
						<div className="w-full flex flex-1">
							<AccordionTrigger>
								<p className="text-base font-semibold">Tabla: {table.tableName}</p>
							</AccordionTrigger>
						</div>
					</div>

					<AccordionContent>
						<Table>
							<TableHeader className="bg-foreground/20">
								<TableRow>
									<TableHead className="text-accent-foreground">Columna</TableHead>
									<TableHead className="text-accent-foreground">Tipo de dato</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{table.columns.map((column) => (
									<TableRow key={column.columnName}>
										<TableCell className="font-medium flex flex-row items-center gap-2">
											{enabled && (
												<Checkbox
													onCheckedChange={(checked) => {
														handleUpdateTableSelection(
															Boolean(checked),
															column.columnName
														);
													}}
												/>
											)}
											{column.columnName}
										</TableCell>
										<TableCell>
											{column.dataType} {column.isNullable ? ' (Nullable)' : ''}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						{/* <Separator className="mb-2" /> */}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
