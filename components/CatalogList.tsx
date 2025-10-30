import React from 'react';
import type { SavedCatalogItem } from '../types';
import TrashIcon from './icons/TrashIcon';
import EyeIcon from './icons/EyeIcon';

interface CatalogListProps {
  items: SavedCatalogItem[];
  onDeleteItem: (index: number) => void;
  onSelectItem: (item: SavedCatalogItem, index: number) => void;
}

const CatalogList: React.FC<CatalogListProps> = ({ items, onDeleteItem, onSelectItem }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-800 border border-gray-700 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-400">Seu Catálogo está Vazio</h2>
        <p className="mt-2 text-gray-500">
          Vá para a aba "Catalogar Item" para adicionar seu primeiro colecionável.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-700 flex flex-col group relative animate-fade-in"
        >
          <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
            <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="p-4 flex-grow flex flex-col">
            <h3 className="font-bold text-lg text-teal-400 truncate">{item.title}</h3>
            <p className="text-sm font-semibold text-gray-300 mt-1">{item.value}</p>
            <div className="mt-2 flex flex-wrap gap-1.5 flex-grow content-start">
              {item.tags.slice(0, 3).map(tag => (
                <span key={tag} className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onSelectItem(item, index)}
              className="bg-blue-500/80 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
              aria-label={`Visualizar ${item.title}`}
            >
              <EyeIcon />
            </button>
            <button
              onClick={() => onDeleteItem(index)}
              className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
              aria-label={`Excluir ${item.title}`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CatalogList;