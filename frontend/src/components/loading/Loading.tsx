import './Loading.css';
import GoghImage from '@assets/ic-gogh.png';

type Props = {
	content?: string;
	withIcon?: boolean;
	size?: string;
};

function Loading({ size, content, withIcon = true }: Props) {
	const style: { [key: string]: string } = { '--dotSize': size ?? '14px' };
	return (
		<div className="px-2.5 py-2 text-sm font-light flex flex-row items-center text-foreground max-w-max gap-2.5">
			{withIcon && <img src={GoghImage} className="size-[25px] rounded-[25px]" />}
			<div className="dot-loading" style={style}></div>
			{content && <span className="text-s">{content}</span>}
		</div>
	);
}

export default Loading;
