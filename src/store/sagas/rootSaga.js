import {take, call, put, fork} from 'redux-saga/effects';
import axios from '../../services/axiosInstance';

function* getEncounterType(){
    while(true) {
        let { clinicId } = yield take( 'GET_ENCOUNTERTYPE_LIST');
        let params = { clinicId };
        try {
            let {data} = yield call(axios.get, '/user/listEncounterType', {params: params});
            if (data.success) {
                let encounterType = data.data[0];
                yield put({type: 'UPDATE_ENCOUNTERTYPELIST', encounterTypeList: data.data});
                yield put({type: 'UPDATE_ENCOUNTERTYPE', encounterType});
                yield put({type: 'GET_ROOM_LIST', clinicId, encounterTypeId:encounterType.encounterTypeId})
            } else {
                console.log(data.errorMessage);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
function* changeEncounterType() {
    while(true) {
        let { encounterType, encounterTypeId, clinicId } = yield take( 'CHANGE_ENCOUNTERTYPE');
        yield put ({type: 'SELECT_CALENDAR', data: false});
        yield put({type: 'UPDATE_ENCOUNTERTYPE', encounterType});
        yield put({type: 'GET_ROOM_LIST', clinicId, encounterTypeId});
    }
}
//根据clinicId, encounterTypeId获取roomList
function* getRoom(){
    while(true) {
        let { clinicId, encounterTypeId } = yield take( 'GET_ROOM_LIST');
        let params = { clinicId, encounterTypeId };
        try {
            let {data} = yield call(axios.get, '/user/listRoom', {params: params});
            if (data.success) {
                yield put({type: 'UPDATE_ROOM', roomList: data.data}); //发起一个action，类似于dispatch
                yield put ({type: 'SELECT_CALENDAR', data: true});
            } else {
                console.log(data.errorMessage);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
//只根据clinicId获取roomList
function* getAllRoom(){
    while(true) {
        let { clinicId } = yield take( 'GET_ALL_ROOM_LIST');
        let params = { clinicId };
        try {
            let {data} = yield call(axios.get, '/user/getRoomList', {params: params});
            if (data.success) {
                yield put({type: 'UPDATE_ALL_ROOM', allRoomList: data.data}); //发起一个action，类似于dispatch
            } else {
                console.log(data.errorMessage);
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
            let { data } = yield call(axios.get, '/user/listClinic');
            if (data.success) {
                let clinic = data.data[0];
                yield put({ type: 'UPDATE_CLINICLIST', clinicList: data.data}); //发起一个action，类似于dispatch
                yield put({ type: 'UPDATE_CLINIC', clinic }); //发起一个action，类似于dispatch
                yield put({ type: 'GET_ENCOUNTERTYPE_LIST', clinicId: clinic.clinicId});
                yield put({ type: 'GET_ALL_ROOM_LIST', clinicId: clinic.clinicId});
            } else {
                console.log(data.errorMessage);
            }
        } catch(error) {
            console.log(error);
        }
    }
}
//改变clinic
function* changeClinic() {
    while(true) {
        let { clinicId, clinic } = yield take( 'CHANGE_CLINIC');
        yield put ({type: 'SELECT_CALENDAR', data: false});
        yield put({ type: 'UPDATE_CLINIC', clinic }); //发起一个action，类似于dispatch
        yield put({ type: 'GET_ENCOUNTERTYPE_LIST', clinicId});
    }
}
//login改变clinic
function* loginChangeClinic() {
    while(true) {
        let { clinicId, clinic } = yield take( 'LOGIN_CHANGE_CLINIC');
        yield put({ type: 'UPDATE_CLINIC', clinic }); //发起一个action，类似于dispatch
        yield put({ type: 'GET_ENCOUNTERTYPE_LIST', clinicId});
        yield put({ type: 'GET_ALL_ROOM_LIST', clinicId});
    }
}
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
            console.log(222,error);
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
        yield take( 'LOGOUT');
        yield put({ type: 'CLEAR_INFORMATION' });
    }
}

function* seachPatient() {
    while(true) {
        let { params } = yield take( 'SEARCH_PATIENT');
        try {
            let { data } = yield call(axios.post, '/patient/searchPatient', params); //阻塞，请求后台数据
            if (data.success) {
                yield put({type: 'PATIENTLIST', data: data.data});
            } else {
                yield put({ type: 'PATIENTLIST', data: [] });
            }
        } catch (error) {
            console.log(error);
        }
    }
}
function* updatePatient() {
    while(true) {
        let { params } = yield take( 'UPDATE_PATIENT');
        yield put({type: 'PATIENT_LOADING', data: true});
        try {
            let { data } = yield call(axios.post, '/patient/update', params); //阻塞，请求后台数据
            if (data.success) {
                yield put({type: 'PATIENT_LOADING', data: false});
            } else {
                yield put({ type: 'PATIENT_LOADING_ERROR', data: data.errorMessage});
            }
        } catch (error) {
            yield put({ type: 'PATIENT_LOADING_ERROR', data: error});
        }
    }
}
function* savePatient() {
    while(true) {
        let { params } = yield take( 'REGISTER_PATIENT');
        yield put({type: 'PATIENT_LOADING', data: true});
        try {
            let { data } = yield call(axios.post, '/patient/register', params); //阻塞，请求后台数据
            if (data.success) {
                yield put({type: 'PATIENT_LOADING', data: false});
            } else {
                yield put({ type: 'PATIENT_LOADING_ERROR', data: data.errorMessage});
            }
        } catch (error) {
            yield put({ type: 'PATIENT_LOADING_ERROR', data: error});
        }
    }
}
function* closeError() {
    while(true) {
        yield take( 'CLOSE_PATIENT_LOADING');
        yield put({type: 'PATIENT_LOADING_ERROR_CLOSE'});
    }
}

function* getClendar() {
    while(true) {
        let { params, dateList, numberWeek } = yield take( 'GET_CALENDAR');
        try {
            let { data } = yield call(axios.post, '/appointment/quotaList', params); //阻塞，请求后台数据
            if (data.success) {
                yield put({type: 'CALENDARLIST', data: data.data, dateList, numberWeek});
            } else {
                console.log(data.errorMessage);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
function* getBookHistory() {
    while(true) {
        let { params } = yield take( 'GET_BOOK_HISTORY');
        try {
            let { data } = yield call(axios.get, '/appointment/appointmentHistory', {params: params}); //阻塞，请求后台数据
            if (data.success) {
                yield put({type: 'BOOK_HISTORY', data: data.data});
            } else {
                console.log(data.errorMessage);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
function* bookCompare() {
    while(true) {
        let { params } = yield take( 'BOOK_COMPARE');
        try {
            let { data } = yield call(axios.get, '/appointment/isduplicated', {params: params}); //阻塞，请求后台数据
            yield put({type: 'BOOK_COMPARE_RESULT', data: data.success});
        } catch (error) {
            console.log(error);
        }
    }
}
function* bookCompareClose() {
    while(true) {
        yield take( 'BOOK_COMPARE_CLOSE');
        yield put({type: 'BOOK_COMPARE_RESULT_CLOSE'});
    }
}
function* bookAppointment() {
    while(true) {
        let { params } = yield take( 'BOOK_APPOINTMENT');
        try {
            let { data } = yield call(axios.post, '/appointment/book', params); //阻塞，请求后台数据
            yield put({type: 'BOOK_COMPARE_RESULT_CLOSE'});
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
}


export default function* rootSaga() {
  yield fork(getClinicList);
  yield fork(changeClinic);
  yield fork(loginChangeClinic);
  yield fork(getEncounterType);
  yield fork(changeEncounterType);
  yield fork(getRoom);
  yield fork(getAllRoom);
  yield fork(doLogin);
  yield fork(updateMenu);
  yield fork(logout);

  yield fork(seachPatient);
  yield fork(updatePatient);
  yield fork(savePatient);
  yield fork(closeError);

  yield fork(getClendar);
  yield fork(getBookHistory);
  yield fork(bookCompare);
  yield fork(bookCompareClose);
  yield fork(bookAppointment);
}