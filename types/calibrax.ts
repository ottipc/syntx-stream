// 🔱 CALIBRAX TYPE DEFINITIONS
// SYNTX::KRONTUN Stream Visualization Types
// Updated to match actual API response format

export interface CalibrationRun {
  timestamp: string;
  cron_data: CronData;
  stages?: CalibrationStages;
  scores: CalibrationScores;
  meta: CalibrationMeta;
}

export interface CronData {
  name: string;
  modell: string;
  felder: FieldWeights;
}

export interface FieldWeights {
  [key: string]: number; // Dynamic fields (sigma_drift, driftkorper, etc.)
}

export interface CalibrationScores {
  overall: number;
  field_completeness: number;
  structure_adherence: number;
}

export interface CalibrationMeta {
  duration_ms: number;
  retry_count: number;
  success: boolean;
}

export interface CalibrationStages {
  gpt_system_prompt: string;
  gpt_user_prompt: string | null;
  gpt_output_meta_prompt: string;
  mistral_input: string;
  mistral_output: string;
  parsed_fields: ParsedFields;
}

export interface ParsedFields {
  [key: string]: string | null; // Dynamic parsed fields
}

// Zoom Levels
export type ZoomLevel = 'cron-overview' | 'prompt-level' | 'field-level';

// Drift Color Mapping (calculated from scores.overall)
export interface DriftColor {
  color: string; // Hex color
  glow: number; // 0-1 intensity
  label: string; // "Stable", "Warning", "Critical"
}

// Stream Store State
export interface StreamState {
  calibrations: CalibrationRun[];
  filteredCalibrations: CalibrationRun[];
  selectedRun: CalibrationRun | null;
  zoomLevel: ZoomLevel;
  filters: StreamFilters;
  isLoading: boolean;
  error: string | null;
}

export interface StreamFilters {
  model?: string;
  scoreMin?: number; // Changed from driftMin
  scoreMax?: number; // Changed from driftMax
  timeframe?: {
    start: string;
    end: string;
  };
  status?: boolean; // meta.success
}

// Actions
export interface StreamActions {
  fetchCalibrations: (limit?: number) => Promise<void>;
  setSelectedRun: (run: CalibrationRun | null) => void;
  setZoomLevel: (level: ZoomLevel) => void;
  setFilters: (filters: Partial<StreamFilters>) => void;
  clearFilters: () => void;
}

// DEPRECATED (old format - kept for reference)
// export interface CalibrationResult {
//   status: 'completed' | 'failed' | 'running';
//   generated: number;
//   failed: number;
//   avg_quality: number;
//   drift: number;
//   cost: number;
//   duration_ms: number;
// }
