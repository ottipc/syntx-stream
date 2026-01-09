'use client';

import { StreamList } from '@/components/streams/StreamList';

export default function StreamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🌊 Stream Management
          </h1>
          <p className="text-slate-400">
            Manage your SYNTX workflow streams
          </p>
        </div>
        
        <StreamList />
      </div>
    </div>
  );
}
