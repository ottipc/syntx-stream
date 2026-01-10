import { create } from 'zustand';
import type { StromConfig, StromCreateData, StromUpdateData } from '@/types/strom';

const API_BASE = '/api/strom/crud';

interface StreamStore {
  streams: StromConfig[];
  loading: boolean;
  error: string | null;
  lastResult: { success: boolean; message: string } | null;
  
  fetchStreams: () => Promise<void>;
  createStream: (data: StromCreateData) => Promise<{ success: boolean; message: string }>;
  updateStream: (strom_id: string, data: StromUpdateData) => Promise<{ success: boolean; message: string }>;
  deleteStream: (strom_id: string) => Promise<{ success: boolean; message: string }>;
  toggleActive: (strom_id: string) => Promise<void>;
  clearLastResult: () => void;
}

export const useCronStreamStore = create<StreamStore>((set, get) => ({
  streams: [],
  loading: false,
  error: null,
  lastResult: null,
  
  fetchStreams: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`https://dev.syntx-system.com${API_BASE}`);
      if (!res.ok) throw new Error('Failed to fetch streams');
      const data = await res.json();
      set({ streams: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  createStream: async (data) => {
    try {
      const res = await fetch(`https://dev.syntx-system.com${API_BASE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || 'Failed to create stream');
      }
      
      const created = await res.json();
      set({ 
        streams: [...get().streams, created],
        lastResult: { success: true, message: 'Stream created successfully' }
      });
      
      return { success: true, message: 'Stream created successfully' };
    } catch (error) {
      const message = (error as Error).message;
      set({ 
        error: message,
        lastResult: { success: false, message }
      });
      return { success: false, message };
    }
  },
  
  updateStream: async (strom_id, data) => {
    try {
      // Find stream to get muster
      const stream = get().streams.find(s => s.strom_id === strom_id);
      if (!stream) throw new Error('Stream not found');
      
      // Backend uses MUSTER not strom_id!
      const res = await fetch(`https://dev.syntx-system.com${API_BASE}/${stream.muster}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || 'Failed to update stream');
      }
      
      const updated = await res.json();
      set({
        streams: get().streams.map(s => 
          s.strom_id === strom_id ? updated : s
        ),
        lastResult: { success: true, message: 'Stream updated successfully' }
      });
      
      return { success: true, message: 'Stream updated successfully' };
    } catch (error) {
      const message = (error as Error).message;
      set({ 
        error: message,
        lastResult: { success: false, message }
      });
      return { success: false, message };
    }
  },
  
  deleteStream: async (strom_id) => {
    try {
      // Find stream to get muster
      const stream = get().streams.find(s => s.strom_id === strom_id);
      if (!stream) throw new Error('Stream not found');
      
      // Backend uses MUSTER not strom_id!
      const res = await fetch(`https://dev.syntx-system.com${API_BASE}/${stream.muster}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(errorData || 'Failed to delete stream');
      }
      
      set({
        streams: get().streams.filter(s => s.strom_id !== strom_id),
        lastResult: { success: true, message: 'Stream deleted successfully' }
      });
      
      return { success: true, message: 'Stream deleted successfully' };
    } catch (error) {
      const message = (error as Error).message;
      set({ 
        error: message,
        lastResult: { success: false, message }
      });
      return { success: false, message };
    }
  },
  
  toggleActive: async (strom_id) => {
    const stream = get().streams.find(s => s.strom_id === strom_id);
    if (stream) {
      await get().updateStream(strom_id, { ...stream, aktiv: !stream.aktiv } as StromUpdateData);
    }
  },
  
  clearLastResult: () => {
    set({ lastResult: null });
  }
}));
