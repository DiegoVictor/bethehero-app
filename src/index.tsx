import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Detail } from './pages/Detail';
import { Incidents } from './pages/Incidents';
import { IIncident } from './types/incident';

export type StackParamList = {
  Incidents: undefined;
  Detail: {
    incident: IIncident;
  };
};

const StackNavigator = createNativeStackNavigator<StackParamList>({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Incidents,
    Detail,
  },
  initialRouteName: 'Incidents',
});
const Navigation = createStaticNavigation(StackNavigator);

export const App = () => <Navigation />;
