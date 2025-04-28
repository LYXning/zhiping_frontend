import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ChoiceQuestion from './ChoiceQuestion';
import FillQuestion from './FillQuestion';
import EssayQuestion from './EssayQuestion';
import QuestionRenderer from './QuestionRenderer';

interface ReportQuestionRendererProps {
  detail: any;
  index: number;
}

const ReportQuestionRenderer: React.FC<ReportQuestionRendererProps> = ({
  detail,
  index,
}) => {
  console.log('ReportQuestionRenderer Detail:', detail);
  // 构建适合QuestionRenderer的问题对象
  const question = {
    id: detail.questionId,
    content: detail.questionContent,
    question_type: detail.questionType,
    options: detail.options,
    score: detail.score,
    maxScore: detail.maxScore,
    correct: detail.correct,

    correctAnswer: detail.questionAnswer,
    userAnswers: detail.userAnswer,
  };

  console.log('ReportQuestionRenderer: Question', question);

  // 渲染答案比较
  const renderAnswerComparison = () => {
    return (
      <View style={styles.answerComparisonContainer}>
        <View style={styles.answerItem}>
          <Text style={styles.answerLabel}>你的答案:</Text>
          <Text
            style={[
              styles.answerText,
              {color: detail.correct ? '#10b981' : '#ef4444'},
            ]}>
            {detail.userAnswer || '未作答'}
          </Text>
        </View>
        <View style={styles.answerItem}>
          <Text style={styles.answerLabel}>正确答案:</Text>
          <Text style={styles.correctAnswerText}>
            {detail.questionAnswer || '暂无答案'}
          </Text>
        </View>
      </View>
    );
  };

  // 渲染评论和解析
  const renderCommentAndAnalysis = () => {
    if (!detail.comment) return null;

    return (
      <View style={styles.commentContainer}>
        <Text style={styles.commentTitle}>题目解析:</Text>
        <Text style={styles.commentText}>{detail.comment}</Text>
      </View>
    );
  };

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <View style={styles.questionNumberContainer}>
          <Text style={styles.questionNumber}>{index + 1}</Text>
        </View>
        <Text style={styles.questionType}>{detail.questionType}</Text>
        <View style={styles.questionScore}>
          <Text style={styles.questionScoreText}>
            {detail.score.toFixed(1)}/{detail.maxScore.toFixed(1)}分
          </Text>
        </View>
      </View>

      <QuestionRenderer type="report" question={question} index={index} />
      {renderAnswerComparison()}
      {renderCommentAndAnalysis()}
    </View>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  questionType: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  questionScore: {
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  questionScoreText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0284c7',
  },
  questionContentContainer: {
    marginBottom: 16,
  },
  questionText: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 12,
    lineHeight: 20,
  },
  answerComparisonContainer: {
    marginBottom: 16,
  },
  answerItem: {
    marginBottom: 8,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#0284c7',
    padding: 8,
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
    borderRadius: 8,
  },
  commentContainer: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0284c7',
  },
  commentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0284c7',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#1e293b',
    lineHeight: 20,
  },
});

export default ReportQuestionRenderer;
