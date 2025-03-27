/**
 * Redux store配置文件
 * 用于创建和配置Redux store
 */

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import { AuthState } from './types/auth';

// 创建store实例，使用Redux Toolkit的configureStore
const store = configureStore({
  reducer: rootReducer,
  // 配置中间件，确保默认中间件正确加载
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略某些非可序列化的值，如果需要的话
        ignoredActions: ['LOGIN_SUCCESS', 'REGISTER_SUCCESS'],
      },
      immutableCheck: true, // 启用不可变检查
    }),
  devTools: process.env.NODE_ENV !== 'production', // 仅在非生产环境启用开发工具
});

// 导出RootState和AppDispatch类型
import { TaskState } from './types/task';
export type RootState = {
  auth: AuthState;
  task: TaskState;
}
export type AppDispatch = typeof store.dispatch;

// 导出store实例
export default store;
