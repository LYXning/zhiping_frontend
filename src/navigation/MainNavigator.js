/**
 * 主页面导航配置
 * 包含应用的主要功能页面
 */

import React, { useState } from 'react';
import { View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// 导入教师端页面组件
import HomeScreen from '../screens/teacher/HomeScreen';
import TaskScreen from '../screens/teacher/TaskScreen';
import StatsScreen from '../screens/teacher/StatsScreen';
import ProfileScreen from '../screens/teacher/ProfileScreen';
import CreateTaskScreen from '../screens/teacher/CreateTaskScreen';

// 导入底部导航栏组件
import BottomTabBar from '../components/common/BottomTabBar';

// 创建导航器
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * 主页面Tab导航
 */
const TabNavigator = () => {
  const [activeTab, setActiveTab] = useState('Main');
  
  // 渲染当前激活的屏幕
  const renderScreen = () => {
    switch (activeTab) {
      case 'Main':
        return <HomeScreen />;
      case 'Task':
        return <TaskScreen />;
      case 'Stats':
        return <StatsScreen />;
      case 'Profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  // 处理底部标签点击
  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

/**
 * 主导航组件
 * 包含所有已登录后可访问的页面
 */
const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
