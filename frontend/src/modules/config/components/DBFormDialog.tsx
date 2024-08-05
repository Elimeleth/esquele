import React from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import DBForm from './DBForm';

type AIFormDialogProps = {
	children: React.ReactNode;
};

export default function DBFormDialog({ children }: AIFormDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Base de datos</DialogTitle>
					<DialogDescription>
						<p> Establece la conexión a tu base de datos</p>
						<p className="text-xs mt-2">
							Este proceso puede tardar aproximadamente 2 minutos mientras creamos un
							índice con la metadata de tus tablas.
						</p>
					</DialogDescription>
				</DialogHeader>
				<DBForm />
			</DialogContent>
		</Dialog>
	);
}
