import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CreateTaskScreen from '../screens/teacher/CreateTaskScreen';
import ExamContentScreen from '../screens/teacher/ExamContentScreen';

// 定义任务导航参数类型
export type TaskStackParamList = {
  CreateTask: undefined;
  ImageBrowser: {
    images: any[];
    onConfirm: (images: any[]) => void;
  };
  ExamContent: {
    images: any[];
    taskType?: string;
    taskName?: string;
    selectedSubject?: string;
  };
};

const Stack = createStackNavigator<TaskStackParamList>();

const TaskNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="CreateTask"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} />
    </Stack.Navigator>
  );
};

export default TaskNavigator;
