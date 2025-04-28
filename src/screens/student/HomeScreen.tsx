/**
 * 教师端首页组件
 * 显示教师首页界面，包含快捷功能、待处理任务和最近分析等模块
 */

import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import {STATUS_BAR_HEIGHT} from '../../utils/devicesUtils';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {AnalysisCard} from '../../components/specific/AnalysisCard';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store';
import {TaskCard} from '../../components/specific/TaskCard';
import {
  fetchRecentPapers,
  fetchAllGradingResults,
} from '../../store/actions/paperActions';
import Icon from '../../components/common/Icon';
import {getSubjectEnglishNameById} from '../../utils/subjectUtils';
import {dateUtils} from '../../utils/dateUtils';
import LineChartComponent from '../../components/specific/LineChartComponent';
import {scoreHistoryData} from '../../mock/scoreHistoryData';

// 快捷功能项组件
const QuickActionItem = ({icon, color, bgColor, label, onPress}) => (
  <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
    <View style={[styles.quickActionIconContainer, {backgroundColor: bgColor}]}>
      <Icon name={icon} size={24} color={color} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // 从Redux获取最近试卷数据和所有评分结果
  const {
    recentPapers = [],
    recentPapersLoading = false,
    recentPapersError = null,
    allGradingResults = [],
    allGradingResultsLoading = false,
    allGradingResultsError = null,
  } = useSelector((state: RootState) => state.paper);

  // 使用useFocusEffect替代useEffect，确保每次页面获得焦点时都刷新数据
  useFocusEffect(
    React.useCallback(() => {
      console.log('HomeScreen获得焦点，刷新数据');
      dispatch(fetchRecentPapers());
      dispatch(fetchAllGradingResults());

      return () => {
        // 可选的清理函数
        console.log('HomeScreen失去焦点');
      };
    }, [dispatch]),
  );

  // 保留原来的useEffect作为初始加载
  useEffect(() => {
    console.log('HomeScreen初始加载');
    dispatch(fetchRecentPapers());
    dispatch(fetchAllGradingResults());
  }, [dispatch]);

  // 处理扫描试卷点击
  const handleScanPress = () => {
    // 修改为通过Student导航器访问CreatePaper
    navigation.navigate('Student', {
      screen: 'CreatePaper',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f0f9ff', '#e0eafc']} style={styles.background}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <Icon name="zap" size={20} color="#0284c7" />
            <Text style={styles.headerTitle}>智评</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="bell" size={20} color="#4b5563" />
            </TouchableOpacity>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{user.name[0]}</Text>
            </View>
          </View>
        </View>

        {/* 搜索框 */}
        {/* <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={16}
            color="#9ca3af"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索试卷、知识点或资源..."
            placeholderTextColor="#9ca3af"
          />
        </View> */}

        <ScrollView style={styles.scrollView}>
          {/* 快捷功能 */}
          <View style={styles.quickActions}>
            <QuickActionItem
              icon="scan"
              color="#dc2626"
              bgColor="#fee2e2"
              label="扫描试卷"
              onPress={handleScanPress}
            />
            <QuickActionItem
              icon="clipboard-check"
              color="#16a34a"
              bgColor="#dcfce7"
              label="批改作业"
              onPress={() => console.log('批改作业')}
            />
            <QuickActionItem
              icon="chart"
              color="#7c3aed"
              bgColor="#f3e8ff"
              label="数据分析"
              onPress={
                () => {}
                // navigation.navigate('Student', {
                //   screen: 'WeaknessAnalysis',
                // })
              }
            />
            <QuickActionItem
              icon="book"
              color="#ca8a04"
              bgColor="#fef3c7"
              label="学习资源"
              onPress={() => console.log('学习资源')}
            />
          </View>

          {/* 最近试卷 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>最近试卷</Text>
              {/* <TouchableOpacity>
                <Text style={styles.sectionAction}>查看全部</Text>
              </TouchableOpacity> */}
            </View>

            <View style={styles.taskList}>
              {recentPapersLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0ea5e9" />
                  <Text style={styles.loadingText}>加载试卷中...</Text>
                </View>
              ) : recentPapersError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    加载试卷失败: {recentPapersError.toString()}
                  </Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(fetchRecentPapers())}>
                    <Text style={styles.retryText}>重试</Text>
                  </TouchableOpacity>
                </View>
              ) : recentPapers.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>暂无试卷</Text>
                </View>
              ) : (
                recentPapers.map(paper => (
                  <TaskCard
                    key={paper.id}
                    id={paper.id}
                    icon={getSubjectEnglishNameById(
                      paper.subjectId,
                    ).toLocaleLowerCase()}
                    title={paper.title}
                    subtitle={'创建时间：' + paper.createdAt}
                    status={paper.status}
                    deadline={
                      '创建时间：' + dateUtils.defaultFormat(paper.createdAt)
                    }
                    onPress={() => {
                      // 根据试卷状态导航到不同页面
                      if (paper.status === 3) {
                        // 待批改
                        navigation.navigate('Student', {
                          screen: 'PaperReview',
                          params: {
                            paperId: paper.id,
                            paperName: paper.title,
                          },
                        });
                      } else {
                        // 其他状态
                        navigation.navigate('Student', {
                          screen: 'PaperResult',
                          params: {
                            paperId: paper.id,
                            paperName: paper.title,
                          },
                        });
                      }
                    }}
                  />
                ))
              )}
            </View>
          </View>

          {/* 最近分析 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>最近分析</Text>
              {/* <TouchableOpacity>
                <Text style={styles.sectionAction}>查看全部</Text>
              </TouchableOpacity> */}
            </View>

            {allGradingResultsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text style={styles.loadingText}>加载分析结果中...</Text>
              </View>
            ) : allGradingResultsError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  加载分析结果失败: {allGradingResultsError.toString()}
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => dispatch(fetchAllGradingResults())}>
                  <Text style={styles.retryText}>重试</Text>
                </TouchableOpacity>
              </View>
            ) : allGradingResults.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无分析结果</Text>
              </View>
            ) : (
              // 使用水平滚动视图替换原来的View
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.analysisScrollViewContent}>
                {allGradingResults.map((result, index) => (
                  <AnalysisCard
                    key={index}
                    title={result.taskName || '未命名试卷'}
                    averageScore={result.totalScore || 0}
                    fullScore={result.totalPossibleScore || 0}
                    correctRate={result.scoreRate || 0}
                    correctNumber={result.correntCount || 0}
                    wrongNumber={result.wrongCount || 0}
                    subject={
                      (result.subjectId &&
                        getSubjectEnglishNameById(
                          result.subjectId,
                        ).toLowerCase()) ||
                      'unknown'
                    }
                    onPress={() => {
                      navigation.navigate('Student', {
                        screen: 'PaperReport',
                        params: {
                          paperId: result.taskId,
                          paperName: result.taskName,
                        },
                      });
                    }}
                  />
                ))}
              </ScrollView>
            )}
          </View>
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
  // 加载状态样式
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#4b5563',
  },
  // 错误状态样式
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(254, 226, 226, 0.5)',
    borderRadius: 12,
  },
  errorText: {
    marginBottom: 10,
    fontSize: 14,
    color: '#dc2626',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0ea5e9',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  // 空数据状态样式
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075985',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0369a1',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
    padding: 0,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickActionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  quickActionLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  sectionAction: {
    fontSize: 12,
    color: '#0284c7',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  chartContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  taskList: {
    gap: 12,
  },
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  taskCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  taskCardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  taskCardStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskCardStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  taskCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskCardDeadline: {
    fontSize: 12,
    color: '#6b7280',
  },
  taskCardButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  taskCardButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  analysisList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analysisScrollView: {
    marginHorizontal: -4,
  },
  analysisScrollViewContent: {
    paddingHorizontal: 4,
  },
  analysisCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    width: 280,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  analysisCardHeaderNew: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  analysisCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  analysisCardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  analysisCardProgressContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  analysisCardProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  analysisCardProgressLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  analysisCardProgressValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0284c7',
  },
  analysisCardProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
  },
  analysisCardProgressFill: {
    height: '100%',
    backgroundColor: '#0284c7',
    borderRadius: 4,
  },
  analysisCardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  analysisCardStatItem: {
    alignItems: 'center',
  },
  analysisCardStatValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  analysisCardStatLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default HomeScreen;
