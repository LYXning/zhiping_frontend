/**
 * 教师端首页组件
 * 显示教师首页界面，包含快捷功能、待处理任务和最近分析等模块
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

// 导入图标资源
import {
  homeIcon,
  searchIcon,
  scanIcon,
  chartIcon,
  bookIcon,
  fileIcon,
  fileCheckIcon,
  trendingUpIcon,
  zapIcon,
  bellIcon,
  clipboardCheckIcon,
} from '../../assets/icons';
import {STATUS_BAR_HEIGHT} from '../../utils/devicesUtils';
import {useNavigation} from '@react-navigation/native';
import {AnalysisCard} from '../../components/specific/AnalysisCard';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {TaskCard} from '../../components/specific/TaskCard';

// 临时使用的图标组件，后续可替换为实际图标
const Icon = ({name, size = 24, color = '#000'}) => {
  // 根据图标名称返回对应的图标组件
  const getIconSource = iconName => {
    switch (iconName) {
      case 'zap':
        return zapIcon; // 临时替代
      case 'bell':
        return bellIcon; // 临时替代
      case 'search':
        return searchIcon;
      case 'scan-line':
        return scanIcon;
      case 'clipboard-check':
        return clipboardCheckIcon; // 临时替代
      case 'bar-chart-2':
        return chartIcon;
      case 'book-open':
        return bookIcon;
      case 'file-text':
        return fileIcon;
      case 'file-check':
        return fileCheckIcon;
      case 'trending-up':
        return trendingUpIcon;
      default:
        return homeIcon;
    }
  };

  return (
    <Image
      source={getIconSource(name)}
      style={{width: size, height: size, tintColor: color}}
    />
  );
};

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
  console.log(user);

  const navigation = useNavigation();

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
              icon="scan-line"
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
              icon="bar-chart-2"
              color="#7c3aed"
              bgColor="#f3e8ff"
              label="数据分析"
              onPress={() => console.log('数据分析')}
            />
            <QuickActionItem
              icon="book-open"
              color="#ca8a04"
              bgColor="#fef3c7"
              label="学习资源"
              onPress={() => console.log('学习资源')}
            />
          </View>

          {/* 待处理任务 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>最近试卷</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>查看全部</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.taskList}>
              <TaskCard
                id={1}
                icon="file-text"
                iconBg="#dbeafe"
                iconColor="0284c7"
                title="物理周测试卷"
                subtitle="高二(3)班 · 35份"
                deadline="截止日期 = 今天"
                status={1}
                showActionButton={true}
              />
              <TaskCard
                id={2}
                icon="file-text"
                iconBg="#dbeafe"
                iconColor="0284c7"
                title="期中数学试卷"
                subtitle="高二(3)班 · 35份"
                deadline="截止日期= 今天"
                status={2}
                showActionButton={true}
              />

              <TaskCard
                id={3}
                icon="file-text"
                iconBg="#dbeafe"
                iconColor="0284c7"
                title="期中数学试卷"
                subtitle="高二(3)班 · 35份"
                deadline="截止日期= 今天"
                status={3}
                showActionButton={true}
              />

              <TaskCard
                id={3}
                icon="file-text"
                iconBg="#dbeafe"
                iconColor="0284c7"
                title="期中数学试卷"
                subtitle="高二(3)班 · 35份"
                deadline="截止日期= 今天"
                status={4}
                showActionButton={true}
              />
              <TaskCard
                id={5}
                icon="file-text"
                iconBg="#dbeafe"
                iconColor="0284c7"
                title="期中数学试卷"
                subtitle="高二(3)班 · 35份"
                deadline="截止日期= 今天"
                status={5}
                showActionButton={true}
              />
            </View>
          </View>

          {/* 最近分析 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>最近分析</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>查看全部</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.analysisScrollView}>
              <AnalysisCard
                title="高二(3)班期中考试分析"
                subtitle="数学 · 2023年春季学期"
                averageScore={85.2}
                maxScore={92}
                minScore={65}
                passRate="78%"
                excellentRate="35%"
              />
              <AnalysisCard
                title="高一(2)班月考分析"
                subtitle="物理 · 2023年春季学期"
                averageScore={82.5}
                maxScore={95}
                minScore={60}
                passRate="85%"
                excellentRate="40%"
              />
              <AnalysisCard
                title="高三(1)班模拟考试"
                subtitle="英语 · 2023年春季学期"
                averageScore={78.3}
                maxScore={98}
                minScore={55}
                passRate="75%"
                excellentRate="30%"
              />
            </ScrollView>
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
  analysisScrollView: {
    marginHorizontal: -4,
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
