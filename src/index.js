import { Bot } from "grammy";
import fs from "node:fs/promises"
import { resize_dick, is_resize_time, auto_register } from "./actions.js"

export const locale = JSON.parse(await fs.readFile("./src/locales/ru.json"));
const bot = new Bot(process.env.token);

bot.on("message::bot_command", auto_register);

bot.command("dick", is_resize_time);
bot.command("dick", resize_dick);

bot.command("ping", (ctx) => {
    ctx.reply(`PONG`);
})

bot.command("mak", ctx => {
    ctx.reply("[xzeld](tg://user?id=828741336)", { parse_mode: "markdown" })
})

bot.start();
