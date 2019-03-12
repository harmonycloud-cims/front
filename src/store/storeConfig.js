import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import rootReducer from './reducers/index';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import rootSaga from './sagas/rootSaga';

const sagamiddleware = createSagaMiddleware();
// 数据对象
const storageConfig = {
  key: 'root', // 必须有的
  storage: storage, // storage is now required
  blacklist: [
    'updateLogin',
    'updatePatient',
    'updateAppointment',
    'updateConsultation',
    'updatePrescription'
  ] // reducer 里不持久化的数据
};

export default function configureStore(initState = {}) {
  const middlewares = [sagamiddleware];
  const createStoreMiddleware = applyMiddleware(...middlewares)(createStore);
  const store = createStoreMiddleware(
    persistReducer(storageConfig, rootReducer),
    initState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  sagamiddleware.run(rootSaga);
  store.close = () => store.dispatch(END);
  // 热加载
  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./reducers/index').default;
      store.replaceReducer(
        persistReducer(storageConfig, rootReducer(nextRootReducer))
      );
    });
  }
  let persistor = persistStore(store);
  return { store, persistor };
}
