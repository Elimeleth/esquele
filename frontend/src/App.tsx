import './App.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

import ConfigScreen from './modules/config/ConfigScreen';
import InputScreen from './modules/input/InputScreen';
import OutputScreen from './modules/output/OutputScreen';

import IcGogh from '@assets/ic-gogh.png';

import SystemStatus from './components/SystemStatus';
import EsqueleConfigSheet from './components/EsqueleConfigSheet';
import DisclaimerDialog from './components/DisclaimerDialog';

import { Info } from 'lucide-react';

const queryClient = new QueryClient();

export default function App() {
	return (
		<>
			<Toaster />
			<section className="app-container">
				<QueryClientProvider client={queryClient}>
					<div className="flex flex-col flex-1 gap-3 w-full max-h-dvh max-w-7xl mx-auto px-5 2xl:px-6 2xl:p-6">
						<header className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-2">
								<div className="md:hidden">
									<EsqueleConfigSheet />
								</div>
								<img
									src={IcGogh}
									className="hidden w-[25px] md:w-[35px] object-contain"
								/>
								<h1 className="text-lg md:text-2xl font-bold">Esquele</h1>
							</div>
							<SystemStatus />
						</header>

						<div className="flex flex-row gap-3 grow h-full mb-2 md:m-0 md:max-h-[480px] 2xl:max-h-[540px] overflow-hidden">
							<ConfigScreen className="max-[768px]:hidden flex flex-col flex-[1_0_280px] max-w-[280px]" />
							<InputScreen className="flex flex-col md:flex-[1_0_480px] max-w-[480px]" />
							<OutputScreen className="max-[768px]:hidden" />
						</div>

						{/* <AuthorsSection /> */}
					</div>
				</QueryClientProvider>
				<footer className="text-center mt-2">
					<div className="flex flex-col gap-1 text-sm">
						<DisclaimerDialog>
							<button className="outline-none shadow-none border-none flex flex-row items-center gap-3">
								<Info size={14} />
								<p>Descargo de responsabilidad</p>
							</button>
						</DisclaimerDialog>
						<p>Con ❤️ desde Venezuela</p>
					</div>
				</footer>
			</section>
		</>
	);
}
