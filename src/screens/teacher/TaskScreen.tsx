/**
 * 教师端任务中心组件
 * 显示教师的任务列表，包括待批改、进行中和已完成的任务
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {STATUS_BAR_HEIGHT} from '../../utils/devicesUtils';
import LinearGradient from 'react-native-linear-gradient';

// 导入图标资源
import {
  filterIcon,
  plusIcon,
  fileIcon,
  checkCircleIcon,
  clockIcon,
  homeIcon,
} from '../../assets/icons';
import {useNavigation} from '@react-navigation/native';
// import {TaskCard} from '../../components/specific/TaskCard';

// 图标组件
const Icon = ({name, size = 24, color = '#000'}) => {
  // 根据图标名称返回对应的图标组件
  const getIconSource = iconName => {
    switch (iconName) {
      case 'filter':
        return filterIcon;
      case 'plus':
        return plusIcon;
      case 'file-text':
        return fileIcon; // 临时替代
      case 'file-check':
        return checkCircleIcon; // 临时替代
      case 'clock':
        return clockIcon;
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

const TaskScreen = () => {
  const [activeTab, setActiveTab] = useState('all');

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

  const navigation = useNavigation();
  // 处理添加按钮点击
  const handleAddPress = () => {
    navigation.navigate('CreateTask');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f0f9ff', '#e0eafc']} style={styles.background}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>任务中心</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="filter" size={20} color="#4b5563" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleAddPress}>
              <Icon name="plus" size={20} color="#4b5563" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 任务分类标签 */}
        <View style={styles.tabContainer}>
          {renderTabButton('all', '全部', activeTab === 'all')}
          {renderTabButton('pending', '待批改', activeTab === 'pending')}
          {renderTabButton('inProgress', '进行中', activeTab === 'inProgress')}
          {renderTabButton('completed', '已完成', activeTab === 'completed')}
        </View>

        {/* 任务列表 */}
        <ScrollView style={styles.scrollView}>
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
              date="截止日期: 今天"
            />

            <TaskCard
              icon="file-text"
              iconBg="#dbeafe"
              iconColor="#0284c7"
              title="英语单元测试"
              subtitle="高一(5)班 · 40份"
              status="进行中"
              statusBg="#dbeafe"
              statusColor="#0369a1"
              date="截止日期: 明天"
              progress={65}
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
              date="完成时间: 昨天 15:30"
            />

            <TaskCard
              icon="file-check"
              iconBg="#dcfce7"
              iconColor="#16a34a"
              title="化学实验报告"
              subtitle="高三(1)班 · 38份"
              status="已完成"
              statusBg="#dcfce7"
              statusColor="#16a34a"
              date="完成时间: 前天 09:15"
            />
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
    paddingBottom: 12,
    paddingTop: (STATUS_BAR_HEIGHT + 30) / 2,
    height: STATUS_BAR_HEIGHT + 30,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075985',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  activeTabButton: {
    backgroundColor: '#0ea5e9',
  },
  tabButtonText: {
    fontSize: 12,
    color: '#4b5563',
  },
  activeTabButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  taskList: {
    gap: 12,
    paddingBottom: 16,
  },
});

export default TaskScreen;
