import {take, call, put} from 'redux-saga/effects';
import axios from 'axios';

export function* loginSaga(params) {
    console.log(params);
    while(true) {
        const params1 = yield take('DO_LOGIN');//等待 Store 上指定的 action UPDATE_LOGIN_USER
        console.log('sdfsfdsdf');
        try {
            console.log('sdfsfwwwwwwdsdf');
            let { data } = yield call(axios.post, '/user/login', params1); //阻塞，请求后台数据
            yield put({ type: 'UPDATE_LOGIN_USER', data }); //发起一个action，类似于dispatch
        } catch(error) {
            yield put({ type: 'UPDATE_LOGIN_USER_ERROR', error });
        }  
    }      
}
export function* getClinicList() {
    console.log(123);
    while(true) {
        console.log('sssssssssssssssssssssss',123);
        yield take('GET_CLINIC');//等待 Store 上指定的 action UPDATE_LOGIN_USER
        console.log('ssssssddddddddddddddddd',123);
        try {
            console.log('ssssssddddddddddddddddd',123);
            let { data } = yield call(axios.get, '/user/login'); //阻塞，请求后台数据
            yield put({ type: 'UPDATE_CLINICLIST', data }); //发起一个action，类似于dispatch
        } catch(error) {
            console.log(error);
        }  
    }
}