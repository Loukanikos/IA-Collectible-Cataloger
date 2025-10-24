
import React, { useRef, useState } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  imagePreview: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, imagePreview }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        Item Image
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
        />
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
        ) : (
          <div className="text-gray-400">
            <UploadIcon />
            <p className="mt-2">Drag & drop an image here</p>
            <p className="text-xs">or click to select a file</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
