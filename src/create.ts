import db from './helpers/database.js'
import { pause } from './helpers/utils.js'
import { uid } from 'uids';
import { Recipt } from './helpers/database.js';

(async (): Promise<void> => {
  await pause(500);
  const r: Recipt = {
    id: uid(),
    title: "Овсяная каша на молоке",
    ingredints: [
      'молоко 3 стакана',
      'Овсяные хлопья 1 стакан',
      'Сливочное масло 30г',
      'Сахар - по вкусу',
      'Саоль - по вкусу',
    ],
    coocking_steps: [
      'Нагреваем в кастрюльке молоко.',
      'Как только молоко закипело, добавляем соль, сахар.',
      'Засыпаем хлопья или цельные зерна крупы.',
      'Далее варим кашу на среднем огне, постоянно помешивая. Время приготовления зависит от выбранного сорта овсянки. Для геркулесовых хлопьев потребуется 10 минут после закипания, для цельных зерен 30 минут',
      'Когда каша будет готова, добавляем масло, размешиваем и даем постоять еще 5 минут.',
    ],
    imageUrl: "https://eda.ru/img/eda/c620x415/s1.eda.ru/StaticContent/Photos/160302171541/160308173944/p_O.jpg"
  }
  db.create(r)
  console.log('Success');

})()
