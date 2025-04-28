/**
 * 学科弱项分析模拟数据
 * 包含知识点分析、题型分析和学习路径推荐数据
 */

// 模拟数据对象
export const mockData = {
  // 学科列表
  subjects: [
    {id: 1, name: '语文', icon: 'chinese'},
    {id: 2, name: '数学', icon: 'math'},
    {id: 3, name: '英语', icon: 'english'},
    {id: 4, name: '物理', icon: 'physics'},
    {id: 5, name: '化学', icon: 'chemistry'},
    {id: 6, name: '生物', icon: 'biology'},
    {id: 7, name: '历史', icon: 'history'},
    {id: 8, name: '地理', icon: 'geography'},
    {id: 9, name: '政治', icon: 'politics'},
  ],

  // 知识点分析数据
  knowledgePoints: [
    {
      id: 1,
      subject: '数学',
      title: '函数与导数',
      score: 75,
      maxScore: 100,
      recommendations:
        '建议复习函数的极值和导数的几何意义，多做相关例题加深理解。',
    },
    {
      id: 2,
      subject: '数学',
      title: '三角函数',
      score: 60,
      maxScore: 100,
      recommendations: '重点关注三角函数的图像和性质，以及三角恒等变换的应用。',
    },
    {
      id: 3,
      subject: '数学',
      title: '概率统计',
      score: 45,
      maxScore: 100,
      recommendations:
        '需要加强对概率分布和统计推断的理解，建议多做实际应用题。',
    },
    {
      id: 4,
      subject: '数学',
      title: '立体几何',
      score: 85,
      maxScore: 100,
      recommendations:
        '空间想象能力较好，可以尝试更复杂的立体几何问题来提升能力。',
    },
    {
      id: 5,
      subject: '物理',
      title: '力学',
      score: 70,
      maxScore: 100,
      recommendations:
        '需要加强对牛顿定律的理解和应用，特别是在复杂力学系统中的应用。',
    },
    {
      id: 6,
      subject: '物理',
      title: '电磁学',
      score: 55,
      maxScore: 100,
      recommendations: '建议重点复习电磁感应和电磁场的概念，多做相关计算题。',
    },
    {
      id: 7,
      subject: '英语',
      title: '阅读理解',
      score: 80,
      maxScore: 100,
      recommendations:
        '阅读能力较好，可以尝试阅读更多原版材料来提升词汇量和理解能力。',
    },
    {
      id: 8,
      subject: '英语',
      title: '语法与写作',
      score: 65,
      maxScore: 100,
      recommendations: '需要加强对复杂句式和时态的掌握，建议多做写作练习。',
    },
  ],

  // 题型分析数据
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
      correctRate: 75,
      wrongCount: 5,
      totalCount: 20,
    },
    {
      id: 3,
      subject: '数学',
      type: '解答题',
      correctRate: 60,
      wrongCount: 8,
      totalCount: 20,
    },
    {
      id: 4,
      subject: '物理',
      type: '选择题',
      correctRate: 80,
      wrongCount: 4,
      totalCount: 20,
    },
    {
      id: 5,
      subject: '物理',
      type: '实验题',
      correctRate: 65,
      wrongCount: 7,
      totalCount: 20,
    },
    {
      id: 6,
      subject: '英语',
      type: '阅读理解',
      correctRate: 78,
      wrongCount: 4,
      totalCount: 18,
    },
    {
      id: 7,
      subject: '英语',
      type: '完形填空',
      correctRate: 70,
      wrongCount: 6,
      totalCount: 20,
    },
    {
      id: 8,
      subject: '英语',
      type: '写作',
      correctRate: 65,
      wrongCount: 7,
      totalCount: 20,
    },
  ],

  // 学习路径推荐数据
  learningPaths: [
    {
      id: 1,
      subject: '数学',
      title: '概率统计强化训练',
      description:
        '针对概率统计的薄弱环节，提供系统化的学习路径，从基础概念到实际应用。',
      difficulty: '中等',
      resources: [
        '《概率论与数理统计》教材第3-5章',
        '概率统计专项训练题集',
        '数据分析与概率应用视频课程',
      ],
    },
    {
      id: 2,
      subject: '数学',
      title: '三角函数应用提升',
      description: '系统梳理三角函数的性质和应用，强化解题能力。',
      difficulty: '中等',
      resources: [
        '《三角函数图像与性质》专题讲解',
        '三角函数应用题集',
        '函数图像分析工具使用指南',
      ],
    },
    {
      id: 3,
      subject: '物理',
      title: '电磁学基础巩固',
      description: '从电场、磁场的基本概念出发，系统梳理电磁学知识体系。',
      difficulty: '困难',
      resources: [
        '《电磁学基础与应用》教材',
        '电磁学实验演示视频',
        '电磁学计算题专项训练',
      ],
    },
    {
      id: 4,
      subject: '英语',
      title: '语法与写作能力提升',
      description: '系统学习英语语法规则，提高写作水平和表达能力。',
      difficulty: '简单',
      resources: [
        '《英语语法精讲》课程',
        '英语写作模板与范例',
        '每日英语写作练习计划',
      ],
    },
  ],
};
