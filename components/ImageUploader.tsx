import React, { useRef, useState, useEffect } from 'react';
import UploadIcon from './icons/UploadIcon';

const CameraIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  imagePreview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imagePreview }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      if (isCameraOpen) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Erro ao acessar a câmera:", err);
          alert("Não foi possível acessar a câmera. Verifique as permissões do seu navegador e recarregue a página.");
          setIsCameraOpen(false);
        }
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const imageFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onImageChange(imageFile);
          }
          setIsCameraOpen(false);
        }, 'image/jpeg');
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onImageChange(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] || null;
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Imagem do Item
      </label>
      <div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`relative w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center text-center cursor-pointer transition-colors duration-200 ${
          isDragging ? 'border-teal-400 bg-gray-700/50' : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Pré-visualização" className="w-full h-full object-contain rounded-lg p-2" />
        ) : (
          <div className="text-gray-400">
            <UploadIcon />
            <p className="mt-2">Arraste e solte uma imagem aqui</p>
            <p className="text-xs">ou clique para selecionar um arquivo</p>
          </div>
        )}
      </div>

      <div className="my-4 flex items-center" aria-hidden="true">
        <div className="flex-grow border-t border-gray-700"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm">OU</span>
        <div className="flex-grow border-t border-gray-700"></div>
      </div>

      <button
        onClick={() => setIsCameraOpen(true)}
        className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out shadow-sm"
        aria-label="Usar câmera para adicionar imagem"
      >
        <CameraIcon />
        Usar Câmera
      </button>

      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
          <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl max-w-3xl w-full border border-gray-700">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg aspect-video object-cover bg-black"></video>
            <canvas ref={canvasRef} className="hidden" aria-hidden="true"></canvas>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleCapture} 
                className="w-full sm:w-auto flex-1 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Capturar Foto
              </button>
              <button 
                onClick={() => setIsCameraOpen(false)}
                className="w-full sm:w-auto flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;