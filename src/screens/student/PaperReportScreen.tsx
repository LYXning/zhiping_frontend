/**
 * 学生端试卷报告页面
 * 显示试卷信息（科目、时间），显示成绩概览（总分、得分、正确率）
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
} from 'react-native';
import {showError} from '../../utils/toastUtils';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getGradingResult} from '../../store/actions/paperActions';
import ReportQuestionRenderer from '../../components/questions/ReportQuestionRenderer';
import {BOTTOM_SAFE_AREA_HEIGHT} from '../../utils/devicesUtils';
import Icon from '../../components/common/Icon';
import {RootState} from '@reduxjs/toolkit/query';

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

const PaperReportScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {paperId, paperName, isGrading} = route.params || {};
  const {gradePaperSuccess, gradePaperLoading} = useSelector(
    (state: RootState) => state.paper,
  );

  const dispatch = useDispatch();

  // 状态管理
  const [isloading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' 或 'details'
  const [reportData, setReportData] = useState(null);

  // 获取批改结果
  const fetchGradingResult = useCallback(() => {
    setIsLoading(true);
    dispatch(getGradingResult(paperId))
      .then(response => {
        if (response.code === 1000 && response.data) {
          // 处理批改结果数据
          setReportData(response.data);
          console.log('批改结果数据:', response.data);
        } else {
          showError('错误', response.message || '获取批改结果失败');
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('获取批改结果失败:', error);
        setIsLoading(true);
      });
  }, [dispatch, paperId]);

  // 组件挂载时获取数据
  useEffect(() => {
    setIsLoading(!gradePaperSuccess && gradePaperLoading);
    if (!isloading) {
      fetchGradingResult();
    } else {
      fetchGradingResult();
    }
  }, [fetchGradingResult, gradePaperSuccess, gradePaperLoading]);

  // 处理返回按钮点击
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 计算总分和得分
  const calculateScores = () => {
    if (!reportData || !reportData.gradingDetails) {
      return {totalScore: 0, userScore: 0, accuracy: 0};
    }

    const userScore = reportData.gradingDetails.reduce(
      (sum, detail) => sum + detail.score,
      0,
    );

    const totalScore = reportData.gradingDetails.reduce(
      (sum, detail) => sum + detail.maxScore,
      0,
    );

    // 计算正确率
    const accuracy = userScore / totalScore;

    return {totalScore, userScore, accuracy};
  };

  // 渲染加载状态
  if (isloading) {
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
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleGoBack}>
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
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  // 计算分数
  const {totalScore, userScore, accuracy} = calculateScores();
  const wrongCount = reportData?.wrongCount || 0;

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
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Icon name="arrow-left" size={20} color="#4b5563" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {paperName || '试卷报告'}
            </Text>
            <View style={styles.headerRight} />
          </View>
        </SafeAreaView>

        {/* 标签页切换 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === 'overview' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('overview')}>
            <Icon
              name="result"
              size={16}
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
              activeTab === 'details' && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab('details')}>
            <Icon
              name="list"
              size={16}
              color={activeTab === 'details' ? '#0284c7' : '#64748b'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'details' && styles.activeTabText,
              ]}>
              详细题目
            </Text>
          </TouchableOpacity>
        </View>

        {/* 内容区域 */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}>
          {activeTab === 'overview' ? (
            // 成绩概览
            <>
              {/* 分数圆环 */}
              <View style={styles.scoreOverviewContainer}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreText}>{userScore.toFixed(1)}</Text>
                  <Text style={styles.totalScoreText}>/{totalScore}</Text>
                </View>
                <View style={styles.scoreDetailsContainer}>
                  <View style={styles.scoreDetailItem}>
                    <Text style={styles.scoreDetailLabel}>总分</Text>
                    <Text style={styles.scoreDetailValue}>{totalScore}</Text>
                  </View>
                  <View style={styles.scoreDetailItem}>
                    <Text style={styles.scoreDetailLabel}>得分</Text>
                    <Text style={styles.scoreDetailValue}>
                      {userScore.toFixed(1)}
                    </Text>
                  </View>
                  <View style={styles.scoreDetailItem}>
                    <Text style={styles.scoreDetailLabel}>正确率</Text>
                    <Text style={styles.scoreDetailValue}>
                      {(accuracy * 100).toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.scoreDetailItem}>
                    <Text style={styles.scoreDetailLabel}>错题数量</Text>
                    <Text style={[styles.scoreDetailValue, styles.wrongCount]}>
                      {wrongCount}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 题型分析 */}
              <View style={styles.categoryContainer}>
                <Text style={styles.sectionTitle}>题型分析</Text>
                {reportData?.typeStatistics &&
                  Object.entries(reportData.typeStatistics).map(
                    ([type, stats]) => (
                      <View style={styles.categoryItem} key={type}>
                        <View style={styles.categoryHeader}>
                          <Text style={styles.categoryName}>{type}</Text>
                          <Text style={styles.categoryScore}>
                            {stats.totalScore.toFixed(1)}分
                          </Text>
                        </View>
                        <View style={styles.progressBarContainer}>
                          <View
                            style={[
                              styles.progressBar,
                              {width: `${stats.accuracy * 100}%`},
                            ]}
                          />
                        </View>
                        <Text style={styles.accuracyText}>
                          正确率: {(stats.accuracy * 100).toFixed(1)}%
                        </Text>
                      </View>
                    ),
                  )}
              </View>

              {/* 学习建议 */}
              {reportData?.overAllComemnt && (
                <View style={styles.tipsContainer}>
                  <Text style={styles.sectionTitle}>学习建议</Text>
                  <Text style={styles.tipsText}>
                    {reportData.overAllComemnt}
                  </Text>
                </View>
              )}
            </>
          ) : (
            // 详细题目
            <View style={styles.questionsContainer}>
              <Text style={styles.sectionTitle}>题目详情</Text>
              {reportData?.gradingDetails &&
                reportData.gradingDetails.map((detail, index) => (
                  <ReportQuestionRenderer
                    key={detail.questionId}
                    detail={detail}
                    index={index}
                  />
                ))}
            </View>
          )}

          {/* 底部间距 */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
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
    paddingTop: STATUS_BAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
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
    marginTop: 118,
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
  wrongCount: {
    color: '#ff1a1c',
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
  tipsContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  tipsText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 22,
  },
  bottomSpacer: {
    height: BOTTOM_SAFE_AREA_HEIGHT,
  },
});

export default PaperReportScreen;
