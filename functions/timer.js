export const setTimer = (time, bot, chatId) => {

    const message = () => {
        bot.telegram.sendMessage(chatId, 'Время вышло!');
    };

    setTimeout(message, time * 1000);
};
