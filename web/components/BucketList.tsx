'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useListBuckets, type BucketInfo } from '@/hooks/useListBuckets';

interface BucketListProps {
  refreshTrigger?: number;
}

export function BucketList({ refreshTrigger }: BucketListProps) {
  const { address } = useAccount();
  const { listBuckets, queryBucketsByAddress, loading } = useListBuckets();
  const [buckets, setBuckets] = useState<BucketInfo[]>([]);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [queryMode, setQueryMode] = useState<'auto' | 'manual'>('auto');

  useEffect(() => {
    if (address && queryMode === 'auto') {
      loadBuckets();
    }
  }, [address, refreshTrigger, queryMode]);

  const loadBuckets = async () => {
    if (queryMode === 'manual' && !walletAddress) {
      return;
    }
    
    const targetAddress = queryMode === 'manual' ? walletAddress : address;
    if (!targetAddress) return;
    
    try {
      let result: BucketInfo[] = [];
      
      if (queryMode === 'manual') {
        result = await queryBucketsByAddress(walletAddress);
      } else {
        result = await listBuckets();
      }
      
      setBuckets(result || []);
    } catch (error) {
      console.error('Error loading buckets:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAddress.trim()) {
      loadBuckets();
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Your Buckets</h3>
      
      {/* Query Mode Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => {
            setQueryMode('auto');
            setWalletAddress('');
          }}
          className={`px-3 py-1 text-sm rounded ${
            queryMode === 'auto'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Auto (Connected Wallet)
        </button>
        <button
          onClick={() => setQueryMode('manual')}
          className={`px-3 py-1 text-sm rounded ${
            queryMode === 'manual'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Manual (Enter Address)
        </button>
      </div>

      {/* Manual Query Form */}
      {queryMode === 'manual' && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter wallet address (0x...)"
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={loading || !walletAddress.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Check Buckets'}
            </button>
          </div>
        </form>
      )}

      {/* Buckets List */}
      {loading ? (
        <div className="text-gray-600">Loading buckets...</div>
      ) : buckets.length === 0 ? (
        <p className="text-gray-600">
          {queryMode === 'manual' && walletAddress
            ? `No buckets found for address: ${walletAddress.slice(0, 10)}...`
            : 'No buckets found. Create one above!'}
        </p>
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
                  <p className="text-xs text-gray-600 mb-2">
                    Use this bucket ID to upload files
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(bucket.bucketId);
                      alert('Bucket ID copied to clipboard!');
                    }}
                    className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Copy Bucket ID
                  </button>
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
