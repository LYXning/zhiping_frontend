import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../common/Icon';

interface ChoiceQuestionProps {
  question: any;
  index: number;
  type?: 'review' | 'report'; // 添加类型参数
  isEditing: boolean;
  currentAnswer: any;
  onEdit?: (questionId: number) => void;
  onSave?: (questionId: number) => void;
  onAnswerChange?: (questionId: number, answer: any) => void;
}

const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({
  question,
  index,
  type = 'review', // 默认为review类型
  isEditing,
  currentAnswer,
  onEdit,
  onSave,
  onAnswerChange,
}) => {
  const isCorrent = question.correct;
  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>{index + 1}</Text>
        <Text style={styles.questionType}>选择题</Text>
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

      <View style={styles.optionsContainer}>
        {Object.entries(question.options).map(([key, value], optIndex) => {
          if (type === 'review') {
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.optionItem,
                  currentAnswer === String.fromCharCode(65 + optIndex) &&
                    styles.selectedOption,
                ]}
                onPress={() => {
                  if (isEditing && onAnswerChange) {
                    onAnswerChange(
                      question.id,
                      String.fromCharCode(65 + optIndex),
                    );
                  }
                }}
                disabled={!isEditing}>
                <Text style={styles.optionLabel}>
                  {String.fromCharCode(65 + optIndex)}
                </Text>
                <Text style={styles.optionText}>{value}</Text>
                {currentAnswer === String.fromCharCode(65 + optIndex) &&
                  isCorrent && (
                    <View style={styles.checkIconContainer}>
                      <Icon name="check-circle" size={16} color="#0284c7" />
                    </View>
                  )}
              </TouchableOpacity>
            );
          }
          if (type === 'report') {
            console.log('currentAnswer: ', currentAnswer);
            console.log('isCorrent: ', isCorrent);
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.optionItem,
                  currentAnswer === String.fromCharCode(65 + optIndex) &&
                    ((isCorrent && styles.selectedOptionCorrect) ||
                      styles.selectOptionWrong),
                ]}
                disabled={true}>
                <Text style={styles.optionLabel}>
                  {String.fromCharCode(65 + optIndex)}
                </Text>
                <Text style={styles.optionText}>{value}</Text>
                {currentAnswer === String.fromCharCode(65 + optIndex) &&
                  isCorrent && (
                    <View style={styles.checkIconContainer}>
                      <Icon name="check-circle" size={16} color="#0284c7" />
                    </View>
                  )}
                {currentAnswer === String.fromCharCode(65 + optIndex) &&
                  !isCorrent && (
                    <View style={styles.checkIconContainer}>
                      <Icon name="wrong-circle" size={16} color="#e60000" />
                    </View>
                  )}
              </TouchableOpacity>
            );
          }
        })}
      </View>
      {/* 只在review模式下且正在编辑时显示提示 */}
      {type === 'review' && isEditing && (
        <Text style={styles.editingHint}>
          点击选项可修改答案，完成后点击保存按钮
        </Text>
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
  optionsContainer: {
    marginBottom: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  selectedOption: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  selectedOptionCorrect: {
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  selectOptionWrong: {
    backgroundColor: '#fecaca',
    borderWidth: 1,
    borderColor: '#fca5a5',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginRight: 12,
    width: 20,
  },
  optionText: {
    fontSize: 15,
    color: '#0f172a',
    flex: 1,
  },
  checkIconContainer: {
    marginLeft: 8,
  },
  editingHint: {
    fontSize: 12,
    color: '#0284c7',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default ChoiceQuestion;
