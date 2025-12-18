'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getBucketsAction } from '@/lib/actions';

export function BucketList() {
  const { address } = useAccount();
  const [buckets, setBuckets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      loadBuckets();
    }
  }, [address]);

  const loadBuckets = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const result = await getBucketsAction();
      if (result.success) {
        setBuckets(result.buckets || []);
      }
    } catch (error) {
      console.error('Error loading buckets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading buckets...</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Your Buckets</h3>
      {buckets.length === 0 ? (
        <p className="text-gray-600">No buckets found. Create one above!</p>
      ) : (
        <div className="space-y-2">
          {buckets.map((bucketId) => (
            <div
              key={bucketId}
              className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedBucket(selectedBucket === bucketId ? null : bucketId)}
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm">{bucketId}</p>
                <span className="text-xs text-gray-500">
                  {selectedBucket === bucketId ? '▼' : '▶'}
                </span>
              </div>
              {selectedBucket === bucketId && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs text-gray-600">
                    Use this bucket ID to upload files
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={loadBuckets}
        className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
      >
        Refresh
      </button>
    </div>
  );
}
