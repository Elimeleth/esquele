import { useLastQueries } from '@/store/useLastQueries';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LastQueries() {
	const [queries, filterQuery, removeQuery] = useLastQueries((state) => [
		state.queries,
		state.filterQuery,
		state.removeQuery,
	]);

	return (
		<Carousel
			opts={{
				align: 'start',
			}}
			className="w-full px-4">
			<CarouselContent>
				{queries.map((q, index) => (
					<CarouselItem key={index} className="max-w-[160px]">
						<QueryCard
							key={q}
							query={q}
							onFilter={() => filterQuery(q)}
							onRemove={() => removeQuery(index)}
						/>
					</CarouselItem>
				))}
			</CarouselContent>
		</Carousel>
	);
}

type QueryCardProps = {
	query: string;
	isActive?: boolean;
	onFilter: () => void;
	onRemove: () => void;
};

function QueryCard({ query, isActive = false, onFilter, onRemove }: QueryCardProps) {
	return (
		<div
			className={cn(
				'cursor-pointer max-w-[160px] px-2 py-1 border my-1 border-input rounded-sm overflow-hidden flex flex-row justify-between items-center',
				isActive && 'bg-muted-foreground/10'
			)}>
			<p className="w-full text-xs text-ellipsis truncate" onClick={() => onFilter()}>
				{query}
			</p>
			<button className="outline-none border-none shadow-none" onClick={() => onRemove()}>
				<X size={14} />
			</button>
		</div>
	);
}
