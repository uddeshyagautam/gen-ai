
import React, { useState, useCallback, useEffect } from 'react';
import { Character, CharacterClass, DeckCard } from './types';
import { generateFantasyName, generateCharacterPortrait, generateCharacterBackstory } from './services/geminiService';
import CharacterDisplay from './components/CharacterDisplay';
import Spinner from './components/Spinner';

// Helper to generate random stats within a range
const randomStat = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const App: React.FC = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [backstory, setBackstory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState<boolean>(false);
  const [isGeneratingBackstory, setIsGeneratingBackstory] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<DeckCard[]>([]);
  
  // Load deck from localStorage on initial render
  useEffect(() => {
    try {
      const storedDeck = localStorage.getItem('fantasy-character-deck');
      if (storedDeck) {
        setDeck(JSON.parse(storedDeck));
      }
    } catch (e) {
      console.error("Failed to parse deck from localStorage", e);
    }
  }, []);

  // Save deck to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('fantasy-character-deck', JSON.stringify(deck));
    } catch (e) {
      console.error("Failed to save deck to localStorage", e);
    }
  }, [deck]);
  
  const isCardInDeck = character ? deck.some(card => card.name === character.name) : false;
  const canSaveToDeck = character && portraitUrl && backstory && !isCardInDeck;

  const handleGenerateCharacter = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setCharacter(null);
    setPortraitUrl(null); 
    setBackstory(null);
    try {
      const classes = [CharacterClass.Mage, CharacterClass.Rogue, CharacterClass.Warrior];
      const randomClass = classes[Math.floor(Math.random() * classes.length)];
      
      let stats: { health: number; mana: number; strength: number; };

      switch (randomClass) {
        case CharacterClass.Warrior:
          stats = { health: randomStat(80, 120), mana: randomStat(10, 30), strength: randomStat(15, 25) };
          break;
        case CharacterClass.Mage:
          stats = { health: randomStat(50, 80), mana: randomStat(80, 120), strength: randomStat(5, 10) };
          break;
        case CharacterClass.Rogue:
        default:
          stats = { health: randomStat(60, 90), mana: randomStat(40, 60), strength: randomStat(10, 20) };
          break;
      }

      const name = await generateFantasyName();

      setCharacter({
        name,
        class: randomClass,
        ...stats,
      });
    } catch (e) {
      setError('Failed to generate character. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGeneratePortrait = useCallback(async () => {
    if (!character) return;
    
    setIsGeneratingPortrait(true);
    setError(null);
    try {
      const base64Data = await generateCharacterPortrait(character.name, character.class);
      setPortraitUrl(`data:image/png;base64,${base64Data}`);
    } catch (e) {
      setError('Failed to generate portrait. Please try again.');
      console.error(e);
    } finally {
      setIsGeneratingPortrait(false);
    }
  }, [character]);
  
  const handleGenerateBackstory = useCallback(async () => {
    if (!character) return;
    
    setIsGeneratingBackstory(true);
    setError(null);
    try {
      const story = await generateCharacterBackstory(character.name, character.class);
      setBackstory(story);
    } catch (e) {
      setError('Failed to reveal origin. The mists are too thick.');
      console.error(e);
    } finally {
      setIsGeneratingBackstory(false);
    }
  }, [character]);

  const handleSaveToDeck = useCallback(() => {
    if (character && portraitUrl && backstory && !isCardInDeck) {
      const newCard: DeckCard = { ...character, portraitUrl, backstory };
      setDeck(prev => [...prev, newCard]);
    }
  }, [character, portraitUrl, backstory, isCardInDeck]);

  const handleRemoveFromDeck = useCallback((name: string) => {
    setDeck(prev => prev.filter(card => card.name !== name));
  }, []);

  const buttonStyle = "w-full px-4 py-2 bg-stone-800 text-amber-100 font-bold rounded-md border-2 border-stone-600 shadow-lg hover:border-amber-500 hover:text-amber-50 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  return (
    <>
    <div className="flex flex-col items-center justify-start min-h-screen text-stone-200 p-4" style={{fontFamily: "'EB Garamond', serif"}}>
      <header className="text-center my-6">
        <h1 className="text-5xl md:text-6xl font-bold text-amber-200" style={{fontFamily: "'Cinzel Decorative', cursive", textShadow: "0 2px 4px rgba(0,0,0,0.5)"}}>
          Heroic Decksmith
        </h1>
        <p className="text-stone-400 mt-2 text-lg italic">Forge a new hero card to add to your collection</p>
         <button
            onClick={handleGenerateCharacter}
            disabled={isLoading}
            className="mt-4 px-8 py-3 bg-stone-900/50 text-amber-100 font-bold rounded-md border-2 border-amber-800 shadow-lg hover:shadow-amber-500/20 hover:border-amber-600 hover:text-white transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? <><Spinner /><span>Forging...</span></> : 'Forge New Hero'}
          </button>
      </header>
      
      <main className="w-full max-w-sm">
        <div className="p-4 bg-black/30 backdrop-blur-sm border-4 border-amber-900/80 rounded-xl shadow-[0_0_25px_rgba(255,193,7,0.2)] flex flex-col gap-4 min-h-[600px]">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center h-full gap-4 text-stone-400">
               <Spinner /> <p>Heating the crucible...</p>
             </div>
          ) : character ? (
            <>
              <CharacterDisplay character={character} />

              {/* Portrait */}
              <div className="h-64 bg-black/20 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-stone-600">
                {isGeneratingPortrait ? <><Spinner /><p className="mt-2 text-stone-400">Scrying for a vision...</p></>
                : portraitUrl ? <img src={portraitUrl} alt={`Portrait of ${character.name}`} className="w-full h-full object-cover rounded-md"/>
                : <p className="text-stone-500">Awaiting vision...</p>}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center bg-black/20 p-2 rounded-md border border-stone-700">
                  <div className="text-red-400"><i className="fas fa-heart mr-1"></i><p className="font-bold text-lg">{character.health}</p><span className="text-xs text-stone-400">Health</span></div>
                  <div className="text-blue-400"><i className="fas fa-star-of-life mr-1"></i><p className="font-bold text-lg">{character.mana}</p><span className="text-xs text-stone-400">Mana</span></div>
                  <div className="text-yellow-400"><i className="fas fa-gavel mr-1"></i><p className="font-bold text-lg">{character.strength}</p><span className="text-xs text-stone-400">Strength</span></div>
              </div>

              {/* Backstory */}
              <div className="min-h-[6rem] flex items-center justify-center p-2 bg-black/20 border border-stone-700 rounded-lg">
                {isGeneratingBackstory ? <><Spinner /><span className="ml-2">Consulting archives...</span></>
                : backstory ? <p className="text-stone-300 italic font-serif text-center text-sm animate-fade-in">"{backstory}"</p>
                : <p className="text-stone-500 text-sm">The past is shrouded...</p>}
              </div>
              
              {error && <div className="text-red-300 text-center p-2 text-sm bg-red-900/40 rounded-lg border border-red-500/30"><p><strong>Error:</strong> {error}</p></div>}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                 <button onClick={handleGeneratePortrait} disabled={isGeneratingPortrait || isGeneratingBackstory} className={buttonStyle}>
                   {isGeneratingPortrait ? <><Spinner /><span>Scrying...</span></> : portraitUrl ? 'Reshape' : 'Get Portrait'}
                 </button>
                 <button onClick={handleGenerateBackstory} disabled={isGeneratingBackstory || isGeneratingPortrait} className={buttonStyle}>
                   {isGeneratingBackstory ? <><Spinner /><span>Revealing...</span></> : backstory ? 'Rewrite' : 'Get Origin'}
                 </button>
              </div>

              <button onClick={handleSaveToDeck} disabled={!canSaveToDeck} className={buttonStyle}>
                {isCardInDeck ? 'Already in Deck' : 'Save to Deck'}
              </button>
            </>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-stone-500">
               <i className="fa-solid fa-book-skull text-5xl mb-4"></i>
               <p className="text-xl">The anvil is cold.</p>
               <p>Forge a hero to begin.</p>
             </div>
          )}
        </div>
      </main>
      
      {/* Deck Display */}
      <section className="w-full max-w-4xl mt-12">
        <h2 className="text-3xl text-amber-100 mb-4 text-center" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>My Deck ({deck.length})</h2>
        {deck.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {deck.map(card => (
              <div key={card.name} className="group relative rounded-lg overflow-hidden border-2 border-stone-700 hover:border-amber-600 transition-all duration-300 aspect-[3/4]">
                <img src={card.portraitUrl} alt={`Portrait of ${card.name}`} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-2 text-center">
                   <p className="font-bold text-sm text-amber-50" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>{card.name}</p>
                   <p className="text-xs text-stone-300">{card.class}</p>
                </div>
                <button 
                  onClick={() => handleRemoveFromDeck(card.name)}
                  className="absolute top-1 right-1 bg-red-800/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-700"
                  aria-label={`Remove ${card.name} from deck`}
                >
                  <i className="fa-solid fa-times text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-500 text-center">Your deck is empty. Forge and save heroes to build your collection.</p>
        )}
      </section>

      <style>{`
        body {
          background-color: #1c1917; /* stone-900 */
          background-image:
            radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 25%),
            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 25%),
            linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5)),
            url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzFjMTkxNyI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIxIiBmaWxsPSIjMDAwIj48L2NpcmNsZT4KPC9zdmc+');
          background-attachment: fixed;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
    </>
  );
};

export default App;
