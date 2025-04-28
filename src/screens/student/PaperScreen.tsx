/**
 * 试卷列表页面
 * 用于展示用户的试卷列表。
 */

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTasks} from '../../store/actions/paperActions';
import {RootState} from '../../store';
import {useNavigation} from '@react-navigation/native';
import {STATUS_BAR_HEIGHT} from '../../utils/devicesUtils';
import LinearGradient from 'react-native-linear-gradient';
import {emptyBoxIcon} from '../../assets/icons';
import {TaskCard} from '../../components/specific/TaskCard';
import {getSubjectEnglishNameById} from '../../utils/subjectUtils';
import {dateUtils} from '../../utils/dateUtils';

const PaperScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // 从Redux获取任务列表数据
  const {
    tasks = [],
    tasksLoading = false,
    tasksError = null,
  } = useSelector((state: RootState) => state.paper);

  console.log('tasks Screen:', tasks);

  // 组件加载时获取任务列表
  useEffect(() => {
    loadTasks();
  }, []);

  // 加载任务列表
  const loadTasks = () => {
    dispatch(getTasks());
  };

  // 下拉刷新
  const onRefresh = () => {
    setRefreshing(true);
    dispatch(getTasks())
      .then(() => setRefreshing(false))
      .catch(() => setRefreshing(false));
  };

  // 处理试卷点击
  const handlePaperPress = paper => {
    // 根据试卷状态导航到不同页面
    if (paper.status === 'pending') {
      // 修改为通过相对导航访问PaperReview
      navigation.navigate('PaperReview', {
        paperId: paper.id,
        paperName: paper.title,
      });
    } else {
      // 修改为通过相对导航访问PaperResult
      navigation.navigate('PaperResult', {
        paperId: paper.id,
        paperName: paper.title,
      });
    }
  };

  // 渲染标签按钮
  const renderTabButton = (id, label, isActive) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={() => setActiveTab(id)}>
      <Text
        style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  // 过滤任务 - 修改为使用数字状态码
  const filteredPapers = Array.isArray(tasks)
    ? tasks.filter(paper => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return paper.status === 3;
        if (activeTab === 'inProgress') return paper.status === 4;
        if (activeTab === 'completed') return paper.status === 5;
        return true;
      })
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f0f9ff', '#e0eafc']} style={styles.background}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>我的试卷</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Image
              source={require('../../assets/icons/search.png')}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>

        {/* 任务分类标签 */}
        <View style={styles.tabContainer}>
          {renderTabButton('all', '全部', activeTab === 'all')}
          {renderTabButton('pending', '待批改', activeTab === 'pending')}
          {renderTabButton('inProgress', '批改中', activeTab === 'inProgress')}
          {renderTabButton('completed', '已完成', activeTab === 'completed')}
        </View>

        {/* 试卷列表 */}
        {tasksError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              加载试卷失败: {tasksError.toString()}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadTasks}>
              <Text style={styles.retryText}>重试</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredPapers}
            renderItem={({item}) => (
              <View>
                <TaskCard
                  {...item}
                  icon={getSubjectEnglishNameById(item.subjectId).toLowerCase()}
                  deadline={
                    '创建时间：' + dateUtils.defaultFormat(item.createdAt)
                  }
                  showActionButton={true}
                  // onPress={handlePaperPress}
                />
              </View>
            )}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              tasksLoading && !refreshing ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0ea5e9" />
                  <Text style={styles.loadingText}>加载试卷中...</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Image source={emptyBoxIcon} style={styles.emptyIcon} />
                  <Text style={styles.emptyText}>暂无试卷</Text>
                </View>
              )
            }
          />
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: 20,
    height: 20,
    tintColor: '#0c4a6e',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeTabButton: {
    backgroundColor: '#0ea5e9',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeTabButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  // 更新卡片样式
  paperCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  paperCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  subjectIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  subjectIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  paperInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  paperTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  paperDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  paperSubject: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  paperGrade: {
    fontSize: 14,
    color: '#64748b',
  },
  deadlineText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  paperStatus: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  scoreContainer: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284c7',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 60,
    height: 60,
    marginBottom: 12,
    tintColor: '#94a3b8',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PaperScreen;
