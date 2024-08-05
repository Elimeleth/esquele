import LinkedIn from './icons/LinkedIn';

const authors = [
	{
		user: 'ttmday',
		link: 'https://www.linkedin.com/in/ttmday/',
	},
	{
		user: 'elimeleth',
		link: 'https://www.linkedin.com/in/elimeleth/',
	},
	{
		user: 'moises-jimenez',
		link: 'https://www.linkedin.com/in/moises-s-jimenez/',
	},
	{
		user: 'roderiekcapuano',
		link: 'https://www.linkedin.com/in/roderiekcapuano/',
	},
];

export default function AuthorsSection() {
	return (
		<div
			className=" 
					flex flex-col items-center gap-3
					mt-2 mb-4">
			<p className="text-xs font-light text-center">Desarrolladores</p>
			<div className="flex flex-wrap gap-2 justify-center items-center">
				{authors.map((author) => (
					<a
						key={author.user}
						className="
									flex flex-row gap-2 items-center
									border rounded-[4px] px-2 py-1
									no-underline
									text-xs
									"
						title={`LinkedIn de ${author.user}`}
						href={author.link}
						target="_blank"
						referrerPolicy="no-referrer">
						<LinkedIn className="size-5" />
						<span>{author.user}</span>
					</a>
				))}
			</div>
		</div>
	);
}
