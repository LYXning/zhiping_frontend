/**
 * 学生端答案识别结果查看与修改组件
 * 用于学生查看试卷题目和答案识别结果，并可以修改错误识别
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {STATUS_BAR_HEIGHT} from '../../utils/devicesUtils';
import {
  checkCircleIcon,
  editIcon,
  leftIcon,
  saveIcon,
} from '../../assets/icons';
import {getPaperInfo} from '../../store/actions/paperActions';
import {getSubjectNameById} from '../../utils/subjectUtils';

// 图标组件
const Icon = ({name, size = 24, color = '#000'}) => {
  // 根据图标名称返回对应的图标组件
  const getIconSource = iconName => {
    switch (iconName) {
      case 'arrow-left':
        return leftIcon;
      case 'check-circle':
        return checkCircleIcon;
      case 'edit':
        return editIcon;
      case 'save':
        return saveIcon;
      default:
        return leftIcon;
    }
  };
  return (
    <Image
      source={getIconSource(name)}
      style={{width: size, height: size, tintColor: color}}
    />
  );
};

const PaperReviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {paperId, paperName} = route.params || {};
  const dispatch = useDispatch();

  const isProcessing = useSelector(
    (state: RootState) => state.paper.loading && !state.paper.success,
  );

  // 状态管理
  const [loading, setLoading] = useState(true);
  const [paperData, setPaperData] = useState<{
    id: any;
    name: any;
    subject: any;
    grade: any;
    questions: any[];
    userAnswers?: any[];
  } | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [editedAnswers, setEditedAnswers] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(
    isProcessing ? 'processing' : 'done',
  );

  // 获取试卷数据
  // 从Redux获取loading和success状态
  const {loading: reduxLoading, success: reduxSuccess} = useSelector(
    (state: RootState) => state.paper,
  );

  // 获取试卷数据的函数
  const fetchPaperData = useCallback(() => {
    setLoading(true);

    try {
      // 调用API获取试卷数据
      dispatch(getPaperInfo(paperId))
        .then(result => {
          if (result.data) {
            console.log('API返回的数据:', result.data);
            // 将API返回的数据转换为组件需要的格式
            const paperData = {
              id: result.data.id || paperId,
              name: result.data.name || paperName,
              subject: getSubjectNameById(result.data.subject) || '未知科目',
              grade: result.data.gradeName || '未知年级',
              questions: result.data.questionDetails || [],
              userAnswers: result.data.userAnswers || [],
            };

            // 将用户答案合并到题目中，如果userAnswers的sequence与题目sequence一致，则合并
            paperData.questions.forEach(question => {
              const userAnswer = paperData.userAnswers.find(
                ans => ans.sequence === question.sequence,
              );
              if (userAnswer) {
                question.userAnswers = userAnswer.content;
              }
            });

            console.log('转换后的数据:', paperData);
            setPaperData(paperData);
          } else {
            // 如果没有数据，使用模拟数据
            // ... existing mock data code remains the same
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('加载试卷数据失败:', err);
          setLoading(false);
          Alert.alert('错误', '加载试卷数据失败，请重试');

          // 加载失败时使用模拟数据
          // ... existing mock data code remains the same
        });
    } catch (err) {
      console.error('加载试卷数据失败:', err);
      setLoading(false);
      Alert.alert('错误', '加载试卷数据失败，请重试');
    }
  }, [dispatch, paperId, paperName]); // 依赖项包括dispatch, paperId和paperName

  useEffect(() => {
    // 如果正在处理中，设置轮询检查状态
    if (processingStatus === 'processing') {
      if (!reduxLoading && reduxSuccess) {
        setProcessingStatus('done');
        fetchPaperData();
      }
    } else {
      // 直接获取数据
      fetchPaperData();
    }
  }, [fetchPaperData, processingStatus, reduxLoading, reduxSuccess]);

  // 更新useEffect以包含fetchPaperData作为依赖项
  useEffect(() => {
    // 如果正在处理中，设置轮询检查状态
    if (processingStatus === 'processing') {
      if (!reduxLoading && reduxSuccess) {
        setProcessingStatus('done');
        fetchPaperData();
      }
    } else {
      // 直接获取数据
      fetchPaperData();
    }
  }, [processingStatus, reduxLoading, reduxSuccess, fetchPaperData]);

  // 处理返回按钮点击
  const handleGoBack = () => {
    // 如果正在处理中，提示用户
    if (processingStatus === 'processing') {
      Alert.alert(
        '正在处理中',
        '试卷正在后台处理，离开页面不会中断处理。您可以稍后再回来查看结果。',
        [
          {
            text: '取消',
            style: 'cancel',
          },
          {
            text: '确定离开',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  // 处理编辑答案
  const handleEditAnswer = questionId => {
    // 如果正在编辑其他题目，先保存
    handleSaveAnswer(editingQuestionId);
    // 设置正在编辑的题目ID
    setEditingQuestionId(questionId);
    // 初始化编辑值
    const question = paperData.questions.find(q => q.id === questionId);
    if (question) {
      setEditedAnswers({
        ...editedAnswers,
        [questionId]: editedAnswers[questionId] || question.userAnswers,
      });
    }
  };

  // 处理保存答案
  const handleSaveAnswer = questionId => {
    const question = paperData.questions.find(q => q.id === questionId);
    if (!question) {
      return;
    }

    // 更新本地状态
    const updatedQuestions = paperData.questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          userAnswers: editedAnswers[questionId],
        };
      }
      return q;
    });

    setPaperData({
      ...paperData,
      questions: updatedQuestions,
    });

    // 清除编辑状态
    setEditingQuestionId(null);

    // 这里应该有API调用来保存修改后的答案
    Alert.alert('成功', '答案已更新');
  };

  // 处理提交确认
  const handleSubmitConfirm = () => {
    // 检查是否有正在编辑的题目
    // 如果有，提示用户保存后再提交，或者直接提交
    if (editingQuestionId !== null) {
      Alert.alert(
        '编辑未完成',
        '您有正在编辑的答案尚未保存，请先保存后再提交。',
        [{text: '确定', style: 'cancel'}],
      );
      return;
    }

    Alert.alert(
      '确认提交',
      '提交后将不能再修改答案，确定要提交吗？',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: handleSubmitPaper,
        },
      ],
      {cancelable: false},
    );
  };

  // 处理提交试卷
  const handleSubmitPaper = () => {
    setIsSaving(true);

    // 准备要提交的答案数据
    const answers = paperData.questions.map(question => ({
      sequence: question.sequence,
      content: question.userAnswers,
    }));

    // 调用批量修改用户答案的接口
    dispatch(updateUserAnswers(paperData.id, answers))
      .then(result => {
        setIsSaving(false);

        // 显示成功提示
        Alert.alert('提交成功', '答案已成功提交', [
          {
            text: '查看结果',
            onPress: () => {
              // 导航到结果页面
              navigation.navigate('PaperResult', {
                paperId: paperData.id,
                paperName: paperData.name,
              });
            },
          },
        ]);
      })
      .catch(error => {
        setIsSaving(false);
        Alert.alert('提交失败', error.message || '提交答案时发生错误，请重试');
      });
  };

  // 渲染选择题
  const renderChoiceQuestion = (question, index) => {
    const isEditing = editingQuestionId === question.id;
    const currentAnswer = isEditing
      ? editedAnswers[question.id]
      : question.userAnswers;

    return (
      <View style={styles.questionCard} key={question.id}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>{index + 1}</Text>
          <Text style={styles.questionType}>选择题</Text>
          <View style={styles.questionActions}>
            {isEditing ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleSaveAnswer(question.id)}>
                <Icon name="save" size={20} color="#0284c7" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditAnswer(question.id)}>
                <Icon name="edit" size={20} color="#0284c7" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.questionContent}>{question.content}</Text>

        <View style={styles.optionsContainer}>
          {Object.entries(question.options).map(([key, value], optIndex) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.optionItem,
                currentAnswer === optIndex && styles.selectedOption,
              ]}
              onPress={() => {
                if (isEditing) {
                  setEditedAnswers({
                    ...editedAnswers,
                    [question.id]: optIndex,
                  });
                }
              }}
              disabled={!isEditing}>
              <Text style={styles.optionLabel}>
                {String.fromCharCode(65 + optIndex)}
              </Text>
              <Text style={styles.optionText}>{value}</Text>
              {currentAnswer === optIndex && (
                <View style={styles.checkIconContainer}>
                  <Icon name="check-circle" size={16} color="#0284c7" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {isEditing && (
          <Text style={styles.editingHint}>
            点击选项可修改答案，完成后点击保存按钮
          </Text>
        )}
      </View>
    );
  };

  // 渲染填空题
  const renderFillQuestion = (question, index) => {
    const isEditing = editingQuestionId === question.id;
    const currentAnswer = isEditing
      ? editedAnswers[question.id]
      : question.userAnswers;

    return (
      <View style={styles.questionCard} key={question.id}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>{index + 1}</Text>
          <Text style={styles.questionType}>填空题</Text>
          <View style={styles.questionActions}>
            {isEditing ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleSaveAnswer(question.id)}>
                <Icon name="save" size={20} color="#0284c7" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditAnswer(question.id)}>
                <Icon name="edit" size={20} color="#0284c7" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.questionContent}>{question.content}</Text>

        <View style={styles.answerContainer}>
          <Text style={styles.answerLabel}>识别结果：</Text>
          {isEditing ? (
            <TextInput
              style={styles.answerInput}
              value={String(currentAnswer)}
              onChangeText={text =>
                setEditedAnswers({...editedAnswers, [question.id]: text})
              }
              autoFocus
            />
          ) : (
            <Text style={styles.answerText}>{currentAnswer}</Text>
          )}
        </View>

        {isEditing && (
          <Text style={styles.editingHint}>输入正确答案后点击保存按钮</Text>
        )}
      </View>
    );
  };

  // 渲染简答题
  const renderEssayQuestion = (question, index) => {
    const isEditing = editingQuestionId === question.id;
    const currentAnswer = isEditing
      ? editedAnswers[question.id]
      : question.userAnswers;

    return (
      <View style={styles.questionCard} key={question.id}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>{index + 1}</Text>
          <Text style={styles.questionType}>简答题</Text>
          <View style={styles.questionActions}>
            {isEditing ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleSaveAnswer(question.id)}>
                <Icon name="save" size={20} color="#0284c7" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditAnswer(question.id)}>
                <Icon name="edit" size={20} color="#0284c7" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.questionContent}>{question.content}</Text>

        <View style={styles.essayAnswerContainer}>
          <Text style={styles.answerLabel}>识别结果：</Text>
          {isEditing ? (
            <TextInput
              style={styles.essayAnswerInput}
              value={String(currentAnswer)}
              onChangeText={text =>
                setEditedAnswers({...editedAnswers, [question.id]: text})
              }
              multiline
              numberOfLines={4}
              autoFocus
            />
          ) : (
            <Text style={styles.essayAnswerText}>{currentAnswer}</Text>
          )}
        </View>

        {isEditing && (
          <Text style={styles.editingHint}>修改答案内容后点击保存按钮</Text>
        )}
      </View>
    );
  };

  // 根据题目类型渲染不同的题目组件
  const renderQuestion = (question, index) => {
    switch (question.question_type) {
      case '选择题':
        return renderChoiceQuestion(question, index);
      case '填空题':
        return renderFillQuestion(question, index);
      case '简答题':
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
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Icon name="arrow-left" size={20} color="#4b5563" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {paperName || '试卷答案确认'}
            </Text>
            <View style={styles.headerRight} />
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text style={styles.loadingText}>
              {processingStatus === 'processing'
                ? '正在处理试卷，请稍候...'
                : '加载试卷中...'}
            </Text>
            {processingStatus === 'processing' && (
              <Text style={styles.processingHint}>
                处理可能需要一些时间，您可以离开此页面稍后再回来查看
              </Text>
            )}
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
            <Icon name="arrow-left" size={20} color="#4b5563" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {paperData?.name || '试卷答案确认'}
          </Text>
          <View style={styles.headerRight} />
        </View>

        {/* 提示信息 */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            请检查系统识别的答案是否正确，如有错误请点击编辑按钮进行修改
          </Text>
        </View>

        {/* 题目列表 */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}>
          {paperData?.questions.map((question, index) =>
            renderQuestion(question, index),
          )}

          {/* 底部间距 */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* 底部工具栏 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              editingQuestionId !== null && styles.disabledButton,
            ]}
            onPress={handleSubmitConfirm}
            disabled={isSaving}>
            <Text style={styles.submitButtonText}>
              {isSaving ? '提交中...' : '确认并提交'}
            </Text>
          </TouchableOpacity>
        </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075985',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  infoText: {
    fontSize: 14,
    color: '#0284c7',
    textAlign: 'center',
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
  answerInput: {
    flex: 1,
    fontSize: 14,
    color: '#0c4a6e',
    padding: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#0284c7',
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
  bottomSpacer: {
    height: 80,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  submitButton: {
    backgroundColor: '#0284c7',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
});

export default PaperReviewScreen;
