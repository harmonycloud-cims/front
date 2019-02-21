import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import createReducer from './reducers/index';
import  { persistReducer, persistStore  } from 'redux-persist';
import storage from 'redux-persist/es/storage';

const sagamiddleware = createSagaMiddleware();
// 数据对象
const storageConfig = {
    key: 'root', // 必须有的
    storage: storage, // storage is now required
    blacklist: [] // reducer 里不持久化的数据
};

export default function configureStore(initState = {}) {
    const middlewares = [sagamiddleware];
    const createStoreMiddleware = applyMiddleware(...middlewares)(createStore);
    const store = createStoreMiddleware(
        // 包装createReducer 即 rootReducer
        persistReducer(storageConfig, createReducer), initState
    );

    store.runSaga = sagamiddleware.run;
    store.close = () => store.dispatch(END);
    // 热加载
    if (module.hot) {
        module.hot.accept(() => {
            const nextRootReducer = require('./reducers/index').default;
            store.replaceReducer(persistReducer(storageConfig, createReducer(nextRootReducer)));
        } );
    }
    let persistor = persistStore(store);
    return {store, persistor};
}