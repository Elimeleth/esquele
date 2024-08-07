import React, { useEffect } from 'react';

import { useAPIConfs } from '@/hooks/useAPIConfs';
import { useAPIConfsStore } from '@/store/useAPIConfsStore';
import { useConfigStore } from '@/store/useConfigStore';
import { useGetTableInfo } from '@/hooks/useTableInfo';
import { useTablesInfoStore } from '@/store/useTableInfoStore';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Brain, Check, Database, Info, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { cn } from '@/lib/utils';

import ChatTemporalDialog from '@/components/ChatTemporalDialog';
import AIFormDialog from './components/AIFormDialog';
import DBFormDialog from './components/DBFormDialog';
import AuthorsSection from '@/components/AuthorsSection';
import TablesInfoDialog from './components/TablesInfoDialog';

type Props = React.HTMLAttributes<HTMLElement>;

export default function ConfigScreen({ className, ...props }: Props) {
	const { data } = useAPIConfs();
	const [update] = useAPIConfsStore((state) => [state.update]);
	const [tables] = useTablesInfoStore((state) => [state.tables]);
	const { execute, isPending, error, data: tablesData } = useGetTableInfo();
	const [aiConfig, dbConfig] = useConfigStore((state) => [
		state.aiConfig,
		state.dbConfig,
	]);

	useEffect(() => {
		if (!data) return;

		update({
			aiConnection: data.configurations['ai-connection'],
			dbConnection: data.configurations['db-connection'],
		});
	}, [data]);

	useEffect(() => {
		if (isPending || error || tablesData) return;
		if (!dbConfig?.validate) return;

		if (tables.length > 0) return;

		execute({
			provider: dbConfig!.provider,
			schema: dbConfig!.schema,
			type: dbConfig!.type,
			url: dbConfig!.url,
		});
	}, [aiConfig, dbConfig, tables]);

	return (
		<Card {...props} className={cn('w-full p-0 shadow-sm', className)}>
			<div className="mb-4 p-4 pb-0">
				<h2 className="mb-2 text-lg font-medium">Configuración</h2>
				<div className="flex items-center space-x-2">
					<ChatTemporalDialog>
						<Button variant="ghost" className="h-max w-max m-0 p-0">
							<Info size={15} />
						</Button>
					</ChatTemporalDialog>
					<Label htmlFor="temporal-mode" className="text-sm flex-1">
						Chat temporal
					</Label>
					<Switch id="temporal-mode" checked />
				</div>
			</div>
			<div className="flex flex-col gap-y-3 flex-1 p-4 pt-1  overflow-y-auto">
				<p className="text-[11px]">
					Configura las variables requeridas para el funcionamiento del entorno
				</p>
				<AIFormDialog>
					<Button variant="outline" className="justify-start items-center">
						<Brain size={20} className="mr-2" />
						<span className="text-left flex-1">AI</span>
						{aiConfig?.validate && <Check size={14} className="text-primary" />}
					</Button>
				</AIFormDialog>
				<Separator />
				<DBFormDialog>
					<Button
						variant="outline"
						disabled={!aiConfig?.validate}
						className="h-auto justify-start items-center">
						<Database size={20} className="mr-2" />
						<span className="text-left flex-1">Base de datos</span>
						{dbConfig?.validate && <Check size={14} className="text-primary" />}
					</Button>
				</DBFormDialog>
				<div className="flex mt-4 w-full">
					{tables.length > 0 && (
						<TablesInfoDialog>
							<Button
								variant="outline"
								disabled={!aiConfig?.validate}
								className="w-full h-auto justify-start items-center">
								<Table size={20} className="mr-2" />
								<span className="text-left flex-1">Ver tablas</span>
								<span>{tables.length}</span>
							</Button>
						</TablesInfoDialog>
					)}
				</div>
			</div>
			<AuthorsSection />
		</Card>
	);
}
