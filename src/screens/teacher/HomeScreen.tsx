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
  messageCircleIcon,
  searchIcon,
  scanIcon,
  checkCircleIcon,
  chartIcon,
  bookIcon,
  fileIcon,
  fileCheckIcon,
  trendingUpIcon
} from '../../assets/icons';

// 临时使用的图标组件，后续可替换为实际图标
const Icon = ({name, size = 24, color = '#000'}) => {
  // 根据图标名称返回对应的图标组件
  const getIconSource = (iconName) => {
    switch (iconName) {
      case 'zap':
        return homeIcon; // 临时替代
      case 'bell':
        return messageCircleIcon; // 临时替代
      case 'search':
        return searchIcon; 
      case 'scan-line':
        return scanIcon; 
      case 'clipboard-check':
        return checkCircleIcon; // 临时替代
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
const QuickActionItem = ({icon, color, bgColor, label}) => (
  <View style={styles.quickActionItem}>
    <View
      style={[styles.quickActionIconContainer, {backgroundColor: bgColor}]}>
      <Icon name={icon} size={24} color={color} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </View>
);

// 任务卡片组件
const TaskCard = ({icon, iconBg, iconColor, title, subtitle, status, statusBg, statusColor, deadline, buttonText, buttonBg, buttonColor, onPress}) => (
  <View style={styles.taskCard}>
    <View style={styles.taskCardHeader}>
      <View style={styles.taskCardTitleContainer}>
        <View style={[styles.taskCardIcon, {backgroundColor: iconBg}]}>
          <Icon name={icon} size={20} color={iconColor} />
        </View>
        <View>
          <Text style={styles.taskCardTitle}>{title}</Text>
          <Text style={styles.taskCardSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={[styles.taskCardStatus, {backgroundColor: statusBg}]}>
        <Text style={[styles.taskCardStatusText, {color: statusColor}]}>{status}</Text>
      </View>
    </View>
    <View style={styles.taskCardFooter}>
      <Text style={styles.taskCardDeadline}>{deadline}</Text>
      <TouchableOpacity 
        style={[styles.taskCardButton, {backgroundColor: buttonBg}]} 
        onPress={onPress}
      >
        <Text style={[styles.taskCardButtonText, {color: buttonColor}]}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// 分析卡片组件
const AnalysisCard = ({title, subtitle, value, change, changeType}) => (
  <View style={styles.analysisCard}>
    <View style={styles.analysisCardHeader}>
      <Text style={styles.analysisCardTitle}>{title}</Text>
      <Text style={styles.analysisCardSubtitle}>{subtitle}</Text>
    </View>
    <View style={styles.analysisCardContent}>
      <Text style={styles.analysisCardValue}>{value}</Text>
      <View style={styles.analysisCardChange}>
        <Icon 
          name={changeType === 'up' ? 'trending-up' : 'trending-down'} 
          size={16} 
          color={changeType === 'up' ? '#10b981' : '#ef4444'} 
        />
        <Text 
          style={[styles.analysisCardChangeText, 
            {color: changeType === 'up' ? '#10b981' : '#ef4444'}]}
        >
          {change}
        </Text>
      </View>
    </View>
  </View>
);

const HomeScreen = ({navigation}) => {
  // 处理添加按钮点击
  const handleAddPress = () => {
    // 导航到创建任务页面
    navigation.navigate('CreateTask');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f0f9ff', '#e0eafc']}
        style={styles.background}
      >
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
              <Text style={styles.avatarText}>李</Text>
            </View>
          </View>
        </View>

        {/* 搜索框 */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索试卷、知识点或资源..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        <ScrollView style={styles.scrollView}>
          {/* 快捷功能 */}
          <View style={styles.quickActions}>
            <QuickActionItem 
              icon="scan-line" 
              color="#dc2626" 
              bgColor="#fee2e2" 
              label="扫描试卷" 
            />
            <QuickActionItem 
              icon="clipboard-check" 
              color="#16a34a" 
              bgColor="#dcfce7" 
              label="批改作业" 
            />
            <QuickActionItem 
              icon="bar-chart-2" 
              color="#7c3aed" 
              bgColor="#f3e8ff" 
              label="数据分析" 
            />
            <QuickActionItem 
              icon="book-open" 
              color="#ca8a04" 
              bgColor="#fef3c7" 
              label="学习资源" 
            />
          </View>

          {/* 待处理任务 */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>待处理任务</Text>
              <TouchableOpacity>
                <Text style={styles.sectionAction}>查看全部</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.taskList}>
              <TaskCard 
                icon="file-text"
                iconBg="#dbeafe"
                iconColor="#0284c7"
                title="期中数学试卷"
                subtitle="高二(3)班 · 35份"
                status="待批改"
                statusBg="#fef3c7"
                statusColor="#b45309"
                deadline="截止日期: 今天"
                buttonText="开始批改"
                buttonBg="#0ea5e9"
                buttonColor="#ffffff"
                onPress={() => console.log('开始批改')}
              />

              <TaskCard 
                icon="file-check"
                iconBg="#dcfce7"
                iconColor="#16a34a"
                title="物理周测"
                subtitle="高一(2)班 · 42份"
                status="已完成"
                statusBg="#dcfce7"
                statusColor="#16a34a"
                deadline="完成时间: 昨天 15:30"
                buttonText="查看报告"
                buttonBg="#ffffff"
                buttonColor="#4b5563"
                onPress={() => console.log('查看报告')}
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
              style={styles.analysisScrollView}
            >
              <AnalysisCard 
                title="平均分"
                subtitle="高二(3)班 · 数学"
                value="86.5"
                change="+2.3"
                changeType="up"
              />
              <AnalysisCard 
                title="及格率"
                subtitle="高一(2)班 · 物理"
                value="92%"
                change="+5%"
                changeType="up"
              />
              <AnalysisCard 
                title="优秀率"
                subtitle="高三(1)班 · 英语"
                value="45%"
                change="-3%"
                changeType="down"
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
    paddingTop: 16,
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
    width: 150,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  analysisCardHeader: {
    marginBottom: 8,
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
  analysisCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  analysisCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  analysisCardChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  analysisCardChangeText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default HomeScreen;
