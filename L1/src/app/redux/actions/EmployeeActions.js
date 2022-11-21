// search, action

import { DELETE_EMPLOYEE, SAVE_EMPLOYEE, SEARCH_EMPLOYEE, UPDATE_EMPLOYEE } from "./actionTypes"

export const searchEmployeeAction = (searchObject = {}) => {
    return {
        type: SEARCH_EMPLOYEE,
        payload: searchObject
    }
}

export const saveEmployeeAction = (item) => {
    return {
        type: SAVE_EMPLOYEE,
        payload: item
    }
}

export const updateEmployeeAction = (item) => {
    return {
        type: UPDATE_EMPLOYEE,
        payload: item
    }
}

export const deleteEmployeeAction = (id) => {
    return {
        type: DELETE_EMPLOYEE,
        payload: id
    }
}
