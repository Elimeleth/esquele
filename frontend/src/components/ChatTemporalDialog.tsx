import React from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

type ChatTemporalDialogProps = {
	children: React.ReactNode;
};

export default function ChatTemporalDialog({ children }: ChatTemporalDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Chats temporales</DialogTitle>
					<DialogDescription>
						Información sobre la Temporalidad de las Sesiones
					</DialogDescription>
				</DialogHeader>
				<div className="px-2 text-xs">
					<p className="">
						Cada sesión en nuestra aplicación web es completamente temporal. Esto implica
						que:
					</p>
					<ul className="list-decimal space-y-2 my-3 text-xs">
						<li>
							<p>
								<strong>No se guardan registros de conexiones</strong>: Una vez que
								finaliza la sesión, no se almacena ninguna información sobre la conexión
								establecida con la base de datos o el proveedor de inteligencia artificial
								(AI).
							</p>
						</li>
						<li>
							<p>
								<strong>No se guardan respuestas previas</strong>: Las respuestas
								generadas durante la sesión no se almacenan. Esto significa que no hay
								registro de las interacciones anteriores una vez que la sesión se cierra.
							</p>
						</li>
						<li>
							<strong>No se guarda la configuración del cliente</strong>: Cualquier
							configuración realizada por el cliente, como la URL de la base de datos, el
							esquema, o las claves de API del proveedor de AI, no se retiene después de
							finalizar la sesión. En cada nueva sesión, el cliente debe volver a
							introducir esta información.
						</li>
					</ul>
					<p className="">
						Este enfoque garantiza que la privacidad y la seguridad de los datos del
						cliente se mantengan, ya que no se almacena información sensible entre
						sesiones.
					</p>
				</div>
				{/* <DialogFooter>
					<Button type="submit">Save changes</Button>
				</DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
}
