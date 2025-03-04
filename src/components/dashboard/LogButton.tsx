import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface Log {
	id: string;
	date: string;
	content: Array<{
		message?: string;
		command?: string;
		warning?: string;
		id: string;
	}>;
}

const logs: Log[] = [
	{
		id: "1",
		date: "2024-12-12 16:20:09",
		content: [
			{
				id: "1",
				message: "AI basic#1",
			},
			{
				id: "2",
				message: "",
			},
			{
				id: "3",
				command: "Logical thinking",
				message:
					"He leaned back in his chair, staring out of the window as his mind raced through different possibilities. His fingers tapped rhythmically on the desk, a sign of his deep concentration.",
			},
			{
				id: "4",
				message: "",
			},
			{
				id: "5",
				command: "Instruction issued",
				message: "Post",
			},
			{
				id: "6",
				message: "{Telegram messaging}",
			},
			{
				id: "7",
				message: "{Telegram messaging}",
			},
			{
				id: "8",
				message: "",
			},
			{
				id: "9",
				message: "Telegram messaging",
			},
			{
				id: "10",
				message: "",
			},
			{
				id: "11",
				command: "Post",
				message:
					"He leaned back in his chair, staring out of the window as his mind raced through different possibilities. His fingers tapped rhythmically on the desk, a sign of his deep concentration.",
			},
			{
				id: "12",
				message: "",
			},
			{
				id: "13",
				message: "Twitter messaging",
			},
			{
				id: "14",
				message: "",
			},
			{
				id: "15",
				command: "Post",
				message:
					"He leaned back in his chair, staring out of the window as his mind raced through different possibilities. His fingers tapped rhythmically on the desk, a sign of his deep concentration.",
			},
		],
	},
	{
		id: "2",
		date: "2024-12-12 16:20:09",
		content: [
			{
				id: "1",
				warning: '"Agent organizational structure update"',
			},
			{
				id: "2",
				message: "",
			},
			{
				id: "3",
				message: "{Agent1} Join. {Agent 2} removed",
			},
			{
				id: "4",
				message: "",
			},
		],
	},
	{
		id: "3",
		date: "2024-12-12 16:20:09",
		content: [
			{
				id: "1",
				message: "AI basic#1",
			},
			{
				id: "2",
				message: "",
			},
			{
				id: "3",
				command: "Logical thinking",
				message:
					"He leaned back in his chair, staring out of the window as his mind raced through different possibilities. His fingers tapped rhythmically on the desk, a sign of his deep concentration.",
			},
			{
				id: "4",
				message: "",
			},
			{
				id: "5",
				command: "Instruction issued",
				message: "Post",
			},
			{
				id: "6",
				message: "{Telegram messaging}",
			},
			{
				id: "7",
				message: "{Telegram messaging}",
			},
			{
				id: "8",
				message: "",
			},
			{
				id: "9",
				message: "Telegram messaging",
			},
			{
				id: "10",
				message: "",
			},
			{
				id: "11",
				command: "Post",
				message:
					"He leaned back in his chair, staring out of the window as his mind raced through different possibilities. His fingers tapped rhythmically on the desk, a sign of his deep concentration.",
			},
		],
	},
];

export default function StopButton({ id }: { id: string }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button type="button" className="min-w-[97px]">
					View Log
				</Button>
			</DialogTrigger>
			<DialogContent className="w-screen max-w-screen-2xl">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center justify-between mb-[28px]">
							<h2 className="text-white text-[26px] font-semibold font-syne">
								AEVATAR
							</h2>
							<div className="items-center justify-items-center flex-grow">
								<div className="text-white text-lg font-semibold font-syne uppercase py-[2px] bg-white/40 px-[58px] border-l-8 border-r-8 border-white">
									[A Peek Into Jack's Brain]
								</div>
							</div>
						</div>
					</DialogTitle>
					<DialogDescription>
						<div className="border-1 border-[#303030] cutCorner px-[26px] py-[32px] w-full">
							<Table>
								<TableBody>
									{logs.map((log) => (
										<TableRow className="flex gap-[88px]" key={log.id}>
											<TableCell className="text-white text-xs font-semibold font-kode text-nowrap">
												{log.date}
											</TableCell>
											<TableCell className="text-[#b9b9b9]">
												{log.content.map((content) => (
													<div key={content.id}>
														{content.warning ? (
															<div className="text-[#f7b501]">
																{content.warning}
															</div>
														) : content.command ? (
															<div>
																<span className="text-[#53ff8a]">
																	{content.command}
																</span>
																: {content.message}
															</div>
														) : (
															<div>{content.message}&nbsp;</div>
														)}
													</div>
												))}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
}
