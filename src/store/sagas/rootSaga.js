import { fork } from 'redux-saga/effects';
import {getClinicList} from './saga';

export default function* rootSaga() {
  yield [
    fork(getClinicList)
  ];
}