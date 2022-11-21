import { all } from 'redux-saga/effects';
import { employeeSaga, } from './employeeSaga'

export default function* rootSaga() {
    yield all([ 
        employeeSaga(),
    ]);
}