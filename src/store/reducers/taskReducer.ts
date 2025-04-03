import {TaskState, TaskActionTypes, TaskAction} from '../types/task';

// 初始状态
const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  success: false,
  draftSaved: false,
};

// 任务reducer
const taskReducer = (state = initialState, action: TaskAction): TaskState => {
  switch (action.type) {
    // 获取任务列表
    case TaskActionTypes.FETCH_TASKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case TaskActionTypes.FETCH_TASKS_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: action.payload,
      };
    case TaskActionTypes.FETCH_TASKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 获取单个任务
    case TaskActionTypes.FETCH_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case TaskActionTypes.FETCH_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        currentTask: action.payload,
      };
    case TaskActionTypes.FETCH_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 创建任务
    case TaskActionTypes.CREATE_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case TaskActionTypes.CREATE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: [...state.tasks, action.payload],
        currentTask: action.payload,
        success: true,
      };
    case TaskActionTypes.CREATE_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    // 更新任务
    case TaskActionTypes.UPDATE_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case TaskActionTypes.UPDATE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task,
        ),
        currentTask: action.payload,
        success: true,
      };
    case TaskActionTypes.UPDATE_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    // 删除任务
    case TaskActionTypes.DELETE_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case TaskActionTypes.DELETE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        currentTask:
          state.currentTask?.id === action.payload ? null : state.currentTask,
      };
    case TaskActionTypes.DELETE_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // 保存草稿
    case TaskActionTypes.SAVE_DRAFT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        draftSaved: false,
      };
    case TaskActionTypes.SAVE_DRAFT_SUCCESS:
      return {
        ...state,
        loading: false,
        currentTask: action.payload,
        draftSaved: true,
      };
    case TaskActionTypes.SAVE_DRAFT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        draftSaved: false,
      };

    // 发布任务
    case TaskActionTypes.PUBLISH_TASK_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case TaskActionTypes.PUBLISH_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        currentTask: action.payload,
        success: true,
      };
    case TaskActionTypes.PUBLISH_TASK_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        success: false,
      };

    // 清除错误
    case TaskActionTypes.CLEAR_TASK_ERRORS:
      return {
        ...state,
        error: null,
      };

    // 重置状态
    case TaskActionTypes.RESET_TASK_STATE:
      return initialState;

    default:
      return state;
  }
};

export default taskReducer;
