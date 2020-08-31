import { Telegraf } from "telegraf";
import { InlineQueryResultArticle } from "telegraf/typings/telegram-types";

import { BOT_TOKEN } from "./config";
import { search, applyTemplate } from "./helpers";

const bot = new Telegraf(BOT_TOKEN);

bot.on("inline_query", async context => {
	const query = context.inlineQuery?.query || "";
	const result = await search(query);
	const response = result.map(
		(packageInfo, index: number): InlineQueryResultArticle => {
			const formattedMessage = applyTemplate(packageInfo);
			return {
				id: String(index),
				type: "article",
				title: packageInfo.name,
				input_message_content: {
					parse_mode: "HTML",
					message_text: formattedMessage,
					disable_web_page_preview: true
				}
			};
		}
	);
	return context.answerInlineQuery(response);
});

bot.command("start", ({ replyWithHTML }) =>
	replyWithHTML(`<b>An inline bot to search npm packages.</b>\n
<b>Source</b>: <a href="https://github.com/darvesh/npm-telegram-bot">NPM Telegram Bot</a>
<b>Built By</b>: @solooo7`)
);
bot.command("help", ({ replyWithHTML }) =>
	replyWithHTML(`<b>NPM Bot is an inline bot.</b>\n
Type <code>@npmbot &lt;query&gt;</code> to search packages.
`)
);

bot.catch((error: Error) => console.log(error));

void bot.launch();
