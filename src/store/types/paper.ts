// 试卷状态枚举
export enum PaperStatus {
  PUBLISHED = 1, // 已发布
  DRAFT = 2, // 草稿
  PENDING = 3, // 待批改
  GRADING = 4, // 批改中
  COMPLETED = 5, // 已完成
}

// 试卷/任务接口
export interface Paper {
  id: number;
  name: string;
  status: PaperStatus;
  subjectName?: string;
  subjectId?: number;
  gradeName?: string;
  deadline?: string;
  score?: number;
  className?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Paper Action 类型
// 添加获取试卷状态的 action types
export enum PaperActionTypes {
  // 已有的 action types
  GET_TASKS_REQUEST = 'GET_TASKS_REQUEST',
  GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS',
  GET_TASKS_FAIL = 'GET_TASKS_FAIL',

  SUBMIT_PAPER_REQUEST = 'SUBMIT_PAPER_REQUEST',
  SUBMIT_PAPER_SUCCESS = 'SUBMIT_PAPER_SUCCESS',
  SUBMIT_PAPER_FAIL = 'SUBMIT_PAPER_FAIL',

  GET_TEACHER_TASKS_REQUEST = 'GET_TEACHER_TASKS_REQUEST',
  GET_TEACHER_TASKS_SUCCESS = 'GET_TEACHER_TASKS_SUCCESS',
  GET_TEACHER_TASKS_FAIL = 'GET_TEACHER_TASKS_FAIL',

  CLEAR_PAPER_ERRORS = 'CLEAR_PAPER_ERRORS',

  // 已有的新 action types
  GET_PAPER_STATUS_REQUEST = 'GET_PAPER_STATUS_REQUEST',
  GET_PAPER_STATUS_SUCCESS = 'GET_PAPER_STATUS_SUCCESS',
  GET_PAPER_STATUS_FAIL = 'GET_PAPER_STATUS_FAIL',
  CREATE_PAPER_REQUEST = 'CREATE_PAPER_REQUEST',
  CREATE_PAPER_SUCCESS = 'CREATE_PAPER_SUCCESS',
  CREATE_PAPER_FAIL = 'CREATE_PAPER_FAIL',

  // 添加缺少的 action types
  UPDATE_ANSWERS_REQUEST = 'UPDATE_ANSWERS_REQUEST',
  UPDATE_ANSWERS_SUCCESS = 'UPDATE_ANSWERS_SUCCESS',
  UPDATE_ANSWERS_FAIL = 'UPDATE_ANSWERS_FAIL',
}

// 更新 PaperState 接口，添加新的状态字段
export interface PaperState {
  loading: boolean;
  success: boolean;
  error: any;
  paper: any;
  tasks: any[];
  tasksLoading: boolean;
  tasksError: any;
  teacherTasks: any[];
  teacherTasksLoading: boolean;
  teacherTasksError: any;
  // 已有的新状态字段
  paperStatusLoading: boolean;
  paperStatusError: any;
  // 添加更新答案相关的状态
  updateAnswersLoading: boolean;
  updateAnswersSuccess: boolean;
  updateAnswersError: any;
}

// 获取任务列表 Action 接口
interface GetTasksRequestAction {
  type: typeof PaperActionTypes.GET_TASKS_REQUEST;
}

interface GetTasksSuccessAction {
  type: typeof PaperActionTypes.GET_TASKS_SUCCESS;
  payload: Paper[];
}

interface GetTasksFailAction {
  type: typeof PaperActionTypes.GET_TASKS_FAIL;
  payload: string;
}

// 提交试卷 Action 接口
interface SubmitPaperRequestAction {
  type: typeof PaperActionTypes.SUBMIT_PAPER_REQUEST;
}

interface SubmitPaperSuccessAction {
  type: typeof PaperActionTypes.SUBMIT_PAPER_SUCCESS;
  payload: Paper;
}

interface SubmitPaperFailAction {
  type: typeof PaperActionTypes.SUBMIT_PAPER_FAIL;
  payload: string;
}

// 清除错误 Action 接口
interface ClearPaperErrorsAction {
  type: typeof PaperActionTypes.CLEAR_PAPER_ERRORS;
}

// 获取教师任务列表 Action 接口
interface GetTeacherTasksRequestAction {
  type: typeof PaperActionTypes.GET_TEACHER_TASKS_REQUEST;
}

interface GetTeacherTasksSuccessAction {
  type: typeof PaperActionTypes.GET_TEACHER_TASKS_SUCCESS;
  payload: Paper[];
}

interface GetTeacherTasksFailAction {
  type: typeof PaperActionTypes.GET_TEACHER_TASKS_FAIL;
  payload: string;
}

interface GetPaperStatusRequestAction {
  type: typeof PaperActionTypes.GET_PAPER_STATUS_REQUEST;
}

interface GetPaperStatusSuccessAction {
  type: typeof PaperActionTypes.GET_PAPER_STATUS_SUCCESS;
  payload: Paper[];
}

interface GetPaperStatusFailAction {
  type: typeof PaperActionTypes.GET_PAPER_STATUS_FAIL;
}

interface CreatePaperRequestAction {
  type: typeof PaperActionTypes.CREATE_PAPER_REQUEST;
}

interface CreatePaperSuccessAction {
  type: typeof PaperActionTypes.CREATE_PAPER_SUCCESS;
  payload: Paper;
}

// 添加更新答案的 Action 接口
interface UpdateAnswersRequestAction {
  type: typeof PaperActionTypes.UPDATE_ANSWERS_REQUEST;
}

interface UpdateAnswersSuccessAction {
  type: typeof PaperActionTypes.UPDATE_ANSWERS_SUCCESS;
  payload: any;
}

interface UpdateAnswersFailAction {
  type: typeof PaperActionTypes.UPDATE_ANSWERS_FAIL;
  payload: string;
}

// 添加缺少的 CreatePaperFailAction 接口
interface CreatePaperFailAction {
  type: typeof PaperActionTypes.CREATE_PAPER_FAIL;
  payload: string;
}

// 组合所有 Paper Action 类型
export type PaperAction =
  | GetTasksRequestAction
  | GetTasksSuccessAction
  | GetTasksFailAction
  | SubmitPaperRequestAction
  | SubmitPaperSuccessAction
  | SubmitPaperFailAction
  | ClearPaperErrorsAction
  | GetTeacherTasksRequestAction
  | GetTeacherTasksSuccessAction
  | GetTeacherTasksFailAction
  | GetPaperStatusRequestAction
  | GetPaperStatusSuccessAction
  | GetPaperStatusFailAction
  | CreatePaperRequestAction
  | CreatePaperSuccessAction
  | CreatePaperFailAction
  | UpdateAnswersRequestAction
  | UpdateAnswersSuccessAction
  | UpdateAnswersFailAction;
