export interface QuestionTypeDTO {
    name: string;               // 题目类型名称
    sequence: number;           // 题目类型序号
    questionCount: number;      // 题目类型题目数量
    pointsPerQuestion: number;  // 题目类型分数
    totalPoints: number;        // 题目类型总分
    questions: QuestionDTO[];   // 题目类型题目列表
  }


export interface QuestionDTO {
    sequence: number;       // 问题序号
    content: string;        // 问题内容
    answer: string;         // 正确答案
    points: number;         // 问题分数
    knowledgePoints: string;// 知识点
  }