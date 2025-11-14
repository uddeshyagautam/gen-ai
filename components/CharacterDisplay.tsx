import React from 'react';
import { Character, CharacterClass } from '../types';

interface CharacterDisplayProps {
  character: Character;
}

const classDetails: Record<CharacterClass, { icon: string; color: string; description:string }> = {
  [CharacterClass.Mage]: {
    icon: 'fa-solid fa-hat-wizard',
    color: 'text-sky-400',
    description: 'A master of arcane energies, weaving potent spells to decimate foes or protect allies.'
  },
  [CharacterClass.Rogue]: {
    icon: 'fa-solid fa-mask',
    color: 'text-violet-400',
    description: 'A shadowy figure who thrives in the darkness, striking with precision and vanishing without a trace.'
  },
  [CharacterClass.Warrior]: {
    icon: 'fa-solid fa-shield-halved',
    color: 'text-red-500',
    description: 'A stalwart combatant and expert of arms, standing firm on the front lines of battle.'
  },
};

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({ character }) => {
  const details = classDetails[character.class];

  return (
    <div className="w-full max-w-sm bg-black/30 backdrop-blur-sm border-2 border-amber-800/50 rounded-lg shadow-[0_0_15px_rgba(255,193,7,0.2)] p-6 text-center animate-fade-in">
      <h2 
        className="text-4xl text-amber-50 font-bold tracking-wider"
        style={{ fontFamily: "'Cinzel Decorative', cursive", textShadow: "0 0 5px #fff, 0 0 10px #fef08a, 0 0 15px #fef08a" }}
      >
        {character.name}
      </h2>
      <div className={`mt-4 flex items-center justify-center gap-3 ${details.color}`}>
        <i className={`${details.icon} text-2xl`}></i>
        <p className="text-2xl font-semibold font-serif">{character.class}</p>
      </div>
       <p className="text-stone-400 mt-4 text-sm font-serif italic">{details.description}</p>
    </div>
  );
};

export default CharacterDisplay;