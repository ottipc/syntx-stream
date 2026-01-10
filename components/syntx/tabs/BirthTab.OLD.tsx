'use client';

import { StreamList } from '@/components/streams/StreamList';

export function BirthTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            🌊 BIRTH - Stream Creation
          </h2>
          <p className="text-slate-400">
            Create and manage SYNTX workflow streams
          </p>
        </div>
      </div>
      
      <StreamList />
    </div>
  );
}
