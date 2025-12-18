'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { UploadFile } from './UploadFile';
import { FileList } from './FileList';

export function FileManager() {
  const { isConnected } = useAccount();
  const [selectedBucket, setSelectedBucket] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isConnected) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">File Manager</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Bucket ID (from Bucket Manager)
          </label>
          <input
            type="text"
            value={selectedBucket}
            onChange={(e) => setSelectedBucket(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
          />
        </div>

        {selectedBucket && (
          <>
            <UploadFile
              bucketId={selectedBucket}
              onSuccess={() => setRefreshKey(k => k + 1)}
            />
            <FileList key={refreshKey} bucketId={selectedBucket} />
          </>
        )}
      </div>
    </div>
  );
}
