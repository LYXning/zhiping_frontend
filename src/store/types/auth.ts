// Auth 状态类型定义
export interface AuthState {
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  smsCodeSending: boolean;
  smsCodeSent: boolean;
  smsError: string | null;
  user: User;
  registerLoading: boolean;
  registerSuccess: boolean;
  registerError: string | null;
}

// Auth Action 类型
// 在 AuthActionTypes 枚举中添加以下类型
export enum AuthActionTypes {
  // 登录
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',

  // 注册
  REGISTER_REQUEST = 'REGISTER_REQUEST',
  REGISTER_SUCCESS = 'REGISTER_SUCCESS',
  REGISTER_FAILURE = 'REGISTER_FAILURE',
  LOGOUT = 'LOGOUT',

  // 发送验证码
  SMS_CODE_REQUEST = 'SMS_CODE_REQUEST',
  SMS_CODE_SUCCESS = 'SMS_CODE_SUCCESS',
  SMS_CODE_FAILURE = 'SMS_CODE_FAILURE',
  CLEAR_ERRORS = 'CLEAR_ERRORS',

  // 忘记密码
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS = 'PASSWORD_RESET_SUCCESS',
  PASSWORD_RESET_FAILURE = 'PASSWORD_RESET_FAILURE',

  // 获取个人信息
  GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST',
  GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS',
  GET_PROFILE_FAILURE = 'GET_PROFILE_FAILURE',

  // 更新个人信息
  UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST',
  UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS',
  UPDATE_PROFILE_FAILURE = 'UPDATE_PROFILE_FAILURE',
}

export interface User {
  username: string;
  password: string;
  phone: string;
  name: string;
  school: string;
  studentID: string;
  role: 'STUDENT' | 'TEACHER';
}

// 添加注册相关的 Action 接口
export interface RegisterAction {
  type:
    | typeof AuthActionTypes.REGISTER_REQUEST
    | typeof AuthActionTypes.REGISTER_SUCCESS
    | typeof AuthActionTypes.REGISTER_FAILURE;
  payload?: any;
}

export interface LogoutAction {
  type: typeof AuthActionTypes.LOGOUT;
}

// 更新 AuthAction 类型联合
export type AuthAction =
  | LoginAction
  | SmsCodeAction
  | RegisterAction
  | LogoutAction
  | ClearErrorsAction
  | PasswordResetAction
  | GetProfileAction
  | UpdateProfileAction;

// Action 创建函数类型
export interface LoginAction {
  type:
    | typeof AuthActionTypes.LOGIN_REQUEST
    | typeof AuthActionTypes.LOGIN_SUCCESS
    | typeof AuthActionTypes.LOGIN_FAILURE;
  payload?: any;
}

export interface SmsCodeAction {
  type:
    | typeof AuthActionTypes.SMS_CODE_REQUEST
    | typeof AuthActionTypes.SMS_CODE_SUCCESS
    | typeof AuthActionTypes.SMS_CODE_FAILURE;
  payload?: any;
}

export interface ClearErrorsAction {
  type: typeof AuthActionTypes.CLEAR_ERRORS;
}

// 添加忘记密码相关的 Action 接口
export interface PasswordResetAction {
  type:
    | typeof AuthActionTypes.PASSWORD_RESET_REQUEST
    | typeof AuthActionTypes.PASSWORD_RESET_SUCCESS
    | typeof AuthActionTypes.PASSWORD_RESET_FAILURE;
  payload?: any;
}

// 添加获取个人信息相关的 Action 接口
export interface GetProfileAction {
  type:
    | typeof AuthActionTypes.GET_PROFILE_REQUEST
    | typeof AuthActionTypes.GET_PROFILE_SUCCESS
    | typeof AuthActionTypes.GET_PROFILE_FAILURE;
  payload?: any;
}

// 添加更新个人信息相关的 Action 接口
export interface UpdateProfileAction {
  type:
    | typeof AuthActionTypes.UPDATE_PROFILE_REQUEST
    | typeof AuthActionTypes.UPDATE_PROFILE_SUCCESS
    | typeof AuthActionTypes.UPDATE_PROFILE_FAILURE;
  payload?: any;
}
