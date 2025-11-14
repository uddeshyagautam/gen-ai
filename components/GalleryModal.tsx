import React from 'react';
// FIX: Replaced the non-existent 'FavoriteCharacter' type with 'DeckCard' to resolve the import error.
import { DeckCard } from '../types';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: DeckCard[];
  onRemove: (name: string) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, favorites, onRemove }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-title"
    >
      <div 
        className="bg-stone-900 w-full max-w-4xl h-full max-h-[80vh] rounded-lg border-2 border-amber-800/50 shadow-2xl shadow-amber-900/20 flex flex-col"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <header className="p-4 border-b-2 border-amber-800/50 flex justify-between items-center">
          <h2 
            id="gallery-title"
            className="text-2xl text-amber-100"
            style={{ fontFamily: "'Cinzel Decorative', cursive" }}
          >
            Gallery of Heroes
          </h2>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors text-2xl"
            aria-label="Close Gallery"
          >
            &times;
          </button>
        </header>

        <main className="p-6 flex-grow overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-500">
              <i className="fa-solid fa-book-skull text-5xl mb-4"></i>
              <p className="text-xl">The tome is empty.</p>
              <p>Save heroes to your collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favorites.map((fav) => (
                <div key={fav.name} className="group relative rounded-lg overflow-hidden border-2 border-stone-700 hover:border-amber-600 transition-all duration-300 aspect-square">
                   <img src={fav.portraitUrl} alt={`Portrait of ${fav.name}`} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 text-center">
                      <p className="font-bold text-sm text-amber-50" style={{ fontFamily: "'Cinzel Decorative', cursive" }}>{fav.name}</p>
                      <p className="text-xs text-stone-300">{fav.class}</p>
                   </div>
                   <button 
                    onClick={() => onRemove(fav.name)}
                    className="absolute top-1 right-1 bg-red-800/80 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-700"
                    aria-label={`Remove ${fav.name} from gallery`}
                   >
                     <i className="fa-solid fa-times text-xs"></i>
                   </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default GalleryModal;
