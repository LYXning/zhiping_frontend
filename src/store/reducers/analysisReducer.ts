import {AnalysisActionTypes, AnalysisState} from '../types/analysis';

// 初始状态
const initialState: AnalysisState = {
  analysisData: null,
  loading: false,
  error: null,
};

// 分析reducer
export const analysisReducer = (state = initialState, action) => {
  switch (action.type) {
    // 获取分析数据请求
    case AnalysisActionTypes.FETCH_ANALYSIS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    // 获取分析数据成功
    case AnalysisActionTypes.FETCH_ANALYSIS_SUCCESS:
      return {
        ...state,
        loading: false,
        analysisData: action.payload,
      };
    // 获取分析数据失败
    case AnalysisActionTypes.FETCH_ANALYSIS_FAIL:
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
