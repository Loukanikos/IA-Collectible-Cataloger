import React, { useState, useEffect } from 'react';
import type { SavedCatalogItem } from '../types';
import CloseIcon from './icons/CloseIcon';
import PencilIcon from './icons/PencilIcon';

interface CatalogDetailViewProps {
  item: SavedCatalogItem;
  onClose: () => void;
  onUpdate: (updatedData: { title: string; detailedDescription: string; tags: string[]; value: string; }) => void;
}

const CatalogDetailView: React.FC<CatalogDetailViewProps> = ({ item, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    title: item.title,
    detailedDescription: item.detailedDescription,
    tags: [...item.tags],
    value: item.value,
  });
  const [newTagInput, setNewTagInput] = useState('');

  useEffect(() => {
    // When the item prop changes, reset the local state and exit edit mode
    setEditedData({
      title: item.title,
      detailedDescription: item.detailedDescription,
      tags: [...item.tags],
      value: item.value,
    });
    setIsEditing(false);
  }, [item]);

  const handleSave = () => {
    onUpdate(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Revert changes back to original item prop
    setEditedData({
      title: item.title,
      detailedDescription: item.detailedDescription,
      tags: [...item.tags],
      value: item.value,
    });
    setIsEditing(false);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTagInput.trim() !== '') {
      e.preventDefault();
      const tagToAdd = newTagInput.trim();
      if (!editedData.tags.includes(tagToAdd)) {
        setEditedData(prev => ({ ...prev, tags: [...prev.tags, tagToAdd] }));
      }
      setNewTagInput('');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full border border-gray-700 flex flex-col md:flex-row max-h-[90vh] relative animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10" aria-label="Fechar">
          <CloseIcon />
        </button>
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-900 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl flex items-center justify-center flex-shrink-0">
          <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain p-4" />
        </div>
        <div className="p-6 overflow-y-auto flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editedData.title}
                onChange={handleFieldChange}
                className="text-2xl font-bold text-white bg-gray-700/50 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 w-full"
              />
            ) : (
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400 mr-2 flex-1">
                {item.title}
              </h2>
            )}
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:bg-gray-600 hover:text-white transition-colors" aria-label="Editar">
                <PencilIcon />
              </button>
            )}
          </div>

          <div className="flex-grow">
            <label htmlFor="item-description" className="text-sm font-semibold text-gray-400 mb-2 block">Descrição</label>
            {isEditing ? (
              <textarea
                id="item-description"
                name="detailedDescription"
                value={editedData.detailedDescription}
                onChange={handleFieldChange}
                rows={5}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
              />
            ) : (
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{item.detailedDescription}</p>
            )}

            <div className="mt-4">
                <label htmlFor="item-value" className="text-sm font-semibold text-gray-400 mb-2 block">Valor Estimado</label>
                {isEditing ? (
                    <input
                        id="item-value"
                        name="value"
                        type="text"
                        value={editedData.value}
                        onChange={handleFieldChange}
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                    />
                ) : (
                    <p className="text-lg font-bold text-white">{item.value}</p>
                )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2 items-center">
                {isEditing ? (
                  <>
                    {editedData.tags.map((tag, index) => (
                      <span key={index} className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        #{tag}
                        <button onClick={() => handleRemoveTag(tag)} className="text-teal-300 hover:text-white transition-colors duration-200" aria-label={`Remover tag ${tag}`}>
                          <CloseIcon />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Adicionar tag..."
                      className="bg-transparent text-sm w-24 text-white placeholder-gray-500 focus:outline-none focus:ring-0 border-none"
                    />
                  </>
                ) : (
                  item.tags.map((tag, index) => (
                    <span key={index} className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                      #{tag}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-6 pt-4 border-t border-gray-700 flex gap-4">
              <button onClick={handleSave} className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300">
                Salvar Alterações
              </button>
              <button onClick={handleCancel} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogDetailView;