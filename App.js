import { Provider } from 'react-redux';
import store from './redux/store';
import AppNavigator from './Components/AppNavigation/AppNavigation';

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}
