import axios from 'axios';
import Promise from 'babel-polyfill';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import storeConfig from '../store/storeConfig';
// import configureStore from '../store/storeConfig';

// To add to window  解决promise 在ie中未定义的问题
if (!window.Promise) {
  window.Promise = Promise;
}

NProgress.configure({
  minimum: 0.1,
  easing: 'ease',
  speed: 800,
  showSpinner: false
});
let needLoadingRequestCount = 0;
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    NProgress.start();
  }
  needLoadingRequestCount++;
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return;
  needLoadingRequestCount--;
  if (needLoadingRequestCount === 0) return NProgress.done();
}

axios.interceptors.request.use(
  config => {
    if (config.url.indexOf('/appointment/appointmentList') < 0) {
      showFullScreenLoading();
    }
    if (
      !(config.url.indexOf('/login') > -1 || config.url.indexOf('/user') > -1)
    ) {
      config.headers.Authorization = `Bearer ${window.sessionStorage.getItem(
        'token'
      )}`;
      config.headers.user = window.sessionStorage.getItem('user');
      config.headers.clinic = window.sessionStorage.getItem('clinic');
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    tryHideFullScreenLoading();
    return response;
  },
  err => {
    tryHideFullScreenLoading();
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = 'Bad Request(400)';
          break;
        case 401:
          err.message = 'Please re-login without authorization(401)';
          setTimeout(() => {
            storeConfig.store.dispatch({ type: 'CLOSE_ERROR_MESSAGE' });
            storeConfig.store.dispatch({ type: 'LOGOUT' });
          }, 3000);
          break;
        case 403:
          err.message = 'Forbidden(403)';
          setTimeout(() => {
            storeConfig.store.dispatch({ type: 'CLOSE_ERROR_MESSAGE' });
            storeConfig.store.dispatch({ type: 'LOGOUT' });
          }, 3000);
          break;
        case 404:
          err.message = 'Not Found(404)';
          break;
        case 408:
          err.message = 'Request Timeout(408)';
          break;
        case 500:
          err.message = 'Internal Server Error(500)';
          break;
        case 501:
          err.message = 'Not Implemented(501)';
          break;
        case 502:
          err.message = 'Bad Gateway(502)';
          break;
        case 503:
          err.message = 'Service Unavailable(503)';
          break;
        case 504:
          err.message = 'Gateway Timeout(504)';
          break;
        case 505:
          err.message = 'HTTP Version Not Supported(505)';
          break;
        default:
          err.message = `Connection error(${err.response.status})!`;
      }
    } else {
      err.message = 'Connection failure!';
    }
    storeConfig.store.dispatch({
      type: 'OPEN_ERROR_MESSAGE',
      error: err.message
    });
    return Promise.reject(err);
  }
);

export default axios;
