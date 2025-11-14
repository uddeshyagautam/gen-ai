
import React from 'react';
import { Character, CharacterClass } from '../types';

interface CharacterDisplayProps {
  character: Character;
}

const classDetails: Record<CharacterClass, { icon: string; color: string; description: string }> = {
  [CharacterClass.Mage]: {
    icon: 'fa-solid fa-hat-wizard',
    color: 'text-blue-400',
    description: 'A master of arcane energies, weaving potent spells to decimate foes or protect allies.'
  },
  [CharacterClass.Rogue]: {
    icon: 'fa-solid fa-mask',
    color: 'text-purple-400',
    description: 'A shadowy figure who thrives in the darkness, striking with precision and vanishing without a trace.'
  },
  [CharacterClass.Warrior]: {
    icon: 'fa-solid fa-shield-halved',
    color: 'text-red-400',
    description: 'A stalwart combatant and expert of arms, standing firm on the front lines of battle.'
  },
};

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ character }) => {
  const details = classDetails[character.class];

  return (
    <div className="w-full max-w-sm bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 text-center animate-fade-in">
      <h2 className="text-4xl font-bold text-white font-serif tracking-wider">{character.name}</h2>
      <div className={`mt-4 flex items-center justify-center gap-3 ${details.color}`}>
        <i className={`${details.icon} text-2xl`}></i>
        <p className="text-2xl font-semibold">{character.class}</p>
      </div>
       <p className="text-gray-400 mt-4 text-sm">{details.description}</p>
    </div>
  );
};

export default CharacterDisplay;
