
import axios from 'axios';
import { toast } from 'react-toastify';
import { call, put, takeEvery } from 'redux-saga/effects';
import ConstantList from "../../appConfig";
import { DELETE_EMPLOYEE, DELETE_EMPLOYEE_SUCCESS, SAVE_EMPLOYEE, SAVE_EMPLOYEE_SUCCESS, SEARCH_EMPLOYEE, SEARCH_EMPLOYEE_SUCCESS, UPDATE_EMPLOYEE, UPDATE_EMPLOYEE_SUCCESS } from '../actions/actionTypes';

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3
})

const API_PATH = ConstantList.API_ENPOINT + "/employees/";;

const axiosSearchEmployee = (searchObject = {}) => {
  return axios.post(API_PATH + "search", searchObject)
    .then(({ data }) => data.data)
};

const axiosSaveEmployee = (item) => {
  return axios.post(API_PATH, item)
    .then(({ data }) => {
      return data
    })
};

const axiosUpdateEmployee = (item) => {
  return axios.put(API_PATH + item.id, item)
    .then(({ data }) => {
      return data
    })
};

const axiosDeleteEmployee = (id) => {
  return axios.delete(API_PATH + id)
    .then(({ data }) => {
      return data
    })
};

function* searchEmployee(action) {
  try {
    const itemList = yield call(axiosSearchEmployee, action.payload)
    if (itemList) {
      yield put({ type: SEARCH_EMPLOYEE_SUCCESS, payload: itemList })
    }
  } catch (error) {
    console.log(error)
  }
}

function* saveEmployee(action) {
  try {
    const data = yield call(axiosSaveEmployee, action.payload)
    yield put({ type: SAVE_EMPLOYEE_SUCCESS, payload: data })
    if (data.code === 200) {
      yield searchEmployee({})
      toast.success("Thêm nhân viên thành công")
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    console.log(error)
  }
}

function* updateEmployee(action) {
  try {
    const data = yield call(axiosUpdateEmployee, action.payload)
    yield put({ type: UPDATE_EMPLOYEE_SUCCESS, payload: data })
    if (data.code === 200) {
      yield searchEmployee({})
      toast.success("Cập nhật nhân viên thành công")
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error("Nhân viên chưa được cập nhật")
    console.log(error)
  }
}

function* deleteEmployee(action) {
  try {
    const data = yield call(axiosDeleteEmployee, action.payload)
    yield put({ type: DELETE_EMPLOYEE_SUCCESS, payload: data })
    if (data.code === 200) {
      yield searchEmployee({})
      toast.success("Xóa nhân viên thành công")
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    toast.error("Nhân viên chưa được xóa")
    console.log(error)
  }
}

export function* employeeSaga() {
  yield takeEvery(SEARCH_EMPLOYEE, searchEmployee)
  yield takeEvery(SAVE_EMPLOYEE, saveEmployee)
  yield takeEvery(UPDATE_EMPLOYEE, updateEmployee)
  yield takeEvery(DELETE_EMPLOYEE, deleteEmployee)
}



