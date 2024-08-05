import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTrigger,
} from '@/components/ui/sheet';
import ConfigScreen from '@/modules/config/ConfigScreen';
import { ArrowLeft, Menu } from 'lucide-react';

export default function EsqueleConfigSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="h-8 p-2">
					<Menu size={20} />
				</Button>
			</SheetTrigger>
			<SheetContent
				showCloseButton={false}
				side="left"
				className="flex flex-col gap-1 h-full p-0">
				<SheetHeader className="h-max items-start px-2">
					<SheetClose asChild>
						<Button variant="ghost" className="p-0 m-0 hover:bg-transparent">
							<ArrowLeft size={20} className="text-muted-foreground" />
						</Button>
					</SheetClose>
				</SheetHeader>
				<ConfigScreen className="flex flex-col flex-1 border-none shadow-none w-full" />
			</SheetContent>
		</Sheet>
	);
}
