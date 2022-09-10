import { conf } from '../config.js';
import { Scenes, Telegraf } from 'telegraf';
// import db from './helpers/database.js'
import { pause } from './helpers/utils.js'
import logger from './helpers/logger.js'
import { Logger } from 'log4js';
import db, { Recipt } from './helpers/database.js';
import { createReciptMessage } from './helpers/recipt-format.js';
import { ph } from './helpers/phrases.js';
import { messageParser, WordTriggers } from './helpers/message-parser.js';
// import { reciptsList } from './helpers/phrases.js';

const bot = new Telegraf<Scenes.SceneContext>(conf.botToken);

enum Buttons {
  DISHES_LIST = '📜 Список рецептов',
}

const defaultResp = (): any => {
  return {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{
          text: Buttons.DISHES_LIST,
          callback_data: Buttons.DISHES_LIST
        }]
      ]
    }) as any
  }
}


(async (): Promise<void> => {
  const _logger: Logger = logger.get('Main')
  await pause(1000);

  bot.command('start', async (ctx) => {
    _logger.info('Получил сообщение')
    ctx.reply(ph.welcome, defaultResp())
  })

  bot.command('brc', async (ctx) => {
    _logger.info('Получил команду на вывод всех завтраков')
    ctx.reply(ph.reciptsList, defaultResp())
  })]


  bot.action(Buttons.DISHES_LIST, async (ctx) => {
    _logger.info('Запрос на список рецепптов')
    const list = await db.getRecipts()
    const d = Object.values(list).map((r: Recipt) => ({
      text: r.title,
      callback_data: `choose_current_recip_!!_${r.id}`
    }))

    await ctx.reply(ph.reciptsList, {
      reply_markup: JSON.stringify({
        inline_keyboard: [d]
      }) as any
    })

    _logger.info('Отдал список рецептов')

  })

  bot.action(/^choose_current_recip_!!_[a-zA-Z0-9]*/,async (ctx) => {
    _logger.info('Запрос на конкретный рецепт')
    const id = ctx.update.callback_query.data.split('_!!_')[1];

    const recipt = await db.getRecipt(id);

    ctx.replyWithPhoto({url: recipt.imageUrl}, {
      caption: createReciptMessage(recipt),
      reply_markup: defaultResp()
    })
    _logger.info('Отдал рецепт')
  })

  bot.on(('text'), ctx => {
    _logger.info('Перехватил текстовое сообщение')
    const {text}: any = ctx.update.message;

    const filtered = messageParser(text);

    if(filtered === WordTriggers.NAME) {
      _logger.info('Обратились по имени')
      ctx.reply(ph.reciptsList, defaultResp());
    }

    if(filtered === WordTriggers.BREACKFAST) {
      _logger.info('Обратились за завтраками')
      ctx.reply(ph.reciptsList, defaultResp());
    }

  })



  bot.launch();
})()


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
