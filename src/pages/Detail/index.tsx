import { useMemo } from 'react';
import { Image, Linking, ScrollView } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import { Feather } from '@react-native-vector-icons/feather';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { formatValue } from '../../helpers/format-value';
import { IIncident } from '../../types/incident';
import Logo from '../../assets/logo.png';
import {
  Action,
  ActionText,
  Actions,
  Back,
  Box,
  Container,
  Description,
  Incident,
  Header,
  Label,
  Title,
  Value,
} from './styles';

type RouteParams = RouteProp<{ Detail: { incident: IIncident } }, 'Detail'>;

export function Detail() {
  const navigation = useNavigation();

  const { params } = useRoute<RouteParams>();
  const { incident } = useMemo(() => params, [params]);

  const formatedValue = useMemo(() => {
    return formatValue(incident.value);
  }, [incident]);

  const message = useMemo(
    () =>
      `Olá ${incident.ngo.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${formatedValue}`,
    [incident, formatedValue]
  );

  const sendMail = () => {
    MailComposer.composeAsync({
      subject: `Herói do caso: ${incident.title}`,
      recipients: [incident.ngo.email],
      body: message,
    });
  };

  const sendWhatsApp = () => {
    Linking.openURL(
      `whatsapp://send?phone:${incident.ngo.whatsapp}&text=${message}`
    );
  };

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Back testID="back" onPress={navigation.goBack}>
          <Feather name="arrow-left" size={28} color="#E82041" />
        </Back>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Incident>
          <Label>ONG</Label>
          <Value>
            {incident.ngo.name} de {incident.ngo.city}/{incident.ngo.uf}
          </Value>

          <Label>CASO</Label>
          <Value>{incident.description}</Value>

          <Label>Valor</Label>
          <Value testID="value">{formatedValue}</Value>
        </Incident>

        <Box>
          <Title>Salve o dia</Title>
          <Title>Seja o héroi desse caso</Title>

          <Description>Entre em contato:</Description>
          <Actions>
            <Action testID="whatsapp" onPress={sendWhatsApp}>
              <ActionText>WhatsApp</ActionText>
            </Action>
            <Action testID="email" onPress={sendMail}>
              <ActionText>Email</ActionText>
            </Action>
          </Actions>
        </Box>
      </ScrollView>
    </Container>
  );
}
