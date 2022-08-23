import { Recipt } from './database.js'


export const createReciptMessage = (res: Recipt): string => {
  let message = res.title || '';

  message += `\n Ингредиенты:
${res.ingredints.reduce((acc, ing) => acc + '✦ ' + ing + '\n', '')}
  `

  message += `\n Способ приготовления:
${res.coocking_steps.reduce((acc, ing) => acc + '✦ ' + ing + '\n', '')}
  `
  return message;
}

