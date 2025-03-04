import { z } from "zod";

const REQUIRED_MESSAGE = "*Required to fill";

export enum AtomicAevatarType {
	AIBasic = "AI-Basic",
	Telegram = "Telegram",
	Twitter = "Twitter",
}

const nameSchema = z
	.string()
	.min(1, { message: REQUIRED_MESSAGE })
	.max(20, { message: "Name should be less than 20 characters" });
const idSchema = z.string().min(1, { message: REQUIRED_MESSAGE });
const keySchema = z.string().min(1, { message: REQUIRED_MESSAGE });
const abilitySchema = z
	.array(z.string())
	.refine((value) => value.some((item) => item), {
		message: "You have to select at least one ability.",
	});

const aiBasicSchema = z.object({
	name: nameSchema,
	type: z.literal(AtomicAevatarType.AIBasic),
	modelProvider: z.string().nonempty({ message: REQUIRED_MESSAGE }),
	bio: z
		.string()
		.min(1, { message: REQUIRED_MESSAGE })
		.max(500, { message: "Bio should be less than 500 characters" }),
	lore: z
		.string()
		.max(1500, { message: "Lore should be less than 1,500 characters" }),
	topic: z
		.string()
		.max(500, { message: "Topic should be less than 500 characters" }),
	knowledgeBase: z
		.array(
			z.object({
				name: z.string(),
				content: z
					.custom<File>()
					.refine(
						(files) => files.type === "application/pdf",
						"Only PDF files are allowed",
					),
			}),
		)
		.nonempty({ message: REQUIRED_MESSAGE })
		.max(10, { message: "Knowledge Base should be less than 10 files" }),
});

const telegramSchema = z.object({
	name: nameSchema,
	type: z.literal(AtomicAevatarType.Telegram),
	id: idSchema,
	key: keySchema,
	ability: abilitySchema,
});

const twitterSchema = z.object({
	name: nameSchema,
	type: z.literal(AtomicAevatarType.Twitter),
	id: idSchema,
	key: keySchema,
	ability: abilitySchema,
});

export const formSchema = z.discriminatedUnion("type", [
	aiBasicSchema,
	telegramSchema,
	twitterSchema,
]);

export const TELEGRAM_ABILITIES = [
	"Private_Reply",
	"Group_Post",
	"Group_Reply",
];
export const TWITTER_ABILITIES = [
	"Post_Tweet",
	"Reply_Tweet",
	"Like_Tweet",
	"Quote_Tweet",
	"Retweet",
];

export type TAtomicAevatar = z.infer<typeof formSchema>;
