// 学科弱项分析相关类型定义

// 知识点类型
export interface KnowledgePoint {
  id: number;
  subject: string;
  title: string;
  score: number;
  maxScore: number;
  recommendations?: string;
}

// 题型分析类型
export interface QuestionTypeAnalysis {
  id: number;
  subject: string;
  type: string;
  correctRate: number;
  wrongCount: number;
  totalCount: number;
}

// 学习路径类型
export interface LearningPath {
  id: number;
  subject: string;
  title: string;
  description: string;
  difficulty: string;
  resources?: string[];
}

// 学科类型
export interface Subject {
  id: number;
  name: string;
  icon: string;
}

// 分析数据类型
export interface AnalysisData {
  subjects: Subject[];
  knowledgePoints: KnowledgePoint[];
  questionTypes: QuestionTypeAnalysis[];
  learningPaths: LearningPath[];
}

// 分析状态类型
export interface AnalysisState {
  analysisData: AnalysisData | null;
  loading: boolean;
  error: any;
}

// 分析操作类型
export enum AnalysisActionTypes {
  FETCH_ANALYSIS_REQUEST = 'FETCH_ANALYSIS_REQUEST',
  FETCH_ANALYSIS_SUCCESS = 'FETCH_ANALYSIS_SUCCESS',
  FETCH_ANALYSIS_FAIL = 'FETCH_ANALYSIS_FAIL',
}
