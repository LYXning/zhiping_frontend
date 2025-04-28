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
  // 添加最近试卷相关的状态初始值
  recentPapers: [],
  recentPapersLoading: false,
  recentPapersError: null,
  // 添加新的状态初始值
  updateAnswersLoading: false,
  updateAnswersSuccess: false,
  updateAnswersError: null,
  // 添加获取所有评分结果相关的状态初始值
  allGradingResults: [],
  allGradingResultsLoading: false,
  allGradingResultsError: null,
  // 添加批改试卷相关的状态
  gradePaperLoading: true,
  gradePaperSuccess: false,
  gradePaperError: null,
  // 添加获取批改结果相关的状态
  gradingResultLoading: true,
  gradingResultSuccess: false,
  gradingResultError: null,
  gradingResult: null,
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
        success: false,
        error: action.payload.err,
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

    // 处理获取最近试卷的 action
    case PaperActionTypes.FETCH_RECENT_PAPERS_REQUEST:
      return {
        ...state,
        recentPapersLoading: true,
        recentPapersError: null,
      };
    case PaperActionTypes.FETCH_RECENT_PAPERS_SUCCESS:
      return {
        ...state,
        recentPapersLoading: false,
        recentPapers: action.payload,
      };
    case PaperActionTypes.FETCH_RECENT_PAPERS_FAIL:
      return {
        ...state,
        recentPapersLoading: false,
        recentPapersError: action.payload,
      };

    // 添加获取所有评分结果相关的状态处理
    case PaperActionTypes.GET_ALL_GRADING_RESULTS_REQUEST:
      return {
        ...state,
        allGradingResultsLoading: true,
        allGradingResultsError: null,
      };
    case PaperActionTypes.GET_ALL_GRADING_RESULTS_SUCCESS:
      return {
        ...state,
        allGradingResultsLoading: false,
        allGradingResults: action.payload,
      };
    case PaperActionTypes.GET_ALL_GRADING_RESULTS_FAIL:
      return {
        ...state,
        allGradingResultsLoading: false,
        allGradingResultsError: action.payload,
      };

    // 添加批改试卷相关的状态处理
    case PaperActionTypes.GRADE_PAPER_REQUEST:
      return {
        ...state,
        gradePaperLoading: true,
        gradePaperSuccess: false,
        gradePaperError: null,
      };
    case PaperActionTypes.GRADE_PAPER_SUCCESS:
      return {
        ...state,
        gradePaperLoading: false,
        gradePaperSuccess: true,
        paper: action.payload,
      };
    case PaperActionTypes.GRADE_PAPER_FAIL:
      return {
        ...state,
        gradePaperLoading: false,
        gradePaperSuccess: false,
        gradePaperError: action.payload,
      };

    // 添加获取批改结果相关的状态处理
    case PaperActionTypes.GET_GRADING_RESULT_REQUEST:
      return {
        ...state,
        gradingResultLoading: true,
        gradingResultSuccess: false,
        gradingResultError: null,
        // 不要在请求开始时清空现有数据
        // gradingResult: null,
      };
    case PaperActionTypes.GET_GRADING_RESULT_SUCCESS:
      return {
        ...state,
        gradingResultLoading: false,
        gradingResultSuccess: true,
        gradingResult: action.payload,
      };
    case PaperActionTypes.GET_GRADING_RESULT_FAIL:
      return {
        ...state,
        gradingResultLoading: false,
        gradingResultSuccess: false,
        gradingResultError: action.payload,
        // 保留之前的数据，不要在失败时清空
        // gradingResult: null,
      };

    // 默认返回当前状态
    default:
      return state;
  }
};
