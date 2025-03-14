/**
 * 主页面导航配置
 * 包含应用的主要功能页面
 */

import React from 'react';
import {View, Text, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// 创建导航器
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 临时的主页面组件
const HomeScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>欢迎使用智评</Text>
  </View>
);

/**
 * 主页面Tab导航
 */
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6474f4',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({color}) => (
            <Image
              source={require('../assets/icons/home.png')}
              style={{width: 24, height: 24, tintColor: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
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
    </Stack.Navigator>
  );
};

export default MainNavigator;
