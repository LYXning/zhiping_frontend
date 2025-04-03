import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {STATUS_BAR_HEIGHT} from '../../utils/devicesUtils';
import {checkCircleIcon, xCircleIcon, arrowLeftIcon} from '../../assets/icons';

const PaperResultScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const {paperId, paperName} = route.params || {};

  const [loading, setLoading] = useState(true);
  const [paperData, setPaperData] = useState(null);
  const [error, setError] = useState(null);

  // 模拟数据 - 实际应用中应该从API获取
  useEffect(() => {
    // 模拟API请求延迟
    const timer = setTimeout(() => {
      try {
        // 模拟数据
        const mockData = {
          id: paperId,
          name: paperName || '期中数学试卷',
          subject: '数学',
          grade: '高二(3)班',
          score: 85,
          totalScore: 100,
          submitTime: '2023-05-15T14:30:00',
          questions: [
            {
              id: 1,
              type: 'choice',
              content: '下列哪个选项是正确的三角函数公式？',
              options: [
                'sin²θ + cos²θ = 0',
                'sin²θ + cos²θ = 1',
                'sin²θ - cos²θ = 1',
                'sin²θ × cos²θ = 1',
              ],
              correctAnswer: 1, // 索引从0开始
              userAnswer: 1,
              score: 5,
              userScore: 5,
            },
            {
              id: 2,
              type: 'fill',
              content: '已知函数f(x)=sin(x)+cos(x)，则f(π/4)的值为_______。',
              correctAnswer: '√2',
              userAnswer: '√2',
              score: 5,
              userScore: 5,
            },
            {
              id: 3,
              type: 'essay',
              content: '证明：对于任意角θ，sin²θ + cos²θ = 1恒成立。',
              correctAnswer: '略',
              userAnswer:
                '根据勾股定理，在单位圆中，点(cosθ, sinθ)到原点的距离为1，所以sin²θ + cos²θ = 1。',
              score: 10,
              userScore: 8,
              comment: '基本思路正确，但缺少完整的证明过程。',
            },
          ],
        };

        setPaperData(mockData);
        setLoading(false);
      } catch (err) {
        setError('加载试卷数据失败');
        setLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [paperId]);

  // 返回上一页
  const handleGoBack = () => {
    navigation.goBack();
  };

  // 渲染选择题
  const renderChoiceQuestion = (question, index) => {
    const isCorrect = question.userAnswer === question.correctAnswer;

    return (
      <View style={styles.questionCard} key={question.id}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>{index + 1}</Text>
          <Text style={styles.questionType}>选择题</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {question.userScore}/{question.score}分
            </Text>
          </View>
        </View>

        <Text style={styles.questionContent}>{question.content}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option, optIndex) => (
            <TouchableOpacity
              key={optIndex}
              style={[
                styles.optionItem,
                question.userAnswer === optIndex && styles.userSelectedOption,
                question.correctAnswer === optIndex && styles.correctOption,
              ]}
              disabled={true}>
              <Text style={styles.optionLabel}>
                {String.fromCharCode(65 + optIndex)}
              </Text>
              <Text style={styles.optionText}>{option}</Text>
              {question.userAnswer === optIndex && (
                <Image
                  source={isCorrect ? checkCircleIcon : xCircleIcon}
                  style={[
                    styles.resultIcon,
                    {tintColor: isCorrect ? '#16a34a' : '#dc2626'},
                  ]}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {question.userAnswer !== question.correctAnswer && (
          <View style={styles.correctAnswerContainer}>
            <Text style={styles.correctAnswerLabel}>正确答案：</Text>
            <Text style={styles.correctAnswerText}>
              {String.fromCharCode(65 + question.correctAnswer)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // 渲染填空题
  const renderFillQuestion = (question, index) => {
    const isCorrect = question.userAnswer === question.correctAnswer;

    return (
      <View style={styles.questionCard} key={question.id}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>{index + 1}</Text>
          <Text style={styles.questionType}>填空题</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {question.userScore}/{question.score}分
            </Text>
          </View>
        </View>

        <Text style={styles.questionContent}>{question.content}</Text>

        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>你的答案：</Text>
          <Text style={styles.answerText}>{question.userAnswer}</Text>
          <Image
            source={isCorrect ? checkCircleIcon : xCircleIcon}
            style={[
              styles.resultIcon,
              {tintColor: isCorrect ? '#16a34a' : '#dc2626'},
            ]}
          />
        </View>

        {!isCorrect && (
          <View style={styles.correctAnswerContainer}>
            <Text style={styles.correctAnswerLabel}>正确答案：</Text>
            <Text style={styles.correctAnswerText}>
              {question.correctAnswer}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // 渲染简答题
  const renderEssayQuestion = (question, index) => {
    const isFullScore = question.userScore === question.score;

    return (
      <View style={styles.questionCard} key={question.id}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>{index + 1}</Text>
          <Text style={styles.questionType}>简答题</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>
              {question.userScore}/{question.score}分
            </Text>
          </View>
        </View>

        <Text style={styles.questionContent}>{question.content}</Text>

        <View style={styles.essayAnswerContainer}>
          <Text style={styles.answerLabel}>你的答案：</Text>
          <Text style={styles.essayAnswerText}>{question.userAnswer}</Text>
        </View>

        {question.comment && (
          <View style={styles.commentContainer}>
            <Text style={styles.commentLabel}>老师评语：</Text>
            <Text style={styles.commentText}>{question.comment}</Text>
          </View>
        )}

        <View style={styles.correctAnswerContainer}>
          <Text style={styles.correctAnswerLabel}>参考答案：</Text>
          <Text style={styles.correctAnswerText}>{question.correctAnswer}</Text>
        </View>
      </View>
    );
  };

  // 根据题目类型渲染不同的题目组件
  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'choice':
        return renderChoiceQuestion(question, index);
      case 'fill':
        return renderFillQuestion(question, index);
      case 'essay':
        return renderEssayQuestion(question, index);
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#f0f9ff', '#e0eafc']}
          style={styles.background}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text style={styles.loadingText}>加载试卷中...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#f0f9ff', '#e0eafc']}
          style={styles.background}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleGoBack}>
              <Text style={styles.retryText}>返回</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f0f9ff', '#e0eafc']} style={styles.background}>
        {/* 顶部导航 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Image source={arrowLeftIcon} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {paperData.name}
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* 试卷信息 */}
        <View style={styles.paperInfoCard}>
          <View style={styles.paperInfoRow}>
            <Text style={styles.paperInfoLabel}>科目：</Text>
            <Text style={styles.paperInfoValue}>{paperData.subject}</Text>
          </View>
          <View style={styles.paperInfoRow}>
            <Text style={styles.paperInfoLabel}>班级：</Text>
            <Text style={styles.paperInfoValue}>{paperData.grade}</Text>
          </View>
          <View style={styles.paperInfoRow}>
            <Text style={styles.paperInfoLabel}>得分：</Text>
            <Text style={[styles.paperInfoValue, styles.scoreValue]}>
              {paperData.score}/{paperData.totalScore}
            </Text>
          </View>
          <View style={styles.paperInfoRow}>
            <Text style={styles.paperInfoLabel}>提交时间：</Text>
            <Text style={styles.paperInfoValue}>
              {new Date(paperData.submitTime).toLocaleString('zh-CN')}
            </Text>
          </View>
        </View>

        {/* 题目列表 */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}>
          {paperData.questions.map((question, index) =>
            renderQuestion(question, index),
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: STATUS_BAR_HEIGHT + 10,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#0c4a6e',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0c4a6e',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  paperInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  paperInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  paperInfoLabel: {
    fontSize: 14,
    color: '#64748b',
    width: 80,
  },
  paperInfoValue: {
    fontSize: 14,
    color: '#0f172a',
    flex: 1,
  },
  scoreValue: {
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
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
  scoreContainer: {
    marginLeft: 'auto',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    color: '#0284c7',
    fontWeight: '500',
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
  userSelectedOption: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  correctOption: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
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
  resultIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
  },
  correctAnswerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
  },
  correctAnswerLabel: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
  },
  correctAnswerText: {
    fontSize: 14,
    color: '#166534',
    flex: 1,
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  answerText: {
    fontSize: 14,
    color: '#0c4a6e',
    flex: 1,
  },
  essayAnswerContainer: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  essayAnswerText: {
    fontSize: 14,
    color: '#0f172a',
    marginTop: 8,
    lineHeight: 20,
  },
  commentContainer: {
    backgroundColor: '#fff7ed',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  commentLabel: {
    fontSize: 14,
    color: '#9a3412',
    fontWeight: '500',
  },
  commentText: {
    fontSize: 14,
    color: '#9a3412',
    marginTop: 8,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#0ea5e9',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default PaperResultScreen;
