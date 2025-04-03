import {PaperActionTypes, PaperState} from '../types/paper';

const initialState: PaperState = {
  loading: false,
  success: false,
  error: null,
  paper: null,
  tasks: [],
  tasksLoading: false,
  tasksError: null,
  teacherTasks: [],
  teacherTasksLoading: false,
  teacherTasksError: null,
  paperStatusLoading: false,
  paperStatusError: null,
  // 添加新的状态初始值
  updateAnswersLoading: false,
  updateAnswersSuccess: false,
  updateAnswersError: null,
};

export const paperReducer = (state = initialState, action) => {
  switch (action.type) {
    // 获取任务列表
    case PaperActionTypes.GET_TASKS_REQUEST:
      return {
        ...state,
        tasksLoading: true,
        tasksError: null,
      };
    case PaperActionTypes.GET_TASKS_SUCCESS:
      return {
        ...state,
        tasksLoading: false,
        tasks: action.payload,
      };
    case PaperActionTypes.GET_TASKS_FAIL:
      return {
        ...state,
        tasksLoading: false,
        tasksError: action.payload,
      };

    // 提交试卷
    case PaperActionTypes.SUBMIT_PAPER_REQUEST:
      return {
        ...state,
        loading: true,
        success: false,
        error: null,
      };
    case PaperActionTypes.SUBMIT_PAPER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        paper: action.payload,
      };
    case PaperActionTypes.SUBMIT_PAPER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 清除错误
    case PaperActionTypes.CLEAR_PAPER_ERRORS:
      return {
        ...state,
        error: null,
        tasksError: null,
        teacherTasksError: null,
      };

    // 获取教师任务列表
    case PaperActionTypes.GET_TEACHER_TASKS_REQUEST:
      return {
        ...state,
        teacherTasksLoading: true,
        teacherTasksError: null,
      };
    case PaperActionTypes.GET_TEACHER_TASKS_SUCCESS:
      return {
        ...state,
        teacherTasksLoading: false,
        teacherTasks: action.payload,
      };
    case PaperActionTypes.GET_TEACHER_TASKS_FAIL:
      return {
        ...state,
        teacherTasksLoading: false,
        teacherTasksError: action.payload,
      };
    case PaperActionTypes.GET_PAPER_STATUS_SUCCESS:
      return {
        ...state,
        paper: action.payload,
      };
    case PaperActionTypes.CREATE_PAPER_SUCCESS:
      return {
        ...state,
        paper: action.payload,
      };

    // 添加更新答案的 case 处理
    case PaperActionTypes.UPDATE_ANSWERS_REQUEST:
      return {
        ...state,
        updateAnswersLoading: true,
        updateAnswersSuccess: false,
        updateAnswersError: null,
      };
    case PaperActionTypes.UPDATE_ANSWERS_SUCCESS:
      return {
        ...state,
        updateAnswersLoading: false,
        updateAnswersSuccess: true,
        paper: action.payload,
      };
    case PaperActionTypes.UPDATE_ANSWERS_FAIL:
      return {
        ...state,
        updateAnswersLoading: false,
        updateAnswersError: action.payload,
      };

    // 确保处理 CREATE_PAPER_FAIL
    case PaperActionTypes.CREATE_PAPER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 默认返回当前状态
    default:
      return state;
  }
};
