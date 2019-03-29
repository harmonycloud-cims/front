import { take, call, put, fork, takeLatest } from 'redux-saga/effects';
import axios from '../../services/axiosInstance';
import { setCookie, delCookie } from '../../services/utils';
/* user */
function* getEncounterType() {
  while (true) {
    let { clinicId } = yield take('GET_ENCOUNTERTYPE_LIST');
    let params = { clinicId };
    try {
      let { data } = yield call(axios.get, '/user/listEncounterType', {
        params: params
      });
      if (data.success) {
        let encounterType = data.data[0];
        yield put({
          type: 'UPDATE_ENCOUNTERTYPELIST',
          encounterTypeList: data.data
        });
        yield put({ type: 'UPDATE_ENCOUNTERTYPE', encounterType });
        yield put({
          type: 'GET_ROOM_LIST',
          clinicId,
          encounterTypeId: encounterType.encounterTypeId
        });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* changeEncounterType() {
  while (true) {
    let { encounterType, encounterTypeId, clinicId } = yield take(
      'CHANGE_ENCOUNTERTYPE'
    );
    yield put({ type: 'SELECT_CALENDAR', data: false });
    yield put({ type: 'UPDATE_ENCOUNTERTYPE', encounterType });
    yield put({ type: 'GET_ROOM_LIST', clinicId, encounterTypeId });
  }
}
//根据clinicId, encounterTypeId获取roomList
function* getRoom() {
  while (true) {
    let { clinicId, encounterTypeId } = yield take('GET_ROOM_LIST');
    let params = { clinicId, encounterTypeId };
    try {
      let { data } = yield call(axios.get, '/user/listRoom', {
        params: params
      });
      if (data.success) {
        yield put({ type: 'UPDATE_ROOM', roomList: data.data }); //发起一个action，类似于dispatch
        yield put({ type: 'SELECT_CALENDAR', data: true });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
//只根据clinicId获取roomList
function* getAllRoom() {
  while (true) {
    let { clinicId } = yield take('GET_ALL_ROOM_LIST');
    let params = { clinicId };
    try {
      let { data } = yield call(axios.get, '/user/getRoomList', {
        params: params
      });
      if (data.success) {
        yield put({ type: 'UPDATE_ALL_ROOM', allRoomList: data.data }); //发起一个action，类似于dispatch
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* getClinicList() {
  while (true) {
    yield take('GET_CLINICLIST');
    try {
      let { data } = yield call(axios.get, '/user/listClinic');
      if (data.success) {
        let clinic = data.data[0];
        yield put({ type: 'UPDATE_CLINICLIST', clinicList: data.data }); //发起一个action，类似于dispatch
        yield put({ type: 'UPDATE_CLINIC', clinic }); //发起一个action，类似于dispatch
        yield put({
          type: 'GET_ENCOUNTERTYPE_LIST',
          clinicId: clinic.clinicId
        });
        yield put({ type: 'GET_ALL_ROOM_LIST', clinicId: clinic.clinicId });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
//改变clinic
function* changeClinic() {
  while (true) {
    let { clinicId, clinic } = yield take('CHANGE_CLINIC');
    yield put({ type: 'SELECT_CALENDAR', data: false });
    yield put({ type: 'UPDATE_CLINIC', clinic }); //发起一个action，类似于dispatch
    yield put({ type: 'GET_ENCOUNTERTYPE_LIST', clinicId });
  }
}
//login改变clinic
function* loginChangeClinic() {
  while (true) {
    let { clinicId, clinic } = yield take('LOGIN_CHANGE_CLINIC');
    yield put({ type: 'UPDATE_CLINIC', clinic }); //发起一个action，类似于dispatch
    yield put({ type: 'GET_ENCOUNTERTYPE_LIST', clinicId });
    yield put({ type: 'GET_ALL_ROOM_LIST', clinicId });
  }
}

function* refreshToken() {
  while (true) {
    yield take('REFRESH_TOKEN');
    let oldToken = window.sessionStorage.getItem('token');
    let params = { oldToken: window.sessionStorage.getItem('token') };
    try {
      let { data } = yield call(axios.post, '/user/refreshToken', params, {
        transformRequest: [
          function() {
            let ret = 'oldToken=' + oldToken;
            return ret;
          }
        ]
      });
      if(data.refresh) {
        window.sessionStorage.setItem('token', data.data);
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* doLogin() {
  while (true) {
    const { params } = yield take('DO_LOGIN');
    try {
      let { data } = yield call(axios.post, '/user/login', params); //阻塞，请求后台数据
      if (data.success) {
        window.sessionStorage.setItem('token', data.data.token);
        window.sessionStorage.setItem('user', params.loginname);
        window.sessionStorage.setItem('clinic', params.clinicName);
        setCookie('clinic', params.clinicName, 24*60*60000);
        yield put({ type: 'UPDATE_LOGIN_USER_SUCCESS' }); //发起一个action，类似于dispatch
        yield put({ type: 'UPDATE_LOGIN_USER', data }); //发起一个action，类似于dispatch
      } else {
        yield put({ type: 'LOGIN_ERROR', error: data.errorMessage });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* updateMenu() {
  while (true) {
    let { activeMenu } = yield take('CHANGE_MENU');
    yield put({ type: 'UPDATE_MENU', activeMenu });
  }
}
function* logout() {
  while (true) {
    yield take('LOGOUT');
    delCookie('clinic');
    yield put({ type: 'CLEAR_INFORMATION' });
  }
}

/* patient */
function* fetchPatient(action) {
  try {
    yield put({ type: 'OPEN_SEARCH' });
    yield put({ type: 'PATIENTLIST', data: [] });
    let { data } = yield call(
      axios.get,
      '/patient/searchPatient',
      {params: action.params}
    ); //阻塞，请求后台数据
    if (data.success) {
      yield put({ type: 'PATIENTLIST', data: data.data });
      yield put({ type: 'CLOSE_SEARCH' });
    } else {
      yield put({ type: 'PATIENTLIST', data: [] });
      yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
    }
  } catch (error) {
    console.log(error);
  }
}
function* seachPatient() {
  yield takeLatest('SEARCH_PATIENT', fetchPatient);
}
function* getPatient() {
  while (true) {
    let { params } = yield take('GET_PATINET_BY_ID');
    try {
      let { data } = yield call(axios.get, '/patient/getPatient', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'PATIENT_BY_ID', patientById: data.data });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* updatePatient() {
  while (true) {
    let { params } = yield take('UPDATE_PATIENT');
    yield put({ type: 'PATIENT_LOADING', data: '' });
    try {
      let { data } = yield call(axios.post, '/patient/update', params); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'PATIENT_LOADING', data: 'Update successful' });
      } else {
        yield put({ type: 'PATIENT_LOADING_ERROR', data: data.errorMessage ? data.errorMessage : 'Update Error' });
      }
    } catch (error) {
      yield put({ type: 'PATIENT_LOADING_ERROR', data: 'Service error' });
    }
  }
}
function* savePatient() {
  while (true) {
    let { params } = yield take('REGISTER_PATIENT');
    yield put({ type: 'PATIENT_LOADING', data: '' });
    try {
      let { data } = yield call(axios.post, '/patient/register', params); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'PATIENT_LOADING', data: 'Registration is completed' });
      } else {
        yield put({ type: 'PATIENT_LOADING_ERROR', data: data.errorMessage ? data.errorMessage : 'Save Error' });
      }
    } catch (error) {
      yield put({ type: 'PATIENT_LOADING_ERROR', data: 'Service error' });
    }
  }
}
function* closeError() {
  while (true) {
    yield take('CLOSE_PATIENT_LOADING');
    yield put({ type: 'PATIENT_LOADING_ERROR_CLOSE' });
  }
}

/* appointment */
function* getClendar() {
  while (true) {
    let { params, dateList, numberWeek } = yield take('GET_CALENDAR');
    try {
      let { data } = yield call(axios.post, '/appointment/quotaList', params); //阻塞，请求后台数据
      if (data.success) {
        yield put({
          type: 'CALENDARLIST',
          data: data.data,
          dateList,
          numberWeek
        });
      } else {
      yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* getBookHistory() {
  while (true) {
    let { params } = yield take('GET_BOOK_HISTORY');
    try {
      let { data } = yield call(axios.get, '/appointment/appointmentHistory', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'BOOK_HISTORY', data: data.data ? data.data : [] });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* bookCompare() {
  while (true) {
    let { params } = yield take('BOOK_COMPARE');
    try {
      let { data } = yield call(axios.get, '/appointment/isduplicated', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'BOOK_COMPARE_RESULT', data: data.success });
      } else {
        yield put({
          type: 'BOOK_COMPARE_RESULT_ERROR',
          data: data.succes,
          error: data.errorMessage ? data.errorMessage : 'Service error'
        });
      }
    } catch (error) {
      yield put({
        type: 'BOOK_COMPARE_RESULT_ERROR',
        data: true,
        error: error
      });
    }
  }
}
function* bookCompareClose() {
  while (true) {
    yield take('BOOK_COMPARE_CLOSE');
    yield put({ type: 'BOOK_COMPARE_RESULT_CLOSE' });
  }
}
function* bookAppointment() {
  while (true) {
    let { params, patient } = yield take('BOOK_APPOINTMENT');
    yield put({type: 'BOOK_PRINT', params, patient});
    try {
      let {data} = yield call(axios.post, '/appointment/book', params); //阻塞，请求后台数据
      if(data.success) {
        yield put({type: 'OPEN_BOOK_PRINT' });
        yield put({type: 'CLOSE_BOOK_PRINT'});
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    } finally {
      yield put({ type: 'BOOK_COMPARE_RESULT_CLOSE' });
    }
  }
}

function* getAttendance() {
  while (true) {
    let { params } = yield take('GET_ATTENDANCELIST');
    try {
      let { data } = yield call(
        axios.post,
        '/appointment/appointmentList',
        params
      ); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'UPDATE_ATTENDANCELIST', attendanceList: data.data });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* attend() {
  while (true) {
    let { params, params1 } = yield take('ATTEND');
    yield put({type: 'OPEN_ATTENDING_DIALOG'});
    try {
      let { data } = yield call(axios.get, '/appointment/attend', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'GET_ATTENDANCELIST', params: params1 });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    } finally {
      yield put({ type: 'CLOSE_ATTENDING_DIALOG' });
    }
  }
}

/* consultation */
function* getMedicalRecordList() {
  while (true) {
    let { params } = yield take('GET_MEDICAL_RECORD');
    try {
      let { data } = yield call(axios.get, '/clinicalnote/listClinicNote', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({
          type: 'UPDATE_MEDICAL_RECORD',
          medicalRecordList: data.data
        });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* getTemplateList() {
  while (true) {
    let { params } = yield take('GET_TEMPLATE');
    try {
      let { data } = yield call(axios.get, '/clinicalnote/listTemplate', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'UPDATE_TEMPLATELIST', templateList: data.data });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* getChronicProblemList() {
  while (true) {
    let { params } = yield take('GET_CHRONICPROBLEM');
    try {
      let { data } = yield call(axios.get, '/diagnosis/chronicProblemList', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({
          type: 'UPDATE_CHRONICPROBLEMLIST',
          chronicProblemList: data.data
        });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* fectchDiagnogsisProblem(action) {
  try {
    yield put({ type: 'OPEN_SEARCH' });
    let { data } = yield call(axios.get, '/diagnosis/diagnosisProblem', {
      params: action.params
    }); //阻塞，请求后台数据
    if (data.success) {
      yield put({
        type: 'UPDATE_DIAGNOSIS_PROBLEM',
        diagnosisProblemList: data.data
      });
      yield put({ type: 'CLOSE_SEARCH' });
    } else {
      yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
    }
  } catch (error) {
    console.log(error);
  }
}
function* getDiagnosisProblemList() {
  yield takeLatest('SEARCH_DIAGNOSIS_PROBLEMS', fectchDiagnogsisProblem);
}
function* getEncounterId() {
  while (true) {
    let { params } = yield take('GET_ENCOUNTERID');
    try {
      let { data } = yield call(axios.get, '/encounter/getEncounter', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'UPDATE_ENCOUNTERID', encounter: data.data });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* getClinicNote() {
  while (true) {
    let { params } = yield take('GET_CLINIC_NOTE');
    try {
      let { data } = yield call(axios.get, '/clinicalnote/getClinicalNote', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'UPDATE_CLINIC_NOTE', clinicNote: data.data });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* saveConsultation() {
  while (true) {
    let { params } = yield take('SAVE_CONSULTATION');
    yield put({ type: 'OPEN_CONSULTATION_LOADING', data: true, saveName: 'note' });
    try {
      let { data } = yield call(axios.post, '/bff/insert', params); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'CONSULTATION_LOADING_SUCCESS' });
      } else {
        yield put({
          type: 'CONSULTATION_LOADING_ERROR',
          data: data.errorMessage ? data.errorMessage : 'Service error'
        });
      }
    } catch (error) {
      yield put({ type: 'CONSULTATION_LOADING_ERROR', data: 'Service error' });
    }
  }
}
function* updateConsultation() {
  while (true) {
    let { params } = yield take('UPDATE_CONSULTATION');
    yield put({ type: 'OPEN_CONSULTATION_LOADING', data: true, saveName: 'note' });
    try {
      let { data } = yield call(axios.post, '/bff/update', params); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'CONSULTATION_LOADING_SUCCESS' });
      } else {
        yield put({
          type: 'CONSULTATION_LOADING_ERROR',
          data: data.errorMessage ? data.errorMessage : 'Service error'
        });
      }
    } catch (error) {
      yield put({ type: 'CONSULTATION_LOADING_ERROR', data: 'Service error' });
    }
  }
}
function* getAttendingProblem() {
  while (true) {
    let { params } = yield take('GET_ATTENDING_PROBLEM');
    try {
      let { data } = yield call(axios.get, '/diagnosis/attendingproblemList', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({
          type: 'UPDATE_ATTENDING_PROBLEM',
          attendingProblemList: data.data
        });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}

// prescription
function* getDepartmentFavourite() {
  while (true) {
    let { params } = yield take('GET_DEPARTMENTAL_FAVOURITE');
    try {
      let { data } = yield call(axios.get, '/drug/depFavList', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({
          type: 'UPDATE_DEPARTMENTAL_FAVOURITE',
          departmentFavouriteList: data.data
        });
      } else {
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* getDrugHistory() {
  while (true) {
    let { params } = yield take('GET_DRUG_HISTORY');
    try {
      let { data } = yield call(axios.get, '/order/drugHistory', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({
          type: 'UPDATE_DRUG_HISTORY',
          drugHistoryList: data.data
        });
      } else {
        yield put({
          type: 'UPDATE_DRUG_HISTORY',
          drugHistoryList: []
        });
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}
function* getPrescription() {
  while (true) {
    let { params } = yield take('GET_PRESCRIPTION');
    try {
      let { data } = yield call(axios.get, '/order/getPrescription', {
        params: params
      }); //阻塞，请求后台数据
      if (data.success) {
        yield put({
          type: 'UPDATE_PRESCRIPTION',
          data: data.data
        });
      } else {
        yield put({
          type: 'UPDATE_PRESCRIPTION',
          data: {}
        });
        yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
      }
    } catch (error) {
      console.log(error);
    }
  }
}

function* saveOrder() {
  while (true) {
    let { params } = yield take('SAVE_ORDER');
    yield put({ type: 'OPEN_CONSULTATION_LOADING', data: true, saveName: 'prescription' });
    try {
      let { data } = yield call(axios.post, '/order/saveOrder', params); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'CONSULTATION_LOADING_SUCCESS' });
      } else {
        yield put({
          type: 'CONSULTATION_LOADING_ERROR',
          data: data.errorMessage
        });
      }
    } catch (error) {
      yield put({ type: 'CONSULTATION_LOADING_ERROR', data: 'Services error' });
    }
  }
}
function* updateOrder() {
  while (true) {
    let { params } = yield take('UPDATE_ORDER');
    yield put({ type: 'OPEN_CONSULTATION_LOADING', data: true, saveName: 'prescription' });
    try {
      let { data } = yield call(axios.post, '/order/updateOrder', params); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'CONSULTATION_LOADING_SUCCESS' });
      } else {
        yield put({
          type: 'CONSULTATION_LOADING_ERROR',
          data: data.errorMessage
        });
      }
    } catch (error) {
      yield put({ type: 'CONSULTATION_LOADING_ERROR', data: 'Services error' });
    }
  }
}
function* fectchDrugList(action) {
  try {
    yield put({ type: 'OPEN_SEARCH' });
    let { data } = yield call(axios.get, '/drug/drugList', {
      params: action.params
    }); //阻塞，请求后台数据
    if (data.success) {
      yield put({
        type: 'UPDATE_DRUG_LIST',
        searchDrugList: data.data
      });
      yield put({ type: 'CLOSE_SEARCH' });
    } else {
      yield put({type: 'OPEN_ERROR_MESSAGE', error: data.errorMessage ? data.errorMessage : 'Service error'});
    }
  } catch (error) {
    console.log(error);
  }
}
function* searchDrugList() {
  yield takeLatest('SEARCH_DRUG_LIST', fectchDrugList);
}
function* nextPatient() {
  while (true) {
    let { params } = yield take('NEXT_PATIENT');
    yield put({ type: 'OPEN_CONSULTATION_LOADING', data: true, saveName: 'nextPatient' });
    try {
      let { data } = yield call(axios.post, '/bff/nextPatient', params); //阻塞，请求后台数据
      if (data.success) {
        yield put({ type: 'CONSULTATION_LOADING_SUCCESS' });
      } else {
        yield put({
          type: 'CONSULTATION_LOADING_ERROR',
          data: data.errorMessage
        });
      }
    } catch (error) {
      yield put({ type: 'CONSULTATION_LOADING_ERROR', data: error });
    }
  }
}

export default function* rootSaga() {
  // yield [
  //   fork(getClinicList),
  //   fork(changeClinic),
  //   fork(loginChangeClinic),
  //   fork(getEncounterType),
  //   fork(changeEncounterType),
  //   fork(getRoom),
  //   fork(getAllRoom),
  //   fork(doLogin),
  //   fork(refreshToken),
  //   fork(updateMenu),
  //   fork(logout)
  // ];
  yield fork(getClinicList);
  yield fork(changeClinic);
  yield fork(loginChangeClinic);
  yield fork(getEncounterType);
  yield fork(changeEncounterType);
  yield fork(getRoom);
  yield fork(getAllRoom);

  yield fork(doLogin);
  yield fork(refreshToken);
  yield fork(updateMenu);
  yield fork(logout);

  yield fork(seachPatient);
  yield fork(getPatient);
  yield fork(updatePatient);
  yield fork(savePatient);
  yield fork(closeError);

  yield fork(getClendar);
  yield fork(getBookHistory);
  yield fork(bookCompare);
  yield fork(bookCompareClose);
  yield fork(bookAppointment);
  yield fork(getAttendance);
  yield fork(attend);

  yield fork(getMedicalRecordList);
  yield fork(getTemplateList);
  yield fork(getChronicProblemList);
  yield fork(getDiagnosisProblemList);
  yield fork(getEncounterId);
  yield fork(getClinicNote);
  yield fork(getAttendingProblem);
  yield fork(saveConsultation);
  yield fork(updateConsultation);

  yield fork(getDepartmentFavourite);
  yield fork(getDrugHistory);
  yield fork(searchDrugList);
  yield fork(saveOrder);
  yield fork(updateOrder);
  yield fork(getPrescription);
  yield fork(nextPatient);
}
