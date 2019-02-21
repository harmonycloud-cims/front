import {take, call, put, fork} from 'redux-saga/effects';
import axios from 'axios';

function* doLogin() {
    while(true) {
        const {params} = yield take('DO_LOGIN');
        console.log(params);
        try {
            let { data } = yield call(axios.post, '/user/login', params); //阻塞，请求后台数据
            if (data.success) {
                yield put({type: 'UPDATE_LOGIN_USER', data: data.data}); //发起一个action，类似于dispatch
            } else {
                console.log(data.errorMessage)
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

export default function* rootSaga() {
  yield fork(getClinicList);
  yield fork(doLogin);
}