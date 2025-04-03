import {Dispatch} from 'redux';
import {PaperActionTypes, PaperAction, Paper} from '../types/paper';
import {Platform} from 'react-native';
import {getToken} from './authActions';
import {getSubjectIdByName} from '../../utils/subjectUtils';
import axios from 'axios';

// 统一 API_URL 定义
const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api' // Android 模拟器
    : 'http://localhost:8080/api'; // iOS或Web环境

// 获取任务列表
export const getTasks = () => async (dispatch: Dispatch<PaperAction>) => {
  try {
    dispatch({type: PaperActionTypes.GET_TASKS_REQUEST});

    console.log('获取任务列表请求到:', `${API_URL}/tasks/getTasks`);

    // 使用fetch API获取任务列表
    const response = await fetch(`${API_URL}/tasks/getTasks`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
      },
    });

    const data = await response.json();

    dispatch({
      type: PaperActionTypes.GET_TASKS_SUCCESS,
      payload: data.data,
    });

    console.log('获取任务列表成功:', data);

    return Promise.resolve(data);
  } catch (error) {
    console.error('获取任务列表失败:', error);

    dispatch({
      type: PaperActionTypes.GET_TASKS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    return Promise.reject(error);
  }
};

// 清除错误
export const clearPaperErrors = () => async (dispatch: Dispatch) => {
  dispatch({
    type: PaperActionTypes.CLEAR_PAPER_ERRORS,
  });
};

// 创建试卷任务（不包含图片上传）
export const createPaperTask = submitData => async (dispatch: Dispatch) => {
  try {
    dispatch({type: PaperActionTypes.CREATE_PAPER_REQUEST});

    const {paperTitle, subject} = submitData;

    // 创建任务数据对象
    const taskData = {
      name: paperTitle,
      subjectId: getSubjectIdByName(subject),
      gradeName: '六年级',
      additionalParams: {},
    };

    console.log('创建任务请求到:', `${API_URL}/paper/createTask`);

    const response = await axios.post(`${API_URL}/paper/createTask`, taskData, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
      },
    });

    const data = await response.data;
    console.log('创建任务:', data);

    if (data.code !== 1000) {
      return Promise.reject(data.message);
    }

    dispatch({
      type: PaperActionTypes.CREATE_PAPER_SUCCESS,
      payload: data.data,
    });

    return Promise.resolve(data);
  } catch (error) {
    console.error('创建任务失败:', error);

    dispatch({
      type: PaperActionTypes.CREATE_PAPER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    return Promise.reject(error);
  }
};

// 分析试卷方法，添加paperId参数
export const analyzePaper =
  (uploadedImages, paperId) => async (dispatch: Dispatch) => {
    try {
      dispatch({type: PaperActionTypes.SUBMIT_PAPER_REQUEST});

      // 创建FormData对象
      const formData = new FormData();

      // 添加paperId - 确保从createTask返回的数据中获取taskId
      formData.append('taskId', 3);

      // 添加图片文件，键名为"images"
      uploadedImages.forEach((image, index) => {
        // 创建文件对象
        const imageFile = {
          uri:
            Platform.OS === 'android'
              ? image.uri
              : image.uri.replace('file://', ''),
          type: image.type || 'image/jpeg',
          name: image.fileName || `image_${index}.jpg`,
        };

        // 添加到FormData，使用"images"作为键名
        formData.append('images', imageFile);
      });

      console.log('提交图片请求到:', `${API_URL}/paper/analyze`);
      console.log('提交数据:', {
        taskId: paperId,
        imageCount: uploadedImages.length,
      });

      // 使用正确的接口路径
      const response = await fetch(`${API_URL}/paper/analyze`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: 'Bearer ' + (await getToken()),
        },
      });

      const data = response;

      dispatch({
        type: PaperActionTypes.SUBMIT_PAPER_SUCCESS,
        payload: data,
      });

      console.log('提交图片成功:', data);

      return Promise.resolve(data);
    } catch (error) {
      console.error('提交图片失败:', error);

      dispatch({
        type: PaperActionTypes.SUBMIT_PAPER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      return Promise.reject(error);
    }
  };

// 获取试卷信息
export const getPaperInfo = paperId => async (dispatch: Dispatch) => {
  try {
    dispatch({type: PaperActionTypes.GET_PAPER_STATUS_REQUEST});

    console.log(
      '获取试卷信息请求到:',
      `${API_URL}/paper/getPaperInfo?taskId=${paperId}`,
    );

    // 使用fetch API获取状态
    const response = await fetch(`${API_URL}/paper/getPaperInfo?taskId=3`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
      },
    });

    const data = await response.json();

    dispatch({
      type: PaperActionTypes.GET_PAPER_STATUS_SUCCESS,
      payload: data,
    });

    console.log('获取试卷信息成功:', data);

    return Promise.resolve(data);
  } catch (error) {
    console.error('获取试卷信息失败:', error);

    dispatch({
      type: PaperActionTypes.GET_PAPER_STATUS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    return Promise.reject(error);
  }
};

// 批量修改用户答案
export const updateUserAnswers =
  (taskId, answers) => async (dispatch: Dispatch) => {
    try {
      dispatch({type: PaperActionTypes.UPDATE_ANSWERS_REQUEST});

      console.log('批量修改用户答案请求到:', `${API_URL}/paper/updateAnswers`);
      console.log('提交数据:', {taskId, answers});

      const response = await fetch(`${API_URL}/paper/updateAnswers` + taskId, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + (await getToken()),
        },
        body: JSON.stringify({
          answers,
        }),
      });

      const data = await response.json();

      dispatch({
        type: PaperActionTypes.UPDATE_ANSWERS_SUCCESS,
        payload: data,
      });

      console.log('批量修改用户答案成功:', data);

      return Promise.resolve(data);
    } catch (error) {
      console.error('批量修改用户答案失败:', error);

      dispatch({
        type: PaperActionTypes.UPDATE_ANSWERS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      return Promise.reject(error);
    }
  };
