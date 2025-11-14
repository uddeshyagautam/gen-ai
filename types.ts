
export enum CharacterClass {
  Mage = 'Mage',
  Rogue = 'Rogue',
  Warrior = 'Warrior',
}

export interface Character {
  name: string;
  class: CharacterClass;
}
