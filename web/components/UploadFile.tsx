'use client';

import { useState } from 'react';
import { uploadFileAction } from '@/lib/actions';

interface UploadFileProps {
  bucketId: string;
  onSuccess?: () => void;
}

export function UploadFile({ bucketId, onSuccess }: UploadFileProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await uploadFileAction(bucketId, file);
      if (result.success) {
        setMessage(`✅ File uploaded! Key: ${result.fileKey}`);
        setFile(null);
        onSuccess?.();
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message || 'Failed to upload file'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b pb-6">
      <h3 className="text-lg font-semibold mb-4">Upload File</h3>
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select File
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !file}
          className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Uploading...' : 'Upload File'}
        </button>
        {message && (
          <p className={`text-sm ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
