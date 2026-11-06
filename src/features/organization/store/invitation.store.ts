import { create } from 'zustand';

interface InvitationStore {
  pendingToken: string | null;
  setPendingToken: (token: string | null) => void;
}

/** Invitation opened before signing in: reopened once the student is logged in. */
export const useInvitationStore = create<InvitationStore>((set) => ({
  pendingToken: null,
  setPendingToken: (pendingToken) => set({ pendingToken }),
}));
