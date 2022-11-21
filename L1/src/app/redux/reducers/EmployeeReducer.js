import { DELETE_EMPLOYEE_SUCCESS, SAVE_EMPLOYEE_SUCCESS, SEARCH_EMPLOYEE_SUCCESS, UPDATE_EMPLOYEE_SUCCESS } from "../actions/actionTypes";

const initialState = {
    employeeList: [],
    response: {},
}

const EmployeeReducer = (state = initialState, action) => {

    switch (action.type) {
        case SEARCH_EMPLOYEE_SUCCESS:
            return { ...state, employeeList: action.payload, response: {} }
        case SAVE_EMPLOYEE_SUCCESS:
            return { ...state, response: action.payload }
        case UPDATE_EMPLOYEE_SUCCESS:
            return { ...state, response: action.payload }
        case DELETE_EMPLOYEE_SUCCESS:
            return { ...state, response: action.payload }
        default:
            return state;
    }
}

export default EmployeeReducer
