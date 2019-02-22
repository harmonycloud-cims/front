import {take, call, put, fork} from 'redux-saga/effects';
// import axios from '../../services/axiosInstance';
import axios from 'axios';

function* doLogin() {
    while(true) {
        const {params} = yield take('DO_LOGIN');
        try {
            let { data } = yield call(axios.post, '/user/login', params); //阻塞，请求后台数据
            if (data.success) {
                yield put({type: 'UPDATE_LOGIN_USER', data}); //发起一个action，类似于dispatch
            } else {
                yield put({ type: 'LOGIN_ERROR', error: data.errorMessage });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
function* getClinicList() {
    while(true) {
        yield take( 'GET_CLINICLIST');
        try {
            let { data } = yield call(axios.get, '/user/listclinic');
            if (data.success) {
                yield put({ type: 'UPDATE_CLINICLIST', data: data.data }); //发起一个action，类似于dispatch
            } else {
                console.log(data.errorMessage)
            }
        } catch(error) {
            console.log(error);
        }
    }
}
function* updateMenu() {
    while(true) {
        let { activeMenu } = yield take( 'CHANGE_MENU');
        yield put({ type: 'UPDATE_MENU', activeMenu });
    }
}
function* logout() {
    while(true) {
        let { activeMenu } = yield take( 'LOGOUT');
        yield put({ type: 'CLEAR_INFORMATION', activeMenu });
    }
}

export default function* rootSaga() {
  yield fork(getClinicList);
  yield fork(doLogin);
  yield fork(updateMenu);
  yield fork(logout);
}