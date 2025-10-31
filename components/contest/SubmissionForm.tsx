'use client';

import { useState, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSupabaseStorage } from '@/lib/contexts/SupabaseStorageContext';
import { useSubmission } from '@/lib/contexts/SubmissionProvider';

interface SubmissionFormProps {
  contestId: string;
  onSuccess?: () => void;
  useSmartContract?: boolean;
}

export default function SubmissionForm({ contestId, onSuccess, useSmartContract = false }: SubmissionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, login } = usePrivy();
  const { uploadImage, isUploading } = useSupabaseStorage();
  const submission = useSubmission();

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('❌ Please select an image file');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!user?.wallet?.address) {
      login();
      return;
    }

    if (!selectedFile) {
      alert('❌ Please select an image');
      return;
    }

    setSubmitting(true);

    try {
      // Get form data first
      const formData = new FormData(e.currentTarget);
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      
      // Upload image to Supabase
      const imageUrl = await uploadImage(selectedFile);
      
      // Use smart contract submission if available
      if (useSmartContract && submission) {
        console.log('[SUBMISSION FORM] Using gasless smart contract submission');
        
        // Create metadata URI (could be IPFS or JSON string)
        const metadata = JSON.stringify({
          title,
          description,
          mediaUrl: imageUrl,
          mediaType: 'image',
        });
        
        await submission.submitEntry({
          contestId,
          title,
          description,
          mediaUrl: imageUrl,
          metadataURI: metadata,
        });
        
        alert('✅ Submission successful!');
        setIsOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (onSuccess) onSuccess();
        window.location.reload();
      } else {
        console.log('[SUBMISSION FORM] Using database-only submission');
        
        const data = {
          contestId,
          walletAddress: user.wallet.address,
          title,
          description,
          mediaUrl: imageUrl,
          mediaType: 'image',
          thumbnailUrl: imageUrl,
        };

        console.log('Submitting data:', data);
        
        const res = await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        console.log('Response status:', res.status);
        const responseData = await res.json();
        console.log('Response data:', responseData);

        if (res.ok) {
          alert('✅ Submission successful!');
          setIsOpen(false);
          setSelectedFile(null);
          setPreviewUrl(null);
          if (onSuccess) onSuccess();
          window.location.reload();
        } else {
          alert(`❌ ${responseData.error || 'Failed to submit'}`);
        }
      }
    } catch (uploadError) {
      alert(`❌ Upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          if (!user?.wallet?.address) {
            login();
            return;
          }
          setIsOpen(true);
        }}
        className="bg-spook-orange hover:bg-spook-orange/80 px-8 py-4 rounded-xl font-semibold text-lg shadow-glow-orange transition-all"
      >
        {!user?.wallet?.address ? '🔐 Login to Submit' : '🎤 Submit Entry'}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-spook-900 border border-spook-orange rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-creepster text-3xl text-spook-orange">
            🎃 Submit Your Entry
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-spook-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="My Spooky Costume"
              className="w-full px-4 py-3 bg-white border border-spook-700 rounded-lg text-black placeholder-gray-500 focus:border-spook-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-spook-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe your costume..."
              className="w-full px-4 py-3 bg-white border border-spook-700 rounded-lg text-black placeholder-gray-500 focus:border-spook-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-spook-300 mb-2">
              Upload Image *
            </label>
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 bg-spook-800 border border-spook-700 border-dashed rounded-lg text-white hover:border-spook-orange transition-colors focus:outline-none focus:border-spook-orange"
              >
                {selectedFile ? selectedFile.name : '📁 Choose Image'}
              </button>
              
              {previewUrl && (
                <div className="relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              )}
              
              <p className="text-xs text-gray-500">
                Supported: JPG, PNG, GIF • Max size: 5MB
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting || isUploading || !selectedFile}
              className="flex-1 bg-spook-orange hover:bg-spook-orange/80 px-6 py-3 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isUploading ? '📤 Uploading...' : submitting ? '⏳ Submitting...' : '🎃 Submit Entry'}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-spook-800 hover:bg-spook-700 rounded-lg text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
