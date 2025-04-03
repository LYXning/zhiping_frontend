import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import {RootState, AppDispatch} from '../store';
import {validateToken} from '../store/actions/authActions';
import MainNavigator from './MainNavigator';
import TaskNavigator from './TaskNavigator';
import StudentNavigator from './StudentNavigator';
import {AppState, Platform, LogBox} from 'react-native';

// 忽略特定的警告信息
LogBox.ignoreLogs([
  'Image decoding logging dropped',
  "Direct event name for 'CameraView' doesn't correspond to the naming convention",
  'Tried to access onWindowFocusChange while context is not ready',
  'Tried to use permissions API while not attached to an Activity',
]);

// 定义导航参数类型
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Task: undefined;
  Student: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {isAuthenticated} = useSelector((state: RootState) => state.auth);

  // 在组件挂载时验证token
  useEffect(() => {
    // 验证用户token是否有效
    dispatch(validateToken());
  }, [dispatch]);

  // 监听应用状态变化，避免窗口焦点变化异常
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('应用状态变化:', nextAppState);

      // 当应用回到前台时，确保权限请求在正确的上下文中进行
      if (nextAppState === 'active' && Platform.OS === 'android') {
        // 延迟执行，确保Activity已完全附加
        setTimeout(() => {
          console.log('应用已激活，可以安全请求权限');
        }, 500);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // 根据isAuthenticated的值决定要渲染的导航器
  const renderNavigator = () => {
    if (isAuthenticated) {
      return (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="Task" component={TaskNavigator} />
            <Stack.Screen name="Student" component={StudentNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  };

  return renderNavigator();
};

export default AppNavigator;
