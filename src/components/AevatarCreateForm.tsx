import RefreshIcon from "@/assets/refresh.svg?react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InfoBox from "./InfoBox";
import InfoCard from "./InfoCard";

const REQUIRED_MESSAGE = "*Required to fill";

const formSchema = z.object({
	name: z.string().min(1, { message: REQUIRED_MESSAGE }),
	ai: z.string(),
	social: z.array(z.string()),
});

export default function AevatarCreateForm() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="mb-[42px] lg:flex lg:justify-between">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Aevatar Name</FormLabel>
								<FormControl>
									<Input
										placeholder="Aevatar Name"
										{...field}
										className="lg:min-w-[324px]"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="col-span-2" />
					<div>
						<Button
							className="border-[#b9b9b9] min-w-[183px] mt-[22px]"
							type="submit"
						>
							Create
						</Button>
					</div>
				</div>
				<div>
					<div className="text-[#b9b9b9] text-xs font-bold font-syne mb-[16px]">
						Atomic-Aevatar Configuration
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
						<div>
							<div className="border border-dashed py-[24px] px-[26px] min-h-[512px] flex flex-col">
								<div className="text-white text-[15px] font-semibold font-syne mb-[11px]">
									AI Basic
								</div>
								<div className="text-white text-xs font-pro mb-[26px]">
									The "Brain" of Aevatars
								</div>
								<FormField
									control={form.control}
									name="ai"
									render={({ field }) => (
										<FormItem className="flex items-center justify-center flex-grow">
											<FormControl>
												{field.value ? (
													<div className="flex flex-col items-center justify-center gap-[26px]">
														<InfoCard title="AI Basic #1" subtitle="ID:1">
															<InfoBox>Twitter Plugin #1</InfoBox>
															<InfoBox>
																This is a lively and adorable physicist
															</InfoBox>
															<InfoBox>{"Knowledge base {aelf} {Btc}"}</InfoBox>
														</InfoCard>
														<Button
															type="button"
															className="w-[81px]"
															onClick={() =>
																form.resetField("ai", { defaultValue: "" })
															}
														>
															<RefreshIcon />
														</Button>
													</div>
												) : (
													<Button
														className="w-[81px]"
														type="button"
														onClick={() => field.onChange("1")}
													>
														+
													</Button>
												)}
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="lg:col-span-2">
							<div className="border border-dashed py-[24px] px-[26px] min-h-[512px] flex flex-col">
								<div className="text-white text-[15px] font-semibold font-syne mb-[11px]">
									Social Platform
								</div>
								<div className="text-white text-xs font-pro mb-[26px]">
									Message Transmission between social platforms
								</div>
								<FormField
									control={form.control}
									name="social"
									render={({ field }) => (
										<FormItem className="flex items-center justify-center flex-grow">
											<FormControl>
												{field.value ? (
													<div className="flex flex-col items-center justify-center gap-[26px]">
														<div className="flex flex-wrap gap-[16px]">
															{field.value.map((value, index) => (
																<InfoCard
																	key={value}
																	title="Twitter Messaging"
																	subtitle={`ID:${value}`}
																>
																	<InfoBox>Twitter ID: @123</InfoBox>
																	<InfoBox>Post_Tweet</InfoBox>
																	<InfoBox>Reply_Tweet</InfoBox>
																</InfoCard>
															))}
														</div>
														<Button
															className="w-[81px]"
															type="button"
															onClick={() =>
																field.onChange(
																	(field.value || []).concat(
																		new Date().getTime().toString(),
																	),
																)
															}
														>
															+
														</Button>
													</div>
												) : (
													<Button
														className="w-[81px]"
														type="button"
														onClick={() =>
															field.onChange(
																(field.value || []).concat(
																	new Date().getTime().toString(),
																),
															)
														}
													>
														+
													</Button>
												)}
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
