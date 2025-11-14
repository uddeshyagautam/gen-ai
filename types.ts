
export enum CharacterClass {
  Mage = 'Mage',
  Rogue = 'Rogue',
  Warrior = 'Warrior',
}

export interface Character {
  name: string;
  class: CharacterClass;
  health: number;
  mana: number;
  strength: number;
}

export interface DeckCard extends Character {
  portraitUrl: string;
  backstory: string;
}
