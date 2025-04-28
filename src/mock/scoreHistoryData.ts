/**
 * 学生成绩历史数据模拟
 * 用于在折线图中展示学生的成绩趋势
 */

// 模拟学生成绩历史数据
export const scoreHistoryData = {
  // 最近6次考试的日期标签
  examDates: ['1月', '2月', '3月', '4月', '5月', '6月'],

  // 总分数据
  totalScores: [85, 82, 88, 90, 86, 92],

  // 各科目成绩数据
  subjectScores: {
    math: [90, 85, 92, 88, 91, 94], // 数学
    chinese: [85, 88, 82, 90, 86, 89], // 语文
    english: [80, 83, 85, 88, 82, 90], // 英语
    physics: [78, 82, 85, 89, 84, 91], // 物理
    chemistry: [82, 80, 86, 84, 88, 90], // 化学
  },

  // 科目名称映射
  subjectNames: {
    math: '数学',
    chinese: '语文',
    english: '英语',
    physics: '物理',
    chemistry: '化学',
  },

  // 科目颜色映射
  subjectColors: {
    math: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`, // 蓝色
    chinese: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`, // 红色
    english: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`, // 绿色
    physics: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`, // 紫色
    chemistry: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`, // 黄色
  },

  // 获取总分数据的方法
  getTotalScoreData: function () {
    return {
      labels: this.examDates,
      datasets: [
        {
          data: this.totalScores,
          color: (opacity = 1) => `rgba(2, 132, 199, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  },

  // 获取指定科目的成绩数据的方法
  getSubjectScoreData: function (subjects = ['math', 'chinese', 'english']) {
    return {
      labels: this.examDates,
      datasets: subjects.map(subject => ({
        data: this.subjectScores[subject],
        color: this.subjectColors[subject],
        strokeWidth: 2,
      })),
      legend: subjects.map(subject => this.subjectNames[subject]),
    };
  },
};
