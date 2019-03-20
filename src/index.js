import React from 'react';
import ReactDOM from 'react-dom';
import routes from './router';
import './index.css';
import './style/common.module.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configure from './store/storeConfig';
import { PersistGate } from 'redux-persist/integration/react';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

const { persistor, store } = configure({});

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Router>{routes}</Router>
      </MuiPickersUtilsProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);
document.title = 'CIMS';
serviceWorker.unregister();
