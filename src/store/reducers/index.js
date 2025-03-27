/**
 * 根reducer文件
 * 合并所有reducers
 */

import { combineReducers } from 'redux';
import authReducer from './authReducer';
import taskReducer from './taskReducer';
/**
 * 根reducer
 * 合并所有子reducer
 */
const rootReducer = combineReducers({
  auth: authReducer,
  task: taskReducer,
});

export default rootReducer;
