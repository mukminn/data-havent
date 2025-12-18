'use client';

import { useState, useEffect } from 'react';
import { listFilesAction, downloadFileAction } from '@/lib/actions';

interface FileListProps {
  bucketId: string;
}

export function FileList({ bucketId }: FileListProps) {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (bucketId) {
      loadFiles();
    }
  }, [bucketId]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const result = await listFilesAction(bucketId);
      if (result.success) {
        setFiles(result.files || []);
      }
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileKey: string) => {
    setDownloading(fileKey);
    try {
      const result = await downloadFileAction(bucketId, fileKey);
      if (result.success && result.blob) {
        // Create download link
        const url = window.URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileKey;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setDownloading(null);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading files...</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Files in Bucket</h3>
      {files.length === 0 ? (
        <p className="text-gray-600">No files found. Upload one above!</p>
      ) : (
        <div className="space-y-2">
          {files.map((fileKey) => (
            <div
              key={fileKey}
              className="p-3 border rounded-lg flex items-center justify-between"
            >
              <p className="font-mono text-sm flex-1">{fileKey}</p>
              <button
                onClick={() => handleDownload(fileKey)}
                disabled={downloading === fileKey}
                className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:bg-gray-400 text-sm"
              >
                {downloading === fileKey ? 'Downloading...' : 'Download'}
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={loadFiles}
        className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
      >
        Refresh
      </button>
    </div>
  );
}
