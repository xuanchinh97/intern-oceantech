import axios from "axios";
import ConstantList from "../../appConfig";

const API_PATH = ConstantList.API_ENPOINT + "/employees/";


export const searchEmployee = (searchObject = {}) => {
  return axios.post(API_PATH + "search", searchObject);
};

export const deleteEmployee = id => {
  return axios.delete(API_PATH + id);
};

export const saveEmployee = item => {
  return axios.post(API_PATH, item);
};

export const updateEmployee = item => {
  return axios.put(API_PATH + item.id, item);
};


//api xã, huyện, tỉnh

export const getCommune = (searchObject = {}) => {
  return axios.post(ConstantList.API_ENPOINT + "/communes/search", searchObject);
};

export const getProvince = (searchObject = {}) => {
  return axios.post(ConstantList.API_ENPOINT + "/provinces/search", searchObject);
};

export const getDistrict = (searchObject = {}) => {
  return axios.post(ConstantList.API_ENPOINT + "/districts/search", searchObject);
};

