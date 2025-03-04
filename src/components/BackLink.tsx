import BackIcon from "@/assets/back.svg?react";

interface IBackLinkProps {
	href: string;
	title: React.ReactNode;
}

export default function BackLink({ href, title }: IBackLinkProps) {
	return (
		<a href={href} className="flex gap-4 items-center">
			<BackIcon />
			{title}
		</a>
	);
}
