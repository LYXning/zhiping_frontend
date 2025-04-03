import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CreatePaperScreen from '../screens/student/CreatePaperScreen';
import PaperResultScreen from '../screens/student/PaperResultScreen';
import PaperReviewScreen from '../screens/student/PaperReviewScreen';
import PaperReportScreen from '../screens/student/PaperReportScreen';

// 定义学生导航参数类型
export type StudentStackParamList = {
  CreatePaper: {taskId?: number; taskName?: string};
  PaperReview: {paperId?: number; paperName?: string};
  PaperResult: {paperId?: number; paperName?: string};
  PaperReport: {paperId?: number; paperName?: string};
};

const Stack = createStackNavigator<StudentStackParamList>();

const StudentNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="CreatePaper" component={CreatePaperScreen} />
      <Stack.Screen name="PaperReview" component={PaperReviewScreen} />
      <Stack.Screen name="PaperResult" component={PaperResultScreen} />
      <Stack.Screen name="PaperReport" component={PaperReportScreen} />
    </Stack.Navigator>
  );
};

export default StudentNavigator;
