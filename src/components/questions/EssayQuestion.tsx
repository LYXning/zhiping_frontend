import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from '../common/Icon';

interface EssayQuestionProps {
  question: any;
  index: number;
  type?: 'review' | 'report'; // 添加类型参数
  isEditing: boolean;
  currentAnswer: any;
  onEdit?: (questionId: number) => void;
  onSave?: (questionId: number) => void;
  onAnswerChange?: (questionId: number, answer: any) => void;
}

const EssayQuestion: React.FC<EssayQuestionProps> = ({
  question,
  index,
  type = 'review', // 默认为review类型
  isEditing,
  currentAnswer,
  onEdit,
  onSave,
  onAnswerChange,
}) => {
  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>{index + 1}</Text>
        <Text style={styles.questionType}>简答题</Text>
        {/* 只在review模式下显示编辑/保存按钮 */}
        {type === 'review' && (
          <View style={styles.questionActions}>
            {isEditing ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onSave && onSave(question.id)}>
                <Icon name="save" size={20} color="#0284c7" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEdit && onEdit(question.id)}>
                <Icon name="edit" size={20} color="#0284c7" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <Text style={styles.questionContent}>{question.content}</Text>

      {type === 'review' && (
        <View style={styles.essayAnswerContainer}>
          <Text style={styles.answerLabel}>'识别结果：'</Text>
          {isEditing && type === 'review' ? (
            <TextInput
              style={styles.essayAnswerInput}
              value={String(currentAnswer || '')}
              onChangeText={text =>
                onAnswerChange && onAnswerChange(question.id, text)
              }
              multiline
              numberOfLines={4}
              autoFocus
            />
          ) : (
            <Text style={styles.essayAnswerText}>{currentAnswer}</Text>
          )}
        </View>
      )}

      {/* 只在review模式下且正在编辑时显示提示 */}
      {type === 'review' && isEditing && (
        <Text style={styles.editingHint}>修改答案内容后点击保存按钮</Text>
      )}
    </View>
  );
};

// 保持原有样式不变
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
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginRight: 8,
  },
  questionType: {
    fontSize: 14,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  questionActions: {
    marginLeft: 'auto',
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
  },
  questionContent: {
    fontSize: 16,
    color: '#0f172a',
    marginBottom: 16,
    lineHeight: 24,
  },
  essayAnswerContainer: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  answerLabel: {
    fontSize: 14,
    color: '#0c4a6e',
    fontWeight: '500',
    marginRight: 8,
  },
  essayAnswerText: {
    fontSize: 14,
    color: '#0f172a',
    marginTop: 8,
    lineHeight: 20,
  },
  essayAnswerInput: {
    fontSize: 14,
    color: '#0f172a',
    marginTop: 8,
    lineHeight: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  editingHint: {
    fontSize: 12,
    color: '#0284c7',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default EssayQuestion;
