import { create } from 'zustand';

interface MobilityStore {
  activeMobilityId: string | null;
  setActiveMobilityId: (id: string) => void;
  reset: () => void;
}

export const useMobilityStore = create<MobilityStore>((set) => ({
  activeMobilityId: null,
  setActiveMobilityId: (id) => set({ activeMobilityId: id }),
  reset: () => set({ activeMobilityId: null }),
}));
