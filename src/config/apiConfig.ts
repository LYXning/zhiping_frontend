/**
 * API配置文件
 * 用于集中管理所有API请求地址
 */

import {Platform} from 'react-native';

// 环境配置
type Environment = 'development' | 'production' | 'test';

// 当前环境，可以根据需要修改
const CURRENT_ENV: Environment = 'production';

// 不同环境的基础URL
const BASE_URLS: Record<Environment, string> = {
  development:
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080/api' // Android 模拟器
      : 'http://localhost:8080/api', // iOS或Web环境
  test: 'https://test-api.zhiping.com/api',
  production: 'http://120.76.242.160:8080/api',
};

// 导出当前环境的基础URL
export const API_BASE_URL = BASE_URLS[CURRENT_ENV];

// API路径配置
export const API_PATHS = {
  auth: {
    base: '/auth',
    login: '/login',
    register: '/register',
    refreshToken: '/refreshToken',
    verifyToken: '/verifyToken',
    sendSmsCode: '/send-verification-code',
    verifySmsCode: '/verifySmsCode',
    checkUsername: '/check-username',
    checkPhone: '/check-phone',
    validateToken: '/validate-token',
    userInfo: '/user-info',
  },
  tasks: {
    base: '/tasks',
    getTasks: '/getTasks',
    getTask: (id: number) => `/${id}`,
    createTask: '',
    updateTask: (id: number) => `/${id}`,
    deleteTask: (id: number) => `/${id}`,
    uploadFile: (taskId: number) => `/${taskId}/upload-file`,
    uploadAnswer: (taskId: number) => `/${taskId}/upload-answer`,
    recognizeStructure: (taskId: number) => `/${taskId}/recognize-structure`,
    getTeacherTasks: (teacherId: number) => `/teacher/${teacherId}`,
    getClasses: '/classes',
    getSubjects: '/subjects',
    scanSubmit: '/scan/submit',
  },
  paper: {
    base: '/paper',
    createTask: '/createTask',
    analyze: '/analyze',
    getPaperInfo: '/getPaperInfo',
    updateAnswer: '/updateAnswer',
    batchUpdateAnswers: '/batchUpdateAnswers',
    getGradingResult: '/getGradingResult',
    getAllGradingResults: '/getAllGradingResults',
    gradePaper: '/gradePaper',
    updateMongodb: '/updateMongodb',
  },
  analysis: {
    getAnalysis: '/analysis/weakness',
    getKnowledgePoints: '/analysis/knowledge-points',
    getQuestionTypes: '/analysis/question-types',
    getLearningPaths: '/analysis/learning-paths',
  },
  submissions: {
    base: '/submissions',
    submit: '/submit',
    getSubmission: (submissionId: number) => `/${submissionId}`,
  },
  ai: {
    base: '/ai',
    imageAnalyze: '/image/analyze',
  },
  images: {
    base: '/images',
    upload: '/upload',
  },
};

// 完整API URL构建函数
export const getApiUrl = (path: string): string => {
  return `${API_BASE_URL}${path}`;
};

// 特定模块的API URL构建函数
export const getAuthApiUrl = (path: string): string => {
  return `${API_BASE_URL}${API_PATHS.auth.base}${path}`;
};

export const getTasksApiUrl = (path: string): string => {
  return `${API_BASE_URL}${API_PATHS.tasks.base}${path}`;
};

export const getPaperApiUrl = (path: string): string => {
  return `${API_BASE_URL}${API_PATHS.paper.base}${path}`;
};

export const getSubmissionsApiUrl = (path: string): string => {
  return `${API_BASE_URL}${API_PATHS.submissions.base}${path}`;
};

export const getAiApiUrl = (path: string): string => {
  return `${API_BASE_URL}${API_PATHS.ai.base}${path}`;
};

export const getImagesApiUrl = (path: string): string => {
  return `${API_BASE_URL}${API_PATHS.images.base}${path}`;
};

// 导出默认配置
export default {
  API_BASE_URL,
  API_PATHS,
  getApiUrl,
  getAuthApiUrl,
  getTasksApiUrl,
  getPaperApiUrl,
  getSubmissionsApiUrl,
  getAiApiUrl,
  getImagesApiUrl,
};
