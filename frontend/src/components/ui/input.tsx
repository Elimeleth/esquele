import * as React from 'react';

import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<
	HTMLInputElement,
	InputProps & {
		enabledObscureText?: boolean;
	}
>(({ className, type, value, enabledObscureText = false, ...props }, ref) => {
	const [obscureText, setObscureText] = React.useState(enabledObscureText);

	const handleObscureText = React.useCallback(() => {
		if (obscureText) {
			const v = value?.toString();
			return v
				?.toString()
				.split('')
				.map((c, idx) => (idx <= 1 ? c : '*'))
				.join('');
		}

		return value;
	}, [value, obscureText]);

	return (
		<div className="relative">
			<input
				type={type}
				className={cn(
					'flex h-10 w-full rounded-md border border-input focus-visible:border-muted-foreground/45 bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground selection:text-primary-foreground selection:bg-primary focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
					className,
					enabledObscureText && 'pr-9'
				)}
				ref={ref}
				{...props}
				value={handleObscureText()}
			/>
			{enabledObscureText && (
				<button
					type="button"
					className="bg-background px-2 absolute top-2/4 -translate-y-2/4 right-1 z-10"
					onClick={() => setObscureText((vl) => !vl)}>
					{obscureText ? <EyeOff size={14} /> : <Eye size={14} />}
				</button>
			)}
		</div>
	);
});
Input.displayName = 'Input';

export { Input };
