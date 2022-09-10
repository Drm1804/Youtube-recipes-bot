export enum WordTriggers {
  NAME = 'name',
  BREACKFAST = 'breackfast'
}

import {botNames, breackfast} from './phrases.js'

export function messageParser(text: string): WordTriggers | null {
  const words = text.toLocaleLowerCase().split(' ');

  if(overlap(words, botNames)) {
    return WordTriggers.NAME;
  }

  if(overlap(words, breackfast)){
    return WordTriggers.BREACKFAST;
  }

  return null;
}


function overlap(arr: string[], wordSet: string[]): boolean {
  return !!arr.find(w => wordSet.includes(w));
}

