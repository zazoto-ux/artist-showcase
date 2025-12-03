import { create } from "zustand";
import { getTopTracks } from "../services/trackService";

interface TrackStoreState {
  tracks: Track[];
  loading: boolean;
  error: string | null;

  loadTopTracks: () => Promise<void>;
  clearTracks: () => void;
}

export const useTrackStore = create<TrackStoreState>((set) => ({
  tracks: [],
  loading: false,
  error: null,

  loadTopTracks: async () => {
    try {
      set({ loading: true, error: null });

      const result = await getTopTracks();

      set({
        tracks: result,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearTracks: () => set({ tracks: [] }),
}));
