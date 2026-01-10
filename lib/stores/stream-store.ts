// 💎 STREAM STORE - Zustand State Management
// Manages CALIBRAX visualization state

import { create } from 'zustand';
import type { StreamState, StreamActions, CalibrationRun, StreamFilters, ZoomLevel } from '@/types/calibrax';
import { fetchCalibrations } from '@/lib/calibrax/fetchCalibrations';

type StreamStore = StreamState & StreamActions;

export const useStreamStore = create<StreamStore>((set, get) => ({
  // State
  calibrations: [],
  filteredCalibrations: [],
  selectedRun: null,
  zoomLevel: 'cron-overview',
  filters: {},
  isLoading: false,
  error: null,

  // Actions
  fetchCalibrations: async (limit = 100) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchCalibrations(limit);
      set({ 
        calibrations: data,
        filteredCalibrations: data,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  },

  setSelectedRun: (run) => {
    set({ selectedRun: run });
  },

  setZoomLevel: (level: ZoomLevel) => {
    set({ zoomLevel: level });
  },

  setFilters: (newFilters: Partial<StreamFilters>) => {
    const filters = { ...get().filters, ...newFilters };
    set({ filters });
    
    // Apply filters
    const { calibrations } = get();
    const filtered = calibrations.filter(run => {
      // Model filter
      if (filters.model && run.cron_data.modell !== filters.model) {
        return false;
      }
      
      // Score range filter (changed from drift)
      if (filters.scoreMin !== undefined && run.scores.overall < filters.scoreMin) {
        return false;
      }
      if (filters.scoreMax !== undefined && run.scores.overall > filters.scoreMax) {
        return false;
      }
      
      // Status filter (changed to meta.success)
      if (filters.status !== undefined && run.meta.success !== filters.status) {
        return false;
      }
      
      // Timeframe filter
      if (filters.timeframe) {
        const runTime = new Date(run.timestamp).getTime();
        const start = new Date(filters.timeframe.start).getTime();
        const end = new Date(filters.timeframe.end).getTime();
        if (runTime < start || runTime > end) {
          return false;
        }
      }
      
      return true;
    });
    
    set({ filteredCalibrations: filtered });
  },

  clearFilters: () => {
    const { calibrations } = get();
    set({ 
      filters: {},
      filteredCalibrations: calibrations 
    });
  }
}));
