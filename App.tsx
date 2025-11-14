
import React, { useState, useCallback } from 'react';
import { Character, CharacterClass } from './types';
import { generateFantasyName } from './services/geminiService';
import CharacterDisplay from './components/CharacterDisplay';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCharacter = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const classes = [CharacterClass.Mage, CharacterClass.Rogue, CharacterClass.Warrior];
      const randomClass = classes[Math.floor(Math.random() * classes.length)];
      
      const name = await generateFantasyName();

      setCharacter({
        name,
        class: randomClass,
      });
    } catch (e) {
      setError('Failed to generate character. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Fantasy Character Generator
        </h1>
        <p className="text-gray-400 mt-2 text-lg">Click the button to summon a new hero!</p>
      </div>

      <div className="h-64 flex items-center justify-center">
        {isLoading ? (
           <div className="flex flex-col items-center gap-4">
             <Spinner />
             <p className="text-gray-400">Summoning a hero...</p>
           </div>
        ) : error ? (
          <div className="text-red-400 text-center p-4 bg-red-900/50 rounded-lg">
            <p><strong>Error:</strong> {error}</p>
          </div>
        ) : character ? (
          <CharacterDisplay character={character} />
        ) : (
           <div className="text-center text-gray-500">
             <i className="fa-solid fa-wand-sparkles text-4xl mb-2"></i>
             <p>Your character awaits...</p>
           </div>
        )}
      </div>

      <button
        onClick={handleGenerateCharacter}
        disabled={isLoading}
        className="mt-8 px-8 py-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Spinner />
            <span>Generating...</span>
          </>
        ) : (
          'Generate Character'
        )}
      </button>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
