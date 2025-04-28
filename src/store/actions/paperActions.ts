import {Dispatch} from 'redux';
import {PaperActionTypes, PaperAction, Paper} from '../types/paper';
import {getToken} from './authActions';
import {getSubjectIdByName} from '../../utils/subjectUtils';
import axios from 'axios';
import {
  getApiUrl,
  API_PATHS,
  getTasksApiUrl,
  getPaperApiUrl,
} from '../../config/apiConfig';
import {Platform} from 'react-native';

// 获取任务列表
export const getTasks = () => async (dispatch: Dispatch<PaperAction>) => {
  try {
    dispatch({type: PaperActionTypes.GET_TASKS_REQUEST});

    console.log(
      '获取任务列表请求到:',
      getTasksApiUrl(API_PATHS.tasks.getTasks),
    );

    // 使用fetch API获取任务列表
    const response = await fetch(getTasksApiUrl(API_PATHS.tasks.getTasks), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + (await getToken()),
      },
    });

    const data = await response.json();

    // 检查响应状态码
    if (data.code !== 1000) {
      throw new Error(data.message || '获取任务列表失败');
    }

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
      payload: error.message || '获取任务列表失败',
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

    console.log('创建任务请求到:', getPaperApiUrl(API_PATHS.paper.createTask));

    const response = await axios.post(
      getPaperApiUrl(API_PATHS.paper.createTask),
      taskData,
      {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + (await getToken()),
        },
      },
    );

    const data = response.data;
    console.log('创建任务:', data);

    if (data.code !== 1000) {
      throw new Error(data.message || '创建任务失败');
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
      payload: error.message || '创建任务失败',
    });

    return Promise.reject(error);
  }
};

// 分析试卷方法，添加paperId参数
export const analyzePaper =
  (uploadedImages, paperId) => async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: PaperActionTypes.SUBMIT_PAPER_REQUEST,
        payload: {loading: true, sussce: false},
      });

      // 创建FormData对象
      const formData = new FormData();

      // 添加图片文件，键名为"images"
      console.log('图片:', uploadedImages);
      uploadedImages.forEach((image, index) => {
        // 创建文件对象
        const imageFile = {
          uri:
            Platform.OS === 'android'
              ? image.uri
              : image.uri.replace('file://', ''),
          type: image.type || 'image/jpeg',
          name: `image_${index}.jpg`,
        };

        // 添加到FormData，使用"images"作为键名
        formData.append('images', imageFile);
      });

      console.log('提交图片请求到:', getPaperApiUrl(API_PATHS.paper.analyze));

      // 使用正确的接口路径
      const response = await fetch(
        getPaperApiUrl(API_PATHS.paper.analyze + `?taskId=${paperId}`),
        {
          method: 'POST',
          body: formData,
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + (await getToken()),
          },
        },
      );

      const data = await response.json();

      // 检查响应状态码
      if (data.code !== 1000) {
        throw new Error(data.message || '提交图片失败');
      }

      dispatch({
        type: PaperActionTypes.SUBMIT_PAPER_SUCCESS,
        payload: data.data,
      });

      console.log('提交图片成功:', data);

      return Promise.resolve(data);
    } catch (error) {
      console.error('提交图片失败:', error);

      dispatch({
        type: PaperActionTypes.SUBMIT_PAPER_FAIL,
        payload: error.message || '提交图片失败',
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
      `${getPaperApiUrl(API_PATHS.paper.getPaperInfo)}?taskId=${paperId}`,
    );

    // 使用fetch API获取状态
    const response = await fetch(
      `${getPaperApiUrl(API_PATHS.paper.getPaperInfo)}?taskId=${paperId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + (await getToken()),
        },
      },
    );

    const data = await response.json();

    // 检查响应状态码
    if (data.code !== 1000) {
      throw new Error(data.message || '获取试卷信息失败');
    }

    dispatch({
      type: PaperActionTypes.GET_PAPER_STATUS_SUCCESS,
      payload: data.data,
    });

    console.log('获取试卷信息成功:', data);

    return Promise.resolve(data);
  } catch (error) {
    console.error('获取试卷信息失败:', error);

    dispatch({
      type: PaperActionTypes.GET_PAPER_STATUS_FAIL,
      payload: error.message || '获取试卷信息失败',
    });

    return Promise.reject(error);
  }
};

// 批量修改用户答案
export const updateUserAnswers =
  (taskId, answers) => async (dispatch: Dispatch) => {
    try {
      dispatch({type: PaperActionTypes.UPDATE_ANSWERS_REQUEST});

      console.log(
        '批量修改用户答案请求到:',
        getPaperApiUrl(API_PATHS.paper.batchUpdateAnswers) +
          `?taskId=${taskId}`,
      );

      const response = await fetch(
        getPaperApiUrl(API_PATHS.paper.batchUpdateAnswers) +
          `?taskId=${taskId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + (await getToken()),
          },
          body: JSON.stringify(answers),
        },
      );

      const data = await response.json();

      // 检查响应状态码
      if (data.code !== 1000) {
        throw new Error(data.message || '批量修改用户答案失败');
      }

      dispatch({
        type: PaperActionTypes.UPDATE_ANSWERS_SUCCESS,
        payload: data.data,
      });

      console.log('批量修改用户答案成功:', data);

      return Promise.resolve(data);
    } catch (error) {
      console.error('批量修改用户答案失败:', error);

      dispatch({
        type: PaperActionTypes.UPDATE_ANSWERS_FAIL,
        payload: error.message || '批量修改用户答案失败',
      });

      return Promise.reject(error);
    }
  };

// 获取批改结果
export const getGradingResult = taskId => async (dispatch: Dispatch) => {
  try {
    dispatch({type: PaperActionTypes.GET_GRADING_RESULT_REQUEST});

    console.log(
      '获取批改结果请求到:',
      `${getPaperApiUrl(API_PATHS.paper.getGradingResult)}?taskId=${taskId}`,
    );

    // 使用fetch API获取批改结果
    const response = await fetch(
      `${getPaperApiUrl(API_PATHS.paper.getGradingResult)}?taskId=${taskId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + (await getToken()),
        },
      },
    );

    const data = await response.json();

    // 检查响应状态码
    if (data.code !== 1000) {
      throw new Error(data.message || '获取批改结果失败');
    }

    dispatch({
      type: PaperActionTypes.GET_GRADING_RESULT_SUCCESS,
      payload: data.data,
    });

    console.log('获取批改结果成功:', data);

    return Promise.resolve(data);
  } catch (error) {
    console.error('获取批改结果失败:', error);

    dispatch({
      type: PaperActionTypes.GET_GRADING_RESULT_FAIL,
      payload: error.message || '获取批改结果失败',
    });

    return Promise.reject(error);
  }
};

// 批改试卷
export const gradePaper = taskId => async (dispatch: Dispatch) => {
  try {
    dispatch({type: PaperActionTypes.GRADE_PAPER_REQUEST});

    console.log(
      '批改试卷请求到:',
      `${getPaperApiUrl(API_PATHS.paper.gradePaper)}?taskId=${taskId}`,
    );

    const response = await fetch(
      `${getPaperApiUrl(API_PATHS.paper.gradePaper)}?taskId=${taskId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + (await getToken()),
        },
      },
    );

    const data = await response.json();

    // 检查响应状态码
    if (data.code !== 1000) {
      throw new Error(data.message || '批改试卷失败');
    }

    dispatch({
      type: PaperActionTypes.GRADE_PAPER_SUCCESS,
      payload: data.data,
    });

    console.log('批改试卷成功:', data);

    return Promise.resolve(data);
  } catch (error) {
    console.error('批改试卷失败:', error);

    dispatch({
      type: PaperActionTypes.GRADE_PAPER_FAIL,
      payload: error.message || '批改试卷失败',
    });

    return Promise.reject(error);
  }
};

// 获取所有评分结果
export const fetchAllGradingResults = () => async (dispatch: Dispatch) => {
  try {
    dispatch({type: PaperActionTypes.GET_ALL_GRADING_RESULTS_REQUEST});

    console.log(
      '获取所有评分结果请求到:',
      getPaperApiUrl(API_PATHS.paper.getAllGradingResults),
    );

    // 使用fetch API获取所有评分结果
    const response = await fetch(
      getPaperApiUrl(API_PATHS.paper.getAllGradingResults),
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + (await getToken()),
        },
      },
    );

    const data = await response.json();

    // 检查响应状态码
    if (data.code !== 1000) {
      throw new Error(data.message || '获取所有评分结果失败');
    }

    const recentAnalysis = data.data
      .sort(
        (a, b) =>
          new Date(b.submitTime).getTime() - new Date(a.submitTime).getTime(),
      )
      .slice(0, 3);

    dispatch({
      type: PaperActionTypes.GET_ALL_GRADING_RESULTS_SUCCESS,
      payload: recentAnalysis,
    });

    console.log('获取所有评分结果成功:', data);

    return Promise.resolve(data);
  } catch (error) {
    console.error('获取所有评分结果失败:', error);

    dispatch({
      type: PaperActionTypes.GET_ALL_GRADING_RESULTS_FAIL,
      payload: error.message || '获取所有评分结果失败',
    });

    return Promise.reject(error);
  }
};

// 获取最近的试卷
export const fetchRecentPapers =
  () => async (dispatch: Dispatch<PaperAction>) => {
    try {
      dispatch({type: PaperActionTypes.FETCH_RECENT_PAPERS_REQUEST});

      console.log(
        '获取最近试卷请求到:',
        getTasksApiUrl(API_PATHS.tasks.getTasks),
      );

      // 使用fetch API获取任务列表
      const response = await fetch(getTasksApiUrl(API_PATHS.tasks.getTasks), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + (await getToken()),
        },
      });

      const data = await response.json();

      // 检查响应状态码
      if (data.code !== 1000) {
        throw new Error(data.message || '获取最近试卷失败');
      }

      // 按创建时间排序并获取最近的3个试卷
      const sortedPapers = data.data
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);

      dispatch({
        type: PaperActionTypes.FETCH_RECENT_PAPERS_SUCCESS,
        payload: sortedPapers,
      });

      console.log('获取最近试卷成功:', sortedPapers);

      return Promise.resolve(sortedPapers);
    } catch (error) {
      console.error('获取最近试卷失败:', error);

      dispatch({
        type: PaperActionTypes.FETCH_RECENT_PAPERS_FAIL,
        payload: error.message || '获取最近试卷失败',
      });

      return Promise.reject(error);
    }
  };
