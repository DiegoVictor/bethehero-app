import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { factory } from '../utils/factory';
import { Incidents } from '../../src/pages/Incidents';
import { IIncident } from '../../src/types/incident';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

const mockAxiosGet = jest.fn();
jest.mock('../../src/services/api', () => {
  return {
    api: {
      get: () => mockAxiosGet(),
    },
  };
});

describe('Incidents', () => {
  it('should be able to get a list of incidents', async () => {
    const incidents = await factory.attrsMany<IIncident>('Incident', 3);

    mockAxiosGet.mockResolvedValueOnce({
      data: incidents,
      headers: {
        'x-total-counts': incidents.length,
      },
    });

    const { getByText, getByTestId } = await render(<Incidents />);

    const [{ id }] = incidents;
    await waitFor(() => getByTestId(`incident_${id}_detail`));

    await fireEvent(getByTestId('incidents'), 'onEndReached');

    incidents.forEach(({ title, value }) => {
      expect(getByText(title)).toBeTruthy();
      expect(
        getByText(
          Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(value)
        )
      ).toBeTruthy();
    });
  });

  it('should be able to get a second page of incidents', async () => {
    const incidents = await factory.attrsMany<IIncident>('Incident', 10);

    mockAxiosGet
      .mockResolvedValueOnce({
        data: incidents.slice(0, 5),
        headers: {
          'x-total-counts': 10,
          link: 'rel="last"',
        },
      })
      .mockResolvedValueOnce({
        data: incidents.slice(-5),
        headers: {
          'x-total-counts': 10,
        },
      });

    const { getByTestId, getByText } = await render(<Incidents />);

    const [{ id }] = incidents;
    await waitFor(() => getByTestId(`incident_${id}_detail`));

    await fireEvent(getByTestId('incidents'), 'onEndReached');

    incidents.forEach(({ title, value }) => {
      expect(getByText(title)).toBeTruthy();

      expect(
        getByText(
          Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
            .format(value)
            .replace(' ', '\u00a0')
        )
      ).toBeTruthy();
    });
  });

  it("should be able to go to the incident's detail", async () => {
    const incident = await factory.attrs<IIncident>('Incident');

    mockAxiosGet.mockResolvedValueOnce({
      data: [incident],
      headers: { 'x-total-counts': 1 },
    });

    const { getByTestId } = await render(<Incidents />);

    await waitFor(() => getByTestId(`incident_${incident.id}_detail`));

    await fireEvent.press(getByTestId(`incident_${incident.id}_detail`));

    expect(mockNavigate).toHaveBeenCalledWith('Detail', { incident });
  });
});
