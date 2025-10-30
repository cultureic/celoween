'use client';

// SupabaseStorageContext.tsx
// Context provider for handling image uploads to Supabase Storage.
// Provides an uploadImage function that takes a File, uploads it to the 'celoween' bucket,
// and returns the public URL.
// Configure your Supabase Storage bucket policies for public read access.

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface SupabaseStorageContextType {
  uploadImage: (file: File, bucket?: string) => Promise<string>;
  isUploading: boolean;
  uploadError: string | null;
}

const SupabaseStorageContext = createContext<SupabaseStorageContextType | undefined>(undefined);

export const SupabaseStorageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = async (file: File, bucket: string = 'celoween'): Promise<string> => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Generate a unique path: timestamp-randomId.ext
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `submissions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get the public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      return data.publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown upload error';
      setUploadError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SupabaseStorageContext.Provider value={{ uploadImage, isUploading, uploadError }}>
      {children}
    </SupabaseStorageContext.Provider>
  );
};

export const useSupabaseStorage = (): SupabaseStorageContextType => {
  const context = useContext(SupabaseStorageContext);
  if (context === undefined) {
    throw new Error('useSupabaseStorage must be used within a SupabaseStorageProvider');
  }
  return context;
};
