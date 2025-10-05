'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ImageUploadProps {
  label: string;
  images: File[];
  previews: string[];
  onChange: (images: File[]) => void;
  onPreviewsChange: (previews: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
}

const ImageUpload = ({
  label,
  images,
  previews,
  onChange,
  onPreviewsChange,
  maxImages = 5,
  maxSizeMB = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  required = false,
  error,
  helpText,
  className = ''
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    newFiles.forEach(file => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`El archivo ${file.name} es demasiado grande. Máximo ${maxSizeMB}MB.`);
        return;
      }

      // Check file format
      if (!acceptedFormats.includes(file.type)) {
        alert(`El archivo ${file.name} no es un formato válido. Formatos permitidos: ${acceptedFormats.join(', ')}.`);
        return;
      }

      // Check max images
      if (images.length + validFiles.length >= maxImages) {
        alert(`Máximo ${maxImages} imágenes permitidas.`);
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    if (validFiles.length > 0) {
      onChange([...images, ...validFiles]);
      onPreviewsChange([...previews, ...validPreviews]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    onChange(newImages);
    onPreviewsChange(newPreviews);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-text-light font-medium text-sm">
        {label}
        {required && <span className="text-alert ml-1">*</span>}
      </label>

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
            dragOver 
              ? 'border-primary bg-primary bg-opacity-10' 
              : 'border-gray-light hover:border-primary hover:bg-light-bg'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-text-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="text-text-light font-medium">
              Arrastra imágenes aquí o haz clic para seleccionar
            </div>
            <div className="text-text-soft text-sm">
              Máximo {maxImages} imágenes, {maxSizeMB}MB cada una
            </div>
            <div className="text-text-soft text-xs">
              Formatos: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFormats.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-light">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-alert text-text-light rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-text-soft mt-1 text-center truncate">
                {images[index]?.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Help Text / Error */}
      {error && (
        <p className="text-alert text-xs">{error}</p>
      )}
      
      {helpText && !error && (
        <p className="text-text-soft text-xs">{helpText}</p>
      )}
    </div>
  );
};

export default ImageUpload;
