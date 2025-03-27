import {AuthState, AuthActionTypes, AuthAction} from '../types/auth';

// 初始状态
const initialState: AuthState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  smsCodeSending: false,
  smsCodeSent: false,
  smsError: null,
  user: {
    username: '',
    password: '',
    phone: '',
    name: '',
    school: '',
    studentID: '',
    role: 'STUDENT',
  },
  registerLoading: false,
  registerSuccess: false,
  registerError: null,
};

// Auth reducer
const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload?.user || null,
      };
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || '登录失败',
      };
    case AuthActionTypes.SMS_CODE_REQUEST:
      return {
        ...state,
        smsCodeSending: true,
        smsError: null,
      };
    case AuthActionTypes.SMS_CODE_SUCCESS:
      return {
        ...state,
        smsCodeSending: false,
        smsCodeSent: true,
      };
    case AuthActionTypes.SMS_CODE_FAILURE:
      return {
        ...state,
        smsCodeSending: false,
        smsError: action.payload || '发送验证码失败',
      };
    case AuthActionTypes.GET_PROFILE_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
      };
    case AuthActionTypes.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
      };
    case AuthActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        smsError: null,
      };
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {
          username: '',
          password: '',
          phone: '',
          name: '',
          school: '',
          studentID: '',
          role: 'STUDENT',
        },
      };
    default:
      return state;
  }
};

export default authReducer;
