import { create } from 'zustand';

interface MobilityStore {
  activeMobilityId: string | null;
  setActiveMobilityId: (id: string) => void;
}

export const useMobilityStore = create<MobilityStore>((set) => ({
  activeMobilityId: null,
  setActiveMobilityId: (id) => set({ activeMobilityId: id }),
}));
