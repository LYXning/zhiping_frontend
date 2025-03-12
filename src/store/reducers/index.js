/**
 * 根reducer文件
 * 合并所有reducers
 */

import { combineReducers } from 'redux';
import authReducer from './authReducer';

/**
 * 根reducer
 * 合并所有子reducer
 */
const rootReducer = combineReducers({
  auth: authReducer,
  // 这里可以添加其他reducer
});

export default rootReducer;
