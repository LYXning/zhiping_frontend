import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CreatePaperScreen from '../screens/student/CreatePaperScreen';
import PaperReviewScreen from '../screens/student/PaperReviewScreen';
import PaperReportScreen from '../screens/student/PaperReportScreen';
import PaperScreen from '../screens/student/PaperScreen';
import WeaknessAnalysisScreen from '../screens/student/WeaknessAnalysisScreen';

// 定义学生导航参数类型
export type StudentStackParamList = {
  CreatePaper: {paperId?: number; paperName?: string; paperSubject?: string};
  PaperReview: {paperId?: number; paperName?: string};
  PaperReport: {paperId?: number; paperName?: string};
  WeaknessAnalysis: {};
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
      <Stack.Screen name="PaperReport" component={PaperReportScreen} />
      <Stack.Screen
        name="WeaknessAnalysis"
        component={WeaknessAnalysisScreen}
      />
    </Stack.Navigator>
  );
};

export default StudentNavigator;
