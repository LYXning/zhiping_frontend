/**
 * 主页面导航配置
 * 包含应用的主要功能页面
 */

import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import ProfileScreen from '../screens/ProfileScreen';

// 导入教师端页面组件
import TeacherHomeScreen from '../screens/teacher/HomeScreen';
import TeacherTaskScreen from '../screens/teacher/TaskScreen';
import TeacherStatsScreen from '../screens/teacher/StatsScreen';
import TeacherCreateTaskScreen from '../screens/teacher/CreateTaskScreen';

// 导入学生端页面组件
import StudentHomeScreen from '../screens/student/HomeScreen';
import StudentTaskScreen from '../screens/student/TaskScreen';
import StudentStatsScreen from '../screens/student/StatsScreen';

// 导入底部导航栏组件
import BottomTabBar from '../components/common/BottomTabBar';
import {Text} from 'react-native-gesture-handler';

// 创建导航器
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * 主页面Tab导航
 */
const TabNavigator = () => {
  const [activeTab, setActiveTab] = useState('Main');
  const navigation = useNavigation();
  const {isAuthenticated, user} = useSelector(state => state.auth);

  // 监听认证状态变化，当用户登出时重定向到登录页面
  useEffect(() => {
    if (!isAuthenticated) {
      // 用户已登出，导航到登录页面
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  }, [isAuthenticated, navigation]);

  // 渲染当前激活的屏幕
  const renderScreen = () => {
    const HomeScreen =
      user.role === 'TEACHER' ? TeacherHomeScreen : StudentHomeScreen;
    const TaskScreen =
      user.role === 'TEACHER' ? TeacherTaskScreen : StudentTaskScreen;
    const StatsScreen =
      user.role === 'TEACHER' ? TeacherStatsScreen : StudentStatsScreen;

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
  const handleTabPress = tabName => {
    setActiveTab(tabName);
  };

  return (
    <View style={{flex: 1}}>
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
      <Stack.Screen name="CreateTask" component={TeacherCreateTaskScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
