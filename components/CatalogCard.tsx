import React, { useState } from 'react';
import type { CatalogData } from '../types';
import Loader from './Loader';
import SaveIcon from './icons/SaveIcon';
import CheckIcon from './icons/CheckIcon';
import CloseIcon from './icons/CloseIcon';
import PencilIcon from './icons/PencilIcon';

interface CatalogCardProps {
  catalogData: CatalogData;
  imagePreview: string;
  isSaving: boolean;
  saveSuccess: boolean;
  onSave: () => void;
  onCatalogDataChange: (newData: Partial<CatalogData>) => void;
}

const CatalogCard: React.FC<CatalogCardProps> = ({ catalogData, imagePreview, isSaving, saveSuccess, onSave, onCatalogDataChange }) => {
  const [newTagInput, setNewTagInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = catalogData.tags.filter(tag => tag !== tagToRemove);
    onCatalogDataChange({ tags: newTags });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagInput.trim() !== '') {
      e.preventDefault();
      const tagToAdd = newTagInput.trim();
      if (!catalogData.tags.includes(tagToAdd)) {
        const newTags = [...catalogData.tags, tagToAdd];
        onCatalogDataChange({ tags: newTags });
      }
      setNewTagInput('');
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onCatalogDataChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full max-w-lg bg-gray-700/50 rounded-2xl shadow-xl overflow-hidden animate-fade-in border border-gray-600 flex flex-col">
      <div className="w-full h-64 bg-gray-800 flex items-center justify-center flex-shrink-0">
        <img src={imagePreview} alt={catalogData.title} className="max-w-full max-h-full object-contain" />
      </div>
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-2">
          {isEditing ? (
            <input 
              type="text"
              name="title"
              value={catalogData.title}
              onChange={handleFieldChange}
              className="text-2xl font-bold text-white bg-gray-600/50 rounded-md px-2 py-1 -ml-2 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          ) : (
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">
              {catalogData.title}
            </h3>
          )}
          
          {isEditing ? (
             <button onClick={() => setIsEditing(false)} className="ml-4 flex-shrink-0 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-blue-600 transition-colors">
                Concluído
             </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="ml-4 flex-shrink-0 p-2 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white transition-colors" aria-label="Editar">
                <PencilIcon />
            </button>
          )}

        </div>
        
        {isEditing ? (
          <textarea
            name="detailedDescription"
            rows={5}
            value={catalogData.detailedDescription}
            onChange={handleFieldChange}
            className="w-full bg-gray-600/50 text-gray-300 leading-relaxed rounded-md p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
          />
        ) : (
          <p className="mt-2 text-gray-300 leading-relaxed">
            {catalogData.detailedDescription}
          </p>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-1">Valor Estimado</h4>
          {isEditing ? (
            <input
              type="text"
              name="value"
              value={catalogData.value}
              onChange={handleFieldChange}
              className="text-lg font-bold text-white bg-gray-600/50 rounded-md px-2 py-1 w-full focus:ring-2 focus:ring-teal-500 focus:outline-none"
              placeholder="Ex: R$ 50,00"
            />
          ) : (
            <p className="text-lg font-bold text-white">{catalogData.value}</p>
          )}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2 items-center">
            {catalogData.tags.map((tag, index) => (
              <span key={index} className={`bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${isEditing ? 'pr-1.5' : ''}`}>
                #{tag}
                {isEditing && (
                  <button onClick={() => handleRemoveTag(tag)} className="text-teal-300 hover:text-white transition-colors duration-200 ml-1" aria-label={`Remover tag ${tag}`}>
                    <CloseIcon />
                  </button>
                )}
              </span>
            ))}
            {isEditing && (
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Adicionar tag..."
                className="bg-transparent text-sm w-24 text-white placeholder-gray-500 focus:outline-none focus:ring-0 border-none"
              />
            )}
          </div>
        </div>
      </div>
      <div className="p-6 pt-2 border-t border-gray-600/50">
        <button
          onClick={onSave}
          disabled={isSaving || saveSuccess}
          className={`w-full flex items-center justify-center gap-2 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform disabled:cursor-not-allowed disabled:transform-none
            ${saveSuccess 
              ? 'bg-green-600 disabled:opacity-100' 
              : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 hover:scale-105 disabled:opacity-50'
            }`
          }
        >
          {isSaving ? (
            <>
              <Loader />
              Salvando...
            </>
          ) : saveSuccess ? (
            <>
              <CheckIcon />
              Salvo com Sucesso!
            </>
          ) : (
            <>
              <SaveIcon />
              Salvar no Catálogo
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CatalogCard;