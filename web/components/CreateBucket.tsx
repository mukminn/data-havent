'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { createBucketAction } from '@/lib/actions';

interface CreateBucketProps {
  onSuccess?: () => void;
}

export function CreateBucket({ onSuccess }: CreateBucketProps) {
  const { address } = useAccount();
  const [bucketName, setBucketName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !bucketName.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await createBucketAction(bucketName.trim());
      if (result.success && result.bucketId) {
        setMessage(`✅ Bucket created! ID: ${result.bucketId}`);
        setBucketName('');
        onSuccess?.();
      } else {
        setMessage(`❌ Error: ${result.error || 'Failed to create bucket'}`);
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message || 'Failed to create bucket'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b pb-6">
      <h3 className="text-lg font-semibold mb-4">Create New Bucket</h3>
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Bucket Name
          </label>
          <input
            type="text"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            placeholder="my-bucket"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !bucketName.trim()}
          className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Bucket'}
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
