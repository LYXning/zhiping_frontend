import {Dispatch} from 'redux';
import {TaskActionTypes, TaskAction, Task} from '../types/task';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// API基础URL
const API_URL = 'https://api.zhiping.com/api';

/**
 * 获取任务列表
 */
export const fetchTasks = () => async (dispatch: Dispatch<TaskAction>) => {
  try {
    dispatch({
      type: TaskActionTypes.FETCH_TASKS_REQUEST,
    });

    // 获取token
    const token = await AsyncStorage.getItem('token');

    // 发送请求
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: TaskActionTypes.FETCH_TASKS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: TaskActionTypes.FETCH_TASKS_FAILURE,
      payload: error.response?.data?.message || '获取任务列表失败',
    });

    Toast.show({
      type: 'error',
      text1: '获取任务失败',
      text2: error.response?.data?.message || '请稍后再试',
    });
  }
};

/**
 * 获取单个任务
 * @param taskId 任务ID
 */
export const fetchTask =
  (taskId: number) => async (dispatch: Dispatch<TaskAction>) => {
    try {
      dispatch({
        type: TaskActionTypes.FETCH_TASK_REQUEST,
      });

      // 获取token
      const token = await AsyncStorage.getItem('token');

      // 发送请求
      const response = await axios.get(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: TaskActionTypes.FETCH_TASK_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: TaskActionTypes.FETCH_TASK_FAILURE,
        payload: error.response?.data?.message || '获取任务详情失败',
      });

      Toast.show({
        type: 'error',
        text1: '获取任务详情失败',
        text2: error.response?.data?.message || '请稍后再试',
      });
    }
  };

/**
 * 创建任务
 * @param task 任务数据
 */
export const createTask =
  (task: Task) => async (dispatch: Dispatch<TaskAction>) => {
    try {
      dispatch({
        type: TaskActionTypes.CREATE_TASK_REQUEST,
      });

      // 获取token
      const token = await AsyncStorage.getItem('token');

      // 发送请求
      const response = await axios.post(`${API_URL}/tasks`, task, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      dispatch({
        type: TaskActionTypes.CREATE_TASK_SUCCESS,
        payload: response.data,
      });

      Toast.show({
        type: 'success',
        text1: '创建任务成功',
        text2: '任务已成功创建',
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: TaskActionTypes.CREATE_TASK_FAILURE,
        payload: error.response?.data?.message || '创建任务失败',
      });

      Toast.show({
        type: 'error',
        text1: '创建任务失败',
        text2: error.response?.data?.message || '请稍后再试',
      });

      throw error;
    }
  };

/**
 * 更新任务
 * @param taskId 任务ID
 * @param task 任务数据
 */
export const updateTask =
  (taskId: number, task: Partial<Task>) =>
  async (dispatch: Dispatch<TaskAction>) => {
    try {
      dispatch({
        type: TaskActionTypes.UPDATE_TASK_REQUEST,
      });

      // 获取token
      const token = await AsyncStorage.getItem('token');

      // 发送请求
      const response = await axios.put(`${API_URL}/tasks/${taskId}`, task, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      dispatch({
        type: TaskActionTypes.UPDATE_TASK_SUCCESS,
        payload: response.data,
      });

      Toast.show({
        type: 'success',
        text1: '更新任务成功',
        text2: '任务已成功更新',
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: TaskActionTypes.UPDATE_TASK_FAILURE,
        payload: error.response?.data?.message || '更新任务失败',
      });

      Toast.show({
        type: 'error',
        text1: '更新任务失败',
        text2: error.response?.data?.message || '请稍后再试',
      });

      throw error;
    }
  };

/**
 * 删除任务
 * @param taskId 任务ID
 */
export const deleteTask =
  (taskId: number) => async (dispatch: Dispatch<TaskAction>) => {
    try {
      dispatch({
        type: TaskActionTypes.DELETE_TASK_REQUEST,
      });

      // 获取token
      const token = await AsyncStorage.getItem('token');

      // 发送请求
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: TaskActionTypes.DELETE_TASK_SUCCESS,
        payload: taskId,
      });

      Toast.show({
        type: 'success',
        text1: '删除任务成功',
        text2: '任务已成功删除',
      });
    } catch (error) {
      dispatch({
        type: TaskActionTypes.DELETE_TASK_FAILURE,
        payload: error.response?.data?.message || '删除任务失败',
      });

      Toast.show({
        type: 'error',
        text1: '删除任务失败',
        text2: error.response?.data?.message || '请稍后再试',
      });
    }
  };

/**
 * 保存任务草稿
 * @param task 任务数据
 */
export const saveDraft =
  (task: Task) => async (dispatch: Dispatch<TaskAction>) => {
    try {
      dispatch({
        type: TaskActionTypes.SAVE_DRAFT_REQUEST,
      });

      // 获取token
      const token = await AsyncStorage.getItem('token');

      // 设置任务状态为草稿
      const draftTask = {
        ...task,
        status: 0, // 草稿状态
      };

      // 发送请求
      const response = await axios.post(`${API_URL}/tasks/draft`, draftTask, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      dispatch({
        type: TaskActionTypes.SAVE_DRAFT_SUCCESS,
        payload: response.data,
      });

      Toast.show({
        type: 'success',
        text1: '保存草稿成功',
        text2: '任务草稿已保存',
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: TaskActionTypes.SAVE_DRAFT_FAILURE,
        payload: error.response?.data?.message || '保存草稿失败',
      });

      Toast.show({
        type: 'error',
        text1: '保存草稿失败',
        text2: error.response?.data?.message || '请稍后再试',
      });

      throw error;
    }
  };

/**
 * 发布任务
 * @param task 任务数据
 */
export const publishTask =
  (task: Task) => async (dispatch: Dispatch<TaskAction>) => {
    try {
      dispatch({
        type: TaskActionTypes.PUBLISH_TASK_REQUEST,
      });

      // 获取token
      const token = await AsyncStorage.getItem('token');

      // 设置任务状态为已发布
      const publishedTask = {
        ...task,
        status: 1, // 已发布状态
      };

      // 发送请求
      const response = await axios.post(
        `${API_URL}/tasks/publish`,
        publishedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      dispatch({
        type: TaskActionTypes.PUBLISH_TASK_SUCCESS,
        payload: response.data,
      });

      Toast.show({
        type: 'success',
        text1: '发布任务成功',
        text2: '任务已成功发布',
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: TaskActionTypes.PUBLISH_TASK_FAILURE,
        payload: error.response?.data?.message || '发布任务失败',
      });

      Toast.show({
        type: 'error',
        text1: '发布任务失败',
        text2: error.response?.data?.message || '请稍后再试',
      });

      throw error;
    }
  };

/**
 * 清除任务错误
 */
export const clearTaskErrors = () => ({
  type: TaskActionTypes.CLEAR_TASK_ERRORS,
});

/**
 * 重置任务状态
 */
export const resetTaskState = () => ({
  type: TaskActionTypes.RESET_TASK_STATE,
});

/**
 * 上传图片
 * @param taskId 任务ID
 * @param files 图片文件数组
 */
export const uploadImage =
  (taskId: number, files: any) => async (dispatch: Dispatch<TaskAction>) => {
    try {
      dispatch({
        type: TaskActionTypes.UPLOAD_IMAGE_REQUEST,
      });

      // 获取token
      const token = await AsyncStorage.getItem('token');

      // 创建FormData对象
      const formData = new FormData();

      // 如果files是数组，添加多个文件
      if (Array.isArray(files)) {
        files.forEach((file, index) => {
          formData.append('files', file);
        });
      } else {
        // 单个文件
        formData.append('files', files);
      }

      // 发送请求到试卷识别接口
      const response = await axios.post(
        `${API_URL}/tasks//recognize`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      dispatch({
        type: TaskActionTypes.UPLOAD_IMAGE_SUCCESS,
        payload: response.data,
      });

      Toast.show({
        type: 'success',
        text1: '图片上传成功',
        text2: '试卷已成功识别',
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: TaskActionTypes.UPLOAD_IMAGE_FAILURE,
        payload: error.response?.data?.message || '上传图片失败',
      });

      Toast.show({
        type: 'error',
        text1: '上传图片失败',
        text2: error.response?.data?.message || '请稍后再试',
      });

      throw error;
    }
  };
