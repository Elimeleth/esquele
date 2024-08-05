import React from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import AIForm from './AIForm';

type AIFormDialogProps = {
	children: React.ReactNode;
};

export default function AIFormDialog({ children }: AIFormDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Configuración AI</DialogTitle>
					<DialogDescription className="text-sm">
						Configura el modelo y proveedor ideal para ti.
					</DialogDescription>
				</DialogHeader>
				<AIForm />
			</DialogContent>
		</Dialog>
	);
}
