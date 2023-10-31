const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

const botToken = '6518385588:AAHQ49m8cmm6l3ymVLaW4n7vWaDsJMD13Bs';
const bot = new TelegramBot(botToken, { polling: true });

const topics = [];

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const keyboard = {
        inline_keyboard: [
            [
                { text: "So'rovlarni Ko'rish ", callback_data: "So'rovlarni_ko'rish" },
                { text: "So'rov jo'natish", callback_data: "So'rov_jo'natish" },
            ],
        ],
    };
    bot.sendMessage(chatId, "Assalomu Alaykum PDP talabalari uchun dasturlashga oid turli savol, taklif, va muammolarni hal qlish uchun tuzulgan aloqa botimizga xush kelibsiz!!", {
        reply_markup: JSON.stringify(keyboard),
    });
});

bot.on('callback_query', (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const action = callbackQuery.data;

    if (action === "So'rovlarni_ko'rish") {
        const topicsList = topics.map((topic, index) => {
            return [{ text: `${index + 1}. ${topic.name}`, callback_data: `get_topic:${index}` }];
        });

        const keyboard = { inline_keyboard: topicsList };
        bot.sendMessage(chatId,"Joylangan so'rovlar:", {
            reply_markup: JSON.stringify(keyboard),
        });
    } else if (action === "So'rov_jo'natish") {
        bot.sendMessage(chatId, "Iltimos so'rov jo'natishdan avval ism familya va guruhingizni kriting: Misol uchun 210-guruhda Ppdyev Pdpjon ");
        bot.once('message', (msg) => {
            const topicName = msg.text;
            const topic = { name: topicName, info: [] };
            topics.push(topic);
            bot.sendMessage(chatId, `Xurmatli '${topicName}' siz ro'yxatdan o'tdingiz`);
            bot.sendMessage(chatId, `Xurmatli '${topicName}'muammoni kritishingiz mumkin:`);
            bot.once('message', (msg) => {
                const information = msg.text;
                topic.info.push(information);
                bot.sendMessage(chatId, `Xurmatli '${topicName} sizning so'rovingiz qabul qlindi Yopiq kanalga muammoyingizni yechganimizdan so'ng joylaymiz': ${information}`);
            });
        });
    } else if (action.startsWith('get_topic:')) {
        const topicIndex = parseInt(action.split(':')[1]);
        const topic = topics[topicIndex];
        if (topic) {
            bot.sendMessage(chatId, `So'rovlar haqida  '${topic.name}':\n${topic.info.join('\n')}`);
        } else {
            bot.sendMessage(chatId, 'Invalid topic serial number. Please select a valid topic.');
        }
    }
});
