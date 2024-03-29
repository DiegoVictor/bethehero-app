import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { composeAsync } from 'expo-mail-composer';
import { Linking } from 'react-native';

import { Detail } from '~/pages/Detail';
import factory from '../utils/factory';

const mockGoBack = jest.fn();
const mockUseRoute = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      goBack: mockGoBack,
    }),
    useRoute: () => mockUseRoute(),
  };
});
jest.mock('expo-mail-composer');

describe('Detail', () => {
  it('should be able to see incident details', async () => {
    const incident = await factory.attrs('Incident');

    jest.spyOn(Intl, 'NumberFormat').mockReturnValue({
      format: () => incident.value,
    });

    mockUseRoute.mockReturnValue({ params: { incident } });
    const { getByText, getByTestId } = render(<Detail />);

    expect(
      getByText(
        `${incident.ngo.name} de ${incident.ngo.city}/${incident.ngo.uf}`
      )
    ).toBeTruthy();
    expect(getByText(incident.description)).toBeTruthy();
    expect(getByTestId('value')).toHaveTextContent(incident.value);
  });

  it('should be able to call whatsapp through deep linking', async () => {
    const incident = await factory.attrs('Incident');
    const formatedValue = Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(incident.value);

    const openURL = jest.spyOn(Linking, 'openURL');

    mockUseRoute.mockReturnValue({ params: { incident } });
    const { getByTestId } = render(<Detail />);

    fireEvent.press(getByTestId('whatsapp'));

    expect(openURL).toHaveBeenCalledWith(
      `whatsapp://send?phone:${incident.ngo.whatsapp}&text=Olá ${incident.ngo.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${formatedValue}`
    );
  });

  it('should be able to call mail composer', async () => {
    const incident = await factory.attrs('Incident');
    const formatedValue = Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(incident.value);

    mockUseRoute.mockReturnValue({ params: { incident } });
    const { getByTestId } = render(<Detail />);

    fireEvent.press(getByTestId('email'));

    expect(composeAsync).toHaveBeenCalledWith({
      subject: `Herói do caso: ${incident.title}`,
      recipients: [incident.ngo.email],
      body: `Olá ${incident.ngo.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${formatedValue}`,
    });
  });

  it('should be able to back to previous page', async () => {
    const incident = await factory.attrs('Incident');

    mockUseRoute.mockReturnValue({ params: { incident } });
    const { getByTestId } = render(<Detail />);

    fireEvent.press(getByTestId('back'));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
