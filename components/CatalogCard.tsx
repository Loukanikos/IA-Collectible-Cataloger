
import React from 'react';
import type { CatalogData } from '../types';

interface CatalogCardProps {
  catalogData: CatalogData;
  imagePreview: string;
}

const CatalogCard: React.FC<CatalogCardProps> = ({ catalogData, imagePreview }) => {
  return (
    <div className="w-full max-w-lg bg-gray-700/50 rounded-2xl shadow-xl overflow-hidden animate-fade-in border border-gray-600">
      <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
        <img src={imagePreview} alt={catalogData.title} className="max-w-full max-h-full object-contain" />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-400">
          {catalogData.title}
        </h3>
        <p className="mt-4 text-gray-300 leading-relaxed">
          {catalogData.detailedDescription}
        </p>
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {catalogData.tags.map((tag, index) => (
              <span key={index} className="bg-teal-500/20 text-teal-300 text-xs font-semibold px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogCard;
