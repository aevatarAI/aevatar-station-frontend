import { Button } from "@/components/ui/button";

export default function StopButton({ id }: { id: string }) {
	return (
		<Button type="button" className="min-w-[97px]">
			Stop
		</Button>
	);
}
