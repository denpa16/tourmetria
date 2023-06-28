import json

from telebot import types
import telebot

from django.conf import settings

token = settings.TG_BOT_TOKEN
debug = settings.DEBUG

bot = telebot.TeleBot(token)


# def webAppKeyboard():  # создание клавиатуры с webapp кнопкой
#    keyboard = types.ReplyKeyboardMarkup(row_width=1)  # создаем клавиатуру
#    webAppTest = types.WebAppInfo("https://trispy.ru")  # создаем webappinfo - формат хранения url
#    #webAppGame = types.WebAppInfo("https://games.mihailgok.ru")  # создаем webappinfo - формат хранения url
#    one_butt = types.KeyboardButton(text="Найти тур", web_app=webAppTest)  # создаем кнопку типа webapp
#    #two_butt = types.KeyboardButton(text="Игра", web_app=webAppGame)  # создаем кнопку типа webapp
#    keyboard.add(
#        one_butt,
#    two_butt
#    )  # добавляем кнопки в клавиатуру
#
#    return keyboard  # возвращаем клавиатуру


def webAppKeyboardInline():  # создание inline-клавиатуры с webapp кнопкой
    keyboard = types.InlineKeyboardMarkup(row_width=1)  # создаем клавиатуру inline
    webApp = types.WebAppInfo("https://trispy.ru")  # создаем webappinfo - формат хранения url
    one = types.InlineKeyboardButton(text="Найти тур", web_app=webApp)  # создаем кнопку типа webapp
    keyboard.add(one)  # добавляем кнопку в клавиатуру

    return keyboard  # возвращаем клавиатуру


@bot.message_handler(commands=["start"])  # обрабатываем команду старт
def start_fun(message):
    bot.send_message(
        message.chat.id,
        "Привет! Я - бот Tourmetria, помогу тебе подобрать тур!",
        parse_mode="Markdown",
        # reply_markup=webAppKeyboard()
        reply_markup=webAppKeyboardInline(),
    )  # отправляем сообщение с нужной клавиатурой


@bot.message_handler(content_types="text")
def new_mes(message):
    start_fun(message)


@bot.message_handler(content_types="web_app_data")  # получаем отправленные данные
def answer(webAppMes):
    print(webAppMes.from_user)  # вся информация о сообщении
    print(webAppMes.web_app_data.data)  # конкретно то что мы передали в бота
    # data_json = json.loads(webAppMes)
    print(webAppMes.web_app_data)
    bot.send_message(
        webAppMes.chat.id, f"получили инофрмацию из веб-приложения: {webAppMes.web_app_data.data}"
    )
    # отправляем сообщение в ответ на отправку данных из веб-приложения


def start_bot():
    if debug is False:
        bot.infinity_polling()
