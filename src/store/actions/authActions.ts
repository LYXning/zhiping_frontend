import {Dispatch} from 'redux';
import {AuthActionTypes, AuthAction, User} from '../types/auth';
import axios from 'axios';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // 导入Toast组件

// 注册数据类型, 继承自User类型
interface registerData extends User {
  smsCode: string;
}

// API 基础URL - 根据平台选择不同的地址
// 注意：在Android模拟器中，10.0.2.2 指向主机的localhost
// 如果使用真机，需要使用电脑在局域网中的实际IP地址
const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api/auth' // Android 模拟器
    : 'http://localhost:8080/api/auth'; // iOS或Web环境

// 创建axios实例，便于统一配置
const api = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 增加超时时间
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 添加请求拦截器，用于调试
api.interceptors.request.use(
  config => {
    console.log('发送请求:', config.method?.toUpperCase(), config.url);
    console.log('请求数据:', config.data);
    return config;
  },
  error => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  },
);

// 添加响应拦截器，用于调试
api.interceptors.response.use(
  response => {
    console.log('响应状态:', response.status);
    return response;
  },
  error => {
    console.error('响应拦截器错误:', error.message);
    return Promise.reject(error);
  },
);

// 错误码映射表
const errorCodeMap: Record<string, string> = {
  '1001': '系统错误，请稍后重试',
  '1003': '未授权，请重新登录',
  '2000': '用户不存在',
  '2001': '用户名已存在',
  '2002': '手机号已被注册',
  '2003': '密码错误',
  '2004': '验证码错误或已过期',
  '2005': '验证码发送失败',
  '2006': '用户已被禁用',
};

// 处理API错误的通用函数
const handleApiError = (error: any): string => {
  try {
    console.log('处理错误类型:', typeof error);

    // 防止JSON.stringify导致的循环引用错误
    let errorLog;
    try {
      errorLog = JSON.stringify(error);
      console.log('处理错误:', errorLog);
    } catch (e) {
      console.log('错误无法序列化:', e);
      errorLog = '错误对象无法序列化';
    }

    // 处理响应数据不符合预期的情况
    if (error && typeof error === 'object' && 'data' in error) {
      const responseData = error.data;

      // 检查是否有错误码和错误信息
      if (
        responseData &&
        responseData.code &&
        errorCodeMap[responseData.code]
      ) {
        return errorCodeMap[responseData.code];
      }

      if (responseData && responseData.message) {
        return responseData.message;
      }

      // 如果有其他有用信息，尝试提取
      try {
        return `服务器响应异常: ${JSON.stringify(responseData)}`;
      } catch (e) {
        return '服务器响应异常且无法解析';
      }
    }

    // 如果错误是普通字符串
    if (typeof error === 'string') {
      return error;
    }

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        return '网络请求超时，请检查网络连接后重试';
      } else if (error.response) {
        // 服务器返回了错误响应
        const errorCode = error.response.data?.code;
        const errorMessage = error.response.data?.message;

        console.log('错误信息:', errorMessage, '错误码:', errorCode);

        // 如果有错误码且在映射表中，返回对应的错误信息
        if (errorCode && errorCodeMap[errorCode]) {
          return errorCodeMap[errorCode];
        }

        // 如果服务器返回了错误信息，使用服务器的错误信息
        if (errorMessage) {
          return errorMessage;
        }

        // 否则返回通用错误信息
        return `服务器错误: ${error.response.status}`;
      } else if (error.request) {
        // 请求已发出，但没有收到响应
        return '无法连接到服务器，请检查网络连接或服务器状态';
      } else {
        // 请求配置有问题
        return '请求配置错误: ' + error.message;
      }
    }

    // 处理Error实例
    if (error instanceof Error) {
      return error.message;
    }

    // 非Axios错误
    return '发生未知错误，请稍后重试';
  } catch (unexpectedError) {
    // 捕获处理错误过程中可能发生的任何异常
    console.error('处理错误时发生异常:', unexpectedError);
    return '处理错误时发生异常，请稍后重试';
  }
};

// 保存token的辅助函数
const saveToken = async (token: string): Promise<void> => {
  try {
    if (!token) {
      throw new Error('Token为空，无法保存');
    }

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      await AsyncStorage.setItem('token', token);
    } else {
      // Web环境
      localStorage.setItem('token', token);
    }
  } catch (error) {
    console.error('保存token失败:', error);
    throw error;
  }
};

// 清除token的辅助函数
const clearToken = async (): Promise<void> => {
  try {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      await AsyncStorage.removeItem('token');
    } else {
      // Web环境
      localStorage.removeItem('token');
    }
  } catch (error) {
    console.error('清除token失败:', error);
    // 即使清除失败也继续执行
  }
};

// 获取token的辅助函数
const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      return await AsyncStorage.getItem('token');
    } else {
      // Web环境
      return localStorage.getItem('token');
    }
  } catch (error) {
    console.error('获取token失败:', error);
    return null;
  }
};

// 登录 action
export const login = (username: string, password: string) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({type: AuthActionTypes.LOGIN_REQUEST});

    try {
      console.log('发送登录请求:', {username, password});

      // 使用api实例发送请求
      const response = await api.post('/login', {
        usernameOrPhone: username,
        password,
        useSmsLogin: false,
      });

      console.log('登录响应:', response.data);

      // 修正：检查响应数据结构，如果不符合预期，提取有用信息
      if (!response.data || !response.data.data || !response.data.data.token) {
        console.error('响应数据结构不符合预期:', response.data);
        // 将整个响应对象传递给错误处理函数，而不是直接抛出固定错误
        throw response;
      }

      // 登录成功，保存token
      const {user, token} = response.data.data;

      // 使用辅助函数保存token
      await saveToken(token);

      // 显示成功提示
      Toast.show({
        type: 'success',
        text1: '登录成功',
        text2: `欢迎回来，${user?.name || user?.username || '用户'}！`, // 优先使用name字段
        position: 'bottom',
        visibilityTime: 2000,
      });

      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: {user},
      });
    } catch (error) {
      console.error('登录错误详情:', error);

      // 使用通用错误处理函数获取格式化的错误信息
      const errorMessage = handleApiError(error);
      console.log('格式化后的错误信息:', errorMessage);

      // 显示错误提示
      Toast.show({
        type: 'error',
        text1: '登录失败',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 3000,
      });

      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// 验证码登录 action 中的错误处理
export const loginWithSms = (phone: string, smsCode: string) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({type: AuthActionTypes.LOGIN_REQUEST});

    try {
      console.log('发送验证码登录请求:', {phone, smsCode});
      // 使用api实例
      const response = await api.post('/login', {
        usernameOrPhone: phone,
        verificationCode: smsCode,
        useSmsLogin: true,
      });

      console.log('登录响应:', response.data);

      // 修正：正确解析嵌套的响应数据结构
      if (!response.data || !response.data.data || !response.data.data.token) {
        console.error('响应数据结构不符合预期:', response.data);
        throw response;
      }

      // 登录成功，保存token
      const {user, token} = response.data.data;

      // 使用辅助函数保存token
      await saveToken(token);

      // 显示成功提示
      Toast.show({
        type: 'success',
        text1: '登录成功',
        text2: `欢迎回来，${user?.name || user?.username || '用户'}！`, // 优先使用name字段
        position: 'bottom',
        visibilityTime: 2000,
      });

      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: {user},
      });
    } catch (error) {
      console.error('验证码登录错误:', error);

      // 使用通用错误处理函数
      const errorMessage = handleApiError(error);

      // 显示错误提示
      Toast.show({
        type: 'error',
        text1: '登录失败',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 3000,
      });

      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// 发送验证码 action
export const sendSmsCode = (phone: string, type: string) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({type: AuthActionTypes.SMS_CODE_REQUEST});

    try {
      // 调用发送验证码API，传入手机号和类型
      const response = await api.post(
        '/send-verification-code?phone=' + phone + '&type=' + type,
      );
      console.log('登录响应:', response.data);

      // 修正：正确解析嵌套的响应数据结构
      if (!response.data || !response.data.data) {
        console.error('响应数据结构不符合预期:', response.data);
        throw response;
      }

      // 显示成功提示
      Toast.show({
        type: 'success',
        text1: '验证码已发送',
        text2: '请查看短信并输入验证码',
        position: 'bottom',
        visibilityTime: 2000,
      });

      dispatch({type: AuthActionTypes.SMS_CODE_SUCCESS});
    } catch (error) {
      console.error('发送验证码错误:', error);

      // 使用通用错误处理函数
      const errorMessage = handleApiError(error);

      // 显示错误提示
      Toast.show({
        type: 'error',
        text1: '发送验证码失败',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 3000,
      });

      dispatch({
        type: AuthActionTypes.SMS_CODE_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// 注册 action 中的错误处理
export const register = (userData: registerData) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({type: AuthActionTypes.REGISTER_REQUEST});

    const {username, password, phone, name, smsCode, studentID, school, role} =
      userData;

    try {
      // 调用注册API
      const response = await api.post('/register', {
        username,
        password,
        phone,
        verificationCode: smsCode,
        name, // 确保name字段被正确传递
        studentID,
        school,
        role,
      });

      console.log('注册响应:', response.data);

      // 修正：正确解析嵌套的响应数据结构
      if (!response.data || !response.data.data || !response.data.data.token) {
        console.error('响应数据结构不符合预期:', response.data);
        throw new Error('服务器响应缺少token信息');
      }

      // 注册成功，自动登录
      const {user, token} = response.data.data;

      // 使用辅助函数保存token
      await saveToken(token);

      // 显示成功提示
      Toast.show({
        type: 'success',
        text1: '注册成功',
        text2: `欢迎加入智评，${name || username}！`, // 优先使用name字段
        position: 'bottom',
        visibilityTime: 2000,
      });

      dispatch({
        type: AuthActionTypes.REGISTER_SUCCESS,
        payload: {user},
      });
    } catch (error) {
      console.error('注册错误:', error);

      // 使用通用错误处理函数
      const errorMessage = handleApiError(error);

      // 显示错误提示
      Toast.show({
        type: 'error',
        text1: '注册失败',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 3000,
      });

      dispatch({
        type: AuthActionTypes.REGISTER_FAILURE,
        payload: errorMessage,
      });
    }
  };
};

// 检查用户名是否可用
export const checkUsername = (username: string) => {
  return async () => {
    try {
      const response = await api.get(
        `/check-username?username=${encodeURIComponent(username)}`,
      );
      return response.data.available;
    } catch (error) {
      console.error('检查用户名错误:', error);
      // 出错时默认返回不可用
      return false;
    }
  };
};

// 检查手机号是否可用
export const checkPhone = (phone: string) => {
  return async () => {
    try {
      const response = await api.get(
        `/check-phone?phone=${encodeURIComponent(phone)}`,
      );
      return response.data.available;
    } catch (error) {
      console.error('检查手机号错误:', error);
      // 出错时默认返回不可用
      return false;
    }
  };
};

// 验证token是否有效
export const validateToken = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      // 使用辅助函数获取token
      const token = await getToken();

      if (!token) {
        dispatch({type: AuthActionTypes.LOGOUT});
        return;
      }

      // 设置请求头包含token
      const response = await api.get('/validate-token', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 修正：正确解析嵌套的响应数据结构
      if (!response.data || !response.data.data) {
        console.error('响应数据结构不符合预期:', response.data);
        throw new Error('服务器响应缺少用户信息');
      }

      // token有效，获取用户信息
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: {user: response.data.data.user},
      });
    } catch (error) {
      console.error('验证token错误:', error);

      // 使用通用错误处理函数获取错误信息
      const errorMessage = handleApiError(error);

      // 特定错误码处理
      if (axios.isAxiosError(error) && error.response?.data?.code === '1003') {
        // 未授权，清除token并登出
        await clearToken();
        dispatch({type: AuthActionTypes.LOGOUT});
      } else {
        // 其他错误，显示错误信息
        Toast.show({
          type: 'error',
          text1: '会话验证失败',
          text2: errorMessage,
          position: 'bottom',
          visibilityTime: 3000,
        });

        // 清除token并登出
        await clearToken();
        dispatch({type: AuthActionTypes.LOGOUT});
      }
    }
  };
};

// 登出 action
export const logout = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      // 使用辅助函数清除token
      await clearToken();

      dispatch({type: AuthActionTypes.LOGOUT});
    } catch (error) {
      console.error('登出错误:', error);
      // 即使出错也尝试登出
      dispatch({type: AuthActionTypes.LOGOUT});
    }
  };
};

// 清除错误 action
export const clearErrors = (): AuthAction => ({
  type: AuthActionTypes.CLEAR_ERRORS,
});

// 测试API连接
export const testApiConnection = () => {
  return async () => {
    try {
      console.log('测试API连接...', API_URL);
      // 使用简单的ping
      const response = await api.get('/ping', {
        timeout: 5000, // 5秒超时
      });
      console.log('API连接成功:', response.status);

      // 显示成功提示
      Toast.show({
        type: 'success',
        text1: 'API连接成功',
        text2: '服务器连接正常',
        position: 'bottom',
        visibilityTime: 2000,
      });

      return true;
    } catch (error) {
      console.error('API连接失败:', error);

      let errorMessage = '无法连接到服务器';

      if (axios.isAxiosError(error)) {
        console.error('错误详情:', {
          message: error.message,
          code: error.code,
          config: error.config,
          response: error.response,
        });

        if (error.code === 'ECONNABORTED') {
          errorMessage = '连接超时，请检查网络';
        } else if (error.response) {
          errorMessage = `服务器响应错误: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = '未收到服务器响应，请检查服务器是否运行';
        }
      }

      // 显示错误提示
      Toast.show({
        type: 'error',
        text1: 'API连接失败',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 3000,
      });

      return false;
    }
  };
};

// 重置密码请求
export const requestPasswordReset = (email: string) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({type: AuthActionTypes.PASSWORD_RESET_REQUEST});

    try {
      // 调用重置密码API
      await api.post('/request-password-reset', {email});

      // 显示成功提示
      Toast.show({
        type: 'success',
        text1: '重置密码邮件已发送',
        text2: '请查看您的邮箱并按照指引重置密码',
        position: 'bottom',
        visibilityTime: 3000,
      });

      dispatch({type: AuthActionTypes.PASSWORD_RESET_SUCCESS});
      return true;
    } catch (error) {
      console.error('请求重置密码错误:', error);

      // 使用通用错误处理函数
      const errorMessage = handleApiError(error);

      // 显示错误提示
      Toast.show({
        type: 'error',
        text1: '重置密码请求失败',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 3000,
      });

      dispatch({
        type: AuthActionTypes.PASSWORD_RESET_FAILURE,
        payload: errorMessage,
      });
      return false;
    }
  };
};

// 执行密码重置
export const resetPassword = (token: string, newPassword: string) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({type: AuthActionTypes.PASSWORD_RESET_REQUEST});

    try {
      // 调用重置密码API
      await api.post('/reset-password', {token, newPassword});

      // 显示成功提示
      Toast.show({
        type: 'success',
        text1: '密码重置成功',
        text2: '请使用新密码登录',
        position: 'bottom',
        visibilityTime: 2000,
      });

      dispatch({type: AuthActionTypes.PASSWORD_RESET_SUCCESS});
      return true;
    } catch (error) {
      console.error('重置密码错误:', error);

      // 使用通用错误处理函数
      const errorMessage = handleApiError(error);

      // 显示错误提示
      Toast.show({
        type: 'error',
        text1: '密码重置失败',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 3000,
      });

      dispatch({
        type: AuthActionTypes.PASSWORD_RESET_FAILURE,
        payload: errorMessage,
      });
      return false;
    }
  };
};

// 更新用户信息
export const updateUserProfile = (userId: string, profileData: any) => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({type: AuthActionTypes.UPDATE_PROFILE_REQUEST});

    try {
      // 获取token
      let token;
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        token = await AsyncStorage.getItem('token');
      } else {
        token = localStorage.getItem('token');
      }

      if (!token) {
        throw new Error('未授权，请先登录');
      }

      // 调用更新用户信息API
      const response = await api.put(`/users/${userId}`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 修正：正确解析嵌套的响应数据结构
      if (!response.data || !response.data.data) {
        console.error('响应数据结构不符合预期:', response.data);
        throw new Error('服务器响应缺少用户信息');
      }

      // 显示成功提示
      Toast.show({
        type: 'success',
        text1: '个人信息更新成功',
        text2: profileData.name ? `已更新为 ${profileData.name}` : '', // 如果更新了name，显示新的name
        position: 'bottom',
        visibilityTime: 2000,
      });

      dispatch({
        type: AuthActionTypes.UPDATE_PROFILE_SUCCESS,
        payload: {user: response.data.data.user},
      });
      return true;
    } catch (error) {
      console.error('更新用户信息错误:', error);

      // 使用通用错误处理函数
      const errorMessage = handleApiError(error);

      // 显示错误提示
      Toast.show({
        type: 'error',
        text1: '更新个人信息失败',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 3000,
      });

      dispatch({
        type: AuthActionTypes.UPDATE_PROFILE_FAILURE,
        payload: errorMessage,
      });
      return false;
    }
  };
};

export const getUserProfile = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    dispatch({type: AuthActionTypes.GET_PROFILE_REQUEST});

    try {
      // 获取token
      let token;
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        token = await AsyncStorage.getItem('token');
      } else {
        token = localStorage.getItem('token');
      }

      if (!token) {
        throw new Error('未授权，请先登录');
      }

      // 调用获取用户信息API
      const response = await api.get(`/auth/user-info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 修正：正确解析嵌套的响应数据结构
      if (!response.data || !response.data.data) {
        console.error('响应数据结构不符合预期:', response.data);
        throw new Error('服务器响应缺少用户信息');
      }

      dispatch({
        type: AuthActionTypes.GET_PROFILE_SUCCESS,
        payload: {user: response.data.data.user},
      });
      return response.data.data.user;
    } catch (error) {
      console.error('获取用户信息错误:', error);

      // 使用通用错误处理函数
      const errorMessage = handleApiError(error);

      // 显示错误提示
      Toast.show({
        type: 'error',
        text1: '获取个人信息失败',
        text2: errorMessage,
        position: 'bottom',
        visibilityTime: 3000,
      });

      dispatch({
        type: AuthActionTypes.GET_PROFILE_FAILURE,
        payload: errorMessage,
      });
      return null;
    }
  };
};
