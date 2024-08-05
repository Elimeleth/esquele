import React from 'react';
import type { SVGProps } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useSqlGenerationStore } from '@/store/useSqlGenerationStore';

import GoghImage from '@assets/ic-gogh.png';
import Loading from '@/components/loading/Loading';
import MdxWrapper from '@/components/MdxWrapper';

type Props = React.HTMLAttributes<HTMLElement>;

export default function OutputScreen({ className, ...props }: Props) {
	const [event, data, isPending] = useSqlGenerationStore((state) => [
		state.eventUpdate,
		state.data,
		state.isPending,
	]);

	return (
		<Card
			{...props}
			className={cn(
				'w-full py-4 px-0 shadow-sm flex flex-col max-w-full overflow-hidden overflow-y-auto',
				className
			)}>
			<h2 className="px-4 mb-0 text-lg font-medium">Datos</h2>
			<div className="px-4 py-2 flex flex-1 justify-start items-start overflow-auto rounded-md bg-background text-foreground">
				{isPending && <Loading />}
				{!isPending && (
					<>
						{event.length > 0 || data.length > 0 ? (
							<Content data={data} event={event} />
						) : (
							<EmptyState />
						)}
					</>
				)}
			</div>
		</Card>
	);
}

function Content({ event, data }: { event: string; data: string }) {
	return (
		<div className="flex flex-col flex-1 justify-start items-start gap-2 text-sm overflow-hidden">
			<div className="flex flex-row gap-2">
				<img src={GoghImage} className="w-4 h-4" />
				<p className="text-xs text-muted-foreground/65 font-medium">{event}</p>
			</div>
			<MdxWrapper content={data} />
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center text-sm flex-1 px-2">
			<InboxIcon className="h-10 w-10 text-muted-foreground mb-2" />
			<h3 className="text-lg font-bold mb-3">Resultados</h3>
			<p className="text-muted-foreground text-center max-w-md">
				Aqui podras visualizar el resultado de tus datos al ejecutar el Sql
			</p>
		</div>
	);
}

function InboxIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.2"
			strokeLinecap="round"
			strokeLinejoin="round">
			<polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
			<path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
		</svg>
	);
}
