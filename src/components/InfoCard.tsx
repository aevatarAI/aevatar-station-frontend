import CogIcon from "@/assets/cog.svg?react";
import StatusIndicator, { type Status } from "@/components/StatusIndicator";
import {
	Card,
	CardDescription,
	CardFooterFixedHeight,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	AtomicAevatarType,
	type TAtomicAevatar,
} from "@//assets/schema/atomic-aevatar";
import InfoBox from "./InfoBox";

interface IInfoCardProps extends React.PropsWithChildren {
	title: React.ReactNode;
	hideCog?: boolean;
	onCogClick?: () => void;
	subtitle: React.ReactNode;
	status?: Status;
	item?: TAtomicAevatar;
}

export default function InfoCard({
	title,
	hideCog,
	onCogClick,
	subtitle,
	status,
	children,
	item,
}: IInfoCardProps) {
	return (
		<Card className="w-[285px]">
			<CardHeader>
				<CardTitle className="flex justify-between">
					{title}
					{!hideCog && (
						<CogIcon
							onClick={onCogClick}
							className="text-[#B9B9B9] hover:text-white cursor-pointer"
						/>
					)}
				</CardTitle>
				<CardDescription className="flex justify-between">
					{subtitle}
					{status && <StatusIndicator status={status} />}
				</CardDescription>
			</CardHeader>
			<CardFooterFixedHeight>
				<div className="grid grid-cols-1 gap-[15px]">
					{item ? <ItemRenderer item={item} /> : children}
				</div>
			</CardFooterFixedHeight>
		</Card>
	);
}

function ItemRenderer({ item }: { item: TAtomicAevatar }) {
	if (
		item.type === AtomicAevatarType.Telegram ||
		item.type === AtomicAevatarType.Twitter
	) {
		return (
			<>
				{item.ability.map((i) => (
					<InfoBox key={i}>{i}</InfoBox>
				))}
			</>
		);
	}

	return (
		<>
			{[item.bio, item.lore, item.modelProvider, item.topic]
				.filter((i) => !!i)
				.map((i) => (
					<InfoBox key={i}>{i}</InfoBox>
				))}
			<InfoBox>
				Knowledge base
				<br />
				{item.knowledgeBase.map((i) => `{${i.name}}`).join(" ")}
			</InfoBox>
		</>
	);
}
