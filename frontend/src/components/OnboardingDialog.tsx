import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import { useConfigStore } from '@/store/useConfigStore';

import AIForm from '@/modules/config/components/AIForm';
import DBForm from '@/modules/config/components/DBForm';

export default function OnboardingDialog({
	children,
}: React.HTMLAttributes<HTMLDivElement>) {
	const [currentStep, setCurrentStep] = useState(1);
	const [aiConfig, dbConfig] = useConfigStore((state) => [
		state.aiConfig,
		state.dbConfig,
	]);

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!aiConfig?.validate) {
			setCurrentStep(0);
			return;
		}

		if (!dbConfig?.validate) {
			setCurrentStep(1);
			return;
		}

		setOpen(false);
		return;
	}, [aiConfig?.validate, dbConfig?.validate]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="w-full max-w-md rounded-2xl bg-background p-6 shadow-lg min-h-64">
				<div className="grid gap-6">
					{currentStep === 0 && (
						<div className="flex flex-col gap-4">
							<div>
								<h2 className="text-2xl font-bold">Configuración AI</h2>
								<p className="text-muted-foreground">
									Configura el modelo y proveedor ideal para ti.
								</p>
							</div>
							<AIForm />
						</div>
					)}
					{currentStep === 1 && (
						<div className="flex flex-col gap-4">
							<div>
								<h2 className="text-2xl font-bold">Base de datos</h2>
								<p className="text-muted-foreground">
									Establece la conexión a tu base de datos
								</p>
							</div>
							<DBForm />
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
