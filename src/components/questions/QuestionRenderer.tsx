import React from 'react';
import ChoiceQuestion from './ChoiceQuestion';
import FillQuestion from './FillQuestion';
import EssayQuestion from './EssayQuestion';

interface QuestionRendererProps {
  question: any;
  index: number;
  type?: 'review' | 'report'; // 添加类型参数

  editingQuestionId?: number | null;
  editedAnswers?: Record<number, any>;
  onEditAnswer?: (questionId: number) => void;
  onSaveAnswer?: (questionId: number) => void;
  onAnswerChange?: (questionId: number, answer: any) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  index,
  type = 'review', // 默认为review类型
  editingQuestionId,
  editedAnswers,
  onEditAnswer,
  onSaveAnswer,
  onAnswerChange,
}) => {
  console.log('QuestionRenderer:', question);
  const isEditing = editingQuestionId === question.id;
  const currentAnswer =
    isEditing && editedAnswers
      ? editedAnswers[question.id]
      : question.userAnswers;

  // 根据题目类型渲染不同的组件
  switch (question.question_type) {
    case '单选题':
    case '选择题':
      return (
        <ChoiceQuestion
          question={question}
          currentAnswer={currentAnswer}
          index={index}
          type={type}
          isEditing={isEditing}
          onEdit={onEditAnswer}
          onSave={onSaveAnswer}
          onAnswerChange={onAnswerChange}
        />
      );
    case '填空题':
      return (
        <FillQuestion
          question={question}
          index={index}
          type={type}
          isEditing={isEditing}
          currentAnswer={currentAnswer}
          onEdit={onEditAnswer}
          onSave={onSaveAnswer}
          onAnswerChange={onAnswerChange}
        />
      );
    case '简答题':
      return (
        <EssayQuestion
          question={question}
          index={index}
          type={type}
          isEditing={isEditing}
          currentAnswer={currentAnswer}
          onEdit={onEditAnswer}
          onSave={onSaveAnswer}
          onAnswerChange={onAnswerChange}
        />
      );
    default:
      return null;
  }
};

export default QuestionRenderer;
