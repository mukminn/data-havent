'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useListBuckets, type BucketInfo } from '@/hooks/useListBuckets';

interface BucketListProps {
  refreshTrigger?: number;
}

export function BucketList({ refreshTrigger }: BucketListProps) {
  const { address } = useAccount();
  const { listBuckets, loading } = useListBuckets();
  const [buckets, setBuckets] = useState<BucketInfo[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

  useEffect(() => {
    if (address) {
      loadBuckets();
    }
  }, [address, refreshTrigger]);

  const loadBuckets = async () => {
    if (!address) return;
    
    try {
      const result = await listBuckets();
      setBuckets(result || []);
    } catch (error) {
      console.error('Error loading buckets:', error);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Your Buckets</h3>
      {loading ? (
        <div className="text-gray-600">Loading buckets...</div>
      ) : buckets.length === 0 ? (
        <p className="text-gray-600">No buckets found. Create one above!</p>
      ) : (
        <div className="space-y-2">
          {buckets.map((bucket) => (
            <div
              key={bucket.bucketId}
              className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedBucket(selectedBucket === bucket.bucketId ? null : bucket.bucketId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {bucket.bucketName && (
                    <p className="font-semibold text-sm mb-1">{bucket.bucketName}</p>
                  )}
                  <p className="font-mono text-xs text-gray-600 break-all">{bucket.bucketId}</p>
                  {bucket.isPrivate !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">
                      {bucket.isPrivate ? '🔒 Private' : '🌐 Public'}
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {selectedBucket === bucket.bucketId ? '▼' : '▶'}
                </span>
              </div>
              {selectedBucket === bucket.bucketId && (
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
        disabled={loading}
        className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
}
