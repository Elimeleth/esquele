import { useEffect, useState } from 'react';
import * as runtime from 'react/jsx-runtime';

import { MDXProvider } from '@mdx-js/react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import { compile, run } from '@mdx-js/mdx';

import { useCopyText } from '@/hooks/useCopyText';
import { Check, Copy } from 'lucide-react';

SyntaxHighlighter.registerLanguage('sql', sql);

type MdxWrapperProps = {
	content: string;
};

export default function MdxWrapper({ content }: MdxWrapperProps) {
	const [compiledContent, setCompiledContent] = useState<any>();

	const components = {
		pre: (props: any) => <PreComponent {...props} />,
		p: (props: any) => <p className="text-[13px] text-balance" {...props} />,
		ol: (props: any) => <ol {...props} className="my-2 space-y-2 text-[13px]" />,
		strong: (props: any) => <strong {...props} className="text-[13px] font-bold" />,
		code: ({ className, ...props }: any) => {
			const match = /language-(\w+)/.exec(className || '');
			return match ? (
				<div className="w-full bg-muted p-2 pt-0 text-balance">
					<p className="absolute top-[.45rem] text-muted-foreground">{match[1]}</p>
					<SyntaxHighlighter
						language={match[1]}
						{...props}
						customStyle={{
							background: 'transparent',
							fontSize: '13px',
							whiteSpace: 'wrap',
							textWrap: 'balance',
							wordWrap: 'break-word',
						}}
						codeTagProps={{
							style: { whiteSpace: 'wrap', textWrap: 'balance' },
						}}
					/>
				</div>
			) : (
				<code {...props} />
			);
		},
	};

	useEffect(() => {
		const compileMDX = async () => {
			const contentMdx = await compile(content, {
				outputFormat: 'function-body',
				format: 'detect',
			});

			const { default: Content } = await run(contentMdx, {
				...(runtime as any),
				baseUrl: import.meta.url,
			});

			setCompiledContent(<Content components={components} />);
		};
		compileMDX();
	}, [content]);

	return <MDXProvider>{compiledContent}</MDXProvider>;
}

function PreComponent({ children, ...props }: any) {
	const { onCopy, isCopy } = useCopyText();
	return (
		<div {...props} className="w-full bg-muted relative">
			<div className="flex justify-end py-1 px-2">
				{!isCopy ? (
					<button
						className="flex flex-row gap-1 bg-muted-foreground/15 text-primary text-xs px-2 py-1"
						onClick={() => onCopy((children as any)?.props?.children)}>
						<span>Copiar</span>
						<Copy size={12} />
					</button>
				) : (
					<div className="flex flex-row items-center gap-1 bg-muted-foreground/15 text-primary text-xs px-2 py-1">
						<span>Copiado</span>
						<Check size={14} />
					</div>
				)}
			</div>
			{children}
		</div>
	);
}
