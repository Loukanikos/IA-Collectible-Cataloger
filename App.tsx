
import React, { useState, useCallback } from 'react';
import type { CatalogData } from './types';
import { generateCatalogData } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import CatalogCard from './components/CatalogCard';
import Loader from './components/Loader';
import SparklesIcon from './components/icons/SparklesIcon';
import ErrorIcon from './components/icons/ErrorIcon';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [catalogData, setCatalogData] = useState<CatalogData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove "data:mime/type;base64," prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = useCallback(async () => {
    if (!imageFile || !description.trim()) {
      setError('Please provide both an image and a description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCatalogData(null);

    try {
      const imageBase64 = await fileToBase64(imageFile);
      const generatedData = await generateCatalogData(imageBase64, imageFile.type, description);
      setCatalogData(generatedData);
    } catch (e) {
      console.error(e);
      setError('Failed to generate catalog data. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, description]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            AI Collectible Cataloger
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Instantly catalog your items with the power of AI.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-teal-400">1. Add Your Item</h2>
            <div className="space-y-6">
              <ImageUploader onImageChange={handleImageChange} imagePreview={imagePreview} />
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Item Description
                </label>
                <textarea
                  id="description"
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                  placeholder="e.g., '1999 Charizard Holo Pokémon card, base set, mint condition...'"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !imageFile || !description}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    Generate Catalog
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-blue-400">2. AI Generated Result</h2>
            <div className="h-full flex items-center justify-center">
              {isLoading && (
                 <div className="text-center text-gray-400">
                    <Loader large={true} />
                    <p className="mt-4 text-lg">AI is analyzing your item...</p>
                 </div>
              )}
              {error && (
                <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
                    <ErrorIcon />
                    <p className="mt-2 font-semibold">An Error Occurred</p>
                    <p className="text-sm">{error}</p>
                </div>
              )}
              {!isLoading && !error && catalogData && imagePreview && (
                <CatalogCard catalogData={catalogData} imagePreview={imagePreview} />
              )}
              {!isLoading && !error && !catalogData && (
                <div className="text-center text-gray-500">
                    <p className="text-lg">Your cataloged item will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
