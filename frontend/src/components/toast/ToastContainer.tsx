import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import cn from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from './useToastControls';

import './ToastContainer.css';
import { X } from 'lucide-react';

type ToastProps = React.HTMLAttributes<HTMLDivElement>;

export function ToastContainer({ className }: ToastProps) {
	const [id, body, duration, close] = useToastStore((state) => [
		state.id,
		state.body,
		state.duration,
		state.close,
	]);

	const isShown = (id ?? '').length > 0 && body.length > 0;

	useEffect(() => {
		if (!duration || !isShown) {
			return;
		}

		const timeoutId = setTimeout(() => {
			close();
		}, duration);

		return () => {
			clearTimeout(timeoutId);
		};
	}, [id, body, isShown, duration, close]);

	return createPortal(
		<AnimatePresence>
			{isShown && (
				<motion.div
					key={id}
					layout
					initial={{ opacity: 0, y: -50, scale: 0.3 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -100, scale: 0.8 }}
					className={cn(
						'toast  min-w-[240px] max-w-[360px] bg-background px-3 py-2 rounded-xl min-h-9 shadow shadow-muted-foreground/40',
						className
					)}
					role="alert">
					<div className="flex justify-between items-start gap-3">
						<span className="inline-flex text-[15px] m-0">{body}</span>
						<button
							className="
						outline-none shadow-none bg-transparent
						flex justify-center items-center
						min-w-5  
						"
							onClick={() => close()}>
							<X size={16} />
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.querySelector('#toasts-portal')!
	);
}
