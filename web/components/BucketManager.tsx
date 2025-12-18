'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { CreateBucket } from './CreateBucket';
import { BucketList } from './BucketList';

export function BucketManager() {
  const { isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  if (!isConnected) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Bucket Manager</h2>
      
      <div className="space-y-6">
        <CreateBucket onSuccess={() => setRefreshKey(k => k + 1)} />
        <BucketList refreshTrigger={refreshKey} />
      </div>
    </div>
  );
}
