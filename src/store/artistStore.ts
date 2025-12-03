import { create } from "zustand";
import { getTopArtists } from "../services/artistsService";

interface ArtistsStoreState {
  artists: Artist[];
  loading: boolean;
  error: string | null;

  loadTopArtists: () => Promise<void>;
  clearArtists: () => void;
}

export const useArtistsStore = create<ArtistsStoreState>((set) => ({
  artists: [],
  loading: false,
  error: null,

  loadTopArtists: async () => {
    try {
      set({ loading: true, error: null });

      const result = await getTopArtists();

      set({
        artists: result,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  clearArtists: () => set({ artists: [] }),
}));
