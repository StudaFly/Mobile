import { useMobilityStore } from '../../../src/features/mobility/store/mobility.store';

describe('useMobilityStore', () => {
  afterEach(() => {
    useMobilityStore.setState({ activeMobilityId: null });
  });

  it('has null activeMobilityId initially', () => {
    expect(useMobilityStore.getState().activeMobilityId).toBeNull();
  });

  describe('setActiveMobilityId', () => {
    it('updates activeMobilityId', () => {
      useMobilityStore.getState().setActiveMobilityId('mob-42');
      expect(useMobilityStore.getState().activeMobilityId).toBe('mob-42');
    });

    it('can update to a different id', () => {
      useMobilityStore.getState().setActiveMobilityId('mob-1');
      useMobilityStore.getState().setActiveMobilityId('mob-2');
      expect(useMobilityStore.getState().activeMobilityId).toBe('mob-2');
    });
  });
});
