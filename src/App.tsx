import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import AppNavigator from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigator />
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
