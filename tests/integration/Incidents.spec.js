import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import api from '~/services/api';
import factory from '../utils/factory';
import { Incidents } from '~/pages/Incidents';

const apiMock = new MockAdapter(api);
const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

describe('Incidents', () => {
  beforeEach(() => {
    apiMock.reset();
  });

  it('should be able to get a list of incidents', async () => {
    const incidents = await factory.attrsMany('Incident', 3);

    apiMock.onGet('/incidents').reply(200, incidents, {
      'x-total-counts': incidents.length,
    });

    const { getByText, getByTestId } = render(<Incidents />);

    const [{ id }] = incidents;
    await waitFor(() => getByTestId(`incident_${id}_detail`));

    await act(async () => {
      fireEvent(getByTestId('incidents'), 'onEndReached');
    });

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
    const incidents = await factory.attrsMany('Incident', 10);

    apiMock
      .onGet('/incidents', { params: { page: 1 } })
      .reply(200, incidents.slice(0, 5), {
        'x-total-counts': 10,
        link: 'rel="last"',
      })
      .onGet('/incidents', { params: { page: 2 } })
      .reply(200, incidents.slice(-5), { 'x-total-counts': 10 });

    const { getByTestId, getByText } = render(<Incidents />);

    const [{ id }] = incidents;
    await waitFor(() => getByTestId(`incident_${id}_detail`));

    await act(async () => {
      fireEvent(getByTestId('incidents'), 'onEndReached');
    });

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
    const incident = await factory.attrs('Incident');

    apiMock.onGet('/incidents').reply(200, [incident], { 'x-total-counts': 1 });

    const { getByTestId } = render(<Incidents />);

    await waitFor(() => getByTestId(`incident_${incident.id}_detail`));

    fireEvent.press(getByTestId(`incident_${incident.id}_detail`));

    expect(mockNavigate).toHaveBeenCalledWith('Detail', { incident });
  });
});
