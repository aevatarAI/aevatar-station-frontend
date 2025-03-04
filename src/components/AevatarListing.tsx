import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface IAevatarListingProps extends React.PropsWithChildren {
	isEmpty?: boolean;
	onAdd?: () => void;
	description?: string;
}

export default function AevatarListing({
	isEmpty,
	children,
	onAdd,
	description,
}: IAevatarListingProps) {
	if (isEmpty)
		return (
			<div className="flex-grow flex items-center justify-center mt-[26px]">
				<Card>
					<CardHeader>
						<CardTitle>Let's Begin</CardTitle>
						<CardDescription>{description}</CardDescription>
					</CardHeader>
					<CardFooter>
						<Button className="w-full" onClick={onAdd}>
							+
						</Button>
					</CardFooter>
				</Card>
			</div>
		);

	return (
		<div className="flex gap-[20px] mt-[26px]">
			<div className="flex flex-wrap gap-[20px] flex-grow">{children}</div>
			<div>
				<Button className="w-[81px] h-[45px]" onClick={onAdd}>
					+
				</Button>
			</div>
		</div>
	);
}
