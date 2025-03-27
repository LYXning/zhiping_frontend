import {QuestionTypeDTO} from './question';

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  draftSaved: boolean;
}

export interface Task {
  id?: number; // 任务ID
  name: string; // 任务名称
  type: number; // 任务类型 1-试卷批改，2-作业批改
  subjectId: number; // 任务科目
  deadline: string; // 任务截止时间
  reminder: boolean; // 任务提醒
  aiAutoGrade: boolean; // AI自动批改
  teacherReview: boolean; // 教师批改
  publishGradeImmediately: boolean; // 立即发布成绩
  priority: number; // 任务优先级
  taskNotification: boolean; // 任务通知
  deadlineNotification: boolean; // 截止时间通知
  gradeNotification: boolean; // 成绩通知
  classIds: number[]; // 任务班级
  questionTypes: QuestionTypeDTO[]; // 任务题目类型
  status: number; // 任务状态  0-草稿，1-已发布，2-未批改，3-已完成，4-已取消
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
  images?: string[]; // 任务图片
}

// 任务Action类型
export enum TaskActionTypes {
  // 获取任务列表
  FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST',
  FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS',
  FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE',

  // 获取单个任务
  FETCH_TASK_REQUEST = 'FETCH_TASK_REQUEST',
  FETCH_TASK_SUCCESS = 'FETCH_TASK_SUCCESS',
  FETCH_TASK_FAILURE = 'FETCH_TASK_FAILURE',

  // 创建任务
  CREATE_TASK_REQUEST = 'CREATE_TASK_REQUEST',
  CREATE_TASK_SUCCESS = 'CREATE_TASK_SUCCESS',
  CREATE_TASK_FAILURE = 'CREATE_TASK_FAILURE',

  // 更新任务
  UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST',
  UPDATE_TASK_SUCCESS = 'UPDATE_TASK_SUCCESS',
  UPDATE_TASK_FAILURE = 'UPDATE_TASK_FAILURE',

  // 删除任务
  DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST',
  DELETE_TASK_SUCCESS = 'DELETE_TASK_SUCCESS',
  DELETE_TASK_FAILURE = 'DELETE_TASK_FAILURE',

  // 保存草稿
  SAVE_DRAFT_REQUEST = 'SAVE_DRAFT_REQUEST',
  SAVE_DRAFT_SUCCESS = 'SAVE_DRAFT_SUCCESS',
  SAVE_DRAFT_FAILURE = 'SAVE_DRAFT_FAILURE',

  // 发布任务
  PUBLISH_TASK_REQUEST = 'PUBLISH_TASK_REQUEST',
  PUBLISH_TASK_SUCCESS = 'PUBLISH_TASK_SUCCESS',
  PUBLISH_TASK_FAILURE = 'PUBLISH_TASK_FAILURE',

  // 上传图片
  UPLOAD_IMAGE_REQUEST = 'UPLOAD_IMAGE_REQUEST',
  UPLOAD_IMAGE_SUCCESS = 'UPLOAD_IMAGE_SUCCESS',
  UPLOAD_IMAGE_FAILURE = 'UPLOAD_IMAGE_FAILURE',

  // 清除错误
  CLEAR_TASK_ERRORS = 'CLEAR_TASK_ERRORS',

  // 重置状态
  RESET_TASK_STATE = 'RESET_TASK_STATE',
}

// 任务Action接口
export interface FetchTasksAction {
  type:
    | TaskActionTypes.FETCH_TASKS_REQUEST
    | TaskActionTypes.FETCH_TASKS_SUCCESS
    | TaskActionTypes.FETCH_TASKS_FAILURE;
  payload?: any;
}

export interface FetchTaskAction {
  type:
    | TaskActionTypes.FETCH_TASK_REQUEST
    | TaskActionTypes.FETCH_TASK_SUCCESS
    | TaskActionTypes.FETCH_TASK_FAILURE;
  payload?: any;
}

export interface CreateTaskAction {
  type:
    | TaskActionTypes.CREATE_TASK_REQUEST
    | TaskActionTypes.CREATE_TASK_SUCCESS
    | TaskActionTypes.CREATE_TASK_FAILURE;
  payload?: any;
}

export interface UpdateTaskAction {
  type:
    | TaskActionTypes.UPDATE_TASK_REQUEST
    | TaskActionTypes.UPDATE_TASK_SUCCESS
    | TaskActionTypes.UPDATE_TASK_FAILURE;
  payload?: any;
}

export interface DeleteTaskAction {
  type:
    | TaskActionTypes.DELETE_TASK_REQUEST
    | TaskActionTypes.DELETE_TASK_SUCCESS
    | TaskActionTypes.DELETE_TASK_FAILURE;
  payload?: any;
}

export interface SaveDraftAction {
  type:
    | TaskActionTypes.SAVE_DRAFT_REQUEST
    | TaskActionTypes.SAVE_DRAFT_SUCCESS
    | TaskActionTypes.SAVE_DRAFT_FAILURE;
  payload?: any;
}

export interface PublishTaskAction {
  type:
    | TaskActionTypes.PUBLISH_TASK_REQUEST
    | TaskActionTypes.PUBLISH_TASK_SUCCESS
    | TaskActionTypes.PUBLISH_TASK_FAILURE;
  payload?: any;
}

export interface UploadImageAction {
  type:
    | TaskActionTypes.UPLOAD_IMAGE_REQUEST
    | TaskActionTypes.UPLOAD_IMAGE_SUCCESS
    | TaskActionTypes.UPLOAD_IMAGE_FAILURE;
  payload?: any;
}

export interface ClearTaskErrorsAction {
  type: TaskActionTypes.CLEAR_TASK_ERRORS;
}

export interface ResetTaskStateAction {
  type: TaskActionTypes.RESET_TASK_STATE;
}

// 任务Action类型联合
export type TaskAction =
  | FetchTasksAction
  | FetchTaskAction
  | CreateTaskAction
  | UpdateTaskAction
  | DeleteTaskAction
  | SaveDraftAction
  | PublishTaskAction
  | UploadImageAction
  | ClearTaskErrorsAction
  | ResetTaskStateAction;
