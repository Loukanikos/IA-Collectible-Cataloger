import React, { useState, useCallback, useEffect } from 'react';
import type { CatalogData, SavedCatalogItem } from './types';
import { generateCatalogData } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import CatalogCard from './components/CatalogCard';
import Loader from './components/Loader';
import SparklesIcon from './components/icons/SparklesIcon';
import ErrorIcon from './components/icons/ErrorIcon';
import CatalogList from './components/CatalogList';
import CatalogDetailView from './components/CatalogDetailView';

type View = 'catalog' | 'list';
const LOCAL_STORAGE_KEY = 'catalogedItems';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [catalogData, setCatalogData] = useState<CatalogData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  const [currentView, setCurrentView] = useState<View>('list');
  const [catalogedItems, setCatalogedItems] = useState<SavedCatalogItem[]>(() => {
    try {
      const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (e) {
      console.error("Falha ao carregar itens do localStorage:", e);
      return [];
    }
  });
  const [selectedItem, setSelectedItem] = useState<SavedCatalogItem | null>(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(catalogedItems));
    } catch (e) {
      console.error("Falha ao salvar itens no localStorage:", e);
    }
  }, [catalogedItems]);


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
      setError('Por favor, forneça uma imagem e uma descrição.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCatalogData(null);
    setSaveSuccess(false); // Reset save state

    try {
      const imageBase64 = await fileToBase64(imageFile);
      const generatedData = await generateCatalogData(imageBase64, imageFile.type, description);
      setCatalogData(generatedData);
    } catch (e) {
      console.error(e);
      setError('Falha ao gerar os dados do catálogo. Verifique sua chave de API e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, description]);

  const handleSave = useCallback(async () => {
    if (!catalogData || !imagePreview) return;
    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    const newItem: SavedCatalogItem = {
        ...catalogData,
        image: imagePreview,
    };
    setCatalogedItems(prevItems => [...prevItems, newItem]);

    setIsSaving(false);
    setSaveSuccess(true);
  }, [catalogData, imagePreview]);
  
  const handleDeleteItem = useCallback((indexToDelete: number) => {
    setCatalogedItems(items => items.filter((_, index) => index !== indexToDelete));
  }, []);

  const handleCatalogDataChange = useCallback((newData: Partial<CatalogData>) => {
    if (catalogData) {
      setCatalogData(prevData => ({
        ...prevData!,
        ...newData,
      }));
    }
  }, [catalogData]);

  const handleSelectItem = useCallback((item: SavedCatalogItem, index: number) => {
    setSelectedItem(item);
    setSelectedItemIndex(index);
  }, []);

  const handleCloseDetailView = useCallback(() => {
    setSelectedItem(null);
    setSelectedItemIndex(null);
  }, []);
  
  const handleUpdateItem = useCallback((index: number, updatedData: Partial<Omit<SavedCatalogItem, 'image'>>) => {
    setCatalogedItems(prevItems => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], ...updatedData };
      return newItems;
    });
    // Also update the selected item in case the modal stays open
    setSelectedItem(prev => prev ? { ...prev, ...updatedData } : null);
  }, []);

  const NavButton: React.FC<{ view: View; label: string }> = ({ view, label }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300
        ${currentView === view
          ? 'bg-teal-500 text-white shadow-lg'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`
      }
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
            Catalogador de Colecionáveis com IA
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Catalogue seus itens instantaneamente com o poder da IA.
          </p>
        </header>

        <nav className="mb-8 flex justify-center gap-4">
            <NavButton view="list" label={`Ver Catálogo (${catalogedItems.length})`} />
            <NavButton view="catalog" label="Catalogar Item" />
        </nav>

        {currentView === 'catalog' ? (
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-teal-400">1. Adicione seu Item</h2>
              <div className="space-y-6">
                <ImageUploader onImageChange={handleImageChange} imagePreview={imagePreview} />
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição do Item
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                    placeholder="ex: 'Card Pokémon Charizard Holo de 1999, conjunto base, em perfeito estado...'"
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
                      Gerando...
                    </>
                  ) : (
                    <>
                      <SparklesIcon />
                      Gerar Catálogo
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">2. Resultado Gerado pela IA</h2>
              <div className="h-full flex items-center justify-center">
                {isLoading && (
                   <div className="text-center text-gray-400">
                      <Loader large={true} />
                      <p className="mt-4 text-lg">A IA está analisando seu item...</p>
                   </div>
                )}
                {error && (
                  <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg">
                      <ErrorIcon />
                      <p className="mt-2 font-semibold">Ocorreu um Erro</p>
                      <p className="text-sm">{error}</p>
                  </div>
                )}
                {!isLoading && !error && catalogData && imagePreview && (
                  <CatalogCard 
                    catalogData={catalogData} 
                    imagePreview={imagePreview}
                    isSaving={isSaving}
                    saveSuccess={saveSuccess}
                    onSave={handleSave}
                    onCatalogDataChange={handleCatalogDataChange}
                  />
                )}
                {!isLoading && !error && !catalogData && (
                  <div className="text-center text-gray-500">
                      <p className="text-lg">Seu item catalogado aparecerá aqui.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        ) : (
          <main>
            <CatalogList 
              items={catalogedItems} 
              onDeleteItem={handleDeleteItem}
              onSelectItem={handleSelectItem}
            />
          </main>
        )}
      </div>
      {selectedItem && selectedItemIndex !== null && (
        <CatalogDetailView 
          item={selectedItem} 
          onClose={handleCloseDetailView}
          onUpdate={(updatedData) => handleUpdateItem(selectedItemIndex, updatedData)}
        />
      )}
    </div>
  );
};

export default App;