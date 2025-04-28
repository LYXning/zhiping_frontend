/**
 * 学生端学科弱项分析页面
 * 显示用户的学科弱项分析，包括历史记录数据分析、薄弱点识别和个性化学习路径推荐
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
  FlatList,
} from 'react-native';
import LineChartComponent from '../../components/specific/LineChartComponent';
import {scoreHistoryData} from '../../mock/scoreHistoryData';
import {showError} from '../../utils/toastUtils';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {STATUS_BAR_HEIGHT} from '../../utils/devicesUtils';
import Icon from '../../components/common/Icon';
import {RootState} from '../../store';
import {mockData} from '../../mock/analysisData';

// 知识点卡片组件
const KnowledgePointCard = ({title, score, maxScore, recommendations}) => {
  const percentage = Math.round((score / maxScore) * 100);
  const getColorByPercentage = percent => {
    if (percent >= 80) return '#10b981'; // 绿色 - 优秀
    if (percent >= 60) return '#0ea5e9'; // 蓝色 - 良好
    if (percent >= 40) return '#f59e0b'; // 黄色 - 中等
    return '#ef4444'; // 红色 - 需要提升
  };

  return (
    <View style={styles.knowledgePointCard}>
      <View style={styles.knowledgePointHeader}>
        <Text style={styles.knowledgePointTitle}>{title}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {score}/{maxScore}
          </Text>
          <Text
            style={[
              styles.percentageText,
              {color: getColorByPercentage(percentage)},
            ]}>
            {percentage}%
          </Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: getColorByPercentage(percentage),
              },
            ]}
          />
        </View>
      </View>
      {recommendations && (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsTitle}>学习建议：</Text>
          <Text style={styles.recommendationsText}>{recommendations}</Text>
        </View>
      )}
    </View>
  );
};

// 题型分析卡片组件
const QuestionTypeCard = ({type, correctRate, wrongCount, totalCount}) => {
  const percentage = correctRate;
  const getColorByPercentage = percent => {
    if (percent >= 80) return '#10b981'; // 绿色 - 优秀
    if (percent >= 60) return '#0ea5e9'; // 蓝色 - 良好
    if (percent >= 40) return '#f59e0b'; // 黄色 - 中等
    return '#ef4444'; // 红色 - 需要提升
  };

  return (
    <View style={styles.questionTypeCard}>
      <View style={styles.questionTypeHeader}>
        <Text style={styles.questionTypeTitle}>{type}</Text>
        <View style={styles.statsContainer}>
          <Text
            style={[
              styles.correctRateText,
              {color: getColorByPercentage(percentage)},
            ]}>
            {percentage}%
          </Text>
          <Text style={styles.countText}>
            错误: {wrongCount}/{totalCount}
          </Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${percentage}%`,
                backgroundColor: getColorByPercentage(percentage),
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

// 学习路径卡片组件
const LearningPathCard = ({title, description, difficulty, resources}) => {
  const getDifficultyColor = level => {
    switch (level) {
      case '简单':
        return '#10b981';
      case '中等':
        return '#f59e0b';
      case '困难':
        return '#ef4444';
      default:
        return '#0ea5e9';
    }
  };

  return (
    <View style={styles.learningPathCard}>
      <View style={styles.learningPathHeader}>
        <Text style={styles.learningPathTitle}>{title}</Text>
        <View
          style={[
            styles.difficultyBadge,
            {backgroundColor: getDifficultyColor(difficulty)},
          ]}>
          <Text style={styles.difficultyText}>{difficulty}</Text>
        </View>
      </View>
      <Text style={styles.learningPathDescription}>{description}</Text>
      {resources && (
        <View style={styles.resourcesContainer}>
          <Text style={styles.resourcesTitle}>推荐资源：</Text>
          {resources.map((resource, index) => (
            <TouchableOpacity key={index} style={styles.resourceItem}>
              <Icon name="book" size={16} color="#0ea5e9" />
              <Text style={styles.resourceText}>{resource}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// 学科选择按钮组件
const SubjectButton = ({label, icon, active, onPress}) => (
  <TouchableOpacity
    style={[styles.subjectButton, active && styles.activeSubjectButton]}
    onPress={onPress}>
    <Icon name={icon} size={20} color={active ? '#ffffff' : '#4b5563'} />
    <Text
      style={[
        styles.subjectButtonText,
        active && styles.activeSubjectButtonText,
      ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const WeaknessAnalysisScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // 状态管理
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('scoreHistory'); // 'knowledge', 'questionType', 'learningPath', 'scoreHistory'
  const [activeSubject, setActiveSubject] = useState('语文');
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);

  // 错误处理
  useEffect(() => {
    if (error) {
      showError('错误', error);
    }
  }, [error]);

  // 模拟获取分析数据
  const fetchAnalysisData = useCallback(() => {
    setIsLoading(true);
    // 模拟API请求延迟
    setTimeout(() => {
      setAnalysisData(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchAnalysisData();
  }, [fetchAnalysisData]);

  // 处理返回按钮点击
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 过滤当前选中学科的数据
  const filteredKnowledgePoints = analysisData
    ? analysisData.knowledgePoints.filter(
        point => point.subject === activeSubject,
      )
    : [];

  const filteredQuestionTypes = analysisData
    ? analysisData.questionTypes.filter(type => type.subject === activeSubject)
    : [];

  const filteredLearningPaths = analysisData
    ? analysisData.learningPaths.filter(path => path.subject === activeSubject)
    : [];

  // 渲染加载状态
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <LinearGradient
          colors={['#f0f9ff', '#e0eafc']}
          style={styles.background}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              {/* <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoBack}>
                <Icon name="arrow-left" size={20} color="#4b5563" />
              </TouchableOpacity> */}
              <Text style={styles.headerTitle}>学科弱项分析</Text>
              <View style={styles.headerRight} />
            </View>

            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0ea5e9" />
              <Text style={styles.loadingText}>加载分析数据中...</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient colors={['#f0f9ff', '#e0eafc']} style={styles.background}>
        <SafeAreaView style={styles.safeArea}>
          {/* 顶部导航 */}
          <View style={styles.header}>
            {/* <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Icon name="arrow-left" size={20} color="#4b5563" />
            </TouchableOpacity> */}
            <Text style={styles.headerTitle}>学科弱项分析</Text>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.subjectScrollView}>
            {/* 学科选择 */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.subjectButtonContainer}>
              {analysisData &&
                analysisData.subjects.map(subject => (
                  <SubjectButton
                    key={subject.id}
                    label={subject.name}
                    icon={subject.icon}
                    active={activeSubject === subject.name}
                    onPress={() => setActiveSubject(subject.name)}
                  />
                ))}
            </ScrollView>
          </View>

          {/* 标签页切换 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'scoreHistory' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('scoreHistory')}>
              <Icon
                name="chart"
                size={16}
                color={activeTab === 'scoreHistory' ? '#0284c7' : '#64748b'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'scoreHistory' && styles.activeTabText,
                ]}>
                成绩趋势
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'knowledge' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('knowledge')}>
              <Icon
                name="sparkles"
                size={16}
                color={activeTab === 'knowledge' ? '#0284c7' : '#64748b'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'knowledge' && styles.activeTabText,
                ]}>
                知识点分析
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'questionType' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('questionType')}>
              <Icon
                name="clipboard-list"
                size={16}
                color={activeTab === 'questionType' ? '#0284c7' : '#64748b'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'questionType' && styles.activeTabText,
                ]}>
                题型分析
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === 'learningPath' && styles.activeTabButton,
              ]}
              onPress={() => setActiveTab('learningPath')}>
              <Icon
                name="trending-up"
                size={16}
                color={activeTab === 'learningPath' ? '#0284c7' : '#64748b'}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'learningPath' && styles.activeTabText,
                ]}>
                学习路径
              </Text>
            </TouchableOpacity> */}
          </View>

          {/* 内容区域 */}
          <ScrollView style={styles.contentScrollView}>
            {activeTab === 'knowledge' && (
              <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>知识点薄弱环节分析</Text>
                <Text style={styles.sectionDescription}>
                  基于您的历史答题记录，我们分析出以下知识点需要重点关注：
                </Text>
                {filteredKnowledgePoints.length > 0 ? (
                  filteredKnowledgePoints.map(point => (
                    <KnowledgePointCard
                      key={point.id}
                      title={point.title}
                      score={point.score}
                      maxScore={point.maxScore}
                      recommendations={point.recommendations}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyText}>
                    暂无{activeSubject}学科的知识点分析数据
                  </Text>
                )}
              </View>
            )}

            {activeTab === 'questionType' && (
              <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>题型正确率分析</Text>
                <Text style={styles.sectionDescription}>
                  根据您的答题情况，以下是各题型的正确率统计：
                </Text>
                {filteredQuestionTypes.length > 0 ? (
                  filteredQuestionTypes.map(type => (
                    <QuestionTypeCard
                      key={type.id}
                      type={type.type}
                      correctRate={type.correctRate}
                      wrongCount={type.wrongCount}
                      totalCount={type.totalCount}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyText}>
                    暂无{activeSubject}学科的题型分析数据
                  </Text>
                )}
              </View>
            )}

            {activeTab === 'learningPath' && (
              <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>个性化学习路径推荐</Text>
                <Text style={styles.sectionDescription}>
                  基于您的薄弱环节，我们为您定制了以下学习路径：
                </Text>
                {filteredLearningPaths.length > 0 ? (
                  filteredLearningPaths.map(path => (
                    <LearningPathCard
                      key={path.id}
                      title={path.title}
                      description={path.description}
                      difficulty={path.difficulty}
                      resources={path.resources}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyText}>
                    暂无{activeSubject}学科的学习路径推荐
                  </Text>
                )}
              </View>
            )}

            {activeTab === 'scoreHistory' && (
              <View style={styles.contentContainer}>
                {activeSubject === '数学' && (
                  <LineChartComponent
                    title="数学成绩趋势"
                    data={scoreHistoryData.getSubjectScoreData(['math'])}
                    yAxisSuffix="分"
                    chartDescription="最近6次考试数学成绩变化"
                  />
                )}

                {activeSubject === '语文' && (
                  <LineChartComponent
                    title="语文成绩趋势"
                    data={scoreHistoryData.getSubjectScoreData(['chinese'])}
                    yAxisSuffix="分"
                    chartDescription="最近6次考试语文成绩变化"
                  />
                )}

                {activeSubject === '英语' && (
                  <LineChartComponent
                    title="英语成绩趋势"
                    data={scoreHistoryData.getSubjectScoreData(['english'])}
                    yAxisSuffix="分"
                    chartDescription="最近6次考试英语成绩变化"
                  />
                )}

                {activeSubject === '物理' && (
                  <LineChartComponent
                    title="物理成绩趋势"
                    data={scoreHistoryData.getSubjectScoreData(['physics'])}
                    yAxisSuffix="分"
                    chartDescription="最近6次考试物理成绩变化"
                  />
                )}

                {activeSubject === '化学' && (
                  <LineChartComponent
                    title="化学成绩趋势"
                    data={scoreHistoryData.getSubjectScoreData(['chemistry'])}
                    yAxisSuffix="分"
                    chartDescription="最近6次考试化学成绩变化"
                  />
                )}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 10,
    height: STATUS_BAR_HEIGHT + 50,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#075985',
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  subjectScrollView: {
    paddingHorizontal: 16,
    height: 50,
  },
  subjectButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 12,
  },
  subjectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    gap: 6,
  },
  activeSubjectButton: {
    backgroundColor: '#0ea5e9',
  },
  subjectButtonText: {
    fontSize: 14,
    color: '#4b5563',
  },
  activeSubjectButtonText: {
    color: '#ffffff',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(203, 213, 225, 0.5)',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  activeTabButton: {
    borderBottomColor: '#0284c7',
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeTabText: {
    color: '#0284c7',
    fontWeight: '500',
  },
  contentScrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  // 知识点卡片样式
  knowledgePointCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,

    marginBottom: 16,
  },
  knowledgePointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  knowledgePointTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreText: {
    fontSize: 14,
    color: '#64748b',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  recommendationsContainer: {
    marginTop: 8,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 4,
  },
  recommendationsText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  // 题型卡片样式
  questionTypeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  questionTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  correctRateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  countText: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  // 学习路径卡片样式
  learningPathCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  learningPathHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  learningPathTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  learningPathDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 12,
  },
  resourcesContainer: {
    marginTop: 8,
  },
  resourcesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 8,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  resourceText: {
    fontSize: 14,
    color: '#0ea5e9',
    textDecorationLine: 'underline',
  },
});

export default WeaknessAnalysisScreen;
