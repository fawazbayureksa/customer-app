import React from 'react';
import NavigationProvider from './src/navigations';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as StoreProvider } from 'react-redux';
import store from './src/redux/store';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import './src/constants/translations/IMLocalize';
import 'moment/locale/id';
import { ToastProvider } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/FontAwesome';
import PushController from './src/helpers/PushController';

LogBox.ignoreLogs([
  `ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.`,
  `VirtualizedLists should never be nested inside plain ScrollViews with the same orientation`,
  `source.uri should not be an empty string`,
  `You seem to update the renderersProps prop(s) of the "RenderHTML" component in short periods of time, causing costly tree rerenders (last update was 26.00ms ago).`,
  `Mapbox [info] Request failed due to a permanent error: Canceled  {"level": "warning", "message": "Request failed due to a permanent error: Canceled ", "tag": "Mbgl-HttpRequest"}`
]);


const App = () => {
  return (
    <>
      <StoreProvider store={store}>
        <SafeAreaProvider style={{ flex: 1 }}>
          <ToastProvider
            offset={50}
            warningIcon={
              <Icon
                style={{ marginRight: 5 }}
                name="exclamation-circle"
                size={20}
                color="#fff"
              />
            }>
            <NavigationProvider />
          </ToastProvider>

          <PushController />
        </SafeAreaProvider>
      </StoreProvider>
    </>
  );
};
export default App;
