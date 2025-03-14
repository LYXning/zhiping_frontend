import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { RootState, AppDispatch } from '../store';
import { validateToken } from '../store/actions/authActions';
import MainNavigator from './MainNavigator';

// 定义导航参数类型
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // 在组件挂载时验证token
  useEffect(() => {
    // 验证用户token是否有效
    dispatch(validateToken());
  }, [dispatch]);

  return (
    <NavigationContainer
      onStateChange={(state) => {
        // 可以在这里处理导航状态变化
        console.log('Navigation state changed', state);
      }}
    >
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Main" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen 
          name="Main" 
          component={MainNavigator} 
          options={{
            // 如果用户未认证，则无法通过直接导航访问此屏幕
            gestureEnabled: isAuthenticated
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
