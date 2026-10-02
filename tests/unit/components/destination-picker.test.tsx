import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../src/features/mobility/services/mobility.service', () => ({
  mobilityService: { searchDestinations: jest.fn() },
}));

import { mobilityService } from '../../../src/features/mobility/services/mobility.service';
import { DestinationPicker } from '../../../src/features/mobility/components/DestinationPicker';

function renderPicker(props: Partial<React.ComponentProps<typeof DestinationPicker>> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const onSelect = jest.fn();
  const utils = render(
    <QueryClientProvider client={queryClient}>
      <DestinationPicker value="" selectedId={null} onChangeText={jest.fn()} onSelect={onSelect} {...props} />
    </QueryClientProvider>,
  );
  return { ...utils, onSelect };
}

describe('DestinationPicker', () => {
  beforeEach(() => jest.clearAllMocks());

  it('lists matching destinations and picks one', async () => {
    (mobilityService.searchDestinations as jest.Mock).mockResolvedValue([
      { id: 'd1', city: 'Barcelone', country: 'Espagne' },
      { id: 'd2', city: 'Berlin', country: 'Allemagne' },
    ]);
    const { findByLabelText, onSelect } = renderPicker();

    fireEvent.press(await findByLabelText('Choisir Berlin, Allemagne'));

    expect(onSelect).toHaveBeenCalledWith({ id: 'd2', city: 'Berlin', country: 'Allemagne' });
  });

  it('says when nothing matches', async () => {
    (mobilityService.searchDestinations as jest.Mock).mockResolvedValue([]);
    const { findByText } = renderPicker({ value: 'Montréal' });
    expect(await findByText(/Aucune destination trouvée/)).toBeTruthy();
  });

  it('confirms the selection instead of listing suggestions', () => {
    (mobilityService.searchDestinations as jest.Mock).mockResolvedValue([]);
    const { getByText } = renderPicker({ value: 'Berlin, Allemagne', selectedId: 'd2' });
    expect(getByText('Destination sélectionnée')).toBeTruthy();
  });
});
