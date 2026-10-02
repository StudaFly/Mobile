import { formatDestination } from '../../../src/features/mobility/utils';

describe('formatDestination', () => {
  it('joins city and country', () => {
    expect(formatDestination({ city: 'Lisbonne', country: 'Portugal' })).toBe('Lisbonne, Portugal');
  });
});
