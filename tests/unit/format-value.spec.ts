import { formatValue } from '../../src/helpers/format-value';

describe('formatValue', () => {
  it('should format a number with commas', () => {
    expect(formatValue(1000)).toBe(
      Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(1000)
    );
    expect(formatValue(1000000)).toBe(
      Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(1000000)
    );
  });
});
