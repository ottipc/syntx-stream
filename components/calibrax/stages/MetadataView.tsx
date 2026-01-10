'use client';

import type { CalibrationRun } from '@/types/calibrax';

interface MetadataViewProps {
  run: CalibrationRun;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-800">
      <span className="text-gray-400">{label}</span>
      <span className="text-cyan-400 font-mono">{value}</span>
    </div>
  );
}

export function MetadataView({ run }: MetadataViewProps) {
  const duration = (run.meta.duration_ms / 1000).toFixed(2);
  const fieldCount = Object.keys(run.cron_data.felder).length;

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-cyan-400 font-bold mb-3">📊 Metadata</h3>
        <InfoRow label="Timestamp" value={new Date(run.timestamp).toLocaleString()} />
        <InfoRow label="Model" value={run.cron_data.modell} />
        <InfoRow label="Duration" value={`${duration}s`} />
        <InfoRow label="Fields Expected" value={fieldCount.toString()} />
        <InfoRow label="Retry Count" value={run.meta.retry_count.toString()} />
        <InfoRow label="Status" value={run.meta.success ? 'SUCCESS' : 'FAILED'} />
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <h3 className="text-cyan-400 font-bold mb-3">🎯 Scores</h3>
        <InfoRow label="Overall" value={`${run.scores.overall}%`} />
        <InfoRow label="Field Completeness" value={`${run.scores.field_completeness}%`} />
        <InfoRow label="Structure Adherence" value={`${run.scores.structure_adherence}%`} />
      </div>
    </div>
  );
}
