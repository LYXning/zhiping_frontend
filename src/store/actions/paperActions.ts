import {Dispatch} from 'redux';
import axios from 'axios';
import {
  SUBMIT_PAPER_REQUEST,
  SUBMIT_PAPER_SUCCESS,
  SUBMIT_PAPER_FAIL,
  CLEAR_PAPER_ERRORS,
} from '../constants/paperConstants';
import {Platform} from 'react-native';
import {getSubjectIdByName} from '../../utils/subjectUtils';

const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api/tasks' // Android 模拟器
    : 'http://localhost:8080/api/tasks'; // iOS或Web环境

// 提交试卷
export const submitPaper =
  (submitData, uploadedImages) => async (dispatch: Dispatch) => {
    try {
      dispatch({type: SUBMIT_PAPER_REQUEST});

      const {taskId, paperTitle, subject} = submitData;

      // 创建FormData对象
      const formData = new FormData();

      // 创建任务数据对象
      const taskDataObj = {
        name: paperTitle,
        subjectId: getSubjectIdByName(subject),
        gradeName: '六年级',
        additionalParams: {},
      };

      // 在React Native中，我们需要直接添加JSON字符串
      formData.append('taskData', JSON.stringify(taskDataObj));

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

      console.log('提交请求到:', `${API_URL}/scan/submit`);
      console.log('提交数据:', {
        taskData: JSON.stringify(taskDataObj),
        imageCount: uploadedImages.length,
      });

      // 使用axios发送请求，使用特殊配置
      const {data} = await axios({
        method: 'post',
        url: `${API_URL}/scan/submit`,
        data: formData,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data, headers) => {
          // 阻止axios自动转换FormData
          return data;
        },
      });

      dispatch({
        type: SUBMIT_PAPER_SUCCESS,
        payload: data,
      });

      console.log('提交成功:', data);

      return Promise.resolve(data);
    } catch (error) {
      console.error('提交失败:', error);

      dispatch({
        type: SUBMIT_PAPER_FAIL,
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
    type: CLEAR_PAPER_ERRORS,
  });
};
