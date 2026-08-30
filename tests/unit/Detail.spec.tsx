import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { composeAsync } from 'expo-mail-composer';
import { Linking } from 'react-native';
import { Detail } from '../../src/pages/Detail';
import { factory } from '../utils/factory';
import { IIncident } from '../../src/types/incident';

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

const mockFormatValue = jest.fn();
jest.mock('../../src/helpers/format-value', () => {
  return {
    formatValue: (value: number) => mockFormatValue(value),
  };
});

describe('Detail', () => {
  it('should be able to see incident details', async () => {
    const incident = await factory.attrs<IIncident>('Incident');

    mockFormatValue.mockReturnValueOnce(incident.value.toString());

    mockUseRoute.mockReturnValueOnce({ params: { incident } });
    const { getByText, getByTestId } = await render(<Detail />);

    expect(
      getByText(
        `${incident.ngo.name} de ${incident.ngo.city}/${incident.ngo.uf}`
      )
    ).toBeTruthy();
    expect(getByText(incident.description)).toBeTruthy();
    expect(getByTestId('value')).toHaveTextContent(incident.value.toString());
  });

  it('should be able to call whatsapp through deep linking', async () => {
    const incident = await factory.attrs<IIncident>('Incident');
    mockFormatValue.mockReturnValueOnce(incident.value.toString());

    const openURL = jest.spyOn(Linking, 'openURL');

    mockUseRoute.mockReturnValueOnce({ params: { incident } });
    const { getByTestId } = await render(<Detail />);

    await fireEvent.press(getByTestId('whatsapp'));

    expect(openURL).toHaveBeenCalledWith(
      `whatsapp://send?phone:${incident.ngo.whatsapp}&text=Olá ${incident.ngo.name}, estou entrando ` +
        `em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${incident.value}`
    );
  });

  it('should be able to call mail composer', async () => {
    const incident = await factory.attrs<IIncident>('Incident');

    mockFormatValue.mockReturnValueOnce(incident.value.toString());

    mockUseRoute.mockReturnValueOnce({ params: { incident } });
    const { getByTestId, getByText } = await render(<Detail />);

    await waitFor(() => getByText(incident.value.toString()));
    await fireEvent.press(getByTestId('email'));

    expect(composeAsync).toHaveBeenCalledWith({
      subject: `Herói do caso: ${incident.title}`,
      recipients: [incident.ngo.email],
      body: `Olá ${incident.ngo.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${incident.value}`,
    });
  });

  it('should be able to back to previous page', async () => {
    const incident = await factory.attrs('Incident');

    mockUseRoute.mockReturnValueOnce({ params: { incident } });
    const { getByTestId } = await render(<Detail />);

    await fireEvent.press(getByTestId('back'));

    expect(mockGoBack).toHaveBeenCalled();
  });
});
