/**
 * 认证相关的导航配置
 * 包含登录和注册界面的导航路由
 */

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/teacher/HomeScreen';
import MainNavigator from './MainNavigator';

// 创建认证相关的Stack导航器
const Stack = createStackNavigator();

/**
 * 认证导航组件
 * 包含登录和注册界面
 * @returns {JSX.Element} 认证导航组件
 */
const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: '#6474f4'},
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={MainNavigator} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
