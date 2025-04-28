import {Dispatch} from 'redux';
import {AnalysisActionTypes} from '../types/analysis';
import {getToken} from './authActions';
import axios from 'axios';
import {getApiUrl, API_PATHS} from '../../config/apiConfig';

// 模拟数据 - 实际应用中应从API获取
const mockAnalysisData = {
  subjects: [
    {id: 1, name: '数学', icon: '数学'},
    {id: 2, name: '语文', icon: '语文'},
    {id: 3, name: '英语', icon: '英语'},
    {id: 4, name: '物理', icon: '物理'},
    {id: 5, name: '化学', icon: '化学'},
  ],
  knowledgePoints: [
    {
      id: 1,
      subject: '数学',
      title: '函数与导数',
      score: 75,
      maxScore: 100,
      recommendations: '建议复习函数的极限与连续性，加强导数应用题的练习。',
    },
    {
      id: 2,
      subject: '数学',
      title: '三角函数',
      score: 45,
      maxScore: 100,
      recommendations: '重点复习三角函数的图像和性质，多做三角恒等变换练习。',
    },
    {
      id: 3,
      subject: '数学',
      title: '概率统计',
      score: 85,
      maxScore: 100,
      recommendations: '可以进一步学习更复杂的概率分布和统计推断方法。',
    },
    {
      id: 4,
      subject: '语文',
      title: '现代文阅读',
      score: 80,
      maxScore: 100,
      recommendations: '继续提高分析能力，注重文章结构和写作手法的理解。',
    },
    {
      id: 5,
      subject: '语文',
      title: '古诗文鉴赏',
      score: 60,
      maxScore: 100,
      recommendations: '加强对古代文化背景的了解，提高对诗词意象的理解能力。',
    },
  ],
  questionTypes: [
    {
      id: 1,
      subject: '数学',
      type: '选择题',
      correctRate: 85,
      wrongCount: 3,
      totalCount: 20,
    },
    {
      id: 2,
      subject: '数学',
      type: '填空题',
      correctRate: 70,
      wrongCount: 6,
      totalCount: 20,
    },
    {
      id: 3,
      subject: '数学',
      type: '解答题',
      correctRate: 55,
      wrongCount: 9,
      totalCount: 20,
    },
    {
      id: 4,
      subject: '语文',
      type: '阅读理解',
      correctRate: 75,
      wrongCount: 5,
      totalCount: 20,
    },
    {
      id: 5,
      subject: '语文',
      type: '作文',
      correctRate: 80,
      wrongCount: 4,
      totalCount: 20,
    },
  ],
  learningPaths: [
    {
      id: 1,
      subject: '数学',
      title: '函数与导数强化训练',
      description: '针对函数与导数的薄弱环节，提供系统化的学习路径和练习。',
      difficulty: '中等',
      resources: ['高等数学基础教程', '导数应用专项训练', '函数图像分析指南'],
    },
    {
      id: 2,
      subject: '数学',
      title: '三角函数专项突破',
      description: '从基础到进阶，全面提升三角函数的理解和应用能力。',
      difficulty: '困难',
      resources: ['三角函数图像与性质', '三角恒等变换精讲', '三角函数应用题集'],
    },
    {
      id: 3,
      subject: '语文',
      title: '古诗文鉴赏能力提升',
      description: '通过系统学习古代文化背景和文学常识，提高古诗文鉴赏能力。',
      difficulty: '中等',
      resources: ['古代文化通识', '古诗词鉴赏方法', '名篇精读100首'],
    },
  ],
};

// 获取学科弱项分析数据
export const fetchAnalysisData = () => async (dispatch: Dispatch) => {
  try {
    dispatch({type: AnalysisActionTypes.FETCH_ANALYSIS_REQUEST});

    // 在实际应用中，这里应该是一个API请求
    // const response = await axios.get(getApiUrl(API_PATHS.analysis.getAnalysis), {
    //   headers: {
    //     Accept: 'application/json',
    //     Authorization: 'Bearer ' + (await getToken()),
    //   },
    // });
    // const data = response.data;

    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 使用模拟数据
    dispatch({
      type: AnalysisActionTypes.FETCH_ANALYSIS_SUCCESS,
      payload: mockAnalysisData,
    });

    return Promise.resolve({code: 1000, data: mockAnalysisData});
  } catch (error) {
    console.error('获取学科弱项分析数据失败:', error);

    dispatch({
      type: AnalysisActionTypes.FETCH_ANALYSIS_FAIL,
      payload: error.message || '获取学科弱项分析数据失败',
    });

    return Promise.reject(error);
  }
};
