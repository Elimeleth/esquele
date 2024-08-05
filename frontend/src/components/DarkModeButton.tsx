import { useAppThemeStore } from '@/store/useAppTheme';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { useEffect } from 'react';

export default function DarkModeButton() {
	const [dark, toggleMode] = useAppThemeStore((state) => [state.dark, state.toggleMode]);

	const handleToggle = () => {
		document.querySelector('html')?.classList?.toggle('dark');
		toggleMode();
	};

	useEffect(() => {
		const html = document.querySelector('html');
		if (!html) return;
		if (dark && !html.classList.contains('dark')) {
			html.classList.add('dark');
		}
	}, []);

	return (
		<Button variant="outline" onClick={() => handleToggle()} className="h-auto px-2 py-1">
			{dark ? <Sun size={20} /> : <Moon size={20} />}
		</Button>
	);
}
