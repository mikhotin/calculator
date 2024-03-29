import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { App } from './App';
import { AuthContextProvider } from './context';
import { ErrorBoundary } from './pages/Error';

import { store } from './store';
import './styles.css';

const app = (
  <ErrorBoundary>
    <Provider store={store}>
      <AuthContextProvider>
        {/* <GlobalModal> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
        {/* </GlobalModal> */}
      </AuthContextProvider>
    </Provider>
  </ErrorBoundary>
);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(app);
