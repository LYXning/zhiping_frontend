/**
 * 学生端试卷报告查看组件
 * 用于学生查看试卷分析结果和详细报告
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {STATUS_BAR_HEIGHT} from '../../utils/devicesUtils';
import {
  checkCircleIcon,
  leftIcon,
  chartIcon,
  documentIcon,
} from '../../assets/icons';
import {getPaperInfo} from '../../store/actions/paperActions';
import {getSubjectNameById} from '../../utils/subjectUtils';

// 图标组件
const Icon = ({name, size = 24, color = '#000'}) => {
  // 根据图标名称返回对应的图标组件
  const getIconSource = iconName => {
    switch (iconName) {
      case 'arrow-left':
        return leftIcon;
      case 'check-circle':
        return checkCircleIcon;
      case 'chart':
        return chartIcon;
      case 'document':
        return documentIcon;
      default:
        return leftIcon;
    }
  };
  return (
    <Image
      source={getIconSource(name)}
      style={{width: size, height: size, tintColor: color}}
    />
  );
};

const PaperReportScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {paperId, paperName} = route.params || {};
  const dispatch = useDispatch();

  // 状态管理
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'questions'

  // 从Redux获取loading和success状态
  const {loading: reduxLoading, success: reduxSuccess} = useSelector(
    (state: RootState) => state.paper,
  );

  // 获取报告数据
  const fetchReportData = useCallback(() => {
    setLoading(true);

    try {
      // 调用API获取试卷报告数据
      dispatch(getPaperInfo(paperId))
        .then(result => {
          if (result.data) {
            console.log('API返回的报告数据:', result.data);

            // 将API返回的数据转换为报告格式
            const reportData = {
              id: result.data.id || paperId,
              paperId: paperId,
              paperName: result.data.name || paperName,
              subject: getSubjectNameById(result.data.subject) || '未知科目',
              grade: result.data.gradeName || '未知年级',
              totalScore: result.data.totalScore || 100,
              userScore: result.data.userScore || 85,
              accuracy: result.data.accuracy || 0.85,
              completionTime:
                result.data.completionTime || new Date().toLocaleString(),
              analysisTime:
                result.data.analysisTime || new Date().toLocaleString(),
              questionStats: {
                total: result.data.questionDetails?.length || 0,
                correct: result.data.correctCount || 0,
                incorrect: result.data.incorrectCount || 0,
                partialCorrect: result.data.partialCorrectCount || 0,
              },
              categoryAnalysis: result.data.categoryAnalysis || [
                {
                  category: '基础知识',
                  score: 30,
                  totalScore: 30,
                  accuracy: 1.0,
                },
                {
                  category: '计算能力',
                  score: 25,
                  totalScore: 30,
                  accuracy: 0.83,
                },
                {
                  category: '应用能力',
                  score: 20,
                  totalScore: 30,
                  accuracy: 0.67,
                },
                {
                  category: '解决问题',
                  score: 10,
                  totalScore: 10,
                  accuracy: 1.0,
                },
              ],
              questions: result.data.questionDetails || [],
            };

            setReportData(reportData);
          } else {
            // 如果没有数据，使用模拟数据
            const mockData = {
              id: '1',
              paperId: paperId || '1',
              paperName: paperName || '期中数学试卷',
              subject: '数学',
              grade: '高二(3)班',
              totalScore: 100,
              userScore: 85,
              accuracy: 0.85,
              completionTime: '2023-04-01 14:30:00',
              analysisTime: '2023-04-01 14:35:00',
              questionStats: {
                total: 10,
                correct: 7,
                incorrect: 2,
                partialCorrect: 1,
              },
              categoryAnalysis: [
                {
                  category: '基础知识',
                  score: 30,
                  totalScore: 30,
                  accuracy: 1.0,
                },
                {
                  category: '计算能力',
                  score: 25,
                  totalScore: 30,
                  accuracy: 0.83,
                },
                {
                  category: '应用能力',
                  score: 20,
                  totalScore: 30,
                  accuracy: 0.67,
                },
                {
                  category: '解决问题',
                  score: 10,
                  totalScore: 10,
                  accuracy: 1.0,
                },
              ],
              questions: [
                {
                  id: 1,
                  type: 'choice',
                  content: '下列哪个选项是正确的三角函数公式？',
                  userAnswer: 'B',
                  correctAnswer: 'B',
                  score: 5,
                  userScore: 5,
                  analysis: 'sin²θ + cos²θ = 1 是基本三角恒等式',
                },
                {
                  id: 2,
                  type: 'fill',
                  content:
                    '已知函数f(x)=sin(x)+cos(x)，则f(π/4)的值为_______。',
                  userAnswer: '√2',
                  correctAnswer: '√2',
                  score: 5,
                  userScore: 5,
                  analysis: 'f(π/4) = sin(π/4) + cos(π/4) = 1/√2 + 1/√2 = √2',
                },
                {
                  id: 3,
                  type: 'essay',
                  content: '证明：对于任意角θ，sin²θ + cos²θ = 1恒成立。',
                  userAnswer:
                    '根据勾股定理，在单位圆中，点(cosθ, sinθ)到原点的距离为1，所以sin²θ + cos²θ = 1。',
                  correctAnswer: '略',
                  score: 10,
                  userScore: 8,
                  analysis:
                    '证明可以从单位圆的定义出发，也可以使用复数的模等方法',
                },
              ],
            };

            setReportData(mockData);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('加载报告数据失败:', err);
          setLoading(false);
          Alert.alert('错误', '加载报告数据失败，请重试');

          // 加载失败时使用模拟数据
          const mockData = {
            id: '1',
            paperId: paperId || '1',
            paperName: paperName || '期中数学试卷',
            subject: '数学',
            grade: '高二(3)班',
            totalScore: 100,
            userScore: 85,
            accuracy: 0.85,
            completionTime: '2023-04-01 14:30:00',
            analysisTime: '2023-04-01 14:35:00',
            questionStats: {
              total: 10,
              correct: 7,
              incorrect: 2,
              partialCorrect: 1,
            },
            categoryAnalysis: [
              {category: '基础知识', score: 30, totalScore: 30, accuracy: 1.0},
              {category: '计算能力', score: 25, totalScore: 30, accuracy: 0.83},
              {category: '应用能力', score: 20, totalScore: 30, accuracy: 0.67},
              {category: '解决问题', score: 10, totalScore: 10, accuracy: 1.0},
            ],
            questions: [
              {
                id: 1,
                type: 'choice',
                content: '下列哪个选项是正确的三角函数公式？',
                userAnswer: 'B',
                correctAnswer: 'B',
                score: 5,
                userScore: 5,
                analysis: 'sin²θ + cos²θ = 1 是基本三角恒等式',
              },
              {
                id: 2,
                type: 'fill',
                content: '已知函数f(x)=sin(x)+cos(x)，则f(π/4)的值为_______。',
                userAnswer: '√2',
                correctAnswer: '√2',
                score: 5,
                userScore: 5,
                analysis: 'f(π/4) = sin(π/4) + cos(π/4) = 1/√2 + 1/√2 = √2',
              },
              {
                id: 3,
                type: 'essay',
                content: '证明：对于任意角θ，sin²θ + cos²θ = 1恒成立。',
                userAnswer:
                  '根据勾股定理，在单位圆中，点(cosθ, sinθ)到原点的距离为1，所以sin²θ + cos²θ = 1。',
                correctAnswer: '略',
                score: 10,
                userScore: 8,
                analysis:
                  '证明可以从单位圆的定义出发，也可以使用复数的模等方法',
              },
            ],
          };

          setReportData(mockData);
        });
    } catch (err) {
      console.error('加载报告数据失败:', err);
      setLoading(false);
      Alert.alert('错误', '加载报告数据失败，请重试');
    }
  }, [dispatch, paperId, paperName]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // 处理返回按钮点击
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 渲染分数概览
  const renderScoreOverview = () => {
    if (!reportData) return null;

    return (
      <View style={styles.scoreOverviewContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{reportData.userScore}</Text>
          <Text style={styles.totalScoreText}>/{reportData.totalScore}</Text>
        </View>

        <View style={styles.scoreDetailsContainer}>
          <View style={styles.scoreDetailItem}>
            <Text style={styles.scoreDetailLabel}>正确率</Text>
            <Text style={styles.scoreDetailValue}>
              {Math.round(reportData.accuracy * 100)}%
            </Text>
          </View>

          <View style={styles.scoreDetailItem}>
            <Text style={styles.scoreDetailLabel}>题目总数</Text>
            <Text style={styles.scoreDetailValue}>
              {reportData.questionStats.total}
            </Text>
          </View>

          <View style={styles.scoreDetailItem}>
            <Text style={styles.scoreDetailLabel}>正确题数</Text>
            <Text style={styles.scoreDetailValue}>
              {reportData.questionStats.correct}
            </Text>
          </View>

          <View style={styles.scoreDetailItem}>
            <Text style={styles.scoreDetailLabel}>错误题数</Text>
            <Text style={styles.scoreDetailValue}>
              {reportData.questionStats.incorrect}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // 渲染分类分析
  const renderCategoryAnalysis = () => {
    if (!reportData || !reportData.categoryAnalysis) return null;

    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>知识点分析</Text>

        {reportData.categoryAnalysis.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryName}>{category.category}</Text>
              <Text style={styles.categoryScore}>
                {category.score}/{category.totalScore}
              </Text>
            </View>

            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {width: `${(category.score / category.totalScore) * 100}%`},
                ]}
              />
            </View>

            <Text style={styles.accuracyText}>
              正确率: {Math.round(category.accuracy * 100)}%
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // 渲染题目列表
  const renderQuestionList = () => {
    if (!reportData || !reportData.questions) return null;

    return (
      <View style={styles.questionsContainer}>
        <Text style={styles.sectionTitle}>题目详情</Text>

        {reportData.questions.map((question, index) => (
          <View key={index} style={styles.questionItem}>
            <View style={styles.questionHeader}>
              <View style={styles.questionNumberContainer}>
                <Text style={styles.questionNumber}>{index + 1}</Text>
              </View>
              <Text style={styles.questionType}>
                {question.questionTypeId === 1
                  ? '选择题'
                  : question.questionTypeId === 2
                  ? '填空题'
                  : '简答题'}
              </Text>
              <View style={styles.questionScore}>
                <Text style={styles.questionScoreText}>
                  {question.userScore}/{question.score}
                </Text>
              </View>
            </View>

            <Text style={styles.questionContent}>{question.content}</Text>

            {/* 选择题选项渲染 */}
            {question.questionTypeId === 1 && question.options && (
              <View style={styles.optionsContainer}>
                {Array.isArray(question.options)
                  ? // 处理数组格式的选项
                    question.options.map((option, optIndex) => (
                      <View key={optIndex} style={styles.optionItem}>
                        <Text style={styles.optionLabel}>
                          {String.fromCharCode(65 + optIndex)}
                        </Text>
                        <Text style={styles.optionText}>{option}</Text>
                        {question.userAnswer ===
                          String.fromCharCode(65 + optIndex) && (
                          <View style={styles.checkIconContainer}>
                            <Icon
                              name="check-circle"
                              size={16}
                              color="#0284c7"
                            />
                          </View>
                        )}
                      </View>
                    ))
                  : // 处理对象格式的选项 { A: '选项内容', B: '选项内容' }
                    Object.entries(question.options).map(
                      ([key, value], optIndex) => (
                        <View key={optIndex} style={styles.optionItem}>
                          <Text style={styles.optionLabel}>{key}</Text>
                          <Text style={styles.optionText}>{value}</Text>
                          {question.userAnswer === key && (
                            <View style={styles.checkIconContainer}>
                              <Icon
                                name="check-circle"
                                size={16}
                                color="#0284c7"
                              />
                            </View>
                          )}
                        </View>
                      ),
                    )}
              </View>
            )}

            <View style={styles.answerContainer}>
              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>你的答案:</Text>
                <Text style={styles.userAnswer}>{question.userAnswer}</Text>
              </View>

              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>正确答案:</Text>
                <Text style={styles.correctAnswer}>
                  {question.correctAnswer}
                </Text>
              </View>
            </View>

            <View style={styles.analysisContainer}>
              <Text style={styles.analysisLabel}>解析:</Text>
              <Text style={styles.analysisContent}>{question.analysis}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#f0f9ff', '#e0eafc']}
          style={styles.background}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Icon name="arrow-left" size={20} color="#4b5563" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {paperName || '试卷报告'}
            </Text>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text style={styles.loadingText}>加载报告中...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f0f9ff', '#e0eafc']} style={styles.background}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Icon name="arrow-left" size={20} color="#4b5563" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {reportData?.paperName || '试卷报告'}
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* 试卷信息 */}
        <View style={styles.paperInfoContainer}>
          <Text style={styles.paperSubject}>{reportData?.subject}</Text>
          <Text style={styles.paperGrade}>{reportData?.grade}</Text>
          <Text style={styles.paperTime}>
            完成时间: {reportData?.completionTime}
          </Text>
        </View>

        {/* 标签页切换 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'overview' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('overview')}>
            <Icon
              name="chart"
              size={18}
              color={activeTab === 'overview' ? '#0284c7' : '#64748b'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'overview' && styles.activeTabText,
              ]}>
              成绩概览
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'questions' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('questions')}>
            <Icon
              name="document"
              size={18}
              color={activeTab === 'questions' ? '#0284c7' : '#64748b'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'questions' && styles.activeTabText,
              ]}>
              题目详情
            </Text>
          </TouchableOpacity>
        </View>

        {/* 内容区域 */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}>
          {activeTab === 'overview' ? (
            <>
              {renderScoreOverview()}
              {renderCategoryAnalysis()}
            </>
          ) : (
            renderQuestionList()
          )}

          {/* 底部间距 */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 0 : STATUS_BAR_HEIGHT,
    paddingHorizontal: 16,
    height: Platform.OS === 'ios' ? 44 : 56,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 36,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  paperInfoContainer: {
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  paperSubject: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  paperGrade: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  paperTime: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#0284c7',
  },
  scrollView: {
    flex: 1,
    marginTop: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  scoreOverviewContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalScoreText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  scoreDetailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  scoreDetailItem: {
    width: '48%',
    backgroundColor: 'rgba(2, 132, 199, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  scoreDetailLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  scoreDetailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0284c7',
    marginTop: 4,
  },
  categoryContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  categoryScore: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0284c7',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0284c7',
    borderRadius: 4,
  },
  accuracyText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
  questionsContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  questionItem: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
    paddingBottom: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  questionType: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  questionScore: {
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  questionScoreText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0284c7',
  },
  questionContent: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 12,
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    padding: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginRight: 12,
    width: 20,
  },
  optionText: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  checkIconContainer: {
    marginLeft: 8,
  },
  answerContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  answerRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    width: 70,
  },
  userAnswer: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  correctAnswer: {
    fontSize: 14,
    color: '#0284c7',
    fontWeight: '500',
    flex: 1,
  },
  analysisContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    padding: 12,
  },
  analysisLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
  },
  analysisContent: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default PaperReportScreen;
