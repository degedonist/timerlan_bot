import { Telegraf } from "telegraf";
import { TOKEN } from "./config.js";
import { setTimer } from "./functions/timer.js";
import { message } from "telegraf/filters";
import { text_to_speech } from "./functions/text-to-speech.js";

const bot = new Telegraf(TOKEN);

function isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
};

bot.start((ctx) => ctx.reply('Шаббат шалом. Для дальнейших инструкция пиши /help .'));

bot.help((ctx) => {
    ctx.reply('Чтобы поставить таймер, достаточно отправить мне число секунд.\n\nДля активации speech-to-text функции перед сообщением ставь /voice (/voice Очень важное мнение...)')
})

bot.on(message('text'), async (ctx) => {
    const chatId = ctx.chat.id;
    const income = (ctx.message.text).split(" ");
    if (isInt(ctx.message.text)) {
        console.log(ctx.message.text);
        setTimer(ctx.message.text, bot, chatId);
        ctx.reply(`Таймер заведён на ${ctx.message.text} секунд.\nНе забудь включить уведомления.`);
    } else if ('/voice' === income[0] && income.length > 1){
        let message = income.splice(1);
        message = message.join(' ');
        console.log(message);
        text_to_speech(message, ctx);
    }
});
bot.on(message('audio'), (ctx) => {
    const chatId = ctx.chat.id
    ctx.replyWithAudio(`${ctx.message.audio.file_id}`, chatId);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));