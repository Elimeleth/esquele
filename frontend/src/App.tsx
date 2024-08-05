import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

import ConfigScreen from './modules/config/ConfigScreen';
import InputScreen from './modules/input/InputScreen';
import OutputScreen from './modules/output/OutputScreen';

import SystemStatus from './components/SystemStatus';
import EsqueleConfigSheet from './components/EsqueleConfigSheet';
import DisclaimerDialog from './components/DisclaimerDialog';

import { Info } from 'lucide-react';
import DarkModeButton from './components/DarkModeButton';
import GoghIcon from './components/icons/Gogh';

const queryClient = new QueryClient();

export default function App() {
	return (
		<>
			<Toaster />
			<section className="app-container">
				<QueryClientProvider client={queryClient}>
					<div className="flex flex-col flex-1 gap-2.5 w-full h-full max-h-full 2xl:max-w-7xl mx-auto px-2 md:px-5 2xl:px-6 2xl:p-6">
						<header className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="md:hidden">
									<EsqueleConfigSheet />
								</div>
								<GoghIcon className="max-[768px]:hidden size-[25px]" />
								<h1 className="text-lg md:text-2xl font-bold">Esquele</h1>
							</div>
							<div className="flex flex-row gap-2">
								<SystemStatus />
								<DarkModeButton />
							</div>
						</header>

						<div className="flex flex-col md:flex-row flex-1 gap-3 grow h-full md:m-0 overflow-hidden">
							<ConfigScreen className="max-[768px]:hidden flex flex-col flex-[1_0_280px] max-w-[280px]" />
							<InputScreen className="flex flex-col flex-[50_1_0] md:flex-[1_0_480px] max-w-[480px]" />
							<OutputScreen className="max-[768px]:flex-[50_1_0]" />
						</div>

						{/* <AuthorsSection /> */}
						<footer className="text-center">
							<div className="flex flex-col items-center gap-1 text-sm">
								<DisclaimerDialog>
									<button className="outline-none shadow-none border-none flex flex-row items-center gap-3">
										<Info size={14} />
										<p>Descargo de responsabilidad</p>
									</button>
								</DisclaimerDialog>
								<p>Con ❤️ desde Venezuela</p>
							</div>
						</footer>
					</div>
				</QueryClientProvider>
			</section>
		</>
	);
}
