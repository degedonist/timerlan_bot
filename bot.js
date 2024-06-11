const { Markup, Telegraf } = require('telegraf');
const TOKEN = require('./config.js');
const { setTimer } = require('./functions/timer.js');
const { message } = require('telegraf/filters');
const { text_to_speech } = require('./functions/text-to-speech.js');
const { coinFlipper } = require('./functions/Games');

const bot = new Telegraf(TOKEN);
let gameCoin = false;

function isInt(value) {
    return !isNaN(value) && 
           parseInt(Number(value)) == value && 
           !isNaN(parseInt(value, 10));
};

bot.start((ctx) => {
    ctx.reply(
        'Шаббат шалом. Для дальнейших инструкция пиши /help .',
        Markup.keyboard([
            [('/help'), ('/coin')]
        ])
    )
});

bot.help((ctx) => {
    ctx.reply('Чтобы поставить таймер, достаточно отправить мне число секунд.\n\nДля активации speech-to-text функции перед сообщением ставь /voice (/voice Очень важное мнение...)')
})

bot.command('coin', async (ctx) => {
    await ctx.replyWithSticker('CAACAgIAAxkBAAIC42ZoUHkxzpvA4Jf8CJwG5bmIMZtwAAK-CQAChK6YShJDBOhNsDOyNQQ');
    gameCoin = true;
    return ctx.reply(
        'Орёл или решка?',
        Markup.inlineKeyboard([
            Markup.button.callback("Орёл", "Орёл"),
            Markup.button.callback("Решка", "Решка")
        ]).resize(true)
    );
});

bot.hears('delete', (ctx) => {
    ctx.reply(
        'keyboard removed',
        Markup.removeKeyboard()
    );
});

bot.action("Орёл", (ctx) => {
    if (gameCoin) {
        const result = coinFlipper("Орёл");
        let text = '';
        result ? text = `${ctx.from.first_name}, тебе повезло! Это Орёл.` : text = `${ctx.from.first_name}, увы, но это Решка.`;
        gameCoin = false;
        return ctx.reply(text);
    }
});

bot.action("Решка", (ctx) => {
    if (gameCoin) {
        const result = coinFlipper("Решка");
        let text = '';
        result ? text = `${ctx.from.first_name}, тебе повезло! Это Решка.` : text = `${ctx.from.first_name}, увы, но это Орёл.`;
        gameCoin = false;
        return ctx.reply(text);
    }
});

bot.on(message('sticker'), (ctx) => {
    return ctx.reply(`Sticker id: ${ctx.message.sticker.file_id}`);
});

bot.on(message('text'), async (ctx) => {
    const chatId = ctx.chat.id;
    const income = (ctx.message.text).split(" ");
    if (isInt(ctx.message.text)) {
        console.log(ctx.message.text);
        setTimer(ctx.message.text, bot, chatId);
        ctx.reply(`Таймер заведён на ${ctx.message.text} секунд.\nНе забудь включить уведомления.`);
    } else if ('/voice' === income[0] && income.length > 1) {
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