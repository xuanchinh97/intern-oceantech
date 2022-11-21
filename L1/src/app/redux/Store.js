import HttpService from "app/services/HttpService"
import axiosMiddleware from "redux-axios-middleware"
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import RootReducer from "./reducers/RootReducer"
import rootSaga from "./sagas/rootSaga"
import thunk from "redux-thunk"

const sagaMiddleware = createSagaMiddleware()

const middleWares = [
  thunk,
  sagaMiddleware,
  axiosMiddleware(HttpService.getAxiosClient())
]
export const Store = createStore(
  RootReducer,
  applyMiddleware(...middleWares),
  // compose(
  //   applyMiddleware(...middleWares),
  //   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )
)

sagaMiddleware.run(rootSaga)
