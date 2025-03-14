/**
 * 底部导航栏组件
 * 可复用的底部导航栏，包含首页、任务、添加、统计和个人中心五个选项
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { chartIcon, clipboardListIcon, homeIcon, userIcon } from '../../assets/icons';

// 导航项类型定义
type TabItemProps = {
  label: string;
  icon: string;
  screen: string;
  isActive: boolean;
  onPress: () => void;
};

// 底部导航栏属性类型定义
type BottomTabBarProps = {
  activeTab: string;
  onTabPress: (tabName: string) => void;
};

// 单个导航项组件
const TabItem = ({ label, icon, isActive, onPress }: TabItemProps) => {
  // 根据图标名称返回对应的图标组件
  const getIconSource = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return homeIcon;
      case 'task':
        return clipboardListIcon;
      case 'stats':
        return chartIcon;
      case 'profile':
        return userIcon;
      default:
        return homeIcon;
    }
  };

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.7}>
      <Image
        source={getIconSource(icon)}
        style={[styles.tabIcon, { tintColor: isActive ? '#0284c7' : '#6b7280' }]}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: isActive ? '#0284c7' : '#6b7280', fontWeight: isActive ? '500' : 'normal' },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// 添加按钮组件
const AddButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.addButtonContainer} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.addButton}>
        <Image
          source={require('../../assets/icons/plus.png')} // 需要添加此图标
          style={styles.addButtonIcon}
        />
      </View>
    </TouchableOpacity>
  );
};

/**
 * 底部导航栏组件
 * @param activeTab 当前激活的标签页
 * @param onTabPress 标签页点击事件处理函数
 */
const BottomTabBar = ({ activeTab, onTabPress }: BottomTabBarProps) => {
  const navigation = useNavigation();

  // 处理标签点击
  const handleTabPress = (tabName: string) => {
    onTabPress(tabName);
  };

  // 处理添加按钮点击
  const handleAddPress = () => {
    // 导航到创建任务页面
    navigation.navigate('CreateTask');
  };

  return (
    <View style={styles.container}>
      <TabItem
        label="首页"
        icon="home"
        screen="Main"
        isActive={activeTab === 'Main'}
        onPress={() => handleTabPress('Main')}
      />
      <TabItem
        label="任务"
        icon="task"
        screen="Task"
        isActive={activeTab === 'Task'}
        onPress={() => handleTabPress('Task')}
      />
      <AddButton onPress={handleAddPress} />
      <TabItem
        label="统计"
        icon="stats"
        screen="Stats"
        isActive={activeTab === 'Stats'}
        onPress={() => handleTabPress('Stats')}
      />
      <TabItem
        label="我的"
        icon="profile"
        screen="Profile"
        isActive={activeTab === 'Profile'}
        onPress={() => handleTabPress('Profile')}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingBottom: 12, // 增加底部内边距，适应不同设备
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
  },
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20, // 使按钮突出于导航栏
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  addButtonIcon: {
    width: 24,
    height: 24,
    tintColor: '#ffffff',
  },
});

export default BottomTabBar;