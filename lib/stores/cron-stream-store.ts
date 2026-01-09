import { create } from 'zustand';
import type { StromConfig, StromCreateData, StromUpdateData } from '@/types/strom';

const API_BASE = '/api/strom/crud';

interface StreamStore {
  streams: StromConfig[];
  loading: boolean;
  error: string | null;
  
  fetchStreams: () => Promise<void>;
  createStream: (data: StromCreateData) => Promise<StromConfig>;
  updateStream: (strom_id: string, data: StromUpdateData) => Promise<StromConfig>;
  deleteStream: (strom_id: string) => Promise<void>;
  toggleActive: (strom_id: string) => Promise<void>;
}

export const useCronStreamStore = create<StreamStore>((set, get) => ({
  streams: [],
  loading: false,
  error: null,
  
  fetchStreams: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch streams');
      const data = await res.json();
      set({ streams: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  createStream: async (data) => {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create stream');
      const created = await res.json();
      set({ streams: [...get().streams, created] });
      return created;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
  
  updateStream: async (strom_id, data) => {
    try {
      const res = await fetch(`${API_BASE}?strom_id=${strom_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to update stream');
      const updated = await res.json();
      set({
        streams: get().streams.map(s => 
          s.strom_id === strom_id ? updated : s
        )
      });
      return updated;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
  
  deleteStream: async (strom_id) => {
    try {
      const res = await fetch(`${API_BASE}?strom_id=${strom_id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete stream');
      set({
        streams: get().streams.filter(s => s.strom_id !== strom_id)
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },
  
  toggleActive: async (strom_id) => {
    const stream = get().streams.find(s => s.strom_id === strom_id);
    if (stream) {
      await get().updateStream(strom_id, { ...stream, aktiv: !stream.aktiv } as StromUpdateData);
    }
  }
}));
