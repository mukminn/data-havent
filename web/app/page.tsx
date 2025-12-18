'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletInfo } from '@/components/WalletInfo';
import { BucketManager } from '@/components/BucketManager';
import { FileManager } from '@/components/FileManager';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">DataHaven Testnet</h1>
          <p className="text-gray-600">Simple Storage Manager</p>
        </div>

        {/* Connect Wallet */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Connect Wallet</h2>
              <p className="text-gray-600">
                Connect your wallet to start using DataHaven testnet
              </p>
            </div>
            <ConnectButton />
          </div>
        </div>

        {/* Wallet Info & Balance */}
        {isConnected && (
          <>
            <WalletInfo />
            <BucketManager />
            <FileManager />
          </>
        )}

        {/* Info when not connected */}
        {!isConnected && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Get Started
            </h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Connect your wallet using the button above</li>
              <li>Get testnet tokens from the faucet</li>
              <li>Create a bucket to store your files</li>
              <li>Upload and manage your files</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
