import React from 'react';
import ReactDOM from 'react-dom';
import routes from './router';
import './index.css';
import './style/common.module.scss';
import { HashRouter as Router } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import configure from './store/storeConfig';
import { PersistGate } from 'redux-persist/integration/react';

const { persistor, store } = configure({});

ReactDOM.render((
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Router>
                {routes}
            </Router>
        </PersistGate>
    </Provider>
), document.getElementById('root'));
document.title = 'CIMS';
serviceWorker.unregister();
